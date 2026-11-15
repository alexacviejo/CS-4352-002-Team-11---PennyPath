import type { Tab, LessonStep, BudgetStep, GoalStep, Allocations } from "../data/content";
import { useEffect, useMemo, useState } from "react";
import { defaultAllocations, lessons } from "../data/content";
import {  getLessonProgress,  completeLesson} from "../services/progressService";
import { supabase } from "../lib/supabase";

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
  const [budgetStep, setBudgetStep] = useState<BudgetStep>("overview");
  const [income, setIncome] = useState(1200);
  const [allocations, setAllocations] = useState<Allocations>(defaultAllocations);
  const [budgetSaved, setBudgetSaved] = useState(false);
  const [goalStep, setGoalStep] = useState<GoalStep>("overview");
  const [goalName, setGoalName] = useState("New laptop");
  const [goalCategory, setGoalCategory] = useState("Tech");
  const [target, setTarget] = useState(600);
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [monthlySaving, setMonthlySaving] = useState(150);
  const [goalCreated, setGoalCreated] = useState(false);
  const [simChoice, setSimChoice] = useState<"entertainment" | "savings" | "contribution" | null>(null);

  useEffect(() => {
  let cancelled = false;
  let requestId = 0;

  const { data: { subscription } } =
    supabase.auth.onAuthStateChange((_event, session) => {
      const currentRequest = ++requestId;

      // Clear progress belonging to the previous session
      setCompletedLessonIds(new Set());
      setProgressError(null);

      if (!session) {
        setProgressLoading(false);
        return;
      }

      setProgressLoading(true);

      // Defer Supabase queries outside the auth callback
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

  const totalExpenses = Object.values(allocations).reduce((sum, value) => sum + value, 0);
  const remaining = income - totalExpenses;
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
    setTab("home"); setLessonStep("list"); setAnswer(""); setFeedback(null);
    setBudgetStep("overview"); setIncome(1200); setAllocations(defaultAllocations); setBudgetSaved(false);
    setGoalStep("overview"); setGoalName("New laptop"); setGoalCategory("Tech"); setTarget(600);
    setTargetDate(new Date().toISOString().slice(0, 10)); setMonthlySaving(150); setGoalCreated(false); setSimChoice(null);
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

  return { tab, setTab, lessonStep, setLessonStep, lessonTitle, setLessonTitle, answer, setAnswer, feedback, setFeedback, lessonComplete, setLessonComplete, completedLessonIds, progressLoading, progressError, savingLesson, finishLesson, budgetStep, setBudgetStep, income, setIncome, allocations, setAllocations, budgetSaved, setBudgetSaved, goalStep, setGoalStep, goalName, setGoalName, goalCategory, setGoalCategory, target, setTarget, targetDate, setTargetDate, monthlySaving, setMonthlySaving, goalCreated, setGoalCreated, simChoice, setSimChoice, totalExpenses, remaining, goalMonths, outcome, navigate, resetAll, openLesson, nextLesson, openNextLesson };
}
export type AppModel = ReturnType<typeof useAppModel>;