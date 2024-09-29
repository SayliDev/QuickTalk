import { motion } from "framer-motion";
import { style } from "framer-motion/client";
import { useDispatch } from "react-redux";
import { deleteFromMessage } from "../store/messageSlice";

const ChatMessage = ({
  sender,
  time,
  text,
  id,
  position,
  avatar,
  delivered,
  image,
  color,
}) => {
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteFromMessage({ messageId: id, imageUrl: image }));
    console.log("Message supprimé !", id);
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.2 }}
      className={`chat chat-${position}`}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt={`${sender} Avatar`} src={avatar} />
        </div>
      </div>
      <div className="chat-header">
        {sender}
        <time className="text-xs opacity-50"> {time}</time>
      </div>
      <div className="flex items-center flex-row-reverse group gap-3">
        <div
          className={`chat-bubble bg-${color} text-white`}
          style={delivered ? { marginLeft: -32 } : {}}
        >
          {text}
          {image && (
            <img
              src={image}
              alt="Media"
              className="mt-2 rounded-md max-w-56 cursor-pointer"
              onClick={() => window.open(image)}
            />
          )}
        </div>
        {/* Bouton Supprimer */}
        {!delivered && (
          <button
            onClick={() => handleDelete(id)}
            className="btn btn-outline btn-xs hidden group-hover:block"
          >
            <i className="fas fa-trash"></i>
          </button>
        )}
        <div className="w-10 rounded-full"></div>
      </div>

      <div className="chat-footer opacity-50">
        {delivered ? "Delivered" : ""}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
