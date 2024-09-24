import { motion } from "framer-motion";
import { useRef } from "react";

const ConversationItem = ({ name, lastMessage, initial, online, index }) => {
  return (
    <motion.li
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.1 }}
      key={index}
      className="bg-base-100 shadow-md rounded-lg p-4 flex items-center "
    >
      <div className={`avatar ${online ? "online" : ""} placeholder mr-3`}>
        <div className="bg-neutral text-neutral-content w-12 rounded-full">
          <span className="text-xl">{initial}</span>
        </div>
      </div>
      <div>
        <a href="#" className="font-semibold">{`Chat avec ${name}`}</a>
        <div className="text-sm text-gray-500">
          Dernier message: {lastMessage}
        </div>
      </div>
    </motion.li>
  );
};

export default ConversationItem;
