const ChatMessage = ({
  sender,
  time,
  text,
  position,
  avatar,
  delivered,
  image,
}) => {
  return (
    <div className={`chat chat-${position}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt={`${sender} Avatar`} src={avatar} />
        </div>
      </div>
      <div className="chat-header">
        {sender}
        <time className="text-xs opacity-50"> {time}</time>
      </div>
      <div className="chat-bubble bg-primary text-white">
        {text}
        {image && <img src={image} alt="Media" className="mt-2 rounded-md" />}
      </div>
      <div className="chat-footer opacity-50">
        {delivered ? "Delivered" : ""}
      </div>
    </div>
  );
};

export default ChatMessage;
