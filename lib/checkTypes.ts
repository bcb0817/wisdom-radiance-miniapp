export type SymptomId = "hot_flash" | "sweating" | "cold" | "palpitations" | "sleep" | "irritability" | "mood" | "dizziness" | "fatigue" | "pain";
export type Answer = 0 | 1 | 2 | 3;
export type Answers = Record<SymptomId, Answer>;
export type BurdenLevel = "low" | "moderate" | "high";
export type CheckInput = {answers: Answers; age_range: string; awareness_level: string};
export type CheckScore = {total_score: number; burden_level: BurdenLevel; top_symptoms: SymptomId[]; needs_medical_info: boolean};
export type CheckResult = CheckInput & CheckScore & {scoring_version: string; created_at: string; id?: string};
export type Voice = {id: string; title: string; body: string; topic: string; tags: string[]; age: string; href: string; sample?: boolean};
