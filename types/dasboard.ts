// 📌 Types for Widgets
export interface DashboardWidgets {
  total_product: number;
  total_customer: number;
  total_supplier: number;
  total_category: number;
  total_sale: number;
  total_sale_count: number;
  total_sale_return: number;
  total_sale_return_count: number;
  total_purchase: number;
  total_purchase_count: number;
  total_purchase_return: number;
  total_purchase_return_count: number;
}

// 📌 Types for Inventory Alerts
export interface InventoryAlert {
  id?: number;
  name: string;
  warehouse_name: string;
  quantity: number;
  unit_name: string;
  alert_quantity: number;
}

// 📌 Types for Top Performers
export interface TopPerformer {
  id?: number;
  name: string;
  sku: string;
  total_sale: number;
  total_sale_weight: number;
  unit?: {
    id?: number;
    name: string;
  };
}

// 📌 Full Dashboard Response
export interface DashboardResponse {
  widgets: DashboardWidgets;
  alertProductsQty: InventoryAlert[];
  topSellingProducts: TopPerformer[];
}

// 📌 Table Column Generic
export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  flex?: number;
  style?: object;
  cellStyle?: object;
  render?: (item: T) => React.ReactNode;
}

// 📌 Empty State Config
export interface EmptyStateConfig {
  emptyTitle: string;
  emptyMessage: string;
  emptyIcon: string;
}
