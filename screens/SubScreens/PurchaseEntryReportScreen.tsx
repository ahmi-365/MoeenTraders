import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import ReusableTable, { Column } from "../../components/Table/ReusableTable";
import { PurchaseEntry } from "../../types/types";
import axios from "axios";

// Helper component for displaying a row of details in the modal
const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
  <View style={styles.modalDetailRow}>
    <Text style={styles.modalDetailLabel}>{label}</Text>
    <Text style={styles.modalDetailValue}>{value}</Text>
  </View>
);

// Modal Component
const PurchaseDetailModal = ({
  visible,
  onClose,
  entry,
}: {
  visible: boolean;
  onClose: () => void;
  entry: PurchaseEntry | null;
}) => {
  if (!entry) {
    return null;
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>Details: {entry.invoiceNo}</Text>

            <DetailRow label="Purchase Date:" value={entry.purchaseDate} />
            <DetailRow label="Total Price:" value={entry.totalPrice} />
            <DetailRow label="Discount:" value={entry.discountAmount} />
            <DetailRow label="Payable Amount:" value={entry.payableAmount} />
            <DetailRow label="Paid Amount:" value={entry.paidAmount} />
            <DetailRow label="Due Amount:" value={entry.dueAmount} />

            <View style={styles.modalSeparator} />

            <DetailRow label="Payment Method:" value={entry.paymentMethod} />
            {entry.paymentMethod.toLowerCase() === 'bank' ? (
              <DetailRow label="Received (Bank):" value={entry.receivedAmountBank} />
            ) : entry.paymentMethod.toLowerCase() === 'cash' ? (
              <DetailRow label="Received (Cash):" value={entry.receivedAmountCash} />
            ) : (
              <>
                <DetailRow label="Received (Bank):" value={entry.receivedAmountBank} />
                <DetailRow label="Received (Cash):" value={entry.receivedAmountCash} />
              </>
            )}
            
            <View style={styles.modalSeparator} />

            <DetailRow label="Vehicle Number:" value={entry.vehicleNumber} />
            <DetailRow label="Driver Name:" value={entry.driverName} />
            <DetailRow label="Driver Contact:" value={entry.driverContact} />
            <DetailRow label="Fare:" value={entry.fare} />

            {entry.note && (
              <>
                <View style={styles.modalSeparator} />
                <DetailRow label="Note:" value={entry.note} />
              </>
            )}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function PurchaseEntryReportScreen() {
  const [purchaseEntries, setPurchaseEntries] = useState<PurchaseEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Date filter state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PurchaseEntry | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    fetchPurchaseEntries(1, true);
  }, [startDate, endDate]);

  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const buildApiUrl = (page: number) => {
    let apiUrl = `https://dewan-chemicals.majesticsofts.com/api/reports/data-entry/purchase?page=${page}`;
    
    if (startDate && endDate) {
      apiUrl += `&start_date=${formatDateForAPI(startDate)}`;
      apiUrl += `&end_date=${formatDateForAPI(endDate)}`;
    }
    
    return apiUrl;
  };

  const fetchPurchaseEntries = async (page: number = 1, isInitialLoad: boolean = false) => {
    if (isFetchingMore && !isInitialLoad) return;

    try {
      if (isInitialLoad) {
        setLoading(true);
        setCurrentPage(1);
        setTotalPages(1);
      } else {
        setIsFetchingMore(true);
      }
      
      setError(null);
      
      const apiUrl = buildApiUrl(page);
      console.log('Fetching Purchases:', apiUrl);
      
      const response = await axios.get(apiUrl, { 
        headers: { 
          Accept: "application/json",
          // Add your bearer token here if needed
          // Authorization: "Bearer YOUR_TOKEN_HERE"
        } 
      });

      if (response.data && response.data.data) {
        const data: PurchaseEntry[] = response.data.data.map((item: any) => {
          // Format time
          let formattedTime = 'N/A';
          if (item.created_at) {
            try {
              const date = new Date(item.created_at);
              formattedTime = date.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
            } catch (e) {
              formattedTime = item.created_at;
            }
          }

          // Format purchase date
          let formattedPurchaseDate = 'N/A';
          if (item.actionable?.purchase_date) {
            try {
              const date = new Date(item.actionable.purchase_date);
              formattedPurchaseDate = date.toLocaleDateString('en-US');
            } catch (e) {
              formattedPurchaseDate = item.actionable.purchase_date;
            }
          }

          // Extract user info
          const extractedBy = item.admin?.username || 'N/A';
          const actionableData = item.actionable || {};

          return {
            invoiceNo: actionableData.invoice_no?.toString() || 'N/A',
            type: item.action_name || 'N/A',
            by: extractedBy,
            time: formattedTime,
            purchaseDate: formattedPurchaseDate,
            totalPrice: formatCurrency(actionableData.total_price),
            discountAmount: formatCurrency(actionableData.discount_amount),
            payableAmount: formatCurrency(actionableData.payable_amount),
            paidAmount: formatCurrency(actionableData.paid_amount),
            dueAmount: formatCurrency(actionableData.due_amount),
            paymentMethod: actionableData.payment_method?.toString() || 'N/A',
            receivedAmountBank: formatCurrency(actionableData.received_amount_bank, '0'),
            receivedAmountCash: formatCurrency(actionableData.received_amount_cash, '0'),
            vehicleNumber: actionableData.vehicle_number?.toString() || 'N/A',
            driverName: actionableData.driver_name?.toString() || 'N/A',
            driverContact: actionableData.driver_contact?.toString() || 'N/A',
            fare: formatCurrency(actionableData.fare, '0'),
            note: actionableData.note?.toString() || '',
          };
        });

        if (isInitialLoad) {
          setPurchaseEntries(data);
        } else {
          setPurchaseEntries(prev => [...prev, ...data]);
        }

        setCurrentPage(response.data.current_page || page);
        setTotalPages(response.data.total_pages || 1);
      }
    } catch (err) {
      console.error('Error fetching purchase entries:', err);
      setError("Failed to fetch purchase entries.");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsFetchingMore(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPurchaseEntries(1, true);
  };

  const formatCurrency = (value: any, defaultValue: string = '0.00') => {
    if (value === null || value === undefined) return defaultValue;
    try {
      const num = Number(value);
      if (isNaN(num)) return defaultValue;
      return num.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    } catch {
      return value?.toString() || defaultValue;
    }
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isFetchingMore) {
      fetchPurchaseEntries(currentPage + 1, false);
    }
  };

  // Define columns for the table
  const columns: Column<PurchaseEntry>[] = [
    { key: "invoiceNo", title: "Invoice No.", flex: 1.5 },
    { key: "type", title: "Type", flex: 1 },
    { key: "by", title: "By", flex: 1 },
    { key: "time", title: "Time", flex: 2 },
  ];

  const handleRowPress = (item: PurchaseEntry) => {
    setSelectedEntry(item);
    setModalVisible(true);
  };
  
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E5B50" />
        <Text style={styles.loadingText}>Loading purchase entries...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ReusableTable<PurchaseEntry>
          title="Purchase Entry Report"
          data={purchaseEntries}
          columns={columns}
          showIndex
          onRowPress={handleRowPress}
          dateFilter={{
            enabled: true,
            startDate,
            endDate,
            onDateRangeChange: handleDateRangeChange,
            placeholder: "Select Date Range for Purchase Entries",
            quickSelectOptions: [
              { label: "Today", start: new Date(), end: new Date() },
              { label: "Yesterday", start: (() => {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                return yesterday;
              })(), end: (() => {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                return yesterday;
              })() },
              { label: "Last 7 days", start: (() => {
                const lastWeek = new Date();
                lastWeek.setDate(lastWeek.getDate() - 7);
                return lastWeek;
              })(), end: new Date() },
              { label: "Last 30 days", start: (() => {
                const lastMonth = new Date();
                lastMonth.setDate(lastMonth.getDate() - 30);
                return lastMonth;
              })(), end: new Date() },
              { label: "This month", start: new Date(new Date().getFullYear(), new Date().getMonth(), 1), end: new Date() },
              { label: "This year", start: new Date(new Date().getFullYear(), 0, 1), end: new Date() },
            ]
          }}
          emptyStateConfig={{
            emptyTitle: "No Purchase Entries",
            emptyMessage: startDate && endDate 
              ? `No purchase data available for ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
              : "No purchase data available for this period.",
            emptyIcon: "🛒",
          }}
        />

        {/* Load More Button */}
        {currentPage < totalPages && (
          <TouchableOpacity 
            style={styles.loadMoreButton} 
            onPress={handleLoadMore}
            disabled={isFetchingMore}
          >
            {isFetchingMore ? (
              <ActivityIndicator size="small" color="#1E5B50" />
            ) : (
              <Text style={styles.loadMoreText}>Load More</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Purchase Detail Modal */}
      <PurchaseDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        entry={selectedEntry}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: "#f5f7fa",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginVertical: 10,
    marginLeft: 4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    color: "#F44336",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryText: {
    color: "white",
    fontWeight: "600",
  },
  
  // Date Filter Styles
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 10,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E5B50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'space-between',
  },
  dateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  dateIcon: {
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },

  // Load More Button
  loadMoreButton: {
    backgroundColor: '#1E5B50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 4,
  },
  loadMoreText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // Date Picker Styles
  datePickerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    maxHeight: '70%',
  },
  datePickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  quickSelectContainer: {
    marginBottom: 20,
  },
  quickSelectLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  quickSelectButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  quickSelectButtonText: {
    fontSize: 14,
    color: '#495057',
  },
  selectedDatesContainer: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  selectedDatesText: {
    fontSize: 14,
    color: '#1976d2',
    textAlign: 'center',
    fontWeight: '500',
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#1E5B50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalScrollView: {
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: '#333'
  },
  modalDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalDetailLabel: {
    fontSize: 15,
    color: "#555",
    fontWeight: '500',
    flex: 1,
  },
  modalDetailValue: {
    fontSize: 15,
    color: "#111",
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  modalSeparator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: "#1E5B50",
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});