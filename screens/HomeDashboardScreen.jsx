import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Svg, { Circle, G, Path } from "react-native-svg"; // Corrected import
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/Admintheme';

const statsData = [
  {
    id: "1",
    title: "Total Orders",
    value: "142",
    icon: require("../assets/images/OrderIcon.png"),
    color: "#0047AB",
  },
  {
    id: "2",
    title: "Pending Orders",
    value: "50",
    icon: require("../assets/images/OrderIcon.png"),
    color: "#FF8C00",
  },
  {
    id: "3",
    title: "Total Customers",
    value: "1000",
    icon: require("../assets/images/OrderIcon.png"),
    color: "#E63946",
  },
  {
    id: "4",
    title: "Total Revenue",
    value: "$40,250",
    icon: require("../assets/images/OrderIcon.png"),
    color: "#2E8B57",
  },
  {
    id: "5",
    title: "Total Products",
    value: "5000",
    icon: require("../assets/images/OrderIcon.png"),
    color: "#6A0DAD",
  },
  {
    id: "6",
    title: "Total Categories",
    value: "1000",
    icon: require("../assets/images/OrderIcon.png"),
    color: "#008B8B",
  },
];

const categoryData = [
  { label: "Grains & Pulses", percentage: 48.8, color: "#6A0DAD" },
  { label: "Fresh Fruits", percentage: 12.3, color: "#D3B8E6" },
  { label: "Dairy", percentage: 14.6, color: "#E6D3E6" },
  { label: "Vegetables", percentage: 24.3, color: "#B8AEE6" },
];

const PieChart = () => {
  const radius = wp(20);
  const innerRadius = wp(10);
  const strokeWidth = 10;
  const halfCircle = radius + strokeWidth;
  let startAngle = 0;

  return (
    <Svg width={radius * 2} height={radius * 2}>
      <G rotation={-90} originX={radius} originY={radius}>
        {categoryData.map((item, index) => {
          const angle = (item.percentage / 100) * 360;
          const endAngle = startAngle + angle;
          const x1 = radius + radius * Math.cos((startAngle * Math.PI) / 180);
          const y1 = radius + radius * Math.sin((startAngle * Math.PI) / 180);
          const x2 = radius + radius * Math.cos((endAngle * Math.PI) / 180);
          const y2 = radius + radius * Math.sin((endAngle * Math.PI) / 180);

          const largeArcFlag = angle > 180 ? 1 : 0;

          const pathData = `
            M ${radius} ${radius}
            L ${x1} ${y1}
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
            Z
          `;

          startAngle = endAngle;

          return (
            <G key={index}>
              <Circle cx={radius} cy={radius} r={innerRadius} fill="#fff" />
              <Path d={pathData} fill={item.color} />
            </G>
          );
        })}
      </G>
    </Svg>
  );
};

const HomeDashboardScreen = () => {
  const navigation = useNavigation();
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
              <Ionicons name="notifications-outline" size={24} color={colors.textDark} />
            <Image
              source={require("../assets/images/profileIcon.png")}
              style={styles.profileIcon}
            />
          </View>
        </View>
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.mainContainter}>
        {/* Welcome Message */}
        <Text style={styles.welcomeText}>Welcome John Doe!</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Stats Grid (2 rows × 3 columns fixed) */}
          <View style={styles.gridContainer}>
            {statsData.map((item) => (
              <View key={item.id} style={styles.card}>
                {/* Icon */}
                <View style={styles.iconWrapper}>
                  <Image source={item.icon} style={styles.cardIcon} />
                </View>

                {/* Title & Value */}
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={[styles.cardValue, { color: item.color }]}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          {/* Pending Verification Box */}
          <View style={styles.pendingBox}>
            <View style={styles.pendingHeader}>
              <Text style={styles.pendingTitle}>⚠️ Pending Verification</Text>
              <TouchableOpacity style={styles.verifyBtn}>
                <Text style={styles.verifyBtnText}>Verify Now</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.pendingCount}>23</Text>
            <Text style={styles.pendingSubtitle}>
              Customers awaiting verification
            </Text>
          </View>

          {/* Top Selling Categories */}
          <View style={styles.categoryBox}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>Top Selling Categories</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chartContainer}>
              <PieChart />
              <View style={styles.legendContainer}>
                {categoryData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendColor,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <Text style={styles.legendText}>{item.label}</Text>
                    <Text style={styles.legendPercentage}>
                      {item.percentage}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
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
    height: hp(15),
    backgroundColor: "#FFFFFF",
  },
  headerContent: {
    position: "absolute",
    top: hp(8),
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
  mainContainter: {
    flex: 1,
    width: wp(90),
    alignSelf: "center",
    marginTop: hp(2),
  },
  welcomeText: {
    fontSize: responsiveFontSize(2.6),
    fontWeight: "900",
    color: "#003032",
    marginBottom: hp(2),
  },

  // ✅ Fixed 2 × 3 Grid Styles
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: -hp(0.7), // compensates card marginBottom
  },
  card: {
    width: wp(28), // ✅ fixed width for 3 columns
    height: hp(18), // ✅ fixed height for equal row sizing
    borderRadius: wp(3),
    padding: wp(2),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: hp(1.5), // vertical gap

    // Shadow (iOS) + Elevation (Android)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconWrapper: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(6),
    backgroundColor: "#F1F3F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1),
  },
  cardIcon: {
    width: wp(6.5),
    height: wp(6.5),
    resizeMode: "contain",
  },
  cardTitle: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: "500",
    textAlign: "center",
    marginTop: hp(0.5),
  },
  cardValue: {
    fontSize: responsiveFontSize(2),
    fontWeight: "900",
    textAlign: "center",
    marginTop: hp(0.3),
  },

  // Pending Box
  pendingBox: {
    marginTop: hp(2),
    backgroundColor: "#FFF5F5",
    borderRadius: wp(3),
    padding: wp(5),
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  pendingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1),
  },
  pendingTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: "600",
    color: "#E63946",
  },
  pendingCount: {
    fontSize: responsiveFontSize(4),
    fontWeight: "700",
    color: "#E63946",
    textAlign: "center",
    marginVertical: hp(1),
  },
  pendingSubtitle: {
    fontSize: responsiveFontSize(1.8),
    color: "#333",
    textAlign: "center",
    marginBottom: hp(1),
  },
  verifyBtn: {
    backgroundColor: "#fff",
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  verifyBtnText: {
    color: "#FF6B6B",
    fontSize: responsiveFontSize(2),
    fontWeight: "600",
  },

  // Top Selling Categories
  categoryBox: {
    marginTop: hp(2),
    backgroundColor: "#fff",
    borderRadius: wp(3),
    padding: wp(4),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  categoryTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: "600",
    color: "#1D3557",
  },
  viewAllText: {
    fontSize: responsiveFontSize(1.8),
    color: "#6B7280",
    fontWeight: "500",
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  legendContainer: {
    marginLeft: wp(4),
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
  },
  legendColor: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    marginRight: wp(2),
  },
  legendText: {
    fontSize: responsiveFontSize(1.8),
    color: "#333",
    marginRight: wp(2),
  },
  legendPercentage: {
    fontSize: responsiveFontSize(1.8),
    color: "#6B7280",
    fontWeight: "500",
  },
});
