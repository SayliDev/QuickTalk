import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
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
      const usersCollectionRef = collection(firestore, "users");
      const usersDocs = await getDocs(usersCollectionRef);

      // Assure que chaque utilisateur est stocké avec son id
      const users = usersDocs.docs.map((userDoc) => ({
        id: userDoc.id,
        ...userDoc.data(),
      }));

      console.log("Utilisateurs récupérés dans fetchAllUsers:", users); // Ajoute ce log pour déboguer
      return users;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/* ------------------------------------ x ----------------------------------- */

export const sendRequest = createAsyncThunk(
  "user/sendRequest",
  async ({ userId, recipientId }, thunkAPI) => {
    try {
      const userDocRef = doc(firestore, "users", userId);
      await updateDoc(userDocRef, {
        pendingRequests: arrayUnion(recipientId),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
/* ------------------------------------ x ----------------------------------- */

const userSlice = createSlice({
  name: "user",
  initialState: {
    allUsers: [], // Pour stocker tous les utilisateurs
    currentUser: null, // Pour stocker un utilisateur spécifique
    loading: false,
    error: null,
    userId: null,
    recipientId: null,
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
        state.currentUser = action.payload;
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
        state.allUsers = action.payload;
        state.loading = false;
      })

      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(sendRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Met à jour l'état local pour refléter la nouvelle requête envoyée
        const updatedUserIndex = state.allUsers.findIndex(
          (user) => user.id === action.meta.arg.userId
        );
        if (updatedUserIndex !== -1) {
          state.allUsers[updatedUserIndex].pendingRequests.push(
            action.meta.arg.recipientId
          );
        }
      })

      .addCase(sendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, setRecipient } = userSlice.actions;

export default userSlice.reducer;
