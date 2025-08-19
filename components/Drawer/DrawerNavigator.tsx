import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  UIManager,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";

import HelpCenterScreen from "../../screens/HelpCenterScreen";
import ContactUsScreen from "../../screens/ContactUsScreen";
import { useUserStore } from "../../stores/userStore";
import HomeScreen from "@/screens/HomeScreen";

const Drawer = createDrawerNavigator();

// enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { user, status, clearUser } = useUserStore(); 
  const [expandReport, setExpandReport] = useState(false);

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  const toggleReport = () => {
    const toValue = expandReport ? 0 : 110; 
    setExpandReport(!expandReport);
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: expandReport ? 0 : 1,
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
        {/* Header */}
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

        {/* Custom Menu */}
        <View style={{ padding: 15 }}>
          {/* Dashboard */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("Home")}
          >
            <Ionicons name="speedometer-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Dashboard</Text>
          </TouchableOpacity>

          {/* Data Entry Report with Expandable */}
          <TouchableOpacity style={styles.menuItem} onPress={toggleReport}>
            <Ionicons name="document-text-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Data Entry Report</Text>
            <Ionicons
              name={
                expandReport ? "chevron-up-outline" : "chevron-down-outline"
              }
              size={20}
              color="#333"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
          <Animated.View
            style={[
              styles.subMenu,
              { height: animatedHeight, opacity: animatedOpacity },
            ]}
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

      {/* Logout Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FFB800" />
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
          color: "#FFB800",
        },
        headerTintColor: "#FFB800",
        drawerStyle: {
          backgroundColor: "#f8f9fa",
          width: 260,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "600",
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Ionicons
              name="menu"
              size={30}
              color="#FFB800"
              style={{ marginLeft: 12 }}
            />
          </TouchableOpacity>
        ),
      })}
    >
            <Drawer.Screen name="Home" component={HomeScreen} />

      <Drawer.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Drawer.Screen name="ContactUs" component={ContactUsScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
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
  userName: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  userEmail: {
    color: "#fff",
    fontSize: 14,
    marginTop: 2,
    opacity: 0.9,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
    fontWeight: "600",
  },
  subMenu: {
    overflow: "hidden",
  },
  subMenuText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
    fontWeight: "400",
  },

  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#FFB800",
    fontWeight: "700",
  },
});

export default DrawerNavigator;
