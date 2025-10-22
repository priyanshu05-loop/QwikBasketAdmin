import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
// --- THEME & DATA IMPORTS ---
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors, SIZES, typography } from '../../constants/Admintheme';



// --- DUMMY BACKEND CALL ---
// This simulates fetching detailed data for a single customer by their ID.
const fetchCustomerDetails = async (customerId) => {
  console.log(`Fetching details for customer ID: ${customerId}...`);
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // In a real app, you would fetch this data from your database.
  // This is a complete data structure matching your design.
  return {
    id: customerId,
    name: 'Rajesh Patel',
    status: 'Pending',
    personalInfo: {
      name: 'Rajesh Patel',
      email: 'rajesh.patel@email.com',
      phone: '+91 8850021567',
    },
    businessInfo: {
      name: 'Patel Food Corner',
      type: 'Restaurant',
      gst: '27ABCDE1234F1Z5',
      fssai: '12345678901234',
    },
    addressInfo: {
      completeAddress: 'Shop No. 15, Ground Floor, Shivaji Market Complex',
      landmark: 'Near Metro Station',
      pincode: '400101',
      city: 'Mumbai',
      state: 'Maharashtra',
      addressType: 'Office',
    },
    transactionHistory: [
      { id: '1', orderNo: '#15935', status: 'Approved', amount: 12345, rewards: 120, date: '14 Dec 2020, 8:43 pm' },
      { id: '2', orderNo: '#15935', status: 'Approved', amount: 2345, rewards: 34, date: '14 Dec 2020, 8:43 pm' },
      { id: '3', orderNo: '#15935', status: 'Approved', amount: 345, rewards: 987, date: '14 Dec 2020, 8:43 pm' },
      { id: '4', orderNo: '#15935', status: 'Pending', amount: 7654, rewards: 56, date: '14 Dec 2020, 8:43 pm' },
      { id: '5', orderNo: '#15935', status: 'Approved', amount: 98, rewards: 98, date: '14 Dec 2020, 8:43 pm' },
      { id: '6', orderNo: '#15935', status: 'Approved', amount: 678, rewards: 56, date: '14 Dec 2020, 8:43 pm' },
    ],
  };
};





// --- Main View Customer Screen Component ---
const ViewCustomerScreen = ({ navigation, route }) => {
  const [customerData, setCustomerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
    const { height } = useWindowDimensions();
     const styles = useMemo(() => createDynamicStyles(height), [height]);
  
  // This would be passed from the Customers list screen
  const { customerId } = route.params || { customerId: '1' }; 

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCustomerDetails(customerId);
      setCustomerData(data);
      setIsLoading(false);
    };
    loadData();
  }, [customerId]);

  if (isLoading || !customerData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={{padding: 20, flexDirection: 'row', alignItems: 'center'}}><TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.textDark} /></TouchableOpacity></View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const { personalInfo, businessInfo, addressInfo, transactionHistory } = customerData;
  const isPending = customerData.status === 'Pending';

const AdminHeader = () => (
    <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customers</Text>
        <View style={styles.headerIcons}>
            <TouchableOpacity><Ionicons name="notifications-outline" size={24} color={colors.textDark} /></TouchableOpacity>
            <TouchableOpacity><Image source={{ uri: 'https://cdn.mos.cms.futurecdn.net/v2/t:0,l:280,cw:720,ch:720,q:80,w:720/ZyiBw5xgHMWSEikFkK3mH8.jpg' }} style={styles.profilePic} /></TouchableOpacity>
        </View>
    </View>

);

const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

const InfoSection = ({ iconSource, title, children }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Image source={iconSource} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.sectionBody}>
            {children}
        </View>
    </View>
);

