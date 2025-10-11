import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Example icon imports. Update these paths and icons as needed:
const icons = {
  Dashboard: require("../assets/images/CategoriesIcon.png"),
  Categories: require("../assets/images/CategoriesIcon.png"),
  Products: require("../assets/images/CategoriesIcon.png"),
  Customers: require("../assets/images/CategoriesIcon.png"),
  Orders: require("../assets/images/CategoriesIcon.png"),
  Payments: require("../assets/images/CategoriesIcon.png"),
  Offers: require("../assets/images/CategoriesIcon.png"),
  Profile: require("../assets/images/CategoriesIcon.png"),
  Settings: require("../assets/images/CategoriesIcon.png"),
};

const drawerItems = [
  { label: "Dashboard", icon: icons.Dashboard, screen: "Dash" },
  { label: "Categories", icon: icons.Categories },
  { label: "Products", icon: icons.Products },
  { label: "Customers", icon: icons.Customers },
  { label: "Orders", icon: icons.Orders },
  { label: "Payments", icon: icons.Payments },
  { label: "Offers", icon: icons.Offers },
  { label: "Profile", icon: icons.Profile },
  { label: "Settings", icon: icons.Settings },
];

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Qwikbasket</Text>
        </View>
        <View style={{ flex: 1, marginTop: 18 }}>
          {drawerItems.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.drawerItem,
                props.state.index === idx && styles.selectedDrawerItem,
              ]}
              onPress={() => {
                if (item.screen) navigation.navigate(item.screen);
              }}
            >
              <Image source={item.icon} style={styles.drawerIcon} />
              <Text
                style={[
                  styles.drawerLabel,
                  props.state.index === idx && styles.selectedDrawerLabel,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </DrawerContentScrollView>
      {drawerItems.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            styles.drawerItem,
            props.state.index === idx && styles.selectedDrawerItem,
          ]}
          onPress={() => {
            if (item.screen) navigation.navigate(item.screen);
          }}
        >
          <Image source={item.icon} style={styles.drawerIcon} />
          <Text
            style={[
              styles.drawerLabel,
              props.state.index === idx && styles.selectedDrawerLabel,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 24,
    paddingBottom: 12,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#123234",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedDrawerItem: {
    backgroundColor: "#F0F5FB",
  },
  drawerIcon: {
    width: 22,
    height: 22,
    marginRight: 18,
    resizeMode: "contain",
  },
  drawerLabel: {
    fontSize: 16,
    color: "#222C2F",
    fontWeight: "600",
  },
  selectedDrawerLabel: {
    color: "#00624A",
  },
  signOut: {
    margin: 22,
    backgroundColor: "#DEF7D6",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  signOutText: {
    color: "#225B10",
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default CustomDrawerContent;
