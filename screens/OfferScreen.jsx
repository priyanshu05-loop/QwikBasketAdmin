import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

import OfferFormModal from '../components/OfferForm';

// Import theme, services, and components
import { colors, typography } from '../constants/Admintheme';
import { offerService } from '../services/offersService';

// Icons
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const OffersScreen = () => {
    const navigation = useNavigation();
    const { height } = useWindowDimensions();
    const styles = useMemo(() => createDynamicStyles(height), [height]);
    const isFocused = useIsFocused();

    // --- STATE MANAGEMENT ---
    const [isLoading, setIsLoading] = useState(true);
    const [offers, setOffers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);


    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const data = await offerService.getOffers();
                setOffers(data);
            } catch (error) {
                Alert.alert("Error", "Could not load offers.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchOffers();
    }, []);

    // --- COMPUTED VALUES ---
    const activeOffersCount = useMemo(() => offers.filter(o => o.status === 'Active').length, [offers]);

    // --- EVENT HANDLERS ---
    const handleDelete = (offerId) => {
        Alert.alert(
            "Delete Offer", "Are you sure you want to delete this offer?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive",
                    onPress: async () => {
                        setOffers(prevOffers => prevOffers.filter(o => o.id !== offerId));
                        await offerService.deleteOfferAPI(offerId);
                    },
                },
            ]
        );
    };
     const handleOpenModal = (offer = null) => {
        setSelectedOffer(offer); // null for 'Add', offer object for 'Edit'
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedOffer(null);
    };

     const handleSaveOffer = async (offerData) => {
        try {
            if (selectedOffer) { // Edit Mode
                await offerService.updateOfferAPI(selectedOffer.id, offerData);
            } else { // Add Mode
                await offerService.addOfferAPI(offerData);
            }
            // Refetch offers to show the update
            const updatedOffers = await offerService.getOffers();
            setOffers(updatedOffers);
            handleCloseModal();
        } catch (error) {
            throw error; // Let the modal's catch block handle the alert
        }
    };


    // --- RENDER FUNCTIONS ---
    const SummaryCard = ({ label, value }) => (
        <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{value}</Text>
            <Text style={styles.summaryLabel}>{label}</Text>
        </View>
    );

    const OfferCard = ({ item }) => {
        const getStatusStyle = () => {
            switch (item.status) {
                case 'Active':
                    return { color: colors.accent, bgColor: `${colors.accent}20` };
                case 'Inactive':
                    return { color: colors.danger, bgColor: `${colors.danger}20` };
                default:
                    return { color: colors.textLight, bgColor: `${colors.textLight}20` };
            }
        };
        const statusStyle = getStatusStyle();
        return(
            <View style={styles.offerCard}>
                <View style={styles.offerHeader}>
                    <View>
                        <Text style={styles.offerTitle}>{item.title}</Text>
                        <Text style={styles.offerSubtitle}>{item.subtitle}</Text>
                    </View>
                    <View style={styles.offerActions}>
                        <TouchableOpacity style={styles.editButton} onPress={() => handleOpenModal(item)}>
                            <Feather name="edit-2" size={18} color={colors.primary} />
                        </TouchableOpacity>
                         <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                            <Feather name="trash-2" size={18} color={colors.danger} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Image source={item.bannerImage} style={styles.bannerImage} />
                {item.description && <Text style={styles.offerDescription}>{item.description}</Text>}
                <View style={styles.offerFooter}>
                   <View style={[styles.statusBadge, { backgroundColor: statusStyle.bgColor }]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>{item.status}</Text>
                    </View>
                    <Text style={styles.expiryDate}>{item.expiryDate}</Text>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>

            <OfferFormModal
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                onSave={handleSaveOffer}
                existingOffer={selectedOffer}
            />


            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu" size={28} color={colors.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Offers</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity><Ionicons name="notifications-outline" size={24} color={colors.textDark} /></TouchableOpacity>
                    <TouchableOpacity><Image source={{ uri: 'https://cdn.mos.cms.futurecdn.net/v2/t:0,l:280,cw:720,ch:720,q:80,w:720/ZyiBw5xgHMWSEikFkK3mH8.jpg' }} style={styles.profilePic} /></TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={offers}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <OfferCard item={item} />}
                contentContainerStyle={styles.listContainer}
                ListHeaderComponent={
                    <>
                        <View style={styles.summaryGrid}>
                            <SummaryCard label="Total Offers" value={offers.length} />
                            <SummaryCard label="Active Offers" value={activeOffersCount} />
                        </View>
                        <View style={styles.listHeader}>
                            <Text style={styles.listTitle}>All Offers</Text>
                            <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal()}>
                               <Feather name="plus" size={18} color={colors.white} />
                                <Text style={styles.addButtonText}>Add Offer</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}><Text style={styles.emptyText}>No offers available.</Text></View>
                }
            />
        </SafeAreaView>
    );
};

const createDynamicStyles = (height) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: hp(2), paddingHorizontal: wp(4), backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerTitle: { ...typography.titleBold(height), color: colors.textDark },
    headerIcons: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    profilePic: {  marginLeft:10, width: wp(9),   height: wp(9),
            borderRadius: wp(8),
            resizeMode: "cover", },
    listContainer: { paddingHorizontal: wp(4), paddingBottom: hp(4) },

    // --- Summary ---
    summaryGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: hp(2) },
    summaryCard: { width: '48.5%', backgroundColor: colors.surface, padding: wp(4), borderRadius: 12, alignItems: 'center' },
    summaryValue: { ...typography.titleBold(height), fontSize: RFValue(24, height), color: colors.textDark },
    summaryLabel: { ...typography.paragraphRegular(height), color: colors.textLight, marginTop: hp(0.5) },

    // --- List Header ---
    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: hp(3) },
    listTitle: { ...typography.titleBold(height), fontSize: RFValue(20, height) },
    addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: 20, paddingHorizontal: wp(4), paddingVertical: hp(1) },
    addButtonText: { ...typography.button(height), color: colors.white, marginLeft: wp(1.5), fontSize: RFValue(12, height) },
    
    // --- Offer Card ---
    offerCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: wp(4),
        marginBottom: hp(2),
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    offerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    offerTitle: { ...typography.titleBold(height), fontSize: RFValue(16, height), color: '#00A3A3' },
    offerSubtitle: { ...typography.paragraphRegular(height), color: colors.textLight, marginTop: hp(0.5) },
    offerActions: { flexDirection: 'row', alignItems: 'center', gap: wp(2) },
    editButton: { padding: 5, backgroundColor: '#E8F3FF', borderRadius: 6 },
    deleteButton: { padding: 5, backgroundColor: '#FFEBEB', borderRadius: 6 },
    bannerImage: {
        width: '100%',
        height: hp(15),
        borderRadius: 8,
        marginVertical: hp(2),
        resizeMode: 'contain',
    },
    offerDescription: {
        ...typography.paragraphRegular(height),
        color: colors.text,
        marginBottom: hp(2),
    },
    offerFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(1),
    },
    statusBadge: {
        paddingVertical: hp(0.6),
        paddingHorizontal: wp(3),
        borderRadius: 20,
    },
    statusText: {
        ...typography.label(height),
        fontWeight: 'bold',
        fontSize: RFValue(11, height)
    },
    expiryDate: {
        ...typography.paragraphRegular(height),
        color: colors.textLight,
    },

    emptyContainer: { alignItems: 'center', marginTop: hp(10) },
    emptyText: { ...typography.paragraphMedium(height), color: colors.textLight },
});

export default OffersScreen;
