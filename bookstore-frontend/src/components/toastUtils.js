import toast from "react-hot-toast";

export const warnToast = (message) =>
  toast(message, {
    icon: "⚠️",
    style: {
      background: "#FEF3C7",
      color: "#92400E",
      border: "1px solid #FCD34D",
    },
  });

export const successToast = (message) => toast.success(message);

export const errorToast = (message) => toast.error(message);
