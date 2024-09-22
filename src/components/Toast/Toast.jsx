// src/components/Toast.js
import { motion } from "framer-motion";
const Toast = ({ toast }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }} // Durée de l'animation
      className="toast toast-end z-50"
    >
      <div className={`alert alert-${toast.class}`}>
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg> */}
        <span>{toast.message}</span>
      </div>
    </motion.div>
  );
};

export default Toast;
