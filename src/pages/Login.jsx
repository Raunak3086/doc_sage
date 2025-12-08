import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await loginUser(form);
      // Exact same behavior: navigate to /interact with userId
      navigate('/interact', { state: { userId: res.data.userId } });
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Morphin Grid Header */}
        <div className="login-header">
          <h1 className="login-title">⚡ RANGER COMMAND CONSOLE</h1>
          <p className="login-subtitle">
            Access the Morphin Grid. Authenticate your ranger identity.
          </p>
        </div>

        {/* Theme Selector */}
        <div className="theme-label">
          Select Ranger Frequency Channel
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

        {/* Command Interface */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Command Channel */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Ranger Comm Channel
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="ranger@grid.morphin"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Access Code */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Morphin Access Code
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Grid Status */}
          {msg && (
            <div className={`message-box ${msg.includes("failed") ? "error" : "success"}`}>
              <p className="message-text">{msg}</p>
            </div>
          )}

          {/* Activation Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn--login"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Syncing with Grid...
              </>
            ) : (
              "Initiate Ranger Sequence"
            )}
          </button>
        </form>

        {/* Grid Access Links */}
        <div className="login-footer">
          <Link to="/register" className="forgot-link">
            New Ranger? Initialize Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
