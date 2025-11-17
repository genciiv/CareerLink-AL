// server/controllers/companyController.js
import Company from "../models/Company.js";
import Job from "../models/Job.js";

// GET /api/companies
export async function listCompanies(req, res) {
  try {
    const { q, city, industry } = req.query;
    const filter = {};

    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }
    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }
    if (industry) {
      filter.industry = { $regex: industry, $options: "i" };
    }

    const companies = await Company.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(companies);
  } catch (err) {
    console.error("listCompanies error:", err.message);
    res.status(500).json({ message: "Gabim serveri gjatë listimit të kompanive" });
  }
}

// GET /api/companies/:id
export async function getCompanyById(req, res) {
  try {
    const company = await Company.findById(req.params.id).populate(
      "owner",
      "fullName email"
    );
    if (!company) {
      return res.status(404).json({ message: "Kompania nuk u gjet" });
    }

    // gjej punët e hapura nga ky owner
    const jobs = await Job.find({
      createdBy: company.owner._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json({ company, jobs });
  } catch (err) {
    console.error("getCompanyById error:", err.message);
    res.status(500).json({ message: "Gabim serveri gjatë marrjes së kompanisë" });
  }
}

// GET /api/companies/me (profil kompania e employer-it loguar)
export async function getMyCompany(req, res) {
  try {
    const company = await Company.findOne({ owner: req.userId });
    if (!company) {
      return res.status(404).json({ message: "Ende nuk ke krijuar kompani" });
    }
    res.json(company);
  } catch (err) {
    console.error("getMyCompany error:", err.message);
    res.status(500).json({ message: "Gabim serveri" });
  }
}

// POST /api/companies/me (krijo/ndrysho kompaninë time)
export async function upsertMyCompany(req, res) {
  try {
    const {
      name,
      logoUrl,
      city,
      country,
      industry,
      size,
      website,
      description,
      linkedin,
      facebook,
      instagram,
      isHiring,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Emri i kompanisë është i detyrueshëm" });
    }

    const data = {
      name: name.trim(),
      logoUrl: logoUrl || "",
      city: city || "",
      country: country || "",
      industry: industry || "",
      size: size || "",
      website: website || "",
      description: description || "",
      linkedin: linkedin || "",
      facebook: facebook || "",
      instagram: instagram || "",
      isHiring: typeof isHiring === "boolean" ? isHiring : true,
      owner: req.userId,
    };

    const company = await Company.findOneAndUpdate(
      { owner: req.userId },
      data,
      { new: true, upsert: true }
    );

    res.json(company);
  } catch (err) {
    console.error("upsertMyCompany error:", err.message);
    res.status(500).json({ message: "Gabim serveri gjatë ruajtjes së kompanisë" });
  }
}
