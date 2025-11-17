// client/src/pages/Feed.jsx
function Feed() {
  return (
    <div className="page feed-page">
      <header className="page-header">
        <h2>Rrjeti profesional</h2>
        <p>
          Shiko postimet e profesionistëve, kompanive dhe kolegëve të tu. Pëlqe, komento
          dhe shpërnda.
        </p>
      </header>

      <div className="feed-layout">
        {/* Kolona kryesore e postimeve */}
        <section className="feed-main">
          <div className="create-post-card">
            <textarea
              rows="3"
              placeholder="Ndaj një përditësim profesional, një projekt, certifikatë..."
            />
            <div className="create-post-actions">
              <button className="btn btn-primary small">Posto</button>
            </div>
          </div>

          {Array.from({ length: 3 }).map((_, i) => (
            <article key={i} className="post-card">
              <header className="post-header">
                <div className="avatar">GV</div>
                <div>
                  <h4>Genci Vaqo</h4>
                  <small>Full-Stack Developer · Fier</small>
                </div>
              </header>
              <p className="post-content">
                Sot përfundova një projekt të ri MERN për një platformë pune & social
                media profesionale në Shqipëri! 🚀
              </p>
              <footer className="post-footer">
                <button className="post-action">Pëlqe</button>
                <button className="post-action">Komento</button>
                <button className="post-action">Shpërnda</button>
              </footer>
            </article>
          ))}
        </section>

        {/* Sidebar djathtas */}
        <aside className="feed-sidebar">
          <div className="suggestions-card">
            <h4>Sugjerime për lidhje</h4>
            <ul>
              <li>
                <span>Developer React · Tiranë</span>
                <button className="btn btn-ghost small">Ndiq</button>
              </li>
              <li>
                <span>UI/UX Designer · Durrës</span>
                <button className="btn btn-ghost small">Ndiq</button>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Feed;
