
CREATE TABLE public.budgets (
    user_id UUID PRIMARY KEY
        REFERENCES auth.users(id) ON DELETE CASCADE,
    income NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (income >= 0),
    allocations JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.budgets
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own budget"
ON public.budgets
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create their own budget"
ON public.budgets
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own budget"
ON public.budgets
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own budget"
ON public.budgets
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);
