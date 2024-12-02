import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = 'NOTES_KEY23r2352390';

export const getNotes = async () => {
  const notes = await AsyncStorage.getItem(NOTES_KEY);
  return notes ? JSON.parse(notes) : [];
};

export const saveNotes = async (notes) => {
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};
