import { PrismaClient } from '../src/generated/prisma/client.ts';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import 'dotenv/config';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL });
const p = new PrismaClient({ adapter });

(async () => {
  const users = await p.user.findMany();
  console.log('Users before purge:', users.length);
  
  await p.checkInNote.deleteMany();
  await p.checkIn.deleteMany();
  await p.simplifiedWorkoutExercise.deleteMany();
  await p.detailedWorkoutExercise.deleteMany();
  await p.workout.deleteMany();
  await p.userSettings.deleteMany();
  await p.user.deleteMany();
  
  const after = await p.user.findMany();
  console.log('Users after purge:', after.length);
  await p.$disconnect();
})();
