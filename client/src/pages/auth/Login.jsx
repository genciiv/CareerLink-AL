// client/src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Shkruaj email dhe fjalëkalim");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      // Ruaj token + user në localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ⬇⬇⬇ KETU ISHTE REDIRECT TEK "/" – TANI E COJME TEK /profile
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Gabim gjatë autentikimit. Provo përsëri."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h2>Hyr në CareerLink</h2>
        <p className="auth-subtitle">
          Mirë se u ktheve! Fut kredencialet e tua për të vazhduar.
        </p>

        {error && (
          <p style={{ color: "red", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
            {error}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Fjalëkalimi
            <input
              type="password"
              name="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary full"
            disabled={loading}
          >
            {loading ? "Duke u futur..." : "Hyr"}
          </button>
        </form>

        <p className="auth-footer">
          Ende nuk ke llogari? <Link to="/register">Regjistrohu</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
