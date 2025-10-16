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
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
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
        const cashRegisters = await prisma.cashRegister.findMany({
          orderBy: { createdAt: 'desc' }
        });
        return json(200, cashRegisters);
      }
      case 'POST': {
        if (!event.body) {
          return json(400, { error: 'Missing request body' });
        }
        const payload = JSON.parse(event.body);
        const { name, location, initialAmount, currentAmount, currency, status, userId } = payload || {};
        
        if (!name || initialAmount === undefined || currentAmount === undefined || !currency) {
          return json(400, { error: 'Missing required fields' });
        }

        const created = await prisma.cashRegister.create({
          data: {
            name,
            location,
            initialAmount: parseFloat(initialAmount),
            currentAmount: parseFloat(currentAmount),
            currency,
            status: status || 'active',
            userId: userId || 1, // Default user for now
          },
        });
        return json(201, created);
      }
      case 'PUT': {
        if (!event.body) {
          return json(400, { error: 'Missing request body' });
        }
        const payload = JSON.parse(event.body);
        const { id, ...updateData } = payload;
        
        if (!id) {
          return json(400, { error: 'Missing id for update' });
        }

        const updated = await prisma.cashRegister.update({
          where: { id: parseInt(id) },
          data: updateData,
        });
        return json(200, updated);
      }
      case 'DELETE': {
        const { id } = event.queryStringParameters || {};
        
        if (!id) {
          return json(400, { error: 'Missing id for deletion' });
        }

        await prisma.cashRegister.delete({
          where: { id: parseInt(id) },
        });
        return json(200, { message: 'Cash register deleted successfully' });
      }
      default:
        return json(405, { error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Cash registers function error', error);
    return json(500, { error: 'Internal Server Error' });
  }
};
