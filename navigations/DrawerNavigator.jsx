import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import CustomDrawerContent from "../components/CustomDrawerContent";
import HomeDashboardScreen from "../screens/HomeDashboardScreen";
const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Dashboard" component={HomeDashboardScreen} />
      {/* Add more drawer-linked screens here */}
    </Drawer.Navigator>
  );
}
