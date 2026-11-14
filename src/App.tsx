
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Tab } from "./data/content";

import { Icon } from "./components/UI";
import { useAppModel } from "./features/useAppModel";
import HomeView from "./features/HomeView";
import LearnView from "./features/LearnView";
import BudgetView from "./features/BudgetView";
import GoalsView from "./features/GoalsView";
import AuthView from "./features/AuthView";
import { supabase } from "./lib/supabase";

function PennyPathApp() {
  const model = useAppModel();
  const { tab, navigate } = model;

  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    setLogoutError("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setLogoutError(error.message);
    }
  }

  return (
    <div className="app-bg">
      <main className="phone-shell">
        <div className="content">

          <div className="account-bar">
            <span>My PennyPath</span>

            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>

          {logoutError && (
            <p role="alert" className="auth-error">
              {logoutError}
            </p>
          )}

          <HomeView model={model} />

          <LearnView model={model} />

          <BudgetView model={model} />

          <GoalsView model={model} />
        </div>

        <nav
          className="bottom-nav"
          aria-label="Main navigation"
        >
          {(
            [
              ["home", "Home"],
              ["learn", "Learn"],
              ["budget", "Budget"],
              ["goals", "Goals"],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              className={tab === key ? "active" : ""}
              onClick={() => navigate(key)}
            >
              <span>
                <Icon
                  name={
                    key === "learn"
                      ? "book"
                      : key === "budget"
                      ? "wallet"
                      : key === "goals"
                      ? "target"
                      : "home"
                  }
                />
              </span>
              {label}
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(
      ({ data, error }) => {
        if (!active) return;

        if (error) {
          console.error(
            "Session error:",
            error.message
          );
        }

        setSession(data.session);
        setLoading(false);
      }
    ).catch((error) => {
      if (!active) return;
      console.error("Session check failed:", error);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!active) return;

        setSession(newSession);
        setLoading(false);
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="app-bg">
        <main className="phone-shell">
          <div className="auth-screen">
            <p>Loading PennyPath...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="app-bg">
        <main className="phone-shell">
          <AuthView />
        </main>
      </div>
    );
  }

  return <PennyPathApp key={session.user.id} />;
}

export default App;
