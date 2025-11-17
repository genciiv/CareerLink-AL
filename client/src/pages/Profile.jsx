// client/src/pages/Profile.jsx
import { useState } from "react";
import "../styles/profile.css";

function Profile() {
  const [tab, setTab] = useState("about");

  return (
    <div className="page profile-page">
      {/* Header */}
      <div className="page-header">
        <h1>Profili im</h1>
        <p>Menaxho informacionin tënd profesional.</p>
      </div>

      {/* Layout */}
      <section className="profile-layout">
        {/* Left Menu */}
        <aside className="profile-sidebar">
          <button
            className={tab === "about" ? "active" : ""}
            onClick={() => setTab("about")}
          >
            Informacione
          </button>
          <button
            className={tab === "experience" ? "active" : ""}
            onClick={() => setTab("experience")}
          >
            Eksperiencat
          </button>
          <button
            className={tab === "skills" ? "active" : ""}
            onClick={() => setTab("skills")}
          >
            Aftësitë
          </button>
          <button
            className={tab === "projects" ? "active" : ""}
            onClick={() => setTab("projects")}
          >
            Projektet
          </button>
        </aside>

        {/* Main Content */}
        <div className="profile-main">
          {/* ================= ABOUT ================= */}
          {tab === "about" && (
            <div className="card">
              <h2>Informacionet personale</h2>

              <form className="form-grid">
                <label>
                  Emri & Mbiemri
                  <input type="text" placeholder="Emri yt" />
                </label>

                <label>
                  Profesioni
                  <input type="text" placeholder="Full Stack Developer" />
                </label>

                <label>
                  Vendndodhja
                  <input type="text" placeholder="Tiranë, Shqipëri" />
                </label>

                <label className="form-full">
                  Bio
                  <textarea placeholder="Shkruaj një përshkrim të shkurtër rreth teje..." />
                </label>

                <button className="btn-primary">Ruaj</button>
              </form>
            </div>
          )}

          {/* ================= EXPERIENCE ================= */}
          {tab === "experience" && (
            <div className="card">
              <h2>Eksperiencat e punës</h2>

              <div className="item-list">
                <div className="item">
                  <div>
                    <h3>IT Specialist - TechVision</h3>
                    <p>2023 - 2024</p>
                  </div>
                </div>
              </div>

              <form className="form-grid">
                <label>
                  Pozicioni
                  <input type="text" placeholder="IT Specialist" />
                </label>
                <label>
                  Kompania
                  <input type="text" placeholder="TechVision" />
                </label>
                <label>
                  Periudha
                  <input type="text" placeholder="2023 - Vazhdon" />
                </label>
                <label className="form-full">
                  Përshkrimi
                  <textarea placeholder="Shkruaj detyrat dhe përgjegjësitë..." />
                </label>

                <button className="btn-primary">Shto Eksperiencë</button>
              </form>
            </div>
          )}

          {/* ================= SKILLS ================= */}
          {tab === "skills" && (
            <div className="card">
              <h2>Aftësitë</h2>

              <div className="skills-list">
                <span className="skill-tag">React</span>
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">MongoDB</span>
              </div>

              <form className="form-grid">
                <label className="form-full">
                  Shto aftësi
                  <input type="text" placeholder="p.sh. TailwindCSS" />
                </label>
                <button className="btn-primary">Shto</button>
              </form>
            </div>
          )}

          {/* ================= PROJECTS ================= */}
          {tab === "projects" && (
            <div className="card">
              <h2>Projektet</h2>

              <div className="item-list">
                <div className="item">
                  <div>
                    <h3>CareerLink Platform</h3>
                    <p>MERN stack platformë pune & rrjete profesionale</p>
                  </div>
                </div>
              </div>

              <form className="form-grid">
                <label className="form-full">
                  Titulli projektit
                  <input type="text" placeholder="Titulli i projektit" />
                </label>
                <label className="form-full">
                  Përshkrimi
                  <textarea placeholder="Përshkruaj projektin tënd..." />
                </label>
                <button className="btn-primary">Shto Projekt</button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Profile;
