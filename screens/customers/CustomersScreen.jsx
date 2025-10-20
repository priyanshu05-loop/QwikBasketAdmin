import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- THEME & DATA IMPORTS ---
import { colors, SIZES, typography } from '../../constants/Admintheme';

// --- DUMMY BACKEND CALL ---

const fetchCustomers = async () => {
  console.log("Fetching customers from backend...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: '1', name: 'Rajesh Patel', email: 'rajesh.patel@gmail.com', businessName: 'Patel Food Corner', phone: '+91 8850021548', status: 'Verified', businessType: 'Restaurant', location: 'Mumbai, Maharashtra', creditDays: 45 },
    { id: '2', name: 'Anita Sharma', email: 'anita.sharma@example.com', businessName: 'Sharma Provisions', phone: '+91 9876543210', status: 'Verified', businessType: 'Retail', location: 'Delhi', creditDays: 12},
    { id: '3', name: 'Manoj Kumar', email: 'manoj.kumar@factory.co', businessName: 'Kumar Manufacturing', phone: '+91 8887776665', status: 'Verified', businessType: 'Manufacturing', location: 'Bangalore', creditDays: 1 },
    { id: '4', name: 'Priya Singh', email: 'priya.singh@service.net', businessName: 'Singh Catering', phone: '+91 9988776655', status: 'Pending', businessType: 'Catering', location: 'Chennai', creditDays: 0 },
  ];
};

// --- Main Customers Screen Component ---
const CustomersScreen = ({ navigation }) => {
  const [allCustomers, setAllCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [layout, setLayout] = useState('grid'); // 'grid' or 'list'

 const { height } = useWindowDimensions();
 const styles = useMemo(() => createDynamicStyles(height), [height]);

  // Fetch data when the component mounts
  useEffect(() => {
    const loadCustomers = async () => {
      const data = await fetchCustomers();
      setAllCustomers(data);
      setFilteredCustomers(data);
      setIsLoading(false);
    };
    loadCustomers();
  }, []);

  // Filter customers whenever the search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCustomers(allCustomers);
    } else {
      const filtered = allCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.businessName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, allCustomers]);
  
  const handleDelete = useCallback((customerId) => {
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {
            // for backend integration, we would call a backend API here.
            // For now, we'll just update the local state.
            const newCustomers = allCustomers.filter(c => c.id !== customerId);
            setAllCustomers(newCustomers);
          } 
        }
      ]
    );
  }, [allCustomers]);

  const activeCustomers = useMemo(() => allCustomers.filter(c => c.status === 'Verified').length, [allCustomers]);


const SummaryCard = ({ count, label, iconSource }) => (
    <View style={styles.summaryCard}>
        <View style={styles.summaryIconContainer}>
            <Image source={iconSource}  />
        </View>
        <Text style={styles.summaryCount}>{count}</Text>
        <Text style={styles.summaryLabel}>{label}</Text>
    </View>
);
 
