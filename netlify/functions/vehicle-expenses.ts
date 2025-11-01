import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const handler = async (event: any) => {
  const { httpMethod, body, queryStringParameters } = event;

  try {
    switch (httpMethod) {
      case 'GET':
        const { search, page = '1', limit = '10', statut, vehicleId, InserterCountry } = queryStringParameters || {};
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const where: any = {};
        if (search) {
          where.OR = [
            { description: { contains: search } },
            { code: { contains: search } },
          ];
        }
        if (statut && statut !== 'all') {
          where.statut = statut;
        }
        if (vehicleId) {
          where.vehicleId = parseInt(vehicleId);
        }
        if (InserterCountry) {
          where.InserterCountry = InserterCountry;
        }

        const [expenses, total] = await Promise.all([
          prisma.vehicleexpenses.findMany({
            where,
            skip,
            take: limitNum,
            orderBy: { createdAt: 'desc' },
            include: {
              vehicle: {
                select: {
                  vehicleId: true,
                  licensePlate: true,
                  brand: true,
                  model: true,
                },
              },
            },
          }),
          prisma.vehicleexpenses.count({ where }),
        ]);

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            expenses,
            pagination: {
              page: pageNum,
              limit: limitNum,
              total,
              totalPages: Math.ceil(total / limitNum),
            },
          }),
        };

      case 'POST':
        const postData = JSON.parse(body);
        if (postData && postData.Inserteridentity != null) {
          postData.Inserteridentity = String(postData.Inserteridentity);
        }
        
        const requiredFields = ['vehicleId', 'date', 'description', 'amount', 'statut', 'devise'];
        for (const field of requiredFields) {
          if (!postData[field]) {
            return {
              statusCode: 400,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
              body: JSON.stringify({ error: `Field ${field} is required` }),
            };
          }
        }

        const newExpense = await prisma.vehicleexpenses.create({
          data: {
            vehicleId: parseInt(postData.vehicleId),
            date: new Date(postData.date),
            nextDate: postData.nextDate ? new Date(postData.nextDate) : null,
            code: postData.code || null,
            description: postData.description,
            distance: parseInt(postData.distance) || 0,
            amount: parseFloat(postData.amount),
            devise: postData.devise,
            statut: postData.statut,
            fichierJoint: postData.fichierJoint || null,
            Inserteridentity: postData.Inserteridentity || null,
            InserterCountry: postData.InserterCountry || null,
          },
        });

        return {
          statusCode: 201,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(newExpense),
        };

      case 'PUT':
        const updateData = JSON.parse(body);
        const { id: updateId } = queryStringParameters || {};

        if (!updateId) {
          return {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Expense ID is required' }),
          };
        }

        if (updateData && updateData.Inserteridentity != null) {
          updateData.Inserteridentity = String(updateData.Inserteridentity);
        }
        const updatedExpense = await prisma.vehicleexpenses.update({
          where: { expenseId: parseInt(updateId) },
          data: {
            ...updateData,
            vehicleId: updateData.vehicleId ? parseInt(updateData.vehicleId) : undefined,
            date: updateData.date ? new Date(updateData.date) : undefined,
            nextDate: updateData.nextDate ? new Date(updateData.nextDate) : undefined,
            distance: updateData.distance ? parseInt(updateData.distance) : undefined,
            amount: updateData.amount ? parseFloat(updateData.amount) : undefined,
          },
        });

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(updatedExpense),
        };

      case 'DELETE':
        const { id: deleteId } = queryStringParameters || {};

        if (!deleteId) {
          return {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Expense ID is required' }),
          };
        }

        await prisma.vehicleexpenses.delete({
          where: { expenseId: parseInt(deleteId) },
        });

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ message: 'Expense deleted successfully' }),
        };

      default:
        return {
          statusCode: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error: any) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  } finally {
    await prisma.$disconnect();
  }
};

