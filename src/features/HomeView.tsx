import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { AppModel } from "./useAppModel";
import { expenses, lessons } from "../data/content";
import { Icon, Penny, Button, NumberInput, TopBar, Progress } from "../components/UI";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "GOOD MORNING";
  }

  if (hour >= 12 && hour < 17) {
    return "GOOD AFTERNOON";
  }

  return "GOOD EVENING";
}

export default function HomeView({ model }: { model: AppModel }) {
  const { tab, setTab, lessonStep, setLessonStep, lessonTitle, setLessonTitle, answer, setAnswer, feedback, setFeedback, lessonComplete, setLessonComplete, budgetStep, setBudgetStep, income, setIncome, allocations, setAllocations, budgetSaved, setBudgetSaved, goalStep, setGoalStep, goalName, setGoalName, goalCategory, setGoalCategory, target, setTarget, targetDate, setTargetDate, monthlySaving, setMonthlySaving, goalCreated, setGoalCreated, simChoice, setSimChoice, totalExpenses, remaining, goalMonths, outcome, navigate, resetAll, openLesson, nextLesson, openNextLesson, progressLoading, progressError, selectGoal, goals} = model;
  
  const [displayName, setDisplayName] = useState("THERE");
  const [greeting, setGreeting] = useState(getGreeting);

  useEffect(() => {
    let active = true;

    async function loadUserName() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !active) return;

      const savedName = data.user?.user_metadata?.display_name;

      setDisplayName(
        typeof savedName === "string" && savedName.trim()
          ? savedName.trim().toUpperCase()
          : "THERE"
      );
    }

    void loadUserName();

    const interval = window.setInterval(() => {
      setGreeting(getGreeting());
    }, 60_000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);


  return (<>
          {tab === "home" && (
            <>
              <TopBar title="PennyPath" action={<button className="icon-btn" onClick={resetAll} aria-label="Reset prototype"><Icon name="reset" size={20} /></button>} />
              <section className="home-hero">
                <div><span className="eyebrow">{greeting}, {displayName}</span><h1>Hey, future<br />money pro!</h1><p>Penny has your next smart move ready.</p></div>
                <Penny />
              </section>
              <section className="stat-row">
                <div className="mini-stat"><span className="stat-icon flame"><Icon name="flame" /></span><div><b>7 days</b><small>Daily streak</small></div></div>
                <div className="mini-stat"><span className="stat-icon star"><Icon name="star" /></span><div><b>{lessonComplete ? 1_290 : 1_250} XP</b><small>Total earned</small></div></div>
              </section>
              <section className="card lesson-card">
                <div className="card-head"><div><span className="eyebrow">LEVEL 4 · SMART SPENDER</span><h2>Keep your momentum</h2></div><span className="level-badge">4</span></div>
                <Progress value={lessonComplete ? 78 : 68} label={lessonComplete ? "780 / 1,000 XP" : "680 / 1,000 XP"} />
<div className="next-lesson">
  <span className={`tile-icon ${nextLesson?.color ?? "sage"}`}>
    <Icon name={nextLesson?.icon ?? "check"} />
  </span>

  <div>
    <b>
      {progressLoading
        ? "Loading your progress..."
        : progressError
          ? "Unable to load lessons"
          : nextLesson?.title ?? "All lessons completed!"}
    </b>

    <small>
      {progressError
        ? "Please refresh to try again"
        : nextLesson
          ? `Next up · +${nextLesson.xp} XP`
          : "You've completed your learning path!"}
    </small>
  </div>
</div>        
<Button
  onClick={openNextLesson}
  disabled={progressLoading || !!progressError}
  icon="arrow"
>
  {progressLoading
    ? "Loading..."
    : nextLesson
      ? "Continue learning"
      : "Review lessons"}
</Button>              </section>
              <div className="section-title"><h2>Your money snapshot</h2><button onClick={() => navigate("budget")}>See budget</button></div>
              <section className="money-grid">
                <button className="snapshot-card budget-snapshot" onClick={() => navigate("budget")}><span className="tile-icon cream"><Icon name="wallet" /></span><small>LEFT THIS MONTH</small><b>${Math.max(0, budgetSaved ? remaining : 250).toLocaleString()}</b><span>of ${income.toLocaleString()}</span><Progress value={budgetSaved ? totalExpenses / income * 100 : 79} /></button>
                {goals.length > 0 ? (
                  <button
                    className="snapshot-card goal-snapshot"
                    onClick={() => {
                      navigate("goals");
                      selectGoal(goals[0].id);
                    }}
                  >
                    <span className="tile-icon peach">
                      <Icon name="target" />
                    </span>

                    <small>SAVING FOR</small>

                    <b>{goals[0].name}</b>

                    <span>
                      ${goals[0].currentSavings.toLocaleString()} of{" "}
                      ${goals[0].target.toLocaleString()}
                    </span>

                    <Progress
                      value={
                        Number(goals[0].target) > 0
                          ? Math.min(
                              100,
                              Math.max(
                                0,
                                (Number(goals[0].currentSavings ?? 0) /
                                  Number(goals[0].target)) *
                                  100
                              )
                            )
                          : 0
                      }
                    />
                  </button>
                ) : (
                  <button
                    className="snapshot-card goal-snapshot"
                    onClick={() => {
                      navigate("goals");
                      setGoalStep("create");
                    }}
                  >
                    <span className="tile-icon peach">
                      <Icon name="target" />
                    </span>

                    <small>SAVING FOR</small>
                    <b>Create a savings goal</b>
                    <span>No savings goals yet</span>
                    <Progress value={0} />
                  </button>
                )}
              </section>
              <div className="section-title"><h2>Quick start</h2></div>
              <section className="quick-list">
                <button onClick={() => navigate("learn")}><span className="tile-icon yellow"><Icon name="book" /></span><span><b>Learn something new</b><small>5 bite-sized money lessons</small></span><Icon name="arrow" /></button>
                <button onClick={() => { navigate("budget"); setBudgetStep("edit"); }}><span className="tile-icon sage"><Icon name="wallet" /></span><span><b>Build your budget</b><small>Plan your month in minutes</small></span><Icon name="arrow" /></button>
                <button onClick={() => { navigate("goals"); setGoalStep("create"); }}><span className="tile-icon peach"><Icon name="target" /></span><span><b>Start a savings goal</b><small>Turn a want into a plan</small></span><Icon name="arrow" /></button>
              </section>
            </>
          )}
  </>);
}


