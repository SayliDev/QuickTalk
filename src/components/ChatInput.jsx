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
import { auth, db, firestore, storage } from "../firebase/firebase";
import { addToast } from "../store/toastSlice";
import { fetchUserData } from "../store/userSlice";
import NoCreditModal from "./NoCreditModal";
import ToastContainer from "./Toast/ToastContainer";
import FileUploadModal from "./FileUploadModal";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { AnimatePresence, motion } from "framer-motion";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const fileUploadModalRef = useRef(null); // Ref pour la modal de téléchargement de fichiers
  const noCreditModalRef = useRef(null); // Ref pour la modal "Pas de crédits"
  const [fileSelected, setFileSelected] = useState(false); // État pour suivre si un fichier a été sélectionné
  const [user] = useAuthState(auth);
  const { currentUser: userData, error } = useSelector((state) => state.user);
  const recipientId = useSelector((state) => state.user.recipientId);
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserData(user.uid));
    }
  }, [user, dispatch]);

  const openFileUploadModal = (e) => {
    e.preventDefault(); // Empêche l'envoi du formulaire
    if (fileUploadModalRef.current) {
      fileUploadModalRef.current.showModal();
    }
  };

  const openNoCreditModal = (e) => {
    if (noCreditModalRef.current) {
      noCreditModalRef.current.showModal();
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "") {
      console.log("Le message ne peut pas être vide.");
      return; // Arrête l'exécution si le message est vide
    }
    if (userData?.credits > 0) {
      try {
        let fileURL = null;

        // Si un fichier est sélectionné, le télécharger sur Firebase Storage
        if (fileSelected) {
          const fileInput = document.getElementById("file-input");
          const file = fileInput.files[0];

          // Génère un ID unique pour le fichier
          const fileId = uuidv4();

          // Crée une référence de stockage pour le fichier avec l'ID unique
          const storageRef = ref(storage, `uploads/${fileId}_${file.name}`);

          // Télécharge le fichier
          await uploadBytes(storageRef, file);

          // Récupère l'URL du fichier
          fileURL = await getDownloadURL(storageRef);
        }
        await addDoc(collection(db, "messages"), {
          senderId: user.uid,
          recipientId,
          text: message,
          fileUrl: fileURL,
          timestamp: serverTimestamp(),
          conversationId:
            user.uid > recipientId
              ? `conversation_${user.uid}-${recipientId}`
              : `conversation_${recipientId}-${user.uid}`,
        });

        const userDocRef = doc(firestore, "users", user.uid);
        await updateDoc(userDocRef, {
          credits: userData.credits - 1,
        });

        dispatch(fetchUserData(user.uid));
      } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
        // TODO : Gestion de l'erreur utilisateur
      }
    } else {
      console.log("Vous n'avez plus de crédits.", userData?.credits);
      openNoCreditModal();
    }
    setMessage("");
    setFileSelected(false);
    setSelectedFile(null);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      onSubmit={sendMessage}
    >
      <div className="flex gap-2 items-center mt-4">
        <button type="button" className="btn btn-outline">
          <i className="fas fa-smile"></i>
        </button>
        <button
          type="button"
          className={
            fileSelected
              ? "btn bg-success border border-success text-white hover:bg-success hover:border-success"
              : "btn btn-outline"
          }
          onClick={openFileUploadModal}
        >
          <i
            className={
              fileSelected ? "fas fa-check text-white" : "fas fa-paperclip"
            }
          ></i>
        </button>
        <FileUploadModal
          ref={fileUploadModalRef}
          onFileSelect={setFileSelected}
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
        />
        {/* Modal de téléchargement de fichiers */}
        <NoCreditModal modalRef={noCreditModalRef} /> {/* Modal sans crédits */}
        <input
          type="text"
          placeholder="Écrire un message..."
          className="input input-bordered w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Envoyer
        </button>
      </div>
      <ToastContainer />
    </motion.form>
  );
};

export default ChatInput;
