import { Picker } from '@react-native-picker/picker';
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

const AddProductScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { height } = useWindowDimensions();
    const styles = useMemo(() => createDynamicStyles(height), [height]);

// --- Check if we are in "Edit Mode" ---
    const existingProductId = route.params?.productId;
    const isEditMode = !!existingProductId;

    // --- FORM STATE ---
    const [imageSource, setImageSource] = useState(null); 
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [packagingQty, setPackagingQty] = useState('');
    const [origin, setOrigin] = useState('');
    const [variety, setVariety] = useState('');
    const [fssai, setFssai] = useState('');
    const [description, setDescription] = useState('');
    
    const [isLoading, setIsLoading] = useState(isEditMode); // Only load if in edit mode
    const [isSaving, setIsSaving] = useState(false);


   useEffect(() => {
        if (isEditMode) {
            console.log(`[EDIT MODE] Attempting to fetch product with ID: ${existingProductId}`);
            const fetchProductData = async () => {
                try {
                    const product = await productService.getProductById(existingProductId);
                    console.log("[EDIT MODE] Fetched data:", product);

                    if (product) {
                        // fallbacks to prevent errors from null/undefined data ---
                        setImageSource(product.image || null); 
                        setProductName(product.name || '');
                        setCategory(product.category || '');
                        setSubCategory(product.subCategory || '');
                        setPrice(String(product.price || ''));
                        setStock(String(product.stock || ''));
                        setPackagingQty(String(product.packagingQty || ''));
                        setOrigin(product.origin || '');
                        setVariety(product.variety || '');
                        setFssai(product.fssai || '');
                        setDescription(product.description || '');
                        console.log("[EDIT MODE] State has been successfully populated.");
                    } else {
                         Alert.alert("Error", `Product with ID "${existingProductId}" not found.`);
                    }
                } catch (error) {
                    console.error("[EDIT MODE] Error fetching product:", error);
                    Alert.alert("Error", "Could not fetch product details.");
                } finally {
                    console.log("[EDIT MODE] Fetch process finished. Setting isLoading to false.");
                    setIsLoading(false);
                }
            };
            fetchProductData();
        }
    }, [existingProductId, isEditMode]);


    
    // --- DUMMY DATA for pickers ---
    const categories = ['Spices', 'Pulses', 'Oils', 'Grains'];
    const subCategories = {
        'Spices': ['Whole Spices', 'Ground Spices'],
        'Pulses': ['Lentils', 'Beans'],
        'Oils': ['Vegetable Oil', 'Mustard Oil'],
        'Grains': ['Rice', 'Wheat'],
    };


    // --- EVENT HANDLERS ---
    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "You need to allow access to your photos to upload an image.");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!pickerResult.canceled) {
            // --- FIX 3: Set the image source as a URI object ---
            setImageSource({ uri: pickerResult.assets[0].uri });
        }
    };

    const handleSaveProduct = async () => {
        // Basic Validation
        if (!productName || !price || !stock) {
            Alert.alert("Missing Information", "Please fill in at least the Product Name, Price, and Stock.");
            return;
        }
        
        setIsSaving(true);
        
        try {
            const productData = {
                name: productName,
                category,
                subCategory,
                price: parseFloat(price),
                stock: parseInt(stock, 10),
                packagingQty: parseInt(packagingQty, 10),
                origin,
                variety,
                fssai,
                description,
                  
                image: imageSource || require('../../assets/images/product.png'),
            };
            if (isEditMode) {
                await productService.updateProductAPI(existingProductId, productData);
                Alert.alert("Success", "Product updated successfully!", [{ text: "OK", onPress: () => navigation.goBack() }]);
            } else {
                await productService.addProductAPI(productData);
                Alert.alert("Success", "Product added successfully!", [{ text: "OK", onPress: () => navigation.goBack() }]);
            }

        } catch (error) {
            Alert.alert("Error", `Could not save the product. ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{isEditMode ? 'Edit Product' : 'Add New Product'}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color={colors.textDark} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* --- Product Image --- */}
                <Text style={styles.inputLabel}>Product Image</Text>
                <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
                    {/* The Image component can now handle both image types --- */}
                    {imageSource ? (
                        <Image source={imageSource} style={styles.productImagePreview} />
                    ) : (
                        <>
                            <Feather name="image" size={40} color={colors.textLight} />
                            <Text style={styles.imagePickerText}>Tap to upload image</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* --- Form Inputs --- */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Product Name</Text>
                    <TextInput style={styles.input} value={productName} onChangeText={setProductName} placeholder="e.g., Black Pepper" />
                </View>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Category</Text>
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
                             <Picker.Item label="Select Category..." value="" />
                             {categories.map(cat => <Picker.Item key={cat} label={cat} value={cat} />)}
                        </Picker>
                    </View>
                </View>

                 <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Sub-Category</Text>
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={subCategory} onValueChange={(itemValue) => setSubCategory(itemValue)} enabled={!!category}>
                             <Picker.Item label="Select Sub-Category..." value="" />
                             {category && subCategories[category]?.map(sub => <Picker.Item key={sub} label={sub} value={sub} />)}
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Price per kg (₹)</Text>
                    <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="e.g., 250" keyboardType="numeric" />
                </View>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Stock Quantity (kg)</Text>
                    <TextInput style={styles.input} value={stock} onChangeText={setStock} placeholder="e.g., 500" keyboardType="numeric" />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Packaging Quantity</Text>
                    <TextInput style={styles.input} value={packagingQty} onChangeText={setPackagingQty} placeholder="e.g., 500" keyboardType="numeric" />
                </View>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Origin</Text>
                    <TextInput style={styles.input} value={origin} onChangeText={setOrigin} placeholder="e.g., Kerala, India" />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Variety</Text>
                    <TextInput style={styles.input} value={variety} onChangeText={setVariety} placeholder="e.g., Hybrid" />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Seller FSSAI</Text>
                    <TextInput style={styles.input} value={fssai} onChangeText={setFssai} placeholder="e.g., 10020064002537" />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Description</Text>
                    <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Enter product description" multiline />
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveProduct} disabled={isSaving}>
                   {isSaving ? <ActivityIndicator color={colors.white} /> : <Text style={styles.saveButtonText}>Save Product</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const createDynamicStyles = (height) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.surface },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: wp(4), borderBottomWidth: 1, borderBottomColor: colors.border },
    headerTitle: { ...typography.titleBold(height), fontSize: RFValue(18, height) },
    scrollContainer: { padding: wp(4) },
    
    imagePicker: {
        height: hp(15),
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: 'dashed',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        marginBottom: hp(3),
    },
    imagePickerText: { ...typography.paragraphRegular(height), color: colors.textLight, marginTop: hp(1) },
    productImagePreview: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    inputGroup: { marginBottom: hp(2.5) },
    inputLabel: { ...typography.paragraphMedium(height), color: colors.textDark, marginBottom: hp(1) },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
        ...typography.paragraphRegular(height),
        backgroundColor: colors.white,
    },
    textArea: {
        height: hp(12),
        textAlignVertical: 'top',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        justifyContent: 'center',
    },
    footer: {
        padding: wp(4),
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    saveButton: {
        backgroundColor: colors.primary,
        padding: hp(2),
        borderRadius: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        ...typography.button(height),
        color: colors.white,
    },
});

export default AddProductScreen;
