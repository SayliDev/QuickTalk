import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setRecipient } from "../store/userSlice";

const ConversationItem = ({
  name,
  lastMessage,
  initial,
  online,
  index,
  photoURL,
  recipientId,
}) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setRecipient(recipientId));
    console.log("Recipient :", recipientId);
  };

  return (
    <motion.li
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.1 }}
      key={index}
      onClick={handleClick}
      className="bg-base-100 shadow-md rounded-lg p-4 flex items-center cursor-pointer hover:bg-base-200"
    >
      <div className={`avatar ${online ? "online" : ""} placeholder mr-3`}>
        <div className="bg-neutral text-neutral-content w-12 rounded-full">
          <img className="w-12" src={photoURL} alt={name || "Avatar"} />
        </div>
      </div>
      <div>
        <a href="#" className="font-semibold">{`${name}`}</a>
        <div className="text-sm text-gray-500">{lastMessage}</div>
      </div>
    </motion.li>
  );
};

export default ConversationItem;
