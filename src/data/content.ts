export type Tab = "home" | "learn" | "budget" | "goals";
export type LessonStep = "list" | "intro" | "quiz" | "complete" | "failed";
export type BudgetStep = "overview" | "edit" | "review" | "saved";
export type GoalStep = "overview" | "create" | "review" | "simulation" | "outcome";
export type IconName =
  | "home"
  | "book"
  | "wallet"
  | "target"
  | "flame"
  | "star"
  | "arrow"
  | "back"
  | "check"
  | "lock"
  | "sparkle"
  | "calendar"
  | "edit"
  | "plus"
  | "reset"
  | "alert";

export const expenses = [
  { key: "groceries", label: "Groceries", icon: "sparkle", color: "#8FB996" },
  { key: "transportation", label: "Transportation", icon: "arrow", color: "#F7DC88" },
  { key: "entertainment", label: "Entertainment", icon: "star", color: "#F4C7AB" },
  { key: "school", label: "School supplies", icon: "book", color: "#9EC5D5" },
  { key: "savings", label: "Savings", icon: "target", color: "#2F6B4F" },
] as const;

export type ExpenseKey = (typeof expenses)[number]["key"];
export type Allocations = Record<ExpenseKey, number>;

export const defaultAllocations: Allocations = {
  groceries: 300,
  transportation: 120,
  entertainment: 160,
  school: 120,
  savings: 250,
};


export const lessons = [
  {
    id: "budgeting-basics",
    title: "Budgeting Basics",
    detail: "Make every dollar count",
    xp: 50,
    icon: "wallet",
    color: "sage",
    done: false,
    duration: "4 MIN",

    description:
      "A budget is a plan for how you spend and save your money. Learn to give every dollar a purpose.",

    objectives: [
      "Understand income and expenses",
      "Learn why budgeting matters",
      "Make a smart spending decision",
    ],

    tip:
      "Start by tracking what you earn and spend. Small changes can make a big difference!",

    question:
      "You earn $500 this month. What is the best way to manage your money?",

    options: [
      "Spend everything before the month ends",
      "Only track your biggest purchases",
      "Plan for expenses and savings before spending",
      "Save whatever money happens to be left",
    ],

    correctAnswer:
      "Plan for expenses and savings before spending",

    correctExplanation:
      "Exactly! A budget helps you plan for bills, everyday spending, and savings before your money is gone.",

    incorrectExplanation:
      "A good budget plans ahead. Consider your income, necessary expenses, optional spending, and savings.",

    completionMessage:
      "You learned how to make a plan for your money!",

    failureTip:
      "Remember that budgeting means planning how you will use your income before spending it.",
  },

  {
    id: "needs-vs-wants",
    title: "Needs vs. Wants",
    detail: "Spend on what matters",
    xp: 40,
    icon: "sparkle",
    color: "yellow",
    done: false,
    duration: "4 MIN",

    description:
      "Learn to separate essential expenses from optional purchases so you can prioritize what matters most.",

    objectives: [
      "Identify everyday needs",
      "Recognize optional spending",
      "Prioritize essential expenses",
    ],

    tip:
      "There's nothing wrong with buying things you want. Just make sure your needs are covered first!",

    question:
      "Which of the following is typically considered a need?",

    options: [
      "Concert tickets",
      "Groceries",
      "Streaming subscriptions",
      "Designer sneakers",
    ],

    correctAnswer: "Groceries",

    correctExplanation:
      "Correct! Groceries provide food needed for everyday health and well-being, making them a need.",

    incorrectExplanation:
      "Needs are essential for daily living, such as food and housing. Groceries are the best answer.",

    completionMessage:
      "You can now make smarter choices between needs and wants!",

    failureTip:
      "Ask yourself: Is this essential for daily life, or something I could live without?",
  },

  {
    id: "credit-cards",
    title: "Credit Cards",
    detail: "Borrow with confidence",
    xp: 60,
    icon: "star",
    color: "peach",
    done: false,
    duration: "5 MIN",

    description:
      "Credit cards let you borrow money for purchases. Learn how interest works and how to use credit responsibly.",

    objectives: [
      "Understand how credit cards work",
      "Learn what interest means",
      "Identify responsible payment habits",
    ],

    tip:
      "Paying your full statement balance by the due date generally helps you avoid purchase interest when your grace period applies!",

    question:
      "What is generally the best way to avoid paying interest on credit card purchases?",

    options: [
      "Only pay the minimum payment",
      "Pay the full statement balance by the due date",
      "Ignore the bill until next month",
      "Use the card until you reach its limit",
    ],

    correctAnswer:
      "Pay the full statement balance by the due date",

    correctExplanation:
      "That's right! Paying the full statement balance on time generally avoids purchase interest when your card's grace period applies.",

    incorrectExplanation:
      "Paying only the minimum can leave a balance that accrues interest. Paying your full statement balance on time is generally the better strategy.",

    completionMessage:
      "You learned how to use credit cards more responsibly!",

    failureTip:
      "A credit card is borrowed money. Interest can make purchases more expensive when balances aren't paid in full.",
  },

  {
    id: "saving-money",
    title: "Saving Money",
    detail: "Grow your rainy-day fund",
    xp: 50,
    icon: "target",
    color: "blue",
    done: false,
    duration: "4 MIN",

    description:
      "Saving money helps you prepare for emergencies and achieve future goals, even when you start small.",

    objectives: [
      "Understand why saving matters",
      "Learn about emergency funds",
      "Build a consistent saving habit",
    ],

    tip:
      "You don't need to save a huge amount at once. Saving a little consistently can add up!",

    question:
      "You want to build an emergency fund. Which approach is most effective?",

    options: [
      "Save only when you have a lot of extra money",
      "Spend first and hope some money remains",
      "Set aside a manageable amount regularly",
      "Use a credit card for every unexpected expense",
    ],

    correctAnswer:
      "Set aside a manageable amount regularly",

    correctExplanation:
      "Exactly! Saving a manageable amount consistently can help you build an emergency fund over time.",

    incorrectExplanation:
      "Consistency matters more than starting with a large amount. Setting aside money regularly builds a reliable savings habit.",

    completionMessage:
      "You're ready to start building stronger saving habits!",

    failureTip:
      "Think about consistency. Small, regular contributions can help you prepare for unexpected expenses.",
  },

  {
    id: "student-loans",
    title: "Student Loans",
    detail: "Understand before you borrow",
    xp: 70,
    icon: "book",
    color: "lavender",
    done: false,
    duration: "5 MIN",

    description:
      "Student loans can help cover education costs, but borrowed money generally must be repaid with interest.",

    objectives: [
      "Understand loan principal",
      "Learn how interest affects repayment",
      "Recognize the importance of borrowing carefully",
    ],

    tip:
      "Before accepting a student loan, compare your options and understand when interest starts accumulating!",

    question:
      "You borrow $5,000 for college. What does the loan's principal represent?",

    options: [
      "The total interest you will pay",
      "The original amount you borrowed",
      "Your monthly loan payment",
      "The amount of financial aid you received as grants",
    ],

    correctAnswer:
      "The original amount you borrowed",

    correctExplanation:
      "Correct! Principal is the original amount borrowed. Interest is an additional borrowing cost that may increase what you owe.",

    incorrectExplanation:
      "Principal is the original loan amount, not the interest or monthly payment. Interest is an additional cost of borrowing.",

    completionMessage:
      "You now understand an important part of student loan borrowing!",

    failureTip:
      "Remember: principal is the original borrowed amount, while interest is the cost charged for borrowing.",
  },
] as const;


