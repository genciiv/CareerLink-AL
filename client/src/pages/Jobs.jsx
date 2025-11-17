// client/src/pages/Jobs.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/jobs", {
        params: {
          q: q || undefined,
          city: city || undefined,
          type: type || undefined,
          mode: mode || undefined,
        },
      });
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const currentUserRaw = localStorage.getItem("user");
  const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
  const isEmployer =
    currentUser && (currentUser.role === "employer" || currentUser.role === "admin");

  return (
    <div className="page jobs-page">
      <div className="page-header">
        <h1>Punë të hapura</h1>
        <p>Gjej mundësi pune nga kompani në të gjithë Shqipërinë.</p>
      </div>

      <section className="card">
        <form className="jobs-filters" onSubmit={handleSearch}>
          <div className="filters-row">
            <input
              type="text"
              placeholder="Kërko sipas rolit ose kompanisë"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <input
              type="text"
              placeholder="Qyteti"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Lloji i punës</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Other">Tjetër</option>
            </select>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="">Mënyra</option>
              <option value="On-site">Në zyrë</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hibrid</option>
            </select>
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
              onClick={() => navigate("/employer/jobs/new")}
            >
              + Posto punë
            </button>
          </div>
        )}
      </section>

      <section className="jobs-list">
        {loading && <p>Duke ngarkuar punët...</p>}

        {!loading && jobs.length === 0 && (
          <p>Nuk u gjet asnjë punë me këto filtra.</p>
        )}

        {jobs.map((job) => (
          <article
            key={job._id}
            className="card job-card"
            onClick={() => navigate(`/jobs/${job._id}`)}
          >
            <h2>{job.title}</h2>
            <p className="job-company">{job.companyName}</p>
            <p className="job-meta">
              {job.city || job.location || "Vendndodhje e papërcaktuar"} •{" "}
              {job.type} • {job.mode}
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
      </section>
    </div>
  );
}

export default Jobs;
