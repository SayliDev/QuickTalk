import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth, firestore } from "../firebase/firebase";
import ConversationItem from "./ConversationItem";
import UserSearchModal from "./UserSearchModal";

const ConversationList = () => {
  const searchModalRef = useRef(null);
  const { currentUser: userData } = useSelector((state) => state.user);

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
        {friendsProfiles?.map((profile, index) => (
          <ConversationItem
            key={index}
            index={index}
            name={profile.displayName}
            recipientId={profile.uid}
            photoURL={profile.photoURL}
            lastMessage={"Aucun messages"}
            initial={profile.initial}
            online={profile.online || false}
          />
        ))}
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
