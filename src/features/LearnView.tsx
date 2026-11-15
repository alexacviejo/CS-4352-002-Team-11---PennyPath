import type { AppModel } from "./useAppModel";
import { expenses, lessons } from "../data/content";
import { Icon, Penny, Button, NumberInput, TopBar, Progress } from "../components/UI";

export default function LearnView({ model }: { model: AppModel }) {
const { tab, lessonStep, setLessonStep, lessonTitle, answer, setAnswer, feedback, setFeedback, completedLessonIds, progressLoading, progressError, savingLesson, finishLesson, navigate, openLesson,} = model;
  const selectedLesson = lessons.find(
  (lesson) => lesson.title === lessonTitle);
  return (<>
          {tab === "learn" && lessonStep === "list" && (
            <>
              <TopBar title="Learn" />
              {progressError && (
                <p role="alert" className="error-message">
                  {progressError}
                </p>
              )}
              <section className="page-intro"><span className="eyebrow">YOUR LEARNING PATH</span><h1>Money skills,<br />one step at a time.</h1><p>Short lessons. Real-life confidence.</p></section>
              <section className="path-card">
  <div className="path-level">
    <span>LEARNING PROGRESS</span>
    <b>
      {progressLoading
        ? "Loading..."
        : `${Math.round(
            (lessons.filter((lesson) => completedLessonIds.has(lesson.id))
              .length / lessons.length) * 100
          )}%`}
    </b>
  </div>

  <Progress
    value={
      progressLoading
        ? 0
        : (lessons.filter((lesson) => completedLessonIds.has(lesson.id))
            .length / lessons.length) * 100
    }
  />

  <small>
    {progressLoading
      ? "Loading your lesson progress..."
      : `${lessons.filter((lesson) => !completedLessonIds.has(lesson.id)).length} lessons remaining`}
  </small>
</section>

<div className="section-title">
  <h2>Everyday money</h2>
  <span>
    {progressLoading
      ? "Loading..."
      : `${lessons.filter((lesson) => completedLessonIds.has(lesson.id)).length} of ${lessons.length}`}
  </span>
</div>
              <section className="lesson-list">
  {lessons.map((lesson) => {
    const isCompleted = completedLessonIds.has(lesson.id);

    return (
      <button
        key={lesson.id}
        className="lesson-item"
        onClick={() => openLesson(lesson.title)}
      >
        <span className={`tile-icon ${lesson.color}`}>
          <Icon name={lesson.icon} />
        </span>

        <span className="lesson-copy">
          <b>{lesson.title}</b>
          <small>{lesson.detail}</small>
          <span className="xp-pill">+{lesson.xp} XP</span>
        </span>

        <span className={isCompleted ? "done-ring" : "go-ring"}>
          <Icon
            name={isCompleted ? "check" : "arrow"}
            size={17}
          />
        </span>
      </button>
    );
  })}
</section>
            </>
          )}
          {tab === "learn" && lessonStep === "intro" && (
            <>
              <TopBar title="Lesson" onBack={() => setLessonStep("list")} />
              <section className="lesson-intro">
                <span className="big-lesson-icon"><Icon name="sparkle" size={36} /></span>
                
{selectedLesson && (
  <>
    <section className="lesson-intro">
      <span className="big-lesson-icon">
        <Icon name={selectedLesson.icon} size={36} />
      </span>

      <span className="eyebrow">
        {selectedLesson.duration} · +{selectedLesson.xp} XP
      </span>

      <h1>{selectedLesson.title}</h1>
      <p>{selectedLesson.description}</p>
    </section>

    <section className="card learn-card">
      <h2>In this lesson</h2>
      <ul>
        {selectedLesson.objectives.map((objective) => (
          <li key={objective}>
            <Icon name="check" />
            {objective}
          </li>
        ))}
      </ul>
    </section>

    <div className="penny-tip">
      <Penny small />
      <div>
        <b>Penny's tip</b>
        <p>{selectedLesson.tip}</p>
      </div>
    </div>
  </>
)}

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
              {selectedLesson && (
                <section className="quiz-card">
                  <span className="question-mark">?</span>

                  <h1>{selectedLesson.question}</h1>

                  <p>Choose the best answer.</p>
                </section>
              )}
              {selectedLesson && (
              <section className="answers">
                {selectedLesson.options.map((option, index) => {
                  const letter = String.fromCharCode(65 + index);

                  const state =
                    feedback && option === selectedLesson.correctAnswer
                      ? "correct"
                      : feedback && option === answer
                        ? "incorrect"
                        : "";

                  return (
                    <button
                      key={option}
                      className={`${answer === option ? "selected" : ""} ${state}`}
                      onClick={() => !feedback && setAnswer(option)}
                    >
                      <span>{letter}</span>

                      <b>{option}</b>

                      {state === "correct" && <Icon name="check" />}

                      {state === "incorrect" && (
                        <span className="xmark">×</span>
                      )}
                    </button>
                  );
                })}
              </section>
            )}
{selectedLesson && feedback && (
  <section className={`feedback ${feedback}`}>
    <span className="feedback-icon">
      <Icon
        name={feedback === "correct" ? "check" : "alert"}
      />
    </span>

    <div>
      <b>
        {feedback === "correct"
          ? "You got it!"
          : "Not quite — good try!"}
      </b>

      <p>
        {feedback === "correct"
          ? selectedLesson.correctExplanation
          : selectedLesson.incorrectExplanation}
      </p>
    </div>
  </section>
)}{progressError && (
  <p role="alert" className="error-message">
    {progressError}
  </p>
)}

<div className="sticky-action">
  <Button
    disabled={!answer || savingLesson || progressLoading}
    onClick={() => {
  if (feedback === "correct") {
    void finishLesson();
  } else if (feedback === "incorrect") {
    setLessonStep("failed");
  } else if (selectedLesson) {
    setFeedback(
      answer === selectedLesson.correctAnswer
        ? "correct"
        : "incorrect"
    );
  }
}}
    icon="arrow"
  >
    {savingLesson
      ? "Saving..."
      : feedback
        ? "See my results"
        : "Check answer"}
  </Button>
</div></>
          )}
          {tab === "learn" && lessonStep === "failed" && (
  <>
    <TopBar
      title="Lesson results"
      onBack={() => setLessonStep("list")}
    />

    <section className="celebration">

      <span className="eyebrow">KEEP PRACTICING</span>

      <h1>
        Not quite there
        <br />
        yet!
      </h1>

      <p>
        Learning takes practice! Review what you've learned
        and give this lesson another try.
      </p>
    </section>

    <section className="card learn-card">
      <h2>What can you improve?</h2>

      <p>
        Remember that needs are essential expenses like
        groceries, housing, and utilities.
        Wants are optional purchases.
      </p>
    </section>

    <div className="penny-tip">
      <Penny small />
      <div>
        <b>Penny's tip</b>
        <p>
          Every mistake is a chance to learn.
          You've got this!
        </p>
      </div>
    </div>

    <div className="sticky-action dual">
      <Button
        onClick={() => {
          setAnswer("");
          setFeedback(null);
          setLessonStep("quiz");
        }}
      >
        Try again
      </Button>

      <Button
        variant="secondary"
        onClick={() => {
          setAnswer("");
          setFeedback(null);
          setLessonStep("list");
        }}
      >
        Back to lessons
      </Button>
    </div>
  </>
)}
          {tab === "learn" && lessonStep === "complete" && (
            <>
              <TopBar title="Lesson complete" />
              <section className="celebration"><Penny celebrate /><span className="eyebrow">LESSON COMPLETE</span><h1>That was a<br />smart move!</h1><p>You can now separate needs from wants with confidence.</p></section>
              <section className="reward-row"><div><Icon name="star" /><b>+40</b><small>XP earned</small></div><div><Icon name="flame" /><b>7</b><small>day streak</small></div><div><Icon name="check" /><b>3/5</b><small>path progress</small></div></section>
              <section className="card progress-celebrate"><div><span><small>LEVEL 4</small><b>Smart Spender</b></span><strong>78%</strong></div><Progress value={78} /><p>Only 220 XP until Level 5!</p></section>
              <div className="sticky-action dual">
  <Button onClick={() => setLessonStep("list")}>
    Back to lessons
  </Button>

  <Button
    variant="secondary"
    onClick={() => navigate("home")}
  >
    Go home
  </Button>
</div>
            </>
          )}
  </>);
}
