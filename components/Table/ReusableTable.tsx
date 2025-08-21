import React, { ReactNode, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';

export type Column<T> = {
  key: keyof T | string;
  title: string;
  flex?: number;
  render?: (item: T, index: number) => ReactNode | string | number;
  style?: object;
  cellStyle?: object;
  headerStyle?: object;
  headerTextStyle?: object;
};

type EmptyStateConfig = {
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: string;
};

type DateFilterConfig = {
  enabled?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
  placeholder?: string;
  quickSelectOptions?: Array<{
    label: string;
    start: Date;
    end: Date;
  }>;
};

type ReusableTableProps<T> = {
  data?: T[];
  columns?: Column<T>[];
  title?: string;
  emptyStateConfig?: EmptyStateConfig;
  onRowPress?: (item: T, index: number) => void;
  containerStyle?: object;
  tableStyle?: object;
  showIndex?: boolean;
  dateFilter?: DateFilterConfig;
  maxHeight?: number; // Add this prop to control height
};

// Date Filter Component
const DateFilter = ({
  startDate,
  endDate,
  onDateRangeSelect,
  onClearFilter,
  placeholder = "Select Date Range",
}: {
  startDate: Date | null;
  endDate: Date | null;
  onDateRangeSelect: () => void;
  onClearFilter: () => void;
  placeholder?: string;
}) => {
  const formatDateForDisplay = (date: Date | null) => {
    if (!date) return null;
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity style={styles.dateButton} onPress={onDateRangeSelect}>
        <Text style={styles.dateButtonText}>
          {startDate && endDate 
            ? `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`
            : placeholder
          }
        </Text>
        <Text style={styles.dateIcon}>📅</Text>
      </TouchableOpacity>
      
      {(startDate || endDate) && (
        <TouchableOpacity style={styles.clearButton} onPress={onClearFilter}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Simple Date Picker Modal
const SimpleDatePicker = ({
  visible,
  onClose,
  onConfirm,
  quickSelectOptions,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
  quickSelectOptions?: Array<{
    label: string;
    start: Date;
    end: Date;
  }>;
}) => {
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

  // Default quick date range options
  const getDefaultDateRangeOptions = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    return [
      { label: "Today", start: today, end: today },
      { label: "Yesterday", start: yesterday, end: yesterday },
      { label: "Last 7 days", start: lastWeek, end: today },
      { label: "Last 30 days", start: lastMonth, end: today },
      { label: "This month", start: startOfMonth, end: today },
      { label: "This year", start: startOfYear, end: today },
    ];
  };

  const dateRangeOptions = quickSelectOptions || getDefaultDateRangeOptions();

  const handleQuickSelect = (start: Date, end: Date) => {
    setTempStartDate(start);
    setTempEndDate(end);
  };

  const handleConfirm = () => {
    if (tempStartDate && tempEndDate) {
      onConfirm(tempStartDate, tempEndDate);
      onClose();
      // Reset temp dates after confirmation
      setTempStartDate(null);
      setTempEndDate(null);
    } else {
      Alert.alert("Error", "Please select both start and end dates");
    }
  };

  const handleClose = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.datePickerOverlay}>
        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerTitle}>Select Date Range</Text>
          
          <ScrollView style={styles.quickSelectScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.quickSelectContainer}>
              <Text style={styles.quickSelectLabel}>Quick Select:</Text>
              {dateRangeOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quickSelectButton,
                    (tempStartDate?.toDateString() === option.start.toDateString() &&
                     tempEndDate?.toDateString() === option.end.toDateString()) && 
                    styles.selectedQuickSelect
                  ]}
                  onPress={() => handleQuickSelect(option.start, option.end)}
                >
                  <Text style={[
                    styles.quickSelectButtonText,
                    (tempStartDate?.toDateString() === option.start.toDateString() &&
                     tempEndDate?.toDateString() === option.end.toDateString()) && 
                    styles.selectedQuickSelectText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {tempStartDate && tempEndDate && (
            <View style={styles.selectedDatesContainer}>
              <Text style={styles.selectedDatesText}>
                Selected: {tempStartDate.toLocaleDateString()} - {tempEndDate.toLocaleDateString()}
              </Text>
            </View>
          )}

          <View style={styles.datePickerButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

function ReusableTable<T>({
  data = [],
  columns = [],
  title,
  emptyStateConfig = {},
  onRowPress,
  containerStyle,
  tableStyle,
  showIndex = false,
  dateFilter,
  maxHeight, // New prop to control table height
}: ReusableTableProps<T>) {
  const {
    emptyTitle = 'No Data Available',
    emptyMessage = 'There are no items to display',
    emptyIcon = '📊',
  } = emptyStateConfig;

  // Date filter state
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{emptyIcon}</Text>
      <Text style={styles.emptyTitle}>{emptyTitle}</Text>
      <Text style={styles.emptyMessage}>{emptyMessage}</Text>
    </View>
  );

  const renderCell = (item: T, column: Column<T>, index: number) => {
    if (column.render) {
      const cellContent = column.render(item, index);
      if (typeof cellContent === 'string' || typeof cellContent === 'number') {
        return <Text style={[styles.cellText, column.style]} numberOfLines={2} ellipsizeMode="tail">{cellContent}</Text>;
      }
      return cellContent as ReactNode;
    }
    const value = column.key.toString().split('.').reduce((obj: any, k) => obj?.[k], item);
    return <Text style={[styles.cellText, column.style]} numberOfLines={2} ellipsizeMode="tail">{value ?? '-'}</Text>;
  };

  const handleDateRangeSelect = (start: Date, end: Date) => {
    dateFilter?.onDateRangeChange?.(start, end);
  };

  const handleClearDateFilter = () => {
    dateFilter?.onDateRangeChange?.(null, null);
  };


  return (
    <View style={[styles.container, containerStyle]}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      
      {/* Date Filter */}
      {dateFilter?.enabled && (
        <DateFilter
          startDate={dateFilter.startDate || null}
          endDate={dateFilter.endDate || null}
          onDateRangeSelect={() => setDatePickerVisible(true)}
          onClearFilter={handleClearDateFilter}
          placeholder={dateFilter.placeholder}
        />
      )}

      {!data.length ? (
        <EmptyState />
      ) : (
        <View style={[styles.tableContainer, tableStyle]}>
          {/* Debug info in table header */}
          <View style={styles.debugInfoContainer}>
            <Text style={styles.debugInfoText}>
              Table: Showing {data.length} entries
            </Text>
          </View>

          {/* Horizontal scroll for table content */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <View style={styles.tableContent}>
              {/* Header */}
              <View style={styles.headerRow}>
                {showIndex && (
                  <View style={[styles.headerCell, styles.indexColumn]}>
                    <Text style={styles.headerText}>#</Text>
                  </View>
                )}
                {columns.map((column, index) => (
                  <View
                    key={index}
                    style={[
                      styles.headerCell, 
                      { minWidth: 100, flex: column.flex || 1 }, 
                      column.headerStyle
                    ]}
                  >
                    <Text style={[styles.headerText, column.headerTextStyle]} numberOfLines={1}>
                      {column.title}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Data Rows - FIXED: Removed limiting ScrollView */}
              <View style={maxHeight ? { maxHeight } : {}}>
                <ScrollView 
                  showsVerticalScrollIndicator={true}
                  style={maxHeight ? { maxHeight } : { maxHeight: 800 }} // Increased default height
                  nestedScrollEnabled={true}
                >
                  {data.map((item, rowIndex) => {
                    return (
                      <TouchableOpacity
                        key={`row-${rowIndex}`} // Better key
                        style={styles.dataRow}
                        onPress={() => onRowPress?.(item, rowIndex)}
                        activeOpacity={onRowPress ? 0.7 : 1}
                      >
                        {showIndex && (
                          <View style={[styles.dataCell, styles.indexColumn]}>
                            <Text style={styles.indexText}>{rowIndex + 1}</Text>
                          </View>
                        )}
                        {columns.map((column, colIndex) => (
                          <View
                            key={`cell-${rowIndex}-${colIndex}`}
                            style={[
                              styles.dataCell, 
                              { minWidth: 100, flex: column.flex || 1 }, 
                              column.cellStyle
                            ]}
                          >
                            {renderCell(item, column, rowIndex)}
                          </View>
                        ))}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </ScrollView>

          {/* Hint text */}
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>
              💡 Tap any row to view complete details • Scroll to see more entries
            </Text>
          </View>
        </View>
      )}

      {/* Date Picker Modal */}
      {dateFilter?.enabled && (
        <SimpleDatePicker
          visible={datePickerVisible}
          onClose={() => setDatePickerVisible(false)}
          onConfirm={handleDateRangeSelect}
          quickSelectOptions={dateFilter.quickSelectOptions}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginBottom: 16 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: '#1a1a1a', 
    marginBottom: 12, 
    marginLeft: 4 
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },

  // Debug info container
  debugInfoContainer: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#bbdefb',
  },
  debugInfoText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
    textAlign: 'center',
  },

  horizontalScroll: {
    flex: 1,
  },
  tableContent: {
    minWidth: '100%',
  },
  headerRow: { 
    flexDirection: 'row', 
    backgroundColor: '#f8f9fa', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e9ecef', 
    paddingVertical: 14, 
    paddingHorizontal: 12 
  },
  headerCell: { 
    justifyContent: 'center', 
    paddingHorizontal: 6,
    alignItems: 'flex-start'
  },
  headerText: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#495057', 
    textAlign: 'left'
  },
  dataRow: { 
    flexDirection: 'row', 
    paddingVertical: 14, 
    paddingHorizontal: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f3f4', 
    backgroundColor: '#fff',
    minHeight: 50
  },
  dataCell: { 
    justifyContent: 'center', 
    paddingHorizontal: 6,
    alignItems: 'flex-start'
  },
  cellText: { 
    fontSize: 13, 
    color: '#1a1a1a', 
    textAlign: 'left',
    lineHeight: 16
  },
  indexColumn: { 
    minWidth: 40,
    flex: 0,
    alignItems: 'center' 
  },
  indexText: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#666' 
  },
  hintContainer: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef'
  },
  hintText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  emptyState: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 32, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3 
  },
  emptyIcon: { 
    fontSize: 48, 
    marginBottom: 16 
  },
  emptyTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#1a1a1a', 
    marginBottom: 8 
  },
  emptyMessage: { 
    fontSize: 14, 
    color: '#666', 
    textAlign: 'center' 
  },

  // Date Filter Styles
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 10,
    marginBottom: 8,
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

  // Date Picker Modal Styles
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
    maxHeight: '80%',
  },
  datePickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  quickSelectScrollView: {
    maxHeight: 300,
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
  selectedQuickSelect: {
    backgroundColor: '#1E5B50',
    borderColor: '#1E5B50',
  },
  quickSelectButtonText: {
    fontSize: 14,
    color: '#495057',
  },
  selectedQuickSelectText: {
    color: 'white',
    fontWeight: '600',
  },
  selectedDatesContainer: {
    backgroundColor: '#e8f5e8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  selectedDatesText: {
    fontSize: 14,
    color: '#2e7d32',
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
});

export default ReusableTable;