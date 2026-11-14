
import { supabase } from "../lib/supabase";
import type { Allocations } from "../data/content";

export type Budget = {
  user_id: string;
  income: number;
  allocations: Allocations;
  updated_at: string;
};

// Retrieve the currently logged-in user's budget
export async function getBudget(): Promise<Budget | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("User is not logged in.");

  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  return data as Budget | null;
}

// Create or update the logged-in user's budget
export async function saveBudget(
  income: number,
  allocations: Allocations
): Promise<Budget> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("User is not logged in.");

  const { data, error } = await supabase
    .from("budgets")
    .upsert(
      {
        user_id: user.id,
        income,
        allocations,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) throw error;

  return data as Budget;
}
