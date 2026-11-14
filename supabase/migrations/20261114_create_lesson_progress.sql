
CREATE TABLE public.lesson_progress (
    user_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL
        CHECK (length(trim(lesson_id)) > 0),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id, lesson_id)
);

ALTER TABLE public.lesson_progress
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lesson progress"
ON public.lesson_progress
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can record their own lesson progress"
ON public.lesson_progress
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own lesson progress"
ON public.lesson_progress
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own lesson progress"
ON public.lesson_progress
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);
