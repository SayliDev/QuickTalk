import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSelector } from "react-redux";
import { auth, db } from "../firebase/firebase";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

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

  // Effet pour scroller automatiquement à la fin des messages lorsqu'il y a un changement
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <section
      className={`flex-1 p-6 flex flex-col justify-between bg-base-300 ${
        recipientId ? "bck-chat" : ""
      }`}
    >
      <div className="chat-container flex-1 mb-6 p-4 overflow-y-scroll overflow-x-hidden relative">
        {recipientId ? (
          <AnimatePresence>
            {messages.map((message, index) => {
              // Récupère les avatars et noms des utilisateurs
              const senderProfile = userProfiles[message.senderId];
              const recipientProfile = userProfiles[message.recipientId];

              return (
                <ChatMessage
                  key={index}
                  text={message.text}
                  id={message.id}
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
                  image={message.fileUrl}
                />
              );
            })}
          </AnimatePresence>
        ) : (
          <p className="text-center text-gray-500 my-4 text-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            Sélectionnez un utilisateur pour commencer la conversation
          </p>
        )}
        {/* Élément de référence pour scroller automatiquement */}
        <div ref={messagesEndRef} />
      </div>
      {recipientId && <ChatInput />}
    </section>
  );
};

export default ChatWindow;
