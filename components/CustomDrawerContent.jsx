import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";

// --- Custom Icon Component ---
const DrawerIcon = ({ name, focused }) => {
  let iconSource;
  // NOTE: REPLACE THESE PLACEHOLDER PATHS WITH YOUR ACTUAL ICON ASSET PATHS
  switch (name) {
    case "Dashboard":
      iconSource = require("../assets/images/homeIcon.png"); // Example path✅
      break;
    case "Categories":
      iconSource = require("../assets/images/CategoriesIcon.png"); // Example path✅
      break;
    case "Products":
      iconSource = require("../assets/images/ProductsIcon.png"); // Example path
      break;
    case "Customers":
      iconSource = require("../assets/images/CustomersIcon.png"); // Example path
      break;
    case "Orders":
      iconSource = require("../assets/images/OrdersIcon.png"); // Example path
      break;
    case "Payments":
      iconSource = require("../assets/images/PaymentsIcon.png"); // Example path
      break;
    case "Offers":
      iconSource = require("../assets/images/OffersIcon.png"); // Example path
      break;
    case "Profile":
      iconSource = require("../assets/images/ProfileIcon.png"); // Example path
      break;
    case "Settings":
      iconSource = require("../assets/images/SettingsIcon.png"); // Example path
      break;
    default:
      iconSource = null;
  }

  if (!iconSource) return null;

  return (
    <Image
      source={iconSource}
      style={[
        styles.icon,
        // The active item is styled with F0F5E9 background and #003032 text/icon color
        { tintColor: focused ? "#003032" : "#808080" },
      ]}
    />
  );
};

// --- Drawer Menu Items Data ---
const drawerItems = [
  { name: "Dashboard", label: "Dashboard", iconName: "Dashboard" },
  { name: "Categories", label: "Categories", iconName: "Categories" },
  { name: "Products", label: "Products", iconName: "Products" },
  { name: "Customers", label: "Customers", iconName: "Customers" },
  { name: "Orders", label: "Orders", iconName: "Orders" },
  { name: "Payments", label: "Payments", iconName: "Payments" },
  { name: "Offers", label: "Offers", iconName: "Offers" },
  { name: "Profile", label: "Profile", iconName: "Profile" },
  { name: "Settings", label: "Settings", iconName: "Settings" },
];

const CustomDrawerContent = (props) => {
  const currentRouteName = props.state.routeNames[props.state.index];

  return (
    <View style={styles.drawerContainer}>
      {/* Drawer Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>Qwikbasket</Text>
      </View>

      {/* Drawer Items ScrollView */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0, paddingHorizontal: wp(2) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listContainer}>
          {drawerItems.map((item, index) => {
            // Check if the current item is the active route
            const isActive = currentRouteName === item.name;

            return (
              <DrawerItem
                key={index}
                label={() => (
                  <Text
                    style={[
                      styles.drawerLabel,
                      {
                        fontWeight: isActive ? "800" : "500",
                        color: isActive ? "#003032" : "#333",
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                )}
                icon={({ focused }) => (
                  <DrawerIcon name={item.iconName} focused={isActive} />
                )}
                onPress={() => props.navigation.navigate("AppDrawer", { screen: item.name })} // Navigate to the screen inside the Drawer Stack
                style={[
                  styles.drawerItem,
                  isActive && styles.activeItem,
                ]}
                // Custom colors to match UI
                pressColor="rgba(0, 48, 50, 0.1)" // A slight dark shadow on press
              />
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={() => {
          // Navigate back to the login screen
          props.navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }}
      >
        <Image
          source={require("../assets/images/signoutIcon.png")} // Placeholder icon
          style={styles.signOutIcon}
        />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#fff", 
    borderRadius: wp(5), // Add rounded corners to the whole drawer
    overflow: 'hidden', // Ensures the border radius works
    // Apply a slight shadow on the right edge to mimic the screen separation
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  header: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(2),
    marginTop: hp(5),
  },
  logoText: {
    fontSize: responsiveFontSize(3),
    fontWeight: "900",
    color: "#003032",
  },
  listContainer: {
    paddingTop: hp(1),
    paddingBottom: hp(2),
  },
  drawerItem: {
    marginHorizontal: wp(3),
    marginVertical: hp(0.5),
    paddingHorizontal: wp(2),
    borderRadius: wp(1.5), // Small border radius for the item background
    height: hp(6),
    justifyContent: 'center',
  },
  activeItem: {
    backgroundColor: "#F0F5E9", // Light green background for active item
  },
  icon: {
    width: wp(5),
    height: wp(5),
    resizeMode: "contain",
    marginRight: wp(-3), 
  },
  drawerLabel: {
    fontSize: responsiveFontSize(1.9),
    marginLeft: wp(3), 
    paddingVertical: 0,
  },
  // Sign Out Button Styles
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#AEDC81", 
    borderRadius: wp(3),
    paddingVertical: hp(1.5),
    marginHorizontal: wp(5),
    marginBottom: hp(3), // Increased bottom margin
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  signOutIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: "contain",
    tintColor: "#003032",
    marginRight: wp(2),
  },
  signOutText: {
    fontSize: responsiveFontSize(2),
    fontWeight: "700",
    color: "#003032",
  },
});