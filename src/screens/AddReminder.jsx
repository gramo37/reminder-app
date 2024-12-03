import React, { useState, useEffect, useRef } from "react";
import {
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  Platform,
  View,
  Modal
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
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.label}>Sr No</Text>
        <TextInput
          style={styles.input}
          placeholder="Sr No"
          value={note.srNo}
          onChangeText={(text) => setNote({ ...note, srNo: text })}
        />

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={note.name}
          onChangeText={(text) => setNote({ ...note, name: text })}
        />

        <Text style={styles.label}>Contact No</Text>
        <TextInput
          style={styles.input}
          placeholder="Contact No"
          value={note.contactNo}
          onChangeText={(text) => setNote({ ...note, contactNo: text })}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Address"
          value={note.address}
          multiline
          numberOfLines={5}
          onChangeText={(text) => setNote({ ...note, address: text })}
        />

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

        {/* Replace this with Date Picker */}
        <Text style={styles.label}>Next Visit Date</Text>
        <Text>{date.toString()}</Text>
        <Button title="Select Date and time" onPress={() => setShowPicker((prev) => !prev)} />

        <Text style={styles.label}>Remarks</Text>
        <TextInput
          style={styles.input}
          placeholder="Remarks"
          value={note.remarks}
          onChangeText={(text) => setNote({ ...note, remarks: text })}
        />

        <Button title="Save Note" onPress={handleSave} />
      </ScrollView>
      <Modal visible={showPicker} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DateTimePicker
              mode="single"
              date={date}
              onChange={(params) => setDate(params.date)}
              timePicker={true}
            />
            <Button
              title="Confirm"
              onPress={() => {
                setShowPicker(false);
              }}
            />
            <Button title="Cancel" onPress={() => setShowPicker(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 },
  textArea: {
    borderWidth: 1,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 15,
    borderRadius: 5,
  },
  dateButton: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
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