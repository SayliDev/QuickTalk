import ConversationList from "./ConversationList";
import ProfileSection from "./ProfileSection";

const Sidebar = () => {
  return (
    <aside className="w-1/4 bg-base-200 shadow-lg rounded-lg flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Conversations</h2>
      <ConversationList />
      <ProfileSection />
    </aside>
  );
};

export default Sidebar;
