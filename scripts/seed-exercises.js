const { PrismaClient } = require('../src/generated/prisma/client.ts');
const prisma = new PrismaClient();

const exercises = [
  {
    name: "Iron Palm Strike",
    difficulty: "beginner", 
    type: "strength",
    targetGroup: "arms",
    story: "Fundamental palm technique for building internal power"
  },
  {
    name: "Dragon Breath Meditation", 
    difficulty: "intermediate",
    type: "breathing", 
    targetGroup: "core",
    story: "Ancient breathing technique to channel qi energy"
  },
  {
    name: "Flowing Water Stance",
    difficulty: "advanced",
    type: "flexibility",
    targetGroup: "legs", 
    story: "Graceful stance work mimicking water's fluid movement"
  },
  {
    name: "Mountain Fist",
    difficulty: "intermediate", 
    type: "strength",
    targetGroup: "arms",
    story: "Powerful striking technique inspired by mountain strength"
  },
  {
    name: "Phoenix Rising Form",
    difficulty: "advanced",
    type: "cardio",
    targetGroup: "full-body", 
    story: "Complete form representing rebirth and transcendence"
  }
];

async function seedExercises() {
  console.log('Seeding exercises...');
  
  for (const exercise of exercises) {
    await prisma.exercise.create({
      data: exercise
    });
    console.log(`Created exercise: ${exercise.name}`);
  }
  
  console.log('Exercise seeding complete!');
}

seedExercises()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });