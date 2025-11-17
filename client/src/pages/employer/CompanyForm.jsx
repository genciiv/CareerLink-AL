// client/src/pages/employer/CompanyForm.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/companies.css";

function CompanyForm() {
  const [form, setForm] = useState({
    name: "",
    logoUrl: "",
    city: "",
    country: "",
    industry: "",
    size: "",
    website: "",
    description: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    isHiring: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const loadMyCompany = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/companies/me/profile");
      setForm({
        name: data.name || "",
        logoUrl: data.logoUrl || "",
        city: data.city || "",
        country: data.country || "",
        industry: data.industry || "",
        size: data.size || "",
        website: data.website || "",
        description: data.description || "",
        linkedin: data.linkedin || "",
        facebook: data.facebook || "",
        instagram: data.instagram || "",
        isHiring: data.isHiring ?? true,
      });
    } catch (err) {
      // nëse 404 -> s'ka kompani ende, është ok
      if (err?.response?.status === 404) {
        setStatus("Ende nuk ke krijuar profil kompanie. Fillojmë tani.");
      } else {
        console.error(err);
        setError("Nuk u ngarkua profili i kompanisë.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyCompany();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!form.name.trim()) {
      setError("Emri i kompanisë është i detyrueshëm.");
      return;
    }

    try {
      setSaving(true);
      const { data } = await api.post("/companies/me/profile", form);
      setForm((prev) => ({
        ...prev,
        name: data.name || prev.name,
      }));
      setStatus("Profili i kompanisë u ruajt me sukses.");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        "Nuk u ruajt profili i kompanisë. Provo sërish.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page company-form-page">
        <p>Duke ngarkuar të dhënat e kompanisë...</p>
      </div>
    );
  }

  return (
    <div className="page company-form-page">
      <div className="page-header">
        <h1>Profili i kompanisë</h1>
        <p>
          Plotëso informacionin e kompanisë tënde që kandidatët ta njohin më mirë.
        </p>
      </div>

      <section className="card">
        {error && (
          <p style={{ color: "red", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}
        {status && (
          <p
            style={{ color: "green", marginBottom: "0.5rem", fontSize: "0.9rem" }}
          >
            {status}
          </p>
        )}

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Emri i kompanisë *
            <input
              type="text"
              name="name"
              placeholder="p.sh. CareerLink AL"
              value={form.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Logo URL (opsionale)
            <input
              type="text"
              name="logoUrl"
              placeholder="https://..."
              value={form.logoUrl}
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
            Shteti
            <input
              type="text"
              name="country"
              placeholder="Shqipëri"
              value={form.country}
              onChange={handleChange}
            />
          </label>

          <label>
            Industria
            <input
              type="text"
              name="industry"
              placeholder="IT, Edukim, Marketing, etj."
              value={form.industry}
              onChange={handleChange}
            />
          </label>

          <label>
            Madhësia e kompanisë
            <input
              type="text"
              name="size"
              placeholder="p.sh. 11-50"
              value={form.size}
              onChange={handleChange}
            />
          </label>

          <label>
            Website
            <input
              type="text"
              name="website"
              placeholder="https://..."
              value={form.website}
              onChange={handleChange}
            />
          </label>

          <label className="form-full">
            Përshkrimi
            <textarea
              name="description"
              placeholder="Përshkruaj misionin, vizionin dhe aktivitetin e kompanisë..."
              value={form.description}
              onChange={handleChange}
            />
          </label>

          <label>
            LinkedIn
            <input
              type="text"
              name="linkedin"
              placeholder="https://linkedin.com/company/..."
              value={form.linkedin}
              onChange={handleChange}
            />
          </label>

          <label>
            Facebook
            <input
              type="text"
              name="facebook"
              placeholder="https://facebook.com/..."
              value={form.facebook}
              onChange={handleChange}
            />
          </label>

          <label>
            Instagram
            <input
              type="text"
              name="instagram"
              placeholder="https://instagram.com/..."
              value={form.instagram}
              onChange={handleChange}
            />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              name="isHiring"
              checked={form.isHiring}
              onChange={handleChange}
            />
            Aktualisht po punësojmë
          </label>

          <button className="btn-primary" disabled={saving}>
            {saving ? "Duke ruajtur..." : "Ruaj profilin e kompanisë"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default CompanyForm;
