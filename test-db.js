const { PrismaClient } = require("./src/generated/prisma/client");

const prisma = new PrismaClient({} || undefined);

async function test() {
  try {
    console.log("Testing database connection...");
    
    const users = await prisma.user.findMany({
      take: 5,
    });
    console.log("Users in database:", users.length);
    console.log(users);
    
    const exercises = await prisma.exercise.findMany({
      take: 5,
    });
    console.log("\nExercises in database:", exercises.length);
    
    const workouts = await prisma.workout.findMany({
      take: 5,
    });
    console.log("\nWorkouts in database:", workouts.length);
    console.log(workouts);
    
  } catch (error) {
    console.error("Database error:", error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
