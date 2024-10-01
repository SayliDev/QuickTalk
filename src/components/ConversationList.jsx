import { collection, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { firestore } from "../firebase/firebase";
import ConversationItem from "./ConversationItem";
import UserSearchModal from "./UserSearchModal";

const ConversationList = () => {
  const searchModalRef = useRef(null);

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
  return (
    <div className="flex-grow">
      <ul className="grid gap-4">
        {users.map((user, index) => (
          <ConversationItem
            key={index}
            index={index}
            name={user.displayName}
            recipientId={user.id}
            photoURL={user.photoURL}
            lastMessage={user.lastMessage}
            initial={user.initial}
            online={user.online || false}
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
