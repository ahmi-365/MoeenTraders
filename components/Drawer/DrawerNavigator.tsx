import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  UIManager,
  Platform,
  Animated,
  Easing,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import  MonthYearFilter  from "./MonthYearFilter"; // Assuming this is the standalone component
// Assuming these are your screen components
import HelpCenterScreen from "../../screens/HelpCenterScreen";
import ContactUsScreen from "../../screens/ContactUsScreen";
import HomeScreen from "@/screens/HomeScreen";

// Assuming you have a user store set up with Zustand
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

  const toggleReport = () => {
    const targetValue = expandReport ? 0 : 1;
    setExpandReport(!expandReport);

    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: targetValue === 1 ? 110 : 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: targetValue,
        duration: 250,
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

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
    >
      <View>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={40} color="#FFB800" />
          </View>
          <Text style={styles.userName}>
            {user?.name || (status === "guest" ? "Guest User" : "Unknown User")}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || "guest@example.com"}
          </Text>
        </View>

        <View style={{ padding: 15 }}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("Home")}
          >
            <Ionicons name="speedometer-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={toggleReport}>
            <Ionicons name="document-text-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Data Entry Report</Text>
            <Ionicons
              name={expandReport ? "chevron-up-outline" : "chevron-down-outline"}
              size={20}
              color="#333"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
          <Animated.View
            style={[styles.subMenu, { height: animatedHeight, opacity: animatedOpacity }]}
          >
            <TouchableOpacity
              style={[styles.menuItem, { marginLeft: 5 }]}
              onPress={() => props.navigation.navigate("HelpCenter")}
            >
              <Ionicons name="help-circle-outline" size={20} color="#333" />
              <Text style={styles.subMenuText}>Help Center Report</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, { marginLeft: 5 }]}
              onPress={() => props.navigation.navigate("ContactUs")}
            >
              <Ionicons name="call-outline" size={20} color="#333" />
              <Text style={styles.subMenuText}>Contact Report</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FFB800" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};


// --- Main Drawer Navigator Component ---
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
          color: "#FFB800",
        },
        headerTintColor: "#FFB800",
        drawerStyle: {
          backgroundColor: "#f8f9fa",
          width: 280,
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Ionicons
              name="menu"
              size={30}
              color="#FFB800"
              style={{ marginLeft: 15 }}
            />
          </TouchableOpacity>
        ),
headerRight: () => <MonthYearFilter />,
      })}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Drawer.Screen name="ContactUs" component={ContactUsScreen} />
    </Drawer.Navigator>

  );
};

// --- Styles ---
const styles = StyleSheet.create({
  // --- Drawer Styles ---
  header: {
    backgroundColor: "#FFB800",
    paddingVertical: 30,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  avatar: {
    backgroundColor: "white",
    borderRadius: 50,
    padding: 15,
    marginBottom: 10,
  },
  userName: { color: "white", fontSize: 18, fontWeight: "700" },
  userEmail: { color: "#fff", fontSize: 14, opacity: 0.9 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  menuText: { fontSize: 16, marginLeft: 15, color: "#333", fontWeight: "600" },
  subMenu: { overflow: "hidden", marginLeft: 15 },
  subMenuText: { fontSize: 15, marginLeft: 15, color: "#555" },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: "#eee" },
  logoutBtn: { flexDirection: "row", alignItems: "center" },
  logoutText: { fontSize: 16, marginLeft: 10, color: "#FFB800", fontWeight: "700" },
  
  // --- Filter Button Styles ---
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    borderWidth: 1,
    borderColor: "rgba(255, 184, 0, 0.3)",
  },
  filterText: { color: "#FFB800", fontWeight: "600", marginLeft: 8, fontSize: 14 },
  
  // --- Modal Styles ---
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
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  smallBtn: {
    backgroundColor: "#FFB800",
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 15,
  },
  value: { fontSize: 22, fontWeight: "bold", minWidth: 70, textAlign: "center", color: "#333" },
  applyBtn: {
    backgroundColor: "#FFB800",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 25,
  },

  // --- NEW Circular Month Picker Styles ---
  monthPickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: 'relative',
  },
  centerCircle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 100, // Make it a circle
    borderWidth: 6,
    borderColor: 'rgba(255, 184, 0, 0.2)',
  },
  centerMonthText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFB800',
  },
  centerYearText: {
    fontSize: 16,
    color: '#888',
  },
  monthButton: {
  position: "absolute",  // ✅ ensures proper centering
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
    fontWeight: '600',
    color: '#555',
  },
  selectedMonthButton: {
    backgroundColor: '#FFB800',
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 2,
    elevation: 5,
  },
  selectedMonthText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DrawerNavigator;