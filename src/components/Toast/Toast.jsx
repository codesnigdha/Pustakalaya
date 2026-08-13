import { CheckCircle, Info, TriangleAlert, X, XCircle } from "lucide-react";

import "./Toast.css";

function Toast({ message, type = "success", onClose }) {
  if (!message) return null;

  const icons = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    warning: <TriangleAlert size={18} />,
    info: <Info size={18} />,
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">{icons[type] || icons.info}</div>

      <span>{message}</span>

      {onClose && (
        <button
          className="toast-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

export default Toast;
