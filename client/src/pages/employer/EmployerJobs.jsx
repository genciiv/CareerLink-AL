// client/src/pages/employer/EmployerJobs.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

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

function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/jobs/my");
      setJobs(data);
    } catch (err) {
      console.error(err);
      setError("Nuk u ngarkuan punët e tua.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleExpand = (jobId) => {
    setExpandedJobId((prev) => (prev === jobId ? null : jobId));
  };

  const handleStatusChange = async (jobId, applicantId, newStatus) => {
    try {
      const { data } = await api.patch(
        `/jobs/${jobId}/applicants/${applicantId}/status`,
        { status: newStatus }
      );
      // rifresko vetëm punën që u ndryshua
      setJobs((prev) => prev.map((j) => (j._id === data._id ? data : j)));
    } catch (err) {
      console.error(err);
      setError("Nuk u ndryshua statusi i aplikimit.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Punët e mia</h1>
        <p>Menaxho punët që ke publikuar dhe shiko aplikantët.</p>
      </div>

      {error && (
        <p style={{ color: "red", marginBottom: "1rem", fontSize: "0.9rem" }}>
          {error}
        </p>
      )}

      <section className="jobs-list">
        {loading && <p>Duke ngarkuar punët...</p>}

        {!loading && jobs.length === 0 && (
          <p>
            Ende nuk ke publikuar asnjë punë.{" "}
            <button
              type="button"
              className="btn-link"
              onClick={() => navigate("/employer/jobs/new")}
            >
              Posto punën tënde të parë.
            </button>
          </p>
        )}

        {!loading &&
          jobs.map((job) => {
            const applicants = job.applicants || [];
            return (
              <article key={job._id} className="card job-card">
                <h2>{job.title}</h2>
                <p className="job-company">{job.companyName}</p>
                <p className="job-meta">
                  {job.city || job.location || "Vendndodhje"} • {job.type} •{" "}
                  {job.mode}
                </p>

                <p className="job-meta">
                  Aplikantë:{" "}
                  <strong>{applicants.length}</strong>
                </p>

                <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => navigate(`/jobs/${job._id}`)}
                  >
                    Shiko punën publike
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => handleToggleExpand(job._id)}
                  >
                    {expandedJobId === job._id
                      ? "Mbyll aplikantët"
                      : "Shiko aplikantët"}
                  </button>
                </div>

                {expandedJobId === job._id && (
                  <div
                    style={{
                      marginTop: "1rem",
                      borderTop: "1px solid var(--border-color, #e5e7eb)",
                      paddingTop: "0.75rem",
                    }}
                  >
                    {applicants.length === 0 && (
                      <p style={{ fontSize: "0.9rem" }}>
                        Ende nuk ka aplikantë për këtë pozicion.
                      </p>
                    )}

                    {applicants.map((app) => (
                      <div
                        key={app._id}
                        style={{
                          marginBottom: "0.75rem",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "8px",
                          background: "var(--chip-bg, #f3f4f6)",
                          fontSize: "0.9rem",
                        }}
                      >
                        <p>
                          <strong>
                            {app.user?.fullName || "Kandidat"}{" "}
                          </strong>
                          {app.user?.email && (
                            <>• {app.user.email}</>
                          )}
                        </p>
                        <p style={{ fontSize: "0.85rem" }}>
                          Statusi:{" "}
                          <select
                            value={app.status || "applied"}
                            onChange={(e) =>
                              handleStatusChange(
                                job._id,
                                app._id,
                                e.target.value
                              )
                            }
                            style={{ fontSize: "0.85rem" }}
                          >
                            <option value="applied">Aplikuar</option>
                            <option value="reviewed">Në shqyrtim</option>
                            <option value="accepted">Pranuar</option>
                            <option value="rejected">Refuzuar</option>
                          </select>
                        </p>
                        {app.coverLetter && (
                          <p
                            style={{
                              marginTop: "0.25rem",
                              fontSize: "0.85rem",
                              whiteSpace: "pre-line",
                            }}
                          >
                            <strong>Letra shoqëruese:</strong>{" "}
                            {app.coverLetter}
                          </p>
                        )}
                        <p style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
                          Aplikuar më:{" "}
                          {new Date(app.createdAt).toLocaleString("sq-AL")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
      </section>
    </div>
  );
}

export default EmployerJobs;
