import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ToastContainer from "../components/Toast/ToastContainer";
import { motion } from "framer-motion";

const QuickTalk = () => {
  // const [user] = useAuthState(auth);

  // if (!user) {
  //   console.log("Utilisateur non-connecté !");
  // } else {
  //   console.log("Utilisateur connecté :", user);
  // }

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(5px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(5px)" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex h-screen"
    >
      <Sidebar />
      <ChatWindow />
      <ToastContainer />
    </motion.div>
  );
};

export default QuickTalk;
