import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ToastContainer from "../components/Toast/ToastContainer";

const QuickTalk = () => {
  const [user] = useAuthState(auth);

  if (!user) {
    console.log("Utilisateur non-connecté !");
  } else {
    console.log("Utilisateur connecté :", user);
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <ChatWindow />
      <ToastContainer />
    </div>
  );
};

export default QuickTalk;
