import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getNotes } from "../utils/storage";
import Reminder from "../components/Reminder";
import Tabs from "../components/Tabs";
import Modal from "../components/Modal";
import { saveNotes } from '../utils/storage';

export default function ListNotesScreen({navigation, route}) {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState("active"); // 'active' | 'deleted'

  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      const storedNotes = await getNotes();
      setNotes(storedNotes);
    };
    loadNotes();
  }, [filter, navigation, route]);

  const filteredNotes = notes?.filter((note) =>
    filter === "active"
      ? note.note_status !== "deleted"
      : note.note_status === "deleted"
  );

  const handleEditNote = (updatedNote) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const handleDeleteNote = (updatedNote) => {
    const updatedNotes = notes?.map((note) =>
      note.id === updatedNote.id ? { ...note, note_status: "deleted" } : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  return (
    <View style={styles.container}>
      <Tabs setFilter={setFilter} filter={filter} /> 
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id.toString()}
        style={{marginTop: 10}}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {
            if(item?.note_status !== "active") return 
            setModalVisible(true)
            setSelectedNote(item)
          }}>
            <Reminder item={item} setNotes={setNotes} notes={notes}/>
          </TouchableOpacity>
        )}
      />
      <Modal 
        visible={isModalVisible}
        note={selectedNote}
        onClose={() => setModalVisible(false)}
        onSave={handleEditNote}
        onDelete={handleDeleteNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});
