import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/Admintheme'; // Ensure path is correct

const EditOrderStatusModal = ({ isVisible, onClose, order, onUpdateStatus }) => {
    // State to hold the new status selected in the picker
    const [selectedStatus, setSelectedStatus] = useState('');

    // When the modal opens or the order changes, set the initial picker value
    // to the order's current status.
    useEffect(() => {
        if (order) {
            setSelectedStatus(order.status);
        }
    }, [order]);

    if (!order) return null; // Don't render anything if there's no order

    const handleUpdate = () => {
        // Call the update function passed from the parent screen
        onUpdateStatus(order.id, selectedStatus);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.modalTitle}>Edit Order Status</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close-circle" size={24} color={colors.textLight} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Order Status</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedStatus}
                            onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Pending" value="Pending" />
                            <Picker.Item label="In Transit" value="In Transit" />
                            <Picker.Item label="Delivered" value="Delivered" />
                        </Picker>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={handleUpdate}>
                            <Text style={[styles.buttonText, styles.updateButtonText]}>Update Status</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        // Using a generic font size as this is a new component
        fontSize: RFValue(18),
        fontWeight: 'bold',
        color: colors.textDark,
    },
    label: {
        fontSize: RFValue(14),
        color: colors.text,
        marginBottom: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        marginBottom: 30,
    },
    picker: {
        width: '100%',
        height: 50, // This might need adjustment based on the OS
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        borderRadius: 10,
        padding: 15,
        elevation: 2,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: colors.primaryLight,
        marginRight: 10,
    },
    updateButton: {
        backgroundColor: colors.primary,
        marginLeft: 10,
    },
    buttonText: {
        // Using a generic font size
        fontSize: RFValue(14),
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: colors.primary,
    },
    updateButtonText: {
        color: colors.white,
    },
});

export default EditOrderStatusModal;
