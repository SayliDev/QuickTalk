import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, firestore } from "../../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchUserData } from "../../store/userSlice";
import { doc, updateDoc } from "firebase/firestore";
import useProfilePicture from "../../hooks/useProfilePicture";

const AccountSection = ({ settingsModalRef, loading, setLoading }) => {
  const [user] = useAuthState(auth);
  const { currentUser: userData } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [file, setFile] = useState(null);

  const { saveProfilePicture, error } = useProfilePicture();

  const updateUserData = async () => {
    // ref vers le nom
    const userDocRef = doc(db, "users", user?.uid);

    await updateDoc(userDocRef, {
      displayName: name,
    });
  };

  const handleSave = () => {
    if (name !== "") {
      updateUserData();
    }

    if (file) {
      // save profile picture
      saveProfilePicture(file, setLoading);
    }
    dispatch(fetchUserData(user?.uid));

    // ferme la modale
    if (!loading && settingsModalRef.current) {
      setTimeout(() => {
        settingsModalRef.current.close();
      }, 800);
    }
  };

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    console.log("Fichier sélectionné :", selectedFile);

    setUploadedFile(URL.createObjectURL(selectedFile));
    setFile(selectedFile);
  };

  return (
    <>
      {/* Section Compte (édition) */}
      <div className="mb-6">
        <h3 className="text-md font-semibold">Compte</h3>
        <div className="flex items-center mt-3">
          <div className="avatar mr-4">
            <div className="w-16 rounded-full">
              <img
                src={uploadedFile || userData?.photoURL}
                alt="Photo de profil utilisateur"
                id="profile_picture"
              />
            </div>
          </div>
          <div>
            {/* Champ pour modifier la photo de profil */}
            <label
              htmlFor="profile_pic_input"
              className="btn btn-sm btn-outline"
            >
              Changer la photo
            </label>
            <input
              type="file"
              accept="image/*"
              id="profile_pic_input"
              className="hidden"
              onChange={(e) => handleUpload(e)}
            />
          </div>
        </div>
        <div className="mt-4">
          {/* Champ pour modifier le nom d'utilisateur */}
          <label htmlFor="user_name" className="block text-sm font-semibold">
            Nom d&apos;utilisateur
          </label>
          <input
            type="text"
            id="user_name"
            className="input input-bordered w-full mt-1"
            defaultValue={userData?.displayName}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button className="btn btn-sm btn-outline mt-4">
          Changer le mot de passe
        </button>
      </div>
      <button className="btn btn-sm btn-outline mt-4" onClick={handleSave}>
        Enregistrer les modifications
      </button>
    </>
  );
};

export default AccountSection;
