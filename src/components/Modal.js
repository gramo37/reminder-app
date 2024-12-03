import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const MyModal = ({ visible, onClose, note, onSave, onDelete }) => {
  const [editableNote, setEditableNote] = useState({});

  useEffect(() => {
    if (note) {
      setEditableNote(note);
    }
  }, [note]);

  const handleSave = () => {
    if (editableNote.nextVisitDate !== note.nextVisitDate) {
      Alert.alert(
        "Error",
        "Next Visit Date cannot be edited. Please create a new note."
      );
      return;
    }
    onSave(editableNote);
    onClose();
  };

  const handleDelete = () => {
    onDelete(editableNote);
    onClose();
  };

  if (!note) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Note</Text>
          <ScrollView contentContainerStyle={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={editableNote.name}
                onChangeText={(text) =>
                  setEditableNote({ ...editableNote, name: text })
                }
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Contact No</Text>
              <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                value={editableNote.contactNo}
                onChangeText={(text) =>
                  setEditableNote({ ...editableNote, contactNo: text })
                }
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.textArea}
                multiline
                value={editableNote.address}
                onChangeText={(text) =>
                  setEditableNote({ ...editableNote, address: text })
                }
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Site Status</Text>
              <TextInput
                style={styles.input}
                value={editableNote.siteStatus}
                onChangeText={(text) =>
                  setEditableNote({ ...editableNote, siteStatus: text })
                }
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Requirements</Text>
              <TextInput
                style={styles.textArea}
                multiline
                value={editableNote.requirements}
                onChangeText={(text) =>
                  setEditableNote({ ...editableNote, requirements: text })
                }
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Remarks</Text>
              <TextInput
                style={styles.input}
                value={editableNote.remarks}
                onChangeText={(text) =>
                  setEditableNote({ ...editableNote, remarks: text })
                }
              />
            </View>
          </ScrollView>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "91%",
    maxHeight: "82%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  formContainer: {
    paddingBottom: 10,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    height: 80,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "red",
    marginTop: 10,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 4
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default MyModal;
