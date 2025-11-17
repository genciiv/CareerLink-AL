// client/src/pages/Home.jsx
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-left">
          <h1>
            Gjej punën dhe krijo <span>rrjetin profesional</span> në Shqipëri.
          </h1>
          <p>
            CareerLink është platformë pune & social media profesionale ku
            kandidatët, kompanitë dhe profesionistët lidhen, aplikojnë dhe
            bashkëpunojnë.
          </p>

          <div className="hero-actions">
            <Link to="/jobs" className="btn btn-primary">
              Shfleto punët
            </Link>
            <Link to="/feed" className="btn btn-ghost">
              Shiko rrjetin
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>150+</strong>
              <span>Punë aktive</span>
            </div>
            <div>
              <strong>80+</strong>
              <span>Kompaní</span>
            </div>
            <div>
              <strong>2K+</strong>
              <span>Përdorues</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card">
            <h3>Punë të rekomanduara</h3>
            <ul>
              <li>
                <span>Full Stack Developer</span>
                <small>Tiranë · Full-time</small>
              </li>
              <li>
                <span>Graphic Designer</span>
                <small>Online · Remote</small>
              </li>
              <li>
                <span>IT Support Specialist</span>
                <small>Fier · Full-time</small>
              </li>
            </ul>
            <Link to="/jobs" className="hero-link">
              Shiko të gjitha punët →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