//Grid View of Customers
const CustomerCard = ({ item, onView, onEdit, onDelete }) => (
    <View style={styles.customerCard}>
        <View style={styles.cardHeader}>
            <View style={styles.customerInitialCircle}>
                <Text style={styles.customerInitialText}>{item.name.split(' ').map(n=>n[0]).join('')}</Text>
            </View>
            <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{item.name}</Text>
                <Text style={styles.customerBusiness}>{item.businessName}</Text>
                <Text style={styles.customerPhone}>{item.phone}</Text>
            </View>
            <Text style={[styles.statusBadge, item.status === 'Verified' && styles.verifiedBadge]}>{item.status}</Text>
        </View>
        <View style={styles.cardBody}>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Business type</Text>
                <Text style={styles.infoValue}>{item.businessType}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{item.location}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Credit Days</Text>
                <Text style={[styles.infoValue, { fontWeight: 'bold' }]}>{item.creditDays.toLocaleString('en-IN')} Days Left</Text>
            </View>
        </View>
        <View style={styles.cardFooter}>
            <TouchableOpacity style={[styles.actionButton, styles.viewButton]} onPress={onView}>
                <Feather name="eye" size={16} color={colors.white} />
                <Text style={styles.actionButtonText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={onEdit}>
                <Feather name="edit-2" size={16} color={colors.white} />
                <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
                <Feather name="trash-2" size={16} color={colors.white} />
                <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    </View>
)

// List View of Customers
const CustomerListItem = ({ item, onView, onEdit, onDelete }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollableTextContainer}>
    <View style={styles.listItemContainer}>
        {/* coloum 1 : Customer (Now Horizontally Scrollable) */}
        <View style={styles.listColumnCustomer}>
            <View style={styles.customerInitialCircle1}>
                <Text style={styles.customerInitialText1}>{item.name.split(' ').map(n=>n[0]).join('')}</Text>
            </View>
            {/*  Wrapped in a ScrollView to allow seeing full text */}
            
                <View style={styles.listItemTextWrapper}>
                    <Text style={styles.customerName1}>{item.name}</Text>
                    <Text style={styles.customerEmail1}>{item.email}</Text>
                </View>
            
        </View>
        {/* Column 2: Business (Now Horizontally Scrollable) */}
        <View style={styles.listColumnBusiness}>
            
                <View style={styles.listItemTextWrapper}>
                    <Text style={styles.listItemText}>{item.businessName}</Text>
                    <Text style={styles.listItemSubText}>{item.businessType}</Text>
                </View>
            
        </View>
        {/* Column 3: Status */}
        <View style={styles.listColumnStatus}>
            <Text style={[styles.statusBadge1, item.status === 'Verified' && styles.verifiedBadge1]}>{item.status}</Text>
        </View>
        {/* Column 4: Credit */}
        <View style={styles.listColumnCredit}>
            <Text style={styles.listItemText}>{item.creditDays.toLocaleString('en-IN')}</Text>
        </View>
        {/* Column 5: Actions */}
        <View style={styles.listColumnActions}>
            <TouchableOpacity style={[styles.actionButton1, styles.viewButton]} onPress={onView}>
                <Feather name="eye" size={10} color={colors.white} />
                
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton1, styles.editButton]} onPress={onEdit}>
                <Feather name="edit-2" size={10} color={colors.white} />
               
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton1, styles.deleteButton]} onPress={onDelete}>
                <Feather name="trash-2" size={10} color={colors.white} />
            </TouchableOpacity>
          </View>
    </View>
    </ScrollView>
);


