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
import ReusableTable, { Column } from "../../components/Table/ReusableTable";

// --- 1. Type Definition ---
interface PurchaseReturnEntry {
  invoiceNo: string;
  type: string;
  by: string;
  time: string;
  returnDate: string;
  totalPrice: string;
  discountAmount: string;
  receivableAmount: string;
  receivedAmount: string;
  dueAmount: string;
  note: string;
  supplierId?: number;
  actionableCreatedAt: string;
  actionableUpdatedAt: string;
  originalPurchaseId?: number;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  originalPurchasePaymentMethod: string;
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
  entry: PurchaseReturnEntry | null;
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
            <Text style={styles.modalTitle}>
              Return Details (Ref P.Inv: {entry.invoiceNo})
            </Text>

            <DetailRow label="Return Date:" value={entry.returnDate} />
            <DetailRow label="Supplier ID:" value={entry.supplierId} />
            <DetailRow
              label="Original Purchase ID:"
              value={entry.originalPurchaseId}
            />
            <DetailRow label="Total Return Price:" value={entry.totalPrice} />
            <DetailRow label="Discount:" value={entry.discountAmount} />
            <DetailRow label="Net Receivable:" value={entry.receivableAmount} />
            <DetailRow label="Amount Received:" value={entry.receivedAmount} />
            <DetailRow label="Due Amount:" value={entry.dueAmount} />

            {entry.note ? (
              <>
                <View style={styles.modalSeparator} />
                <DetailRow label="Note:" value={entry.note} />
              </>
            ) : null}

            <View style={styles.modalSeparator} />

            <Text style={styles.modalSectionTitle}>Original Purchase Info</Text>
            <DetailRow label="Vehicle Number:" value={entry.vehicleNumber} />
            <DetailRow label="Driver Name:" value={entry.driverName} />
            <DetailRow label="Driver Contact:" value={entry.driverContact} />
            <DetailRow
              label="Orig. Pymt Method:"
              value={entry.originalPurchasePaymentMethod}
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
export default function PurchaseReturnEntryReportScreen() {
  const [entries, setEntries] = useState<PurchaseReturnEntry[]>([]);
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
  const [selectedEntry, setSelectedEntry] =
    useState<PurchaseReturnEntry | null>(null);

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

  const fetchEntries = useCallback(
    async (page: number, isInitialLoad: boolean = false) => {
      if (isFetchingMore && !isInitialLoad) return;

      if (isInitialLoad) {
        setIsLoading(true);
        setEntries([]);
        setCurrentPage(1);
      } else {
        setIsFetchingMore(true);
      }
      setError(null);

      let apiUrl = `https://dewan-chemicals.majesticsofts.com/api/reports/data-entry/purchase-return?page=${page}`;
      if (startDate && endDate) {
        apiUrl += `&start_date=${formatApiDate(startDate)}`;
        apiUrl += `&end_date=${formatApiDate(endDate)}`;
      }

      console.log("Fetching Purchase Returns:", apiUrl);
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Accept: "application/json" /* Add Auth Token if needed */,
          },
        });

        if (response.data && response.data.data) {
          const fetchedData: PurchaseReturnEntry[] = response.data.data.map(
            (item: any) => {
              const actionableData = item.actionable || {};
              const originalPurchaseData = actionableData.purchase || {};

              return {
                invoiceNo: originalPurchaseData.invoice_no?.toString() ?? "N/A",
                type: item.action_name ?? "N/A",
                by: item.admin?.username ?? "N/A",
                time: formatDisplayDateTime(item.created_at),
                returnDate: formatDisplayDate(actionableData.return_date),
                totalPrice: formatCurrency(actionableData.total_price),
                discountAmount: formatCurrency(actionableData.discount_amount),
                receivableAmount: formatCurrency(
                  actionableData.receivable_amount
                ),
                receivedAmount: formatCurrency(actionableData.received_amount),
                dueAmount: formatCurrency(actionableData.due_amount),
                note: actionableData.note?.toString() ?? "",
                supplierId: actionableData.supplier_id,
                actionableCreatedAt: formatDisplayDateTime(
                  actionableData.created_at
                ),
                actionableUpdatedAt: formatDisplayDateTime(
                  actionableData.updated_at
                ),
                originalPurchaseId: actionableData.purchase_id,
                vehicleNumber:
                  originalPurchaseData.vehicle_number?.toString() ?? "N/A",
                driverName:
                  originalPurchaseData.driver_name?.toString() ?? "N/A",
                driverContact:
                  originalPurchaseData.driver_contact?.toString() ?? "N/A",
                originalPurchasePaymentMethod:
                  originalPurchaseData.payment_method?.toString() ?? "N/A",
              };
            }
          );

          setEntries((prev) =>
            isInitialLoad ? fetchedData : [...prev, ...fetchedData]
          );
          setCurrentPage(response.data.current_page);
          setTotalPages(response.data.total_pages);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    },
    [startDate, endDate, isFetchingMore]
  );

  useEffect(() => {
    fetchEntries(1, true);
  }, [startDate, endDate]); // Refetch when date range changes

  const handleRefresh = () => {
    fetchEntries(1, true);
  };

  const handleLoadMore = useCallback(() => {
    if (currentPage < totalPages && !isFetchingMore && !isLoading) {
      console.log("Loading more entries:", {
        currentPage: currentPage + 1,
        totalPages,
      });
      fetchEntries(currentPage + 1);
    }
  }, [currentPage, totalPages, isFetchingMore, isLoading, fetchEntries]);

  const handleRowPress = (item: PurchaseReturnEntry) => {
    setSelectedEntry(item);
    setModalVisible(true);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Define table columns
  const columns: Column<PurchaseReturnEntry>[] = [
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
          <Text style={styles.appBarTitle}>Purchase Return Entry Report</Text>
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF8F3C" />
          <Text style={styles.loadingText}>Loading purchase returns...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && entries.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.appBar}>
          <Text style={styles.appBarTitle}>Purchase Return Entry Report</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Purchase Return Entry Report</Text>
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
          <ReusableTable<PurchaseReturnEntry>
            data={entries}
            columns={columns}
            title="Purchase Return Entries"
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
              emptyTitle: "No Purchase Returns Found",
              emptyMessage:
                "There are no purchase return entries to display for the selected criteria.",
              emptyIcon: "📋",
            }}
            containerStyle={styles.tableContainer}
          />

          {/* Load More Button */}
          {currentPage < totalPages && !isFetchingMore && (
            <View style={styles.loadMoreButtonContainer}>
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={handleLoadMore}
                activeOpacity={0.7}
              >
                <Text style={styles.loadMoreButtonText}>
                  Load More ({entries.length} of{" "}
                  {totalPages > 1 ? `${totalPages} pages` : "all entries"})
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
          {currentPage >= totalPages && entries.length > 0 && (
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
                {currentPage < totalPages && " • Scroll down for more"}
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

  // Modal Styles (kept from original)
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
