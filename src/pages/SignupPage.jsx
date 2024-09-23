import { createUserWithEmailAndPassword } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import ToastContainer from "../components/Toast/ToastContainer";
import { addToast } from "../store/toastSlice";
import { useDispatch } from "react-redux";

const SignupPage = () => {
  /* -------------------------------------------------------------------------- */
  /*                                 Déclaration                                */
  /* -------------------------------------------------------------------------- */
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "Zack",
    email: "zack@example.com",
    password: "password123",
    confirmPassword: "password123",
    phone: "123-456-7890",
  });
  const [error, setError] = useState(null);

  const [acceptTerms, setAcceptTerms] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                                  Fonction                                  */
  /* -------------------------------------------------------------------------- */
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    setLoading(true);
    setError(null);

    try {
      // Créer l'utilisateur avec email et mot de passe
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Ajouter des informations utilisateur supplémentaires dans Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        displayName: formData.name,
        email: formData.email,
        photoURL:
          "https://www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg",
        phoneNumber: formData.phone,
        credits: 100,
      });

      console.log("Utilisateur créé et enregistré dans Firestore :", user);

      navigate("/profilesetup");
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setError(error.message);
      dispatch(
        addToast({
          id: Date.now(),
          message: error,
          class: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                    Rendu                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <section className="p-10 bg-base-100 min-h-screen flex items-center justify-center">
      <motion.div
        className="bg-base-200 p-8 rounded-lg shadow-lg max-w-md w-full relative"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        layout
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
        <h2 className="text-2xl font-bold text-center mb-6">Créer un Compte</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Nom Complet
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="input input-bordered w-full"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required=""
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Adresse Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input input-bordered w-full"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              required=""
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Mot de Passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input input-bordered w-full"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required=""
            />
          </div>
          <div className="mb-6 pb-5">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium mb-2"
            >
              Confirmer le Mot de Passe
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              className={`input input-bordered relative w-full  ${
                formData.confirmPassword !== formData.password
                  ? `input-error`
                  : `input`
              }`}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required=""
            />
            {formData.confirmPassword !== formData.password && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="label absolute "
              >
                <span className="label-text-alt" style={{ color: "red" }}>
                  Mot de passe non identique
                </span>
              </motion.div>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="phone" className="block text-sm font-medium  mb-2">
              Numéro de Téléphone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="input input-bordered w-full"
              placeholder="+123 456 7890"
              value={formData.phone}
              onChange={handleChange}
              required=""
            />
          </div>
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="accept-terms"
              name="accept-terms"
              value={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
              className="checkbox checkbox-primary mr-2"
              required=""
            />
            <label htmlFor="accept-terms" className="text-sm">
              J&#39;accepte les{" "}
              <a href="#" className="text-primary">
                termes et conditions
              </a>
              .
            </label>
          </div>
          <button
            type="submit"
            disabled={
              formData.confirmPassword !== formData.password ||
              acceptTerms === false
            }
            className="btn btn-primary w-full"
          >
            S&#39;inscrire
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Vous avez déjà un compte ?{" "}
          <a
            onClick={() => navigate("/login")}
            className="text-primary cursor-pointer hover:underline"
          >
            Connectez-vous
          </a>
        </p>
      </motion.div>
      <ToastContainer />
    </section>
  );
};

export default SignupPage;
