// server/controllers/jobController.js
import Job from "../models/Job.js";

// GET /api/jobs
export async function listJobs(req, res) {
  try {
    const { q, city, type, mode } = req.query;

    const filter = { isActive: true };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { companyName: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    if (type) {
      filter.type = type;
    }

    if (mode) {
      filter.mode = mode;
    }

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .select("-applicants");

    res.json(jobs);
  } catch (err) {
    console.error("listJobs error:", err.message);
    res.status(500).json({ message: "Gabim serveri" });
  }
}

// GET /api/jobs/:id
export async function getJobById(req, res) {
  try {
    const job = await Job.findById(req.params.id).populate(
      "createdBy",
      "fullName email"
    );
    if (!job) return res.status(404).json({ message: "Puna nuk u gjet" });
    res.json(job);
  } catch (err) {
    console.error("getJobById error:", err.message);
    res.status(500).json({ message: "Gabim serveri" });
  }
}

// POST /api/jobs  (vetëm employer)
export async function createJob(req, res) {
  try {
    const {
      title,
      companyName,
      location,
      city,
      type,
      mode,
      salaryMin,
      salaryMax,
      salaryCurrency,
      description,
      requirements,
    } = req.body;

    if (!title || !companyName) {
      return res
        .status(400)
        .json({ message: "Titulli dhe kompania janë të detyrueshme" });
    }

    const job = await Job.create({
      title,
      companyName,
      location,
      city,
      type,
      mode,
      salaryMin,
      salaryMax,
      salaryCurrency,
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : (requirements || "")
            .split("\n")
            .map((r) => r.trim())
            .filter(Boolean),
      createdBy: req.userId,
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("createJob error:", err.message);
    res
      .status(500)
      .json({ message: "Gabim serveri gjatë krijimit të punës" });
  }
}

// PUT /api/jobs/:id (vetëm employer + owner)
export async function updateJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Puna nuk u gjet" });

    if (job.createdBy.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ message: "Nuk mund të modifikosh këtë punë" });
    }

    const {
      title,
      companyName,
      location,
      city,
      type,
      mode,
      salaryMin,
      salaryMax,
      salaryCurrency,
      description,
      requirements,
      isActive,
    } = req.body;

    job.title = title ?? job.title;
    job.companyName = companyName ?? job.companyName;
    job.location = location ?? job.location;
    job.city = city ?? job.city;
    job.type = type ?? job.type;
    job.mode = mode ?? job.mode;
    job.salaryMin = salaryMin ?? job.salaryMin;
    job.salaryMax = salaryMax ?? job.salaryMax;
    job.salaryCurrency = salaryCurrency ?? job.salaryCurrency;
    job.description = description ?? job.description;
    job.isActive = typeof isActive === "boolean" ? isActive : job.isActive;

    if (requirements !== undefined) {
      job.requirements = Array.isArray(requirements)
        ? requirements
        : (requirements || "")
            .split("\n")
            .map((r) => r.trim())
            .filter(Boolean);
    }

    await job.save();
    res.json(job);
  } catch (err) {
    console.error("updateJob error:", err.message);
    res
      .status(500)
      .json({ message: "Gabim serveri gjatë përditësimit të punës" });
  }
}

// DELETE /api/jobs/:id
export async function deleteJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Puna nuk u gjet" });

    if (job.createdBy.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ message: "Nuk mund të fshish këtë punë" });
    }

    await job.deleteOne();
    res.json({ message: "Puna u fshi" });
  } catch (err) {
    console.error("deleteJob error:", err.message);
    res
      .status(500)
      .json({ message: "Gabim serveri gjatë fshirjes së punës" });
  }
}

// POST /api/jobs/:id/apply  (candidate)
export async function applyToJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Puna nuk u gjet" });

    const already = job.applicants.some(
      (a) => a.user.toString() === req.userId.toString()
    );
    if (already) {
      return res
        .status(400)
        .json({ message: "Ke aplikuar tashmë për këtë pozicion" });
    }

    const { coverLetter } = req.body;

    job.applicants.push({
      user: req.userId,
      coverLetter: coverLetter || "",
    });

    await job.save();

    res.status(201).json({ message: "Aplikimi u dërgua me sukses" });
  } catch (err) {
    console.error("applyToJob error:", err.message);
    res.status(500).json({ message: "Gabim serveri gjatë aplikimit" });
  }
}
