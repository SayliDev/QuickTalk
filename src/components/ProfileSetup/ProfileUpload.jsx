import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ToastContainer from "../Toast/ToastContainer";
import useProfilePicture from "../../hooks/useProfilePicture";

const ProfileUpload = ({ setLoading }) => {
  /* -------------------------------------------------------------------------- */
  /*                                 Déclaration                                */
  /* -------------------------------------------------------------------------- */
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const { saveProfilePicture, error } = useProfilePicture();

  /* -------------------------------------------------------------------------- */
  /*                                  Fonction                                  */
  /* -------------------------------------------------------------------------- */

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    console.log("Fichier sélectionné :", selectedFile);

    setUploadedFile(URL.createObjectURL(selectedFile));
    setFile(selectedFile); // Stocker le fichier sélectionné
  };

  const handleSubmit = () => {
    saveProfilePicture(file, setLoading, "/quicktalk");
  };

  /* -------------------------------------------------------------------------- */
  /*                                    Rendu                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.3 }}
          className="avatar w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 mb-6"
        >
          <img
            src={
              uploadedFile ||
              "https://media.lordicon.com/icons/wired/flat/277-male-female.gif"
            }
            alt="Profile Placeholder"
            className="object-cover w-full h-full"
          />
        </motion.div>
        <div className="text-center">
          <label className="block mb-2">Téléversez une photo de profil :</label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full max-w-xs mx-auto"
            onChange={(e) => handleUpload(e)}
          />
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={() => navigate("/profile")} className="btn btn-ghost">
          Ignorer
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Sauvegarder
        </button>
      </div>
      <ToastContainer />
    </>
  );
};

export default ProfileUpload;
