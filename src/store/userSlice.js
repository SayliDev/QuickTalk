import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
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

// FetchAllUsers
/**
 * Thunk asynchrone qui permet de récupérer les données de tous les utilisateurs
 * de la base de données.
 *
 * @returns Les données de tous les utilisateurs
 */
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      // On crée une référence vers la collection des utilisateurs
      const usersCollectionRef = collection(firestore, "users");

      // On lit les documents de la collection
      const usersDocs = await getDocs(usersCollectionRef);

      // On stocke les données des utilisateurs dans un tableau
      const users = usersDocs.docs.map((userDoc) => userDoc.data());

      // On renvoie le tableau des utilisateurs
      return users;
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
    userId: null,
    recipientId: null, // Stockage du recipientId
  },
  reducers: {
    setUser(state, action) {
      state.userId = action.payload.userId;
    },
    setRecipient(state, action) {
      state.recipientId = action.payload;
    },
  },
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
      })

      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })

      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, setRecipient } = userSlice.actions;

export default userSlice.reducer;
