import { PrismaClient } from '@prisma/client';
import type { Handler } from '@netlify/functions';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

const json = (statusCode: number, data: unknown) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  },
  body: JSON.stringify(data),
});

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, { ok: true });
  }

  try {
    switch (event.httpMethod) {
      case 'GET': {
        const medicalRecords = await prisma.medicalRecord.findMany({
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                employeeNumber: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
        return json(200, medicalRecords);
      }
      case 'POST': {
        if (!event.body) {
          return json(400, { error: 'Missing request body' });
        }
        const payload = JSON.parse(event.body);
        const {
          userId,
          visitDate,
          description,
          diagnosis,
          testsPerformed,
          testResults,
          prescribedAction,
          notes,
          nextVisitDate,
          medicalFile
        } = payload || {};

        // Basic validation
        const required = {
          userId,
          visitDate
        } as Record<string, unknown>;

        const missing = Object.entries(required)
          .filter(([, v]) => v === undefined || v === null || v === '')
          .map(([k]) => k);
        if (missing.length > 0) {
          return json(400, { error: `Missing fields: ${missing.join(', ')}` });
        }

        // Validate user exists
        const user = await prisma.user.findUnique({
          where: { id: Number(userId) }
        });
        if (!user) {
          return json(400, { error: 'User not found' });
        }

        const created = await prisma.medicalRecord.create({
          data: {
            userId: Number(userId),
            visitDate: new Date(visitDate),
            description: description || null,
            diagnosis: diagnosis || null,
            testsPerformed: testsPerformed || null,
            testResults: testResults || null,
            prescribedAction: prescribedAction || null,
            notes: notes || null,
            nextVisitDate: nextVisitDate ? new Date(nextVisitDate) : null,
            medicalFile: medicalFile || null
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                employeeNumber: true,
                email: true
              }
            }
          }
        });
        return json(201, created);
      }
      default:
        return json(405, { error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Medical records function error', error);
    return json(500, { error: 'Internal Server Error' });
  }
};
