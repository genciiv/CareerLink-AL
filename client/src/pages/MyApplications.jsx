// client/src/pages/MyApplications.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function formatStatus(status) {
  switch (status) {
    case "applied":
      return "Aplikuar";
    case "reviewed":
      return "Në shqyrtim";
    case "accepted":
      return "Pranuar";
    case "rejected":
      return "Refuzuar";
    default:
      return status || "Aplikuar";
  }
}

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString("sq-AL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/jobs/my-applications");
        setApplications(data);
      } catch (err) {
        console.error(err);
        setError("Nuk u ngarkuan aplikimet e tua.");
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Aplikimet e mia</h1>
        <p>Shiko punët ku ke aplikuar përmes CareerLink.</p>
      </div>

      {error && (
        <p style={{ color: "red", marginBottom: "1rem", fontSize: "0.9rem" }}>
          {error}
        </p>
      )}

      <section className="jobs-list">
        {loading && <p>Duke ngarkuar aplikimet...</p>}

        {!loading && applications.length === 0 && (
          <p>Ende nuk ke aplikuar për asnjë punë.</p>
        )}

        {!loading &&
          applications.map((app) => (
            <article
              key={`${app.jobId}-${app.appliedAt}`}
              className="card job-card"
            >
              <h2>{app.title}</h2>
              <p className="job-company">{app.companyName}</p>
              <p className="job-meta">
                {app.city || app.location || "Vendndodhje"} • {app.type} •{" "}
                {app.mode}
              </p>
              <p className="job-meta">
                Aplikuar më: <strong>{formatDate(app.appliedAt)}</strong>
              </p>
              <p className="job-meta">
                Statusi:{" "}
                <strong>
                  {formatStatus(app.status)}
                </strong>
              </p>
              {app.coverLetter && (
                <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                  <strong>Letra shoqëruese:</strong>{" "}
                  <span style={{ whiteSpace: "pre-line" }}>
                    {app.coverLetter.length > 200
                      ? app.coverLetter.slice(0, 200) + "..."
                      : app.coverLetter}
                  </span>
                </p>
              )}
              <div style={{ marginTop: "0.75rem" }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => navigate(`/jobs/${app.jobId}`)}
                >
                  Shiko detajet e punës
                </button>
              </div>
            </article>
          ))}
      </section>
    </div>
  );
}

export default MyApplications;