// --- List View Header ---
const ListViewHeader = () => (
    <View style={styles.listViewHeader}>
        <Text style={[styles.headerColumn, { flex: 3.5 }]}>Customers</Text>
        <Text style={[styles.headerColumn, { flex: 2.5 }]}>Business</Text>
        <Text style={[styles.headerColumn, { flex: 1.5, textAlign: 'center' }]}>Status</Text>
        <Text style={[styles.headerColumn, { flex: 2, textAlign: 'center' }]}>Credit</Text>
        <Text style={[styles.headerColumn, { flex: 2, textAlign: 'center' }]}>Actions</Text>
    </View>
);



  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
         {/*Header*/}
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

      
      <FlatList
        data={filteredCustomers}
        keyExtractor={item => item.id}
        key={layout}  //The key changes when the layout changes, forcing a re-render.
        renderItem={({ item }) =>
            layout === 'grid' ? (
                <CustomerCard 
                    item={item} 
                    onDelete={() => handleDelete(item.id)}
                    onView={() => navigation.navigate('viewCustomer', { customerId: item.id })}
                    onEdit={() => navigation.navigate('editCustomer', { customer: item.id })}
                />
            ) : (
                <CustomerListItem
                    item={item}
                    onDelete={() => handleDelete(item.id)}
                    onView={() => navigation.navigate('viewCustomer', { customerId: item.id })}
                    onEdit={() => navigation.navigate('editCustomer', { customer: item.id })}
                />
            )
        }
        ListHeaderComponent={
            <>
                <View style={styles.summaryContainer}>
                   <SummaryCard count={allCustomers.length} label="Total Customers" iconSource={require('../../assets/images/CustomersIcon.png')} />
                   <SummaryCard count={activeCustomers} label="Active Customers" iconSource={require('../../assets/images/ActiveIcon.png')} />
                </View>

                <View style={styles.searchAndLayoutContainer}>
                    <View style={styles.searchInputContainer}>
                        <Ionicons name="search" size={20} color={colors.textLight} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Customers..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor={colors.textLight}
                        />
                    </View>
                    <View style={styles.layoutToggleContainer}>
                        <TouchableOpacity onPress={() => setLayout('grid')} style={[styles.layoutButton, layout === 'grid' && styles.activeLayout]}>
                            <Ionicons name="grid" size={18} color={layout === 'grid' ? colors.white : colors.textLight} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setLayout('list')} style={[styles.layoutButton, layout === 'list' && styles.activeLayout]}>
                            <Ionicons name="list" size={18} color={layout === 'list' ? colors.white : colors.textLight} />
                        </TouchableOpacity>
                    </View>
                </View>
                
                {isLoading && <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }}/>}
                 {/* The list view header is conditionally render */}
                {layout === 'list' && !isLoading && <ListViewHeader />} 
            
            </>
        }
        contentContainerStyle={styles.listContainer}
      />
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
    // --- END OF HEADER STYLES ---

    summaryContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 5, marginBottom: 20, marginTop: 20 },
    summaryCard: { flex: 1, backgroundColor: colors.surface, padding: 10, borderRadius: SIZES.radius, marginHorizontal: 5, alignItems: 'center' },
    summaryIconContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    summaryCount: { ...typography.titleBold(height), color: colors.textDark },
    summaryLabel: { ...typography.paragraphMedium(height), color: colors.textLight, marginTop: 4 },

    searchAndLayoutContainer: { flexDirection: 'row', paddingHorizontal: 1, marginBottom: 10 },
    searchInputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: SIZES.radius, paddingHorizontal: 10 },
    searchInput: { flex: 1, height: 50, marginLeft: 10, ...typography.paragraphRegular(height), color: colors.textDark },
    layoutToggleContainer: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: SIZES.radius, marginLeft: 10, alignItems: 'center' },
    layoutButton: { padding: 12 },
    activeLayout: { backgroundColor: colors.primary, borderRadius: SIZES.radius },

    listContainer: { paddingHorizontal: 15, paddingBottom: 20 },

    // Grid View Card Styles
    customerCard: { backgroundColor: colors.surface, borderRadius: SIZES.radius, marginBottom: 15, overflow: 'hidden' },
    cardHeader: { flexDirection: 'row', padding: 15, alignItems: 'center' },
    customerInitialCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    customerInitialText: { ...typography.titleBold(height), color: colors.primary },
    customerInfo: { flex: 1 },
    customerName: { ...typography.titleBold(height), color: colors.textDark },
    customerBusiness: { ...typography.paragraphRegular(height), color: '#667FE9' },
    customerPhone: { ...typography.paragraphRegular(height), color: '#667FE9' },
    statusBadge: { ...typography.label(height), color: colors.warning, backgroundColor: '#d45b3944', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20, overflow: 'hidden', width: 90, textAlign: 'center' },
    verifiedBadge: { color: colors.accent, backgroundColor: '#42c42b2d', width: 90, textAlign: 'center' },
    cardBody: { paddingHorizontal: 15, paddingBottom: 15 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    infoLabel: { ...typography.paragraphRegular(height), color: colors.textLight },
    infoValue: { ...typography.paragraphMedium(height), color: colors.textDark, fontWeight: '500' },
    cardFooter: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 15, justifyContent: 'flex-start', borderTopWidth: 1, borderTopColor: colors.border },
    actionButton: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 10, },
    viewButton: { backgroundColor: '#44AAF3' },
    editButton: { backgroundColor: '#28A745' },
    deleteButton: { backgroundColor: '#F34447' },
    actionButtonText: { ...typography.label(height), fontWeight: 'bold', marginLeft: 6, color: colors.white, },

    // List View Styles
    listViewHeader: { flexDirection: 'row', paddingHorizontal: 10, paddingBottom: 15, },
    headerColumn: { ...typography.label(height), color: colors.textLight, fontWeight: 'bold' },
    listItemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, paddingVertical: 10, paddingHorizontal: 5, borderRadius: SIZES.radius, marginBottom: 10, },
    listColumnCustomer: { flex: 3.5, flexDirection: 'row', alignItems: 'center', paddingRight: 10 },
    listColumnBusiness: { flex: 2.5, paddingHorizontal: 5 },
    listColumnStatus: { flex: 1.5, alignItems: 'center', padding: 5 },
    listColumnCredit: { flex: 2, alignItems: 'center', padding: 5 },
    listColumnActions: { flex: 2, flexDirection: 'row', justifyContent: 'space-around' },
    listItemTextWrapper: { flex: 1 },
    customerInitialCircle1: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    customerName1: { ...typography.titleBold1(height), color: colors.textDark },
    customerEmail1: { ...typography.paragraphRegular1(height), color: colors.textLight },
    listItemText: { ...typography.paragraphMedium1(height), color: colors.textDark, fontWeight: '500' },
    listItemSubText: { ...typography.paragraphRegular1(height), color: colors.text },
    statusBadge1: { ...typography.label1(height), fontWeight: 'bold', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 20, overflow: 'hidden' },
    actionButton1: { flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 6, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginRight: 3, },
    verifiedBadge1: { color: colors.accent, backgroundColor: '#42c42b2d', width: 50, textAlign: 'center' },

});


export default CustomersScreen;
