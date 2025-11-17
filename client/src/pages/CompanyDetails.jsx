// client/src/pages/CompanyDetails.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/companies/${id}`);
        setCompany(data.company);
        setJobs(data.jobs || []);
      } catch (err) {
        console.error(err);
        setError("Nuk u gjet kjo kompani.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <p>Duke ngarkuar kompaninë...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="page">
        <p>{error || "Kompania nuk u gjet."}</p>
      </div>
    );
  }

  return (
    <div className="page company-details-page">
      <div className="page-header">
        <h1>Profili i kompanisë</h1>
        <p>Zbulo më shumë rreth kësaj kompanie dhe punëve që ofron.</p>
      </div>

      <section className="company-details-layout">
        <div className="company-details-main card">
          <div className="company-hero">
            <div className="company-hero-logo">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "inherit",
                  }}
                />
              ) : (
                getInitials(company.name)
              )}
            </div>
            <div className="company-hero-text">
              <h1>{company.name}</h1>
              {(company.city || company.country) && (
                <p>
                  {company.city && company.country
                    ? `${company.city}, ${company.country}`
                    : company.city || company.country}
                </p>
              )}
              <p>
                {company.industry && `${company.industry}`}
                {company.size && ` • Madhësia: ${company.size}`}
                {company.isHiring && " • Po punëson"}
              </p>
            </div>
          </div>

          {company.description && (
            <>
              <h2>Rreth kompanisë</h2>
              <p className="company-about">{company.description}</p>
            </>
          )}

          {jobs.length > 0 && (
            <>
              <h2 style={{ marginTop: "1.5rem" }}>Punë të hapura</h2>
              <div className="company-jobs-list">
                {jobs.map((job) => (
                  <article
                    key={job._id}
                    className="card job-card"
                    onClick={() => navigate(`/jobs/${job._id}`)}
                  >
                    <h3>{job.title}</h3>
                    <p className="job-meta">
                      {job.city || job.location || "Vendndodhje"} • {job.type} •{" "}
                      {job.mode}
                    </p>
                    {job.salaryMin > 0 && (
                      <p className="job-salary">
                        Paga: {job.salaryMin}
                        {job.salaryCurrency}{" "}
                        {job.salaryMax > 0 &&
                          `- ${job.salaryMax}${job.salaryCurrency}`}{" "}
                        / muaj
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}

          {jobs.length === 0 && (
            <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
              Aktualisht kjo kompani nuk ka punë të hapura në CareerLink.
            </p>
          )}
        </div>

        <aside className="company-details-sidebar">
          <div className="card">
            <h2 className="section-title">Të dhëna kontakti</h2>
            <div className="company-links">
              {company.website && (
                <p>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="link"
                  >
                    🌐 Website
                  </a>
                </p>
              )}
              {company.linkedin && (
                <p>
                  <a
                    href={company.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="link"
                  >
                    💼 LinkedIn
                  </a>
                </p>
              )}
              {company.facebook && (
                <p>
                  <a
                    href={company.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="link"
                  >
                    📘 Facebook
                  </a>
                </p>
              )}
              {company.instagram && (
                <p>
                  <a
                    href={company.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="link"
                  >
                    📸 Instagram
                  </a>
                </p>
              )}
              {!company.website &&
                !company.linkedin &&
                !company.facebook &&
                !company.instagram && (
                  <p style={{ fontSize: "0.85rem" }}>
                    Kjo kompani nuk ka shtuar ende link-e kontakti.
                  </p>
                )}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default CompanyDetails;
