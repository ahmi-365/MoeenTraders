import HomeScreen from "@/screens/HomeScreen";
import PurchaseEntryReportScreen from "@/screens/SubScreens/PurchaseEntryReportScreen";
import PurchaseReturnEntryReportScreen from "@/screens/SubScreens/PurchaseReturn";
import SalesEntryReportScreen from "@/screens/SubScreens/Sales";
import SalesReturnEntryReportScreen from "@/screens/SubScreens/SalesReturn";
import { Ionicons } from "@expo/vector-icons";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useUserStore } from "../../stores/userStore";
import MonthYearFilter from "./MonthYearFilter";
import { Image } from "react-native-elements";
import Products from "@/screens/SubScreens/Products";
import Customers from "@/screens/SubScreens/Customers";
import CustomersPayments from "@/screens/SubScreens/CustomersPayments";
import Suppliers from "@/screens/SubScreens/Suppliers";
import SuppliersPayments from "@/screens/SubScreens/SuppliersPayments";
import Adjustments from "@/screens/SubScreens/Adjustments";
import Transfers from "@/screens/SubScreens/Transfers";
import Expenses from "@/screens/SubScreens/Expenses";

const Drawer = createDrawerNavigator();

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Custom Drawer Content Component ---
const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { user, status, clearUser } = useUserStore();
  const [expandReport, setExpandReport] = useState(false);

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  const SUBMENU_ITEM_HEIGHT = 50; 
  const SUBMENU_ITEMS_COUNT = 12; 
  const TOTAL_SUBMENU_HEIGHT = SUBMENU_ITEMS_COUNT * SUBMENU_ITEM_HEIGHT;

  const toggleReport = () => {
    const targetValue = expandReport ? 0 : 1;
    setExpandReport(!expandReport);

    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: targetValue === 1 ? TOTAL_SUBMENU_HEIGHT : 0, 
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: targetValue,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleLogout = async () => {
    await clearUser();
    props.navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const subMenuItems = [
    { name: "Purchases", icon: "bag-outline", screen: "PurchaseEntryReport" },
    {
      name: "Purchase Return",
      icon: "return-up-back-outline",
      screen: "PurchaseReturn",
    },
    { name: "Sales", icon: "trending-up-outline", screen: "Sales" },
    {
      name: "Sales Return",
      icon: "return-down-back-outline",
      screen: "SalesReturn",
    },
    { name: "Products", icon: "cube-outline", screen: "Products" },
    { name: "Customers", icon: "people-outline", screen: "Customers" },
    {
      name: "Customer Payments",
      icon: "card-outline",
      screen: "CustomersPayments",
    },
    { name: "Suppliers", icon: "business-outline", screen: "Suppliers" },
    {
      name: "Supplier Payments",
      icon: "cash-outline",
      screen: "SuppliersPayments",
    },
    { name: "Adjustments", icon: "settings-outline", screen: "Adjustments" },
    { name: "Transfers", icon: "swap-horizontal-outline", screen: "Transfers" },
    { name: "Expenses", icon: "receipt-outline", screen: "Expenses" },
  ];

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContainer} // ✅ Updated style
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.drawerContent}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={28} color="#FF8F3C" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.name || (status === "guest" ? "Guest User" : "Superadmin")}
            </Text>
            <Text
              style={styles.userEmail}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user?.email || "admin@example.com"}
            </Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("Dashboard")}
          >
            <Ionicons name="speedometer-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={toggleReport}>
            <Ionicons name="document-text-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Data Entry Report</Text>
            <Ionicons
              name={
                expandReport ? "chevron-up-outline" : "chevron-down-outline"
              }
              size={20}
              color="#333"
              style={styles.chevron}
            />
          </TouchableOpacity>

          {/* ✅ Improved Animated Submenu */}
          <Animated.View
            style={[
              styles.subMenu,
              {
                height: animatedHeight,
                opacity: animatedOpacity,
              },
            ]}
          >
            {subMenuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate(item.screen)}
              >
                <Ionicons
                  name={item.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color="#555"
                />
                <Text style={styles.subMenuText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF8F3C" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation, route }) => ({
        headerStyle: {
          backgroundColor: "#f8f9fa",
          height: 100,
          shadowColor: "transparent",
          elevation: 0,
        },
        headerTintColor: "#FF8F3C",
        drawerStyle: {
          backgroundColor: "#f8f9fa",
          width: 280,
        },
        headerTitle: "",
        headerBackground: () => (
          <Image
            source={require("../../assets/images/header.png")}
            style={{
              width: "80%",
              height: "100%",
              resizeMode: "contain",
              opacity: 0.9,
              marginTop: 14,
              marginRight: 30,
              alignSelf: "flex-end", // ✅ Right align
            }}
          />
        ),

        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Ionicons
              name="menu"
              size={30}
              color="#183284"
              style={{ marginLeft: 15 }}
            />
          </TouchableOpacity>
        ),
        headerRight: () =>
          route.name === "Dashboard" ? <MonthYearFilter /> : null,
      })}
    >
      <Drawer.Screen name="Dashboard" component={HomeScreen} />
      <Drawer.Screen name="Adjustments" component={Adjustments} />
      <Drawer.Screen name="Transfers" component={Transfers} />
      <Drawer.Screen name="Expenses" component={Expenses} />
      <Drawer.Screen name="Suppliers" component={Suppliers} />
      <Drawer.Screen name="SuppliersPayments" component={SuppliersPayments} />
      <Drawer.Screen name="Customers" component={Customers} />
      <Drawer.Screen name="CustomersPayments" component={CustomersPayments} />
      <Drawer.Screen
        name="PurchaseEntryReport"
        component={PurchaseEntryReportScreen}
      />
      <Drawer.Screen
        name="PurchaseReturn"
        component={PurchaseReturnEntryReportScreen}
      />
      <Drawer.Screen name="Sales" component={SalesEntryReportScreen} />
      <Drawer.Screen name="Products" component={Products} />
      <Drawer.Screen
        name="SalesReturn"
        component={SalesReturnEntryReportScreen}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  // ✅ Updated Drawer Container Styles
  drawerContainer: {
    flexGrow: 1, // Allow content to grow
    paddingBottom: 20,
  },
  drawerContent: {
    flex: 1,
  },
  menuContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },

  // Header Styles
  header: {
    backgroundColor: "#FF8F3C",
    paddingVertical: 12, // Reduced from 20
    paddingHorizontal: 15, // Reduced from 20
    flexDirection: "row", // Changed to row layout
    alignItems: "center", // Center items vertically
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 8, // Reduced from 10
  },
  avatar: {
    backgroundColor: "white",
    borderRadius: 30, // Reduced from 40
    padding: 8, // Reduced from 12
    marginRight: 12, // Reduced from 15
  },
  userInfo: {
    flex: 1, // Take remaining space
    justifyContent: "center",
  },
  userName: {
    color: "white",
    fontSize: 16, // Reduced from 18
    fontWeight: "700",
    marginBottom: 2, // Reduced from 4
  },
  userEmail: {
    color: "#fff",
    fontSize: 12, // Reduced from 14
    opacity: 0.9,
    flexShrink: 1, // Allow text to shrink if needed
  },

  // ✅ Updated Menu Item Styles with Reduced Spacing
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8, // ✅ Reduced from 15 to 8
    paddingHorizontal: 10,
    marginVertical: 1, // ✅ Reduced from 2 to 1
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
    fontWeight: "600",
    flex: 1, // Allow text to take available space
  },
  chevron: {
    marginLeft: "auto",
  },

  // ✅ Updated Submenu Styles
  subMenu: {
    overflow: "hidden", // Keep this for smooth animation
    backgroundColor: "#f9f9f9",
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 8,
    marginTop: 2, // ✅ Reduced from 5 to 2
  },
  subMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    minHeight: 48, // Ensure consistent height
  },
  subMenuText: {
    fontSize: 15,
    marginLeft: 12,
    color: "#555",
    fontWeight: "500",
  },

  // Footer Styles
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#f8f9fa",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#FF8F3C",
    fontWeight: "700",
  },

  // Filter Button Styles (keeping original)
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255, 184, 0, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 184, 0, 0.3)",
  },
  filterText: {
    color: "#FF8F3C",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
  },

  // Modal Styles (keeping original)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  smallBtn: {
    backgroundColor: "#FF8F3C",
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 15,
  },
  value: {
    fontSize: 22,
    fontWeight: "bold",
    minWidth: 70,
    textAlign: "center",
    color: "#333",
  },
  applyBtn: {
    backgroundColor: "#FF8F3C",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 25,
  },

  // Circular Month Picker Styles (keeping original)
  monthPickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  centerCircle: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 100,
    borderWidth: 6,
    borderColor: "rgba(255, 184, 0, 0.2)",
  },
  centerMonthText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF8F3C",
  },
  centerYearText: {
    fontSize: 16,
    color: "#888",
  },
  monthButton: {
    position: "absolute",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 1,
    borderColor: "#eee",
  },
  monthText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  selectedMonthButton: {
    backgroundColor: "#FF8F3C",
    borderColor: "rgba(255,255,255,0.5)",
    borderWidth: 2,
    elevation: 5,
  },
  selectedMonthText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default DrawerNavigator;
