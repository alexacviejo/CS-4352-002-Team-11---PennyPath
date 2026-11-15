import { getBudget, saveBudget } from "../services/budgetService";
import { getGoals, createGoal as createGoalInDatabase, updateGoal as updateGoalInDatabase, deleteGoal as deleteGoalInDatabase, type SavingsGoal as DatabaseGoal} from "../services/goalsService";
import type { Tab, LessonStep, BudgetStep, GoalStep, Allocations } from "../data/content";
import { useEffect, useMemo, useState } from "react";
import { defaultAllocations, lessons } from "../data/content";
import {  getLessonProgress,  completeLesson} from "../services/progressService";
import { supabase } from "../lib/supabase";

export type SavingsGoal = {
  id: string;
  name: string;
  category: string;
  target: number;
  targetDate: string;
  monthlySaving: number;
  currentSavings: number;
};

const today = () => new Date().toISOString().slice(0, 10);
const initialGoals: SavingsGoal[] = [{
  id: "1", name: "New laptop", category: "Tech", target: 600,
  targetDate: today(), monthlySaving: 150, currentSavings: 225
}];

function mapDatabaseGoal(goal: DatabaseGoal): SavingsGoal {
  return {
    id: goal.id,
    name: goal.name,
    category: goal.category,
    target: goal.target_amount,
    targetDate: goal.target_date ?? "",
    monthlySaving: goal.monthly_saving,
    currentSavings: 0,
  };
}

export function useAppModel() {
  const [tab, setTab] = useState<Tab>("home");
  const [lessonStep, setLessonStep] = useState<LessonStep>("list");
  const [lessonTitle, setLessonTitle] = useState("Needs vs. Wants");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [completedLessonIds, setCompletedLessonIds] =
    useState<Set<string>>(new Set());
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressError, setProgressError] = useState<string | null>(null);
  const [savingLesson, setSavingLesson] = useState(false);
  const lessonComplete = completedLessonIds.size > 0;
  // Legacy setter kept for compatibility with other components
