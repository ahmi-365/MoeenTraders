import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import ReusableTable, { Column } from "../../components/Table/ReusableTable";

// --- 1. Type Definition ---
interface TransferEntry {
  trackingNo: string;
  type: string;
  by: string;
  time: string;
  transferDate: string;
  fromWarehouseId?: number;
  fromWarehouseName: string;
  fromWarehouseAddress: string;
  toWarehouseId?: number;
  toWarehouseName: string;
  toWarehouseAddress: string;
  note: string;
  actionableCreatedAt: string;
  actionableUpdatedAt: string;
}

// --- 2. Helper Components (Modal) ---

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "N/A"
  ) {
    return null;
  }
  return (
    <View style={styles.modalDetailRow}>
      <Text style={styles.modalDetailLabel}>{label}</Text>
      <Text style={styles.modalDetailValue}>{value}</Text>
    </View>
  );
};

const DetailsModal = ({
  visible,
  onClose,
  entry,
}: {
  visible: boolean;
  onClose: () => void;
  entry: TransferEntry | null;
}) => {
  if (!entry) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>Details: {entry.trackingNo}</Text>

            <DetailRow label="Transfer Date:" value={entry.transferDate} />
            <View style={styles.modalSeparator} />

            <Text style={styles.modalSectionTitle}>From Warehouse</Text>
            <DetailRow label="ID:" value={entry.fromWarehouseId} />
            <DetailRow label="Name:" value={entry.fromWarehouseName} />
            <DetailRow label="Address:" value={entry.fromWarehouseAddress} />

            <View style={styles.modalSeparator} />

            <Text style={styles.modalSectionTitle}>To Warehouse</Text>
            <DetailRow label="ID:" value={entry.toWarehouseId} />
            <DetailRow label="Name:" value={entry.toWarehouseName} />
            <DetailRow label="Address:" value={entry.toWarehouseAddress} />

            <DetailRow label="Note:" value={entry.note} />
            <View style={styles.modalSeparator} />

            <Text style={styles.modalSectionTitle}>Timestamps & Log</Text>
            <DetailRow
              label="Record Created:"
              value={entry.actionableCreatedAt}
            />
            <DetailRow
              label="Record Updated:"
              value={entry.actionableUpdatedAt}
            />
            <DetailRow label="Log Action:" value={entry.type} />
            <DetailRow label="Log By:" value={entry.by} />
            <DetailRow label="Log Time:" value={entry.time} />
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// --- 3. Main Screen Component ---
export default function TransfersEntryReportScreen() {
  const [entries, setEntries] = useState<TransferEntry[]>([]);
  const [isLoadingFirstTime, setIsLoadingFirstTime] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TransferEntry | null>(
    null
  );

  // --- Data Transformation & Fetching ---

  const formatDateOrNA = (
    dateString?: string,
    format: "datetime" | "date" = "datetime"
  ): string => {
    if (!dateString) return "N/A";
    try {
      if (format === "date" && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(
          "en-CA"
        );
      }
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  const transformApiData = (apiItem: any): TransferEntry => {
    const actionableData = apiItem.actionable || {};
    const fromWarehouseData = actionableData.warehouse || {};
    const toWarehouseData = actionableData.to_warehouse || {};
    const adminData = apiItem.admin || {};

    return {
      trackingNo: actionableData.tracking_no?.toString() ?? "N/A",
      type: apiItem.action_name ?? "N/A",
      by: adminData.username ?? "N/A",
      time: formatDateOrNA(apiItem.created_at, "datetime"),
      transferDate: formatDateOrNA(actionableData.transfer_date, "date"),
      fromWarehouseId: actionableData.from_warehouse_id,
      fromWarehouseName: fromWarehouseData.name?.toString() ?? "N/A",
      fromWarehouseAddress: fromWarehouseData.address?.toString() ?? "N/A",
      toWarehouseId: actionableData.to_warehouse_id,
      toWarehouseName: toWarehouseData.name?.toString() ?? "N/A",
      toWarehouseAddress: toWarehouseData.address?.toString() ?? "N/A",
      note: actionableData.note?.toString() ?? "",
      actionableCreatedAt: formatDateOrNA(
        actionableData.created_at,
        "datetime"
      ),
      actionableUpdatedAt: formatDateOrNA(
        actionableData.updated_at,
        "datetime"
      ),
    };
  };


const TRANSFER_CACHE_KEY = "transfer_entries";

const fetchEntries = useCallback(
  async (page: number, isInitialLoad: boolean = false) => {
    if (isFetchingMore && !isInitialLoad) return;

    if (isInitialLoad) {
      setIsLoadingFirstTime(true);
      setError(null);
    } else {
      setIsFetchingMore(true);
    }

    const formatApiDate = (date: Date) => date.toISOString().split("T")[0];
    let apiUrl = `https://dewan-chemicals.majesticsofts.com/api/reports/data-entry/transfer?page=${page}`;
    if (startDate && endDate) {
      apiUrl += `&start_date=${formatApiDate(startDate)}&end_date=${formatApiDate(endDate)}`;
    }

    try {
      // Check internet status
      const netInfo = await NetInfo.fetch();
      const hasInternet = netInfo.isConnected && netInfo.isInternetReachable;

      if (hasInternet) {
        // ---- ONLINE MODE ----
        const response = await axios.get(apiUrl, {
          headers: { Accept: "application/json" },
        });

        const fetchedData = response.data.data.map(transformApiData);

        setEntries((prev) =>
          isInitialLoad ? fetchedData : [...prev, ...fetchedData]
        );
        setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.total_pages || 1);

        // Save to AsyncStorage for offline use
        const toStore = {
          entries: isInitialLoad ? fetchedData : [...entries, ...fetchedData],
          currentPage: response.data.current_page || 1,
          totalPages: response.data.total_pages || 1,
        };
        await AsyncStorage.setItem(TRANSFER_CACHE_KEY, JSON.stringify(toStore));
      } else {
        // ---- OFFLINE MODE ----
        console.log("No internet, loading cached transfer data...");
        const cached = await AsyncStorage.getItem(TRANSFER_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setEntries(parsed.entries || []);
          setCurrentPage(parsed.currentPage || 1);
          setTotalPages(parsed.totalPages || 1);
        } else {
          setError("No internet available.");
        }
      }
    } catch (err: any) {
      setError(
        axios.isAxiosError(err) ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoadingFirstTime(false);
      setIsFetchingMore(false);
    }
  },
  [startDate, endDate, isFetchingMore, entries] // include entries in deps for cache update
);


  useEffect(() => {
    fetchEntries(1, true);
  }, [startDate, endDate]);

  const handleRefresh = () => fetchEntries(1, true);
  const handleLoadMore = () => {
    if (currentPage < totalPages && !isFetchingMore)
      fetchEntries(currentPage + 1);
  };
  const handleRowPress = (item: TransferEntry) => {
    setSelectedEntry(item);
    setModalVisible(true);
  };
  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  // --- Column Definition ---
  const columns: Column<TransferEntry>[] = [
    {
      key: "trackingNo",
      title: "Tracking No.",
      flex: 1.5,
      render: (item) => (
        <Text style={styles.trackingNoText}>{item.trackingNo}</Text>
      ),
    },
    { key: "type", title: "Type", flex: 1 },
    { key: "by", title: "By", flex: 1 },
    {
      key: "time",
      title: "Time",
      flex: 1.5,
      render: (item) => <Text style={styles.timeText}>{item.time}</Text>,
    },
  ];

  // --- Render Logic ---
  if (isLoadingFirstTime && entries.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.appBar}>
          <Text style={styles.appBarTitle}>Transfer Entry Report</Text>
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF8F3C" />
          <Text style={styles.loadingText}>Loading transfers...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && entries.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.appBar}>
          <Text style={styles.appBarTitle}>Transfer Entry Report</Text>
        </View>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const canLoadMore = currentPage < totalPages;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Transfer Entry Report</Text>
      </View>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingFirstTime && entries.length > 0}
            onRefresh={handleRefresh}
            colors={["#FF8F3C"]}
          />
        }
      >
        <View style={styles.tableWrapper}>
          <ReusableTable<TransferEntry>
            data={entries}
            columns={columns}
            onRowPress={handleRowPress}
            showIndex={true}
            dateFilter={{
              enabled: true,
              startDate,
              endDate,
              onDateRangeChange: handleDateRangeChange,
              placeholder: "Filter by log date",
            }}
            emptyStateConfig={{
              emptyTitle: "No Transfers Found",
              emptyMessage: "No transfer logs match the selected criteria.",
              emptyIcon: "🚚",
            }}
          />
          {canLoadMore && !isFetchingMore && entries.length > 0 && (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={handleLoadMore}
            >
              <Text style={styles.loadMoreButtonText}>Load More</Text>
            </TouchableOpacity>
          )}
          {isFetchingMore && (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#ffffffff" />
            </View>
          )}
          {!canLoadMore && entries.length > 0 && (
            <View style={styles.endOfListContainer}>
              <Text style={styles.endOfListText}>— End of List —</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <DetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        entry={selectedEntry}
      />
    </SafeAreaView>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8" },
  appBar: {
    backgroundColor: "#FF8F3C",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  appBarTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  scrollContainer: { flex: 1 },
  tableWrapper: { padding: 16 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: { marginTop: 12, fontSize: 16, color: "#555" },
  errorText: {
    color: "#D32F2F",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#FF8F3C",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  trackingNoText: { color: "#0D47A1", fontWeight: "600", fontSize: 13 },
  timeText: { fontSize: 12, color: "#333" },
  loadMoreButton: {
    backgroundColor: "#FF8F3C",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  loadMoreButtonText: { color: "white", fontSize: 15, fontWeight: "600" },
  footerLoader: { paddingVertical: 20, alignItems: "center" },
  endOfListContainer: { paddingVertical: 20, alignItems: "center" },
  endOfListText: { fontSize: 14, color: "#999", fontStyle: "italic" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF8F3C",
    marginTop: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  modalDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    alignItems: "flex-start",
  },
  modalDetailLabel: {
    fontSize: 15,
    color: "#555",
    fontWeight: "600",
    flex: 1.2,
  },
  modalDetailValue: {
    fontSize: 15,
    color: "#111",
    flex: 1.5,
    textAlign: "right",
  },
  modalSeparator: { height: 1, backgroundColor: "#e0e0e0", marginVertical: 10 },
  closeButton: {
    backgroundColor: "#FF8F3C",
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
