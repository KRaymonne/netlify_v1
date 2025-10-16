// netlify/functions/api.ts

import { PrismaClient } from '@prisma/client';
import type { Handler } from '@netlify/functions'; // Importation du type Handler pour une meilleure typographie

// --- Configuration du Client Prisma pour l'environnement Serverless ---
// Le meilleur pattern pour éviter l'épuisement des connexions dans un environnement Serverless
// est de réutiliser une instance de PrismaClient si possible.

const globalForPrisma = global as unknown as { prisma: PrismaClient };  

// Si une instance globale existe (réutilisation lors d'un "warm start"), on la prend.
// Sinon, on crée une nouvelle instance.
export const prisma = globalForPrisma.prisma || new PrismaClient();

// En mode de développement (local), on stocke l'instance dans la variable globale
// pour s'assurer que le hot-reloading ne crée pas des instances infinies.
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// --- Le Handler de la Fonction ---

export const handler: Handler = async (event, context) => {
  try {
    // 1. Logique pour interagir avec MySQL via Prisma
    // Nous supposons que vous avez un modèle 'User' dans votre schema.prisma
    const users = await prisma.user.findMany();

    // 2. Retour de la réponse
    return {
      statusCode: 200,
      // TypeScript et le JSON: Assurez-vous que le corps est bien une chaîne JSON
      body: JSON.stringify(users),
      headers: {
        'Content-Type': 'application/json',
      },
    };

  } catch (error) {
    // 3. Gestion des erreurs
    console.error('Erreur de la fonction:', error);

    // En production, il est préférable de ne pas exposer le message d'erreur brut
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Échec de l'opération de base de données. Veuillez vérifier les logs." }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};