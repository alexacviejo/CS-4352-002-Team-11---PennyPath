import { useEffect, useMemo, useState } from "react";
import { getBudget, saveBudget } from "../services/budgetService";
import { defaultAllocations } from "../data/content";
import type { Tab, LessonStep, BudgetStep, GoalStep, Allocations } from "../data/content";

export function useAppModel() {
  const [tab, setTab] = useState<Tab>("home");
  const [lessonStep, setLessonStep] = useState<LessonStep>("list");
  const [lessonTitle, setLessonTitle] = useState("Needs vs. Wants");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [budgetStep, setBudgetStep] = useState<BudgetStep>("overview");
  const [income, setIncome] = useState(1200);
  const [allocations, setAllocations] = useState<Allocations>(defaultAllocations);
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

    loadBudget();
  }, []);
  const [budgetSaved, setBudgetSaved] = useState(false);
  const [savedIncome, setSavedIncome] = useState(1200);
  const [savedAllocations, setSavedAllocations] = useState<Allocations>(defaultAllocations);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const [budgetError, setBudgetError] = useState("");
  const [goalStep, setGoalStep] = useState<GoalStep>("overview");
  const [goalName, setGoalName] = useState("New laptop");
  const [goalCategory, setGoalCategory] = useState("Tech");
  const [target, setTarget] = useState(600);
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [monthlySaving, setMonthlySaving] = useState(150);
  const [goalCreated, setGoalCreated] = useState(false);
  const [simChoice, setSimChoice] = useState<"entertainment" | "savings" | "contribution" | null>(null);

  async function saveBudgetChanges() {
    try {
      const savedBudget = await saveBudget(income, allocations);

      setSavedIncome(savedBudget.income);
      setSavedAllocations(savedBudget.allocations);
      setBudgetSaved(true);
      setBudgetStep("saved");

      return true;
    } catch (error) {
      console.error("Failed to save budget:", error);
      return false;
    }
  }

  const totalExpenses = Object.values(allocations).reduce((sum, value) => sum + Math.max(0, value), 0);
  const remaining = income - totalExpenses;

  // Group allocations using the 50/30/20 guideline
  const needsTotal =
    allocations.groceries +
    allocations.transportation +
    allocations.school;

  const wantsTotal = allocations.entertainment;
  const savingsTotal = allocations.savings;

  // Calculate each group's percentage of monthly income
  const needsPercent = income > 0 ? (needsTotal / income) * 100 : 0;
  const wantsPercent = income > 0 ? (wantsTotal / income) * 100 : 0;
  const savingsPercent = income > 0 ? (savingsTotal / income) * 100 : 0;

  const canSaveBudget = income > 0 && remaining >= 0;
  const goalMonths = Math.max(1, Math.ceil(target / Math.max(1, monthlySaving)));
  const outcome = useMemo(() => {
    if (simChoice === "entertainment") return { title: "Smart rebalancing", starting: 225, saved: monthlySaving, delay: 0, entertainment: Math.max(0, allocations.entertainment - 75), note: "Your goal stays on schedule, and entertainment drops by $75 this month." };
    if (simChoice === "savings") return { title: "Savings covered it", starting: 150, saved: monthlySaving, delay: 1, entertainment: allocations.entertainment, note: "Your goal balance drops to $150, but your usual monthly contribution stays intact." };
    return { title: "More breathing room", starting: 225, saved: Math.max(0, monthlySaving - 75), delay: 1, entertainment: allocations.entertainment, note: "You covered the repair with cash flow and lowered this month’s contribution by $75." };
  }, [simChoice, monthlySaving, allocations.entertainment]);

  function navigate(next: Tab) {
    setTab(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetAll() {
    setTab("home"); 
    setLessonStep("list"); 
    setLessonComplete(false); 
    setAnswer(""); 
    setFeedback(null);
    setBudgetStep("overview");
    setIncome(1200);
    setAllocations(defaultAllocations);
    setBudgetSaved(false);
    setSavedIncome(1200);
    setSavedAllocations(defaultAllocations);
    setGoalStep("overview"); 
    setGoalName("New laptop"); 
    setGoalCategory("Tech"); 
    setTarget(600);
    setTargetDate(new Date().toISOString().slice(0, 10)); 
    setMonthlySaving(150); 
    setGoalCreated(false); 
    setSimChoice(null);
  }

  function cancelBudgetEdits() {
  setIncome(savedIncome);
  setAllocations(savedAllocations);
  setBudgetStep("overview");
  }

  const openLesson = (title: string) => { setLessonTitle(title); setAnswer(""); setFeedback(null); setLessonStep("intro"); };

  return { tab, setTab, lessonStep, setLessonStep, lessonTitle, setLessonTitle, answer, setAnswer, feedback, setFeedback, lessonComplete, setLessonComplete, budgetStep, setBudgetStep, income, setIncome, allocations, setAllocations, budgetSaved, setBudgetSaved, goalStep, setGoalStep, goalName, setGoalName, goalCategory, setGoalCategory, target, setTarget, targetDate, setTargetDate, monthlySaving, setMonthlySaving, goalCreated, setGoalCreated, simChoice, setSimChoice, totalExpenses, remaining, goalMonths, outcome, navigate, resetAll, openLesson, canSaveBudget, savedIncome, setSavedIncome, savedAllocations, setSavedAllocations, cancelBudgetEdits, needsTotal, wantsTotal, savingsTotal, needsPercent, wantsPercent, savingsPercent, saveBudgetChanges,};
}
export type AppModel = ReturnType<typeof useAppModel>;
