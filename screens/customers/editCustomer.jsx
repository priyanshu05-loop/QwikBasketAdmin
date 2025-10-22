import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';


// --- THEME & DATA IMPORTS ---
import { colors, SIZES, typography } from '../../constants/Admintheme';

// --- DUMMY BACKEND CALLS ---
// Backend developers can replace these with real API calls.
const updateCustomer = async (customerId, updates) => {
  console.log(`Updating customer ${customerId} with:`, updates);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

const deleteCustomerAPI = async (customerId) => {
    console.log(`Deleting customer ${customerId} from backend...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
};

// --- Main Edit Customer Screen Component ---
const EditCustomerScreen = ({ navigation, route }) => {
  // Receive the customer data passed from the Customers list screen
  const { customer } = route.params;
  const { height } = useWindowDimensions();
   const styles = useMemo(() => createDynamicStyles(height), [height]);

  // --- STATE MANAGEMENT ---
  const [status, setStatus] = useState(customer.status);
 
  const [creditDays, setCreditDays] = useState(String(customer.creditDays));
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const updates = { status, creditDays: Number(creditDays) };
    
    // --- BACKEND INTEGRATION POINT ---
    const response = await updateCustomer(customer.id, updates);
    setIsSaving(false);

    if (response.success) {
      Alert.alert("Success", "Customer details have been updated.", [
        // We navigate back to the list screen after success.
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert("Error", "Could not save changes. Please try again.");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to permanently delete this customer? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
            // --- BACKEND INTEGRATION POINT ---
            const response = await deleteCustomerAPI(customer.id);
            if (response.success) {
                 Alert.alert("Deleted", "Customer has been deleted.", [
                    { text: "OK", onPress: () => navigation.goBack() }
                 ]);
            } else {
                Alert.alert("Error", "Could not delete customer.");
            }
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* --- Custom Header for this screen --- */}
        <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="menu" size={28} color={colors.textDark} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Customers</Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity><Ionicons name="notifications-outline" size={24} color={colors.textDark} /></TouchableOpacity>
                        <TouchableOpacity><Image source={{ uri: 'https://cdn.mos.cms.futurecdn.net/v2/t:0,l:280,cw:720,ch:720,q:80,w:720/ZyiBw5xgHMWSEikFkK3mH8.jpg' }} style={styles.profilePic} /></TouchableOpacity>
                    </View>
          </View>

      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* --- Form Section --- */}
        <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Status</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={status}
                        onValueChange={(itemValue) => setStatus(itemValue)}
                        style={styles.picker}
                        dropdownIconColor={colors.text}
                    >
                        <Picker.Item label="Verified" value="Verified" />
                        <Picker.Item label="Pending" value="Pending" />
                    </Picker>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Credit days</Text>
                <TextInput
                    style={styles.input}
                    value={creditDays}
                    onChangeText={setCreditDays}
                    keyboardType="numeric"
                    placeholder="e.g., 30 "
                />
            </View>
            
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges} disabled={isSaving}>
                  {isSaving ? <ActivityIndicator color={colors.white} /> : <Text style={styles.saveButtonText}>Save Customer</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                  <Text style={styles.deleteButtonText}>Delete Customer</Text>
                </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createDynamicStyles = (height) => StyleSheet.create({
 safeArea: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: hp(2), paddingHorizontal: wp(4), backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
        headerTitle: { ...typography.titleBold(height), color: colors.textDark, textAlign: 'center' },
        headerIcons: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
        
        profilePic: {  marginLeft:10, width: wp(9),   height: wp(9),
            borderRadius: wp(8),
            resizeMode: "cover", },

    scrollContainer: {
        padding: SIZES.padding,
    },
    formContainer: {
        backgroundColor: colors.surface,
        borderRadius: SIZES.radius,
        padding: 20,
    },
    inputGroup: {
        marginBottom: 25,
    },
    inputLabel: {
        // Use the dynamic typography function
        ...typography.button(height),
        color: colors.textDark,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: SIZES.radius,
        padding: 15,
        // Use the dynamic typography function
        ...typography.paragraphRegular(height),
        color: colors.textDark,
    },
    pickerContainer: {
        backgroundColor: colors.white,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
    },
    picker: {
        height: 50,
        // Note: Picker styling can be inconsistent across platforms.
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#11bd3145',
        padding: 15,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        marginRight: 10,
        minHeight: 50,
        justifyContent: 'center',
    },
    saveButtonText: {
        // Use the dynamic typography function for buttons
        ...typography.button(height),
        color: '#28A745',
    },
    deleteButton: {
        flex: 1,
        backgroundColor: '#FDECEC', // Light red
        padding: 15,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        marginLeft: 10,
    },
    deleteButtonText: {
        // Use the dynamic typography function for buttons
        ...typography.button(height),
        color: colors.danger,
    },
});

export default EditCustomerScreen;