const setLessonComplete = (_value: boolean) => {
  // Lesson completion is now managed through Supabase
};
  const activeLessonId =
    lessons.find((lesson) => lesson.title === lessonTitle)?.id;

  // Budget state and Supabase integration from main.
  const [budgetStep, setBudgetStep] = useState<BudgetStep>("overview");
  const [income, setIncome] = useState(1200);
  const [allocations, setAllocations] = useState<Allocations>(defaultAllocations);
  const [budgetSaved, setBudgetSaved] = useState(false);
  const [savedIncome, setSavedIncome] = useState(1200);
  const [savedAllocations, setSavedAllocations] = useState<Allocations>(defaultAllocations);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const [budgetError, setBudgetError] = useState("");

  useEffect(() => {
    async function loadBudget() {
      try {
        const savedBudget = await getBudget();
        if (savedBudget) {
          setIncome(savedBudget.income);
          setAllocations(savedBudget.allocations);
          setSavedIncome(savedBudget.income);
          setSavedAllocations(savedBudget.allocations);
          setBudgetSaved(true);
        }
      } catch (error) {
        console.error("Failed to load budget:", error);
        setBudgetError("We couldn't load your saved budget.");
      } finally {
        setBudgetLoading(false);
      }
    }
    void loadBudget();
  }, []);


  // Load lesson progress from Supabase
  useEffect(() => {
    let cancelled = false;
    let requestId = 0;

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        const currentRequest = ++requestId;

        setCompletedLessonIds(new Set());
        setProgressError(null);

        if (!session) {
          setProgressLoading(false);
          return;
        }

        setProgressLoading(true);

        setTimeout(() => {
          if (cancelled || currentRequest !== requestId) return;

          async function loadProgress() {
            try {
              const progress = await getLessonProgress();

              if (!cancelled && currentRequest === requestId) {
                setCompletedLessonIds(
                  new Set(progress.map((record) => record.lesson_id))
                );
              }
            } catch (error) {
              if (!cancelled && currentRequest === requestId) {
                setProgressError(
                  error instanceof Error
                    ? error.message
                    : "Failed to load lesson progress."
                );
              }
            } finally {
              if (!cancelled && currentRequest === requestId) {
                setProgressLoading(false);
              }
            }
          }

          void loadProgress();
        }, 0);
      });

    return () => {
      cancelled = true;
      requestId++;
      subscription.unsubscribe();
    };
  }, []);

  // Load lesson progress from Supabase
  useEffect(() => {
    let cancelled = false;
    let requestId = 0;

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        const currentRequest = ++requestId;

        setCompletedLessonIds(new Set());
        setProgressError(null);

        if (!session) {
          setProgressLoading(false);
          return;
        }

        setProgressLoading(true);

        setTimeout(() => {
          if (cancelled || currentRequest !== requestId) return;

          async function loadProgress() {
            try {
              const progress = await getLessonProgress();

              if (!cancelled && currentRequest === requestId) {
                setCompletedLessonIds(
                  new Set(progress.map((record) => record.lesson_id))
                );
              }
            } catch (error) {
              if (!cancelled && currentRequest === requestId) {
                setProgressError(
                  error instanceof Error
                    ? error.message
                    : "Failed to load lesson progress."
                );
              }
            } finally {
              if (!cancelled && currentRequest === requestId) {
                setProgressLoading(false);
              }
            }
          }

          void loadProgress();
        }, 0);
      });

    return () => {
      cancelled = true;
      requestId++;
      subscription.unsubscribe();
    };
  }, []);

  // Save budget changes to Supabase
  async function saveBudgetChanges() {
    try {
      setBudgetError("");
      const savedBudget = await saveBudget(income, allocations);
      setSavedIncome(savedBudget.income);
      setSavedAllocations(savedBudget.allocations);
      setBudgetSaved(true);
      setBudgetStep("saved");
      return true;
    } catch (error) {
      console.error("Failed to save budget:", error);
      setBudgetError("We couldn't save your budget.");
      return false;
    }
  }

  // Calculate expenses using main branch's updated logic
  function cancelBudgetEdits() {
    setIncome(savedIncome);
    setAllocations(savedAllocations);
    setBudgetStep("overview");
  }

  const totalExpenses = Object.values(allocations).reduce(
    
    (sum, value) => sum + Math.max(0, value),
    0
  
  );

  const remaining = income - totalExpenses;
  const needsTotal = allocations.groceries + allocations.transportation + allocations.school;
  const wantsTotal = allocations.entertainment;
  const savingsTotal = allocations.savings;
  const needsPercent = income > 0 ? (needsTotal / income) * 100 : 0;
  const wantsPercent = income > 0 ? (wantsTotal / income) * 100 : 0;
  const savingsPercent = income > 0 ? (savingsTotal / income) * 100 : 0;
  const canSaveBudget = income > 0 && remaining >= 0;

  // Goals state from goals branch. Database integration is a separate step.
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [goalsSaving, setGoalsSaving] = useState(false);
  const [goalsError, setGoalsError] = useState(""); 
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [goalStep, setGoalStep] = useState<GoalStep>("overview");
  const [goalName, setGoalName] = useState("");
  const [goalCategory, setGoalCategory] = useState("Tech");
  const [target, setTarget] = useState(600);
  const [targetDate, setTargetDate] = useState(today());
  const [monthlySaving, setMonthlySaving] = useState(0);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [goalCreated, setGoalCreated] = useState(false);
  const [simChoice, setSimChoice] = useState<"entertainment" | "savings" | "contribution" | null>(null);

  const availableSavings = budgetSaved ? Math.max(0, remaining) : 0;
  const committedSavings = goals.reduce(
    (sum, goal) => sum + (goal.id === selectedGoalId ? 0 : goal.monthlySaving), 0
  );
  const availableForGoal = Math.max(0, availableSavings - committedSavings);
  const actualMonthlySaving = Math.min(Math.max(0, monthlySaving), availableForGoal);
  const amountNeeded = Math.max(0, target - currentSavings);
  const goalMonths = amountNeeded === 0 ? 0 : actualMonthlySaving > 0
    ? Math.ceil(amountNeeded / actualMonthlySaving) : null;
  // Treat each remaining calendar month (including a partial month) as one
  // contribution opportunity. This is a planning estimate, not a payment schedule.
  const monthsUntilTarget = useMemo(() => {
    if (!targetDate) return null;
    const deadline = new Date(`${targetDate}T00:00:00`);
    if (Number.isNaN(deadline.getTime())) return null;
    const now = new Date();
    const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (deadline < todayLocal) return 0;
    const wholeMonths =
      (deadline.getFullYear() - todayLocal.getFullYear()) * 12 +
      deadline.getMonth() - todayLocal.getMonth();
    return Math.max(1, wholeMonths + (deadline.getDate() > todayLocal.getDate() ? 1 : 0));
  }, [targetDate]);
  const requiredMonthlySaving = monthsUntilTarget !== null && monthsUntilTarget > 0
    ? Math.ceil((amountNeeded / monthsUntilTarget) * 100) / 100
    : null;
  const isOnTrack = amountNeeded === 0 ||
    (requiredMonthlySaving !== null && actualMonthlySaving >= requiredMonthlySaving);
  const canAffordRecommendedSaving = requiredMonthlySaving !== null &&
    requiredMonthlySaving <= availableForGoal;
  const savingsProgress = target > 0
    ? Math.min(100, (currentSavings / target) * 100) : 0;
  const totalMonthlySavings = goals.reduce((sum, goal) => sum + goal.monthlySaving, 0);
  const remainingAfterSavings = availableSavings - totalMonthlySavings;

  function startNewGoal() {
    setSelectedGoalId(null);
    setGoalName("");
    setGoalCategory("Tech");
    setTarget(600);
    setTargetDate(today());
    setMonthlySaving(0);
    setCurrentSavings(0);
    setGoalCreated(false);
    setSimChoice(null);
    setGoalStep("create");
  }

  function selectGoal(id: string) {
    const selected = goals.find((goal) => goal.id === id);
    if (!selected) return;
    setSelectedGoalId(id);
    setGoalName(selected.name);
    setGoalCategory(selected.category);
    setTarget(selected.target);
    setTargetDate(selected.targetDate);
    setMonthlySaving(selected.monthlySaving);
    setCurrentSavings(selected.currentSavings);
    setGoalCreated(true);
    setSimChoice(null);
    setGoalStep("review");
  }

  async function loadGoals() {
    try {
      setGoalsLoading(true);
      setGoalsError("");

      const databaseGoals = await getGoals();

      setGoals(databaseGoals.map(mapDatabaseGoal));
    } catch (error) {
      console.error("Failed to load goals:", error);
      setGoalsError("Unable to load your savings goals.");
    } finally {
      setGoalsLoading(false);
    }
  }

  useEffect(() => {
    void loadGoals();
  }, []);

  async function createGoal(): Promise<boolean> {
    if (
      !budgetSaved ||
      !goalName.trim() ||
      target <= 0 ||
      currentSavings < 0 ||
      actualMonthlySaving <= 0 ||
      monthlySaving > availableForGoal
    ) {
      setGoalsError("Please enter valid goal information.");
      return false;
    }

    try {
      setGoalsSaving(true);
      setGoalsError("");

      const goalData = {
        name: goalName.trim(),
        category: goalCategory,
        target_amount: target,
        target_date: targetDate || null,
        monthly_saving: actualMonthlySaving,
      };

      if (selectedGoalId !== null) {
        await updateGoalInDatabase(selectedGoalId, goalData);
      } else {
        const newGoal = await createGoalInDatabase(goalData);
        setSelectedGoalId(newGoal.id);
      }

      await loadGoals();

      setGoalCreated(true);
      return true;
    } catch (error) {
      console.error("Failed to save goal:", error);
      setGoalsError("Unable to save your goal. Please try again.");
      return false;
    } finally {
      setGoalsSaving(false);
    }
  }

  function recordSavings(amount: number) {
    if (selectedGoalId === null || amount <= 0) return;
    const newBalance = currentSavings + amount;
    setCurrentSavings(newBalance);
    setGoals((prev) => prev.map((goal) =>
      goal.id === selectedGoalId ? { ...goal, currentSavings: newBalance } : goal
    ));
  }

  async function deleteGoal(id: string): Promise<boolean> {
    try {
      setGoalsSaving(true);
      setGoalsError("");

      await deleteGoalInDatabase(id);
      await loadGoals();

      setSelectedGoalId(null);
      setGoalCreated(false);
      setGoalStep("overview");

      return true;
    } catch (error) {
      console.error("Failed to delete goal:", error);
      setGoalsError("Unable to delete your goal.");
      return false;
    } finally {
      setGoalsSaving(false);
    }
  }

  // Retained for compatibility with other components; practice challenges do not use it.
  const outcome = useMemo(() => {
    const contribution = actualMonthlySaving;
    if (simChoice === "entertainment") {
      const reduction = Math.min(75, allocations.entertainment);
      return {
        title: "Smart rebalancing", starting: currentSavings, saved: contribution,
        delay: 0, entertainment: allocations.entertainment - reduction,
        note: reduction >= 75
          ? "You reduced entertainment spending to cover the repair while keeping your savings on track."
          : "Reducing entertainment helps, but you still need another way to cover the remaining repair cost."
      };
    }
    if (simChoice === "savings") return {
      title: "Savings covered it", starting: Math.max(0, currentSavings - 75),
      saved: contribution, delay: 1, entertainment: allocations.entertainment,
      note: "You used money from your savings, but your regular monthly contribution stays the same."
    };
    return {
      title: "More breathing room", starting: currentSavings,
      saved: Math.max(0, contribution - 75), delay: 1,
      entertainment: allocations.entertainment,
      note: "You lowered this month's savings contribution to help cover the repair."
    };
  }, [simChoice, actualMonthlySaving, currentSavings, allocations.entertainment]);

  function navigate(next: Tab) {
    setTab(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetAll() {

    setTab("home");
    setLessonStep("list");
    setAnswer("");
    setFeedback(null);

    // Reset temporary budget state
    setBudgetStep("overview");
    setIncome(1200);
    setAllocations(defaultAllocations);
    setBudgetSaved(false);
    setSavedIncome(1200);
    setSavedAllocations(defaultAllocations);
    setBudgetError("");
    setGoals([]);
    setSelectedGoalId(null);
    setGoalStep("overview");
    setGoalName("");
    setGoalCategory("Tech");
    setTarget(600);
    setTargetDate(today());
    setMonthlySaving(0);
    setCurrentSavings(0);
    setGoalCreated(false);
    setSimChoice(null);
  }


  const openLesson = (title: string) => { setLessonTitle(title); setAnswer(""); setFeedback(null); setLessonStep("intro"); };
  const nextLesson = lessons.find(
  (lesson) => !completedLessonIds.has(lesson.id)
);

function openNextLesson() {
  if (progressLoading || progressError) return;

  if (nextLesson) {
    openLesson(nextLesson.title);
    navigate("learn");
  } else {
    setLessonStep("list");
    navigate("learn");
  }
}

  async function finishLesson() {
  if (!activeLessonId || savingLesson) return;

  if (completedLessonIds.has(activeLessonId)) {
    setLessonStep("complete");
    return;
  }

  setSavingLesson(true);
  setProgressError(null);

  try {
    await completeLesson(activeLessonId);

    setCompletedLessonIds((previous) => {
      const updated = new Set(previous);
      updated.add(activeLessonId);
      return updated;
    });

    setLessonStep("complete");
  } catch (error) {
    setProgressError(
      error instanceof Error
        ? error.message
        : "Failed to save lesson progress."
    );
  } finally {
    setSavingLesson(false);
  }
}

return {
  tab, setTab,
  lessonStep, setLessonStep,
  lessonTitle, setLessonTitle,
  answer, setAnswer,
  feedback, setFeedback,

  // Lesson features
  lessonComplete, setLessonComplete,
  completedLessonIds,
  progressLoading,
  progressError,
  savingLesson,
  finishLesson,
  nextLesson,
  openNextLesson,

  // Budget features
  budgetStep, setBudgetStep,
  income, setIncome,
  allocations, setAllocations,
  budgetSaved, setBudgetSaved,
  canSaveBudget,
  savedIncome, setSavedIncome,
  savedAllocations, setSavedAllocations,
  cancelBudgetEdits,
  needsTotal,
  wantsTotal,
  savingsTotal,
  needsPercent,
  wantsPercent,
  savingsPercent,
  saveBudgetChanges,

  // Goal features
  goalStep, setGoalStep,
  goalName, setGoalName,
  goalCategory, setGoalCategory,
  target, setTarget,
  targetDate, setTargetDate,
  monthlySaving, setMonthlySaving,
  goalCreated, setGoalCreated,
  simChoice, setSimChoice,

  // Goals database integration
  currentSavings, setCurrentSavings,
  availableForGoal,
  actualMonthlySaving,
  savingsProgress,
  goals,
  selectedGoalId,
  startNewGoal,
  selectGoal,
  createGoal,
  deleteGoal,
  goalsLoading,
  goalsSaving,
  goalsError,
  monthsUntilTarget,
  requiredMonthlySaving,
  isOnTrack,

  // Calculations and navigation
  totalExpenses,
  remaining,
  goalMonths,
  outcome,
  navigate,
  resetAll,
  openLesson,
};
}

export type AppModel = ReturnType<typeof useAppModel>;