import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSelector } from "react-redux";
import { auth, firestore } from "../firebase/firebase";
import { AnimatePresence, motion } from "framer-motion";

const NotificationCenter = ({ NotificationModalRef }) => {
  const { currentUser: userData } = useSelector((state) => state.user);
  const [pendingRequestsProfiles, setPendingRequestsProfiles] = useState([]);
  const [user] = useAuthState(auth);

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
    // console.log("Pending requests :", userData?.pendingRequests);
  }, [userData]);

  /* ---------------- Fonction pour accepter une demande d'ami ---------------- */

  const handleAcceptRequest = async (recipientId) => {
    console.log("Accepter la demande d'ami :", recipientId);

    try {
      const userDocRef = doc(firestore, "users", user.uid);
      const recipientDocRef = doc(firestore, "users", recipientId);

      // Mise à jour de friends et pendingRequests
      await Promise.all([
        updateDoc(userDocRef, {
          friends: arrayUnion(recipientId),
          pendingRequests: arrayRemove(recipientId),
        }),
        updateDoc(recipientDocRef, {
          friends: arrayUnion(user.uid),
        }),
      ]);

      // Mise à jour locale de pendingRequestsProfiles
      setPendingRequestsProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile.uid !== recipientId)
      );
    } catch (error) {
      console.error("Une erreur critique est survenue !", error);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                    Autre                                   */
  /* -------------------------------------------------------------------------- */

  const [showNoRequestsMessage, setShowNoRequestsMessage] = useState(false);

  useEffect(() => {
    // Ajouter un délai de 200ms avant de montrer "Aucune demande d'ami"
    if (pendingRequestsProfiles.length === 0) {
      const timeout = setTimeout(() => {
        setShowNoRequestsMessage(true);
      }, 200);
      return () => clearTimeout(timeout); // Nettoyage au cas où la condition change rapidement
    } else {
      setShowNoRequestsMessage(false);
    }
  }, [pendingRequestsProfiles]);

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
          <ul className="space-y-2 mt-4 overflow-x-hidden">
            {pendingRequestsProfiles.length > 0 ? (
              <AnimatePresence layout>
                {pendingRequestsProfiles?.map((profile, index) => (
                  <motion.li
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.2 }}
                    key={index}
                    className="flex items-center justify-between bg-base-100 shadow-md rounded-lg p-4"
                  >
                    <div className="flex items-center">
                      <div className="avatar mr-3">
                        <div className="w-10 rounded-full">
                          <img src={profile.photoURL} alt="Photo de profil" />
                        </div>
                      </div>
                      <span className="font-semibold">
                        {profile.displayName}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAcceptRequest(profile.uid)}
                      className="btn btn-outline btn-sm hover:btn-success"
                    >
                      Accepter
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            ) : (
              <AnimatePresence>
                {showNoRequestsMessage && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-gray-500 py-6"
                  >
                    Aucune demande d&apos;ami
                  </motion.p>
                )}
              </AnimatePresence>
            )}
          </ul>
        </div>
        <div className="modal-action m-0">
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
