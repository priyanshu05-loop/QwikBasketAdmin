import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
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
import CategoryFormModal from '../../components/add_edit_Categories';
import SubCategoryFormModal from '../../components/add_edit_subcategories'; // --- IMPORT SUB CATEGORY MODAL ---
import { colors, typography } from '../../constants/Admintheme';
import { categoryService } from '../../services/categories';


// Icons
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';


const CategoriesScreen = () => {
    const navigation = useNavigation();
    const { height } = useWindowDimensions();
    const styles = useMemo(() => createDynamicStyles(height), [height]);
    const isFocused = useIsFocused();

    // --- STATE MANAGEMENT ---
    const [isLoading, setIsLoading] = useState(true);
    const [mainCategories, setMainCategories] = useState([]);
    const [groupedSubCategories, setGroupedSubCategories] = useState({}); // State for grouped subcategories
    const [homepageItemsCount, setHomepageItemsCount] = useState(0);
    const [activeTab, setActiveTab] = useState('Main Categories'); 
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
    const [selectedCategory, setSelectedCategory] = useState(null); // State for editing

    const [isSubModalVisible, setIsSubModalVisible] = useState(false);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    // --- DATA FETCHING ---
     const fetchCategoriesData = async () => {
        try {
            // Fetch all data concurrently
            const [mainCats, groupedSubs, homeItems] = await Promise.all([
                categoryService.getMainCategories(),
                categoryService.getSubCategories(), // Fetches grouped data
                categoryService.getHomepageItems()
            ]);
            setMainCategories(mainCats);
            setGroupedSubCategories(groupedSubs);
            // Calculate total subcategories count from the grouped object
            const totalSubCount = Object.values(groupedSubs).reduce((sum, arr) => sum + arr.length, 0);
            setHomepageItemsCount(homeItems.length);
        } catch (error) {
            Alert.alert("Error", "Could not load category data.");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (isFocused) {
            setIsLoading(true); // Show loader only when focusing initially or after save
            fetchCategoriesData();
        }
    }, [isFocused]);
  

    // --- EVENT HANDLERS ---
    const handleDelete = (categoryId) => {
        Alert.alert(
            "Delete Category", "Are you sure you want to delete this category?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive",
                    onPress: async () => {
                        setMainCategories(prev => prev.filter(c => c.id !== categoryId));
                        await categoryService.deleteMainCategoryAPI(categoryId);
                        // Optionally refetch counts if needed
                         const [subCats, homeItems] = await Promise.all([
                            categoryService.getSubCategories(),
                            categoryService.getHomepageItems()
                        ]);
                        setSubCategoriesCount(subCats.length);
                        setHomepageItemsCount(homeItems.length);
                    },
                },
            ]
        );
    };

    // --- NEW: Delete Sub Category Handler ---
    const handleDeleteSubCategory = (subCategoryId) => {
         Alert.alert(
            "Delete Sub Category", "Are you sure you want to delete this sub category?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive",
                    onPress: async () => {
                        await categoryService.deleteSubCategoryAPI(subCategoryId);
                        await fetchCategoriesData(); // Refetch to update list and counts
                    },
                },
            ]
        );
    };

    const handleOpenModal = (category = null) => {
        setSelectedCategory(category);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedCategory(null);
    };

    // --- NEW: Event Handlers for Sub Category Modal ---
     const handleOpenSubModal = (subCategory = null) => {
        setSelectedSubCategory(subCategory);
        setIsSubModalVisible(true);
    };

    const handleCloseSubModal = () => {
        setIsSubModalVisible(false);
        setSelectedSubCategory(null);
    };
    const handleSaveSubCategory = async (subCategoryData) => {
        try {
            if (selectedSubCategory) { // Edit Mode
                await categoryService.updateSubCategoryAPI(selectedSubCategory.id, subCategoryData);
            } else { // Add Mode
                await categoryService.addSubCategoryAPI(subCategoryData);
            }
            await fetchCategoriesData(); // Refetch all data
            handleCloseSubModal(); // Close modal after successful save
        } catch (error) {
            throw error; // Let the modal handle the alert
        }
    };

