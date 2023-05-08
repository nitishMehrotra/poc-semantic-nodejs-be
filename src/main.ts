import { Prisma, PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get('/users', async (req, res) => {
  var dbWhere;
  const queryParams = req.query;
  if (!queryParams || Object.keys(queryParams).length <= 0) { console.log("In here 1"); dbWhere = {}; }
  else { console.log("In here 2"); dbWhere = queryParams; }

  try {
    const users = await prisma.user.findMany({ where: dbWhere });
    res.json(users);
  }
  catch (error) {
    res.json({ error: true, data: "Internal Server Error", statusCode: 500 });
  }
});

app.get('/users/:id/cases', async (req, res) => {
  const { id } = req.params;

  try {
    const cases = await prisma.case.findMany({ where: { patientId: id } });
    res.json(cases);
  }
  catch (error) {
    res.json({ error: true, data: "Internal Server Error", statusCode: 500 });
  }


});

app.get('/users/:id/physicians', async (req, res) => {
  const { id } = req.params;
  try {
    const cases = await prisma.case.findMany({ where: { patientId: id } });
    const users = [];
    for (const item of cases) {
      const user = await prisma.user.findUnique({ where: { id: item.patientId } });
      users.push(user);
    }
    res.json(users);
  }
  catch (error) {
    res.json({ error: true, data: "Internal Server Error", statusCode: 500 });
  }


});

app.get('/cases', async (req, res) => {
  var dbWhere;
  const queryParams = req.query;
  if (!queryParams || Object.keys(queryParams).length <= 0) { dbWhere = {}; }
  else { dbWhere = queryParams; }

  try {
    const cases = await prisma.case.findMany({ where: dbWhere });
    res.json(cases);
  }
  catch (error) {
    res.json({ error: true, data: "Internal Server Error", statusCode: 500 });
  }
});

app.get('/patients', async (req, res) => {
  var dbWhere;
  const queryParams = req.query;
  if (!queryParams || Object.keys(queryParams).length <= 0) { dbWhere = {}; }
  else { dbWhere = queryParams; }

  try {
    const cases = await prisma.patient.findMany({ where: dbWhere });
    res.json(cases);
  }
  catch (error) {
    res.json({ error: true, data: "Internal Server Error", statusCode: 500 });
  }


});

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
);
