import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
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

// Import theme, services, and components
import { colors, typography } from '../../constants/Admintheme';
import { productService } from '../../services/products';

// Icons
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProductsScreen = () => {
    const navigation = useNavigation();
    const { height } = useWindowDimensions();
    const styles = useMemo(() => createDynamicStyles(height), [height]);
    const isFocused = useIsFocused(); // --- 2. GET THE FOCUS STATE ---

    // --- STATE MANAGEMENT ---
    const [isLoading, setIsLoading] = useState(true);
    const [originalProducts, setOriginalProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
     const [viewMode, setViewMode] = useState('grid'); // Default is now the detailed card view

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchProducts = async () => {
            
            try {
                const data = await productService.getProducts();
                setOriginalProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                Alert.alert("Error", "Could not load products.");
            } finally {
                setIsLoading(false);
            }
        };
        
        if(isFocused){
             fetchProducts();
        }
    }, [isFocused]);

    // --- COMPUTED VALUES ---
    const summaryData = useMemo(() => {
        const totalValue = originalProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
        return {
            total: originalProducts.length,
            lowStock: originalProducts.filter(p => p.stockStatus === 'Low Stock').length,
            outOfStock: originalProducts.filter(p => p.stockStatus === 'Out of Stock').length,
            totalValue: totalValue,
        };
    }, [originalProducts]);

    // --- EVENT HANDLERS ---
    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = query
            ? originalProducts.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.category.toLowerCase().includes(query.toLowerCase())
            )
            : originalProducts;
        setFilteredProducts(filtered);
    };

    const handleDelete = (productId) => {
        Alert.alert(
            "Delete Product", "Are you sure you want to delete this product?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive",
                    onPress: async () => {
                        const newProducts = originalProducts.filter(p => p.id !== productId);
                        setOriginalProducts(newProducts);
                        setFilteredProducts(newProducts);
                        await productService.deleteProductAPI(productId);
                    },
                },
            ]
        );
    };

    // --- RENDER FUNCTIONS ---
    const SummaryCard = ({ label, value }) => (
        <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{value}</Text>
            <Text style={styles.summaryLabel}>{label}</Text>
        </View>
    );

    // --- GRID VIEW COMPONENT (Detailed Card) ---
    const ProductGridView = ({ item }) => {
        const stockColor = item.stockStatus === 'In Stock' ? colors.accent : item.stockStatus === 'Low Stock' ? '#F39C12' : colors.danger;
        return(
            <TouchableOpacity  onPress={() => navigation.navigate('ViewProduct', { productId: item.id })}>
            <View style={styles.productGridItem}>
                <Image source={item.image} style={styles.productImage} />
                <View style={styles.productDetails}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productCategory}>{item.category}</Text>
                    <Text style={styles.productPrice}>₹ {item.price}/ <Text style={styles.productUnit}>{item.unit}</Text></Text>
                    <View style={styles.stockRow}>
                        <View style={[styles.stockBadge, { backgroundColor: `${stockColor}20` }]}>
                            <Text style={[styles.stockText, { color: stockColor }]}>{item.stockStatus}</Text>
                        </View>
                        <Text style={styles.stockAvailable}>{item.stock} {item.unit} available</Text>
                    </View>
                </View>
                <View style={styles.productActions}>
                    <TouchableOpacity onPress={() => navigation.navigate('EditProduct', { productId: item.id })}>
                        <Feather name="edit" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                        <Feather name="trash-2" size={20} color={colors.danger} />
                    </TouchableOpacity>
                </View>
            </View>
            </TouchableOpacity>

        );
    };
    
    // --- LIST VIEW COMPONENT (Table Row) ---
    const ProductRowView = ({ item }) => {
        const stockColor = item.stockStatus === 'Low Stock' ? '#FFA500' : colors.accent; // Orange for Low, Green for In Stock
        return(
            <TouchableOpacity style={styles.productRowItem} onPress={() => navigation.navigate('ViewProduct', { productId: item.id })}>
                <View style={styles.listColumnProduct}>
                    <Image source={item.image} style={styles.listProductImage} />
                    <View>
                        <Text style={styles.listProductName}>{item.name}</Text>
                        <Text style={styles.listProductCategory}>{item.category}</Text>
                    </View>
                </View>
                 <View style={styles.listColumnStock}>
                    <View style={[styles.listStockBadge, { backgroundColor: `${stockColor}20` }]}>
                        <Text style={[styles.listStockText, { color: stockColor }]}>{item.stock} {item.unit}</Text>
                    </View>
                </View>
                <Text style={styles.listColumnPrice}>₹ {item.price.toLocaleString('en-IN')}</Text>
                <View style={styles.listColumnActions}>
                     <TouchableOpacity onPress={() => navigation.navigate('EditProduct', { productId: item.id })}>
                        <Feather name="edit" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                        <Feather name="trash-2" size={20} color={colors.danger} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    // --- LIST VIEW HEADER ---
    const ListViewHeader = () => (
        <View style={styles.listViewHeader}>
            <Text style={[styles.headerColumn, {flex: 3}]}>Product</Text>
            <Text style={[styles.headerColumn, {flex: 1.5, textAlign: 'center'}]}>Stock</Text>
            <Text style={[styles.headerColumn, {flex: 1.5, textAlign: 'center'}]}>Price</Text>
            <Text style={[styles.headerColumn, {flex: 1.5, textAlign: 'center'}]}>Actions</Text>
        </View>
    );


    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu" size={28} color={colors.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Products</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity><Ionicons name="notifications-outline" size={24} color={colors.textDark} /></TouchableOpacity>
                    <TouchableOpacity><Image source={{ uri: 'https://cdn.mos.cms.futurecdn.net/v2/t:0,l:280,cw:720,ch:720,q:80,w:720/ZyiBw5xgHMWSEikFkK3mH8.jpg' }} style={styles.profilePic} /></TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={filteredProducts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => viewMode === 'grid' ? <ProductGridView item={item} /> : <ProductRowView item={item} />}
                contentContainerStyle={styles.listContainer}
                ListHeaderComponent={
                    <>
                        <View style={styles.summaryGrid}>
                            <SummaryCard label="TOTAL PRODUCTS" value={summaryData.total} />
                            <SummaryCard label="LOW STOCK" value={summaryData.lowStock} />
                            <SummaryCard label="OUT OF STOCK" value={summaryData.outOfStock} />
                            <SummaryCard label="TOTAL PRODUCTS" value={`₹${summaryData.totalValue.toLocaleString('en-IN')}`} />
                        </View>
                        <View style={styles.controlsContainer}>
                            <View style={styles.searchContainer}>
                                <Feather name="search" size={20} color={colors.textLight} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search Products..."
                                    placeholderTextColor={colors.textLight}
                                    value={searchQuery}
                                    onChangeText={handleSearch}
                                />
                            </View>
                             <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddProducts')}>
                                <Feather name="plus" size={20} color={colors.white} />
                                <Text style={styles.addButtonText}>Add Product</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.listHeader}>
                            <Text style={styles.listTitle}>Products</Text>
                            <View style={styles.viewToggleContainer}>
                                <TouchableOpacity onPress={() => setViewMode('grid')} style={[styles.toggleButton, viewMode === 'grid' && styles.toggleActive]}>
                                    <Ionicons name="grid" size={18} color={viewMode === 'grid' ? colors.white : colors.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setViewMode('list')} style={[styles.toggleButton, viewMode === 'list' && styles.toggleActive]}>
                                    <Ionicons name="list" size={18} color={viewMode === 'list' ? colors.white : colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}><Text style={styles.emptyText}>No products found.</Text></View>
                }
            />
        </SafeAreaView>
    );
};

