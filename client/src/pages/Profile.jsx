// client/src/pages/Profile.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/profile.css";

function Profile() {
  const [tab, setTab] = useState("about");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: "",
    headline: "",
    location: "",
    bio: "",
    skills: [],
    experiences: [],
    projects: [],
  });

  const [expForm, setExpForm] = useState({
    jobTitle: "",
    company: "",
    period: "",
    location: "",
    description: "",
  });

  const [projForm, setProjForm] = useState({
    name: "",
    description: "",
    link: "",
  });

  const [skillInput, setSkillInput] = useState("");

  // 🔹 Merr profili nga backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/profile/me");
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError("Nuk u ngarkua profili. Provo të rifreskosh faqen.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleBasicsChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Ruaj headline, location, bio
  const handleSaveBasics = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data } = await api.put("/profile", {
        headline: profile.headline,
        location: profile.location,
        bio: profile.bio,
      });
      setProfile(data);
    } catch (err) {
      console.error(err);
      setError("Nuk u ruaj profili.");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Skills
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;

    try {
      const { data } = await api.post("/profile/skills", {
        skill: skillInput.trim(),
      });
      setProfile(data);
      setSkillInput("");
    } catch (err) {
      console.error(err);
      setError("Nuk u shtua aftësia.");
    }
  };

  const handleRemoveSkill = async (skill) => {
    try {
      const { data } = await api.delete(
        `/profile/skills/${encodeURIComponent(skill)}`
      );
      setProfile(data);
    } catch (err) {
      console.error(err);
      setError("Nuk u fshi aftësia.");
    }
  };

  // 🔹 Experiences
  const handleExpChange = (e) => {
    const { name, value } = e.target;
    setExpForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    if (!expForm.jobTitle || !expForm.company) return;

    try {
      const { data } = await api.post("/profile/experiences", expForm);
      setProfile(data);
      setExpForm({
        jobTitle: "",
        company: "",
        period: "",
        location: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      setError("Nuk u shtua eksperienca.");
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      const { data } = await api.delete(`/profile/experiences/${id}`);
      setProfile(data);
    } catch (err) {
      console.error(err);
      setError("Nuk u fshi eksperienca.");
    }
  };

  // 🔹 Projects
  const handleProjChange = (e) => {
    const { name, value } = e.target;
    setProjForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!projForm.name) return;

    try {
      const { data } = await api.post("/profile/projects", projForm);
      setProfile(data);
      setProjForm({ name: "", description: "", link: "" });
    } catch (err) {
      console.error(err);
      setError("Nuk u shtua projekti.");
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const { data } = await api.delete(`/profile/projects/${id}`);
      setProfile(data);
    } catch (err) {
      console.error(err);
      setError("Nuk u fshi projekti.");
    }
  };

  if (loading) {
    return (
      <div className="page profile-page">
        <p>Duke ngarkuar profilin...</p>
      </div>
    );
  }

  return (
    <div className="page profile-page">
      <div className="page-header">
        <h1>Profili im</h1>
        <p>
          {profile.fullName} •{" "}
          {profile.role === "employer"
            ? "Kompani"
            : profile.role === "admin"
            ? "Admin"
            : "Kandidat"}
        </p>
      </div>

      {error && (
        <p style={{ color: "red", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
          {error}
        </p>
      )}

      <section className="profile-layout">
        {/* Sidebar */}
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

        {/* Main */}
        <div className="profile-main">
          {/* ABOUT */}
          {tab === "about" && (
            <div className="card">
              <h2>Informacionet personale</h2>

              <form className="form-grid" onSubmit={handleSaveBasics}>
                <label>
                  Titulli profesional
                  <input
                    type="text"
                    name="headline"
                    placeholder="p.sh. Full Stack Developer"
                    value={profile.headline || ""}
                    onChange={handleBasicsChange}
                  />
                </label>

                <label>
                  Vendndodhja
                  <input
                    type="text"
                    name="location"
                    placeholder="Tiranë, Shqipëri"
                    value={profile.location || ""}
                    onChange={handleBasicsChange}
                  />
                </label>

                <label className="form-full">
                  Bio
                  <textarea
                    name="bio"
                    placeholder="Shkruaj një përshkrim të shkurtër rreth teje..."
                    value={profile.bio || ""}
                    onChange={handleBasicsChange}
                  />
                </label>

                <button className="btn-primary" disabled={saving}>
                  {saving ? "Duke ruajtur..." : "Ruaj"}
                </button>
              </form>
            </div>
          )}

          {/* EXPERIENCE */}
          {tab === "experience" && (
            <div className="card">
              <h2>Eksperiencat e punës</h2>

              <div className="item-list">
                {profile.experiences?.length === 0 && (
                  <p>Ende nuk ke shtuar eksperienca.</p>
                )}

                {profile.experiences?.map((exp) => (
                  <div className="item" key={exp._id}>
                    <div>
                      <h3>{exp.jobTitle}</h3>
                      <p>
                        {exp.company} • {exp.period}{" "}
                        {exp.location && `• ${exp.location}`}
                      </p>
                      {exp.description && <p>{exp.description}</p>}
                    </div>
                    <button
                      type="button"
                      className="btn-ghost small"
                      onClick={() => handleDeleteExperience(exp._id)}
                    >
                      Fshi
                    </button>
                  </div>
                ))}
              </div>

              <form className="form-grid" onSubmit={handleAddExperience}>
                <label>
                  Pozicioni
                  <input
                    type="text"
                    name="jobTitle"
                    placeholder="IT Specialist"
                    value={expForm.jobTitle}
                    onChange={handleExpChange}
                  />
                </label>
                <label>
                  Kompania
                  <input
                    type="text"
                    name="company"
                    placeholder="TechVision"
                    value={expForm.company}
                    onChange={handleExpChange}
                  />
                </label>
                <label>
                  Periudha
                  <input
                    type="text"
                    name="period"
                    placeholder="2023 - Vazhdon"
                    value={expForm.period}
                    onChange={handleExpChange}
                  />
                </label>
                <label>
                  Vendndodhja
                  <input
                    type="text"
                    name="location"
                    placeholder="Tiranë"
                    value={expForm.location}
                    onChange={handleExpChange}
                  />
                </label>
                <label className="form-full">
                  Përshkrimi
                  <textarea
                    name="description"
                    placeholder="Shkruaj detyrat dhe përgjegjësitë..."
                    value={expForm.description}
                    onChange={handleExpChange}
                  />
                </label>

                <button className="btn-primary">Shto Eksperiencë</button>
              </form>
            </div>
          )}

          {/* SKILLS */}
          {tab === "skills" && (
            <div className="card">
              <h2>Aftësitë</h2>

              <div className="skills-list">
                {profile.skills?.length === 0 && (
                  <p>Ende nuk ke shtuar aftësi.</p>
                )}
                {profile.skills?.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              <form className="form-grid" onSubmit={handleAddSkill}>
                <label className="form-full">
                  Shto aftësi
                  <input
                    type="text"
                    placeholder="p.sh. React, Node.js"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                  />
                </label>
                <button className="btn-primary">Shto</button>
              </form>
            </div>
          )}

          {/* PROJECTS */}
          {tab === "projects" && (
            <div className="card">
              <h2>Projektet</h2>

              <div className="item-list">
                {profile.projects?.length === 0 && (
                  <p>Ende nuk ke shtuar projekte.</p>
                )}

                {profile.projects?.map((proj) => (
                  <div className="item" key={proj._id}>
                    <div>
                      <h3>{proj.name}</h3>
                      {proj.description && <p>{proj.description}</p>}
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="item-link"
                        >
                          Shko te projekti
                        </a>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn-ghost small"
                      onClick={() => handleDeleteProject(proj._id)}
                    >
                      Fshi
                    </button>
                  </div>
                ))}
              </div>

              <form className="form-grid" onSubmit={handleAddProject}>
                <label className="form-full">
                  Titulli projektit
                  <input
                    type="text"
                    name="name"
                    placeholder="CareerLink Platform"
                    value={projForm.name}
                    onChange={handleProjChange}
                  />
                </label>
                <label className="form-full">
                  Përshkrimi
                  <textarea
                    name="description"
                    placeholder="Përshkruaj projektin tënd..."
                    value={projForm.description}
                    onChange={handleProjChange}
                  />
                </label>
                <label className="form-full">
                  Link (opsional)
                  <input
                    type="text"
                    name="link"
                    placeholder="https://..."
                    value={projForm.link}
                    onChange={handleProjChange}
                  />
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
