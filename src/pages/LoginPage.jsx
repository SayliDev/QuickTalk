import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ToastContainer from "../components/Toast/ToastContainer";
import { addToast } from "../store/toastSlice";
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      console.log("Utilisateur connecté :", user);
      navigate("/quicktalk");
    } catch (error) {
      const errorCode = error.code;
      let errorMessage;

      switch (errorCode) {
        case "auth/invalid-email":
          errorMessage = "Adresse e-mail invalide.";
          break;
        case "auth/user-not-found":
          errorMessage = "Aucun utilisateur trouvé avec cette adresse e-mail.";
          break;
        case "auth/wrong-password":
          errorMessage = "Mot de passe incorrect.";
          break;
        case "auth/user-disabled":
          errorMessage = "Votre compte a été désactivé.";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Trop de tentatives de connexion. Veuillez réessayer plus tard.";
          break;
        case "auth/operation-not-allowed":
          errorMessage =
            "La connexion avec e-mail et mot de passe n'est pas activée pour ce projet.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Problème de connexion au réseau. Veuillez réessayer plus tard.";
          break;

        default:
          errorMessage =
            "Une erreur inconnue s'est produite. Veuillez réessayer.";
      }

      dispatch(
        addToast({
          id: Date.now(),
          message: errorMessage,
          class: "error",
        })
      );

      console.error(errorCode, errorMessage);
    } finally {
      setFormData({
        email: "",
        password: "",
      });
      setLoading(false);
    }
  };

  return (
    <>
      {/* <button
        className="btn btn-outline btn-primary w-full"
        onClick={() => setLoading(!loading)}
      >
        LOADING
      </button> */}

      <section className="bg-base-100 min-h-screen flex items-center justify-center">
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
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-md p-8 space-y-6 bg-base-200 shadow-lg rounded-lg relative"
        >
          <h2 className="text-2xl font-bold text-center">Connexion</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Adresse e-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input input-bordered w-full mt-1"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input input-bordered w-full mt-1"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary mr-2"
                />
                <span className="text-sm">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
            <div>
              <button type="submit" className="btn btn-primary w-full">
                Se connecter
              </button>
            </div>
          </form>
          <p className="text-sm text-center">
            Pas encore de compte ?{" "}
            <a
              onClick={() => navigate("/signup")}
              className="text-primary cursor-pointer hover:underline"
            >
              S&#39;inscrire
            </a>
          </p>
        </motion.div>
        <ToastContainer />
      </section>
    </>
  );
};

export default LoginPage;
