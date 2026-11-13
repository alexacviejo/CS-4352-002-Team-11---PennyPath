
import { useMemo, useState } from "react";
import { defaultAllocations } from "../data/content";
import type {
  Tab,
  LessonStep,
  BudgetStep,
  GoalStep,
  Allocations
} from "../data/content";

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

const initialGoals: SavingsGoal[] = [
  {
    id: "1",
    name: "New laptop",
    category: "Tech",
    target: 600,
    targetDate: today(),
    monthlySaving: 150,
    currentSavings: 225
  }
];

export function useAppModel() {
  const [tab, setTab] = useState<Tab>("home");

  const [lessonStep, setLessonStep] = useState<LessonStep>("list");
  const [lessonTitle, setLessonTitle] = useState("Needs vs. Wants");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<
    "correct" | "incorrect" | null
  >(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  const [budgetStep, setBudgetStep] =
    useState<BudgetStep>("overview");
  const [income, setIncome] = useState(1200);
  const [allocations, setAllocations] =
    useState<Allocations>(defaultAllocations);
  const [budgetSaved, setBudgetSaved] = useState(false);

  // Multiple savings goals
  const [goals, setGoals] = useState<SavingsGoal[]>(initialGoals);
  const [selectedGoalId, setSelectedGoalId] =
    useState<string | null>(null);

  // Goal form
  const [goalStep, setGoalStep] = useState<GoalStep>("overview");
  const [goalName, setGoalName] = useState("");
  const [goalCategory, setGoalCategory] = useState("Tech");
  const [target, setTarget] = useState(600);
  const [targetDate, setTargetDate] = useState(today());
  const [monthlySaving, setMonthlySaving] = useState(0);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [goalCreated, setGoalCreated] = useState(false);

  const [simChoice, setSimChoice] = useState<
    "entertainment" | "savings" | "contribution" | null
  >(null);

  // Monthly budget
  const totalExpenses = Object.values(allocations).reduce(
    (sum, value) => sum + value,
    0
  );

  const remaining = income - totalExpenses;

  const availableSavings = budgetSaved
    ? Math.max(0, remaining)
    : 0;

  // Savings already committed to other goals
  const committedSavings = goals.reduce((sum, goal) => {
    if (goal.id === selectedGoalId) return sum;
    return sum + goal.monthlySaving;
  }, 0);

  const availableForGoal = Math.max(
    0,
    availableSavings - committedSavings
  );

  const actualMonthlySaving = Math.min(
    Math.max(0, monthlySaving),
    availableForGoal
  );

  const amountNeeded = Math.max(0, target - currentSavings);

  const goalMonths =
    amountNeeded === 0
      ? 0
      : actualMonthlySaving > 0
        ? Math.ceil(amountNeeded / actualMonthlySaving)
        : null;

  const savingsProgress =
    target > 0
      ? Math.min(100, (currentSavings / target) * 100)
      : 0;

  const totalMonthlySavings = goals.reduce(
    (sum, goal) => sum + goal.monthlySaving,
    0
  );

  const remainingAfterSavings =
    availableSavings - totalMonthlySavings;

  // Start creating a new goal
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

  // Open an existing goal
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

  // Create or update a goal
  function createGoal() {
    if (
      !budgetSaved ||
      !goalName.trim() ||
      target <= 0 ||
      currentSavings < 0 ||
      actualMonthlySaving <= 0 ||
      monthlySaving > availableForGoal
    ) {
      return;
    }

    const goalData = {
      name: goalName.trim(),
      category: goalCategory,
      target,
      targetDate,
      monthlySaving: actualMonthlySaving,
      currentSavings
    };

    if (selectedGoalId !== null) {
      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === selectedGoalId
            ? { ...goal, ...goalData }
            : goal
        )
      );
    } else {
      const id = crypto.randomUUID();

      setGoals((prev) => [
        ...prev,
        { id, ...goalData }
      ]);

      setSelectedGoalId(id);
    }

    setGoalCreated(true);
  }

  // Save a contribution to the selected goal
  function recordSavings(amount: number) {
    if (selectedGoalId === null || amount <= 0) return;

    const newBalance = currentSavings + amount;

    setCurrentSavings(newBalance);

    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === selectedGoalId
          ? { ...goal, currentSavings: newBalance }
          : goal
      )
    );
  }

  // Delete an existing goal
  function deleteGoal(id: string) {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
    setSelectedGoalId(null);
    setGoalCreated(false);
    setGoalStep("overview");
  }

  // Money challenge
  const outcome = useMemo(() => {
    const contribution = actualMonthlySaving;

    if (simChoice === "entertainment") {
      const reduction = Math.min(
        75,
        allocations.entertainment
      );

      return {
        title: "Smart rebalancing",
        starting: currentSavings,
        saved: contribution,
        delay: 0,
        entertainment:
          allocations.entertainment - reduction,
        note:
          reduction >= 75
            ? "You reduced entertainment spending to cover the repair while keeping your savings on track."
            : "Reducing entertainment helps, but you still need another way to cover the remaining repair cost."
      };
    }

    if (simChoice === "savings") {
      return {
        title: "Savings covered it",
        starting: Math.max(0, currentSavings - 75),
        saved: contribution,
        delay: 1,
        entertainment: allocations.entertainment,
        note:
          "You used money from your savings, but your regular monthly contribution stays the same."
      };
    }

    return {
      title: "More breathing room",
      starting: currentSavings,
      saved: Math.max(0, contribution - 75),
      delay: 1,
      entertainment: allocations.entertainment,
      note:
        "You lowered this month's savings contribution to help cover the repair."
    };
  }, [
    simChoice,
    actualMonthlySaving,
    currentSavings,
    allocations.entertainment
  ]);

  function navigate(next: Tab) {
    setTab(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetAll() {
    setTab("home");
    setLessonStep("list");
    setLessonTitle("Needs vs. Wants");
    setLessonComplete(false);
    setAnswer("");
    setFeedback(null);

    setBudgetStep("overview");
    setIncome(1200);
    setAllocations(defaultAllocations);
    setBudgetSaved(false);

    setGoals(initialGoals.map((goal) => ({ ...goal })));
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

  const openLesson = (title: string) => {
    setLessonTitle(title);
    setAnswer("");
    setFeedback(null);
    setLessonStep("intro");
  };

  return {
    tab, setTab,
    lessonStep, setLessonStep,
    lessonTitle, setLessonTitle,
    answer, setAnswer,
    feedback, setFeedback,
    lessonComplete, setLessonComplete,
    budgetStep, setBudgetStep,
    income, setIncome,
    allocations, setAllocations,
    budgetSaved, setBudgetSaved,
    goalStep, setGoalStep,
    goalName, setGoalName,
    goalCategory, setGoalCategory,
    target, setTarget,
    targetDate, setTargetDate,
    monthlySaving, setMonthlySaving,
    currentSavings, setCurrentSavings,
    goalCreated, setGoalCreated,
    simChoice, setSimChoice,
    totalExpenses,
    remaining,
    availableSavings,
    availableForGoal,
    committedSavings,
    actualMonthlySaving,
    totalMonthlySavings,
    remainingAfterSavings,
    goalMonths,
    savingsProgress,
    outcome,
    goals, setGoals,
    selectedGoalId, setSelectedGoalId,
    startNewGoal,
    selectGoal,
    createGoal,
    recordSavings,
    deleteGoal,
    navigate,
    resetAll,
    openLesson
  };
}

export type AppModel = ReturnType<typeof useAppModel>;
