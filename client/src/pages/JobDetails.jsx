// client/src/pages/JobDetails.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");
  const [applyStatus, setApplyStatus] = useState("");
  const [error, setError] = useState("");

  const currentUserRaw = localStorage.getItem("user");
  const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (err) {
        console.error(err);
        setError("Nuk u gjet kjo punë.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setError("");
    setApplyStatus("");

    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const { data } = await api.post(`/jobs/${id}/apply`, {
        coverLetter,
      });
      setApplyStatus(data.message || "Aplikimi u dërgua me sukses.");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || "Nuk u dërgua aplikimi. Provo sërish.";
      setError(msg);
    }
  };

  if (loading) {
    return (
      <div className="page job-details-page">
        <p>Duke ngarkuar punën...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="page job-details-page">
        <p>{error || "Puna nuk u gjet."}</p>
      </div>
    );
  }

  const isEmployerOwner =
    currentUser &&
    (currentUser.role === "employer" || currentUser.role === "admin") &&
    job.createdBy &&
    job.createdBy._id === currentUser._id;

  return (
    <div className="page job-details-page">
      <div className="page-header">
        <h1>{job.title}</h1>
        <p>
          {job.companyName} • {job.city || job.location || "Vendndodhje"} •{" "}
          {job.type} • {job.mode}
        </p>
      </div>

      <section className="card">
        {job.salaryMin > 0 && (
          <p>
            <strong>Paga:</strong>{" "}
            {job.salaryMin}
            {job.salaryCurrency}{" "}
            {job.salaryMax > 0 &&
              `- ${job.salaryMax}${job.salaryCurrency}`}{" "}
            / muaj
          </p>
        )}

        {job.description && (
          <>
            <h2>Përshkrimi i punës</h2>
            <p style={{ whiteSpace: "pre-line" }}>{job.description}</p>
          </>
        )}

        {job.requirements && job.requirements.length > 0 && (
          <>
            <h2>Kërkesat</h2>
            <ul>
              {job.requirements.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>
          </>
        )}

        {job.createdBy && (
          <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
            Postuar nga: {job.createdBy.fullName} ({job.createdBy.email})
          </p>
        )}
      </section>

      {!isEmployerOwner && (
        <section className="card" style={{ marginTop: "1.5rem" }}>
          <h2>Apliko për këtë punë</h2>

          {error && (
            <p style={{ color: "red", marginBottom: "0.5rem" }}>{error}</p>
          )}
          {applyStatus && (
            <p style={{ color: "green", marginBottom: "0.5rem" }}>
              {applyStatus}
            </p>
          )}

          {!currentUser && (
            <p style={{ marginBottom: "0.5rem" }}>
              Që të aplikosh, duhet të{" "}
              <button
                type="button"
                className="btn-link"
                onClick={() => navigate("/login")}
              >
                futesh në llogari
              </button>
              .
            </p>
          )}

          <form onSubmit={handleApply} className="form-grid">
            <label className="form-full">
              Letra shoqëruese (opsionale)
              <textarea
                placeholder="Shkruaj shkurt pse je kandidati i duhur..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </label>
            <button className="btn-primary">Dërgo aplikimin</button>
          </form>
        </section>
      )}
    </div>
  );
}

export default JobDetails;
