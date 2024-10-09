import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToast } from "../store/toastSlice";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, firestore, storage } from "./../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const useProfilePicture = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const saveProfilePicture = async (file, setLoading, pagePath) => {
    if (!file) {
      dispatch(
        addToast({
          id: Date.now(),
          message: "Aucun fichier sélectionné !",
          class: "info",
        })
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Création d'une référence au storage
      const storageRef = ref(
        storage,
        `users/${auth.currentUser.uid}/profilePicture`
      );

      // Upload du fichier
      await uploadBytes(storageRef, file);

      // Récupération de l'URL du fichier téléchargé
      const downloadUrl = await getDownloadURL(storageRef);

      // Mise à jour du profil utilisateur avec l'URL
      await updateDoc(doc(firestore, "users", auth.currentUser.uid), {
        photoURL: downloadUrl,
      });

      dispatch(
        addToast({
          id: Date.now(),
          message: "Photo de profil mise à jour avec succès !",
          class: "success",
        })
      );
    } catch (error) {
      setError("Erreur lors de la mise à jour de la photo de profil.");
      dispatch(
        addToast({
          id: Date.now(),
          message: error.message || "Une erreur est survenue.",
          class: "error",
        })
      );
    } finally {
      setLoading(false);
      if (pagePath) {
        navigate(pagePath);
      }
    }
  };

  return { saveProfilePicture, loading, error };
};

export default useProfilePicture;
