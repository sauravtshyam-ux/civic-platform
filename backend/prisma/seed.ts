import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed demo bills that satisfy REQUIRED fields:
  // externalId, title, summary, status, level, billNumber
  await prisma.bill.createMany({
    data: [
      {
        externalId: "demo:federal:hr-1001",
        title: "Clean Energy Infrastructure Act",
        summary:
          "Invests in renewable energy infrastructure, grid modernization, and community resilience projects.",
        status: "In Committee",
        level: "federal",
        state: null,
        chamber: "house",
        billNumber: "HR 1001",
        sponsor: "Rep. Jordan Lee",
        fullTextUrl: "https://example.com/bills/hr-1001",
        lastActionDate: new Date(),
      },
      {
        externalId: "demo:federal:s-204",
        title: "Student Loan Interest Cap Act",
        summary:
          "Caps federal student loan interest rates and expands income-based repayment options.",
        status: "Introduced",
        level: "federal",
        state: null,
        chamber: "senate",
        billNumber: "S 204",
        sponsor: "Sen. Avery Kim",
        fullTextUrl: "https://example.com/bills/s-204",
        introducedDate: new Date(),
        lastActionDate: new Date(),
      },
      {
        externalId: "demo:state:ga-hb-88",
        title: "Georgia Road Safety & Vision Zero Pilot",
        summary:
          "Creates a statewide pilot program to reduce traffic fatalities through safer street design and data reporting.",
        status: "In Committee",
        level: "state",
        state: "GA",
        chamber: "house",
        billNumber: "HB 88",
        sponsor: "Rep. Malik Johnson",
        fullTextUrl: "https://example.com/bills/ga-hb-88",
        lastActionDate: new Date(),
      },
      {
        externalId: "demo:state:ga-sb-12",
        title: "Georgia Public Transit Modernization Act",
        summary:
          "Expands funding mechanisms for public transit projects and regional service partnerships.",
        status: "Floor Vote Scheduled",
        level: "state",
        state: "GA",
        chamber: "senate",
        billNumber: "SB 12",
        sponsor: "Sen. Taylor Brooks",
        fullTextUrl: "https://example.com/bills/ga-sb-12",
        lastActionDate: new Date(),
      },
      {
        externalId: "demo:federal:hr-455",
        title: "Cybersecurity Modernization for Critical Infrastructure",
        summary:
          "Updates baseline cybersecurity requirements for critical infrastructure operators and improves incident reporting.",
        status: "Passed House",
        level: "federal",
        state: null,
        chamber: "house",
        billNumber: "HR 455",
        sponsor: "Rep. Sofia Martinez",
        fullTextUrl: "https://example.com/bills/hr-455",
        lastActionDate: new Date(),
      },
    ],
    skipDuplicates: true, // prevents re-inserting if you run seed again
  });

  console.log("✅ Seeded demo bills into the database.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
