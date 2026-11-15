
import { supabase } from "../lib/supabase";

export type LessonProgress = {
  user_id: string;
  lesson_id: string;
  completed_at: string;
};

// Get the currently logged-in user's ID
async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("User is not logged in.");

  return user.id;
}

// Retrieve all completed lessons
export async function getLessonProgress(): Promise<LessonProgress[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (error) throw error;

  return data as LessonProgress[];
}

// Check whether a particular lesson is completed
export async function isLessonCompleted(
  lessonId: string
): Promise<boolean> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (error) throw error;

  return data !== null;
}

// Mark a lesson as completed
export async function completeLesson(
  lessonId: string
): Promise<LessonProgress> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("lesson_progress")
    .upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
      },
      {
        onConflict: "user_id,lesson_id",
        ignoreDuplicates: true,
      }
    )
    .select()
    .maybeSingle();

  if (error) throw error;

  // When a lesson was already completed, ignoreDuplicates
  // may return no row. Retrieve the existing record.
  if (!data) {
    const { data: existing, error: fetchError } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .single();

    if (fetchError) throw fetchError;

    return existing as LessonProgress;
  }

  return data as LessonProgress;
}

// Remove completion status for a lesson
export async function resetLesson(
  lessonId: string
): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("lesson_progress")
    .delete()
    .eq("user_id", userId)
    .eq("lesson_id", lessonId);

  if (error) throw error;
}
