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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.email || !form.password) {
      setError("Plotëso emrin, email-in dhe fjalëkalimin");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/register", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      // Ruaj token + user në localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Pas regjistrimit → dërgo direkt te profili
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Gabim gjatë regjistrimit. Provo përsëri."
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

        {error && (
          <p style={{ color: "red", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
            {error}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Emri & Mbiemri
            <input
              type="text"
              name="fullName"
              placeholder="Emri yt i plotë"
              value={form.fullName}
              onChange={handleChange}
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

          <label>
            Roli
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="candidate">Kandidat</option>
              <option value="employer">Kompani / Rekrutues</option>
            </select>
          </label>

          <button
            type="submit"
            className="btn btn-primary full"
            disabled={loading}
          >
            {loading ? "Duke krijuar llogarinë..." : "Regjistrohu"}
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
