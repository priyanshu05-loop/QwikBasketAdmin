import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react';
import { View } from "react-native";
//  Theme
import { SIZES, colors } from '../constants/Admintheme';

//  Screens
import HomeDashboardScreen from "../screens/HomeDashboardScreen";
import LoginScreen from "../screens/LoginScreen";
import OffersScreen from "../screens/OfferScreen";
import VerifyOtpScreen from "../screens/VerifyOtpScreen";
import CustomersScreen from "../screens/customers/CustomersScreen";
import viewCustomerScreen from "../screens/customers/ViewCustomer";
import editCustomer from "../screens/customers/editCustomer";
import OrdersScreen from "../screens/orders/OrdersScreen";
import viewOrder from "../screens/orders/viewOrder";
import AddProduct from "../screens/products/AddProduct";
import ProductsScreen from "../screens/products/productsScreen";
import ViewProductScreen from "../screens/products/viewProduct";
// Custom Drawer Component
import CustomDrawerContent from '../components/CustomDrawerContent';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// --- White Screens (Replace with actual screens) ---
const CategoriesScreen = () => <View style={{flex: 1, backgroundColor: '#fff'}} />;
const PaymentsScreen = () => <View style={{flex: 1, backgroundColor: '#fff'}} />;
const ProfileScreen = () => <View style={{flex: 1, backgroundColor: '#fff'}} />;
const SettingsScreen = () => <View style={{flex: 1, backgroundColor: '#fff'}} />;


function CustomerStackNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="CustomersList" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="CustomersList" component={CustomersScreen} />
      <Stack.Screen name="viewCustomer" component={viewCustomerScreen} />
      <Stack.Screen name="editCustomer" component={editCustomer} />
      
    </Stack.Navigator>
  );
}

function ProductStackNavigator() {
  return (
     <Stack.Navigator 
      initialRouteName="Products-List" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Products-List" component={ProductsScreen} />
      <Stack.Screen 
        name="AddProducts" 
        component={AddProduct} 
        options={{ presentation: 'modal' }}
      />

      <Stack.Screen 
        name="EditProduct" 
        component={AddProduct} 
        options={{ presentation: 'modal' }}
      />

      <Stack.Screen name="ViewProduct" component={ViewProductScreen} />

    </Stack.Navigator>
  );
}

function OrderStackNavigator() {
  return (
     <Stack.Navigator 
      initialRouteName="Order-List" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Order-List" component={OrdersScreen} />
      <Stack.Screen name="ViewOrder" component={viewOrder} />

    </Stack.Navigator>
  );
}


function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        swipeEnabled: true,
        drawerStyle: {
          width: SIZES.width * 0.75,
          backgroundColor: colors.surface,
        }
        
      }}
    >
      <Drawer.Screen name="Dashboard" component={HomeDashboardScreen} />
      <Drawer.Screen name="Categories" component={CategoriesScreen} />
      <Drawer.Screen name="Products" component={ProductStackNavigator} />
      <Drawer.Screen name="Customers" component={CustomerStackNavigator} /> 
      <Drawer.Screen name="Orders" component={OrderStackNavigator} />
      <Drawer.Screen name="Payments" component={PaymentsScreen} />
      <Drawer.Screen name="Offers" component={OffersScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
     
    </Drawer.Navigator>
  );
}


export default function AppNavigation() {

  return (
    <Stack.Navigator 
      initialRouteName="MainApp"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      <Stack.Screen name="MainApp" component={AppDrawer} />
      <Stack.Screen name = "HomeScreen" component={HomeDashboardScreen}/>
      <Stack.Screen name="CustomersList" component={CustomersScreen} />
      <Stack.Screen name="viewCustomer" component={viewCustomerScreen} />
      <Stack.Screen name="editCustomer" component={editCustomer} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="viewOrder" component={viewOrder} />
      <Stack.Screen name="Products" component={ProductsScreen} />
    </Stack.Navigator>

    
  );
}

