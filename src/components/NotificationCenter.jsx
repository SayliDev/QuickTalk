import { useEffect, useState } from "react";
import { firestore } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";

const NotificationCenter = ({ NotificationModalRef }) => {
  const { currentUser: userData } = useSelector((state) => state.user);
  const [pendingRequestsProfiles, setPendingRequestsProfiles] = useState([]);

  const closeModal = () => {
    if (NotificationModalRef.current) {
      NotificationModalRef.current.close();
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                  Function                                  */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    // Fonction pour récupérer les profils des utilisateurs à partir de leurs UID
    const fetchPendingRequestsProfiles = async () => {
      if (!userData || !userData.pendingRequests.length) return;

      // Récupère les informations de chaque utilisateur en attente
      const profiles = await Promise.all(
        userData.pendingRequests.map(getUserProfile)
      );

      setPendingRequestsProfiles(profiles);
    };

    // Récupère le profil d'un utilisateur par UID
    const getUserProfile = async (uid) => {
      const userDoc = await getDoc(doc(firestore, "users", uid));
      return userDoc.exists() ? { uid, ...userDoc.data() } : null;
    };

    fetchPendingRequestsProfiles();
    console.log("Pending requests :", userData?.pendingRequests);
  }, [userData]);

  console.log("Pending requests profiles :", pendingRequestsProfiles);

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <dialog
      id="notification_modal"
      ref={NotificationModalRef}
      className="modal "
    >
      <div className="modal-box bg-base-200">
        <h2 className="text-lg font-bold mb-4">Notifications</h2>
        <div className="mb-4">
          <h3 className="text-md font-semibold">Nouveaux messages</h3>
          <ul className="space-y-2">
            <p className="text-center text-gray-500 py-6  ">
              Aucun nouveau message
            </p>
          </ul>
        </div>
        <div>
          <h3 className="text-md font-semibold">Demandes d&apos;ami</h3>
          <ul className="space-y-2 mt-4">
            {pendingRequestsProfiles.length > 0 ? (
              <>
                {pendingRequestsProfiles.map((profile, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-base-100 shadow-md rounded-lg p-4"
                  >
                    <div className="flex items-center">
                      <div className="avatar mr-3">
                        <div className="w-10 rounded-full">
                          <img
                            src={profile.photoURL}
                            alt="Photo de profil Padmé"
                          />
                        </div>
                      </div>
                      <span className="font-semibold">
                        {profile.displayName}
                      </span>
                    </div>
                    <button className="btn btn-outline btn-sm hover:btn-success">
                      Accepter
                    </button>
                  </li>
                ))}
              </>
            ) : (
              <p className="text-center text-gray-500 py-6">
                Aucune demande d&apos;ami
              </p>
            )}
          </ul>
        </div>
        <div className="modal-action">
          <button className="btn btn-primary" onClick={closeModal}>
            Fermer
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>Fermer</button>
      </form>
    </dialog>
  );
};

export default NotificationCenter;
