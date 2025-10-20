import { useNavigation, useRoute } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import theme, services, and components
import EditOrderStatusModal from '../../components/editOrder';
import { colors, typography } from '../../constants/Admintheme';
import { orderService } from '../../services/orderService';

// Icons
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ViewOrderScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { height } = useWindowDimensions();
    const styles = useMemo(() => createDynamicStyles(height), [height]);
    const { orderId } = route.params;

    // --- STATE MANAGEMENT ---
    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // In a real app, you'd fetch only this specific order
                const data = await orderService.getOrderById(orderId);
                if (data) {
                    setOrder(data);
                } else {
                    Alert.alert("Error", "Order not found.", [{ text: "OK", onPress: () => navigation.goBack() }]);
                }
            } catch (error) {
                Alert.alert("Error", "Could not load order details.", [{ text: "OK", onPress: () => navigation.goBack() }]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    // --- EVENT HANDLERS ---
    const handleUpdateStatus = (id, newStatus) => {
        setOrder(prevOrder => ({ ...prevOrder, status: newStatus }));
        // Here you would also call the API to update the status in the backend
        // await orderService.updateOrderStatusAPI(id, newStatus);
        setIsEditModalVisible(false);
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Order",
            "Are you sure you want to delete this order permanently?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        // In a real app, you'd call the delete API
                        // await orderService.deleteOrderAPI(orderId);
                        Alert.alert("Success", "Order has been deleted.", [{ text: "OK", onPress: () => navigation.goBack() }]);
                    },
                },
            ]
        );
    };
    
 const handleUploadInvoice = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: ["application/pdf", "image/*"] });
            if (!result.canceled) {
                // In a real app, you would upload result.assets[0] and get a real URL
                const dummyUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

                // Optimistically update the UI
                setOrder(prevOrder => ({ ...prevOrder, invoiceUrl: dummyUrl }));

                // Persist the change in our dummy backend
                await orderService.updateOrderInvoiceAPI(order.id, dummyUrl);
                
                Alert.alert("Success", `Invoice "${result.assets[0].name}" uploaded.`);
            }
        } catch (err) {
            Alert.alert('Error', 'Could not open the file picker.');
        }
    };

    // --- RENDER FUNCTIONS ---
    const InfoSection = ({ icon, title, children }) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Feather name={icon} size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <View style={styles.sectionBody}>
                {children}
            </View>
        </View>
    );

    const InfoRow = ({ label, value }) => (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}:</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );

    const OrderProgress = ({ currentStatus }) => {
        const statuses = ['Order placed', 'Order confirmed', 'Out for delivery', 'Order delivered'];
        
        // Correctly map backend status to the progress steps
        const statusMap = {
            'Pending': 1,        // Corresponds to 'Order confirmed'
            'In Transit': 2,     // Corresponds to 'Out for delivery'
            'Delivered': 3,      // Corresponds to 'Order delivered'
        };
        const activeIndex = statusMap[currentStatus] ?? 0;

        return (
             <InfoSection icon="clock" title="Order Progress">
                {statuses.map((status, index) => (
                    <View key={status} style={styles.progressRow}>
                        <View style={styles.progressTimeline}>
                            <View style={[styles.progressDot, index <= activeIndex && styles.progressDotActive]} />
                            {index < statuses.length - 1 && <View style={[styles.progressLine, index < activeIndex && styles.progressLineActive]} />}
                        </View>
                        <View style={styles.progressDetails}>
                            <Text style={styles.progressStatusText}>{status}</Text>
                            <Text style={styles.progressDateText}>
                                {index <= activeIndex ? order.date : 'pending'}
                            </Text>
                        </View>
                    </View>
                ))}
            </InfoSection>
        )
    };


    if (isLoading || !order) {
        return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
    }

    const statusColor = order.status === 'Delivered' ? colors.accent : order.status === 'In Transit' ? colors.primary : colors.warning;

    return (
        <SafeAreaView style={styles.container}>

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

            <EditOrderStatusModal
                isVisible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                order={order}
                onUpdateStatus={handleUpdateStatus}
            />
            {/* --- Custom Header --- */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order #{order.id}</Text>
                <View style={styles.headerButton} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.orderSummaryHeader}>
                    <Text style={styles.orderDate}>{order.date}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                        <Text style={[styles.statusText, { color: statusColor }]}>{order.status}</Text>
                    </View>
                </View>

                {/* --- Customer Info --- */}
                <InfoSection icon="user" title="Customer">
                    <InfoRow label="Name" value={order.customerName} />
                    <InfoRow label="Email" value={order.customerEmail} />
                    <InfoRow label="Phone" value={order.customerPhone} />
                </InfoSection>

                {/* --- Order Info --- */}
                <InfoSection icon="info" title="Order Info">
                    <InfoRow label="Shipping" value={order.shippingMethod} />
                    <InfoRow label="Payment method" value={order.paymentMethod} />
                     <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Status:</Text>
                        <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20`, alignSelf: 'flex-start' }]}>
                             <Text style={[styles.statusText, { color: statusColor }]}>{order.status}</Text>
                        </View>
                    </View>
                </InfoSection>
                
                {/* --- Payment Info --- */}
                <InfoSection icon="credit-card" title="Payment Info">
                     <InfoRow label="Master Card" value={`**** **** **** ${order.cardLast4}`} />
                     <InfoRow label="Business name" value={order.customerName} />
                     <InfoRow label="Phone" value={order.customerPhone} />
                </InfoSection>

                {/* --- Products --- */}
                <InfoSection icon="package" title="Products">
                    <View style={styles.productRow}>
                        <View>
                            <Text style={styles.productName}>{order.productName}</Text>
                            <Text style={styles.productUnit}>Unit Price: {order.unitPrice}</Text>
                        </View>
                        <Text style={styles.productQty}>Qty: {order.items}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount:</Text>
                        <Text style={styles.totalAmount}>{order.amount.toFixed(2)}</Text>
                    </View>
                </InfoSection>

                {/* --- Order Progress --- */}
                <OrderProgress currentStatus={order.status} />

            </ScrollView>

            {/* --- Footer Buttons --- */}
            <View style={styles.footer}>
                {order.invoiceUrl ? (
                    <TouchableOpacity style={styles.footerButton} onPress={() => Linking.openURL(order.invoiceUrl)}>
                        <Feather name="paperclip" size={20} color={colors.primary} />
                        <Text style={styles.footerButtonText}>View Invoice</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.footerButton} onPress={handleUploadInvoice}>
                        <Feather name="upload" size={20} color={colors.primary} />
                        <Text style={styles.footerButtonText}>Upload Invoice</Text>
                    </TouchableOpacity>
                )}
                 <TouchableOpacity style={[styles.footerButton, styles.editButton]} onPress={() => setIsEditModalVisible(true)}>
                     <Text style={[styles.footerButtonText, styles.editButtonText]}>Edit</Text>
                </TouchableOpacity>
                 <TouchableOpacity style={[styles.footerButton, styles.deleteButton]} onPress={handleDelete}>
                     <Text style={[styles.footerButtonText, styles.deleteButtonText]}>Delete</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const createDynamicStyles = (height) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    profilePic: {  marginLeft:10, width: wp(9),
        height: wp(9),
        borderRadius: wp(8),
        resizeMode: "cover", },

 header1: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    // Use the dynamic typography function and override fontSize as needed
   header1: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: hp(2), paddingHorizontal: wp(4), backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerTitle1: { ...typography.titleBold(height), color: colors.textDark, textAlign: 'center' },
    headerIcons1: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    
    profilePic1: {  marginLeft:10, width: wp(9),   height: wp(9),
        borderRadius: wp(8),
        resizeMode: "cover", },


    headerButton: {
        width: wp(10),
    },
    headerTitle: {
        ...typography.titleBold(height),
        color: colors.textDark,
    },
    scrollContainer: {
        padding: wp(4),
        paddingBottom: hp(15) // Extra padding to not hide behind footer
    },
    orderSummaryHeader: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: wp(4),
        marginBottom: hp(2),
    },
    orderDate: {
        ...typography.paragraphRegular(height),
        color: colors.textLight,
        marginBottom: hp(1),
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(3),
        borderRadius: 20,
    },
    statusText: {
        ...typography.label(height),
        fontWeight: 'bold',
    },
    section: {
        marginBottom: hp(2),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(1.5),
    },
    sectionTitle: {
        ...typography.titleBold(height),
        fontSize: RFValue(16, height),
        marginLeft: wp(3),
        color: colors.textDark
    },
    sectionBody: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: wp(4),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: hp(1),
    },
    infoLabel: {
        ...typography.paragraphRegular(height),
        color: colors.textLight,
    },
    infoValue: {
        ...typography.paragraphMedium(height),
        color: colors.textDark,
        textAlign: 'right',
    },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingBottom: hp(2),
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    productName: { ...typography.paragraphMedium(height), color: colors.textDark, fontWeight: '600' },
    productUnit: { ...typography.paragraphRegular(height), color: colors.textLight, marginTop: hp(0.5) },
    productQty: { ...typography.paragraphMedium(height), color: colors.textDark },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: hp(2),
    },
    totalLabel: { ...typography.paragraphMedium(height), color: colors.textDark, fontWeight: '600' },
    totalAmount: { ...typography.titleBold(height), color: colors.textDark },
    
    // --- Order Progress Styles ---
    progressRow: {
        flexDirection: 'row',
    },
    progressTimeline: {
        alignItems: 'center',
        marginRight: wp(4),
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.border,
    },
    progressDotActive: {
        backgroundColor: colors.accent,
    },
    progressLine: {
        flex: 1,
        width: 2,
        backgroundColor: colors.border,
    },
    progressLineActive: {
        backgroundColor: colors.accent,
    },
    progressDetails: {
        paddingBottom: hp(3),
    },
    progressStatusText: {
        ...typography.paragraphMedium(height),
        color: colors.textDark,
    },
    progressDateText: {
        ...typography.paragraphRegular(height),
        color: colors.textLight,
        marginTop: hp(0.5),
    },

    // --- Footer Styles ---
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: colors.surface,
        padding: wp(4),
        paddingBottom: hp(4),
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    footerButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: hp(1.5),
        borderRadius: 10,
        marginHorizontal: wp(1),
    },
    footerButtonText: {
        ...typography.button(height),
        marginLeft: wp(2),
        color: colors.primary,
    },
    editButton: {
        backgroundColor: '#EBF9E8', // Light green
    },
    editButtonText: {
        color: colors.accent,
    },
    deleteButton: {
        backgroundColor: '#FFEBEB', // Light red
    },
    deleteButtonText: {
        color: colors.danger,
    },
});

export default ViewOrderScreen;
