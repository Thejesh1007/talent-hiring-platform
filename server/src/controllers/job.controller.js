const prisma = require("../../prisma/client");
const asyncHandler = require("../middlewares/asyncHandler");

// ================= CREATE JOB =================
exports.createJob = asyncHandler(async (req, res) => {
  const recruiterId = req.user.id;
  const { title, description, location, salary } = req.body;

  const job = await prisma.job.create({
    data: {
      title,
      description,
      location,
      salary: Number(salary),
      recruiterId,
    },
  });

  res.status(201).json({
    success: true,
    data: job,
  });
});

// ================= GET MY JOBS =================
exports.getMyJobs = asyncHandler(async (req, res) => {
  const recruiterId = req.user.id;

  const jobs = await prisma.job.findMany({
    where: { recruiterId },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    success: true,
    data: jobs,
  });
});

// ================= UPDATE JOB =================
exports.updateJob = asyncHandler(async (req, res) => {
  const recruiterId = req.user.id;
  const jobId = Number(req.params.id);

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job || job.recruiterId !== recruiterId) {
    return res.status(403).json({ message: "Access denied" });
  }

  const updatedJob = await prisma.job.update({
    where: { id: jobId },
    data: req.body,
  });

  res.json({
    success: true,
    data: updatedJob,
  });
});

// ================= DELETE JOB =================
exports.deleteJob = asyncHandler(async (req, res) => {
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

  res.json({
    success: true,
    message: "Job deleted successfully",
  });
});

// ================= GET APPLICATIONS FOR MY JOBS =================
exports.getApplicationsForMyJobs = asyncHandler(async (req, res) => {
  const recruiterId = req.user.id;

  const applications = await prisma.application.findMany({
    where: {
      job: {
        recruiterId: recruiterId,
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

  res.json({
    success: true,
    data: applications,
  });
});
