// client/src/pages/auth/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "candidate",
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
      const { data } = await api.post("/auth/register", form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Gabim gjatë regjistrimit"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h2>Krijo llogari</h2>
        <p className="auth-subtitle">
          Bashkohu me profesionistë, kompani dhe studentë në CareerLink.
        </p>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Emri & Mbiemri
            <input
              type="text"
              name="fullName"
              placeholder="Emri i plotë"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </label>

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

          <label>
            Roli
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="candidate">Kandidat</option>
              <option value="employer">Kompani / Rekrutues</option>
            </select>
          </label>

          <button className="btn btn-primary full" disabled={loading}>
            {loading ? "Duke u regjistruar..." : "Regjistrohu"}
          </button>
        </form>

        <p className="auth-footer">
          Ke tashmë llogari? <Link to="/login">Hyr</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
