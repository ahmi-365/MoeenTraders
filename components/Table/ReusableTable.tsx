import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

// Column type
export type Column<T> = {
  key: keyof T | string; // support nested like "unit.name"
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

type ReusableTableProps<T> = {
  data?: T[];
  columns?: Column<T>[];
  title?: string;
  emptyStateConfig?: EmptyStateConfig;
  onRowPress?: (item: T, index: number) => void;
  containerStyle?: object;
  tableStyle?: object;
  showIndex?: boolean;
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
}: ReusableTableProps<T>) {
  const {
    emptyTitle = "No Data Available",
    emptyMessage = "There are no items to display",
    emptyIcon = "📊",
  } = emptyStateConfig;

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{emptyIcon}</Text>
      <Text style={styles.emptyTitle}>{emptyTitle}</Text>
      <Text style={styles.emptyMessage}>{emptyMessage}</Text>
    </View>
  );

  const renderCell = (item: T, column: Column<T>, index: number) => {
    const { key, render, style = {} } = column;

    if (render) {
      const cellContent = render(item, index);
      // Wrap numbers/strings in Text
      if (typeof cellContent === 'string' || typeof cellContent === 'number') {
        return <Text style={[styles.cellText, style]}>{cellContent}</Text>;
      }
      return cellContent as ReactNode; // already JSX
    }

    const value = key.toString().split('.').reduce((obj: any, k) => obj?.[k], item);
    return <Text style={[styles.cellText, style]}>{value ?? '-'}</Text>;
  };

  if (data.length === 0) {
    return (
      <View style={[styles.container, containerStyle]}>
        {title && <Text style={styles.sectionTitle}>{title}</Text>}
        <EmptyState />
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={[styles.tableContainer, tableStyle]}>
        <View style={styles.headerRow}>
          {showIndex && (
            <View style={[styles.headerCell, styles.indexColumn]}>
              <Text style={styles.headerText}>#</Text>
            </View>
          )}
          {columns.map((column, index) => (
            <View key={index} style={[styles.headerCell, { flex: column.flex || 1 }, column.headerStyle]}>
              <Text style={[styles.headerText, column.headerTextStyle]}>{column.title}</Text>
            </View>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {data.map((item, rowIndex) => (
            <TouchableOpacity
              key={rowIndex}
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
                <View key={colIndex} style={[styles.dataCell, { flex: column.flex || 1 }, column.cellStyle]}>
                  {renderCell(item, column, rowIndex)}
                </View>
              ))}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#1a1a1a', marginBottom: 12, marginLeft: 4 },
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
  headerRow: { flexDirection: 'row', backgroundColor: '#f8f9fa', borderBottomWidth: 1, borderBottomColor: '#e9ecef', paddingVertical: 12, paddingHorizontal: 16 },
  headerCell: { justifyContent: 'center', paddingHorizontal: 4 },
  headerText: { fontSize: 14, fontWeight: '600', color: '#495057', textAlign: 'left' },
  dataRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f1f3f4', backgroundColor: '#fff' },
  dataCell: { justifyContent: 'center', paddingHorizontal: 4 },
  cellText: { fontSize: 14, color: '#1a1a1a', textAlign: 'left' },
  indexColumn: { flex: 0.3, alignItems: 'center' },
  indexText: { fontSize: 14, fontWeight: '600', color: '#666' },
  emptyState: { backgroundColor: '#fff', borderRadius: 12, padding: 32, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a', marginBottom: 8 },
  emptyMessage: { fontSize: 14, color: '#666', textAlign: 'center' },
});

export default ReusableTable;
