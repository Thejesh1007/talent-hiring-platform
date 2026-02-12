const prisma = require("../../prisma/client");

/**
 * Recruiter creates a job
 */
exports.createJob = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { title, description, location, salary } = req.body;

    // Validation
    if (!title || !description || !location || salary == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        location,
        salary: Number(salary), // 🔑 critical fix
        recruiterId,
      },
    });

    res.status(201).json(job);
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ message: "Failed to create job" });
  }
};


/**
 * Recruiter views only their jobs
 */
exports.getMyJobs = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const jobs = await prisma.job.findMany({
      where: { recruiterId },
      orderBy: { createdAt: "desc" },
    });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

/**
 * Recruiter updates ONLY their job
 */
exports.updateJob = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobId = Number(req.params.id);
    const { title, description, location } = req.body;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.recruiterId !== recruiterId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { title, description, location },
    });

    res.json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update job" });
  }
};

/**
 * Recruiter deletes ONLY their job
 */
exports.deleteJob = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobId = Number(req.params.id);

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.recruiterId !== recruiterId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await prisma.job.delete({
      where: { id: jobId },
    });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete job" });
  }
};
