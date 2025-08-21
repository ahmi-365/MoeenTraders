import React, { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import InfoCard from "../components/DashboardCard/InfoCard";
import ReusableTable from "../components/Table/ReusableTable";
import { useMonthYear } from "../context/MonthYearContext";
import {
  DashboardResponse,
  InventoryAlert,
  TopPerformer,
  TableColumn,
} from "../types/dasboard"; // 👈 create a file for types
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const { month, year } = useMonthYear();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = `https://dewan-chemicals.majesticsofts.com/api/dashboard?month=${month}&year=${year}`;

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching dashboard for:", month, year);
      const response = await fetch(apiUrl);
      const data: DashboardResponse = await response.json();

      setDashboardData(data);
      console.log("Dashboard data:", data);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
const monthName = (monthNumber: number) => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[monthNumber - 1] || "";
};

  useEffect(() => {
    fetchDashboardData();
  }, [month, year]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // 🔹 Columns for Inventory Alerts
  const inventoryAlertsColumns: TableColumn<InventoryAlert>[] = [
    {
      key: "name",
      title: "Product Name",
      flex: 2,
      cellStyle: { paddingRight: 8 },
    },
    {
      key: "warehouse_name",
      title: "Warehouse",
      flex: 1,
      cellStyle: { paddingHorizontal: 4 },
    },
    {
      key: "quantity",
      title: "Current Stock",
      flex: 1.2,
      render: (item) => `${item.quantity} ${item.unit_name}`,
      cellStyle: { alignItems: "center" },
      style: { textAlign: "center", fontWeight: "600" },
    },
    {
      key: "alert_quantity",
      title: "Alert Level",
      flex: 1,
      cellStyle: { alignItems: "center" },
      style: {
        textAlign: "center",
        fontWeight: "600",
        color: "#FF5722",
      },
    },
  ];

  // 🔹 Columns for Top Performers
  const topPerformersColumns: TableColumn<TopPerformer>[] = [
    {
      key: "name",
      title: "Product Name",
      flex: 2,
      cellStyle: { paddingRight: 8 },
      style: { fontWeight: "600" },
    },
    {
      key: "sku",
      title: "SKU",
      flex: 1,
      cellStyle: { paddingHorizontal: 4 },
      style: {
        fontSize: 12,
        color: "#666",
        backgroundColor: "#f8f9fa",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
      },
    },
    {
      key: "total_sale",
      title: "Total Sales",
      flex: 1,
      cellStyle: { alignItems: "center" },
      style: {
        textAlign: "center",
        fontWeight: "700",
        color: "#4CAF50",
      },
    },
    {
      key: "total_sale_weight",
      title: "Weight Sold",
      flex: 1.2,
      render: (item) => {
        const unit = item.unit?.name || "units";
        return `${item.total_sale_weight} ${unit}`;
      },
      cellStyle: { alignItems: "center" },
      style: {
        textAlign: "center",
        fontSize: 12,
        color: "#666",
      },
    },
  ];

  const handleInventoryAlertPress = (item: InventoryAlert, index: number) => {
    console.log("Inventory alert pressed:", item);
  };

  const handleTopPerformerPress = (item: TopPerformer, index: number) => {
    console.log("Top performer pressed:", item);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
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

  if (!dashboardData) {
    return (
      <View style={styles.center}>
        <Text style={styles.noDataText}>No data available.</Text>
      </View>
    );
  }

  const widgets = dashboardData.widgets;

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="#ffffff"
        barStyle="dark-content"
      />

    <ScrollView
  contentContainerStyle={styles.scrollContent}
  showsVerticalScrollIndicator={false}
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
>
<View style={styles.dateCard}>
  {/* Month Column */}
  <View style={styles.dateColumn}>
    <Text style={styles.dateMonth}>{monthName(month)}</Text>
  </View>

  {/* Year Column */}
  <View style={styles.dateColumn}>
    <Text style={styles.dateYear}>{year}</Text>
  </View>

  {/* Calendar Icon */}
  <Ionicons name="calendar-outline" size={28} color="#fff" style={styles.dateIcon} />
</View>



  {/* Overview Cards */}
  <Text style={styles.sectionTitle}>Overview</Text>
  <View style={styles.cardRow}>
    <InfoCard number={widgets.total_product} label="Total Products" icon="cube-outline" color="#4CAF50" />
    <InfoCard number={widgets.total_customer} label="Total Customers" icon="people-outline" color="#2196F3" />
  </View>
  <View style={styles.cardRow}>
    <InfoCard number={widgets.total_supplier} label="Total Suppliers" icon="storefront-outline" color="#FF9800" />
    <InfoCard number={widgets.total_category} label="Total Categories" icon="albums-outline" color="#9C27B0" />
  </View>

  {/* Sales Section */}
  <Text style={styles.sectionTitle}>Sales</Text>
  <View style={styles.cardRow}>
    <InfoCard 
      number={widgets.total_sale} 
      label={`Total Sales (${widgets.total_sale_count})`} 
      icon="cash-outline" 
      color="#4CAF50"
    />
    <InfoCard 
      number={widgets.total_sale_return} 
      label={`Sales Return (${widgets.total_sale_return_count})`} 
      icon="arrow-undo-outline" 
      color="#FF5722"
    />
  </View>

  {/* Purchases Section */}
  <Text style={styles.sectionTitle}>Purchases</Text>
  <View style={styles.cardRow}>
    <InfoCard 
      number={Number(widgets.total_purchase).toFixed(2)}   
      label={`Total Purchases (${widgets.total_purchase_count})`} 
      icon="cart-outline" 
      color="#2196F3"
    />
    
  </View>
  <View style={styles.cardRow}>
  <InfoCard 
      number={Number(widgets.total_purchase_return).toFixed(2)} 
      label={`Purchase Return (${widgets.total_purchase_return_count})`} 
      icon="refresh-outline" 
      color="#FF9800"
    />
    
  </View>

  {/* Inventory Alerts Table */}
  <ReusableTable
    title="Inventory Alerts"
    data={dashboardData.alertProductsQty}
    columns={inventoryAlertsColumns}
    onRowPress={handleInventoryAlertPress}
    emptyStateConfig={{
      emptyTitle: "No Low Stock Alerts",
      emptyMessage: "All products are well stocked",
      emptyIcon: "✅",
    }}
  />

  {/* Top Performers Table */}
  <ReusableTable
    title="Top Performers"
    data={dashboardData.topSellingProducts}
    columns={topPerformersColumns}
    onRowPress={handleTopPerformerPress}
    showIndex={true}
    emptyStateConfig={{
      emptyTitle: "No Sales Data",
      emptyMessage: "No top selling products for this period",
      emptyIcon: "📊",
    }}
  />
</ScrollView>

    </View>
  );
}


