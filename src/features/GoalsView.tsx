import type { AppModel } from "./useAppModel";
import { expenses, lessons } from "../data/content";
import { Icon, Penny, Button, NumberInput, TopBar, Progress } from "../components/UI";

export default function GoalsView({ model }: { model: AppModel }) {
  const { tab, setTab, lessonStep, setLessonStep, lessonTitle, setLessonTitle, answer, setAnswer, feedback, setFeedback, lessonComplete, setLessonComplete, budgetStep, setBudgetStep, income, setIncome, allocations, setAllocations, budgetSaved, setBudgetSaved, goalStep, setGoalStep, goalName, setGoalName, goalCategory, setGoalCategory, target, setTarget, targetDate, setTargetDate, monthlySaving, setMonthlySaving, goalCreated, setGoalCreated, simChoice, setSimChoice, totalExpenses, remaining, goalMonths, outcome, navigate, resetAll, openLesson } = model;
  return (<>
          {tab === "goals" && goalStep === "overview" && (
            <>
              <TopBar title="Goals" />
              <section className="page-intro goals-hero"><span className="eyebrow">DREAM IT. PLAN IT.</span><h1>Small steps,<br />big milestones.</h1><p>Turn something you want into a plan you can follow.</p></section>
              <Button onClick={() => setGoalStep("create")} icon="plus">Create new goal</Button>
              <div className="section-title"><h2>Active goal</h2><span>1 goal</span></div>
              <button className="active-goal card" onClick={() => setGoalStep(goalCreated ? "review" : "create")}>
                <span className="goal-art"><Icon name="target" size={34} /></span>
                <span className="goal-info"><small>{goalCreated ? goalCategory.toUpperCase() : "TECH"}</small><b>{goalCreated ? goalName : "New laptop"}</b><span><strong>$225</strong> of ${target.toLocaleString()}</span><Progress value={225 / target * 100} /></span><Icon name="arrow" />
              </button>
              <section className="milestone card"><span className="tile-icon yellow"><Icon name="sparkle" /></span><div><small>NEXT MILESTONE</small><b>$300 saved</b><p>You’re only $75 away!</p></div></section>
              <div className="section-title"><h2>Money challenges</h2></div>
              <button className="challenge-card" onClick={() => { setGoalCreated(true); setGoalStep("simulation"); }}><span className="challenge-icon"><Icon name="alert" /></span><span><small>2 MIN SIMULATION</small><b>Expect the unexpected</b><p>Can your plan handle a surprise expense?</p></span><Icon name="arrow" /></button>
            </>
          )}
          {tab === "goals" && goalStep === "create" && (
            <>
              <TopBar title="New savings goal" onBack={() => setGoalStep("overview")} />
              <section className="step-heading"><span className="eyebrow">LET’S MAKE A PLAN</span><h1>What are you saving for?</h1><p>Choose a category and give your goal a name.</p></section>
              <div className="category-picks">
                {["Tech", "Travel", "Emergency", "Education"].map((category) => <button key={category} className={goalCategory === category ? "active" : ""} onClick={() => setGoalCategory(category)}><span><Icon name={category === "Tech" ? "sparkle" : category === "Emergency" ? "wallet" : category === "Education" ? "book" : "target"} /></span>{category}</button>)}
              </div>
              <label className="field"><span>Goal name</span><input className="text-input" value={goalName} onChange={(e) => setGoalName(e.target.value)} placeholder="e.g. New laptop" /></label>
              <NumberInput label="Target amount" value={target} onChange={setTarget} />
              <label className="field"><span>Target date</span><span className="date-wrap"><Icon name="calendar" /><input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} /></span></label>
              <section className="budget-check card"><span className="tile-icon sage"><Icon name="wallet" /></span><div><small>YOUR MONTHLY BUDGET</small><b>${budgetSaved ? Math.max(0, remaining).toLocaleString() : "250"} available</b><p>after planned expenses</p></div><Icon name="check" /></section>
              <NumberInput label="Monthly contribution" value={monthlySaving} onChange={setMonthlySaving} />
              <section className="estimate"><div><span>Estimated time</span><b>{goalMonths} months</b></div><Progress value={Math.min(100, 225 / Math.max(1, target) * 100)} /><p>At ${monthlySaving}/month, you’ll reach ${target.toLocaleString()} around your target date.</p></section>
              <div className="sticky-action"><Button disabled={!goalName.trim() || target <= 0 || monthlySaving <= 0} onClick={() => setGoalStep("review")} icon="arrow">Review savings plan</Button></div>
            </>
          )}
          {tab === "goals" && goalStep === "review" && (
            <>
              <TopBar title="Review goal" onBack={() => setGoalStep("create")} />
              <section className="goal-review-hero"><span className="goal-art"><Icon name="target" size={40} /></span><span className="eyebrow">{goalCategory.toUpperCase()} GOAL</span><h1>{goalName}</h1><p>Your path to ${target.toLocaleString()} is ready.</p></section>
              <section className="card plan-details"><div><span>Starting balance</span><b>$225</b></div><div><span>Monthly contribution</span><b>${monthlySaving}</b></div><div><span>Estimated time</span><b>{Math.max(1, Math.ceil((target - 225) / monthlySaving))} months</b></div><div><span>Target date</span><b>{new Date(`${targetDate}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</b></div></section>
              <section className="forecast card"><div><h2>Your savings forecast</h2><b>38%</b></div><div className="forecast-bars"><i /><i /><i /><i /><i /></div><p>$225 saved today <span>→</span> ${target.toLocaleString()} goal</p></section>
              <button className="edit-link" onClick={() => setGoalStep("create")}><Icon name="edit" size={18} />Edit goal details</button>
              <div className="sticky-action"><Button onClick={() => { setGoalCreated(true); setGoalStep("simulation"); }} icon="check">Confirm & try a challenge</Button></div>
            </>
          )}
          {tab === "goals" && goalStep === "simulation" && (
            <>
              <TopBar title="Money challenge" onBack={() => setGoalStep("overview")} />
              <section className="sim-header"><span className="eyebrow">REAL-LIFE SIMULATION</span><h1>Plot twist!</h1><p>Life just sent an unexpected expense your way.</p></section>
              <section className="surprise-card"><span className="bike-icon"><Icon name="alert" size={30} /></span><small>UNEXPECTED EXPENSE</small><h2>Your bike needs a repair</h2><strong>$75</strong><p>You rely on your bike to get to class. The repair can’t wait until next month.</p></section>
              <section className="decision"><h2>How will you handle it?</h2><p>Each choice changes your budget differently.</p>
                <button className={simChoice === "entertainment" ? "selected" : ""} onClick={() => setSimChoice("entertainment")}><span>A</span><div><b>Reduce entertainment spending</b><small>Keep your savings goal on track</small></div><i /></button>
                <button className={simChoice === "savings" ? "selected" : ""} onClick={() => setSimChoice("savings")}><span>B</span><div><b>Use money from savings</b><small>Your goal may take a little longer</small></div><i /></button>
                <button className={simChoice === "contribution" ? "selected" : ""} onClick={() => setSimChoice("contribution")}><span>C</span><div><b>Lower this month’s contribution</b><small>More room in your monthly budget</small></div><i /></button>
              </section>
              <div className="sticky-action"><Button disabled={!simChoice} onClick={() => setGoalStep("outcome")} icon="arrow">See the impact</Button></div>
            </>
          )}
          {tab === "goals" && goalStep === "outcome" && (
            <>
              <TopBar title="Your outcome" onBack={() => setGoalStep("simulation")} />
              <section className="outcome-hero"><span className="outcome-icon"><Icon name="sparkle" size={34} /></span><span className="eyebrow">DECISION MADE</span><h1>{outcome.title}</h1><p>{outcome.note}</p></section>
              <section className="impact-grid"><div><small>BIKE REPAIR</small><b>−$75</b><span>Covered</span></div><div><small>THIS MONTH</small><b>${outcome.saved}</b><span>toward goal</span></div></section>
              <section className="card updated-plan"><div className="card-head"><div><small>UPDATED GOAL</small><h2>{goalName}</h2></div><b>${target}</b></div><Progress value={outcome.starting / target * 100} label={`$${outcome.starting} of $${target}`} /><div className="timeline"><span><i /><b>Today</b><small>${outcome.starting} saved</small></span><em /><span><i /><b>{outcome.delay ? "About 3.5 months" : "About 3 months"}</b><small>Goal reached</small></span></div></section>
              <section className="card adjust-plan"><div><h2>Adjust your plan</h2><p>You can change future monthly contributions.</p></div><NumberInput label="Next month’s contribution" value={monthlySaving} onChange={setMonthlySaving} /></section>
              <div className="penny-tip"><Penny small /><div><b>That’s financial resilience!</b><p>There isn’t one perfect choice. You made a plan and adapted when life changed.</p></div></div>
              <div className="sticky-action dual"><Button onClick={() => { setSimChoice(null); setGoalStep("overview"); }}>Save updated plan</Button><Button variant="secondary" onClick={() => { setSimChoice(null); setGoalStep("simulation"); }}>Try another</Button></div>
            </>
          )}
  </>);
}
