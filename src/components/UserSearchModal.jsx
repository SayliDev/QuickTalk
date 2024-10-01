const UserSearchModal = ({ searchModalRef }) => {
  const closeModal = () => {
    if (searchModalRef.current) {
      searchModalRef.current.close();
    }
  };

  return (
    <>
      {/* Popup pour ajouter un utilisateur */}
      <dialog ref={searchModalRef} className="modal">
        <div className="modal-box p-6 bg-base-200 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-center">
            Ajouter un Utilisateur
          </h3>
          {/* Champ de recherche */}
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            className="input input-bordered w-full mb-4"
          />
          {/* Liste d'utilisateurs */}
          <ul className="max-h-60 overflow-y-auto">
            <li className="flex items-center justify-between bg-base-100 shadow-md rounded-lg p-4 mb-2">
              <div className="flex items-center">
                {/* Photo de profil */}
                <div className="avatar mr-3">
                  <div className="w-10 rounded-full">
                    <img
                      src="https://randomuser.me/api/portraits/men/1.jpg"
                      alt="Photo de profil Obi-Wan"
                    />
                  </div>
                </div>
                <span className="font-semibold">Obi-Wan Kenobi</span>
              </div>
              {/* Bouton ajouter avec icône */}
              <button className="btn btn-outline btn-sm">
                <i className="fas fa-user-plus" /> Ajouter
              </button>
            </li>
            <li className="flex items-center justify-between bg-base-100 shadow-md rounded-lg p-4 mb-2">
              <div className="flex items-center">
                {/* Photo de profil */}
                <div className="avatar mr-3">
                  <div className="w-10 rounded-full">
                    <img
                      src="https://randomuser.me/api/portraits/men/2.jpg"
                      alt="Photo de profil Anakin"
                    />
                  </div>
                </div>
                <span className="font-semibold">Anakin Skywalker</span>
              </div>
              <button className="btn btn-outline btn-sm">
                <i className="fas fa-user-plus" /> Ajouter
              </button>
            </li>
            {/* Utilisateur déjà ajouté */}
            <li className="flex items-center justify-between bg-base-100 shadow-md rounded-lg p-4 mb-2">
              <div className="flex items-center">
                <div className="avatar mr-3">
                  <div className="w-10 rounded-full">
                    <img
                      src="https://randomuser.me/api/portraits/men/10.jpg"
                      alt="Photo de profil Obi-Wan"
                    />
                  </div>
                </div>
                <span className="font-semibold">Obi-Wan Kenobi</span>
              </div>
              <button
                className="btn btn-success btn-sm cursor-not-allowed"
                disabled
              >
                <i className="fas fa-check" /> Ajouté
              </button>
            </li>
            {/* Utilisateur en attente */}
            <li className="flex items-center justify-between bg-base-100 shadow-md rounded-lg p-4 mb-2">
              <div className="flex items-center">
                <div className="avatar mr-3">
                  <div className="w-10 rounded-full">
                    <img
                      src="https://randomuser.me/api/portraits/men/7.jpg"
                      alt="Photo de profil Anakin"
                    />
                  </div>
                </div>
                <span className="font-semibold">Anakin Skywalker</span>
              </div>
              <button
                className="btn btn-warning btn-sm cursor-not-allowed"
                disabled
              >
                <i className="fas fa-clock" /> En attente
              </button>
            </li>
          </ul>
          <div className="modal-action flex justify-between mt-6">
            <button
              className="btn btn-primary flex-1 mr-2"
              onClick={closeModal}
            >
              Fermer
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Fermer</button>
        </form>
      </dialog>
    </>
  );
};

export default UserSearchModal;
