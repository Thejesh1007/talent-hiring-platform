const prisma = require("../../prisma/client");

/**
 * Candidate applies to a job
 */
exports.applyToJob = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const jobId = Number(req.params.jobId);

    // Check job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prevent duplicate application
    const existing = await prisma.application.findUnique({
      where: {
        candidateId_jobId: {
          candidateId,
          jobId,
        },
      },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You already applied to this job" });
    }

    const application = await prisma.application.create({
      data: {
        candidateId,
        jobId,
      },
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Apply error:", error);
    res.status(500).json({ message: "Failed to apply" });
  }
};

/**
 * Recruiter views applications for their own jobs only
 */
exports.getApplicationsForRecruiter = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const applications = await prisma.application.findMany({
      where: {
        job: {
          recruiterId,
        },
      },
      include: {
        candidate: {
          select: {
            id: true,
            email: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    });

    res.json(applications);
  } catch (error) {
    console.error("Fetch applications error:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};
