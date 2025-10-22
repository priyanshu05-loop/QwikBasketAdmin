import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Linking,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

import EditOrderStatusModal from '../../components/editOrder'; // ---IMPORT THE  MODAL ---



import { colors, typography } from '../../constants/Admintheme';
import { orderService } from '../../services/orderService';

// Icons
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const OrdersScreen = () => {
    const navigation = useNavigation();
    const { height } = useWindowDimensions();

    // --- STATE MANAGEMENT ---
    const [isLoading, setIsLoading] = useState(true);
    const [originalOrders, setOriginalOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');

        // --- STATE FOR THE MODAL ---
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);


    const styles = useMemo(() => createDynamicStyles(height), [height]);

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getOrders();
                setOriginalOrders(data);
                setFilteredOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                Alert.alert("Error", "Could not load orders. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);
    
    // --- COMPUTED VALUES ---
    const summaryCounts = useMemo(() => ({
        total: originalOrders.length,
        pending: originalOrders.filter(o => o.status === 'Pending').length,
        delivered: originalOrders.filter(o => o.status === 'Delivered').length,
        inTransit: originalOrders.filter(o => o.status === 'In Transit').length,
    }), [originalOrders]);



 // ---HANDLERS FOR THE MODAL ---
    const handleOpenEditModal = (order) => {
        setSelectedOrder(order);
        setIsEditModalVisible(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalVisible(false);
        setSelectedOrder(null); // Clear selected order on close
    };

    const handleUpdateStatus = (orderId, newStatus) => {
        // Update the list in the state
        const updatedOrders = originalOrders.map(o => 
            o.id === orderId ? { ...o, status: newStatus } : o
        );
        setOriginalOrders(updatedOrders);
        setFilteredOrders(updatedOrders);
        
        // During backend we would also call an API to save this change.
        // e.g., orderService.updateOrderStatusAPI(orderId, newStatus);
        
        handleCloseEditModal(); // Close the modal after update
    };


    // --- EVENT HANDLERS ---
    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = query
            ? originalOrders.filter(order =>
                order.id.toLowerCase().includes(query.toLowerCase()) ||
                order.customerName.toLowerCase().includes(query.toLowerCase())
            )
            : originalOrders;
        setFilteredOrders(filtered);
    };
    
    const handleDelete = (orderId) => {
        Alert.alert(
            "Delete Order", "Are you sure you want to delete this order?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive",
                    onPress: async () => {
                        const newOrders = originalOrders.filter(o => o.id !== orderId);
                        setOriginalOrders(newOrders);
                        setFilteredOrders(newOrders);
                        try {
                            await orderService.deleteOrderAPI(orderId);
                        } catch (error) {
                           Alert.alert("Error", "Failed to delete order from the server.");
                        }
                    },
                },
            ]
        );
    };

    const handleUploadInvoice = async (orderId) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: ["application/pdf", "image/*"] });
            if (!result.canceled) {
                const pickedFile = result.assets[0];
                Alert.alert("Success", `Invoice "${pickedFile.name}" selected for ${orderId}.`);
            }
        } catch (err) {
            Alert.alert('Error', 'Could not open the file picker.');
        }
    };

    const handleViewInvoice = (url) => {
        if (url) Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };
    
    // --- RENDER FUNCTIONS ---

    const renderSummaryCard = (icon, label, count, color) => (
        <View style={styles.summaryCard}>
            <View style={[styles.summaryIconContainer, { backgroundColor: `${color}20` }]}>
                <MaterialCommunityIcons name={icon} size={wp(6)} color={color} />
            </View>
            <Text style={styles.summaryLabel}>{label}</Text>
            <Text style={styles.summaryCount}>{count}</Text>
        </View>
    );

    // --- GRID VIEW COMPONENT (Detailed Card) ---
    const OrderCardView = ({ item }) => {
        const statusColor = item.status === 'Delivered' ? colors.accent : item.status === 'In Transit' ? colors.primary : colors.warning;
        return (
            <TouchableOpacity style={styles.orderCard} onPress={() => navigation.navigate('viewOrder', { orderId: item.id })}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>{`#${item.id}`}</Text>
                    <Text style={styles.orderDate}>{item.date}</Text>
                </View>
                <View style={styles.orderBody}>
                    <View style={styles.orderDetails}>
                        <Text style={styles.detailLabel}>CUSTOMER</Text>
                        <Text style={styles.detailValue} numberOfLines={1}>{item.customerName}</Text>
                        <Text style={styles.detailLabel}>ITEMS</Text>
                        <Text style={styles.detailValue}>{item.items}</Text>
                    </View>
                    <View style={styles.orderDetails}>
                        <Text style={styles.detailLabel}>AMOUNT</Text>
                        <Text style={styles.detailValue}>Rs. {item.amount}</Text>
                        <Text style={styles.detailLabel}>PAYMENT</Text>
                        <Text style={styles.detailValue}>{item.paymentMethod}</Text>
                    </View>
                </View>
                <View style={styles.orderStatusContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                        <Text style={[styles.statusText, { color: statusColor }]}>{item.status.toUpperCase()}</Text>
                    </View>
                </View>
                <View style={styles.orderActions}>
                    {item.invoiceUrl ? (
                         <TouchableOpacity style={[styles.actionButton, styles.invoiceButton]} onPress={() => handleViewInvoice(item.invoiceUrl)}>
                             <Feather name="paperclip" size={wp(3.5)} color={colors.primary} />
                             <Text style={[styles.actionText, {color: colors.primary}]}>Invoice</Text>
                         </TouchableOpacity>
                    ) : (
                         <TouchableOpacity style={[styles.actionButton, styles.invoiceButton]} onPress={() => handleUploadInvoice(item.id)}>
                             <Feather name="upload" size={wp(3.5)} color={colors.primary} />
                             <Text style={[styles.actionText, {color: colors.primary}]}>Upload Invoice</Text>
                         </TouchableOpacity>
                    )}
                    <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => handleOpenEditModal(item)}>
                        <Text style={[styles.actionText, {color: '#FFA500'}]}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDelete(item.id)}>
                        <Text style={[styles.actionText, {color: colors.danger}]}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    // --- LIST VIEW COMPONENT (Table Row) ---
    const OrderRowView = ({ item }) => {
        const statusColor = item.status === 'Delivered' ? colors.accent : item.status === 'In Transit' ? colors.primary : colors.warning;
        return (
            <TouchableOpacity style={styles.orderRow} onPress={() => navigation.navigate('viewOrder', { orderId: item.id })}>
                <Text style={styles.listColumnId}>#{item.id}</Text>
                <Text style={styles.listColumnCustomer} numberOfLines={1}>{item.customerName}</Text>
                <Text style={styles.listColumnAmount}>${item.amount}</Text>
                <View style={styles.listColumnStatus}>
                    <View style={[styles.listStatusBadge, { backgroundColor: `${statusColor}20` }]}>
                        <Text style={[styles.listStatusText, { color: statusColor }]}>{item.status}</Text>
                    </View>
                </View>
                <View style={styles.listColumnActions}>
                      <TouchableOpacity style={styles.listEditButton} onPress={() => handleOpenEditModal(item)}>
                           <Text style={styles.listActionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listDeleteButton} onPress={() => handleDelete(item.id)}>
                        <Text style={styles.listActionButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };
    
    // --- LIST VIEW HEADER (Table Header) ---
    const ListViewHeader = () => (
        <View style={styles.listViewHeader}>
            <Text style={[styles.headerColumn, styles.listColumnId]}>Order ID</Text>
            <Text style={[styles.headerColumn, styles.listColumnCustomer]}>Customer</Text>
            <Text style={[styles.headerColumn, styles.listColumnAmount]}>Amount</Text>
            <Text style={[styles.headerColumn, styles.listColumnStatus, {textAlign: 'center'}]}>Status</Text>
            <Text style={[styles.headerColumn, styles.listColumnActions, {textAlign: 'center'}]}>Actions</Text>
        </View>
    );

    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>

            {/* ---  RENDER THE MODAL --- */}
            <EditOrderStatusModal 
                isVisible={isEditModalVisible}
                onClose={handleCloseEditModal}
                order={selectedOrder}
                onUpdateStatus={handleUpdateStatus}
            />

           {/* --- Custom Header for this screen --- */}
      <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Ionicons name="menu" size={28} color={colors.textDark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Orders</Text>
            <View style={styles.headerIcons}>
                <TouchableOpacity><Ionicons name="notifications-outline" size={24} color={colors.textDark} /></TouchableOpacity>
                <TouchableOpacity><Image source={{ uri: 'https://cdn.mos.cms.futurecdn.net/v2/t:0,l:280,cw:720,ch:720,q:80,w:720/ZyiBw5xgHMWSEikFkK3mH8.jpg' }} style={styles.profilePic} /></TouchableOpacity>
            </View>
        </View>

            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => viewMode === 'grid' ? <OrderCardView item={item} /> : <OrderRowView item={item} />}
                // ---  numColumns is now always 1 --- otherwise 1 row me 2 coloum ho jayega Grid ban jayega
                numColumns={1}
                contentContainerStyle={styles.listContainer}
                ListHeaderComponent={
                    <>
                        <View style={styles.summaryGrid}>
                            {renderSummaryCard('package-variant-closed', 'Total Orders', summaryCounts.total, colors.primary)}
                            {renderSummaryCard('clock-outline', 'Pending', summaryCounts.pending, colors.warning)}
                            {renderSummaryCard('check-circle-outline', 'Delivered', summaryCounts.delivered, colors.accent)}
                            {renderSummaryCard('truck-delivery-outline', 'In Transit', summaryCounts.inTransit, '#8A2BE2')}
                        </View>

                        <View style={styles.controlsContainer}>
                            <View style={styles.searchContainer}>
                                <Feather name="search" size={wp(5)} color={colors.textLight} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search Orders..."
                                    placeholderTextColor={colors.textLight}
                                    value={searchQuery}
                                    onChangeText={handleSearch}
                                />
                            </View>
                            <View style={styles.viewToggleContainer}>
                                <TouchableOpacity onPress={() => setViewMode('grid')} style={[styles.toggleButton, viewMode === 'grid' && styles.toggleActive]}>
                                    <Ionicons name="grid" size={wp(5)} color={viewMode === 'grid' ? colors.white : colors.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setViewMode('list')} style={[styles.toggleButton, viewMode === 'list' && styles.toggleActive]}>
                                    <Ionicons name="list" size={wp(5)} color={viewMode === 'list' ? colors.white : colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        {viewMode === 'grid' ? (
                            <Text style={styles.managementTitle}>ORDERS MANAGEMENT</Text>
                        ) : (
                           !isLoading && <ListViewHeader />
                        )}
                    </>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No orders found.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const createDynamicStyles = (height) => StyleSheet.create({
    // --- Global & Header Styles ---
   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: hp(2), paddingHorizontal: wp(4), backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
        headerTitle: { ...typography.titleBold(height), color: colors.textDark, textAlign: 'center' },
        headerIcons: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
        
        profilePic: {  marginLeft:10, width: wp(9),   height: wp(9),
            borderRadius: wp(8),
            resizeMode: "cover", },

    container: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContainer: { paddingHorizontal: wp(2), paddingBottom: hp(4) },

    // --- Summary & Controls ---
    summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: hp(2), paddingHorizontal: wp(2) },
    summaryCard: { width: '48%', backgroundColor: colors.surface, padding: wp(3), borderRadius: 12, marginBottom: hp(2), alignItems: 'center' },
    summaryIconContainer: { padding: wp(2.5), borderRadius: 8, marginBottom: hp(1) },
    summaryLabel: { ...typography.paragraphRegular(height), color: colors.textLight },
    summaryCount: { ...typography.titleBold(height), fontSize: RFValue(28, height), color: colors.textDark, marginTop: hp(0.5) },
    controlsContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: hp(2), paddingHorizontal: wp(2) },
    searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, paddingHorizontal: wp(3) },
    searchInput: { flex: 1, ...typography.paragraphRegular(height), height: hp(6), color: colors.textDark, marginLeft: wp(2) },
    viewToggleContainer: { flexDirection: 'row', marginLeft: wp(2), backgroundColor: colors.surface, borderRadius: 10, },
    toggleButton: { padding: wp(3) },
    toggleActive: { backgroundColor: colors.primary, borderRadius: 10 },
    emptyContainer: { alignItems: 'center', marginTop: hp(10) },
    emptyText: { ...typography.paragraphMedium(height), color: colors.textLight },

    // --- Grid View Styles (Detailed Card) ---
    managementTitle: { ...typography.label(height), color: colors.textLight, letterSpacing: 1, marginBottom: hp(1), paddingHorizontal: wp(2) },
    orderCard: { backgroundColor: colors.surface, borderRadius: 12, marginHorizontal: wp(2), marginVertical: hp(1), borderWidth: 1, borderColor: colors.border },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: wp(3.5) },
    orderId: { ...typography.titleBold(height), fontSize: RFValue(15, height), color: colors.textDark },
    orderDate: { ...typography.label(height), fontSize: RFValue(11, height), color: colors.textLight },
    orderBody: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp(3.5), paddingBottom: hp(1.5) },
    orderDetails: { flex: 1 },
    detailLabel: { ...typography.label(height), fontSize: RFValue(10, height), textTransform: 'uppercase', color: colors.textLight, marginBottom: hp(0.3) },
    detailValue: { ...typography.paragraphMedium(height), fontSize: RFValue(13, height), color: colors.textDark, marginBottom: hp(1) },
    orderStatusContainer: { alignItems: 'flex-start', paddingHorizontal: wp(3.5), paddingBottom: hp(1.5) },
    statusBadge: { paddingHorizontal: wp(2.5), paddingVertical: hp(0.5), borderRadius: 6 },
    statusText: { ...typography.label(height), fontWeight: '700' },
    orderActions: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderColor: colors.border, paddingTop: hp(1.5), padding: wp(2) },
    actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: hp(0.5), paddingHorizontal: wp(2), borderRadius: 6, marginLeft: wp(1) },
    invoiceButton: { backgroundColor: '#E9F2FC' },
    editButton: { backgroundColor: '#FFF4E5' },
    deleteButton: { backgroundColor: '#FEEEEE' },
    actionText: { ...typography.label(height), marginLeft: wp(1.5) },

    // --- List View Styles (Table Row) ---
    listViewHeader: { flexDirection: 'row', paddingHorizontal: wp(4), paddingVertical: hp(1.5), borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: hp(1), backgroundColor: colors.surface },
    headerColumn: { ...typography.label(height), color: colors.textLight, fontWeight: 'bold' },
    orderRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, marginHorizontal: wp(2), marginVertical: hp(0.8), paddingVertical: hp(1.5), paddingHorizontal: wp(3), borderWidth: 1, borderColor: colors.border },
    listColumnId: { flex: 3, ...typography.label(height) },
    listColumnCustomer: { flex: 3, ...typography.label(height), paddingHorizontal: wp(1) },
    listColumnAmount: { flex: 2, ...typography.label(height)},
    listColumnStatus: { flex: 2.2, alignItems: 'center' },
    listColumnActions: { flex: 2.5, flexDirection: 'row', justifyContent: 'center' },
    listStatusBadge: { paddingHorizontal: wp(2.5), paddingVertical: hp(0.6), borderRadius: 6 },
    listStatusText: { ...typography.label1(height), fontWeight: 'bold' },
    listEditButton: { backgroundColor: '#E8F3FF', paddingVertical: hp(0.4), paddingHorizontal: wp(1), borderRadius: 3, marginRight: wp(0.5) },
    listDeleteButton: { backgroundColor: '#FFEBEB', paddingVertical: hp(0.4), paddingHorizontal: wp(1), borderRadius: 3, marginLeft: wp(0.5) },
    listActionButtonText: { ...typography.label(height), color: colors.textDark, fontWeight: '500', fontSize: RFValue(8, height) }
});

export default OrdersScreen;

