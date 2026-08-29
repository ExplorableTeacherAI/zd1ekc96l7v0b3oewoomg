import { useState } from "react";
import {
    Button,
    RadioGroup,
    RadioGroupItem,
    Label,
} from "@/components/atoms";

export interface PracticeQuestion {
    /** Unique id for the question */
    id: string;
    /** The question text shown to the student */
    prompt: string;
    /** Answer choices */
    options: { id: string; label: string }[];
    /** The id of the correct option */
    correctId: string;
    /** Shown when the student answers correctly — say why it is right */
    correctFeedback: string;
    /** Per-wrong-answer guidance: never the answer, always a next thing to try */
    hints: Record<string, string>;
}

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
                const chosen = answers[question.id];
                const isChecked = checked[question.id];
                const isCorrect = chosen === question.correctId;

                return (
                    <div key={question.id} className="rounded-lg border border-slate-200 p-4">
                        <div className="font-medium text-slate-800 mb-3">
                            {index + 1}. {question.prompt}
                        </div>

                        <RadioGroup
                            value={chosen ?? ""}
                            onValueChange={(value) => {
                                setAnswers((previous) => ({ ...previous, [question.id]: value }));
                                setChecked((previous) => ({ ...previous, [question.id]: false }));
                            }}
                            className="space-y-2"
                        >
                            {question.options.map((option) => (
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

                        <Button
                            size="sm"
                            className="mt-3"
                            disabled={!chosen}
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
                                {isCorrect
                                    ? question.correctFeedback
                                    : question.hints[chosen ?? ""] ??
                                      "Not quite — look back at the diagram above and try again."}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
