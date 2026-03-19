const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding TalentHire database...");

  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const recruiterPassword = await bcrypt.hash("Recruiter@123", 10);
  const candidatePassword = await bcrypt.hash("Candidate@123", 10);

  // ── ADMIN ──
  const admin = await prisma.user.upsert({
    where: { email: "admin@talenthire.com" },
    update: {},
    create: {
      email: "admin@talenthire.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin created:", admin.email);

  // ── RECRUITER ──
  const recruiter = await prisma.user.upsert({
    where: { email: "recruiter@talenthire.com" },
    update: {},
    create: {
      email: "recruiter@talenthire.com",
      password: recruiterPassword,
      role: "RECRUITER",
    },
  });
  console.log("Recruiter created:", recruiter.email);

  // ── CANDIDATE ──
  const candidate = await prisma.user.upsert({
    where: { email: "candidate@talenthire.com" },
    update: {},
    create: {
      email: "candidate@talenthire.com",
      password: candidatePassword,
      role: "CANDIDATE",
    },
  });
  console.log("Candidate created:", candidate.email);

  // ── JOBS ──
  const jobs = [
    {
      title: "Frontend Developer",
      description: "Build responsive UIs using React and Tailwind CSS. 1+ year experience required.",
      location: "Bangalore",
      salary: 80000,
      recruiterId: recruiter.id,
    },
    {
      title: "Backend Engineer",
      description: "Develop REST APIs using Node.js, Express and PostgreSQL. Strong JS skills needed.",
      location: "Remote",
      salary: 120000,
      recruiterId: recruiter.id,
    },
    {
      title: "Full Stack Developer",
      description: "Work on both frontend and backend. React + Node.js + Prisma stack.",
      location: "Hyderabad",
      salary: 100000,
      recruiterId: recruiter.id,
    },
    {
      title: "Data Engineer",
      description: "Build ETL pipelines using Python, Spark and GCP BigQuery.",
      location: "Pune",
      salary: 130000,
      recruiterId: recruiter.id,
    },
    {
      title: "DevOps Engineer",
      description: "Manage CI/CD pipelines, Docker containers and cloud infrastructure on AWS.",
      location: "Remote",
      salary: 140000,
      recruiterId: recruiter.id,
    },
    {
      title: "UI/UX Designer",
      description: "Design intuitive user interfaces and experiences using Figma.",
      location: "Mumbai",
      salary: 70000,
      recruiterId: recruiter.id,
    },
  ];

  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }
  console.log(`${jobs.length} jobs created.`);

  console.log("\nSeed complete!");
  console.log("─────────────────────────────────");
  console.log("Admin:     admin@talenthire.com     / Admin@123");
  console.log("Recruiter: recruiter@talenthire.com / Recruiter@123");
  console.log("Candidate: candidate@talenthire.com / Candidate@123");
  console.log("─────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });