"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import ActiveTrainingCard from "@/components/workout/ActiveTrainingCard";
import RecentSessionsDisplay from "@/components/workout/RecentSessionsDisplay";
import TrainingSidebar from "@/components/workout/TrainingSidebar";
import TechniqueManagementDrawer from "@/components/workout/TechniqueManagementDrawer";
import { useAppContext } from "@/context/AppContext";

interface Exercise {
  id: string;
  name: string;
  difficulty: string;
  type: string;
  targetGroup?: string;
  assignedDays?: string;
  story?: string;
}

export default function TrainingGrounds() {
  const { isMobile, isNativeApp, setMobileSidebarOpen } = useAppContext();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseOrder, setExerciseOrder] = useState<string[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  // Load exercises on mount
  useEffect(() => {
    async function fetchExercises() {
      try {
        const response = await fetch("/api/exercises");
        if (response.ok) {
          const data = await response.json();
          const loaded = data.exercises || [];
          setExercises(loaded);
          // Initialize order from localStorage or default to fetch order
          const storedOrder = localStorage.getItem("cultivateos-exercise-order");
          if (storedOrder) {
            try {
              const parsed: string[] = JSON.parse(storedOrder);
              // Merge: keep stored order for known ids, append any new exercises at end
              const knownIds = new Set(loaded.map((e: Exercise) => e.id));
              const validOrder = parsed.filter((id: string) => knownIds.has(id));
              const remaining = loaded.filter((e: Exercise) => !validOrder.includes(e.id)).map((e: Exercise) => e.id);
              setExerciseOrder([...validOrder, ...remaining]);
            } catch {
              setExerciseOrder(loaded.map((e: Exercise) => e.id));
            }
          } else {
            setExerciseOrder(loaded.map((e: Exercise) => e.id));
          }
        }
      } catch (error) {
        console.error("Failed to load exercises:", error);
      } finally {
        setIsLoadingExercises(false);
      }
    }
    fetchExercises();
  }, []);

  const handleSubmissionSuccess = () => {
    // Trigger refresh of recent sessions display
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSelectTechnique = (exerciseId: string) => {
    setSelectedTechniques(prev => {
      if (prev.includes(exerciseId)) {
        // If already selected, remove it (deselect)
        return prev.filter(id => id !== exerciseId);
      } else {
        // If not selected, add it
        return [...prev, exerciseId];
      }
    });
  };

  const handleRemoveTechnique = (exerciseId: string) => {
    setSelectedTechniques(prev => prev.filter(id => id !== exerciseId));
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  // Reorder handler — persists to localStorage and updates state
  const handleReorderExercises = (orderedIds: string[]) => {
    setExerciseOrder(orderedIds);
    localStorage.setItem("cultivateos-exercise-order", JSON.stringify(orderedIds));
  };

  // Compute exercises sorted by the established order
  const orderedExercises = [...exercises].sort((a, b) => {
    const ai = exerciseOrder.indexOf(a.id);
    const bi = exerciseOrder.indexOf(b.id);
    return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
  });

  const handleUpdateDayAssignments = async (exerciseId: string, assignedDays: string) => {
    try {
      const dayIndices = assignedDays ? assignedDays.split(',').map(d => parseInt(d)).filter(d => !isNaN(d)) : [];
      
      const response = await fetch(`/api/exercises/${exerciseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignedDays: dayIndices,
        }),
      });

      if (response.ok) {
        const { exercise } = await response.json();
        // Update the exercises list with the new assignment
        setExercises(prev => prev.map(ex => 
          ex.id === exerciseId ? { ...ex, assignedDays: exercise.assignedDays } : ex
        ));
      } else {
        throw new Error("Failed to update day assignments");
      }
    } catch (error) {
      console.error("Error updating day assignments:", error);
      throw error;
    }
  };

  const sidebar = (
    <TrainingSidebar
      exercises={orderedExercises}
      selectedTechniques={selectedTechniques}
      onSelectTechnique={handleSelectTechnique}
      isLoadingExercises={isLoadingExercises}
      isMobile={isMobile}
      onDrawerOpen={handleDrawerOpen}
    />
  );

  return (
    <PageLayout 
      title="Training Grounds"
      subtitle="Record your cultivation sessions and perfect your martial techniques"
      sidebar={sidebar}
      sidebarLabel="Techniques"
    >
      <div className="space-y-6">
        {/* Active Training Cards */}
        <AnimatePresence mode="popLayout">
          {selectedTechniques.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-2"
            >
              {selectedTechniques
                .slice()
                .sort((a, b) => {
                  const ai = exerciseOrder.indexOf(a);
                  const bi = exerciseOrder.indexOf(b);
                  return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
                })
                .map((techniqueId, index) => {
                const exercise = exercises.find(ex => ex.id === techniqueId);
                if (!exercise) return null;
                
                return (
                  <ActiveTrainingCard
                    key={techniqueId}
                    exercise={exercise}
                    onSubmit={() => {
                      handleSubmissionSuccess();
                      // Optionally remove the technique after successful submission
                      // handleRemoveTechnique(techniqueId);
                    }}
                    onRemove={() => handleRemoveTechnique(techniqueId)}
                    delay={index * 0.1}
                  />
                );
              })}
            </motion.div>
          )}
          
          {/* Empty state when no techniques selected */}
          {selectedTechniques.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="space-y-3">
                <div className="text-6xl opacity-50">⚔️</div>
                <h3 className="text-lg font-medium text-text-secondary">
                  Select Techniques to Begin Training
                </h3>
                <p className="text-text-tertiary">
                  Choose techniques from the sidebar to create your training session
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Sessions Display */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <RecentSessionsDisplay refreshTrigger={refreshTrigger} />
        </motion.div>
      </div>

      {/* Technique Management Drawer */}
      <TechniqueManagementDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        exercises={orderedExercises}
        onUpdateDayAssignments={handleUpdateDayAssignments}
        onReorderExercises={handleReorderExercises}
      />

      {/* Contextual FAB — Training Grounds only, mobile native APK */}
      {isMobile && isNativeApp && (
        <>
          {/* Backdrop when FAB menu is open */}
          <AnimatePresence>
            {fabOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-void-black/40"
                onClick={() => setFabOpen(false)}
              />
            )}
          </AnimatePresence>

          <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-3">
            {/* FAB action items */}
            <AnimatePresence>
              {fabOpen && (
                <>
                  <motion.button
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => {
                      setMobileSidebarOpen(true);
                      setFabOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-ink-dark border border-jade-glow/40 shadow-lg shadow-jade-glow/20"
                  >
                    <span className="text-xs text-cloud-white font-medium whitespace-nowrap">Select Techniques</span>
                    <svg className="w-4 h-4 text-jade-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ delay: 0.05 }}
                    onClick={() => {
                      setIsDrawerOpen(true);
                      setFabOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-ink-dark border border-jade-glow/40 shadow-lg shadow-jade-glow/20"
                  >
                    <span className="text-xs text-cloud-white font-medium whitespace-nowrap">Manage Techniques</span>
                    <svg className="w-4 h-4 text-jade-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            {/* Main FAB button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setFabOpen(!fabOpen)}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-jade-deep to-jade-glow flex items-center justify-center shadow-xl"
              style={{
                boxShadow: '0 4px 14px rgba(52, 211, 153, 0.4), 0 2px 6px rgba(0,0,0,0.3)',
              }}
            >
              <motion.svg
                className="w-7 h-7 text-ink-deep"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
                animate={{ rotate: fabOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </motion.svg>
            </motion.button>
          </div>
        </>
      )}
    </PageLayout>
  );
}