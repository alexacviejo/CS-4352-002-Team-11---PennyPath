import type { AppModel } from "./useAppModel";
import { expenses, lessons } from "../data/content";
import { Icon, Penny, Button, NumberInput, TopBar, Progress } from "../components/UI";

export default function LearnView({ model }: { model: AppModel }) {
  const { tab, setTab, lessonStep, setLessonStep, lessonTitle, setLessonTitle, answer, setAnswer, feedback, setFeedback, lessonComplete, setLessonComplete, budgetStep, setBudgetStep, income, setIncome, allocations, setAllocations, budgetSaved, setBudgetSaved, goalStep, setGoalStep, goalName, setGoalName, goalCategory, setGoalCategory, target, setTarget, targetDate, setTargetDate, monthlySaving, setMonthlySaving, goalCreated, setGoalCreated, simChoice, setSimChoice, totalExpenses, remaining, goalMonths, outcome, navigate, resetAll, openLesson } = model;
  return (<>
          {tab === "learn" && lessonStep === "list" && (
            <>
              <TopBar title="Learn" />
              <section className="page-intro"><span className="eyebrow">YOUR LEARNING PATH</span><h1>Money skills,<br />one step at a time.</h1><p>Short lessons. Real-life confidence.</p></section>
              <section className="path-card">
                <div className="path-level"><span>LEVEL 4</span><b>{lessonComplete ? "78%" : "68%"}</b></div><Progress value={lessonComplete ? 78 : 68} />
                <small>{lessonComplete ? "Nice work — one more lesson complete!" : "Complete 2 more lessons to level up"}</small>
              </section>
              <div className="section-title"><h2>Everyday money</h2><span>2 of 5</span></div>
              <section className="lesson-list">
                {lessons.map((lesson, index) => (
                  <button key={lesson.title} className="lesson-item" onClick={() => openLesson(lesson.title)}>
                    <span className={`tile-icon ${lesson.color}`}><Icon name={lesson.icon} /></span>
                    <span className="lesson-copy"><b>{lesson.title}</b><small>{lesson.detail}</small><span className="xp-pill">+{lesson.xp} XP</span></span>
                    <span className={index === 0 && lessonComplete ? "done-ring" : "go-ring"}><Icon name={index === 0 && lessonComplete ? "check" : "arrow"} size={17} /></span>
                  </button>
                ))}
              </section>
            </>
          )}
          {tab === "learn" && lessonStep === "intro" && (
            <>
              <TopBar title="Lesson" onBack={() => setLessonStep("list")} />
              <section className="lesson-intro">
                <span className="big-lesson-icon"><Icon name="sparkle" size={36} /></span>
                <span className="eyebrow">4 MIN · +40 XP</span><h1>{lessonTitle}</h1>
                <p>Learn how to tell the difference between essentials and extras—so your money goes where it matters most.</p>
              </section>
              <section className="card learn-card"><h2>In this lesson</h2><ul><li><Icon name="check" />Spot common needs and wants</li><li><Icon name="check" />Make confident spending choices</li><li><Icon name="check" />Try a real-life money question</li></ul></section>
              <div className="penny-tip"><Penny small /><div><b>Penny’s tip</b><p>There’s no shame in spending on wants—just plan for needs first!</p></div></div>
              <div className="sticky-action"><Button onClick={() => setLessonStep("quiz")} icon="arrow">Start lesson</Button></div>
            </>
          )}
          {tab === "learn" && lessonStep === "quiz" && (
            <>
              <TopBar title="Quick check" onBack={() => { setFeedback(null); setLessonStep("intro"); }} />
              <section className="quiz-progress"><div><span>QUESTION 1 OF 1</span><b>Almost there!</b></div><Progress value={100} /></section>
              <section className="quiz-card"><span className="question-mark">?</span><h1>Which of the following is typically considered a need?</h1><p>Choose the best answer.</p></section>
              <section className="answers">
                {["Concert tickets", "Groceries", "Streaming subscriptions", "Designer sneakers"].map((option, index) => {
                  const letter = String.fromCharCode(65 + index);
                  const state = feedback && option === "Groceries" ? "correct" : feedback && option === answer && option !== "Groceries" ? "incorrect" : "";
                  return <button key={option} className={`${answer === option ? "selected" : ""} ${state}`} onClick={() => !feedback && setAnswer(option)}><span>{letter}</span><b>{option}</b>{state === "correct" && <Icon name="check" />}{state === "incorrect" && <span className="xmark">×</span>}</button>;
                })}
              </section>
              {feedback && <section className={`feedback ${feedback}`}><span className="feedback-icon"><Icon name={feedback === "correct" ? "check" : "alert"} /></span><div><b>{feedback === "correct" ? "You got it!" : "Not quite—good try!"}</b><p>{feedback === "correct" ? "Groceries are essential for everyday health and wellbeing, making them a need." : "Think about what you need for basic health and daily life. Groceries are the best answer."}</p></div></section>}
              <div className="sticky-action"><Button disabled={!answer} onClick={() => feedback ? setLessonStep("complete") : setFeedback(answer === "Groceries" ? "correct" : "incorrect")} icon="arrow">{feedback ? "See my results" : "Check answer"}</Button></div>
            </>
          )}
          {tab === "learn" && lessonStep === "complete" && (
            <>
              <TopBar title="Lesson complete" />
              <section className="celebration"><Penny celebrate /><span className="eyebrow">LESSON COMPLETE</span><h1>That was a<br />smart move!</h1><p>You can now separate needs from wants with confidence.</p></section>
              <section className="reward-row"><div><Icon name="star" /><b>+40</b><small>XP earned</small></div><div><Icon name="flame" /><b>7</b><small>day streak</small></div><div><Icon name="check" /><b>3/5</b><small>path progress</small></div></section>
              <section className="card progress-celebrate"><div><span><small>LEVEL 4</small><b>Smart Spender</b></span><strong>78%</strong></div><Progress value={78} /><p>Only 220 XP until Level 5!</p></section>
              <div className="sticky-action dual"><Button onClick={() => { setLessonComplete(true); setLessonStep("list"); }}>Back to lessons</Button><Button variant="secondary" onClick={() => { setLessonComplete(true); navigate("home"); }}>Go home</Button></div>
            </>
          )}
  </>);
}
