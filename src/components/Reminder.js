import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { saveNotes } from '../utils/storage';

const Reminder = ({ item, setNotes, notes }) => {
  // const deleteNote = (id) => {
  //   const updatedNotes = notes?.map((note) =>
  //     note.id === id ? { ...note, note_status: "deleted" } : note
  //   );
  //   saveNotes(updatedNotes);
  //   setNotes(updatedNotes);
  // };

  return (
    <View style={styles.noteItem}>
      <Text>Sr No: {item.srNo}</Text>
      <Text>Name: {item.name}</Text>
      <Text>Contact: {item.contactNo}</Text>
      <Text>Address: {item.address}</Text>
      <Text>Next Visit: {item.nextVisitDate}</Text>
      {/* {item?.note_status === "active" &&
        <TouchableOpacity onPress={() => deleteNote(item.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      } */}
    </View>
  );
};

const styles = StyleSheet.create({
  noteItem: { padding: 10, borderWidth: 1, marginBottom: 10 },
  deleteText: { color: 'red' },
});

export default Reminder;
