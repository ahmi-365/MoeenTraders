import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import InfoCard from "../components/DashboardCard/InfoCard"; 
import PurchasesSalesReport from "../components/DashboardCard/PurchaseSalesGraph";
import SalesReturnReport from "../components/DashboardCard/SalesReturnReport";

export default function HomeScreen() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async (month, year) => {
    try {
      setLoading(true);
      setError(null);

      // 👇 API URL
      const apiUrl = `https://dewan-chemicals.majesticsofts.com/api/dashboard?month=${month}&year=${year}`;
      // 👇 Token (replace with your auth logic / AsyncStorage etc.)
      const token = "YOUR_TOKEN_HERE";

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
       
console.log(response)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load initially
  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    fetchDashboardData(currentMonth, currentYear);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    fetchDashboardData(currentMonth, currentYear);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E5B50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Failed to load data: {error}</Text>
        <Text onPress={onRefresh} style={{ color: "blue", marginTop: 10 }}>
          Retry
        </Text>
      </View>
    );
  }

  if (!dashboardData) {
    return (
      <View style={styles.center}>
        <Text>No data available.</Text>
      </View>
    );
  }

  const widgets = dashboardData.widgets;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="#f8f9fa" barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Dashboard Section */}
        <Text style={styles.sectionTitle}>Dashboard</Text>
        <View style={styles.cardRow}>
          <InfoCard number={widgets.totalProduct} label="Total Products" icon="cube-outline" />
          <InfoCard number={widgets.totalCustomer} label="Total Customers" icon="people-outline" />
        </View>
        <View style={styles.cardRow}>
          <InfoCard number={widgets.totalSupplier} label="Total Suppliers" icon="storefront-outline" />
          <InfoCard number={widgets.totalCategory} label="Total Categories" icon="albums-outline" />
        </View>

        {/* Sales Section */}
        <Text style={styles.sectionTitle}>Sales</Text>
        <View style={styles.cardRow}>
          <InfoCard number={widgets.totalSale} label={`Total Sales (${widgets.totalSaleCount})`} icon="cash-outline" />
          <InfoCard number={widgets.totalSaleReturn} label={`Sales Return (${widgets.totalSaleReturnCount})`} icon="arrow-undo-outline" />
        </View>

        {/* Purchases Section */}
        <Text style={styles.sectionTitle}>Purchases</Text>
        <View style={styles.cardRow}>
          <InfoCard number={widgets.totalPurchase} label={`Total Purchases (${widgets.totalPurchaseCount})`} icon="cart-outline" />
          <InfoCard number={widgets.totalPurchaseReturn} label={`Purchase Return (${widgets.totalPurchaseReturnCount})`} icon="refresh-outline" />
        </View>

        {/* 📊 Charts Section */}
        <PurchasesSalesReport reportData={dashboardData.purchaseAndSaleReport} />
        <SalesReturnReport reportData={dashboardData.saleAndSaleReturnReport} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
    marginBottom: 6,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
