
import { useState } from "react";
import type { AppModel } from "./useAppModel";
import {
  Icon,
  Penny,
  Button,
  NumberInput,
  TopBar,
  Progress
} from "../components/UI";

// Financial literacy challenges.
// These are educational only and never change the user's budget.
const moneyChallenges = [
  {
    id: "bike",
    title: "Bike repair",
    description:
      "Your bike needs an unexpected $75 repair. You use it to get to class, so the repair cannot wait.",
    amount: 75,
    question: "What is a good way to handle this expense?",
    choices: [
      {
        title: "Reduce entertainment spending",
        description:
          "Temporarily spend less on nonessential activities.",
        correct: true,
        feedback:
          "Great choice! Adjusting flexible expenses can help cover unexpected costs without taking on debt."
      },
      {
        title: "Ignore the repair",
        description:
          "Continue riding and hope the problem disappears.",
        correct: false,
        feedback:
          "Ignoring necessary repairs can make problems more expensive or unsafe. Consider adjusting flexible spending instead."
      },
      {
        title: "Borrow money immediately",
        description:
          "Take out a loan before reviewing other options.",
        correct: false,
        feedback:
          "Borrowing can sometimes be necessary, but first consider available savings, spending adjustments, and other affordable options."
      }
    ]
  },
  {
    id: "phone",
    title: "Broken phone",
    description:
      "Your phone screen cracks. A repair shop quotes you $120 to fix it.",
    amount: 120,
    question: "What should you do first?",
    choices: [
      {
        title: "Compare repair prices",
        description:
          "Check other repair shops and your warranty.",
        correct: true,
        feedback:
          "Correct! Comparing prices and checking your warranty can help you avoid unnecessary spending."
      },
      {
        title: "Buy the newest phone",
        description:
          "Replace your phone with the latest model.",
        correct: false,
        feedback:
          "Buying a new phone may cost much more than repairing your current one. Compare your options first."
      },
      {
        title: "Use a high-interest loan",
        description:
          "Borrow money without comparing alternatives.",
        correct: false,
        feedback:
          "High-interest borrowing can make a relatively small expense much more expensive."
      }
    ]
  },
  {
    id: "concert",
    title: "Concert tickets",
    description:
      "Your favorite artist announces a concert. Tickets cost $180, but you also have upcoming bills.",
    amount: 180,
    question: "What should you consider before buying?",
    choices: [
      {
        title: "Check your entertainment budget",
        description:
          "See whether tickets fit your spending plan.",
        correct: true,
        feedback:
          "Exactly! Fun experiences are valuable, but they should fit your financial priorities and leave essential expenses covered."
      },
      {
        title: "Skip paying a bill",
        description:
          "Use money reserved for essential expenses.",
        correct: false,
        feedback:
          "Skipping essential bills can lead to fees and other problems. Prioritize necessities before optional purchases."
      },
      {
        title: "Buy immediately using credit",
        description:
          "Worry about paying it back later.",
        correct: false,
        feedback:
          "Credit can be useful when managed responsibly, but carrying a balance may add interest charges."
      }
    ]
  },
  {
    id: "textbooks",
    title: "Expensive textbooks",
    description:
      "Your classes require textbooks costing $250. You want to save money without falling behind.",
    amount: 250,
    question: "What is a good way to reduce the expense?",
    choices: [
      {
        title: "Look for used books or rentals",
        description:
          "Compare used, rental, digital, and library options.",
        correct: true,
        feedback:
          "Great thinking! Comparing textbook options can help reduce education expenses while keeping the materials you need."
      },
      {
        title: "Buy every book brand-new",
        description:
          "Purchase everything without comparing prices.",
        correct: false,
        feedback:
          "New books may sometimes be necessary, but comparing alternatives can help you save money."
      },
      {
        title: "Ignore the required materials",
        description:
          "Assume you will not need any textbooks.",
        correct: false,
        feedback:
          "Skipping required learning materials can hurt your coursework. Look for affordable ways to access them instead."
      }
    ]
  }
];

