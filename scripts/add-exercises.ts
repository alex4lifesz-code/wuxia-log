// Quick script to add exercises to database for testing
// Run this using: npm run ts-node scripts/add-exercises.ts

import { prisma } from "../src/lib/prisma";

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

async function addExercises() {
  console.log('Adding exercises to database...');
  
  for (const exercise of exercises) {
    try {
      const created = await prisma.exercise.create({
        data: exercise
      });
      console.log(`✓ Added: ${created.name} (${created.difficulty})`);
    } catch (error) {
      console.error(`✗ Failed to add ${exercise.name}:`, error);
    }
  }
  
  console.log('Exercise seeding complete!');
  await prisma.$disconnect();
}

addExercises().catch(console.error);