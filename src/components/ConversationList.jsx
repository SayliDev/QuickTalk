import ConversationItem from "./ConversationItem";

const ConversationList = () => {
  const conversations = [
    { name: "Obi-Wan", lastMessage: "On doit agir.", initial: "O" },
    {
      name: "Anakin",
      lastMessage: "Je ne te laisserai pas faire.",
      initial: "A",
      online: true,
    },
    { name: "Padmé", lastMessage: "Je m'inquiète pour toi.", initial: "P" },
    { name: "Yoda", lastMessage: "Faire ou ne pas faire.", initial: "Y" },
  ];

  return (
    <div className="flex-grow">
      <ul className="grid gap-4">
        {conversations.map((conv, index) => (
          <ConversationItem
            key={index}
            index={index}
            name={conv.name}
            lastMessage={conv.lastMessage}
            initial={conv.initial}
            online={conv.online || false}
          />
        ))}
      </ul>
      <button className="btn btn-primary w-full mb-2 mt-5">
        <i className="fas fa-plus"></i> Nouvelle Conversation
      </button>
    </div>
  );
};

export default ConversationList;
