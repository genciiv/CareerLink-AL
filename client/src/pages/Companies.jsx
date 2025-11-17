// client/src/pages/Companies.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/companies.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/companies", {
        params: {
          q: q || undefined,
          city: city || undefined,
          industry: industry || undefined,
        },
      });
      setCompanies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies();
  };

  const currentUserRaw = localStorage.getItem("user");
  const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
  const isEmployer =
    currentUser && (currentUser.role === "employer" || currentUser.role === "admin");

  return (
    <div className="page companies-page">
      <div className="page-header">
        <h1>Kompanitë</h1>
        <p>Zbulo kompani dhe shiko punët që ato ofrojnë.</p>
      </div>

      <section className="card">
        <form onSubmit={handleSearch} className="jobs-filters">
          <div className="filters-row">
            <input
              type="text"
              placeholder="Kërko sipas emrit të kompanisë"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <input
              type="text"
              placeholder="Qyteti"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="Industria (p.sh. IT, Edukim)"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
            <button className="btn-primary" type="submit">
              Kërko
            </button>
          </div>
        </form>

        {isEmployer && (
          <div style={{ marginTop: "1rem", textAlign: "right" }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate("/employer/company")}
            >
              Menaxho profilin e kompanisë
            </button>
          </div>
        )}
      </section>

      <section className="company-list">
        {loading && <p>Duke ngarkuar kompanitë...</p>}
        {!loading && companies.length === 0 && (
          <p>Nuk u gjet asnjë kompani me këto filtra.</p>
        )}

        {companies.map((c) => (
          <article
            key={c._id}
            className="card company-card"
            onClick={() => navigate(`/companies/${c._id}`)}
          >
            <div className="company-header">
              <div className="company-logo">
                {c.logoUrl ? (
                  <img
                    src={c.logoUrl}
                    alt={c.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "inherit",
                    }}
                  />
                ) : (
                  getInitials(c.name)
                )}
              </div>
              <div>
                <div className="company-name">{c.name}</div>
                {c.industry && (
                  <div className="company-industry">{c.industry}</div>
                )}
              </div>
            </div>
            {(c.city || c.country) && (
              <div className="company-location">
                {c.city && c.country ? `${c.city}, ${c.country}` : c.city || c.country}
              </div>
            )}
            <div className="company-meta-small" style={{ marginTop: "0.35rem" }}>
              {c.size && <>Madhësia: {c.size}</>}{" "}
              {c.isHiring ? "• Po punëson" : ""}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default Companies;
