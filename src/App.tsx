import type { Tab } from "./data/content";
import { Icon } from "./components/UI";
import { useAppModel } from "./features/useAppModel";
import HomeView from "./features/HomeView";
import LearnView from "./features/LearnView";
import BudgetView from "./features/BudgetView";
import GoalsView from "./features/GoalsView";
function App() {
  const model = useAppModel();
  const { tab, navigate } = model;
  return (
    <div className="app-bg">
      <main className="phone-shell">
        <div className="content">
          <HomeView model={model} />

          <LearnView model={model} />

          <BudgetView model={model} />

          <GoalsView model={model} />
        </div>

        <nav className="bottom-nav" aria-label="Main navigation">
          {([["home", "Home"], ["learn", "Learn"], ["budget", "Budget"], ["goals", "Goals"]] as [Tab, string][]).map(([key, label]) => (
            <button key={key} className={tab === key ? "active" : ""} onClick={() => navigate(key)}><span><Icon name={key === "learn" ? "book" : key === "budget" ? "wallet" : key === "goals" ? "target" : "home"} /></span>{label}</button>
          ))}
        </nav>
      </main>
    </div>
  );
}

export default App;
