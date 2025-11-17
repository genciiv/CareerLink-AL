// server/controllers/profileController.js
import User from "../models/User.js";

/**
 * GET /api/profile/me
 * Kthen profilin e përdoruesit aktual
 */
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "Profili nuk u gjet" });
    }
    res.json({ user });
  } catch (error) {
    console.error("getMyProfile error:", error.message);
    res.status(500).json({ message: "Gabim serveri" });
  }
};

/**
 * PUT /api/profile/me
 * Përditëson fushat bazë: headline, location, bio, skills
 */
export const updateMyProfile = async (req, res) => {
  try {
    const { headline, location, bio, skills } = req.body;

    const update = {};
    if (headline !== undefined) update.headline = headline;
    if (location !== undefined) update.location = location;
    if (bio !== undefined) update.bio = bio;

    // skills vjen si string "JS, React, Node" ose array
    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        update.skills = skills;
      } else if (typeof skills === "string") {
        update.skills = skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: update },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    res.json({ user });
  } catch (error) {
    console.error("updateMyProfile error:", error.message);
    res.status(500).json({ message: "Gabim serveri gjatë përditësimit të profilit" });
  }
};

/**
 * POST /api/profile/experience
 * Shton një experience të re
 */
export const addExperience = async (req, res) => {
  try {
    const exp = req.body; // merr title, company, ...

    if (!exp.title || !exp.company) {
      return res
        .status(400)
        .json({ message: "Titulli dhe kompania janë të detyrueshme" });
    }

    const user = await User.findById(req.userId);
    user.experiences.push(exp);
    await user.save();

    res.status(201).json({ experiences: user.experiences });
  } catch (error) {
    console.error("addExperience error:", error.message);
    res.status(500).json({ message: "Gabim serveri gjatë shtimit të eksperiencës" });
  }
};

/**
 * DELETE /api/profile/experience/:id
 */
export const deleteExperience = async (req, res) => {
  try {
    const expId = req.params.id;

    const user = await User.findById(req.userId);
    user.experiences = user.experiences.filter(
      (exp) => exp._id.toString() !== expId
    );
    await user.save();

    res.json({ experiences: user.experiences });
  } catch (error) {
    console.error("deleteExperience error:", error.message);
    res.status(500).json({ message: "Gabim serveri gjatë fshirjes së eksperiencës" });
  }
};

/**
 * POST /api/profile/project
 * Shton një projekt
 */
export const addProject = async (req, res) => {
  try {
    const proj = req.body;
    if (!proj.name) {
      return res
        .status(400)
        .json({ message: "Emri i projektit është i detyrueshëm" });
    }

    const user = await User.findById(req.userId);
    user.projects.push(proj);
    await user.save();

    res.status(201).json({ projects: user.projects });
  } catch (error) {
    console.error("addProject error:", error.message);
    res.status(500).json({ message: "Gabim serveri gjatë shtimit të projektit" });
  }
};

/**
 * DELETE /api/profile/project/:id
 */
export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const user = await User.findById(req.userId);
    user.projects = user.projects.filter(
      (p) => p._id.toString() !== projectId
    );
    await user.save();

    res.json({ projects: user.projects });
  } catch (error) {
    console.error("deleteProject error:", error.message);
    res.status(500).json({ message: "Gabim serveri gjatë fshirjes së projektit" });
  }
};
