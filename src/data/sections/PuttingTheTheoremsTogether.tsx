import { useState, type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph, InlineFormula, Table, Button } from "@/components/atoms";
import { PracticeQuestions, type PracticeQuestion } from "./PracticeQuestions";
import { pointOnCircle, directionDegrees, minorArcPath } from "./circleGeometry";


/* ------------------------------------------------------------------ */
/* Worked example, revealed one step at a time                         */
/* ------------------------------------------------------------------ */

const VIEWBOX_WIDTH = 560;
const VIEWBOX_HEIGHT = 430;
const CENTRE_X = 280;
const CENTRE_Y = 215;
const RADIUS = 145;

const POINT_A = pointOnCircle(CENTRE_X, CENTRE_Y, RADIUS, 235);
const POINT_B = pointOnCircle(CENTRE_X, CENTRE_Y, RADIUS, 305);
const POINT_C = pointOnCircle(CENTRE_X, CENTRE_Y, RADIUS, 90);
const CENTRE = { x: CENTRE_X, y: CENTRE_Y };

interface WorkedStep {
    theorem: string;
    reasoning: string;
    /** Which parts of the diagram to light up while this step is on screen. */
    highlight: "given" | "centre" | "radii" | "answer";
}

const WORKED_STEPS: WorkedStep[] = [
    {
        theorem: "Angle at the centre",
        reasoning: "Angle ACB = 35\u00b0 is the angle at the rim, so the angle at the centre on the same arc is double it: angle AOB = 2 \u00d7 35\u00b0 = 70\u00b0.",
        highlight: "centre",
    },
    {
        theorem: "Radii are equal",
        reasoning: "OA and OB are both radii, so they are the same length and triangle AOB is isosceles.",
        highlight: "radii",
    },
    {
        theorem: "Angles in a triangle",
        reasoning: "The two base angles are equal and all three add to 180\u00b0, so angle OAB = (180\u00b0 \u2212 70\u00b0) \u00f7 2 = 55\u00b0.",
        highlight: "answer",
    },
];

const HIGHLIGHT = "#4f46e5";
const DIM = "#cbd5e1";
const GIVEN = "#0ea5e9";
const ANSWER = "#059669";

