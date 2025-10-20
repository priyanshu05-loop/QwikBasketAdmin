import {
  DrawerContentScrollView
} from '@react-navigation/drawer';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, SIZES, typography } from '../constants/Admintheme';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomDrawerContent = (props) => {
  const { state, navigation } = props;
  const { routes, index } = state;
  const focusedRoute = routes[index].name;


  const DRAWER_ITEMS = [
    {
      label: 'Dashboard',
      icon: 'grid-outline',
      routeName: 'Dashboard',
    },
    {
      label: 'Categories',
      icon: 'apps-outline',
      routeName: 'Categories',
    },
    {
      label: 'Products',
      icon: 'cube-outline',
      routeName: 'Products',
    },
    {
        label: 'Customers',
        icon: 'people-outline',
        routeName: 'Customers',
    },
    {
      label: 'Orders',
      icon: 'document-text-outline',
      routeName: 'Orders',
    },
    {
      label: 'Payments',
      icon: 'card-outline',
      routeName: 'Payments',
    },
    {
      label: 'Offers',
      icon: 'gift-outline',
      routeName: 'Offers',
    },
    {
      label: 'Profile',
      icon: 'person-circle-outline',
      routeName: 'Profile',
    },
    {
      label: 'Settings',
      icon: 'settings-outline',
      routeName: 'Settings',
    },
  ];

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Qwikbasket</Text>
        </View>

        <View style={styles.drawerItemsContainer}>
            {DRAWER_ITEMS.map((item) => {
                const isFocused = focusedRoute === item.routeName;
                return (
                    <TouchableOpacity
                        key={item.label}
                        style={[styles.drawerItem, isFocused && styles.drawerItemFocused]}
                        onPress={() => navigation.navigate(item.routeName)}
                    >
                        <Icon 
                            name={item.icon} 
                            size={22} 
                            color={isFocused ? colors.primary : colors.text} 
                            style={styles.icon}
                        />
                        <Text style={[styles.drawerLabel, isFocused && styles.drawerLabelFocused]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>

      </DrawerContentScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.signOutButton} onPress={() => { /* Handle Sign Out */ }}>
            <MaterialCommunityIcons 
                name="logout" 
                size={22} 
                color={colors.textDark} 
                style={styles.signOutIcon}
            />
          <Text style={styles.signOutLabel}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    marginBottom: 10,
  },
  headerTitle: {
    ...typography.titleBold,
    fontSize: 24, // A bit larger for the logo
    color: colors.textDark,
  },
  drawerItemsContainer: {
    paddingHorizontal: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: SIZES.radius,
    marginBottom: 5,
  },
  drawerItemFocused: {
    backgroundColor: colors.primaryLight,
  },
  icon: {
    marginRight: 20,
  },
  drawerLabel: {
    ...typography.paragraphMedium,
    color: colors.text,
    fontSize: 16,
  },
  drawerLabelFocused: {
    color: colors.primary,
    ...typography.paragraphMedium,
     fontSize: 16,
  },
  footer: {
    padding: 20,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    backgroundColor: colors.white,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5F3E4', // A light green color from your design
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: SIZES.radius,
  },
  signOutIcon: {
      marginRight: 15,
      transform: [{ rotate: '180deg'}]
  },
  signOutLabel: {
    ...typography.button,
    color: colors.textDark,
    fontSize: 16,
  },
});

export default CustomDrawerContent;
