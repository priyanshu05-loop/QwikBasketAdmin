import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
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
    View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../constants/Admintheme";

const OfferFormModal = ({ isVisible, onClose, onSave, existingOffer }) => {
  const isEditMode = !!existingOffer;

  // --- FORM STATE ---
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [imageSource, setImageSource] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- Populate form if in Edit Mode ---
  useEffect(() => {
    if (isEditMode && existingOffer) {
      setTitle(existingOffer.title || "");
      setSubtitle(existingOffer.subtitle || "");
      setDescription(existingOffer.description || "");
      setStatus(existingOffer.status || "Active");
      setImageSource(existingOffer.bannerImage || null);
    } else {
      // Reset form for "Add" mode
      setTitle("");
      setSubtitle("");
      setDescription("");
      setStatus("Active");
      setImageSource(null);
    }
  }, [existingOffer, isEditMode]);

  // --- EVENT HANDLERS ---
  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "You need to allow access to your photos."
      );
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!pickerResult.canceled) {
      setImageSource({ uri: pickerResult.assets[0].uri });
    }
  };

  const handleSave = async () => {
    if (!title || !subtitle) {
      Alert.alert(
        "Missing Information",
        "Please enter at least a Title and Subtitle."
      );
      return;
    }
    setIsSaving(true);
    try {
      const offerData = {
        title,
        subtitle,
        description,
        status,
        bannerImage:
          imageSource || require("../../assets/images/OfferBanner1.png"), // Use new or default
      };
      await onSave(offerData);
    } catch (error) {
      Alert.alert("Error", "Could not save the offer.");
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        {/* --- 3. Allow dismissing keyboard by tapping background --- */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.header}>
                <Text style={styles.modalTitle}>
                  {isEditMode ? "Edit Offer" : "Add New Offers"}
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons
                    name="close-circle"
                    size={24}
                    color={colors.textLight}
                  />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g: Special offer on Pulses"
                />

                <Text style={styles.label}>Subtitle</Text>
                <TextInput
                  style={styles.input}
                  value={subtitle}
                  onChangeText={setSubtitle}
                  placeholder="e.g: Valid only Today"
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe your offer ...."
                  multiline
                />

                <Text style={styles.label}>Image</Text>
                <TouchableOpacity
                  style={styles.imagePicker}
                  onPress={handlePickImage}
                >
                  {imageSource ? (
                    <Image source={imageSource} style={styles.imagePreview} />
                  ) : (
                    <>
                      <Feather name="upload" size={24} color={colors.primary} />
                      <Text style={styles.imagePickerText}>Choose Image</Text>
                    </>
                  )}
                </TouchableOpacity>

                <Text style={styles.label}>Status</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={status}
                    onValueChange={(itemValue) => setStatus(itemValue)}
                  >
                    <Picker.Item label="Active" value="Active" />
                    <Picker.Item label="Inactive" value="Inactive" />
                  </Picker>
                </View>
              </ScrollView>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Text style={[styles.buttonText, styles.saveButtonText]}>
                      Save Offer
                    </Text>
                  )}
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
    keyboardAvoidingContainer: {
        flex: 1,
    },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: colors.textDark,
  },
  label: {
    fontSize: RFValue(14),
    color: colors.text,
    marginBottom: 10,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: RFValue(14),
  },
  textArea: { height: 100, textAlignVertical: "top" },
  imagePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
    borderStyle: "dashed",
  },
  imagePickerText: {
    fontSize: RFValue(14),
    color: colors.primary,
    marginLeft: 10,
  },
  imagePreview: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    resizeMode: "contain",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    justifyContent: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  button: { flex: 1, borderRadius: 10, padding: 15, alignItems: "center" },
  cancelButton: { backgroundColor: colors.primaryLight, marginRight: 10 },
  saveButton: { backgroundColor: colors.primary, marginLeft: 10 },
  buttonText: { fontSize: RFValue(14), fontWeight: "bold" },
  cancelButtonText: { color: colors.text },
  saveButtonText: { color: colors.white },
});

export default OfferFormModal;
