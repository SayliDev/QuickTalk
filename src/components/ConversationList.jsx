import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { firestore } from "../firebase/firebase";
import ConversationItem from "./ConversationItem";
import UserSearchModal from "./UserSearchModal";

const ConversationList = () => {
  const searchModalRef = useRef(null);
  const { currentUser: userData } = useSelector((state) => state.user);
  const [messages, setMessages] = useState(null);

  const fetchAllMessages = async () => {
    try {
      const messagesCollectionRef = collection(firestore, "messages");
      const messagesDocs = await getDocs(messagesCollectionRef);

      const messages = messagesDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Groupe les messages par conversationId et obtenir le dernier message
      const lastMessageMap = {};
      messages.forEach((message) => {
        const { conversationId } = message;
        if (
          !lastMessageMap[conversationId] ||
          message.timestamp > lastMessageMap[conversationId].timestamp
        ) {
          lastMessageMap[conversationId] = message; // Met à jour avec le message le plus récent
        }
      });

      setMessages(Object.values(lastMessageMap)); // Met à jour avec les derniers messages par conversation
    } catch (error) {
      console.error("Erreur lors de la récupération des messages", error);
    }
  };

  useEffect(() => {
    fetchAllMessages();
  }, []);

  /* ------------------------------------ x ----------------------------------- */

  const fetchAllUsers = async () => {
    const usersCollectionRef = collection(firestore, "users");
    const usersDocs = await getDocs(usersCollectionRef);
    const users = usersDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return users;
  };

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAllUsers().then((users) => setUsers(users));
  }, []);

  const openSearchModal = () => {
    if (searchModalRef.current) {
      searchModalRef.current.showModal();
    }
  };

  /* ------------------------------------ x ----------------------------------- */
  const [friendsProfiles, setFriendsProfiles] = useState([]);
  useEffect(() => {
    // Fonction pour récupérer les profils des utilisateurs à partir de leurs UID
    const fetchFriendsProfiles = async () => {
      if (!userData || !userData.friends.length) return;

      // Récupère les informations de chaque utilisateur en attente
      const profiles = await Promise.all(userData.friends.map(getUserProfile));

      setFriendsProfiles(profiles);
    };

    // Récupère le profil d'un utilisateur par UID
    const getUserProfile = async (uid) => {
      const userDoc = await getDoc(doc(firestore, "users", uid));
      return userDoc.exists() ? { uid, ...userDoc.data() } : null;
    };

    fetchFriendsProfiles();
    console.log("Pending requests :", userData?.pendingRequests);
  }, [userData]);

  return (
    <div className="flex-grow">
      <ul className="grid gap-4">
        {friendsProfiles?.map((profile, index) => {
          // Trouve le dernier message pour ce recipientId (ou profile.uid)
          const lastMessageObj = messages.find(
            (message) =>
              message.recipientId === profile.uid ||
              message.senderId === profile.uid
          );

          return (
            <ConversationItem
              key={index}
              index={index}
              name={profile.displayName}
              recipientId={profile.uid}
              photoURL={profile.photoURL}
              lastMessage={lastMessageObj?.text || "Aucun messages"}
              initial={profile.initial}
              online={profile.online || false}
            />
          );
        })}
      </ul>

      {users && userData && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={openSearchModal}
            className="btn btn-primary w-full mb-2 mt-5"
          >
            <i className="fas fa-plus"></i> Nouvelle Conversation
          </button>
        </motion.div>
      )}

      <UserSearchModal searchModalRef={searchModalRef} />
    </div>
  );
};

export default ConversationList;
