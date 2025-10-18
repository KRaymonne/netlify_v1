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
        const contracts = await prisma.contract.findMany({
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
        return json(200, contracts);
      }
      case 'POST': {
        if (!event.body) {
          return json(400, { error: 'Missing request body' });
        }
        const payload = JSON.parse(event.body);
        const {
          userId,
          contractType,
          startDate,
          endDate,
          post,
          department,
          unit,
          grossSalary,
          netSalary,
          currency,
          contractFile
        } = payload || {};

        // Basic validation
        const required = {
          userId,
          contractType,
          startDate,
          post,
          department,
          grossSalary,
          netSalary,
          currency
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

        const created = await prisma.contract.create({
          data: {
            userId: Number(userId),
            contractType,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            post,
            department,
            unit: unit || null,
            grossSalary: Number(grossSalary),
            netSalary: Number(netSalary),
            currency,
            contractFile: contractFile || null
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
    console.error('Contracts function error', error);
    return json(500, { error: 'Internal Server Error' });
  }
};
