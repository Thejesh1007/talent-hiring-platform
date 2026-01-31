const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const prisma = require("./prisma/client");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   Helper
========================= */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* =========================
   Auth Middleware
========================= */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

/* =========================
   Auth Routes
========================= */
app.post(
  "/api/signup",
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    res.status(201).json({
      message: "Signup successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  })
);

app.post(
  "/api/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  })
);

/* =========================
   Recruiter Job APIs
========================= */
app.post(
  "/api/jobs",
  authenticateToken,
  authorizeRoles("RECRUITER"),
  asyncHandler(async (req, res) => {
    const { title, description, location, salary } = req.body;

    if (!title || !description || !location || !salary) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        location,
        salary,
        recruiterId: req.user.id,
      },
    });

    res.status(201).json({ message: "Job created", job });
  })
);

app.get(
  "/api/jobs/my",
  authenticateToken,
  authorizeRoles("RECRUITER"),
  asyncHandler(async (req, res) => {
    const jobs = await prisma.job.findMany({
      where: { recruiterId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({ jobs });
  })
);

/* =========================
   Public Jobs
========================= */
app.get(
  "/api/jobs",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const jobs = await prisma.job.findMany({
      include: {
        recruiter: { select: { id: true, name: true } },
      },
    });

    res.json({ jobs });
  })
);

/* =========================
   Candidate Apply to Job
========================= */
app.post(
  "/api/jobs/:jobId/apply",
  authenticateToken,
  authorizeRoles("CANDIDATE"),
  asyncHandler(async (req, res) => {
    const jobId = Number(req.params.jobId);

    if (isNaN(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    try {
      const application = await prisma.application.create({
        data: {
          jobId,
          candidateId: req.user.id,
        },
      });

      res.status(201).json({
        message: "Applied successfully",
        application,
      });
    } catch (error) {
      if (error.code === "P2002") {
        return res
          .status(409)
          .json({ message: "You already applied to this job" });
      }
      throw error;
    }
  })
);

/* =========================
   Recruiter View Applications (5.4)
========================= */
app.get(
  "/api/recruiter/applications",
  authenticateToken,
  authorizeRoles("RECRUITER"),
  asyncHandler(async (req, res) => {
    const applications = await prisma.application.findMany({
      where: {
        job: {
          recruiterId: req.user.id,
        },
      },
      include: {
        candidate: {
          select: { id: true, name: true, email: true },
        },
        job: {
          select: { id: true, title: true, location: true },
        },
      },
      orderBy: { appliedAt: "desc" },
    });

    res.json({ applications });
  })
);

/* =========================
   Health & Error Handling
========================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend running" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

/* =========================
   Server
========================= */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
