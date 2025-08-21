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
// Assuming ReusableTable is in a components folder
import ReusableTable, { Column } from "@/components/Table/ReusableTable";

// --- 1. Type Definition ---
interface ProductEntry {
  productName: string;
  sku: string;
  type: string;
  by: string;
  time: string;
  categoryId?: number;
  brandId?: number;
  unitId?: number;
  alertQuantity?: number;
  note: string;
  totalSale?: number;
}

// --- 2. Helper Components (Modal) ---

// Helper for displaying a row of details in the modal
const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => {
  if (value === null || value === undefined || value === "") return null;
  return (
    <View style={styles.modalDetailRow}>
      <Text style={styles.modalDetailLabel}>{label}</Text>
      <Text style={styles.modalDetailValue}>{value}</Text>
    </View>
  );
};

// Details Modal Component (Unchanged from previous version)
const DetailsModal = ({
  visible,
  onClose,
  entry,
}: {
  visible: boolean;
  onClose: () => void;
  entry: ProductEntry | null;
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
            <Text style={styles.modalTitle}>Details: {entry.productName}</Text>

            <DetailRow label="SKU:" value={entry.sku} />
            <DetailRow label="Action Type:" value={entry.type} />
            <DetailRow label="By:" value={entry.by} />
            <DetailRow label="Time:" value={entry.time} />

            {(entry.categoryId ||
              entry.brandId ||
              entry.unitId ||
              entry.alertQuantity) && <View style={styles.modalSeparator} />}

            <DetailRow label="Category ID:" value={entry.categoryId} />
            <DetailRow label="Brand ID:" value={entry.brandId} />
            <DetailRow label="Unit ID:" value={entry.unitId} />
            <DetailRow label="Alert Qty:" value={entry.alertQuantity} />
            <DetailRow label="Total Sale:" value={entry.totalSale} />

            {entry.note ? (
              <>
                <View style={styles.modalSeparator} />
                <DetailRow label="Note:" value={entry.note} />
              </>
            ) : null}
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
export default function ProductEntryReportScreen() {
  const [entries, setEntries] = useState<ProductEntry[]>([]);
  const [isLoadingFirstTime, setIsLoadingFirstTime] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Date Filter State
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ProductEntry | null>(null);

  // --- Helper & Fetching Logic (Mostly Unchanged) ---

  const formatApiDate = (date: Date) => date.toISOString().split("T")[0]; // YYYY-MM-DD

  const formatDisplayDateTime = (dateString?: string) => {
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

  const transformApiData = (apiItem: any): ProductEntry => {
    const actionableData = apiItem.actionable || {};
    const adminData = apiItem.admin || {};

    return {
      productName: actionableData.name?.toString() ?? "N/A",
      sku: actionableData.sku?.toString() ?? "N/A",
      type: apiItem.action_name ?? "N/A",
      by: adminData.username ?? adminData.name ?? "N/A",
      time: formatDisplayDateTime(apiItem.created_at),
      categoryId: actionableData.category_id,
      brandId: actionableData.brand_id,
      unitId: actionableData.unit_id,
      alertQuantity: actionableData.alert_quantity,
      note: actionableData.note?.toString() ?? "",
      totalSale: actionableData.total_sale,
    };
  };

  const fetchEntries = useCallback(
    async (page: number, isInitialLoad: boolean = false) => {
      // Logic remains the same as before...
      if (isFetchingMore && !isInitialLoad) return;

      if (isInitialLoad) {
        setIsLoadingFirstTime(true);
        setError(null);
      } else {
        setIsFetchingMore(true);
      }

      let apiUrl = `https://dewan-chemicals.majesticsofts.com/api/reports/data-entry/product?page=${page}`;
      if (startDate && endDate) {
        apiUrl += `&start_date=${formatApiDate(startDate)}`;
        apiUrl += `&end_date=${formatApiDate(endDate)}`;
      }

      try {
        const response = await axios.get(apiUrl, {
          headers: { Accept: "application/json" },
        });
        const fetchedData = response.data.data.map(transformApiData);
        setEntries((prev) =>
          isInitialLoad ? fetchedData : [...prev, ...fetchedData]
        );
        setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.total_pages || 1);
      } catch (err: any) {
        setError(axios.isAxiosError(err) ? err.message : "An error occurred.");
      } finally {
        setIsLoadingFirstTime(false);
        setIsFetchingMore(false);
      }
    },
    [startDate, endDate, isFetchingMore]
  );

  useEffect(() => {
    fetchEntries(1, true);
  }, [startDate, endDate]);

  const handleRefresh = () => {
    fetchEntries(1, true);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isFetchingMore) {
      fetchEntries(currentPage + 1);
    }
  };

  const handleRowPress = (item: ProductEntry) => {
    setSelectedEntry(item);
    setModalVisible(true);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  // --- Column Definition for ReusableTable ---
  const columns: Column<ProductEntry>[] = [
    {
      key: "productName",
      title: "Product Name",
      flex: 1.5,
      render: (item) => (
        <Text style={styles.productNameText}>{item.productName}</Text>
      ),
    },
    {
      key: "sku",
      title: "SKU",
      flex: 1,
    },
    {
      key: "type",
      title: "Type",
      flex: 1,
    },
    {
      key: "by",
      title: "By",
      flex: 1,
    },
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
          <Text style={styles.appBarTitle}>Products Entry Report</Text>
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF8F3C" />
          <Text style={styles.loadingText}>Loading entries...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && entries.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.appBar}>
          <Text style={styles.appBarTitle}>Products Entry Report</Text>
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
        <Text style={styles.appBarTitle}>Products Entry Report</Text>
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
          <ReusableTable<ProductEntry>
            data={entries}
            columns={columns}
            onRowPress={handleRowPress}
            showIndex={true}
            dateFilter={{
              enabled: true,
              startDate,
              endDate,
              onDateRangeChange: handleDateRangeChange,
              placeholder: "Filter by entry date",
            }}
            emptyStateConfig={{
              emptyTitle: "No Product Entries Found",
              emptyMessage:
                "There are no product records for the selected criteria.",
              emptyIcon: "📦",
            }}
          />

          {/* Load More Button */}
          {canLoadMore && !isFetchingMore && entries.length > 0 && (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={handleLoadMore}
            >
              <Text style={styles.loadMoreButtonText}>Load More</Text>
            </TouchableOpacity>
          )}

          {/* Loading Indicator for pagination */}
          {isFetchingMore && (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#ffffffff" />
            </View>
          )}

          {/* End of list indicator */}
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

// --- 4. Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  appBar: {
    backgroundColor: "#FF8F3C",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appBarTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContainer: {
    flex: 1,
  },
  tableWrapper: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
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
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  // Custom cell styles for render prop
  productNameText: {
    color: "#0D47A1",
    fontWeight: "600",
    fontSize: 13,
  },
  timeText: {
    fontSize: 12,
    color: "#333",
  },
  // Pagination styles
  loadMoreButton: {
    backgroundColor: "#FF8F3C",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  loadMoreButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  endOfListContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  endOfListText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
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
    flex: 1,
  },
  modalDetailValue: {
    fontSize: 15,
    color: "#111",
    flex: 1.5,
    textAlign: "right",
  },
  modalSeparator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
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
