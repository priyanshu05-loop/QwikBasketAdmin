import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
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
// Import theme and potentially the service if needed (though parent screen handles saving)
import { colors } from '../constants/Admintheme';


const SubCategoryFormModal = ({ isVisible, onClose, onSave, existingSubCategory, mainCategoriesList }) => {
    const isEditMode = !!existingSubCategory;

    // --- FORM STATE ---
    const [subCategoryName, setSubCategoryName] = useState('');
    const [selectedParentId, setSelectedParentId] = useState('');
    const [imageSource, setImageSource] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // --- Populate form if in Edit Mode or reset ---
    useEffect(() => {
        if (isVisible) {
            if (isEditMode && existingSubCategory) {
                setSubCategoryName(existingSubCategory.name || '');
                setSelectedParentId(existingSubCategory.mainCategoryId || '');
                setImageSource(existingSubCategory.image || null);
            } else {
                // Reset form for "Add" mode
                setSubCategoryName('');
                setSelectedParentId('');
                setImageSource(null);
            }
        }
    }, [existingSubCategory, isEditMode, isVisible]);

    // --- EVENT HANDLERS ---
    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission Required", "Allow access to photos."); return;
        }
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 1,
        });
        if (!pickerResult.canceled) {
            setImageSource({ uri: pickerResult.assets[0].uri });
        }
    };

    const handleSave = async () => {
        if (!subCategoryName || !selectedParentId) {
            Alert.alert("Missing Information", "Please enter a Name and select a Parent Category.");
            return;
        }
        setIsSaving(true);
        try {
            const subCategoryData = {
                name: subCategoryName,
                mainCategoryId: selectedParentId,
                image: imageSource || require('../../assets/images/all_grains.png'), // Default sub-cat image
            };
            await onSave(subCategoryData); // Call the onSave passed from parent
        } catch (error) {
            Alert.alert("Error", "Could not save the sub category.");
            setIsSaving(false); // Ensure loader stops on error
        }
        // No finally here - parent screen should handle closing modal/resetting loading
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
                                <Text style={styles.modalTitle}>{isEditMode ? 'Edit Sub Category' : 'Add New Sub Category'}</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close-circle" size={24} color={colors.textLight} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={styles.label}>Sub Category Name</Text>
                                <TextInput style={styles.input} value={subCategoryName} onChangeText={setSubCategoryName} placeholder="e.g. Frozen fruits" />

                                <Text style={styles.label}>Parent Category</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectedParentId}
                                        onValueChange={(itemValue) => setSelectedParentId(itemValue)}
                                    >
                                        <Picker.Item label="Select Parent Category..." value="" />
                                        {mainCategoriesList?.map(cat => (
                                            <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                                        ))}
                                    </Picker>
                                </View>

                                <Text style={styles.label}>Sub Category Image</Text>
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
                            </ScrollView>

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                                    <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave} disabled={isSaving}>
                                    {isSaving ? <ActivityIndicator color={colors.white} /> : <Text style={[styles.buttonText, styles.saveButtonText]}>Save Sub Category</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
};

// Styles are very similar to CategoryFormModal, adjusted slightly if needed
const styles = StyleSheet.create({
    keyboardAvoidingContainer: { flex: 1 },
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalView: { margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 25, width: '90%', maxHeight: '80%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: RFValue(18), fontWeight: 'bold', color: colors.textDark },
    label: { fontSize: RFValue(14), color: colors.text, marginBottom: 10, marginTop: 15 },
    input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: RFValue(14) },
    pickerContainer: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, justifyContent: 'center' },
    imagePicker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 15, borderStyle: 'dashed', minHeight: 100 },
    imagePickerText: { fontSize: RFValue(14), color: colors.primary, marginLeft: 10 },
    imagePreview: { width: '100%', height: 100, borderRadius: 8, resizeMode: 'contain' },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, paddingTop: 15, borderTopWidth: 1, borderTopColor: colors.border },
    button: { flex: 1, borderRadius: 10, padding: 15, alignItems: 'center' },
    cancelButton: { backgroundColor: colors.primaryLight, marginRight: 10 },
    saveButton: { backgroundColor: colors.primary, marginLeft: 10 },
    buttonText: { fontSize: RFValue(14), fontWeight: 'bold' },
    cancelButtonText: { color: colors.text },
    saveButtonText: { color: colors.white },
});

export default SubCategoryFormModal;
