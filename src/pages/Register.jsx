import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(
    localStorage.getItem("selectedTheme") || "red"
  );
  const navigate = useNavigate();

  useEffect(() => {
    document.body.setAttribute("data-theme", selectedTheme);
  }, [selectedTheme]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("selectedTheme", theme);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    try {
      const res = await registerUser(form);
      // same behavior: show ID coming from backend
      setMsg(`Success! Your ID: ${res.data.userId}`);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <div className="register-title">⚡ JOIN THE RANGER GRID</div>
          <div className="register-subtitle">
            Initialize your Ranger profile and sync with the AI Grid.
          </div>
        </div>

        <div className="theme-label">
          Select your Ranger color channel
        </div>

        <div className="theme-selector">
          <button
            type="button"
            className={`theme-btn theme-btn-red ${
              selectedTheme === "red" ? "active" : ""
            }`}
            onClick={() => handleThemeSelect("red")}
          >
            RED
          </button>
          <button
            type="button"
            className={`theme-btn theme-btn-blue ${
              selectedTheme === "blue" ? "active" : ""
            }`}
            onClick={() => handleThemeSelect("blue")}
          >
            BLUE
          </button>
          <button
            type="button"
            className={`theme-btn theme-btn-yellow ${
              selectedTheme === "yellow" ? "active" : ""
            }`}
            onClick={() => handleThemeSelect("yellow")}
          >
            YELLOW
          </button>
          <button
            type="button"
            className={`theme-btn theme-btn-pink ${
              selectedTheme === "pink" ? "active" : ""
            }`}
            onClick={() => handleThemeSelect("pink")}
          >
            PINK
          </button>
          <button
            type="button"
            className={`theme-btn theme-btn-black ${
              selectedTheme === "black" ? "active" : ""
            }`}
            onClick={() => handleThemeSelect("black")}
          >
            BLACK
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {msg && (
            <div
              className={`message ${
                msg.toLowerCase().includes("error")
                  ? "message--error"
                  : "message--success"
              }`}
            >
              {msg}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Ranger Codename</label>
            <input
              name="name"
              className="form-input"
              placeholder="Omega Falcon"
              onChange={handleChange}
              value={form.name}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Command Channel (Email)</label>
            <input
              name="email"
              type="email"
              className="form-input"
              placeholder="ranger@grid.com"
              onChange={handleChange}
              value={form.email}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Access Key</label>
            <input
              name="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              onChange={handleChange}
              value={form.password}
              required
            />
          </div>

          <button className="submit-btn" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner" /> Linking to Morphin Grid...
              </>
            ) : (
              "Register as Ranger"
            )}
          </button>
        </form>

        <div className="auth-link">
          Already synced? <Link to="/login">Return to Login Console</Link>
        </div>
      </div>
    </div>
  );
}
