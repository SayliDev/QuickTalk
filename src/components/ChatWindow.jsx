import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { auth, db } from "../firebase/firebase";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [userProfiles, setUserProfiles] = useState({}); // Stocke les profils des utilisateurs
  const [user] = useAuthState(auth);
  const messagesEndRef = useRef(null); // Référence vers l'élément tout en bas
  const userId = user?.uid;
  const recipientId = useSelector((state) => state.user.recipientId); // Récupération du recipientId

  // Fonction pour récupérer les informations d'un utilisateur
  const getUserProfile = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? userDoc.data() : null;
  };

  useEffect(() => {
    if (!userId || !recipientId) return;

    const loadUserProfiles = async () => {
      // Récupère les informations de l'utilisateur actuel et du destinataire
      const [senderProfile, recipientProfile] = await Promise.all([
        getUserProfile(userId),
        getUserProfile(recipientId),
      ]);

      // Stocke ces informations dans l'état local
      setUserProfiles({
        [userId]: senderProfile,
        [recipientId]: recipientProfile,
      });
    };

    loadUserProfiles();

    const q = query(
      collection(db, "messages"),
      where("senderId", "in", [userId, recipientId]),
      where("recipientId", "in", [userId, recipientId]),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [userId, recipientId]);

  if (messages) {
    console.log("Messages :", messages);
  }

  // Effet pour scroller automatiquement à la fin des messages lorsqu'il y a un changement
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <section className="bck-chat flex-1 p-6 flex flex-col justify-between bg-base-200">
      <div className="chat-container flex-1 mb-6 p-4 overflow-y-scroll overflow-x-hidden">
        <AnimatePresence>
          {messages.map((message, index) => {
            // Récupère les avatars et noms des utilisateurs
            const senderProfile = userProfiles[message.senderId];
            const recipientProfile = userProfiles[message.recipientId];

            return (
              <ChatMessage
                key={index}
                text={message.text}
                avatar={senderProfile?.photoURL || recipientProfile?.photoURL}
                sender={
                  senderProfile?.displayName || recipientProfile?.displayName
                }
                time={message.timestamp
                  ?.toDate()
                  .toLocaleTimeString()
                  .slice(0, 5)}
                position={message.senderId === userId ? "end" : "start"}
                color={message.senderId === userId ? "secondary" : "primary"}
                delivered={message.senderId === userId ? false : true}
              />
            );
          })}
        </AnimatePresence>
        {/* Élément de référence pour scroller automatiquement */}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput />
    </section>
  );
};

export default ChatWindow;
