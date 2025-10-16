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
        const invoices = await prisma.invoice.findMany({
          orderBy: { createdAt: 'desc' }
        });
        return json(200, invoices);
      }
      case 'POST': {
        if (!event.body) {
          return json(400, { error: 'Missing request body' });
        }
        const payload = JSON.parse(event.body);
        const { invoiceNumber, clientName, amount, currency, issueDate, dueDate, status, description, userId } = payload || {};
        
        if (!invoiceNumber || !clientName || amount === undefined || !currency || !issueDate || !dueDate) {
          return json(400, { error: 'Missing required fields' });
        }

        const created = await prisma.invoice.create({
          data: {
            invoiceNumber,
            clientName,
            amount: parseFloat(amount),
            currency,
            issueDate: new Date(issueDate),
            dueDate: new Date(dueDate),
            status: status || 'pending',
            description,
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

        const updated = await prisma.invoice.update({
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

        await prisma.invoice.delete({
          where: { id: parseInt(id) },
        });
        return json(200, { message: 'Invoice deleted successfully' });
      }
      default:
        return json(405, { error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Invoices function error', error);
    return json(500, { error: 'Internal Server Error' });
  }
};
