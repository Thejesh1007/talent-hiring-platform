const prisma = require("../../prisma/client");
const asyncHandler = require("../middlewares/asyncHandler");

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

exports.getMyJobs = asyncHandler(async (req, res) => {
  const recruiterId = req.user.id;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jobs = await prisma.job.findMany({
    where: { recruiterId },
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  res.json({
    success: true,
    data: jobs,
  });
});

exports.updateJob = asyncHandler(async (req, res) => {
  const recruiterId = req.user.id;
  const jobId = Number(req.params.id);

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job || job.recruiterId !== recruiterId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
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

exports.deleteJob = asyncHandler(async (req, res) => {
  const recruiterId = req.user.id;
  const jobId = Number(req.params.id);

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job || job.recruiterId !== recruiterId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  await prisma.job.delete({
    where: { id: jobId },
  });

  res.json({
    success: true,
    message: "Job deleted successfully",
  });
});
