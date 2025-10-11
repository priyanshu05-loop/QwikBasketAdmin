import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

// ...pendingData from above...
const pendingData = [
  {
    initials: "RK",
    name: "Rajesh Patel",
    business: "Patel Food Corner",
    email: "rajesh.patel@email.com",
    phone: "+91 8850021567",
    location: "Pune, Maharashtra"
  },
  {
    initials: "RK",
    name: "Anita Sharma",
    business: "Sharma Electronics",
    email: "rajesh.patel@email.com",
    phone: "+91 8850021567",
    location: "Pune, Maharashtra"
  },
  {
    initials: "RK",
    name: "Manoj Kumar",
    business: "Kumar Textiles Pvt Ltd",
    email: "rajesh.patel@email.com",
    phone: "+91 8850021567",
    location: "Pune, Maharashtra"
  },
  {
    initials: "RK",
    name: "Sunita Gupta",
    business: "Gupta Medical Store",
    email: "rajesh.patel@email.com",
    phone: "+91 8850021567",
    location: "Pune, Maharashtra"
  },
  {
    initials: "RK",
    name: "Vikram More",
    business: "More Auto Parts",
    email: "rajesh.patel@email.com",
    phone: "+91 8850021567",
    location: "Pune, Maharashtra"
  }
];


const PendingVerificationList = () => (
  <View style={styles.pendingBox}>
    <View style={styles.pendingHeader}>
      <Text style={styles.pendingTitle}>Pending Verification</Text>
      <View style={styles.pendingCountBox}>
        <Text style={styles.pendingCount}>23</Text>
      </View>
    </View>
    <FlatList
      data={pendingData}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{item.initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.business}>{item.business}</Text>
            <Text style={styles.details}>{item.email}</Text>
            <Text style={styles.details}>{item.phone}</Text>
            <Text style={styles.details}>{item.location}</Text>
          </View>
          <TouchableOpacity style={styles.detailsBtn}>
            <Text style={styles.btnText}>VIEW DETAILS</Text>
          </TouchableOpacity>
        </View>
      )}
      style={{ marginTop: hp(2) }}
    />
  </View>
);

export default PendingVerificationList;

// STYLES
const styles = StyleSheet.create({
  pendingBox: {
    margin: wp(5),
    backgroundColor: "#fff",
    borderRadius: wp(3),
    padding: wp(4),
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  pendingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
    justifyContent: "space-between",
  },
  pendingTitle: {
    fontSize: responsiveFontSize(2.1),
    fontWeight: "700",
    color: "#003032",
  },
  pendingCountBox: {
    backgroundColor: "#E84C4F",
    borderRadius: wp(3),
    paddingVertical: hp(0.3),
    paddingHorizontal: wp(3),
  },
  pendingCount: {
    fontSize: responsiveFontSize(2),
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F8F9FA",
    borderRadius: wp(3),
    marginBottom: hp(1.3),
    padding: wp(3),
    borderWidth: 1,
    borderColor: "#EEF0F1",
  },
  initialsCircle: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(8),
    backgroundColor: "#8772F7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
    marginTop: hp(0.2),
  },
  initialsText: {
    fontSize: responsiveFontSize(2.1),
    fontWeight: "bold",
    color: "#fff",
  },
  name: {
    fontSize: responsiveFontSize(1.95),
    fontWeight: "700",
    color: "#24292F",
    marginBottom: hp(0.1),
  },
  business: {
    fontSize: responsiveFontSize(1.67),
    color: "#65A120",
    fontWeight: "600",
    marginBottom: hp(0.3),
  },
  details: {
    color: "#7A7F85",
    fontSize: responsiveFontSize(1.55),
    marginBottom: hp(0.15),
  },
  detailsBtn: {
    backgroundColor: "#7AE97C",
    borderRadius: wp(2),
    paddingHorizontal: wp(3.1),
    paddingVertical: hp(1.2),
    alignSelf: "flex-start",
    marginLeft: wp(3),
  },
  btnText: {
    color: "#116824",
    fontWeight: "bold",
    fontSize: responsiveFontSize(1.5),
  },
});
