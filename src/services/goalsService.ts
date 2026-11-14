
import { supabase } from "../lib/supabase";

export type SavingsGoal = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  target_amount: number;
  target_date: string | null;
  monthly_saving: number;
  created_at: string;
  updated_at: string;
};

export type GoalInput = {
  name: string;
  category: string;
  target_amount: number;
  target_date: string | null;
  monthly_saving: number;
};

// Get the currently authenticated user
async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("User is not logged in.");

  return user.id;
}

// Retrieve all savings goals for the logged-in user
export async function getGoals(): Promise<SavingsGoal[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("savings_goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as SavingsGoal[];
}

// Create a new savings goal
export async function createGoal(
  goal: GoalInput
): Promise<SavingsGoal> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("savings_goals")
    .insert({
      ...goal,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;

  return data as SavingsGoal;
}

// Update an existing savings goal
export async function updateGoal(
  goalId: string,
  updates: Partial<GoalInput>
): Promise<SavingsGoal> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("savings_goals")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", goalId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;

  return data as SavingsGoal;
}

// Delete an existing savings goal
export async function deleteGoal(
  goalId: string
): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("savings_goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", userId);

  if (error) throw error;
}
