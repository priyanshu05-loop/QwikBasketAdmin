// screens/UserDetailsScreen.jsx
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, height } from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography } from '../constants/Admintheme';

const userIcon = require('../assets/images/customers/personal.png');
const businessIcon = require("../assets/images/customers/business.png");
const addressIcon = require("../assets/images/customers/address.png");

export default function UserDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const data = route.params?.data || {};

  return (
    <SafeAreaView  style={styles.safeArea}>
    <View style={styles.container}>

            <View style={styles.header1}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                <Ionicons name="menu" size={28} color={colors.textDark} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle1}>Orders</Text>
                            <View style={styles.headerIcons1}>
                                <TouchableOpacity><Ionicons name="notifications-outline" size={24} color={colors.textDark} /></TouchableOpacity>
                                <TouchableOpacity><Image source={{ uri: 'https://cdn.mos.cms.futurecdn.net/v2/t:0,l:280,cw:720,ch:720,q:80,w:720/ZyiBw5xgHMWSEikFkK3mH8.jpg' }} style={styles.profilePic1} /></TouchableOpacity>
                            </View>
            </View>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
           <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{data.name || "Rajesh Patel"}</Text>
        <View style={styles.statusWrap}>
          <Text style={styles.pending}>PENDING</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PERSONAL INFO */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Image source={userIcon} style={styles.icon} />
            <Text style={styles.cardTitle}>PERSONAL INFORMATION</Text>
          </View>
          <View style={styles.infoRow}><Text style={styles.label}>Name</Text><Text style={styles.value}>{data.name || "Raj Patel"}</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Email</Text><Text style={styles.value}>{data.email || "rajesh.patel@email.com"}</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Phone No.</Text><Text style={styles.value}>{data.phone || "+91 8850021567"}</Text></View>
        </View>

        {/* BUSINESS INFO */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Image source={businessIcon} style={styles.icon} />
            <Text style={styles.cardTitle}>BUSINESS INFORMATION</Text>
          </View>
          <View style={styles.infoRow}><Text style={styles.label}>Business Name</Text><Text style={styles.value}>{data.business || "Patel Food Corner"}</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Business Type</Text><Text style={styles.value}>Restaurant</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>GST Number</Text><Text style={styles.value}>27ABCDE1234F1Z5</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>FSSAI License</Text><Text style={styles.value}>12345678901234</Text></View>
        </View>

        {/* ADDRESS INFO */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Image source={addressIcon} style={styles.icon} />
            <Text style={styles.cardTitle}>ADDRESS INFORMATION</Text>
          </View>
          <View style={styles.infoRow}><Text style={styles.label}>Complete Address</Text><Text style={styles.value}>Shop No. 15, Ground Floor, Shivaji Market Complex</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Landmark</Text><Text style={styles.value}>Near Metro Station</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Pincode</Text><Text style={styles.value}>400101</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>City</Text><Text style={styles.value}>Mumbai</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>State</Text><Text style={styles.value}>Maharashtra</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Address Type</Text><Text style={styles.value}>Office</Text></View>
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
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  safeArea: { flex: 1, backgroundColor: colors.background },

  header1: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    // Use the dynamic typography function and override fontSize as needed
   header1: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: hp(2), paddingHorizontal: wp(4), backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerTitle1: { ...typography.titleBold(height), color: colors.textDark, textAlign: 'center' },
    headerIcons1: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    
    profilePic1: {  marginLeft:10, width: wp(9),   height: wp(9),
        borderRadius: wp(8),
        resizeMode: "cover", },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(5),
    paddingTop: hp(2.5),
    paddingBottom: hp(1),
    backgroundColor: "#fff",
    elevation: 3,
  },
  back: {
    fontSize: responsiveFontSize(3),
    color: "#002930",
    fontWeight: "700",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: responsiveFontSize(2.3),
    fontWeight: "700",
    color: "#002930",
  },
  statusWrap: {
    backgroundColor: "#FFE3E5",
    borderRadius: 20,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
  },
  pending: {
    color: "#DE474A",
    fontWeight: "700",
    fontSize: responsiveFontSize(1.6),
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: wp(5),
    marginTop: hp(2),
    padding: wp(4),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: wp(2),
  },
  cardTitle: {
    fontWeight: "700",
    color: "#1E323B",
    fontSize: responsiveFontSize(1.8),
  },
  infoRow: {
    marginBottom: hp(0.8),
  },
  label: {
    color: "#373A40",
    fontWeight: "700",
    fontSize: responsiveFontSize(1.6),
  },
  value: {
    color: "#585D67",
    fontWeight: "400",
    fontSize: responsiveFontSize(1.6),
    marginTop: hp(0.3),
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp(8),
    marginVertical: hp(3),
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: "#EF6262",
    borderRadius: 10,
    paddingVertical: hp(1.8),
    marginRight: wp(3),
    alignItems: "center",
  },
  verifyBtn: {
    flex: 1,
    backgroundColor: "#2EC98D",
    borderRadius: 10,
    paddingVertical: hp(1.8),
    marginLeft: wp(3),
    alignItems: "center",
  },
  rejectText: {
    color: "#fff",
    fontSize: responsiveFontSize(2),
    fontWeight: "700",
  },
  verifyText: {
    color: "#fff",
    fontSize: responsiveFontSize(2),
    fontWeight: "700",
  },
});
