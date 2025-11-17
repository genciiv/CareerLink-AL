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

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Gabim gjatë hyrjes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h2>Hyr në CareerLink</h2>
        <p className="auth-subtitle">Mirë se u ktheve! Fut kredencialet e tua.</p>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
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
              required
            />
          </label>

          <button className="btn btn-primary full" disabled={loading}>
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
