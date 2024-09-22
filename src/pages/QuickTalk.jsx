import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

const QuickTalk = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default QuickTalk;
