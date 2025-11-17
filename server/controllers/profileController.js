// server/controllers/profileController.js
import User from "../models/User.js";

// GET /api/profile/me
export async function getMyProfile(req, res) {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "Përdoruesi nuk u gjet" });
    }
    res.json(user);
  } catch (err) {
    console.error("getMyProfile error:", err.message);
    res.status(500).json({ message: "Gabim serveri" });
  }
}

// PUT /api/profile  (headline, location, bio)
export async function updateProfileBasics(req, res) {
  try {
    const { headline, location, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { headline, location, bio },
      { new: true }
    ).select("-passwordHash");

    res.json(user);
  } catch (err) {
    console.error("updateProfileBasics error:", err.message);
    res.status(500).json({ message: "Gabim serveri" });
  }
}

// POST /api/profile/skills  { skill }
export async function addSkill(req, res) {
  try {
    const { skill } = req.body;
    if (!skill) {
      return res.status(400).json({ message: "Shkruaj një aftësi" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { skills: skill } }, // nuk lejon dublikatë
      { new: true }
    ).select("-passwordHash");

    res.json(user);
  } catch (err) {
    console.error("addSkill error:", err.message);
    res.status(500).json({ message: "Gabim serveri" });
  }
}

// DELETE /api/profile/skills/:skillName
export async function removeSkill(req, res) {
  try {
    const skillName = decodeURIComponent(req.params.skillName);

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { skills: skillName } },
      { new: true }
    ).select("-passwordHash");

    res.json(user);
  } catch (err) {
    console.error("removeSkill error:", err.message);
    res.status(500).json({ message: "Gabim serveri" });
  }
}

// POST /api/profile/experiences
export async function addExperience(req, res) {
  try {
    const { jobTitle, company, period, location, description } = req.body;

    if (!jobTitle || !company) {
      return res
        .status(400)
        .json({ message: "Pozicioni dhe kompania janë të detyrueshme" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Përdoruesi nuk u gjet" });

    user.experiences.push({ jobTitle, company, period, location, description });

    await user.save();
    const updated = await User.findById(req.userId).select("-passwordHash");
    res.json(updated);
  } catch (err) {
    console.error("addExperience error:", err.message);
    res.status(500).json({ message: "Gabim serveri" });
  }
}

// DELETE /api/profile/experiences/:expId
export async function deleteExperience(req, res) {
  try {
    const { expId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { experiences: { _id: expId } } },
      { new: true }
    ).select("-passwordHash");

    res.json(user);
  } catch (err) {
    console.error("deleteExperience error:", err.message);
    res.status(500).json({ message: "Gabim serveri" });
  }
}

// POST /api/profile/projects
export async function addProject(req, res) {
  try {
    const { name, description, link } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Titulli i projektit është i detyrueshëm" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Përdoruesi nuk u gjet" });

    user.projects.push({ name, description, link });
    await user.save();

    const updated = await User.findById(req.userId).select("-passwordHash");
    res.json(updated);
  } catch (err) {
    console.error("addProject error:", err.message);
    res.status(500).json({ message: "Gabim serveri" });
  }
}

// DELETE /api/profile/projects/:projectId
export async function deleteProject(req, res) {
  try {
    const { projectId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { projects: { _id: projectId } } },
      { new: true }
    ).select("-passwordHash");

    res.json(user);
  } catch (err) {
    console.error("deleteProject error:", err.message);
    res.status(500).json({ message: "Gabim serveri" });
  }
}
