import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { getNotes, saveNotes } from "../utils/storage";
import Reminder from "../components/Reminder";
import Tabs from "../components/Tabs";
import Modal from "../components/Modal";

export default function ListNotesScreen({ navigation, route }) {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState("active"); // 'active' | 'deleted'

  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      const storedNotes = await getNotes();
      setNotes(storedNotes || []);
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
      {/* Tabs */}
      <Tabs setFilter={setFilter} filter={filter} />

      {/* Notes List */}
      {filteredNotes.length > 0 ? (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.touchable,
                item.note_status === "deleted" && styles.disabledItem,
              ]}
              onPress={() => {
                if (item.note_status !== "active") return;
                setModalVisible(true);
                setSelectedNote(item);
              }}
            >
              <Reminder item={item} />
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {filter === "active"
              ? "No active notes available."
              : "No deleted notes available."}
          </Text>
        </View>
      )}

      {/* Note Modal */}
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
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  list: {
    // marginTop: 10,
  },
  touchable: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  disabledItem: {
    opacity: 0.6,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#aaa",
  },
});
