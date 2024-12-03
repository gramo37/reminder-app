import React, { useState, useEffect, useRef } from "react";
import {
  TextInput,
  StyleSheet,
  Alert,
  Text,
  Platform,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import { getNotes, saveNotes } from "../utils/storage";
import { ScrollView } from "react-native-gesture-handler";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function AddNoteScreen({ navigation, route }) {
  const [note, setNote] = useState({
    srNo: "",
    name: "",
    contactNo: "",
    address: "",
    siteStatus: "",
    requirements: "",
    date: new Date().toISOString(),
    remarks: "",
    note_status: "active",
  });
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD HH:mm"));
  const [showPicker, setShowPicker] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const fetchNotes = async () => {
      const storedNotes = await getNotes();
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
      remarks: "",
      note_status: "active",
    });
  }, [route]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => console.log(token));

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        console.log(value ?? [])
      );
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function schedulePushNotification() {
    let date2 = new Date(date);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: note.name,
        body: note.requirements,
        data: { data: "goes here", test: { test1: "more data" } },
      },
      trigger: {
        type: "date",
        date: date2,
      },
    });
  }

  const handleSave = async () => {
    try {
      if (!note.name || !note.contactNo || !date) {
        Alert.alert("Error", "Please fill all required fields.");
        return;
      }

      const notes = await getNotes();
      const newNote = { ...note, id: Date.now(), date: Date.now(), nextVisitDate: date };
      await saveNotes([...notes, newNote]);

      await schedulePushNotification();

      alert(
        `Reminder "${note.name}" scheduled successfully for next visit date "${date}"`
      );

      navigation.navigate("Reminders", { reload: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Reminder</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Sr No</Text>
        <TextInput
          style={styles.input}
          placeholder="Sr No"
          value={note.srNo}
          onChangeText={(text) => setNote({ ...note, srNo: text })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={note.name}
          onChangeText={(text) => setNote({ ...note, name: text })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Contact No</Text>
        <TextInput
          style={styles.input}
          placeholder="Contact No"
          keyboardType="phone-pad"
          value={note.contactNo}
          onChangeText={(text) => setNote({ ...note, contactNo: text })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Address"
          multiline
          value={note.address}
          onChangeText={(text) => setNote({ ...note, address: text })}
        />
      </View>

      <View style={styles.formGroup}>
      <Text style={styles.label}>Site Status</Text>
        <TextInput
          style={styles.input}
          placeholder="Site Status"
          value={note.siteStatus}
          onChangeText={(text) => setNote({ ...note, siteStatus: text })}
        />

        <Text style={styles.label}>Requirements</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Requirements"
          multiline
          numberOfLines={5}
          value={note.requirements}
          onChangeText={(text) => setNote({ ...note, requirements: text })}
        />
        <Text style={styles.label}>Next Visit Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPicker(true)}
        >
          <Text>{dayjs(date).format("DD/MM/YYYY HH:mm")}</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Remarks</Text>
        <TextInput
          style={styles.input}
          placeholder="Remarks"
          value={note.remarks}
          onChangeText={(text) => setNote({ ...note, remarks: text })}
        />
      </View>

      <View style={styles.formGroup}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Note</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showPicker} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DateTimePicker
              mode="single"
              date={date}
              onChange={(params) => setDate(params.date)}
              timePicker
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowPicker(false)}
            >
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    height: 100,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  saveButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "600" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  modalButtonText: { color: "#fff" },
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}