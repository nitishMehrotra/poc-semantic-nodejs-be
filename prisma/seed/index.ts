import { PrismaClient, Prisma } from '@prisma/client';

import usersSeedJson from "./users.json";
import casesSeedJson from "./cases.json";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);
  const userData: Prisma.UserCreateInput[] = usersSeedJson;
  const caseData: Prisma.CaseCreateInput[] = casesSeedJson;

  for (const item of userData) {
    const user = await prisma.user.create({
      data: item,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  for (const item of caseData) {
    const userCase = await prisma.case.create({
      data: item,
    });
    console.log(`Created case with id: ${userCase.id} `);
  }

  for (const userItem of userData) {
    const patientCases = caseData.filter(item => item.patientId === userItem.id);
    const patientPhysicianMap = patientCases.map(caseCaseItem => {
      const physician = userData.filter(item => item.id === caseCaseItem.physicianId)[0];
      return { id: physician.id, name: physician.name };
    });
    for (const patientPhysicianItem of patientPhysicianMap) {
      if (!userItem.name || !patientPhysicianItem.name || !userItem.closestClinic) continue;
      const patitentPhysician = await prisma.patient.create({
        data: {
          patientUserId: userItem.id,
          name: userItem.name,
          closestClinic: userItem.closestClinic,
          physicianId: patientPhysicianItem.id,
          physicianName: patientPhysicianItem.name
        }
      });

      console.log(`Created patitentPhysician with id: ${patitentPhysician.id} `);
    }
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
