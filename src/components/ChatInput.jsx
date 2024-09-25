import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { form } from "framer-motion/client";
import ToastContainer from "./Toast/ToastContainer";
import { addToast } from "../store/toastSlice";

const ChatInput = () => {
  const [message, setMessage] = useState("");

  const [user] = useAuthState(auth);
  const recipientId = useSelector((state) => state.user.recipientId); // Récupération du recipientId
  const dispatch = useDispatch();

  const sendMessage = async (e, text, senderId) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "messages"), {
        senderId,
        recipientId,
        text,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      dispatch(
        addToast({
          id: Date.now(),
          message: error,
          class: "error",
        })
      );
    } finally {
      setMessage("");
    }
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
    </form>
  );
};

export default ChatInput;