//Subcategory end

    const handleSaveCategory = async (categoryData) => {
        try {
            if (selectedCategory) { // Edit Mode
                await categoryService.updateMainCategoryAPI(selectedCategory.id, categoryData);
            } else { // Add Mode
                await categoryService.addMainCategoryAPI(categoryData);
            }
            await fetchCategoriesData(); // Refetch data to show updates
            handleCloseModal();
        } catch (error) {
            throw error; // Let the modal handle the alert
        }
    };



    // --- RENDER FUNCTIONS ---
    const SummaryCard = ({ label, value }) => (
        <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{value}</Text>
            <Text style={styles.summaryLabel}>{label}</Text>
        </View>
    );

    // --- UPDATED CategoryCard ---
    const CategoryCard = ({ item }) => (
        <View style={styles.categoryCard}>
             <View style={styles.cardActions}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleOpenModal(item)}>
                    <Feather name="edit-2" size={16} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                    <Feather name="trash-2" size={16} color={colors.danger} />
                </TouchableOpacity>
            </View>
            {/* View for background color */}
            <View style={[styles.imageContainer, { backgroundColor: item.bgColor || colors.background }]}>
                {/* Image placed on top */}
                <Image source={item.image} style={styles.categoryImage} />
            </View>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.subCategoryCount}>{item.subCategoryCount} Sub Categories</Text>
        </View>
    );

    const renderEmptySection = (title) => (
         <View style={styles.emptyContainer}><Text style={styles.emptyText}>{title} section coming soon!</Text></View>
    );


    // --- NEW: Sub Category Item Renderer ---
    const SubCategoryItem = ({ item }) => (
        <View style={styles.subCategoryItem}>
            <Image source={item.image} style={styles.subCategoryImage} />
            <View style={styles.subCategoryDetails}>
                <Text style={styles.subCategoryName}>{item.name}</Text>
                <Text style={styles.subCategoryParent}>{item.mainCategoryName}</Text>
            </View>
            <View style={styles.subCategoryActions}>
                <TouchableOpacity style={styles.subEditButton} onPress={() => handleOpenSubModal(item)}>
                    <Feather name="edit-2" size={16} color={colors.primary} />
                </TouchableOpacity>
                 {/* Only allow deleting non-default subcategories */}
                 {item.name !== 'All (Default)' && (
                    <TouchableOpacity style={styles.subDeleteButton} onPress={() => handleDeleteSubCategory(item.id)}>
                        <Feather name="trash-2" size={16} color={colors.danger} />
                    </TouchableOpacity>
                 )}
            </View>
        </View>
    );

    // --- NEW: Section Renderer for Sub Categories ---
    const renderSubCategorySection = () => (
        <ScrollView contentContainerStyle={styles.subCategoryScrollContainer}>
             <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Sub Categories</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => handleOpenSubModal()}>
                    <Feather name="plus" size={18} color={colors.white} />
                    <Text style={styles.addButtonText}>Add Sub Category</Text>
                </TouchableOpacity>
            </View>
            {Object.entries(groupedSubCategories).map(([mainCategoryName, subs]) => (
                <View key={mainCategoryName} style={styles.subCategoryGroup}>
                    <Text style={styles.mainCategoryHeader}>{mainCategoryName}</Text>
                    {subs.map(subItem => <SubCategoryItem key={subItem.id} item={subItem} />)}
                </View>
            ))}
        </ScrollView>
    );



    return (
        <SafeAreaView style={styles.container}>
            
            {/* --- RENDER THE MODAL --- */}
            <CategoryFormModal
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                onSave={handleSaveCategory}
                existingCategory={selectedCategory}
            />

            {/* --- RENDER SUB CATEGORY MODAL --- */}
             <SubCategoryFormModal
                isVisible={isSubModalVisible}
                onClose={handleCloseSubModal}
                onSave={handleSaveSubCategory}
                existingSubCategory={selectedSubCategory}
                mainCategoriesList={mainCategories} // Pass the list of main categories
            />


            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu" size={28} color={colors.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Categories</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity><Ionicons name="notifications-outline" size={24} color={colors.textDark} /></TouchableOpacity>
                    <TouchableOpacity><Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.profilePic} /></TouchableOpacity>
                </View>
            </View>

            {/* Summary Cards */}
            <View style={styles.summaryGrid}>
                <SummaryCard label="Main Categories" value={mainCategories.length} />
                <SummaryCard label="Sub Categories" value={Object.values(groupedSubCategories).reduce((sum, arr) => sum + arr.length, 0)} />
                <SummaryCard label="Homepage Items" value={homepageItemsCount} />
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tabButton, activeTab === 'Main Categories' && styles.activeTab]} onPress={() => setActiveTab('Main Categories')}><Text style={[styles.tabText, activeTab === 'Main Categories' && styles.activeTabText]}>Main Categories</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.tabButton, activeTab === 'Sub Categories' && styles.activeTab]} onPress={() => setActiveTab('Sub Categories')}><Text style={[styles.tabText, activeTab === 'Sub Categories' && styles.activeTabText]}>Sub Categories</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.tabButton, activeTab === 'Homepage' && styles.activeTab]} onPress={() => setActiveTab('Homepage')}><Text style={[styles.tabText, activeTab === 'Homepage' && styles.activeTabText]}>Homepage</Text></TouchableOpacity>
            </View>

            {/* Content Area based on Active Tab */}
            {isLoading ? (
                <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>
            ) : (
                <>
                    {/* --- MAIN CATEGORIES SECTION --- */}
                    {activeTab === 'Main Categories' && (
                        <FlatList
                            data={mainCategories}
                            keyExtractor={item => item.id}
                            numColumns={2}
                            renderItem={({ item }) => <CategoryCard item={item} />}
                            contentContainerStyle={styles.gridContainer}
                            ListHeaderComponent={
                                <View style={styles.listHeader}>
                                    <Text style={styles.listTitle}>All Categories</Text>
                                    <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal()}>
                                        <Feather name="plus" size={18} color={colors.white} />
                                        <Text style={styles.addButtonText}>Add Category</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            ListEmptyComponent={ <View style={styles.emptyContainer}><Text style={styles.emptyText}>No main categories found.</Text></View> }
                        />
                    )}
                    {activeTab === 'Sub Categories' &&  renderSubCategorySection()}
                    {activeTab === 'Homepage' && renderEmptySection('Homepage Items')}
                </>
            )}
        </SafeAreaView>
    );
};

