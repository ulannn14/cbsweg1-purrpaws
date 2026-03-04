import { useState } from "react";
import AppLayout from "../components/AppLayout";

function NotFound() {
  return (
    <div className="error-page">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/">Back to landing page.</Link>
    </div>
  );
}

export default NotFound;