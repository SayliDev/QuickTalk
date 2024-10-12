import { useRef, useState } from "react";
import AccountSection from "./SettingsModal/AccountSection";
import { AnimatePresence, motion } from "framer-motion";

const SettingsModal = ({ settingsModalRef }) => {
  const [loading, setLoading] = useState(false);

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

  const accountSectionRef = useRef(); // Référence pour le composant AccountSection
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
        <AnimatePresence>
          <h2 className="text-lg font-bold mb-4">Paramètres</h2>
          <AccountSection
            ref={accountSectionRef}
            settingsModalRef={settingsModalRef}
            loading={loading}
            setLoading={setLoading}
          />

          {/* Section Notifications */}
          <div className="mb-6">
            <h3 className="text-md font-semibold">Notifications</h3>
            <div className="flex items-center justify-between mt-3">
              <span>Messages</span>
              <input type="checkbox" className="toggle toggle-primary" />
            </div>
            <div className="flex items-center justify-between mt-3">
              <span>Demandes d&apos;ami</span>
              <input type="checkbox" className="toggle toggle-primary" />
            </div>
          </div>
          {/* Section Apparence */}
          <div>
            <h3 className="text-md font-semibold">Apparence</h3>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <button className="btn btn-sm bg-neutral-focus text-neutral-content">
                Thème sombre
              </button>
              <button className="btn btn-sm bg-accent-focus text-neutral-content">
                Thème clair
              </button>
              <button className="btn btn-sm bg-secondary-focus text-neutral-content">
                Thème pastel
              </button>
              <button className="btn btn-sm bg-primary-focus text-neutral-content">
                Thème bleu
              </button>
              <button className="btn btn-sm bg-success-focus text-neutral-content">
                Thème vert
              </button>
              <button className="btn btn-sm bg-error-focus text-neutral-content">
                Thème rouge
              </button>
            </div>
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
