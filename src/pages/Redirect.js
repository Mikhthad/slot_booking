import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useEffect } from "react";

export default function Redirect() {
  const navigate = useNavigate();

  useEffect(() => {
    api.get("login-check/")
      .then((res) => {
        if (res.data.redirect === "page3") {
          navigate("/schedule");
        } else {
          navigate("/select-slots");
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  return <p>Redirecting...</p>;
}
