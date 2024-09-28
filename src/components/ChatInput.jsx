import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth, db, firestore } from "../firebase/firebase";
import { addToast } from "../store/toastSlice";
import { fetchUserData } from "../store/userSlice";
import NoCreditModal from "./NoCreditModal";
import ToastContainer from "./Toast/ToastContainer";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const modalRef = useRef(null); // Ref pour la modal
  // Fonction pour ouvrir la modal
  const [user] = useAuthState(auth);
  const { data: userData, error } = useSelector((state) => state.user);
  const recipientId = useSelector((state) => state.user.recipientId); // Récupération du recipientId
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchUserData(user.uid));
    }
  }, [user, dispatch]);

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const sendMessage = async (e, text, senderId) => {
    e.preventDefault();
    if (userData?.credits > 0) {
      try {
        // Ajouter le message
        await addDoc(collection(db, "messages"), {
          senderId,
          recipientId,
          text,
          timestamp: serverTimestamp(),
        });

        // Décrémente les crédits
        const userDocRef = doc(firestore, "users", user.uid);
        await updateDoc(userDocRef, {
          credits: userData.credits - 1,
        });

        // Force la mise à jour des données utilisateur après la décrémentation
        dispatch(fetchUserData(user.uid));
      } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
        dispatch(
          addToast({
            id: Date.now(),
            message: error,
            class: "error",
          })
        );
      }
    } else {
      console.log("Vous n'avez plus de crédits.");
      openModal();
    }
    setMessage("");
  };

  return (
    <form onSubmit={(e) => sendMessage(e, message, user.uid, "recipientId")}>
      <div className="flex gap-2 items-center mt-4">
        <button className="btn btn-outline">
          <i className="fas fa-smile"></i>
        </button>
        <button className="btn btn-outline">
          <i className="fas fa-paperclip"></i>
        </button>
        <input
          type="text"
          placeholder="Écrire un message..."
          className="input input-bordered w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="btn btn-primary">Envoyer</button>
      </div>
      <ToastContainer />
      <NoCreditModal modalRef={modalRef} />
    </form>
  );
};

export default ChatInput;
