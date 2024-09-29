import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { deleteObject, ref } from "firebase/storage";

export const deleteFromMessage = createAsyncThunk(
  "message/deleteFromMessage",
  async ({ messageId, imageUrl }, thunkAPI) => {
    try {
      // 1. On crée une reference vers le document "messages" dans Firestore
      const messageDocRef = doc(db, `messages/${messageId}`);

      // 2. Supprime le document de l'élément des messages
      await deleteDoc(messageDocRef);

      // 3. Si une URL de l'image est fournie, on supprime l'image dans le bucket Storage
      if (imageUrl) {
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef);
      }

      // 4. Retourne l'ID de l'élément supprimé
      return messageId;
    } catch (error) {
      console.error("Erreur lors de la suppression du message", error);
      // Gestion de l'erreur
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState: {
    message: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteFromMessage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteFromMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = state.message.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteFromMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default messageSlice.reducer;
