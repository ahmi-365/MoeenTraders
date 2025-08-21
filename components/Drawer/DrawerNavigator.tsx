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
import MonthYearFilter from "./MonthYearFilter";
import HomeScreen from "@/screens/HomeScreen";
import ContactUsScreen from "../../screens/ContactUsScreen";
import HelpCenterScreen from "../../screens/HelpCenterScreen";
import { useUserStore } from "../../stores/userStore";

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

  // Calculate the height needed for all submenu items
  const SUBMENU_ITEM_HEIGHT = 50; // Approximate height per item
  const SUBMENU_ITEMS_COUNT = 12; // Total number of submenu items
  const TOTAL_SUBMENU_HEIGHT = SUBMENU_ITEMS_COUNT * SUBMENU_ITEM_HEIGHT;

  const toggleReport = () => {
    const targetValue = expandReport ? 0 : 1;
    setExpandReport(!expandReport);

    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: targetValue === 1 ? TOTAL_SUBMENU_HEIGHT : 0, // ✅ Use calculated height
        duration: 400, // Slightly longer duration for smoother animation
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
    { name: "Purchases", icon: "bag-outline", screen: "HelpCenter" },
    { name: "Purchase Return", icon: "return-up-back-outline", screen: "ContactUs" },
    { name: "Sales", icon: "trending-up-outline", screen: "ContactUs" },
    { name: "Sales Return", icon: "return-down-back-outline", screen: "ContactUs" },
    { name: "Products", icon: "cube-outline", screen: "ContactUs" },
    { name: "Customers", icon: "people-outline", screen: "ContactUs" },
    { name: "Customer Payments", icon: "card-outline", screen: "ContactUs" },
    { name: "Suppliers", icon: "business-outline", screen: "ContactUs" },
    { name: "Supplier Payments", icon: "cash-outline", screen: "ContactUs" },
    { name: "Adjustments", icon: "settings-outline", screen: "ContactUs" },
    { name: "Transfers", icon: "swap-horizontal-outline", screen: "ContactUs" },
    { name: "Expenses", icon: "receipt-outline", screen: "ContactUs" },
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
            <Ionicons name="person-outline" size={28} color="#4CAF50" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.name || (status === "guest" ? "Guest User" : "Superadmin")}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1} ellipsizeMode="tail">
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
<Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={20} color="#555" />
                <Text style={styles.subMenuText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#4CAF50" />
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
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: "#f8f9fa",
          height: 90,
          shadowColor: "transparent",
          elevation: 0,
        },
        
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "600",
          color: "#4CAF50",
        },
        headerTintColor: "#4CAF50",
        drawerStyle: {
          backgroundColor: "#f8f9fa",
          width: 280,
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Ionicons
              name="menu"
              size={30}
              color="#4CAF50"
              style={{ marginLeft: 15 }}
            />
          </TouchableOpacity>
        ),
        headerRight: () => <MonthYearFilter />,
      })}
    >
      <Drawer.Screen name="Dashboard" component={HomeScreen} />
      <Drawer.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Drawer.Screen name="ContactUs" component={ContactUsScreen} />
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
    backgroundColor: "#4CAF50",
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
    marginLeft: "auto"
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
    color: "#4CAF50",
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
    color: "#4CAF50",
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
    color: "#333" 
  },
  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  smallBtn: {
    backgroundColor: "#4CAF50",
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
    backgroundColor: "#4CAF50",
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
    color: "#4CAF50",
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
    backgroundColor: "#4CAF50",
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