import { useEffect, useRef, useState } from "react";
import AccountSection from "./SettingsModal/AccountSection";
import { AnimatePresence, motion } from "framer-motion";

const SettingsModal = ({ settingsModalRef }) => {
  const [loading, setLoading] = useState(false);
  const accountSectionRef = useRef(); // Référence pour le composant AccountSection
  const [isdark, setIsdark] = useState(
    JSON.parse(localStorage.getItem("isdark"))
  );

  const closeModal = () => {
    if (settingsModalRef.current) {
      settingsModalRef.current.close();
    }
  };

  // Fonction pour gérer l'enregistrement
  const handleSaveChanges = () => {
    // Appel de la fonction de sauvegarde dans le composant AccountSection
    if (accountSectionRef.current) {
      accountSectionRef.current.handleSave();
    }
  };

  useEffect(() => {
    localStorage.setItem("isdark", JSON.stringify(isdark));
  }, [isdark]);
  return (
    <dialog ref={settingsModalRef} id="settings_modal" className="modal">
      <div className="modal-box max-w-lg relative">
        {loading && (
          <motion.div
            className="bg-gray-700 bg-opacity-40 z-10 absolute inset-0 flex items-center justify-center rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="loading loading-spinner loading-lg"></span>
          </motion.div>
        )}
        <AnimatePresence key="title">
          <h2 key="title-settings" className="text-lg font-bold mb-4">
            Paramètres
          </h2>
          <AccountSection
            key="account-section"
            ref={accountSectionRef}
            settingsModalRef={settingsModalRef}
            loading={loading}
            setLoading={setLoading}
          />

          {/* Section Notifications */}
          <div key="notifications-section" className="mb-6">
            <h3 className="text-md font-semibold">Notifications</h3>
            <div className="flex items-center justify-between mt-3">
              <span>Messages</span>
              <input type="radio" className="toggle toggle-primary" />
            </div>
            <div className="flex items-center justify-between mt-3">
              <span>Demandes d&apos;ami</span>
              <input type="radio" className="toggle toggle-primary" />
            </div>
          </div>
          {/* Section Apparence */}
          <div key="apparence-section">
            <h3 className="text-md font-semibold">Apparence</h3>
            {/* <div className="grid grid-cols-3 gap-3 mt-4"> */}
            <div className="flex items-center justify-between mt-5">
              <span>Mode sombre</span>
              <input
                type="checkbox"
                onChange={() => setIsdark(!isdark)}
                checked={isdark}
                value="dark"
                className="toggle theme-controller"
              />
            </div>
            {/* </div> */}
          </div>
          <div className="modal-action mt-6">
            <button onClick={handleSaveChanges} className="btn btn-primary">
              Enregistrer les modifications
            </button>
            <button onClick={closeModal} className="btn">
              Fermer
            </button>
          </div>
        </AnimatePresence>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>Fermer</button>
      </form>
    </dialog>
  );
};

export default SettingsModal;
