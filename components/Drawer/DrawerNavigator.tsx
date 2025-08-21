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
import React, { useRef, useState, useCallback } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  Alert,
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
  const [isNavigating, setIsNavigating] = useState(false); // Prevent multiple navigations

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  const SUBMENU_ITEM_HEIGHT = 50; 
  const SUBMENU_ITEMS_COUNT = 12; 
  const TOTAL_SUBMENU_HEIGHT = SUBMENU_ITEMS_COUNT * SUBMENU_ITEM_HEIGHT;

  const toggleReport = useCallback(() => {
    if (isNavigating) return; // Prevent action during navigation
    
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
  }, [expandReport, animatedHeight, animatedOpacity, isNavigating]);

  // Improved navigation handler with error handling
  const handleNavigation = useCallback((screenName: string) => {
    if (isNavigating) return; // Prevent multiple rapid taps

    setIsNavigating(true);
    
    try {
      // Check if the screen exists in the navigator
      const routeNames = props.navigation.getState()?.routeNames || [];
      
      if (routeNames.includes(screenName)) {
        props.navigation.navigate(screenName);
      } else {
        // console.warn(`Screen "${screenName}" not found in navigation stack`);
        Alert.alert('Navigation Error', `Screen "${screenName}" is not available.`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', 'Unable to navigate to the selected screen.');
    } finally {
      // Reset navigation flag after a short delay
      setTimeout(() => {
        setIsNavigating(false);
      }, 500);
    }
  }, [props.navigation, isNavigating]);

  const handleLogout = useCallback(async () => {
    if (isNavigating) return;
    
    try {
      setIsNavigating(true);
      await clearUser();
      
      props.navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Error', 'Unable to logout. Please try again.');
    } finally {
      setIsNavigating(false);
    }
  }, [clearUser, props.navigation, isNavigating]);

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
      contentContainerStyle={styles.drawerContainer}
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
            style={[styles.menuItem, isNavigating && styles.disabledButton]}
            onPress={() => handleNavigation("Dashboard")}
            disabled={isNavigating}
            activeOpacity={0.7}
          >
            <Ionicons name="speedometer-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, isNavigating && styles.disabledButton]} 
            onPress={toggleReport}
            disabled={isNavigating}
            activeOpacity={0.7}
          >
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

          {/* Improved Animated Submenu */}
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
                key={`${item.screen}-${index}`} // Better key prop
                style={[styles.subMenuItem, isNavigating && styles.disabledButton]}
                onPress={() => handleNavigation(item.screen)}
                disabled={isNavigating}
                activeOpacity={0.7}
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
        <TouchableOpacity 
          style={[styles.logoutBtn, isNavigating && styles.disabledButton]} 
          onPress={handleLogout}
          disabled={isNavigating}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF8F3C" />
          <Text style={styles.logoutText}>
            {isNavigating ? "Processing..." : "Logout"}
          </Text>
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
              alignSelf: "flex-end",
            }}
          />
        ),
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.toggleDrawer()}
            activeOpacity={0.7}
          >
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
        unmountOnBlur: false, 
        lazy: false, 
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
  // Updated Drawer Container Styles
  drawerContainer: {
    flexGrow: 1,
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
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 8,
  },
  avatar: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 8,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  userEmail: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.9,
    flexShrink: 1,
  },

  // Updated Menu Item Styles
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 1,
    borderRadius: 8, // Add border radius for better visual feedback
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
    fontWeight: "600",
    flex: 1,
  },
  chevron: {
    marginLeft: "auto",
  },

  // Disabled button style
  disabledButton: {
    opacity: 0.6,
    backgroundColor: "#f0f0f0",
  },

  // Updated Submenu Styles
  subMenu: {
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 8,
    marginTop: 2,
  },
  subMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    minHeight: 48,
    borderRadius: 4, // Add border radius
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
    paddingHorizontal: 10,
    borderRadius: 8, // Add border radius
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#FF8F3C",
    fontWeight: "700",
  },

  // Rest of your existing styles remain the same...
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