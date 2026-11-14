
CREATE TABLE public.savings_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (length(trim(name)) > 0),
    category TEXT NOT NULL DEFAULT 'Other',
    target_amount NUMERIC(12, 2) NOT NULL
        CHECK (target_amount > 0),
    target_date DATE,
    monthly_saving NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (monthly_saving >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX savings_goals_user_id_idx
ON public.savings_goals(user_id);

ALTER TABLE public.savings_goals
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own goals"
ON public.savings_goals
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create their own goals"
ON public.savings_goals
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own goals"
ON public.savings_goals
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own goals"
ON public.savings_goals
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);
