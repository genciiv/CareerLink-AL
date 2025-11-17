// client/src/pages/Jobs.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/jobs.css";

function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("sq-AL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtra
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState(""); // Full-time, Part-time, Internship...
  const [mode, setMode] = useState(""); // On-site, Remote, Hybrid...

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/jobs");
        setJobs(data || []);
      } catch (err) {
        console.error(err);
        setError("Nuk u ngarkuan punët. Provo të rifreskosh faqen.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const cities = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => {
      if (j.city) set.add(j.city);
    });
    return Array.from(set);
  }, [jobs]);

  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) => {
        const text = `${job.title || ""} ${job.companyName || ""} ${
          job.city || ""
        }`.toLowerCase();

        if (search && !text.includes(search.toLowerCase())) return false;
        if (city && job.city !== city) return false;
        if (type && job.type !== type) return false;
        if (mode && job.mode !== mode) return false;
        return true;
      }),
    [jobs, search, city, type, mode]
  );

  const handleOpenJob = (id) => {
    navigate(`/jobs/${id}`);
  };

  return (
    <div className="page jobs-page">
      {/* TITULLI SIPËR */}
      <header className="page-header">
        <h2>Punë të hapura</h2>
        <p>
          Gjej mundësi pune nga kompani në të gjithë Shqipërinë. Filtroni sipas
          qytetit, mënyrës së punës dhe tipit të pozicionit.
        </p>
      </header>

      {/* BARA E KËRKIMIT – si bar filtrimi profesional */}
      <section className="jobs-search-bar card">
        <div className="jobs-search-inline">
          {/* Keyword */}
          <div className="jobs-search-field jobs-search-keyword">
            <span className="jobs-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Kërko sipas rolit ose kompanisë"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Qyteti */}
          <div className="jobs-search-field">
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Të gjithë qytetet</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Lloji i punës */}
          <div className="jobs-search-field">
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Të gjitha llojet</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Kontratë</option>
            </select>
          </div>

          {/* Mënyra */}
          <div className="jobs-search-field">
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="">Të gjitha mënyrat</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </section>

      {/* LISTA E PUNËVE – 4 kolona */}
      <section className="jobs-results">
        <div className="jobs-results-header">
          <span>
            {filteredJobs.length} pozicione{" "}
            {search || city || type || mode ? "të filtruar" : "të disponueshme"}
          </span>
        </div>

        {loading ? (
          <p>Duke ngarkuar punët...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : filteredJobs.length === 0 ? (
          <p>Nuk u gjet asnjë punë me këto filtra.</p>
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map((job) => {
              const salaryText =
                job.salaryMin || job.salaryMax
                  ? `${job.salaryMin || "—"}${
                      job.salaryCurrency || "€"
                    } - ${job.salaryMax || "—"}${
                      job.salaryCurrency || "€"
                    } / muaj`
                  : "Pagë konkuruese";

              return (
                <article
                  key={job._id}
                  className="job-card"
                  onClick={() => handleOpenJob(job._id)}
                >
                  <div className="job-card-top">
                    <h3>{job.title}</h3>
                    <span className="job-badge-type">
                      {job.type || "Punë"}
                    </span>
                  </div>

                  <div className="job-company-line">
                    <span className="job-company-name">
                      {job.companyName || "Kompani"}
                    </span>
                    <span className="dot-separator">•</span>
                    <span className="job-city">
                      {job.city || job.location || "Vendndodhje"}
                    </span>
                  </div>

                  <div className="job-tags-row">
                    <span className="job-tag">{job.mode || "On-site"}</span>
                    <span className="job-tag salary">{salaryText}</span>
                  </div>

                  <p className="job-desc-preview">
                    {job.description
                      ? job.description.slice(0, 110) + "..."
                      : "Përshkrimi i detajuar i rolit do të shfaqet në faqen e punës."}
                  </p>

                  <div className="job-footer-row">
                    <span className="job-footer-meta">
                      Publikuar: {formatDate(job.createdAt)}
                    </span>
                    <span className="job-footer-meta">
                      Afati: {formatDate(job.expiresAt)}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Jobs;