const styles = StyleSheet.create({
dateCard: {
  width: "100%",
  borderRadius: 16,
  paddingVertical: 6,
  paddingHorizontal: 16,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#4CAF50",
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowOffset: { width: 0, height: 5 },
  shadowRadius: 10,
  elevation: 5,
  marginBottom: 12,
},
dateColumn: {
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
},
dateMonth: {
  fontSize: 26,
  fontWeight: "800",
  color: "#fff",
},
dateYear: {
  fontSize: 16,
  fontWeight: "500",
  color: "#e0e0e0",
},
dateIcon: {
  // optional styles
},


  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollContent: {
    paddingHorizontal: 12, // reduced from 16
    paddingBottom: 16,     // reduced from 24
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
  },
  header: {
    backgroundColor: "#ffffff",
    borderRadius: 12,      // reduced from 16
    padding: 16,           // reduced from 20
    marginVertical: 12,    // reduced from 16
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,          // slightly smaller
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,       // reduced from 4
  },
  headerSubtitle: {
    fontSize: 14,          // reduced from 16
    color: "#666",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,          // reduced from 20
    fontWeight: "600",
    color: "#1a1a1a",
    marginTop: 10,         // slightly reduced
    marginBottom: 8,       // reduced from 12
    marginLeft: 4,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,       // reduced from 12
  },
  loadingText: {
    marginTop: 12,         // reduced from 16
    fontSize: 14,          // smaller
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
    color: "#ffffff",
    fontWeight: "600",
  },
  noDataText: {
    fontSize: 14,          
    color: "#666",
  },
});
