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
        const users = await prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            employeeNumber: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            status: true,
            department: true,
            workcountry: true,
            hireDate: true,
            createdAt: true,
          }
        });
        return json(200, users);
      }
      case 'POST': {
        if (!event.body) {
          return json(400, { error: 'Missing request body' });
        }
        const payload = JSON.parse(event.body);
        const {
          // identifiers
          employeeNumber,
          role,
          status,
          // personal info
          firstName,
          lastName,
          email,
          dateOfBirth,
          placeOfBirth,
          civilityDropdown,
          maritalStatus,
          nationality,
          identityType,
          identity,
          workcountry,
          // contacts
          address,
          phone,
          mobile,
          tel,
          gender,
          country,
          // emergency
          emergencyName,
          emergencyContact,
          childrenCount,
          // job
          department,
          salary,
          hireDate,
        } = payload || {};

        // basic validation
        const required = {
          employeeNumber,
          role,
          status,
          firstName,
          lastName,
          email,
          dateOfBirth,
          placeOfBirth,
          civilityDropdown,
          maritalStatus,
          nationality,
          identityType,
          identity,
          workcountry,
          address,
          phone,
          mobile,
          emergencyName,
          emergencyContact,
          department,
          salary,
        } as Record<string, unknown>;

        const missing = Object.entries(required)
          .filter(([, v]) => v === undefined || v === null || v === '')
          .map(([k]) => k);
        if (missing.length > 0) {
          return json(400, { error: `Missing fields: ${missing.join(', ')}` });
        }

        const created = await prisma.user.create({
          data: {
            employeeNumber,
            role,
            status,
            firstName,
            lastName,
            email,
            dateOfBirth: new Date(dateOfBirth),
            placeOfBirth,
            civilityDropdown,
            maritalStatus,
            nationality,
            identityType,
            identity,
            workcountry,
            address,
            phone,
            mobile,
            tel: tel ?? phone,
            gender: gender ?? civilityDropdown,
            country: country ?? workcountry,
            emergencyName,
            emergencyContact,
            childrenCount: childrenCount != null ? Number(childrenCount) : 0,
            department,
            salary: Number(salary),
            hireDate: hireDate ? new Date(hireDate) : undefined,
          },
          select: {
            id: true,
            employeeNumber: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            status: true,
            department: true,
            workcountry: true,
            hireDate: true,
            createdAt: true,
          }
        });
        return json(201, created);
      }
      default:
        return json(405, { error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Users function error', error);
    return json(500, { error: 'Internal Server Error' });
  }
};


