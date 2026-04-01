import { useNavigate } from "react-router-dom";

function BackButton({ label = "Back" }) {
  const navigate = useNavigate();

  return (
    <button
      className="back-btn"
      onClick={() => navigate(-1)}
      type="button"
    >
      ← {label}
    </button>
  );
}

export default BackButton;