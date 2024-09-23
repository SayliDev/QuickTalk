import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

/**
 * Thunk asynchrone qui permet de récupérer les données d'un utilisateur
 * à partir de son identifiant unique (UID).
 *
 * @param {string} uid Identifiant unique de l'utilisateur
 * @returns Les données utilisateur
 */
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (uid, thunkAPI) => {
    try {
      // On crée une reference vers le document de l'utilisateur
      const userDocRef = doc(firestore, "users", uid);

      // On lit le document de l'utilisateur
      const userDoc = await getDoc(userDocRef);

      // Si le document existe, on renvoi ses donnes
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        // Sinon, on lance une erreur
        throw new Error("Aucun document utilisateur trouvé.");
      }
    } catch (error) {
      // Si une erreur se produit, on la renvoie avec le thunk
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/* ------------------------------------ x ----------------------------------- */

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null, // Informations utilisateur
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
