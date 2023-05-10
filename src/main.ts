import { Prisma, PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
const newStripeRef = new Stripe('key', { apiVersion: '2022-11-15', });

import express from 'express';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get('/users', async (req, res) => {
  var dbWhere;
  const queryParams = req.query;
  if (!queryParams || Object.keys(queryParams).length <= 0) { dbWhere = {}; }
  else { dbWhere = queryParams; }

  try {
    const data = await prisma.user.findMany({ where: dbWhere });
    res.json({ error: false, statusCode: 200, length: data.length, data: data });
  }
  catch (error) {
    res.json({ error: true, data: "Internal Server Error", statusCode: 500 });
  }
});

app.get('/users/:id/cases', async (req, res) => {
  const { id } = req.params;

  try {
    const data = await prisma.case.findMany({ where: { patientId: id } });
    res.json({ error: false, statusCode: 200, length: data.length, data: data });
  }
  catch (error) {
    res.json({ error: true, data: "Internal Server Error", statusCode: 500 });
  }


});

app.get('/users/:id/physicians', async (req, res) => {
  const { id } = req.params;
  try {
    const cases = await prisma.case.findMany({ where: { patientId: id } });
    const data = [];
    for (const item of cases) {
      const user = await prisma.user.findUnique({ where: { id: item.patientId } });
      data.push(user);
    }
    res.json({ error: false, statusCode: 200, length: data.length, data: data });
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
    const data = await prisma.case.findMany({ where: dbWhere });
    res.json({ error: false, statusCode: 200, length: data.length, data: data });
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
    const data = await prisma.patient.findMany({ where: dbWhere });
    res.json({ error: false, statusCode: 200, length: data.length, data: data });
  }
  catch (error) {
    res.json({ error: true, data: "Internal Server Error", statusCode: 500 });
  }
});

app.get('/patientPhysicians', async (req, res) => {
  var dbWhere;
  const queryParams = req.query;
  if (!queryParams || Object.keys(queryParams).length <= 0) { dbWhere = {}; }
  else { dbWhere = queryParams; }

  try {
    const patients = await prisma.patient.findMany({ where: dbWhere });
    const data = [];
    for (const item of patients) {
      const user = await prisma.user.findUnique({ where: { id: item.physicianId } });
      data.push(user);
    }
    res.json({ error: false, statusCode: 200, length: data.length, data: data });
  }
  catch (error) {
    res.json({ error: true, data: "Internal Server Error", statusCode: 500 });
  }
});


/**
 * Create a payment intent to charge a customer with x USD.
 * CustomerID and amount to be provided in request body.
 */

app.post('/create-payment-intent', async (req, res) => {
  const { body } = req.body;
  const { customerId, amount } = body;

  try {
    const intentRef = await newStripeRef.paymentIntents.create({
      amount: amount,
      automatic_payment_methods: { enabled: true },
      confirm: true,
      currency: 'usd',
      customer: customerId,
    });

    const data = [{ paymentIntentRef: intentRef, customerId: customerId }];
    res.json({ error: false, statusCode: 200, length: data.length, data: data });
  } catch (error) {
    res.json({ error: true, data: "Internal Server Error", statusCode: 500 });
  }


  /**
   * TODO @nitishmehrotra - Complete the onSuccess and OnFail handler. Uncomment the endpoiint post that
   */
  // app.post('/charge-payment-intent', async (req, res) => {
  //   const { body } = req;
  //   const { };
  //   try {
  //     const data = [{ message: "Payment has been charged" }];
  //     res.json({ error: false, statusCode: 200, length: data.length, data: data });
  //   } catch (error) {
  //     res.json({ error: true, data: "Internal Server Error", statusCode: 500 });
  //   }
  // });


});

const server = app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`),
);
