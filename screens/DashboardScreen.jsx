import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import PendingVerificationList from "../components/PendingVerificationList ";
const DashboardScreen = () => {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.rectangleBox}></View>
        <View style={styles.headerContent}>
          {/* Left: Menu - 3. Wrap in TouchableOpacity and call openDrawer */}
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
              source={require("../assets/images/menuIcon.png")}
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* Center: Title */}
          <Text style={styles.title}>Dashboard</Text>

          {/* Right: Notification + Profile */}
          <View style={styles.rightPart}>
            <Image
              source={require("../assets/images/bellIcon.png")}
              style={styles.icon}
            />
            <Image
              source={require("../assets/images/profileIcon.png")}
              style={styles.profileIcon}
            />
          </View>
        </View>
      </View>
      <PendingVerificationList  />
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "relative",
    width: wp(100),
    height: hp(20),
  },
  rectangleBox: {
    position: "absolute",
    top: 0,
    left: 0,
    width: wp(100),
    height: hp(16),
    backgroundColor: "#f5f1f1ff",
  },
  headerContent: {
    position: "absolute",
    top: hp(8.5),
    left: wp(5),
    right: wp(5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: wp(90),
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: responsiveFontSize(2.8),
    fontWeight: "900",
    color: "#003032",
  },
  rightPart: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3.2),
  },
  icon: {
    width: wp(6),
    height: wp(6),
    resizeMode: "contain",
  },
  profileIcon: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4),
    resizeMode: "cover",
  },
});
