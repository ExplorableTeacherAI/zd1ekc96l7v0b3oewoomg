import { useCallback, useRef, useState, type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph, InlineFormula, Button } from "@/components/atoms";
import { PracticeQuestions, type PracticeQuestion } from "./PracticeQuestions";
import { pointOnCircle, angleAtVertex, directionDegrees, minorArcPath } from "./circleGeometry";

/* ------------------------------------------------------------------ */
/* Layout constants                                                    */
/* ------------------------------------------------------------------ */

const VIEWBOX_WIDTH = 560;
const VIEWBOX_HEIGHT = 470;
const CENTRE_X = 280;
const CENTRE_Y = 235;
const RADIUS = 145;

type BaseLineMode = "diameter" | "chord";

/** Each base line: where its two ends sit, and where the top point may travel. */
const BASE_LINES: Record<
    BaseLineMode,
    { leftAngle: number; rightAngle: number; travelStart: number; travelSweep: number; label: string }
> = {
    diameter: {
        leftAngle: 180,
        rightAngle: 0,
        travelStart: 10,
        travelSweep: 160,
        label: "Diameter — passes through the centre",
    },
    chord: {
        leftAngle: 200,
        rightAngle: 340,
        travelStart: -10,
        travelSweep: 200,
        label: "Ordinary chord — misses the centre",
    },
};

const toPoint = (angleDegrees: number) => pointOnCircle(CENTRE_X, CENTRE_Y, RADIUS, angleDegrees);

/* ------------------------------------------------------------------ */
/* Interactive visual                                                  */
/* ------------------------------------------------------------------ */

const RIGHT_ANGLE_COLOUR = "#059669";
const OTHER_ANGLE_COLOUR = "#d97706";