const WorkedExampleWalkthrough = () => {
    const [revealed, setRevealed] = useState(0);

    const active = (name: WorkedStep["highlight"]) =>
        WORKED_STEPS.slice(0, revealed).some((step) => step.highlight === name);

    const radiiColour = active("radii") || active("answer") ? HIGHLIGHT : DIM;

    return (
        <div className="w-full">
            <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                <span className="font-semibold text-slate-900">Question: </span>
                O is the centre of the circle. Angle ACB = 35&#176;. Work out angle OAB.
            </div>

            <svg
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                className="w-full h-auto max-w-[560px] mx-auto block"
                role="img"
                aria-label="A circle with centre O and points A, B and C, used for the worked example"
            >
                <circle cx={CENTRE_X} cy={CENTRE_Y} r={RADIUS} fill="none" stroke="#94a3b8" strokeWidth={2} />

                {/* Lines from C down to A and B — the given angle */}
                <line x1={POINT_C.x} y1={POINT_C.y} x2={POINT_A.x} y2={POINT_A.y} stroke={GIVEN} strokeWidth={3} />
                <line x1={POINT_C.x} y1={POINT_C.y} x2={POINT_B.x} y2={POINT_B.y} stroke={GIVEN} strokeWidth={3} />
                <path
                    d={minorArcPath(
                        POINT_C.x,
                        POINT_C.y,
                        34,
                        directionDegrees(POINT_C, POINT_A),
                        directionDegrees(POINT_C, POINT_B),
                    )}
                    fill="none"
                    stroke={GIVEN}
                    strokeWidth={2.5}
                />
                <text x={POINT_C.x} y={POINT_C.y + 60} textAnchor="middle" fontSize="16" fontWeight="600" fill={GIVEN}>
                    35&#176;
                </text>

                {/* The two radii */}
                <line x1={CENTRE_X} y1={CENTRE_Y} x2={POINT_A.x} y2={POINT_A.y} stroke={radiiColour} strokeWidth={3} />
                <line x1={CENTRE_X} y1={CENTRE_Y} x2={POINT_B.x} y2={POINT_B.y} stroke={radiiColour} strokeWidth={3} />
                <line x1={POINT_A.x} y1={POINT_A.y} x2={POINT_B.x} y2={POINT_B.y} stroke={radiiColour} strokeWidth={3} />

                {/* Angle at the centre */}
                <path
                    d={minorArcPath(
                        CENTRE_X,
                        CENTRE_Y,
                        40,
                        directionDegrees(CENTRE, POINT_A),
                        directionDegrees(CENTRE, POINT_B),
                    )}
                    fill="none"
                    stroke={active("centre") ? HIGHLIGHT : DIM}
                    strokeWidth={2.5}
                />
                {active("centre") && (
                    <text x={CENTRE_X} y={CENTRE_Y + 66} textAnchor="middle" fontSize="16" fontWeight="600" fill={HIGHLIGHT}>
                        70&#176;
                    </text>
                )}

                {/* The angle being asked for */}
                <path
                    d={minorArcPath(
                        POINT_A.x,
                        POINT_A.y,
                        30,
                        directionDegrees(POINT_A, CENTRE),
                        directionDegrees(POINT_A, POINT_B),
                    )}
                    fill="none"
                    stroke={active("answer") ? ANSWER : "#94a3b8"}
                    strokeWidth={2.5}
                />
                <text
                    x={POINT_A.x + 34}
                    y={POINT_A.y - 16}
                    textAnchor="middle"
                    fontSize="16"
                    fontWeight="600"
                    fill={active("answer") ? ANSWER : "#64748b"}
                >
                    {active("answer") ? "55\u00b0" : "?"}
                </text>

                {/* Points and their names */}
                <circle cx={CENTRE_X} cy={CENTRE_Y} r={6} fill="#dc2626" />
                <circle cx={POINT_A.x} cy={POINT_A.y} r={6} fill="#334155" />
                <circle cx={POINT_B.x} cy={POINT_B.y} r={6} fill="#334155" />
                <circle cx={POINT_C.x} cy={POINT_C.y} r={6} fill="#334155" />
                <text x={CENTRE_X - 14} y={CENTRE_Y + 6} textAnchor="end" fontSize="16" fontWeight="600" fill="#dc2626">
                    O
                </text>
                <text x={POINT_A.x - 16} y={POINT_A.y + 22} textAnchor="end" fontSize="16" fontWeight="600" fill="#334155">
                    A
                </text>
                <text x={POINT_B.x + 16} y={POINT_B.y + 22} textAnchor="start" fontSize="16" fontWeight="600" fill="#334155">
                    B
                </text>
                <text x={POINT_C.x} y={POINT_C.y - 18} textAnchor="middle" fontSize="16" fontWeight="600" fill="#334155">
                    C
                </text>
            </svg>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
                <Button
                    size="sm"
                    variant="outline"
                    disabled={revealed === 0}
                    onClick={() => setRevealed((step) => Math.max(0, step - 1))}
                >
                    Back a step
                </Button>
                <Button
                    size="sm"
                    disabled={revealed === WORKED_STEPS.length}
                    onClick={() => setRevealed((step) => Math.min(WORKED_STEPS.length, step + 1))}
                >
                    {revealed === 0 ? "Show the first step" : "Next step"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setRevealed(0)}>
                    Start again
                </Button>
            </div>

            <div className="mt-4 space-y-3">
                {WORKED_STEPS.slice(0, revealed).map((step, index) => (
                    <div key={step.theorem} className="rounded-lg border border-indigo-200 bg-indigo-50/60 px-4 py-3">
                        <div className="text-sm font-semibold text-indigo-700 mb-1">
                            Step {index + 1} &mdash; {step.theorem}
                        </div>
                        <div className="text-slate-700">{step.reasoning}</div>
                    </div>
                ))}
                {revealed === WORKED_STEPS.length && (
                    <div className="rounded-lg bg-emerald-50 px-4 py-3 font-semibold text-emerald-800">
                        Answer: angle OAB = 55&#176;
                    </div>
                )}
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Practice                                                            */
/* ------------------------------------------------------------------ */

const THEOREMS_TOGETHER_QUESTIONS: PracticeQuestion[] = [
    {
        id: "tangent-radius-triangle",
        prompt: "A tangent touches a circle at T. O is the centre and P is a point further along the tangent. In triangle OTP, angle TOP = 34\u00b0. What is angle OPT?",
        options: [
            { id: "fifty-six", label: "56\u00b0" },
            { id: "sixty-six", label: "66\u00b0" },
            { id: "one-forty-six", label: "146\u00b0" },
        ],
        correctId: "fifty-six",
        correctFeedback: "Yes. The tangent meets the radius OT at 90\u00b0, so the triangle has 90 + 34, leaving 56\u00b0.",
        hints: {
            "sixty-six": "That takes 34 from 100. Check the summary table above for the angle where a tangent meets a radius, then use the angles of the triangle.",
            "one-forty-six": "That is 180 minus 34 and ignores the third angle. What angle does the tangent make with OT?",
        },
    },
    {
        id: "alternate-segment-then-centre",
        prompt: "A tangent touches a circle at T, and chord TA makes an angle of 64\u00b0 with it. What is the angle at the centre standing on TA?",
        options: [
            { id: "one-twenty-eight", label: "128\u00b0" },
            { id: "sixty-four", label: "64\u00b0" },
            { id: "thirty-two", label: "32\u00b0" },
        ],
        correctId: "one-twenty-eight",
        correctFeedback: "Correct. The alternate segment gives 64\u00b0 at the rim, and the centre angle is double that.",
        hints: {
            "sixty-four": "That is only the first step. The alternate segment theorem gives you the angle at the rim \u2014 what do you do to reach the centre?",
            "thirty-two": "That halves when it should double. Work through the example above and notice which direction the doubling goes.",
        },
    },
    {
        id: "centre-then-cyclic",
        prompt: "The angle at the centre standing on chord AB is 140\u00b0. C sits on the major arc and D on the minor arc, so ACBD is a cyclic quadrilateral. What is angle ADB?",
        options: [
            { id: "one-ten", label: "110\u00b0" },
            { id: "seventy", label: "70\u00b0" },
            { id: "forty", label: "40\u00b0" },
        ],
        correctId: "one-ten",
        correctFeedback: "Right. Angle ACB is half of 140\u00b0, so 70\u00b0, and D is opposite C, giving 180 \u2212 70 = 110\u00b0.",
        hints: {
            seventy: "That is the angle at C, one step short. D is on the other arc \u2014 which rule links two opposite corners?",
            forty: "That subtracts 140 from 180 directly. Find the angle at C first, then use the opposite corners rule.",
        },
    },
];

export const puttingTheTheoremsTogetherBlocks: ReactElement[] = [
    <StackLayout key="layout-theorems-together-heading" maxWidth="xl">
        <Block id="theorems-together-heading" padding="md">
            <EditableH2 id="h2-theorems-together-heading" blockId="theorems-together-heading">
                Putting the Theorems Together
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-theorems-together-chaining" maxWidth="xl">
        <Block id="theorems-together-chaining" padding="sm">
            <EditableParagraph id="para-theorems-together-chaining" blockId="theorems-together-chaining">
                Exam questions rarely need only one rule. You find one angle with a first
                theorem, then feed that answer into a second. Two more facts complete the set: a
                tangent meets a radius at <InlineFormula latex="90^\circ" />, and the alternate
                segment theorem makes the angle between a tangent and a chord equal to the angle
                in the far segment. Work through the example below one step at a time, and read
                the reason beside each line.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-theorems-summary-table" maxWidth="xl">
        <Block id="theorems-summary-table" padding="sm">
            <Table
                columns={[
                    { header: "Theorem", align: "left" },
                    { header: "What it says", align: "left" },
                    { header: "Look for", align: "left" },
                ]}
                rows={[
                    {
                        cells: [
                            "Angle at the centre",
                            "The centre angle is double the angle at the rim on the same arc",
                            "Two lines meeting at the centre",
                        ],
                    },
                    {
                        cells: [
                            "Angle in a semicircle",
                            <span key="semicircle-value">Always <InlineFormula latex="90^\circ" /></span>,
                            "A chord passing through the centre",
                        ],
                    },
                    {
                        cells: [
                            "Angles in the same segment",
                            "Angles from the same chord on the same side are equal",
                            "Two points looking at one chord",
                        ],
                    },
                    {
                        cells: [
                            "Cyclic quadrilateral",
                            <span key="cyclic-value">Opposite angles add to <InlineFormula latex="180^\circ" /></span>,
                            "Four corners all on the rim",
                        ],
                    },
                    {
                        cells: [
                            "Tangent and radius",
                            <span key="tangent-value">They meet at <InlineFormula latex="90^\circ" /></span>,
                            "A line touching the circle once",
                        ],
                    },
                    {
                        cells: [
                            "Alternate segment",
                            "Tangent-chord angle equals the angle in the far segment",
                            "A tangent with a chord from the touching point",
                        ],
                    },
                ]}
                color="#6366f1"
                caption="The circle theorems at a glance"
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-theorems-together-visual" maxWidth="xl">
        <Block id="theorems-together-visual" padding="sm" hasVisualization>
            <WorkedExampleWalkthrough />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-theorems-together-practice" maxWidth="xl">
        <Block id="theorems-together-practice" padding="sm">
            <PracticeQuestions questions={THEOREMS_TOGETHER_QUESTIONS} />
        </Block>
    </StackLayout>,
];
