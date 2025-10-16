import { PrismaClient } from '@prisma/client';
import type { Handler } from '@netlify/functions';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Fonction utilitaire pour les réponses JSON
const json = (statusCode: number, data: unknown) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
  body: JSON.stringify(data),
});

export const handler: Handler = async (event) => {
  // Gestion CORS (prévol OPTIONS)
  if (event.httpMethod === 'OPTIONS') {
    return json(200, { ok: true });
  }

  try {
    switch (event.httpMethod) {
      case 'GET': {
        const { status, type, priority } = event.queryStringParameters || {};

        const where: Record<string, any> = {};

        if (status && status !== 'all') where.status = status;
        if (type) where.type = type;
        if (priority) where.priority = priority;

        const alerts = await prisma.alert.findMany({
          where,
          orderBy: [
            { dueDate: 'asc' },
            { createdAt: 'desc' },
          ],
        });

        return json(200, alerts);
      }

      case 'POST': {
        if (!event.body) return json(400, { error: 'Missing request body' });

        const payload = JSON.parse(event.body);
        const { title, description, dueDate, priority, type, status } = payload;

        // Validation
        if (!title) return json(400, { error: 'title is required' });
        if (!dueDate) return json(400, { error: 'dueDate is required' });
        if (!type) return json(400, { error: 'type is required' });

        const created = await prisma.alert.create({
          data: {
            title,
            description: description ?? null,
            dueDate: new Date(dueDate),
            priority: priority ?? 'medium',
            type,
            status: status ?? 'pending',
          },
        });

        return json(201, created);
      }

      case 'PUT': {
        if (!event.body) return json(400, { error: 'Missing request body' });

        const payload = JSON.parse(event.body);
        const { id, ...updateData } = payload;

        if (!id) return json(400, { error: 'id is required' });

        if (updateData.dueDate) {
          updateData.dueDate = new Date(updateData.dueDate);
        }

        const updated = await prisma.alert.update({
          where: { id: Number(id) },
          data: {
            ...updateData,
            updatedAt: new Date(),
          },
        });

        return json(200, updated);
      }

      case 'DELETE': {
        const id = event.queryStringParameters?.id || event.path.split('/').pop();
        if (!id) return json(400, { error: 'Alert ID is required' });

        await prisma.alert.delete({
          where: { id: Number(id) },
        });

        return json(200, { message: 'Alert deleted successfully' });
      }

      default:
        return json(405, { error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Alerts function error:', error);

    // Gestion d’erreurs Prisma
    if (error.code === 'P2025') {
      return json(404, { error: 'Alert not found' });
    }

    if (error.code === 'P2002') {
      return json(409, { error: 'Duplicate alert entry' });
    }

    return json(500, { error: 'Internal Server Error' });
  }
};
