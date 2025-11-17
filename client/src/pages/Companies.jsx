// client/src/pages/Companies.jsx
function Companies() {
  return (
    <div className="page companies-page">
      <header className="page-header">
        <h2>Kompanitë partnere</h2>
        <p>Shfleto kompani, shiko profilin e tyre dhe pozicionet e hapura.</p>
      </header>

      <div className="companies-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <article key={i} className="company-card">
            <div className="company-logo">{/* mund të vendosim iniciale */}CL</div>
            <h3>CareerLink Studio</h3>
            <p className="company-location">Tiranë · Teknologji Informacioni</p>
            <p className="company-openings">3 pozicione të hapura</p>
            <button className="btn btn-ghost small">Shiko profilin</button>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Companies;
