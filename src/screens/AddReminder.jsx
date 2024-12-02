import React, { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { getNotes, saveNotes } from "../utils/storage";
import { ScrollView } from "react-native-gesture-handler";

export default function AddNoteScreen({ navigation, route }) {
  const [note, setNote] = useState({
    srNo: "",
    name: "",
    contactNo: "",
    address: "",
    siteStatus: "",
    requirements: "",
    date: new Date().toISOString(),
    nextVisitDate: new Date().toISOString(),
    remarks: "",
    note_status: "active",
  });

  useEffect(() => {
    const fetchNotes = async () => {
      const storedNotes = await getNotes();

      // Automatically set a unique Sr No
      const maxSrNo =
        storedNotes.length > 0
          ? Math.max(...storedNotes.map((n) => parseInt(n.srNo, 10) || 0))
          : 0;
      setNote((prevNote) => ({ ...prevNote, srNo: (maxSrNo + 1).toString() }));
    };

    fetchNotes();
  }, [route]);

  useEffect(() => {
    setNote({
      srNo: "",
      name: "",
      contactNo: "",
      address: "",
      siteStatus: "",
      requirements: "",
      date: new Date().toISOString(),
      nextVisitDate: new Date().toISOString(),
      remarks: "",
      note_status: "active",
    });
  }, [route]);

  const handleSave = async () => {
    if (!note.name || !note.contactNo || !note.nextVisitDate) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const notes = await getNotes();
    const newNote = { ...note, id: Date.now(), date: Date.now() };
    await saveNotes([...notes, newNote]);
    navigation.navigate("Reminders", { reload: true });
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Sr No"
        value={note.srNo}
        onChangeText={(text) => setNote({ ...note, srNo: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={note.name}
        onChangeText={(text) => setNote({ ...note, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact No"
        value={note.contactNo}
        onChangeText={(text) => setNote({ ...note, contactNo: text })}
      />
      <TextInput
        style={styles.textArea}
        placeholder="Address"
        value={note.address}
        multiline
        numberOfLines={5}
        onChangeText={(text) => setNote({ ...note, address: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Site Status"
        value={note.siteStatus}
        onChangeText={(text) => setNote({ ...note, siteStatus: text })}
      />
      <TextInput
        style={styles.textArea}
        placeholder="Requirements"
        multiline
        numberOfLines={5}
        value={note.requirements}
        onChangeText={(text) => setNote({ ...note, requirements: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Next Visit Date"
        value={note.nextVisitDate}
        onChangeText={(text) => setNote({ ...note, nextVisitDate: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Remarks"
        value={note.remarks}
        onChangeText={(text) => setNote({ ...note, remarks: text })}
      />
      <Button title="Save Note" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  textArea: {
    borderWidth: 1,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 10,
  },
});
