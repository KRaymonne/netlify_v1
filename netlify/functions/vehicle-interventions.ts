import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const handler = async (event: any) => {
  const { httpMethod, body, queryStringParameters } = event;

  try {
    switch (httpMethod) {
      case 'GET':
        const { search, page = '1', limit = '10', status, vehicleId, garageId, InserterCountry } = queryStringParameters || {};
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const where: any = {};
        if (search) {
          where.OR = [
            { description: { contains: search } },
            { technician: { contains: search } },
          ];
        }
        if (status && status !== 'all') {
          where.status = status;
        }
        if (vehicleId) {
          where.vehicleId = parseInt(vehicleId);
        }
        if (garageId) {
          where.garageId = parseInt(garageId);
        }
        if (InserterCountry) {
          where.InserterCountry = InserterCountry;
        }

        const [interventions, total] = await Promise.all([
          prisma.vehicleinterventions.findMany({
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
              garage: {
                select: {
                  garageId: true,
                  name: true,
                  address: true,
                },
              },
            },
          }),
          prisma.vehicleinterventions.count({ where }),
        ]);

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            interventions,
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
        
        const requiredFields = ['vehicleId', 'garageId', 'interventionDate', 'type', 'description', 'cost', 'technician', 'status', 'devise'];
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

        const newIntervention = await prisma.vehicleinterventions.create({
          data: {
            vehicleId: parseInt(postData.vehicleId),
            garageId: parseInt(postData.garageId),
            interventionDate: new Date(postData.interventionDate),
            type: postData.type,
            description: postData.description,
            cost: parseFloat(postData.cost),
            technician: postData.technician,
            devise: postData.devise,
            status: postData.status,
            nextInterventionDate: postData.nextInterventionDate ? new Date(postData.nextInterventionDate) : null,
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
          body: JSON.stringify(newIntervention),
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
            body: JSON.stringify({ error: 'Intervention ID is required' }),
          };
        }

        if (updateData && updateData.Inserteridentity != null) {
          updateData.Inserteridentity = String(updateData.Inserteridentity);
        }
        const updatedIntervention = await prisma.vehicleinterventions.update({
          where: { interventionId: parseInt(updateId) },
          data: {
            ...updateData,
            vehicleId: updateData.vehicleId ? parseInt(updateData.vehicleId) : undefined,
            garageId: updateData.garageId ? parseInt(updateData.garageId) : undefined,
            interventionDate: updateData.interventionDate ? new Date(updateData.interventionDate) : undefined,
            cost: updateData.cost ? parseFloat(updateData.cost) : undefined,
            nextInterventionDate: updateData.nextInterventionDate ? new Date(updateData.nextInterventionDate) : undefined,
          },
        });

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(updatedIntervention),
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
            body: JSON.stringify({ error: 'Intervention ID is required' }),
          };
        }

        await prisma.vehicleinterventions.delete({
          where: { interventionId: parseInt(deleteId) },
        });

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ message: 'Intervention deleted successfully' }),
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

