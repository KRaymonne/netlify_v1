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
        const affectations = await prisma.affectation.findMany({
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
        return json(200, affectations);
      }
      case 'POST': {
        if (!event.body) {
          return json(400, { error: 'Missing request body' });
        }
        const payload = JSON.parse(event.body);
        const {
          userId,
          workLocation,
          site,
          affectationtype,
          description,
          startDate,
          endDate,
          attached_file
        } = payload || {};

        // Basic validation
        const required = {
          userId,
          workLocation,
          site,
          affectationtype,
          startDate
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

        const created = await prisma.affectation.create({
          data: {
            userId: Number(userId),
            workLocation,
            site,
            affectationtype,
            description: description || null,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            attached_file: attached_file || null
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
    console.error('Affectations function error', error);
    return json(500, { error: 'Internal Server Error' });
  }
};
