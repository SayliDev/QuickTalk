const ConversationItem = ({ name, lastMessage, initial, online }) => {
  return (
    <li className="bg-base-100 shadow-md rounded-lg p-4 flex items-center hover:bg-base-200 cursor-pointer transition hover:border border-primary">
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
    </li>
  );
};

export default ConversationItem;
