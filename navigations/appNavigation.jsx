import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { widthPercentageToDP as wp } from "react-native-responsive-screen"; // Import wp for drawerStyle
import CustomDrawerContent from "../components/CustomDrawerContent";
import HomeDashboardScreen from "../screens/HomeDashboardScreen";
import LoginScreen from "../screens/LoginScreen";
import VerifyOtpScreen from "../screens/VerifyOtpScreen";

// ⚠️ Note: You need to create placeholder screens for all your drawer items 
// (Categories, Products, Customers, Orders, Payments, Offers, Profile, Settings) 
// and import them here to avoid errors. For this example, I'll use existing screens 
// as temporary placeholders for the drawer routes.
const CategoriesScreen = HomeDashboardScreen; // Placeholder
const ProductsScreen = HomeDashboardScreen;   // Placeholder
const CustomersScreen = HomeDashboardScreen;  // Placeholder
const OrdersScreen = HomeDashboardScreen;     // Placeholder
const PaymentsScreen = HomeDashboardScreen;   // Placeholder
const OffersScreen = HomeDashboardScreen;     // Placeholder
const ProfileScreen = HomeDashboardScreen;    // Placeholder
const SettingsScreen = HomeDashboardScreen;   // Placeholder


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// 1. Create a Stack Navigator for all screens accessible from the Drawer
function MainDrawerScreens() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* These screen names MUST match the 'name' property in the 
        drawerItems array inside your CustomDrawerContent.jsx 
      */}
      <Stack.Screen name="Dashboard" component={HomeDashboardScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="Customers" component={CustomersScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Payments" component={PaymentsScreen} />
      <Stack.Screen name="Offers" component={OffersScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

// 2. Create the Drawer Navigator
function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard" // The initial screen to show inside the drawer stack
      // Use your custom component for the drawer UI
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false, // Hide the default header
        drawerType: "slide",
        drawerStyle: {
          width: wp(75), // Adjust width to match the design (e.g., 75% of screen width)
          backgroundColor: 'transparent', // Important: Allows CustomDrawerContent to manage its own background/styling
        },
        overlayColor: 'rgba(0,0,0,0.5)', // Adds a transparent overlay to the main screen when open
      }}
    >
      {/* The MainDrawerScreens stack is the only item in this drawer navigator */}
      <Drawer.Screen name="Main" component={MainDrawerScreens} />
    </Drawer.Navigator>
  );
}


// 3. Update the Root Stack Navigator (Authentication Flow)
export default function AppNavigation() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      {/* The 'Dashboard' screen is replaced by the 'AppDrawer'. 
        After successful verification, you navigate to 'AppDrawer'.
      */}
      <Stack.Screen name="AppDrawer" component={AppDrawer} />
    </Stack.Navigator>
  );
}