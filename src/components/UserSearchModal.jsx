import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, fetchUserData, sendRequest } from "../store/userSlice";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";

const UserSearchModal = ({ searchModalRef }) => {
  const { allUsers: users } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);
  const userUid = user?.uid;

  const { currentUser: userData, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserData(user.uid));
    }
  }, [user, dispatch]);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const closeModal = () => {
    if (searchModalRef.current) {
      searchModalRef.current.close();
    }
  };

  /**
   * Envoie une requête d'ami à un utilisateur
   * @param {string} recipientId L'identifiant unique de l'utilisateur destinataire
   */
  const handleSendRequest = (recipientId) => {
    dispatch(sendRequest({ userId: recipientId, recipientId: user.uid }));
  };

  /* ------------------------------------ x ----------------------------------- */

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
          {users && user && users.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto">
              {users
                .filter((currentUser) => currentUser.id !== user.uid)
                .map((user, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-base-100 shadow-md rounded-lg p-4 mb-2"
                  >
                    <div className="flex items-center">
                      {/* Photo de profil */}
                      <div className="avatar mr-3">
                        <div className="w-10 rounded-full">
                          <img
                            src={user.photoURL}
                            alt={`Photo de profil de ${user.displayName}`}
                          />
                        </div>
                      </div>
                      <span className="font-semibold">{user.displayName}</span>
                    </div>
                    {/* Bouton ajouter avec icône */}
                    <button
                      onClick={() => handleSendRequest(user.id)}
                      className={`btn btn-outline btn-sm ${
                        user.pendingRequests.includes(userUid)
                          ? "btn-warning btn-sm cursor-not-allowed"
                          : ""
                      }`}
                      disabled={
                        user.pendingRequests.includes(userUid) ||
                        userData?.friends.includes(user.id)
                      }
                    >
                      <i
                        className={`fas  ${
                          user.pendingRequests.includes(userUid)
                            ? "fa-clock"
                            : userData?.friends.includes(user.id)
                            ? "fa-check"
                            : "fa-user-plus"
                        }`}
                      />
                      {user.pendingRequests.includes(userUid)
                        ? "En attente"
                        : userData?.friends.includes(user.id)
                        ? "Amis"
                        : "Ajouter"}
                    </button>
                  </li>
                ))}
            </ul>
          ) : (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-base-100 rounded-lg z-10"
            >
              <span className="loading loading-bars loading-md text-primary"></span>
            </motion.div>
          )}
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
