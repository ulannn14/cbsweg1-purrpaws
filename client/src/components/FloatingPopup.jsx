import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FloatingPopup({
  title,
  message,
  redirectTo,
  duration = 5000,
}) {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = (e) => {
    e.stopPropagation();
    setVisible(false);
  };

  const handleRedirect = () => {
    navigate(redirectTo);
  };

  if (!visible) return null;

  return (
    <div className="floating-popup" onClick={handleRedirect}>
      <button
        className="floating-popup-close"
        onClick={handleClose}
        type="button"
        aria-label="Close popup"
      >
        ×
      </button>

      <h4 className="floating-popup-title">{title}</h4>
      <p className="floating-popup-message">{message}</p>
    </div>
  );
}

export default FloatingPopup;