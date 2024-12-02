import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Touchable,
  TouchableOpacity,
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
  }

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
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={editableNote.name}
            onChangeText={(text) =>
              setEditableNote({ ...editableNote, name: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Contact No"
            keyboardType="phone-pad"
            value={editableNote.contactNo}
            onChangeText={(text) =>
              setEditableNote({ ...editableNote, contactNo: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={editableNote.address}
            onChangeText={(text) =>
              setEditableNote({ ...editableNote, address: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Site Status"
            value={editableNote.siteStatus}
            onChangeText={(text) =>
              setEditableNote({ ...editableNote, siteStatus: text })
            }
          />
          <TextInput
            style={styles.textArea}
            placeholder="Requirements"
            multiline
            value={editableNote.requirements}
            onChangeText={(text) =>
              setEditableNote({ ...editableNote, requirements: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Remarks"
            value={editableNote.remarks}
            onChangeText={(text) =>
              setEditableNote({ ...editableNote, remarks: text })
            }
          />
          <View style={{ ...styles.buttons, marginLeft: 10, marginRight: 10 }}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Save" onPress={handleSave} />
          </View>
          <View style={{ ...styles.buttons, margin: 10 }}>
            <TouchableOpacity style={{ width: 264 }}>
              <Button color="red" title="Delete" onPress={handleDelete} />
            </TouchableOpacity>
          </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    height: 80,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default MyModal;
