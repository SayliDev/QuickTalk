import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../firebase/firebase";
import { addToast } from "../store/toastSlice";
import { fetchUserData } from "../store/userSlice";
import NotificationCenter from "./NotificationCenter";
import SettingsModal from "./SettingsModal";
import ToastContainer from "./Toast/ToastContainer";

const ProfileSection = () => {
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const NotificationModalRef = useRef(null);
  const settingsModalRef = useRef(null);
  const { currentUser: userData, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchUserData(user.uid));
    }
  }, [user, dispatch]);

  if (error) {
    dispatch(
      addToast({
        id: Date.now(),
        message: error,
        class: "error",
      })
    );
  }

  const openNotificationModal = () => {
    if (NotificationModalRef.current) {
      NotificationModalRef.current.showModal();
    }
  };

  const openSettingsModalRef = () => {
    if (settingsModalRef.current) {
      settingsModalRef.current.showModal();
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                  return (                                  */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="mt-4">
      <motion.div
        className="flex items-center mb-4 bg-base-100 p-4 rounded-lg shadow-md relative"
        style={{ minHeight: "80px" }}
      >
        <AnimatePresence>
          {userData ? (
            <>
              <motion.div
                key="user-info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="avatar mr-3"
              >
                <div className="w-12 rounded-full">
                  <img src={userData.photoURL} alt="User Profile" />
                </div>
              </motion.div>
              <div className="flex-grow">
                <div className="font-bold">{userData.displayName}</div>
                <div className="flex items-center text-sm">
                  <i className="fas fa-bolt text-yellow-500 mr-1"></i>
                  <span>{userData.credits} crédits</span>
                </div>
              </div>
              <button
                onClick={openNotificationModal}
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="badge badge-xs badge-primary indicator-item"></span>
                </div>
              </button>
            </>
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
        </AnimatePresence>
      </motion.div>
      <button onClick={openSettingsModalRef} className="btn btn-outline w-full">
        <i className="fas fa-cog"></i> Paramètres
      </button>
      <SettingsModal settingsModalRef={settingsModalRef} />
      <NotificationCenter NotificationModalRef={NotificationModalRef} />
      <ToastContainer />
    </div>
  );
};

export default ProfileSection;
