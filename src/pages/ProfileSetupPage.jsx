import { useState } from "react";
import ProfileUpload from "../components/ProfileSetup/ProfileUpload";
import { motion, AnimatePresence } from "framer-motion";

const ProfileSetupPage = () => {
  const [loading, setLoading] = useState(false);

  return (
    <section className="p-10 bg-base-100 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-base-200 p-8 rounded-lg shadow-lg max-w-md w-full  relative"
      >
        <AnimatePresence>
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
        </AnimatePresence>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Bienvenue à Bord !
        </h2>
        <p className="mb-6 text-center">
          Pour compléter votre profil, ajoutez une photo ou choisissez de le
          faire plus tard.
        </p>
        <ProfileUpload setLoading={setLoading} />
      </motion.div>
    </section>
  );
};

export default ProfileSetupPage;