export default function GoalsView({
  model
}: {
  model: AppModel;
}) {
  const {
    tab,
    goalStep,
    setGoalStep,
    goalName,
    setGoalName,
    goalCategory,
    setGoalCategory,
    target,
    setTarget,
    targetDate,
    setTargetDate,
    monthlySaving,
    setMonthlySaving,
    currentSavings,
    setCurrentSavings,
    budgetSaved,
    availableForGoal,
    actualMonthlySaving,
    goalMonths,
    savingsProgress,
    goals,
    selectedGoalId,
    startNewGoal,
    selectGoal,
    createGoal,
    deleteGoal
  } = model;

  // Independent challenge state
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const challenge = moneyChallenges[challengeIndex];

  const formatMoney = (amount: number) =>
    `$${amount.toLocaleString()}`;

  const canSaveGoal =
    budgetSaved &&
    goalName.trim().length > 0 &&
    target > 0 &&
    currentSavings >= 0 &&
    actualMonthlySaving > 0 &&
    monthlySaving <= availableForGoal;

  // Select a random challenge.
  function startRandomChallenge() {
    const randomIndex = Math.floor(
      Math.random() * moneyChallenges.length
    );

    setChallengeIndex(randomIndex);
    setSelectedAnswer(null);
    setShowResult(false);
    setGoalStep("simulation");
  }

  // Select a different challenge.
  function nextChallenge() {
    const otherChallenges = moneyChallenges
      .map((_, index) => index)
      .filter((index) => index !== challengeIndex);

    const randomIndex = Math.floor(
      Math.random() * otherChallenges.length
    );

    setChallengeIndex(otherChallenges[randomIndex]);
    setSelectedAnswer(null);
    setShowResult(false);
    setGoalStep("simulation");
  }

  // Save a goal and return to the Goals homepage.
  function saveAndReturn() {
    if (!canSaveGoal) return;

    createGoal();
    setGoalStep("overview");
  }

  // Save a goal and start an educational challenge.
  function saveAndChallenge() {
    if (!canSaveGoal) return;

    createGoal();
    startRandomChallenge();
  }

  const forecastBalances = Array.from(
    { length: Math.min(goalMonths ?? 0, 240) },
    (_, index) =>
      Math.min(
        target,
        currentSavings + actualMonthlySaving * (index + 1)
      )
  );

  return (
    <>
      {/* GOALS HOMEPAGE */}
      {tab === "goals" && goalStep === "overview" && (
        <>
          <TopBar title="Goals" />

          <section className="page-intro goals-hero">
            <span className="eyebrow">
              DREAM IT. PLAN IT.
            </span>

            <h1>
              Small steps,
              <br />
              big milestones.
            </h1>

            <p>
              Turn something you want into a plan you can follow.
            </p>
          </section>

          <Button onClick={startNewGoal} icon="plus">
            Create new goal
          </Button>

          <div className="section-title">
            <h2>Active goals</h2>

            <span>
              {goals.length}{" "}
              {goals.length === 1 ? "goal" : "goals"}
            </span>
          </div>

          {goals.length === 0 && (
            <section className="card">
              <p>
                You don't have any savings goals yet.
                Create your first goal to get started!
              </p>
            </section>
          )}

          {goals.map((goal) => {
            const progress =
              goal.target > 0
                ? Math.min(
                    100,
                    (goal.currentSavings / goal.target) * 100
                  )
                : 0;

            return (
              <button
                key={goal.id}
                className="active-goal card"
                onClick={() => selectGoal(goal.id)}
              >
                <span className="goal-art">
                  <Icon name="target" size={34} />
                </span>

                <span className="goal-info">
                  <small>
                    {goal.category.toUpperCase()}
                  </small>

                  <b>{goal.name}</b>

                  <span>
                    <strong>
                      {formatMoney(goal.currentSavings)}
                    </strong>
                    {" "}of {formatMoney(goal.target)}
                  </span>

                  <Progress value={progress} />
                </span>

                <Icon name="arrow" />
              </button>
            );
          })}

          {goals.length > 0 && (
            <section className="milestone card">
              <span className="tile-icon yellow">
                <Icon name="sparkle" />
              </span>

              <div>
                <small>KEEP SAVING</small>

                <b>
                  {goals.length} active savings{" "}
                  {goals.length === 1 ? "goal" : "goals"}
                </b>

                <p>
                  Every contribution brings you closer
                  to your goals!
                </p>
              </div>
            </section>
          )}

          <div className="section-title">
            <h2>Money challenges</h2>
          </div>

          <button
            className="challenge-card"
            onClick={startRandomChallenge}
          >
            <span className="challenge-icon">
              <Icon name="alert" />
            </span>

            <span>
              <small>2 MIN SIMULATION</small>

              <b>Expect the unexpected</b>

              <p>
                Test your financial knowledge with
                real-life situations.
              </p>
            </span>

            <Icon name="arrow" />
          </button>
        </>
      )}

      {/* CREATE OR EDIT GOAL */}
      {tab === "goals" && goalStep === "create" && (
        <>
          <TopBar
            title={
              selectedGoalId
                ? "Edit savings goal"
                : "New savings goal"
            }
            onBack={() => setGoalStep("overview")}
          />

          <section className="step-heading">
            <span className="eyebrow">
              LET'S MAKE A PLAN
            </span>

            <h1>What are you saving for?</h1>

            <p>
              Choose a category and give your goal a name.
            </p>
          </section>

          <div className="category-picks">
            {[
              "Tech",
              "Travel",
              "Emergency",
              "Education"
            ].map((category) => (
              <button
                key={category}
                className={
                  goalCategory === category ? "active" : ""
                }
                onClick={() => setGoalCategory(category)}
              >
                <span>
                  <Icon
                    name={
                      category === "Tech"
                        ? "sparkle"
                        : category === "Emergency"
                          ? "wallet"
                          : category === "Education"
                            ? "book"
                            : "target"
                    }
                  />
                </span>

                {category}
              </button>
            ))}
          </div>

          <label className="field">
            <span>Goal name</span>

            <input
              className="text-input"
              value={goalName}
              onChange={(e) =>
                setGoalName(e.target.value)
              }
              placeholder="e.g. Summer vacation"
            />
          </label>

          <NumberInput
            label="Target amount"
            value={target}
            onChange={setTarget}
          />

          <NumberInput
            label="Amount already saved"
            value={currentSavings}
            onChange={(value) =>
              setCurrentSavings(Math.max(0, value))
            }
          />

          <label className="field">
            <span>Target date</span>

            <span className="date-wrap">
              <Icon name="calendar" />

              <input
                type="date"
                value={targetDate}
                onChange={(e) =>
                  setTargetDate(e.target.value)
                }
              />
            </span>
          </label>

          <section className="budget-check card">
            <span className="tile-icon sage">
              <Icon name="wallet" />
            </span>

            <div>
              <small>YOUR MONTHLY BUDGET</small>

              <b>
                {formatMoney(availableForGoal)} available
              </b>

              <p>
                {budgetSaved
                  ? "After expenses and other savings goals"
                  : "Complete your monthly budget first"}
              </p>
            </div>

            <Icon
              name={budgetSaved ? "check" : "alert"}
            />
          </section>

          <NumberInput
            label="Monthly contribution"
            value={monthlySaving}
            onChange={(value) =>
              setMonthlySaving(
                Math.max(
                  0,
                  Math.min(value, availableForGoal)
                )
              )
            }
          />

          <section className="estimate">
            <div>
              <span>Estimated time</span>

              <b>
                {goalMonths === null
                  ? "Not available"
                  : `${goalMonths} months`}
              </b>
            </div>

            <Progress value={savingsProgress} />

            <p>
              {goalMonths === null
                ? "Set a monthly contribution to calculate your savings timeline."
                : `At ${formatMoney(actualMonthlySaving)}/month, you'll reach your ${formatMoney(target)} goal in approximately ${goalMonths} months.`}
            </p>
          </section>

          <div className="sticky-action">
            <Button
              disabled={!canSaveGoal}
              onClick={() => setGoalStep("review")}
              icon="arrow"
            >
              Review savings plan
            </Button>
          </div>
        </>
      )}

      {/* REVIEW GOAL */}
      {tab === "goals" && goalStep === "review" && (
        <>
          <TopBar
            title="Review goal"
            onBack={() => setGoalStep("create")}
          />

          <section className="goal-review-hero">
            <span className="goal-art">
              <Icon name="target" size={40} />
            </span>

            <span className="eyebrow">
              {goalCategory.toUpperCase()} GOAL
            </span>

            <h1>{goalName}</h1>

            <p>
              Your path to {formatMoney(target)} is ready.
            </p>
          </section>

          <section className="card plan-details">
            <div>
              <span>Starting balance</span>
              <b>{formatMoney(currentSavings)}</b>
            </div>

            <div>
              <span>Monthly contribution</span>
              <b>{formatMoney(actualMonthlySaving)}</b>
            </div>

            <div>
              <span>Estimated time</span>
              <b>
                {goalMonths === null
                  ? "Not available"
                  : `${goalMonths} months`}
              </b>
            </div>

            <div>
              <span>Target date</span>
              <b>
                {new Date(
                  `${targetDate}T00:00:00`
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </b>
            </div>
          </section>

          <section className="forecast card">
            <div>
              <h2>Your savings forecast</h2>

              <b>{Math.round(savingsProgress)}%</b>
            </div>

            <div className="forecast-bars">
              {forecastBalances.map((balance, index) => (
                <i
                  key={index}
                  style={{
                    height: `${Math.max(
                      5,
                      (balance / Math.max(1, target)) * 100
                    )}%`
                  }}
                  title={`Month ${index + 1}: ${formatMoney(balance)}`}
                />
              ))}
            </div>

            <p>
              {formatMoney(currentSavings)} saved today
              <span style={{ whiteSpace: "nowrap" }}>
                {" → "}{formatMoney(target)} goal
              </span>
            </p>
          </section>

          <button
            className="edit-link"
            onClick={() => setGoalStep("create")}
          >
            <Icon name="edit" size={18} />
            Edit goal details
          </button>

          {/* TWO SAVE OPTIONS */}
          <div className="sticky-action dual">
            <Button
              disabled={!canSaveGoal}
              onClick={saveAndReturn}
              icon="check"
            >
              Save Goal & Return to Goals
            </Button>

            <Button
              disabled={!canSaveGoal}
              variant="secondary"
              onClick={saveAndChallenge}
              icon="arrow"
            >
              Save Goal & Try a Challenge
            </Button>
          </div>

          {selectedGoalId && (
            <button
              className="edit-link"
              onClick={() => deleteGoal(selectedGoalId)}
            >
              Delete this goal
            </button>
          )}
        </>
      )}

      {/* INDEPENDENT MONEY CHALLENGES */}
      {tab === "goals" && goalStep === "simulation" && (
        <>
          <TopBar
            title="Money challenge"
            onBack={() => setGoalStep("overview")}
          />

          <section className="sim-header">
            <span className="eyebrow">
              FINANCIAL KNOWLEDGE CHALLENGE
            </span>

            <h1>What would you do?</h1>

            <p>
              Practice making smart money decisions.
              Your actual budget and savings won't change.
            </p>
          </section>

          <section className="surprise-card">
            <span className="bike-icon">
              <Icon name="alert" size={30} />
            </span>

            <small>REAL-LIFE SCENARIO</small>

            <h2>{challenge.title}</h2>

            <strong>
              {formatMoney(challenge.amount)}
            </strong>

            <p>{challenge.description}</p>
          </section>

          <section className="decision">
            <h2>{challenge.question}</h2>

            <p>
              Choose the option you think is best.
            </p>

            {challenge.choices.map((choice, index) => (
              <button
                key={`${challenge.id}-${index}`}
                className={
                  selectedAnswer === index
                    ? "selected"
                    : ""
                }
                disabled={showResult}
                onClick={() => {
                  setSelectedAnswer(index);
                  setShowResult(false);
                }}
              >
                <span>
                  {String.fromCharCode(65 + index)}
                </span>

                <div>
                  <b>{choice.title}</b>
                  <small>{choice.description}</small>
                </div>

                <i />
              </button>
            ))}
          </section>

          {/* EDUCATIONAL FEEDBACK */}
          {showResult && selectedAnswer !== null && (
            <section className="card challenge-result">
              <span className="tile-icon sage">
                <Icon
                  name={
                    challenge.choices[selectedAnswer].correct
                      ? "check"
                      : "book"
                  }
                />
              </span>

              <h2>
                {challenge.choices[selectedAnswer].correct
                  ? "Great decision!"
                  : "Let's learn from that choice"}
              </h2>

              <p>
                {
                  challenge.choices[selectedAnswer]
                    .feedback
                }
              </p>

              {!challenge.choices[selectedAnswer].correct && (
                <p>
                  <strong>Recommended answer: </strong>
                  {
                    challenge.choices.find(
                      (choice) => choice.correct
                    )?.title
                  }
                </p>
              )}

              <p>
                <small>
                  Practice only — no changes were made
                  to your actual budget or savings.
                </small>
              </p>
            </section>
          )}

          <div className="sticky-action dual">
            {!showResult ? (
              <Button
                disabled={selectedAnswer === null}
                onClick={() => setShowResult(true)}
                icon="check"
              >
                Check answer
              </Button>
            ) : (
              <>
                <Button
                  onClick={nextChallenge}
                  icon="arrow"
                >
                  Try another challenge
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => setGoalStep("overview")}
                >
                  Return to Goals
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
