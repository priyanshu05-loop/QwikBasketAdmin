import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../screens/DashboardScreen";
import LoginScreen from "../screens/LoginScreen";
import VerifyOtpScreen from "../screens/VerifyOtpScreen";
import DrawerNavigator from "./DrawerNavigator";
const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <Stack.Navigator initialRouteName="Dash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      <Stack.Screen name="Dash" component={DashboardScreen} />
      {/* The Drawer is used for "logged in" screens */}
      <Stack.Screen name="Home" component={DrawerNavigator} />


    </Stack.Navigator>
  );
}
