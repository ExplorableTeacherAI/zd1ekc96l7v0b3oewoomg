import { useState } from "react";
import {
    Button,
    Input,
    RadioGroup,
    RadioGroupItem,
    Label,
} from "@/components/atoms";

interface BasePracticeQuestion {
    /** Unique id for the question */
    id: string;
    /** The question text shown to the student */
    prompt: string;
    /** Shown when the student answers correctly — say why it is right */
    correctFeedback: string;
    /**
     * Guidance for wrong answers, keyed by the option id (multiple choice) or by
     * the typed number (typed answer). Never the answer — a next thing to try.
     */
    hints: Record<string, string>;
}

/** A multiple-choice question (the default). */
export interface ChoicePracticeQuestion extends BasePracticeQuestion {
    kind?: "choice";
    options: { id: string; label: string }[];
    correctId: string;
}

/** A question the student answers by typing a number. */
export interface NumberPracticeQuestion extends BasePracticeQuestion {
    kind: "number";
    correctValue: number;
    /** How far out an answer may be and still count. Defaults to 0. */
    tolerance?: number;
    /** Shown beside the answer box, e.g. "degrees". */
    unit?: string;
    /** Fallback guidance when the typed answer is not one we have a hint for. */
    wrongFeedback: string;
}

export type PracticeQuestion = ChoicePracticeQuestion | NumberPracticeQuestion;

interface PracticeQuestionsProps {
    questions: PracticeQuestion[];
}

/**
 * A short set of multiple-choice practice questions with immediate,
 * answer-specific feedback. Wrong answers get a nudge back to the
 * section's visual rather than the answer itself.
 */
export const PracticeQuestions = ({ questions }: PracticeQuestionsProps) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [checked, setChecked] = useState<Record<string, boolean>>({});

    return (
        <div className="space-y-6">
            {questions.map((question, index) => {
                const chosen = answers[question.id] ?? "";
                const isChecked = checked[question.id];
                const isNumberQuestion = question.kind === "number";

                const typedValue = Number(chosen.replace(/[^0-9.-]/g, ""));
                const isCorrect = isNumberQuestion
                    ? chosen.trim() !== "" &&
                      Number.isFinite(typedValue) &&
                      Math.abs(typedValue - question.correctValue) <= (question.tolerance ?? 0)
                    : chosen === (question as ChoicePracticeQuestion).correctId;

                const hintKey = isNumberQuestion ? String(typedValue) : chosen;
                const fallback = isNumberQuestion
                    ? question.wrongFeedback
                    : "Not quite — look back at the diagram above and try again.";

                const record = (value: string) => {
                    setAnswers((previous) => ({ ...previous, [question.id]: value }));
                    setChecked((previous) => ({ ...previous, [question.id]: false }));
                };

                return (
                    <div key={question.id} className="rounded-lg border border-slate-200 p-4">
                        <div className="font-medium text-slate-800 mb-3">
                            {index + 1}. {question.prompt}
                        </div>

                        {isNumberQuestion ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    type="text"
                                    inputMode="decimal"
                                    value={chosen}
                                    onChange={(event) => record(event.target.value)}
                                    className="w-32"
                                    placeholder="Your answer"
                                    aria-label="Type your answer"
                                />
                                {question.unit && (
                                    <span className="text-slate-600">{question.unit}</span>
                                )}
                            </div>
                        ) : (
                            <RadioGroup
                                value={chosen}
                                onValueChange={record}
                                className="space-y-2"
                            >
                                {(question as ChoicePracticeQuestion).options.map((option) => (
                                    <div key={option.id} className="flex items-center gap-2">
                                        <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
                                        <Label
                                            htmlFor={`${question.id}-${option.id}`}
                                            className="cursor-pointer text-slate-700"
                                        >
                                            {option.label}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )}

                        <Button
                            size="sm"
                            className="mt-3"
                            disabled={chosen.trim() === ""}
                            onClick={() => setChecked((previous) => ({ ...previous, [question.id]: true }))}
                        >
                            Check answer
                        </Button>

                        {isChecked && (
                            <div
                                className={`mt-3 rounded-md px-3 py-2 text-sm ${
                                    isCorrect
                                        ? "bg-emerald-50 text-emerald-800"
                                        : "bg-amber-50 text-amber-800"
                                }`}
                            >
                                {isCorrect ? question.correctFeedback : question.hints[hintKey] ?? fallback}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
