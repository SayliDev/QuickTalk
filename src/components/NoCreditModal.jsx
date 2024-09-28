const NoCreditModal = ({ modalRef }) => {
  const closeModal = (e) => {
    e.preventDefault();
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box text-center">
        <h3 className="text-2xl font-bold mb-4">Oups ! Plus de crédits !</h3>
        <img
          src="https://cdn-icons-png.flaticon.com/512/7543/7543887.png"
          alt="Éclair"
          className="w-24 mx-auto mb-4"
        />
        <p className="py-4">
          Vous n&apos;avez plus de crédits pour envoyer des messages. Rechargez
          votre compte pour continuer.
        </p>
        <div className="modal-action">
          <button className="btn btn-primary" onClick={closeModal}>
            Fermer
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={closeModal}>
        <button>Fermer</button>
      </form>
    </dialog>
  );
};

export default NoCreditModal;
