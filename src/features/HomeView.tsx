import type { AppModel } from "./useAppModel";
import { expenses, lessons } from "../data/content";
import { Icon, Penny, Button, NumberInput, TopBar, Progress } from "../components/UI";

export default function HomeView({ model }: { model: AppModel }) {
  const { tab, setTab, lessonStep, setLessonStep, lessonTitle, setLessonTitle, answer, setAnswer, feedback, setFeedback, lessonComplete, setLessonComplete, budgetStep, setBudgetStep, income, setIncome, allocations, setAllocations, budgetSaved, setBudgetSaved, goalStep, setGoalStep, goalName, setGoalName, goalCategory, setGoalCategory, target, setTarget, targetDate, setTargetDate, monthlySaving, setMonthlySaving, goalCreated, setGoalCreated, simChoice, setSimChoice, totalExpenses, remaining, goalMonths, outcome, navigate, resetAll, openLesson } = model;
  return (<>
          {tab === "home" && (
            <>
              <TopBar title="PennyPath" action={<button className="icon-btn" onClick={resetAll} aria-label="Reset prototype"><Icon name="reset" size={20} /></button>} />
              <section className="home-hero">
                <div><span className="eyebrow">GOOD AFTERNOON, ALEX</span><h1>Hey, future<br />money pro!</h1><p>Penny has your next smart move ready.</p></div>
                <Penny />
              </section>
              <section className="stat-row">
                <div className="mini-stat"><span className="stat-icon flame"><Icon name="flame" /></span><div><b>7 days</b><small>Daily streak</small></div></div>
                <div className="mini-stat"><span className="stat-icon star"><Icon name="star" /></span><div><b>{lessonComplete ? 1_290 : 1_250} XP</b><small>Total earned</small></div></div>
              </section>
              <section className="card lesson-card">
                <div className="card-head"><div><span className="eyebrow">LEVEL 4 · SMART SPENDER</span><h2>Keep your momentum</h2></div><span className="level-badge">4</span></div>
                <Progress value={lessonComplete ? 78 : 68} label={lessonComplete ? "780 / 1,000 XP" : "680 / 1,000 XP"} />
                <div className="next-lesson"><span className="tile-icon yellow"><Icon name="sparkle" /></span><div><b>{lessonComplete ? "Budgeting Basics" : "Needs vs. Wants"}</b><small>{lessonComplete ? "Next up · 5 min" : "2 of 5 lessons · 4 min"}</small></div></div>
                <Button onClick={() => { navigate("learn"); openLesson(lessonComplete ? "Budgeting Basics" : "Needs vs. Wants"); }} icon="arrow">Continue learning</Button>
              </section>
              <div className="section-title"><h2>Your money snapshot</h2><button onClick={() => navigate("budget")}>See budget</button></div>
              <section className="money-grid">
                <button className="snapshot-card budget-snapshot" onClick={() => navigate("budget")}><span className="tile-icon cream"><Icon name="wallet" /></span><small>LEFT THIS MONTH</small><b>${Math.max(0, budgetSaved ? remaining : 250).toLocaleString()}</b><span>of ${income.toLocaleString()}</span><Progress value={budgetSaved ? totalExpenses / income * 100 : 79} /></button>
                <button className="snapshot-card goal-snapshot" onClick={() => navigate("goals")}><span className="tile-icon peach"><Icon name="target" /></span><small>SAVING FOR</small><b>{goalCreated ? goalName : "New laptop"}</b><span>$225 of ${target}</span><Progress value={225 / target * 100} /></button>
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