const createDynamicStyles = (height) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: hp(2), paddingHorizontal: wp(4), backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerTitle: { ...typography.titleBold(height), color: colors.textDark, textAlign: 'center' },
    headerIcons: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    profilePic: {  marginLeft:10, width: wp(9),   height: wp(9),
            borderRadius: wp(8),
            resizeMode: "cover", },
    listContainer: { paddingHorizontal: wp(4), paddingBottom: hp(4) },

    // --- Summary & Controls ---
    summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: hp(2) },
    summaryCard: { width: '48.5%', backgroundColor: colors.surface, padding: wp(4), borderRadius: 12, marginBottom: hp(2), alignItems: 'center' },
    summaryValue: { ...typography.titleBold(height), fontSize: RFValue(20, height), color: colors.textDark },
    summaryLabel: { ...typography.paragraphRegular(height), color: colors.textLight, marginTop: hp(0.5), textTransform: 'uppercase', fontSize: RFValue(10, height) },
    controlsContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: hp(1) },
    searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, paddingHorizontal: wp(3) },
    searchInput: { flex: 1, ...typography.paragraphRegular(height), height: hp(6), color: colors.textDark, marginLeft: wp(2) },
    addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: wp(4), height: hp(6), marginLeft: wp(2) },
    addButtonText: { ...typography.button(height), color: colors.white, marginLeft: wp(1.5) },

    // --- List Header & Toggles ---
    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: hp(2) },
    listTitle: { ...typography.titleBold(height), fontSize: RFValue(18, height) },
    viewToggleContainer: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 10 },
    toggleButton: { padding: wp(2.5) },
    toggleActive: { backgroundColor: colors.primary, borderRadius: 8 },
    emptyContainer: { alignItems: 'center', marginTop: hp(10) },
    emptyText: { ...typography.paragraphMedium(height), color: colors.textLight },

     // --- Grid View Styles (Detailed Card) ---
    productGridItem: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 12, padding: wp(3), marginBottom: hp(1.5), alignItems: 'center' },
    productImage: { width: wp(20), height: wp(20), borderRadius: 8, marginRight: wp(4) },
    productDetails: { flex: 1 },
    productName: { ...typography.titleBold(height), fontSize: RFValue(16, height), color: colors.textDark },
    productCategory: { ...typography.paragraphRegular(height), color: colors.textLight, marginVertical: hp(0.5) },
    productPrice: { ...typography.titleBold(height), color: colors.primary, fontSize: RFValue(18, height) },
    productUnit: { ...typography.paragraphMedium(height), color: colors.textLight, fontSize: RFValue(14, height) },
    stockRow: { flexDirection: 'row', alignItems: 'center', marginTop: hp(1) },
    stockBadge: { paddingVertical: hp(0.5), paddingHorizontal: wp(2), borderRadius: 6, marginRight: wp(2) },
    stockText: { ...typography.label(height), fontWeight: 'bold' },
    stockAvailable: { ...typography.paragraphRegular(height), color: colors.textLight },
    productActions: { flexDirection: 'row', gap: wp(5), paddingLeft: wp(2) },

    // --- List View Styles (Table Row) ---
    listViewHeader: { flexDirection: 'row', paddingBottom: hp(1.5), borderBottomWidth: 1, borderBottomColor: colors.border },
    headerColumn: { ...typography.label(height), color: colors.textLight, fontWeight: 'bold' },
    productRowItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, paddingVertical: hp(1.5), borderBottomWidth: 1, borderBottomColor: colors.border },
    listColumnProduct: { flex: 3, flexDirection: 'row', alignItems: 'center' },
    listColumnStock: { flex: 1.5, alignItems: 'center' },
    listColumnPrice: { flex: 1.5, ...typography.paragraphMedium(height), color: colors.textDark, textAlign: 'center' },
    listColumnActions: { flex: 1.5, flexDirection: 'row', justifyContent: 'space-around' },
    listProductImage: { width: wp(12), height: wp(12), borderRadius: 6, marginRight: wp(3) },
    listProductName: { ...typography.paragraphMedium(height), color: colors.textDark },
    listProductCategory: { ...typography.paragraphRegular(height), fontSize: RFValue(11, height), color: colors.textLight },
    listStockBadge: { paddingVertical: hp(0.6), paddingHorizontal: wp(2), borderRadius: 6 },
    listStockText: { ...typography.label(height), fontWeight: 'bold', fontSize: RFValue(11, height) },
});

export default ProductsScreen;
