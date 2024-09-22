// src/components/ToastContainer.js
import { useDispatch, useSelector } from "react-redux";
import Toast from "./Toast";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { removeToast } from "../../store/toastSlice";

const ToastContainer = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.toast.toasts);

  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, 3000); // 2 secondes

      // Cleanup timeout if the component unmounts before timeout
      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  return (
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </AnimatePresence>
  );
};

export default ToastContainer;
