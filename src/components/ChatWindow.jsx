import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const ChatWindow = () => {
  const messages = [
    {
      sender: "Obi-Wan Kenobi",
      time: "12:45",
      text: "You were the Chosen One!",
      position: "start",
      delivered: true,
      avatar:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    },
    {
      sender: "Anakin",
      time: "12:46",
      text: "I hate you!",
      position: "end",
      delivered: true,
      avatar:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    },
    {
      sender: "Obi-Wan Kenobi",
      time: "12:50",
      text: "Voici une image que j'ai trouvée !",
      position: "start",
      delivered: true,
      avatar:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <section className="bck-chat flex-1 p-6 flex flex-col justify-between bg-base-200">
      <div className="chat-container flex-1 mb-6 p-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} {...message} />
        ))}
      </div>
      <ChatInput />
    </section>
  );
};

export default ChatWindow;
