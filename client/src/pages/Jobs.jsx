// client/src/pages/Jobs.jsx
function Jobs() {
  return (
    <div className="page jobs-page">
      <header className="page-header">
        <h2>Punët e disponueshme</h2>
        <p>Filtro sipas pozicionit, qytetit, eksperiencës dhe tipit të punës.</p>
      </header>

      <div className="jobs-layout">
        {/* Filter anash */}
        <aside className="jobs-filters">
          <h3>Filtra</h3>
          <label>
            Qyteti
            <select>
              <option>Të gjitha</option>
              <option>Tiranë</option>
              <option>Durrës</option>
              <option>Fier</option>
            </select>
          </label>
          <label>
            Lloji i punës
            <select>
              <option>Të gjitha</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Remote</option>
              <option>Internship</option>
            </select>
          </label>
          <label>
            Nivel eksperiencë
            <select>
              <option>Të gjitha</option>
              <option>Junior</option>
              <option>Mid</option>
              <option>Senior</option>
            </select>
          </label>
        </aside>

        {/* Lista e punëve */}
        <section className="jobs-list">
          <div className="jobs-list-header">
            <input
              type="text"
              placeholder="Kërko sipas titullit, kompanisë ose fjalë kyçe..."
              className="search-input"
            />
          </div>

          <div className="jobs-grid">
            {/* placeholder cards për tani */}
            {Array.from({ length: 4 }).map((_, i) => (
              <article key={i} className="job-card">
                <div className="job-card-header">
                  <h3>Front-End Developer</h3>
                  <span className="job-type">Full-time</span>
                </div>
                <p className="job-company">Tech Company · Tiranë</p>
                <p className="job-meta">Postuar: 2 ditë më parë · Afati: 30 Nëntor</p>
                <p className="job-description">
                  Kërkojmë një zhvillues Front-End me eksperiencë në React, CSS dhe
                  REST APIs për të punuar në një platformë moderne.
                </p>
                <div className="job-card-footer">
                  <button className="btn btn-primary small">Apliko tani</button>
                  <button className="btn btn-ghost small">Ruaj</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Jobs;
