import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function FloatingPopup({
  title,
  redirectTo,
  duration = 10000,
  forUser = true
}) {
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isActive = true; // 👈 guard

    const fetchSnippet = async () => {
      try {
        setMessage(""); // clear para no flicker

        const res = await fetch(
          `${API}/api/snippet?forUser=${forUser}`
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        if (data && isActive) {
          setMessage(data.info);
          setVisible(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSnippet();

    const timer = setTimeout(() => {
      if (isActive) setVisible(false);
    }, duration);

    return () => {
      isActive = false; // 👈 prevents double updates
      clearTimeout(timer);
    };
  }, [forUser, location.pathname, duration]);

  const handleClose = (e) => {
    e.stopPropagation();
    setVisible(false);
  };

  const handleRedirect = () => {
    if (redirectTo) {
      navigate(redirectTo);
    }
  };

  if (!visible || !message) return null;

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