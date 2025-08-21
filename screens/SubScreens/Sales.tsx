import axios from "axios";
import React, { useEffect, useState } from "react";
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
import ReusableTable, { Column } from "../../components/Table/ReusableTable";

// --- 1. Type Definition ---
interface SalesEntry {
  invoiceNo: string;
  type: string;
  by: string;
  time: string;
  saleDate: string;
  totalPrice: string;
  discountAmount: string;
  receivableAmount: string;
  receivedAmount: string;
  dueAmount: string;
  paymentMethod: string;
  receivedAmountBank: string;
  receivedAmountCash: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  fare: string;
  note: string;
  customerId?: number;
}

// --- 2. Helper Components ---

// Helper for displaying a row of details in the modal
const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <View style={styles.modalDetailRow}>
    <Text style={styles.modalDetailLabel}>{label}</Text>
    <Text style={styles.modalDetailValue}>{value || "N/A"}</Text>
  </View>
);

// Details Modal Component
const DetailsModal = ({
  visible,
  onClose,
  entry,
}: {
  visible: boolean;
  onClose: () => void;
  entry: SalesEntry | null;
}) => {
  if (!entry) return null;

  const showBankAmount = entry.paymentMethod.toLowerCase() === "bank";
  const showCashAmount = entry.paymentMethod.toLowerCase() === "cash";
  const showBothAmounts = !showBankAmount && !showCashAmount;

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
            <Text style={styles.modalTitle}>
              Sales Details (Inv: {entry.invoiceNo})
            </Text>

            <DetailRow label="Sale Date:" value={entry.saleDate} />
            {entry.customerId && (
              <DetailRow label="Customer ID:" value={entry.customerId} />
            )}
            <DetailRow label="Total Price:" value={entry.totalPrice} />
            <DetailRow label="Discount:" value={entry.discountAmount} />
            <DetailRow label="Receivable:" value={entry.receivableAmount} />
            <DetailRow label="Received:" value={entry.receivedAmount} />
            <DetailRow label="Due Amount:" value={entry.dueAmount} />

            <View style={styles.modalSeparator} />

            <Text style={styles.modalSectionTitle}>Payment Information</Text>
            <DetailRow label="Payment Method:" value={entry.paymentMethod} />
            {showBankAmount && (
              <DetailRow
                label="Received (Bank):"
                value={entry.receivedAmountBank}
              />
            )}
            {showCashAmount && (
              <DetailRow
                label="Received (Cash):"
                value={entry.receivedAmountCash}
              />
            )}
            {showBothAmounts && (
              <>
                <DetailRow
                  label="Received (Bank):"
                  value={entry.receivedAmountBank}
                />
                <DetailRow
                  label="Received (Cash):"
                  value={entry.receivedAmountCash}
                />
              </>
            )}

            <View style={styles.modalSeparator} />

            <Text style={styles.modalSectionTitle}>Transportation Info</Text>
            <DetailRow label="Vehicle Number:" value={entry.vehicleNumber} />
            <DetailRow label="Driver Name:" value={entry.driverName} />
            <DetailRow label="Driver Contact:" value={entry.driverContact} />
            <DetailRow label="Fare:" value={entry.fare} />

            {entry.note ? (
              <>
                <View style={styles.modalSeparator} />
                <DetailRow label="Note:" value={entry.note} />
              </>
            ) : null}

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
export default function SalesEntryReportScreen() {
  const [entries, setEntries] = useState<SalesEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
  const [selectedEntry, setSelectedEntry] = useState<SalesEntry | null>(null);

  // Formatting helper functions
  const formatApiDate = (date: Date) => date.toISOString().split("T")[0];

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

  const formatDisplayDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      // Add a time to avoid timezone issues with YYYY-MM-DD format
      return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-CA"); // YYYY-MM-DD
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value: any, defaultValue: string = "0.00") => {
    if (value == null) return defaultValue;
    const num = Number(value);
    if (isNaN(num)) return value.toString();
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Transform API data to SalesEntry format
  const transformApiData = (data: any[]): SalesEntry[] => {
    return data.map((item: any) => {
      const actionableData = item.actionable || {};

      return {
        invoiceNo: actionableData.invoice_no?.toString() ?? "N/A",
        type: item.action_name ?? "N/A",
        by: item.admin?.username ?? "N/A",
        time: formatDisplayDateTime(item.created_at),
        saleDate: formatDisplayDate(actionableData.sale_date),
        totalPrice: formatCurrency(actionableData.total_price),
        discountAmount: formatCurrency(actionableData.discount_amount),
        receivableAmount: formatCurrency(actionableData.receivable_amount),
        receivedAmount: formatCurrency(actionableData.received_amount),
        dueAmount: formatCurrency(actionableData.due_amount),
        paymentMethod: actionableData.payment_method?.toString() ?? "N/A",
        receivedAmountBank: formatCurrency(
          actionableData.received_amount_bank,
          "0.00"
        ),
        receivedAmountCash: formatCurrency(
          actionableData.received_amount_cash,
          "0.00"
        ),
        vehicleNumber: actionableData.vehicle_number?.toString() ?? "N/A",
        driverName: actionableData.driver_name?.toString() ?? "N/A",
        driverContact: actionableData.driver_contact?.toString() ?? "N/A",
        fare: formatCurrency(actionableData.fare, "0.00"),
        note: actionableData.note?.toString() ?? "",
        customerId: actionableData.customer_id,
      };
    });
  };

  const fetchEntries = async (page: number, isInitialLoad: boolean = false) => {
    try {
      // Prevent multiple simultaneous requests
      if (isFetchingMore && !isInitialLoad) {
        console.log("Already fetching, skipping request");
        return;
      }

      if (isInitialLoad) {
        setIsLoading(true);
        setError(null);
        console.log("Initial load - resetting state");
      } else {
        setIsFetchingMore(true);
        console.log(`Loading more entries for page ${page}`);
      }

      let apiUrl = `https://dewan-chemicals.majesticsofts.com/api/reports/data-entry/sale?page=${page}`;
      if (startDate && endDate) {
        apiUrl += `&start_date=${formatApiDate(startDate)}`;
        apiUrl += `&end_date=${formatApiDate(endDate)}`;
      }

      console.log("Fetching Sales Entries:", { apiUrl, page, isInitialLoad });

      const response = await axios.get(apiUrl, {
        headers: { Accept: "application/json" },
        timeout: 10000, // 10 second timeout
      });

      console.log("API Response:", {
        currentPage: response.data?.current_page,
        totalPages: response.data?.total_pages,
        dataLength: response.data?.data?.length,
        isInitialLoad,
      });

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        const fetchedData = transformApiData(response.data.data);

        if (isInitialLoad) {
          console.log("Setting initial entries:", fetchedData.length);
          setEntries(fetchedData);
          setCurrentPage(response.data.current_page || 1);
        } else {
          console.log("Appending entries:", fetchedData.length);
          setEntries((prevEntries) => {
            const newEntries = [...prevEntries, ...fetchedData];
            console.log("Total entries after append:", newEntries.length);
            return newEntries;
          });
          setCurrentPage(response.data.current_page || page);
        }

        setTotalPages(response.data.total_pages || 1);
      } else {
        console.error("Invalid response structure:", response.data);
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      const errorMessage = axios.isAxiosError(err)
        ? `Network error: ${err.message}`
        : "Failed to load data. Please try again.";

      if (isInitialLoad) {
        setError(errorMessage);
      } else {
        // For load more errors, show a toast or alert instead of clearing all data
        console.error("Load more failed:", errorMessage);
      }
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Initial load and date filter changes
  useEffect(() => {
    console.log("Date filter changed, fetching initial data");
    fetchEntries(1, true);
  }, [startDate, endDate]);

  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    fetchEntries(1, true);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    console.log("Load more requested:", {
      currentPage,
      nextPage,
      totalPages,
      isFetchingMore,
      isLoading,
      currentEntriesCount: entries.length,
    });

    if (nextPage <= totalPages && !isFetchingMore && !isLoading) {
      fetchEntries(nextPage, false);
    } else {
      console.log("Load more conditions not met:", {
        canLoadMore: nextPage <= totalPages,
        notFetching: !isFetchingMore,
        notLoading: !isLoading,
      });
    }
  };

  const handleRowPress = (item: SalesEntry) => {
    setSelectedEntry(item);
    setModalVisible(true);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    console.log("Date range changed:", { start, end });
    setStartDate(start);
    setEndDate(end);
  };

  // Define table columns
  const columns: Column<SalesEntry>[] = [
    {
      key: "invoiceNo",
      title: "Invoice No.",
      flex: 1.2,
      render: (item) => (
        <Text style={styles.invoiceText}>{item.invoiceNo}</Text>
      ),
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
      render: (item) => (
        <Text style={styles.timeText} numberOfLines={2}>
          {item.time}
        </Text>
      ),
    },
  ];

  if (isLoading && entries.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.appBar}>
          <Text style={styles.appBarTitle}>Sales Entry Report</Text>
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF8F3C" />
          <Text style={styles.loadingText}>Loading sales entries...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && entries.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.appBar}>
          <Text style={styles.appBarTitle}>Sales Entry Report</Text>
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
        <Text style={styles.appBarTitle}>Sales Entry Report</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && entries.length > 0}
            onRefresh={handleRefresh}
            colors={["#FF8F3C"]}
          />
        }
      >
        <View style={styles.tableWrapper}>
          <ReusableTable<SalesEntry>
            data={entries}
            columns={columns}
            onRowPress={handleRowPress}
            showIndex={true}
            dateFilter={{
              enabled: true,
              startDate,
              endDate,
              onDateRangeChange: handleDateRangeChange,
              placeholder: "Filter by date range",
            }}
            emptyStateConfig={{
              emptyTitle: "No Sales Entries Found",
              emptyMessage:
                "There are no sales entry records to display for the selected criteria.",
              emptyIcon: "📋",
            }}
            containerStyle={styles.tableContainer}
          />

          {/* Load More Button */}
          {canLoadMore && !isFetchingMore && entries.length > 0 && (
            <View style={styles.loadMoreButtonContainer}>
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={handleLoadMore}
                activeOpacity={0.7}
              >
                <Text style={styles.loadMoreButtonText}>
                  Load More (Page {currentPage + 1} of {totalPages})
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Loading Indicator */}
          {isFetchingMore && (
            <View style={styles.loadMoreContainer}>
              <ActivityIndicator size="small" color="#ffffffff" />
              <Text style={styles.loadMoreText}>Loading more entries...</Text>
            </View>
          )}

          {/* End of list indicator */}
          {!canLoadMore && entries.length > 0 && (
            <View style={styles.endOfListContainer}>
              <Text style={styles.endOfListText}>
                — All {entries.length} entries loaded —
              </Text>
            </View>
          )}

          {/* Pagination Info */}
          {entries.length > 0 && (
            <View style={styles.paginationInfo}>
              <Text style={styles.paginationText}>
                Page {currentPage} of {totalPages} • {entries.length} entries
                loaded
                {canLoadMore && ' • Tap "Load More" to continue'}
              </Text>
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
    backgroundColor: "#f5f7fa",
  },
  appBar: {
    backgroundColor: "#FF8F3C",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
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
  tableContainer: {
    marginBottom: 0,
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
    color: "#666",
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

  // Custom cell styles
  invoiceText: {
    color: "#0D47A1",
    fontWeight: "600",
    fontSize: 13,
  },
  timeText: {
    fontSize: 12,
    color: "#333",
    lineHeight: 14,
  },

  // Load more button styles
  loadMoreButtonContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  loadMoreButton: {
    backgroundColor: "#FF8F3C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    minWidth: 200,
  },
  loadMoreButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  // Load more styles
  loadMoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  loadMoreText: {
    fontSize: 14,
    color: "#666",
  },

  // Pagination info styles
  paginationInfo: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  paginationText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },

  // End of list styles
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
    maxHeight: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
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
  },
  modalDetailLabel: {
    fontSize: 15,
    color: "#555",
    fontWeight: "500",
    flex: 1.2,
  },
  modalDetailValue: {
    fontSize: 15,
    color: "#111",
    flex: 1,
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
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
