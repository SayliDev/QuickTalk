import { motion } from "framer-motion";

const ChatMessage = ({
  sender,
  time,
  text,
  position,
  avatar,
  delivered,
  image,
  color,
}) => {
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
      <div className={`chat-bubble bg-${color} text-white`}>
        {text}
        {image && <img src={image} alt="Media" className="mt-2 rounded-md" />}
      </div>
      <div className="chat-footer opacity-50">
        {delivered ? "Delivered" : ""}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
