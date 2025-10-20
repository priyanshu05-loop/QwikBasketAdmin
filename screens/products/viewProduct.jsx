import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import theme, services, and components
import { colors, typography } from '../../constants/Admintheme';
import { productService } from '../../services/products';

// Icons
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ViewProductScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { height } = useWindowDimensions();
    const styles = useMemo(() => createDynamicStyles(height), [height]);
    const { productId } = route.params;

    // --- STATE MANAGEMENT ---
    const [isLoading, setIsLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [imageSource, setImageSource] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // --- State for collapsable sections ---
    const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(true);
    const [isStockOpen, setIsStockOpen] = useState(true);

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const data = await productService.getProductById(productId);
                if (data) {
                    setProduct(data);
                    setImageSource(data.image || null);
                } else {
                    Alert.alert("Error", "Product not found.", [{ text: "OK", onPress: () => navigation.goBack() }]);
                }
            } catch (error) {
                Alert.alert("Error", "Could not load product details.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProductDetails();
    }, [productId]);

    // --- EVENT HANDLERS ---
    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission Required", "You need to allow access to your photos.");
            return;
        }
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 1,
        });
        if (!pickerResult.canceled) {
            setImageSource({ uri: pickerResult.assets[0].uri });
        }
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const updatedData = { ...product, image: imageSource };
            await productService.updateProductAPI(product.id, updatedData);
            Alert.alert("Success", "Changes have been saved.", [{ text: "OK" }]);
        } catch (error) {
            Alert.alert("Error", "Could not save changes.");
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleDelete = () => {
        Alert.alert(
            "Delete Product", "Are you sure you want to permanently delete this product?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive",
                    onPress: async () => {
                        await productService.deleteProductAPI(productId);
                        Alert.alert("Deleted", "Product has been successfully deleted.", [{ text: "OK", onPress: () => navigation.goBack() }]);
                    },
                },
            ]
        );
    };

    // --- RENDER FUNCTIONS ---
    const InfoRow = ({ label, value }) => (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );

    if (isLoading || !product) {
        return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header1}>
             <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                <Ionicons name="menu" size={28} color={colors.textDark} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle1}>Products</Text>
                            <View style={styles.headerIcons1}>
                                <TouchableOpacity><Ionicons name="notifications-outline" size={24} color={colors.textDark} /></TouchableOpacity>
                                <TouchableOpacity><Image source={{ uri: 'https://cdn.mos.cms.futurecdn.net/v2/t:0,l:280,cw:720,ch:720,q:80,w:720/ZyiBw5xgHMWSEikFkK3mH8.jpg' }} style={styles.profilePic1} /></TouchableOpacity>
                            </View>
            </View>
            
            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={24} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{product.name}</Text>
                <View style={{width: 24}} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.contentBox}>
                    {/* Image Section */}
                    <View style={styles.imageContainer}>
                        <Image source={imageSource} style={styles.productImage} />
                        <TouchableOpacity style={styles.imageEditIcon} onPress={handlePickImage}>
                             <Feather name="edit-2" size={16} color={colors.primary} />
                        </TouchableOpacity>
                         <TouchableOpacity style={styles.mainEditButton} onPress={() => navigation.navigate('EditProduct', { productId: product.id })}>
                            <Feather name="edit" size={16} color={colors.primary} />
                            <Text style={styles.mainEditButtonText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>₹ {product.price}</Text>

                    {/* Basic Information Section */}
                    <TouchableOpacity style={styles.sectionHeader} onPress={() => setIsBasicInfoOpen(!isBasicInfoOpen)}>
                        <Ionicons name="information-circle-outline" size={22} color={colors.textDark} />
                        <Text style={styles.sectionTitle}>Basic Information</Text>
                        <Ionicons name={isBasicInfoOpen ? "chevron-up" : "chevron-down"} size={22} color={colors.textLight} />
                    </TouchableOpacity>
                    {isBasicInfoOpen && (
                        <View style={styles.sectionBody}>
                            <InfoRow label="Packaging Quantity" value={`${product.packagingQty} gms`} />
                            <InfoRow label="Price Per Kg" value={`₹ ${product.price}`} />
                            <InfoRow label="Category" value={product.category} />
                            <InfoRow label="Sub-Category" value={product.subCategory} />
                            <InfoRow label="Origin" value={product.origin} />
                            <InfoRow label="Variety" value={product.variety} />
                            <InfoRow label="Seller FSSAI" value={product.fssai} />
                        </View>
                    )}

                    {/* Stock Management Section */}
                    <TouchableOpacity style={styles.sectionHeader} onPress={() => setIsStockOpen(!isStockOpen)}>
                        <Ionicons name="cube-outline" size={22} color={colors.textDark} />
                        <Text style={styles.sectionTitle}>Stock Management</Text>
                        <Ionicons name={isStockOpen ? "chevron-up" : "chevron-down"} size={22} color={colors.textLight} />
                    </TouchableOpacity>
                    {isStockOpen && (
                         <View style={styles.sectionBody}>
                            <InfoRow label="Current Stock" value={product.stock} />
                            <InfoRow label="Low Stock Alert" value="10" />
                            <InfoRow label="Unit" value="Per Kilogram(Kg)" />
                        </View>
                    )}

                     {/* Description Section */}
                    <View style={styles.sectionHeader}>
                        <Ionicons name="document-text-outline" size={22} color={colors.textDark} />
                        <Text style={styles.sectionTitle}>Description</Text>
                    </View>
                    <View style={styles.descriptionBox}>
                        <Text style={styles.descriptionText}>{product.description}</Text>
                    </View>

                </View>
            </ScrollView>

             {/* Footer Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? <ActivityIndicator color={colors.white} /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const createDynamicStyles = (height) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: hp(2), paddingHorizontal: wp(4), backgroundColor: colors.primary },
    headerTitle: { ...typography.titleBold(height), color: colors.white },
    scrollContainer: { paddingBottom: hp(15) }, // Padding to avoid footer overlap

    header1: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: hp(2), paddingHorizontal: wp(4), backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerTitle1: { ...typography.titleBold(height), color: colors.textDark, textAlign: 'center' },
    headerIcons1: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    
    profilePic1: {  marginLeft:10, width: wp(9),   height: wp(9),
        borderRadius: wp(8),
        resizeMode: "cover", },


    contentBox: {
        backgroundColor: colors.surface,
        margin: wp(4),
        borderRadius: 12,
        padding: wp(4),
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: hp(1),
        position: 'relative',
    },
    productImage: {
        width: wp(40),
        height: wp(40),
        borderRadius: 10,
    },
    imageEditIcon: {
        position: 'absolute',
        bottom: 5,
        right: wp(22),
        backgroundColor: colors.surface,
        padding: 8,
        borderRadius: 20,
        elevation: 5,
    },
    mainEditButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F3FF',
        paddingVertical: hp(0.8),
        paddingHorizontal: wp(3),
        borderRadius: 8,
    },
    mainEditButtonText: { ...typography.label(height), color: colors.primary, marginLeft: wp(1.5) },
    productName: { ...typography.titleBold(height), textAlign: 'center', fontSize: RFValue(20, height), color: colors.textDark },
    productPrice: { ...typography.titleBold(height), textAlign: 'center', fontSize: RFValue(18, height), color: colors.primary, marginVertical: hp(1.5) },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: hp(2), borderTopWidth: 1, borderTopColor: colors.border },
    sectionTitle: { flex: 1, ...typography.titleBold(height), fontSize: RFValue(16, height), marginLeft: wp(3), color: colors.textDark },
    sectionBody: { paddingBottom: hp(1) },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: hp(1), borderBottomWidth: 1, borderBottomColor: colors.border, },
    infoLabel: { ...typography.paragraphRegular(height), color: colors.textLight },
    infoValue: { ...typography.paragraphMedium(height), color: colors.textDark },
    descriptionBox: {
        backgroundColor: '#F7F8FA',
        borderRadius: 8,
        padding: wp(3),
    },
    descriptionText: {
        ...typography.paragraphRegular(height),
        color: colors.text,
        lineHeight: hp(2.5),
    },
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
    saveButton: {
        flex: 1,
        backgroundColor: colors.accent,
        padding: hp(1.8),
        borderRadius: 10,
        alignItems: 'center',
        marginRight: wp(2),
    },
    saveButtonText: { ...typography.button(height), color: colors.white },
    deleteButton: {
        flex: 1,
        backgroundColor: colors.danger,
        padding: hp(1.8),
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: wp(2),
    },
    deleteButtonText: { ...typography.button(height), color: colors.white },
});

export default ViewProductScreen;
