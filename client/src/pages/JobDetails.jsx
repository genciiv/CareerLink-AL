// client/src/pages/JobDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/jobDetails.css";

function formatDate(dateString) {
  if (!dateString) return "Afat i pacaktuar";
  const d = new Date(dateString);
  return d.toLocaleDateString("sq-AL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [isApplied, setIsApplied] = useState(false);

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const token = localStorage.getItem("token");
  const role = user?.role || "candidate";
  const isCandidate = !!token && role === "candidate";

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);

        const currentId = user?._id;
        if (currentId && data.applicants?.length) {
          const found = data.applicants.some(
            (a) => a.user?._id === currentId || a.user === currentId
          );
          if (found) setIsApplied(true);
        }
      } catch (err) {
        console.error(err);
        setError("Nuk u gjet kjo punë ose ndodhi një gabim.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleApply = async (viaWhatsApp = false) => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!isCandidate) return;

    try {
      setApplying(true);
      setApplyMessage("");

      const payload = viaWhatsApp
        ? { coverLetter: `${coverLetter}\n\n(Aplikuar edhe nga WhatsApp)` }
        : { coverLetter };

      const { data } = await api.post(`/jobs/${id}/apply`, payload);
      setApplyMessage(data.message || "Aplikimi u dërgua me sukses.");
      setIsApplied(true);
    } catch (err) {
      console.error(err);
      setApplyMessage(
        err.response?.data?.message ||
          "Nuk u dërgua aplikimi. Provo përsëri."
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p>Duke ngarkuar detajet e punës...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="page">
        <p style={{ color: "red" }}>{error || "Puna nuk u gjet."}</p>
      </div>
    );
  }

  const {
    title,
    companyName,
    city,
    location,
    type,
    mode,
    salaryMin,
    salaryMax,
    salaryCurrency,
    description,
    requirements,
    createdAt,
    expiresAt,
    applicants,
    _id,
  } = job;

  const salaryText =
    salaryMin || salaryMax
      ? `${salaryMin || "—"}${salaryCurrency || "€"} - ${
          salaryMax || "—"
        }${salaryCurrency || "€"} / muaj`
      : "Pagë konkuruese";

  const applicantsCount = applicants?.length || 0;

  return (
    <div className="page job-detail-page">
      {/* KARTA SIPËRME */}
      <section className="job-detail-header-card">
        <div className="job-detail-header-main">
          <h1>{title}</h1>

          <div className="job-detail-header-meta">
            <p className="job-detail-company">{companyName}</p>
            <span className="dot-separator">•</span>
            <span className="job-detail-meta-item">
              {city || location || "Vendndodhje"}
            </span>
            <span className="dot-separator">•</span>
            <span className="job-detail-meta-item">{mode || "On-site"}</span>
          </div>

          <div className="job-detail-badges">
            <span className="badge-danger">
              Afati i aplikimit: {formatDate(expiresAt)}
            </span>
            <span className="badge-soft">Pagë konkuruese</span>
          </div>
        </div>
      </section>

      {/* LAYOUT 2 KOLONA */}
      <section className="job-detail-layout">
        {/* MAJTAS */}
        <div className="job-detail-main-card">
          <div className="job-detail-block">
            <h2>Rreth pozicionit</h2>
            <p className="job-detail-text">
              {description
                ? description
                : "Kjo kompani nuk ka shtuar ende një përshkrim të plotë për këtë rol."}
            </p>
          </div>

          {Array.isArray(requirements) && requirements.length > 0 && (
            <div className="job-detail-block">
              <h3>Detyra & përgjegjësi kryesore</h3>
              <ul className="job-detail-list">
                {requirements.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* DJATHTAS */}
        <aside className="job-detail-sidebar">
          {/* Apliko tani */}
          <div className="job-detail-apply-card">
            {isCandidate ? (
              <>
                <button
                  type="button"
                  className="btn btn-primary full-width"
                  disabled={applying || isApplied}
                  onClick={() => handleApply(false)}
                >
                  {isApplied ? "Ke aplikuar tashmë" : "Apliko tani"}
                </button>

                <div className="job-detail-apply-divider">
                  <span>ose</span>
                </div>

                <button
                  type="button"
                  className="btn btn-ghost full-width"
                  disabled={applying || isApplied}
                  onClick={() => handleApply(true)}
                >
                  Apliko me WhatsApp
                </button>

                <textarea
                  className="job-detail-cover-input"
                  placeholder="(Opsionale) Letër shoqëruese / mesazh i shkurtër..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </>
            ) : (
              <>
                <p className="job-detail-login-hint">
                  Për të aplikuar për këtë punë duhet të jesh i loguar si
                  kandidat.
                </p>
                <button
                  type="button"
                  className="btn btn-primary full-width"
                  onClick={() => navigate("/login")}
                >
                  Hyr / Regjistrohu për të aplikuar
                </button>
              </>
            )}

            {applyMessage && (
              <p className="job-detail-apply-message">{applyMessage}</p>
            )}
          </div>

          {/* Përmbledhje */}
          <div className="job-detail-summary-card">
            <h3>Përmbledhje</h3>
            <ul className="job-summary-list">
              <li>
                <span className="label">Vendndodhja</span>
                <span className="value">{city || location || "—"}</span>
              </li>
              <li>
                <span className="label">Punësimi</span>
                <span className="value">{type || "—"}</span>
              </li>
              <li>
                <span className="label">Mënyra e punës</span>
                <span className="value">{mode || "On-site"}</span>
              </li>
              <li>
                <span className="label">Paga</span>
                <span className="value">{salaryText}</span>
              </li>
              <li>
                <span className="label">Afati i aplikimit</span>
                <span className="value">{formatDate(expiresAt)}</span>
              </li>
              <li>
                <span className="label">Publikuar</span>
                <span className="value">{formatDate(createdAt)}</span>
              </li>
            </ul>
          </div>

          {/* Statistika */}
          <div className="job-detail-summary-card">
            <h3>Statistika</h3>
            <ul className="job-summary-list">
              <li>
                <span className="label">Aplikantë</span>
                <span className="value">{applicantsCount}</span>
              </li>
              <li>
                <span className="label">ID e punës</span>
                <span className="value small">{_id}</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default JobDetails;
