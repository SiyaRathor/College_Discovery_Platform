import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ 
  connectionString: process.env.DATABASE_URL! 
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashed = await bcrypt.hash("password123", 10);
  await prisma.user.create({
    data: { name: "Rahul Sharma", email: "rahul@demo.com", password: hashed },
  });

  const colleges = [
    {
      name: "IIT Bombay",
      city: "Mumbai",
      state: "Maharashtra",
      location: "Powai, Mumbai - 400076",
      type: "government",
      stream: "engineering",
      fees: 230000,
      rating: 4.8,
      totalReviews: 1240,
      naacGrade: "A++",
      nirfRank: 3,
      exams: [
        { examName: "JEE Advanced", cutoffRank: 1, closingRank: 2500 },
        { examName: "GATE", cutoffRank: 1, closingRank: 500 },
      ],
      courses: [
        { name: "B.Tech Computer Science", duration: "4 Years", totalFees: 920000 },
        { name: "B.Tech Electrical Engineering", duration: "4 Years", totalFees: 920000 },
        { name: "M.Tech", duration: "2 Years", totalFees: 480000 },
      ],
      placement: {
        year: 2024, averagePackage: 2800000, highestPackage: 25000000,
        placementRate: 95, topRecruiters: "Google,Microsoft,Goldman Sachs,Amazon,Uber",
      },
    },
    {
      name: "IIT Delhi",
      city: "New Delhi",
      state: "Delhi",
      location: "Hauz Khas, New Delhi - 110016",
      type: "government",
      stream: "engineering",
      fees: 220000,
      rating: 4.7,
      totalReviews: 980,
      naacGrade: "A++",
      nirfRank: 2,
      exams: [
        { examName: "JEE Advanced", cutoffRank: 1, closingRank: 2000 },
        { examName: "GATE", cutoffRank: 1, closingRank: 400 },
      ],
      courses: [
        { name: "B.Tech Computer Science", duration: "4 Years", totalFees: 880000 },
        { name: "B.Tech Mechanical Engineering", duration: "4 Years", totalFees: 880000 },
      ],
      placement: {
        year: 2024, averagePackage: 2600000, highestPackage: 22000000,
        placementRate: 93, topRecruiters: "Google,DE Shaw,Qualcomm,Samsung,Flipkart",
      },
    },
    {
      name: "NIT Trichy",
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      location: "Tanjore Main Road, Tiruchirappalli - 620015",
      type: "government",
      stream: "engineering",
      fees: 160000,
      rating: 4.4,
      totalReviews: 720,
      naacGrade: "A++",
      nirfRank: 8,
      exams: [
        { examName: "JEE Main", cutoffRank: 1000, closingRank: 18000 },
      ],
      courses: [
        { name: "B.Tech Computer Science", duration: "4 Years", totalFees: 640000 },
        { name: "B.Tech Civil Engineering", duration: "4 Years", totalFees: 640000 },
      ],
      placement: {
        year: 2024, averagePackage: 1400000, highestPackage: 8000000,
        placementRate: 88, topRecruiters: "TCS,Infosys,Wipro,L&T,Cognizant",
      },
    },
    {
      name: "BITS Pilani",
      city: "Pilani",
      state: "Rajasthan",
      location: "Vidya Vihar, Pilani - 333031",
      type: "deemed",
      stream: "engineering",
      fees: 580000,
      rating: 4.6,
      totalReviews: 860,
      naacGrade: "A",
      nirfRank: 26,
      exams: [
        { examName: "BITSAT", cutoffRank: 1, closingRank: 25000 },
      ],
      courses: [
        { name: "B.E. Computer Science", duration: "4 Years", totalFees: 2320000 },
        { name: "B.Pharma", duration: "4 Years", totalFees: 2320000 },
      ],
      placement: {
        year: 2024, averagePackage: 1900000, highestPackage: 18000000,
        placementRate: 91, topRecruiters: "Google,Microsoft,Goldman Sachs,Adobe,Salesforce",
      },
    },
    {
      name: "VIT Vellore",
      city: "Vellore",
      state: "Tamil Nadu",
      location: "Katpadi Road, Vellore - 632014",
      type: "private",
      stream: "engineering",
      fees: 220000,
      rating: 4.0,
      totalReviews: 1580,
      naacGrade: "A++",
      nirfRank: 11,
      exams: [
        { examName: "VITEEE", cutoffRank: 1, closingRank: 200000 },
        { examName: "JEE Main", cutoffRank: 50000, closingRank: 500000 },
      ],
      courses: [
        { name: "B.Tech Computer Science", duration: "4 Years", totalFees: 880000 },
        { name: "B.Tech AI & ML", duration: "4 Years", totalFees: 960000 },
      ],
      placement: {
        year: 2024, averagePackage: 900000, highestPackage: 6000000,
        placementRate: 82, topRecruiters: "TCS,Wipro,Infosys,Capgemini,HCL",
      },
    },
    {
      name: "IIM Ahmedabad",
      city: "Ahmedabad",
      state: "Gujarat",
      location: "Vastrapur, Ahmedabad - 380015",
      type: "government",
      stream: "management",
      fees: 2400000,
      rating: 4.9,
      totalReviews: 640,
      naacGrade: "A++",
      nirfRank: 1,
      exams: [
        { examName: "CAT", cutoffRank: 1, closingRank: 300 },
      ],
      courses: [
        { name: "MBA (PGP)", duration: "2 Years", totalFees: 2400000 },
      ],
      placement: {
        year: 2024, averagePackage: 3500000, highestPackage: 80000000,
        placementRate: 100, topRecruiters: "McKinsey,BCG,Bain,Goldman Sachs,Amazon",
      },
    },
    {
      name: "AIIMS Delhi",
      city: "New Delhi",
      state: "Delhi",
      location: "Ansari Nagar, New Delhi - 110029",
      type: "government",
      stream: "medical",
      fees: 6000,
      rating: 4.9,
      totalReviews: 520,
      naacGrade: "A++",
      nirfRank: 1,
      exams: [
        { examName: "NEET", cutoffRank: 1, closingRank: 200 },
      ],
      courses: [
        { name: "MBBS", duration: "5.5 Years", totalFees: 33000 },
      ],
      placement: {
        year: 2024, averagePackage: 1800000, highestPackage: 8000000,
        placementRate: 100, topRecruiters: "AIIMS,Apollo,Fortis,Max Hospital",
      },
    },
  ];

  for (const data of colleges) {
    const { exams, courses, placement, ...collegeData } = data;
    const college = await prisma.college.create({ data: collegeData });

    await prisma.course.createMany({
      data: courses.map((c) => ({ ...c, collegeId: college.id })),
    });

    await prisma.placement.create({
      data: { ...placement, collegeId: college.id },
    });

    await prisma.collegeExam.createMany({
      data: exams.map((e) => ({ ...e, collegeId: college.id })),
    });
  }

  console.log("Seed done successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());