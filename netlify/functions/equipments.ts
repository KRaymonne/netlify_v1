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
        const equipments = await prisma.equipment.findMany({
          orderBy: { createdAt: 'desc' }
        });
        return json(200, equipments);
      }
      case 'POST': {
        if (!event.body) {
          return json(400, { error: 'Missing request body' });
        }
        const payload = JSON.parse(event.body);
        const { name, description, category, brand, model, serialNumber, purchaseDate, purchasePrice, status, userId } = payload || {};
        
        if (!name || !category) {
          return json(400, { error: 'Missing required fields' });
        }

        const created = await prisma.equipment.create({
          data: {
            name,
            description,
            category,
            brand,
            model,
            serialNumber,
            purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
            purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
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

        const updated = await prisma.equipment.update({
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

        await prisma.equipment.delete({
          where: { id: parseInt(id) },
        });
        return json(200, { message: 'Equipment deleted successfully' });
      }
      default:
        return json(405, { error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Equipments function error', error);
    return json(500, { error: 'Internal Server Error' });
  }
};