const TransactionRow = ({ item }) => {
    const isPending = item.status === 'Pending';
    return (
        <View style={styles.transactionRow}>
            <Text style={[styles.transactionCell, { flex: 1.5 }]}>{item.orderNo}</Text>
            <View style={[styles.transactionCell, { flex: 1.5, alignItems: 'flex-start' }]}>
                <Text style={[styles.statusBadge, isPending ? styles.pendingBadge : styles.approvedBadge]}>{item.status}</Text>
            </View>
            <Text style={[styles.transactionCell, { flex: 1.5 }]}>₹{item.amount.toLocaleString('en-IN')}</Text>
            <Text style={[styles.transactionCell, { flex: 1 }]}>{item.rewards}</Text>
            <Text style={[styles.transactionCell, { flex: 2.5, textAlign: 'right' }]}>{item.date}</Text>
        </View>
    );
};



  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <AdminHeader></AdminHeader>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* --- CUSTOMER HEADER --- */}
        <View style={styles.customerHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={colors.textDark} />
            </TouchableOpacity>
            <Text style={styles.customerHeaderName}>{customerData.name}</Text>
            <Text style={[styles.customerStatus, isPending ? styles.pendingBadge : styles.approvedBadge]}>{customerData.status}</Text>
        </View>

        {/* --- INFORMATION SECTIONS --- */}
        <InfoSection iconSource={require('../../assets/images/customers/personal.png')} title="PERSONAL INFORMATION">
            <InfoRow label="Name" value={personalInfo.name} />
            <InfoRow label="Email" value={personalInfo.email} />
            <InfoRow label="Phone No." value={personalInfo.phone} />
        </InfoSection>

        <InfoSection iconSource={require('../../assets/images/customers/business.png')} title="BUSINESS INFORMATION">
            <InfoRow label="Business Name" value={businessInfo.name} />
            <InfoRow label="Business Type" value={businessInfo.type} />
            <InfoRow label="GST Number" value={businessInfo.gst} />
            <InfoRow label="FSSAI License" value={businessInfo.fssai} />
        </InfoSection>
        
        <InfoSection iconSource={require('../../assets/images/customers/address.png')} title="ADDRESS INFORMATION">
            <InfoRow label="Complete Address" value={addressInfo.completeAddress} />
            <InfoRow label="Landmark" value={addressInfo.landmark} />
            <InfoRow label="Pincode" value={addressInfo.pincode} />
            <InfoRow label="City" value={addressInfo.city} />
            <InfoRow label="State" value={addressInfo.state} />
            <InfoRow label="Address Type" value={addressInfo.addressType} />
        </InfoSection>

        {/* --- TRANSACTION HISTORY --- */}
        <InfoSection iconSource={require('../../assets/images/customers/transaction.png')} title="TRANSACTION HISTORY">
            {/* Table Header */}
            <View style={styles.transactionHeader}>
                <Text style={[styles.transactionHeaderCell, { flex: 1.5 }]}>Order no.</Text>
                <Text style={[styles.transactionHeaderCell, { flex: 1.5 }]}>Status</Text>
                <Text style={[styles.transactionHeaderCell, { flex: 1.5 }]}>Amount</Text>
                <Text style={[styles.transactionHeaderCell, { flex: 1 }]}>Rewards</Text>
                <Text style={[styles.transactionHeaderCell, { flex: 2.5, textAlign: 'right' }]}>Date</Text>
            </View>
            {/* Table Rows */}
            {transactionHistory.map(item => <TransactionRow key={item.id} item={item} />)}
        </InfoSection>

      </ScrollView>
    </SafeAreaView>
  );
};

const createDynamicStyles = (height) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: hp(2), paddingHorizontal: wp(4), backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
        headerTitle: { ...typography.titleBold(height), color: colors.textDark, textAlign: 'center' },
        headerIcons: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
        
        profilePic: {  marginLeft:10, width: wp(9),   height: wp(9),
            borderRadius: wp(8),
            resizeMode: "cover", },

            
    scrollContainer: { padding: SIZES.padding, paddingBottom: 40 },
    customerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SIZES.padding,
        backgroundColor: colors.surface,
        borderRadius: SIZES.radius,
        marginBottom: SIZES.padding,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    customerHeaderName: {
        ...typography.titleBold(height),
        flex: 1,
        textAlign: 'center',
    },
    customerStatus: {
        ...typography.label(height),
        fontWeight: 'bold',
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 20,
        overflow: 'hidden',
    },
    approvedBadge: {
        backgroundColor: colors.accent,
        color: colors.surface,
    },
    pendingBadge: {
        backgroundColor: colors.warning,
        color: colors.surface,
    },
    section: {
        marginBottom: SIZES.padding,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        marginRight: 12,
    },
    sectionTitle: {
        ...typography.titleBold(height),
        // Overriding the default size to be smaller as intended
        fontSize: RFValue(16, height),
        color: colors.textDark,
    },
    sectionBody: {
        backgroundColor: colors.surface,
        borderRadius: SIZES.radius,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    infoLabel: {
        ...typography.paragraphRegular(height),
        color: colors.textLight,
    },
    infoValue: {
        ...typography.paragraphMedium(height),
        color: colors.textDark,
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
    },
    transactionHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: 10,
        marginBottom: 5,
    },
    transactionHeaderCell: {
        ...typography.label1(height),
        color: colors.textLight,
    },
    transactionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    transactionCell: {
        ...typography.label(height),
        color: colors.textDark,
    },
    statusBadge: {
        ...typography.label(height),
        fontWeight: 'bold',
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 20,
        overflow: 'hidden',
        // Overriding with a very small font size as intended
        fontSize: RFValue(10, height),
    },
});

export default ViewCustomerScreen;
