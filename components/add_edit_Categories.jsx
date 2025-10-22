import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/Admintheme';


// Define the available background colors
const backgroundColors = [
    '#FFF0E1', '#E8F9E8', '#FFEBEB', '#E8F3FF', '#FFEFEF', '#FFF8E1', '#F0EFFF'
];

const CategoryFormModal = ({ isVisible, onClose, onSave, existingCategory }) => {
    const isEditMode = !!existingCategory;

    // --- FORM STATE ---
    const [categoryName, setCategoryName] = useState('');
    const [imageSource, setImageSource] = useState(null);
    const [selectedBgColor, setSelectedBgColor] = useState(backgroundColors[0]); // Default to the first color
    const [isSaving, setIsSaving] = useState(false);

    // --- Populate form if in Edit Mode ---
    useEffect(() => {
        if (isEditMode && existingCategory) {
            setCategoryName(existingCategory.name || '');
            setImageSource(existingCategory.image || null);
            setSelectedBgColor(existingCategory.bgColor || backgroundColors[0]);
        } else {
            // Reset form for "Add" mode
            setCategoryName('');
            setImageSource(null);
            setSelectedBgColor(backgroundColors[0]);
        }
    }, [existingCategory, isEditMode]);

    // --- EVENT HANDLERS ---
    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission Required", "Allow access to photos to upload image.");
            return;
        }
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 1,
        });
        if (!pickerResult.canceled) {
            setImageSource({ uri: pickerResult.assets[0].uri });
        }
    };

    const handleSave = async () => {
        if (!categoryName) {
            Alert.alert("Missing Information", "Please enter a Category Name.");
            return;
        }
        setIsSaving(true);
        try {
            const categoryData = {
                name: categoryName,
                // Use picked/existing image or a default placeholder if none exists
                image: imageSource || require('../../assets/images/grains.png'),
                bgColor: selectedBgColor,
            };
            await onSave(categoryData);
        } catch (error) {
            Alert.alert("Error", "Could not save the category.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoidingContainer}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.header}>
                                <Text style={styles.modalTitle}>{isEditMode ? 'Edit Category' : 'Add New Category'}</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close-circle" size={24} color={colors.textLight} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={styles.label}>Category Name</Text>
                                <TextInput style={styles.input} value={categoryName} onChangeText={setCategoryName} placeholder="e.g: Grains" />

                                <Text style={styles.label}>Category Image</Text>
                                <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
                                    {imageSource ? (
                                        <Image source={imageSource} style={styles.imagePreview} />
                                    ) : (
                                        <>
                                            <Feather name="upload" size={24} color={colors.primary} />
                                            <Text style={styles.imagePickerText}>Choose image</Text>
                                        </>
                                    )}
                                </TouchableOpacity>

                                <Text style={styles.label}>Background Color</Text>
                                <View style={styles.colorPickerContainer}>
                                    {backgroundColors.map((color) => (
                                        <TouchableOpacity
                                            key={color}
                                            style={[
                                                styles.colorSwatch,
                                                { backgroundColor: color },
                                                selectedBgColor === color && styles.selectedColorSwatch,
                                            ]}
                                            onPress={() => setSelectedBgColor(color)}
                                        />
                                    ))}
                                    {/* Add a button for a custom color picker if needed */}
                                </View>
                            </ScrollView>

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                                    <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave} disabled={isSaving}>
                                    {isSaving ? <ActivityIndicator color={colors.white} /> : <Text style={[styles.buttonText, styles.saveButtonText]}>Save Category</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingContainer: { flex: 1 },
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalView: { margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 25, width: '90%', maxHeight: '80%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: RFValue(18), fontWeight: 'bold', color: colors.textDark },
    label: { fontSize: RFValue(14), color: colors.text, marginBottom: 10, marginTop: 15 },
    input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: RFValue(14) },
    imagePicker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 15, borderStyle: 'dashed', minHeight: 100 },
    imagePickerText: { fontSize: RFValue(14), color: colors.primary, marginLeft: 10 },
    imagePreview: { width: '100%', height: 100, borderRadius: 8, resizeMode: 'contain' },
    colorPickerContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
    colorSwatch: { width: 30, height: 30, borderRadius: 15, margin: 5, borderWidth: 1, borderColor: colors.border },
    selectedColorSwatch: { borderWidth: 3, borderColor: colors.primary },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 15, borderTopWidth: 1, borderTopColor: colors.border },
    button: { flex: 1, borderRadius: 10, padding: 15, alignItems: 'center' },
    cancelButton: { backgroundColor: colors.primaryLight, marginRight: 10 },
    saveButton: { backgroundColor: colors.primary, marginLeft: 10 },
    buttonText: { fontSize: RFValue(14), fontWeight: 'bold' },
    cancelButtonText: { color: colors.text },
    saveButtonText: { color: colors.white },
});

export default CategoryFormModal;