const createDynamicStyles = (height) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: hp(10) },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: hp(2), paddingHorizontal: wp(4), backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerTitle: { ...typography.titleBold(height), color: colors.textDark },
    headerIcons: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    profilePic: { width: 32, height: 32, borderRadius: 16 },
    summaryGrid: { flexDirection: 'row', justifyContent: 'space-between', padding: wp(4) },
    summaryCard: { flex: 1, backgroundColor: colors.surface, paddingVertical: hp(2), paddingHorizontal: wp(2), borderRadius: 12, alignItems: 'center', marginHorizontal: wp(1) },
    summaryValue: { ...typography.titleBold(height), fontSize: RFValue(20, height), color: colors.textDark },
    summaryLabel: { ...typography.paragraphRegular(height), color: colors.textLight, marginTop: hp(0.5), textAlign: 'center' },
    tabContainer: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 10, marginHorizontal: wp(4), marginVertical: hp(1), padding: wp(1) },
    tabButton: { flex: 1, paddingVertical: hp(1.5), borderRadius: 8, alignItems: 'center' },
    activeTab: { backgroundColor: colors.primary },
    tabText: { ...typography.paragraphMedium(height), color: colors.text },
    activeTabText: { color: colors.white },
    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(2) },
    listTitle: { ...typography.titleBold(height), fontSize: RFValue(20, height) },
    addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: 20, paddingHorizontal: wp(4), paddingVertical: hp(1) },
    addButtonText: { ...typography.button(height), color: colors.white, marginLeft: wp(1.5), fontSize: RFValue(12, height) },
    gridContainer: { paddingHorizontal: wp(2.5) }, // Adjusted padding for grid
    categoryCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 12,
        margin: wp(1.5),
        alignItems: 'center',
        position: 'relative', 
        paddingBottom: hp(1.5), // Padding at the bottom
    },
    cardActions: {
        position: 'absolute', top: wp(2), right: wp(2), flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        borderRadius: 6, padding: wp(1), zIndex: 1,
    },
    editButton: { padding: 4 },
    deleteButton: { padding: 4, marginLeft: wp(1) },
    // --- UPDATED Styles for Image Container and Image ---
    imageContainer: {
        width: '100%',
        height: hp(18),
        borderRadius: 8,
      justifyContent: 'flex-end', // Align image to bottom
        alignItems: 'center', // Center image horizontally
        overflow: 'hidden', // Ensures image stays within rounded corners
    },
    categoryImage: {
        width: '90%', // Make image slightly smaller than container
        // Make image slightly smaller than container
        resizeMode: 'contain', // Ensure image fits without cropping
        position: 'absolute',  // position relative to container
        bottom: 0,  

    },
    // --- End of update ---
    categoryName: { ...typography.titleBold(height), fontSize: RFValue(16, height), color: colors.textDark, textAlign: 'center' },
    subCategoryCount: { ...typography.paragraphRegular(height), color: colors.textLight, marginTop: hp(0.5) },
    emptyContainer: { alignItems: 'center', marginTop: hp(10), paddingHorizontal: wp(4) },
    emptyText: { ...typography.paragraphMedium(height), color: colors.textLight, textAlign: 'center' },

    // --- NEW Sub Category Styles ---
    subCategoryScrollContainer: {
        paddingHorizontal: wp(4),
        paddingBottom: hp(4),
    },
     subCategoryGroup: {
        marginBottom: hp(3),
    },
    mainCategoryHeader: {
        ...typography.titleBold(height),
        fontSize: RFValue(18, height),
        color: colors.textDark,
        marginBottom: hp(1.5),
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: hp(1),
    },
    subCategoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: wp(3),
        marginBottom: hp(1.5),
    },
    subCategoryImage: {
        width: wp(12),
        height: wp(12),
        borderRadius: 6,
        marginRight: wp(4),
    },
    subCategoryDetails: {
        flex: 1,
    },
    subCategoryName: {
        ...typography.paragraphMedium(height),
        color: colors.textDark,
        fontSize: RFValue(15, height),
    },
    subCategoryParent: {
        ...typography.paragraphRegular(height),
        color: colors.textLight,
        fontSize: RFValue(12, height),
        marginTop: hp(0.5),
    },
    subCategoryActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
    },
     subEditButton: {
        padding: 5, // Optional: Add padding for easier tapping
    },
    subDeleteButton: {
        padding: 5, // Optional: Add padding for easier tapping
    },

});

export default CategoriesScreen;

