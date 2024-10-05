import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { firestore } from "../firebase/firebase";
import ConversationItem from "./ConversationItem";
import UserSearchModal from "./UserSearchModal";
import { useSelector } from "react-redux";

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
    console.log(users);

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

  if (friendsProfiles) {
    console.log("friendsProfiles :", friendsProfiles);
  }

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
            lastMessage={profile.lastMessage}
            initial={profile.initial}
            online={profile.online || false}
          />
        ))}
        {/* {conversations.map((conv, index) => (
          <ConversationItem
            key={index}
            index={index}
            name={conv.name}
            lastMessage={conv.lastMessage}
            initial={conv.initial}
            online={conv.online || false}
          />
        ))} */}
      </ul>
      <button
        onClick={openSearchModal}
        className="btn btn-primary w-full mb-2 mt-5"
      >
        <i className="fas fa-plus"></i> Nouvelle Conversation
      </button>
      <UserSearchModal searchModalRef={searchModalRef} />
    </div>
  );
};

export default ConversationList;
