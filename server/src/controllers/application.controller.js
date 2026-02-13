const prisma = require("../../prisma/client");
const asyncHandler = require("../middlewares/asyncHandler");

exports.applyToJob = asyncHandler(async (req, res) => {
  const candidateId = req.user.id;
  const jobId = Number(req.params.jobId);

  const existing = await prisma.application.findUnique({
    where: {
      candidateId_jobId: {
        candidateId,
        jobId,
      },
    },
  });

  if (existing) {
    const error = new Error("Already applied to this job");
    error.statusCode = 400;
    throw error;
  }

  const application = await prisma.application.create({
    data: {
      candidateId,
      jobId,
    },
  });

  res.status(201).json({
    success: true,
    data: application,
  });
});

exports.getApplicationsForRecruiter = asyncHandler(async (req, res) => {
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
  });

  res.json({
    success: true,
    data: applications,
  });
});
