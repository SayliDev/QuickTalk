const ChatInput = () => {
  return (
    <div className="flex gap-2 items-center mt-4">
      <button className="btn btn-outline">
        <i className="fas fa-smile"></i>
      </button>
      <button className="btn btn-outline">
        <i className="fas fa-paperclip"></i>
      </button>
      <input
        type="text"
        placeholder="Écrire un message..."
        className="input input-bordered w-full"
      />
      <button className="btn btn-primary">Envoyer</button>
    </div>
  );
};

export default ChatInput;
