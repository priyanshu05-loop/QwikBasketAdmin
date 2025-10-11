// screens/UserDetailsScreen.jsx
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

// Replace with your own icon paths
const userIcon = require("../assets/images/profileIcon.png");
const businessIcon = require("../assets/images/businessIcon.png");
const addressIcon = require("../assets/images/locationIcon.png");

export default function UserDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const data = route.params?.data || {}; // Receive full object

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{data.name}</Text>
        <View style={styles.statusWrap}><Text style={styles.pending}>PENDING</Text></View>
      </View>

      {/* PERSONAL INFO */}
      <View style={styles.section}>
        <View style={styles.sectionIcon}><Image source={userIcon} style={{width: 20, height: 20, resizeMode:"contain"}} /></View>
        <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>
        <View style={styles.row}><Text style={styles.label}>Name</Text><Text style={styles.colon}>:</Text><Text style={styles.value}>{data.name}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Email</Text><Text style={styles.colon}>:</Text><Text style={styles.value}>{data.email}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Phone No.</Text><Text style={styles.colon}>:</Text><Text style={styles.value}>{data.phone}</Text></View>
      </View>

      {/* BUSINESS INFO */}
      <View style={styles.section}>
        <View style={styles.sectionIcon}><Image source={businessIcon} style={{width: 20, height: 20, resizeMode:"contain"}} /></View>
        <Text style={styles.sectionTitle}>BUSINESS INFORMATION</Text>
        <View style={styles.row}><Text style={styles.label}>Business Name</Text><Text style={styles.colon}>:</Text><Text style={styles.value}>{data.business}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Business Type</Text><Text style={styles.colon}>:</Text><Text style={styles.value}>Restaurant</Text></View>
        <View style={styles.row}><Text style={styles.label}>GST Number</Text><Text style={styles.colon}>:</Text><Text style={styles.value}>27ABCDE1234F1Z5</Text></View>
        <View style={styles.row}><Text style={styles.label}>FSSAI License</Text><Text style={styles.colon}>:</Text><Text style={styles.value}>12345678901234</Text></View>
      </View>

      {/* ADDRESS INFO */}
      <View style={styles.section}>
        <View style={styles.sectionIcon}><Image source={addressIcon} style={{width: 20, height: 20, resizeMode:"contain"}} /></View>
        <Text style={styles.sectionTitle}>ADDRESS INFORMATION</Text>
        <View style={styles.row}><Text style={styles.label}>Complete Address</Text><Text style={styles.colon}>:</Text><Text style={styles.value}>Shop No. 15, Ground Floor,Shivaji Market Complex</Text></View>
        <View style={styles.row}><Text style={styles.label}>Landmark</Text><Text style={styles.colon}>:</Text><Text style={styles.value}>Near Metro Station</Text></View>
        <View style={styles.row}><Text style={styles.label}>Pincode</Text><Text style={styles.colon}>:</Text><Text style={styles.value}>400101</Text></View>
        <View style={styles.row}><Text style={styles.label}>City</Text><Text style={styles.colon}>:</Text><Text style={styles.value}>Mumbai</Text></View>
        <View style={styles.row}><Text style={styles.label}>State</Text><Text style={styles.colon}>:</Text><Text style={styles.value}>Maharashtra</Text></View>
        <View style={styles.row}><Text style={styles.label}>Address Type</Text><Text style={styles.colon}>:</Text><Text style={styles.value}>Office</Text></View>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.rejectBtn}>
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.verifyBtn}>
          <Text style={styles.verifyText}>Verified</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    margin: hp(2),
    paddingVertical: hp(2),
    elevation: 3,
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp(2.5),
    marginRight: wp(3),
    marginBottom: hp(2),
    justifyContent:"space-between"
  },
  back: {
    fontSize: responsiveFontSize(3),
    fontWeight: "700",
    color: "#002930",
    marginRight: wp(2.5)
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.3),
    fontWeight: "700",
    color: "#002930",
    flex:1
  },
  statusWrap: {
    backgroundColor: "#FFE3E5",
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
  },
  pending: {
    color: "#DE474A",
    fontWeight: "bold",
    fontSize: responsiveFontSize(1.6),
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: wp(3),
    marginTop: hp(1.5),
    paddingVertical: hp(2),
    paddingHorizontal: wp(2.5),
    borderWidth: 1,
    borderColor: "#E4E9EC",
    elevation: 1,
    marginBottom: hp(1.2),
    position:"relative"
  },
  sectionIcon: {
    position: "absolute",
    left: -wp(7),
    top: hp(2),
    backgroundColor: "#fff",
    borderRadius: 18,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: "bold",
    color: "#1E323B",
    marginBottom: hp(0.8),
    marginLeft: wp(4)
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.0),
    marginLeft: wp(3),
    marginRight: wp(3)
  },
  label: {
    width: wp(27),
    color: "#373A40",
    fontWeight: "700",
    fontSize: responsiveFontSize(1.5),
  },
  colon: {
    width: wp(2),
    textAlign: "center",
    color: "#454950",
    fontWeight: "bold",
  },
  value: {
    flex: 1,
    color: "#585D67",
    fontSize: responsiveFontSize(1.5),
    fontWeight: "400",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp(7),
    marginTop: hp(2),
  },
  rejectBtn: {
    backgroundColor: "#EF6262",
    borderRadius: 10,
    paddingHorizontal: wp(12),
    paddingVertical: hp(1.8)
  },
  rejectText: {
    color: "#fff",
    fontSize: responsiveFontSize(2),
    fontWeight: "700"
  },
  verifyBtn: {
    backgroundColor: "#2EC98D",
    borderRadius: 10,
    paddingHorizontal: wp(12),
    paddingVertical: hp(1.8)
  },
  verifyText: {
    color: "#fff",
    fontSize: responsiveFontSize(2),
    fontWeight: "700"
  }
});
