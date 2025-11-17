// client/src/pages/employer/JobForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function JobForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    companyName: "",
    location: "",
    city: "",
    type: "Full-time",
    mode: "On-site",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "€",
    description: "",
    requirements: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.companyName) {
      setError("Titulli dhe kompania janë të detyrueshme.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : 0,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : 0,
      };
      const { data } = await api.post("/jobs", payload);
      navigate(`/jobs/${data._id}`);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || "Nuk u krijua puna. Provo sërish.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page job-form-page">
      <div className="page-header">
        <h1>Posto një punë të re</h1>
        <p>Përshkruaj pozicionin që po kërkon për ekipin tënd.</p>
      </div>

      <section className="card">
        {error && (
          <p style={{ color: "red", marginBottom: "0.5rem" }}>{error}</p>
        )}

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="form-full">
            Titulli i punës *
            <input
              type="text"
              name="title"
              placeholder="p.sh. Full Stack Developer"
              value={form.title}
              onChange={handleChange}
            />
          </label>

          <label className="form-full">
            Kompania *
            <input
              type="text"
              name="companyName"
              placeholder="Emri i kompanisë"
              value={form.companyName}
              onChange={handleChange}
            />
          </label>

          <label>
            Qyteti
            <input
              type="text"
              name="city"
              placeholder="Tiranë"
              value={form.city}
              onChange={handleChange}
            />
          </label>

          <label>
            Vendndodhja (tekst i plotë)
            <input
              type="text"
              name="location"
              placeholder="Tiranë, Shqipëri"
              value={form.location}
              onChange={handleChange}
            />
          </label>

          <label>
            Lloji i punës
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Other">Tjetër</option>
            </select>
          </label>

          <label>
            Mënyra
            <select name="mode" value={form.mode} onChange={handleChange}>
              <option value="On-site">Në zyrë</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hibrid</option>
            </select>
          </label>

          <label>
            Paga min.
            <input
              type="number"
              name="salaryMin"
              placeholder="p.sh. 800"
              value={form.salaryMin}
              onChange={handleChange}
              min="0"
            />
          </label>

          <label>
            Paga max.
            <input
              type="number"
              name="salaryMax"
              placeholder="p.sh. 1500"
              value={form.salaryMax}
              onChange={handleChange}
              min="0"
            />
          </label>

          <label>
            Monedha
            <input
              type="text"
              name="salaryCurrency"
              placeholder="€"
              value={form.salaryCurrency}
              onChange={handleChange}
            />
          </label>

          <label className="form-full">
            Përshkrimi
            <textarea
              name="description"
              placeholder="Përshkruaj përgjegjësitë kryesore..."
              value={form.description}
              onChange={handleChange}
            />
          </label>

          <label className="form-full">
            Kërkesat (një rresht për kërkesë)
            <textarea
              name="requirements"
              placeholder={"p.sh.\n- 2+ vite eksperiencë\n- Njohuri të React"}
              value={form.requirements}
              onChange={handleChange}
            />
          </label>

          <button className="btn-primary" disabled={saving}>
            {saving ? "Duke publikuar..." : "Publiko punën"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default JobForm;