const SemicircleAngleExplorer = () => {
    const [mode, setMode] = useState<BaseLineMode>("diameter");
    const [position, setPosition] = useState(45);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const draggingRef = useRef(false);

    const base = BASE_LINES[mode];
    const left = toPoint(base.leftAngle);
    const right = toPoint(base.rightAngle);
    const topAngle = base.travelStart + (position / 100) * base.travelSweep;
    const top = toPoint(topAngle);

    const angle = angleAtVertex(top, left, right);
    const isRightAngle = Math.abs(angle - 90) < 0.5;
    const colour = isRightAngle ? RIGHT_ANGLE_COLOUR : OTHER_ANGLE_COLOUR;

    const updateFromPointer = useCallback(
        (clientX: number, clientY: number) => {
            const svg = svgRef.current;
            if (!svg) return;
            const bounds = svg.getBoundingClientRect();
            const x = (clientX - bounds.left) * (VIEWBOX_WIDTH / bounds.width);
            const y = (clientY - bounds.top) * (VIEWBOX_HEIGHT / bounds.height);
            const pointerAngle = (Math.atan2(CENTRE_Y - y, x - CENTRE_X) * 180) / Math.PI;

            let offset = pointerAngle - base.travelStart;
            while (offset < 0) offset += 360;
            if (offset > base.travelSweep) {
                offset =
                    offset - base.travelSweep > (360 - base.travelSweep) / 2 ? 0 : base.travelSweep;
            }
            setPosition((offset / base.travelSweep) * 100);
        },
        [base.travelStart, base.travelSweep],
    );

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 justify-center mb-4">
                {(Object.keys(BASE_LINES) as BaseLineMode[]).map((key) => (
                    <Button
                        key={key}
                        size="sm"
                        variant={mode === key ? "default" : "outline"}
                        onClick={() => setMode(key)}
                    >
                        {key === "diameter" ? "Base line: diameter" : "Base line: ordinary chord"}
                    </Button>
                ))}
            </div>

            <svg
                ref={svgRef}
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                className="w-full h-auto max-w-[560px] mx-auto block touch-none select-none"
                role="img"
                aria-label="A circle where the base line switches between a diameter and an ordinary chord"
                onPointerDown={(event) => {
                    draggingRef.current = true;
                    event.currentTarget.setPointerCapture(event.pointerId);
                    updateFromPointer(event.clientX, event.clientY);
                }}
                onPointerMove={(event) => {
                    if (draggingRef.current) updateFromPointer(event.clientX, event.clientY);
                }}
                onPointerUp={() => {
                    draggingRef.current = false;
                }}
                onPointerLeave={() => {
                    draggingRef.current = false;
                }}
            >
                <circle cx={CENTRE_X} cy={CENTRE_Y} r={RADIUS} fill="none" stroke="#94a3b8" strokeWidth={2} />

                {/* Triangle */}
                <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke="#334155" strokeWidth={4} />
                <line x1={top.x} y1={top.y} x2={left.x} y2={left.y} stroke={colour} strokeWidth={3} />
                <line x1={top.x} y1={top.y} x2={right.x} y2={right.y} stroke={colour} strokeWidth={3} />

                {/* Angle marker at the top point */}
                <path
                    d={minorArcPath(top.x, top.y, 28, directionDegrees(top, left), directionDegrees(top, right))}
                    fill="none"
                    stroke={colour}
                    strokeWidth={2.5}
                />

                {/* The centre, and whether the base line reaches it */}
                <circle
                    cx={CENTRE_X}
                    cy={CENTRE_Y}
                    r={7}
                    fill={mode === "diameter" ? "#dc2626" : "#ffffff"}
                    stroke="#dc2626"
                    strokeWidth={3}
                />
                <text x={CENTRE_X - 14} y={CENTRE_Y + 24} textAnchor="end" fontSize="15" fontWeight="600" fill="#dc2626">
                    O
                </text>

                {/* Points */}
                <circle cx={left.x} cy={left.y} r={6} fill="#334155" />
                <circle cx={right.x} cy={right.y} r={6} fill="#334155" />
                <circle cx={top.x} cy={top.y} r={11} fill={colour} stroke="#ffffff" strokeWidth={3} />

                <text x={left.x - 14} y={left.y + 20} textAnchor="end" fontSize="16" fontWeight="600" fill="#334155">
                    A
                </text>
                <text x={right.x + 14} y={right.y + 20} textAnchor="start" fontSize="16" fontWeight="600" fill="#334155">
                    B
                </text>
                <text x={top.x} y={top.y - 22} textAnchor="middle" fontSize="16" fontWeight="600" fill={colour}>
                    C (drag me)
                </text>

                {/* Readouts */}
                <text x={24} y={442} textAnchor="start" fontSize="17" fontWeight="600" fill={colour}>
                    Angle at C: {angle.toFixed(1)}&#176;
                </text>
                <text x={VIEWBOX_WIDTH - 24} y={442} textAnchor="end" fontSize="15" fontWeight="600" fill="#334155">
                    {mode === "diameter" ? "AB goes through O" : "AB misses O"}
                </text>
            </svg>

            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center text-slate-700">
                {base.label}. Drag C anywhere along the rim and watch the reading.
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Practice                                                            */
/* ------------------------------------------------------------------ */

const SEMICIRCLE_QUESTIONS: PracticeQuestion[] = [
    {
        id: "third-angle-in-semicircle",
        prompt: "A triangle has all three corners on a circle and one side is a diameter. One of its other angles is 31°. What is the remaining angle?",
        options: [
            { id: "fifty-nine", label: "59°" },
            { id: "sixty-two", label: "62°" },
            { id: "one-forty-nine", label: "149°" },
        ],
        correctId: "fifty-nine",
        correctFeedback: "Yes. The diameter forces a right angle, so the other two must share the remaining 90°.",
        hints: {
            "sixty-two": "Close, but that is 90 minus 28. Set the base line to a diameter above, check the angle at C, then take 31 from what is left in the triangle.",
            "one-forty-nine": "That subtracts from 180 and forgets the third corner. Which angle does the diameter always give you?",
        },
    },
    {
        id: "chord-is-not-a-diameter",
        prompt: "Chord PQ does not pass through the centre. R is a point on the major arc. What can you say about angle PRQ?",
        options: [
            { id: "exactly-ninety", label: "It is exactly 90°" },
            { id: "less-than-ninety", label: "It is less than 90°" },
            { id: "more-than-ninety", label: "It is more than 90°" },
        ],
        correctId: "less-than-ninety",
        correctFeedback: "Correct. The angle at the centre is under 180° here, so half of it must be under 90°.",
        hints: {
            "exactly-ninety": "That treats every chord as a diameter. Switch the base line above to an ordinary chord and read the angle at C — it never reaches 90°.",
            "more-than-ninety": "Try it: switch the base line above to an ordinary chord and drag C along the major arc. Is the reading above or below 90?",
        },
    },
    {
        id: "chain-from-the-right-angle",
        prompt: "AB is a diameter, C is on the circle, and angle CAB = 28°. What is angle ABC?",
        options: [
            { id: "sixty-two", label: "62°" },
            { id: "twenty-eight", label: "28°" },
            { id: "one-fifty-two", label: "152°" },
        ],
        correctId: "sixty-two",
        correctFeedback: "Right. Angle ACB is 90° because AB is a diameter, leaving 90° to split, so 90 − 28 = 62.",
        hints: {
            "twenty-eight": "The triangle is not isosceles here. Set the base line to a diameter above — what is the angle at C, and what does that leave for the other two?",
            "one-fifty-two": "That uses angles on a straight line instead of the triangle. Find the angle at C first, then use the three angles of the triangle.",
        },
    },
];

/* ------------------------------------------------------------------ */
/* Blocks                                                              */
/* ------------------------------------------------------------------ */

export const angleInASemicircleBlocks: ReactElement[] = [
    <StackLayout key="layout-semicircle-angle-heading" maxWidth="xl">
        <Block id="semicircle-angle-heading" padding="md">
            <EditableH2 id="h2-semicircle-angle-heading" blockId="semicircle-angle-heading">
                The Angle in a Semicircle
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-semicircle-angle-rule" maxWidth="xl">
        <Block id="semicircle-angle-rule" padding="sm">
            <EditableParagraph id="para-semicircle-angle-rule" blockId="semicircle-angle-rule">
                One chord behaves differently from all the others: the diameter. Join both ends
                of a diameter to any other point on the rim and the angle at that point is
                always a right angle, <InlineFormula latex="90^\circ" />, wherever you put it.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-semicircle-angle-reason" maxWidth="xl">
        <Block id="semicircle-angle-reason" padding="sm">
            <EditableParagraph id="para-semicircle-angle-reason" blockId="semicircle-angle-reason">
                This is the last rule in disguise. A diameter is a straight line through the
                centre, so the angle at the centre is <InlineFormula latex="180^\circ" />, and
                half of 180 is 90. Switch the base line below from a diameter to an ordinary
                chord, drag C around, and watch the right angle disappear.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-semicircle-angle-visual" maxWidth="xl">
        <Block id="semicircle-angle-visual" padding="sm" hasVisualization>
            <SemicircleAngleExplorer />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-semicircle-angle-practice" maxWidth="xl">
        <Block id="semicircle-angle-practice" padding="sm">
            <PracticeQuestions questions={SEMICIRCLE_QUESTIONS} />
        </Block>
    </StackLayout>,
];
