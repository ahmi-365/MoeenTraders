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
interface SupplierPaymentEntry {
  trx: string;
  supplierName: string;
  amount: string;
  type: string;
  by: string;
  time: string;
  actionableId: number;
  remark: string;
  purchaseId?: number;
  purchaseReturnId?: number;
  actionableCreatedAt: string;
  actionableUpdatedAt: string;
  supplierId?: number;
  supplierEmail: string;
  supplierMobile: string;
  supplierAddress: string;
  supplierCompanyName: string;
  supplierOpeningBalance: string;
  supplierRecordCreatedAt: string;
  supplierRecordUpdatedAt: string;
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
  entry: SupplierPaymentEntry | null;
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
            <Text style={styles.modalTitle}>Payment Details: {entry.trx}</Text>

            <Text style={styles.modalSectionTitle}>Transaction Info</Text>
            <DetailRow label="Transaction #:" value={entry.trx} />
            <DetailRow label="Amount:" value={entry.amount} />
            <DetailRow label="Remark:" value={entry.remark} />
            <DetailRow label="Purchase Ref ID:" value={entry.purchaseId} />
            <DetailRow
              label="Purchase Return Ref ID:"
              value={entry.purchaseReturnId}
            />

            <View style={styles.modalSeparator} />

            <Text style={styles.modalSectionTitle}>Supplier Info</Text>
            <DetailRow label="Supplier ID:" value={entry.supplierId} />
            <DetailRow label="Name:" value={entry.supplierName} />
            <DetailRow label="Company:" value={entry.supplierCompanyName} />
            <DetailRow label="Mobile:" value={entry.supplierMobile} />
            <DetailRow label="Email:" value={entry.supplierEmail} />
            <DetailRow label="Address:" value={entry.supplierAddress} />
            <DetailRow
              label="Opening Balance:"
              value={entry.supplierOpeningBalance}
            />

            <View style={styles.modalSeparator} />

            <Text style={styles.modalSectionTitle}>Log Info</Text>
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
export default function SupplierPaymentEntryReportScreen() {
  const [entries, setEntries] = useState<SupplierPaymentEntry[]>([]);
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
  const [selectedEntry, setSelectedEntry] =
    useState<SupplierPaymentEntry | null>(null);

  // --- Data Transformation & Fetching ---

  const formatDateOrNA = (dateString?: string): string => {
    if (!dateString) return "N/A";
    try {
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

  const formatCurrency = (
    value: any,
    defaultValue: string = "0.00"
  ): string => {
    if (value === null || value === undefined) return defaultValue;
    const num = Number(value);
    return isNaN(num)
      ? defaultValue
      : num.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  };

  const transformApiData = (apiItem: any): SupplierPaymentEntry => {
    
    const actionableData = apiItem.actionable || {};
    const supplierData = actionableData.supplier || {};
    const adminData = apiItem.admin || {};
    const transformed = {
      trx: actionableData.trx?.toString() ?? "N/A",
      supplierName: supplierData.name?.toString() ?? "N/A",
      amount: formatCurrency(actionableData.amount),
      type: apiItem.action_name ?? "N/A",
      by: adminData.username ?? "N/A",
      time: formatDateOrNA(apiItem.created_at),
      actionableId: actionableData.id ?? 0,
      remark: actionableData.remark?.toString() ?? "",
      purchaseId: actionableData.purchase_id,
      purchaseReturnId: actionableData.purchase_return_id,
      actionableCreatedAt: formatDateOrNA(actionableData.created_at),
      actionableUpdatedAt: formatDateOrNA(actionableData.updated_at),
      supplierId: supplierData.id ?? actionableData.supplier_id,
      supplierEmail: supplierData.email?.toString() ?? "N/A",
      supplierMobile: supplierData.mobile?.toString() ?? "N/A",
      supplierAddress: supplierData.address?.toString() ?? "N/A",
      supplierCompanyName: supplierData.company_name?.toString() ?? "N/A",
      supplierOpeningBalance: formatCurrency(supplierData.opening_balance),
      supplierRecordCreatedAt: formatDateOrNA(supplierData.created_at),
      supplierRecordUpdatedAt: formatDateOrNA(supplierData.updated_at),
    };
    return transformed;
  };

const SUPPLIER_CACHE_KEY = "supplier_payment_entries";

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
    // FIXED: Use the correct endpoint that matches the Dart code
    let apiUrl = `https://dewan-chemicals.majesticsofts.com/api/reports/data-entry/supplier-payment?page=${page}`;
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

        // Save to cache
        const toStore = {
          entries: isInitialLoad ? fetchedData : [...entries, ...fetchedData],
          currentPage: response.data.current_page || 1,
          totalPages: response.data.total_pages || 1,
        };
        await AsyncStorage.setItem(SUPPLIER_CACHE_KEY, JSON.stringify(toStore));
      } else {
        // ---- OFFLINE MODE ----
        const cached = await AsyncStorage.getItem(SUPPLIER_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setEntries(parsed.entries || []);
          setCurrentPage(parsed.currentPage || 1);
          setTotalPages(parsed.totalPages || 1);
        } else {
          setError("No internet and no cached data available.");
        }
      }
    } catch (err: any) {
      console.error('API Error:', err);
      setError(
        axios.isAxiosError(err) ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoadingFirstTime(false);
      setIsFetchingMore(false);
    }
  },
  [startDate, endDate, isFetchingMore, entries]
);

  useEffect(() => {
    fetchEntries(1, true);
  }, [startDate, endDate]);

  const handleRefresh = () => fetchEntries(1, true);
  const handleLoadMore = () => {
    if (currentPage < totalPages && !isFetchingMore)
      fetchEntries(currentPage + 1);
  };
  const handleRowPress = (item: SupplierPaymentEntry) => {
    setSelectedEntry(item);
    setModalVisible(true);
  };
  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  // --- Column Definition ---
  const columns: Column<SupplierPaymentEntry>[] = [
    {
      key: "trx",
      title: "TRX No.",
      flex: 1.2,
      render: (item) => <Text style={styles.trxText}>{item.trx}</Text>,
    },
    { key: "supplierName", title: "Supplier", flex: 1.5 },
    {
      key: "amount",
      title: "Amount",
      flex: 1,
      render: (item) => <Text style={styles.amountText}>{item.amount}</Text>,
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
          <Text style={styles.appBarTitle}>Supplier Payment Report</Text>
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF8F3C" />
          <Text style={styles.loadingText}>Loading payments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && entries.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.appBar}>
          <Text style={styles.appBarTitle}>Supplier Payment Report</Text>
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
        <Text style={styles.appBarTitle}>Supplier Payment Report</Text>
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
          <ReusableTable<SupplierPaymentEntry>
            data={entries}
            columns={columns}
            onRowPress={handleRowPress}
            showIndex={true}
            dateFilter={{
              enabled: true,
              startDate,
              endDate,
              onDateRangeChange: handleDateRangeChange,
              placeholder: "Filter by payment log date",
            }}
            emptyStateConfig={{
              emptyTitle: "No Payments Found",
              emptyMessage:
                "No supplier payment logs match the selected criteria.",
              emptyIcon: "💸",
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
  trxText: { color: "#0D47A1", fontWeight: "600", fontSize: 13 },
  amountText: { fontWeight: "500" },
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