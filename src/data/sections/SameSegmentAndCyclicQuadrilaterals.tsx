import { useCallback, useRef, useState, type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph, InlineFormula, Button } from "@/components/atoms";
import { PracticeQuestions, type PracticeQuestion } from "./PracticeQuestions";
import { pointOnCircle, angleAtVertex } from "./circleGeometry";

/* ------------------------------------------------------------------ */
/* Layout constants                                                    */
/* ------------------------------------------------------------------ */

const VIEWBOX_WIDTH = 560;
const VIEWBOX_HEIGHT = 510;
const CENTRE_X = 280;
const CENTRE_Y = 225;
const RADIUS = 145;

const CORNER_NAMES = ["A", "B", "C", "D"] as const;
const START_ANGLES = [150, 55, -40, -125];
/** Smallest gap allowed between two corners, so they never cross over. */
const MINIMUM_GAP = 14;

const OPPOSITE_COLOUR = "#059669";
const ADJACENT_COLOUR = "#d97706";

/* ------------------------------------------------------------------ */
/* Interactive visual                                                  */
/* ------------------------------------------------------------------ */

const CyclicQuadrilateralExplorer = () => {
    const [angles, setAngles] = useState<number[]>(START_ANGLES);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const draggingIndex = useRef<number | null>(null);

    const corners = angles.map((angle) => pointOnCircle(CENTRE_X, CENTRE_Y, RADIUS, angle));

    const interiorAngles = corners.map((corner, index) =>
        angleAtVertex(corner, corners[(index + 3) % 4], corners[(index + 1) % 4]),
    );

    const pointerAngle = (clientX: number, clientY: number) => {
        const svg = svgRef.current;
        if (!svg) return null;
        const bounds = svg.getBoundingClientRect();
        const x = (clientX - bounds.left) * (VIEWBOX_WIDTH / bounds.width);
        const y = (clientY - bounds.top) * (VIEWBOX_HEIGHT / bounds.height);
        return (Math.atan2(CENTRE_Y - y, x - CENTRE_X) * 180) / Math.PI;
    };

    /** Which corner is nearest the place the student pressed. */
    const nearestCorner = (angle: number) => {
        let best = 0;
        let bestGap = Infinity;
        angles.forEach((cornerAngle, index) => {
            const gap = Math.abs(((angle - cornerAngle + 540) % 360) - 180);
            if (gap < bestGap) {
                bestGap = gap;
                best = index;
            }
        });
        return best;
    };

    const moveCorner = useCallback((index: number, rawAngle: number) => {
        setAngles((previous) => {
            const current = previous[index];
            // Bring the pointer angle next to the corner it is moving.
            let target = rawAngle;
            while (target - current > 180) target -= 360;
            while (target - current <= -180) target += 360;

            // Corners are stored in descending order, so each one is penned in by its neighbours.
            const before =
                index === 0 ? previous[3] + 360 : previous[index - 1];
            const after = index === 3 ? previous[0] - 360 : previous[index + 1];

            const upperLimit = before - MINIMUM_GAP;
            const lowerLimit = after + MINIMUM_GAP;
            const clamped = Math.min(upperLimit, Math.max(lowerLimit, target));

            const next = [...previous];
            next[index] = clamped;
            return next;
        });
    }, []);

    const labelFor = (index: number) => {
        const outer = pointOnCircle(CENTRE_X, CENTRE_Y, RADIUS + 34, angles[index]);
        const anchor = outer.x > CENTRE_X + 25 ? "start" : outer.x < CENTRE_X - 25 ? "end" : "middle";
        return { ...outer, anchor } as const;
    };

    const oppositeSumOne = interiorAngles[0] + interiorAngles[2];
    const oppositeSumTwo = interiorAngles[1] + interiorAngles[3];
    const adjacentSum = interiorAngles[0] + interiorAngles[1];

    return (
        <div className="w-full">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                className="w-full h-auto max-w-[560px] mx-auto block touch-none select-none"
                role="img"
                aria-label="A quadrilateral inside a circle with all four angles measured"
                onPointerDown={(event) => {
                    const angle = pointerAngle(event.clientX, event.clientY);
                    if (angle === null) return;
                    draggingIndex.current = nearestCorner(angle);
                    event.currentTarget.setPointerCapture(event.pointerId);
                    moveCorner(draggingIndex.current, angle);
                }}
                onPointerMove={(event) => {
                    if (draggingIndex.current === null) return;
                    const angle = pointerAngle(event.clientX, event.clientY);
                    if (angle === null) return;
                    moveCorner(draggingIndex.current, angle);
                }}
                onPointerUp={() => {
                    draggingIndex.current = null;
                }}
                onPointerLeave={() => {
                    draggingIndex.current = null;
                }}
            >
                <circle cx={CENTRE_X} cy={CENTRE_Y} r={RADIUS} fill="none" stroke="#94a3b8" strokeWidth={2} />

                <polygon
                    points={corners.map((corner) => `${corner.x.toFixed(1)},${corner.y.toFixed(1)}`).join(" ")}
                    fill="rgba(79,70,229,0.08)"
                    stroke="#4f46e5"
                    strokeWidth={3}
                />

                {corners.map((corner, index) => {
                    const label = labelFor(index);
                    const isOppositePairOne = index === 0 || index === 2;
                    return (
                        <g key={CORNER_NAMES[index]}>
                            <circle
                                cx={corner.x}
                                cy={corner.y}
                                r={10}
                                fill={isOppositePairOne ? "#4f46e5" : "#0ea5e9"}
                                stroke="#ffffff"
                                strokeWidth={3}
                            />
                            <text
                                x={label.x}
                                y={label.y + 5}
                                textAnchor={label.anchor}
                                fontSize="15"
                                fontWeight="600"
                                fill={isOppositePairOne ? "#4f46e5" : "#0ea5e9"}
                            >
                                {CORNER_NAMES[index]} = {interiorAngles[index].toFixed(1)}&#176;
                            </text>
                        </g>
                    );
                })}

                {/* Live totals */}
                <text x={CENTRE_X} y={428} textAnchor="middle" fontSize="17" fontWeight="600" fill={OPPOSITE_COLOUR}>
                    Opposite: A + C = {oppositeSumOne.toFixed(1)}&#176;
                </text>
                <text x={CENTRE_X} y={456} textAnchor="middle" fontSize="17" fontWeight="600" fill={OPPOSITE_COLOUR}>
                    Opposite: B + D = {oppositeSumTwo.toFixed(1)}&#176;
                </text>
                <text x={CENTRE_X} y={486} textAnchor="middle" fontSize="17" fontWeight="600" fill={ADJACENT_COLOUR}>
                    Next to each other: A + B = {adjacentSum.toFixed(1)}&#176;
                </text>
            </svg>

            <div className="flex justify-center mt-3">
                <Button size="sm" variant="outline" onClick={() => setAngles(START_ANGLES)}>
                    Reset the corners
                </Button>
            </div>

            <div className="mt-3 text-center text-sm text-slate-600">
                Drag any corner around the rim. Two totals stay put; one does not.
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Practice                                                            */
/* ------------------------------------------------------------------ */

const SAME_SEGMENT_QUESTIONS: PracticeQuestion[] = [
    {
        id: "opposite-corner",
        prompt: "A quadrilateral has all four corners on a circle. One of its angles is 96°. What is the angle directly opposite it?",
        options: [
            { id: "eighty-four", label: "84°" },
            { id: "ninety-six", label: "96°" },
            { id: "two-sixty-four", label: "264°" },
        ],
        correctId: "eighty-four",
        correctFeedback: "Yes. Opposite corners must total 180°, so 180 − 96 = 84.",
        hints: {
            "ninety-six": "Opposite angles are not equal here. Drag a corner in the diagram above and watch the two angles of an opposite pair change in step.",
            "two-sixty-four": "That uses 360 instead of 180. Check the green totals in the diagram above — what number do the opposite pairs settle on?",
        },
    },
    {
        id: "adjacent-versus-opposite",
        prompt: "In cyclic quadrilateral PQRS the corners are in that order round the circle. Angle P = 70° and angle Q = 105°. What is angle R?",
        options: [
            { id: "one-ten", label: "110°" },
            { id: "seventy-five", label: "75°" },
            { id: "eighty-five", label: "85°" },
        ],
        correctId: "one-ten",
        correctFeedback: "Correct. R faces P across the shape, so R = 180 − 70 = 110°.",
        hints: {
            "seventy-five": "That pairs R with Q, and those two sit side by side. In the diagram above, only the green total holds at 180 — the amber one wanders.",
            "eighty-five": "Check which corner faces which. Drag a corner above and watch which pair keeps a fixed total before choosing again.",
        },
    },
    {
        id: "same-segment-transfer",
        kind: "number",
        prompt: "A and B are two fixed points on a circle. From point C on the major arc, angle ACB = 42\u00b0. D is a different point on the same major arc. Work out angle ADB, in degrees.",
        correctValue: 42,
        unit: "degrees",
        correctFeedback: "Right. Both angles stand on chord AB from the same side, so they are equal \u2014 both are half the same angle at the centre.",
        wrongFeedback: "Not yet. C and D are both on the rim, on the same side of AB. Think about what each of them is half of, then try again.",
        hints: {
            "84": "Doubling takes you to the centre, not to another point on the rim. Both C and D sit on the rim \u2014 how do their angles compare?",
            "138": "That is the cyclic quadrilateral rule, but D is on the same arc as C, not the opposite one. Which rule applies when both points are on the same arc?",
            "21": "That halves instead of matching. Both angles are half of the same angle at the centre, so what does that make them?",
            "90": "There is no diameter in this question. Look again at where C and D sit relative to chord AB.",
        },
    },
];

/* ------------------------------------------------------------------ */
/* Blocks                                                              */
/* ------------------------------------------------------------------ */

export const sameSegmentAndCyclicQuadrilateralsBlocks: ReactElement[] = [
    <StackLayout key="layout-same-segment-cyclic-heading" maxWidth="xl">
        <Block id="same-segment-cyclic-heading" padding="md">
            <EditableH2 id="h2-same-segment-cyclic-heading" blockId="same-segment-cyclic-heading">
                Angles in the Same Segment and Cyclic Quadrilaterals
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-same-segment-rule" maxWidth="xl">
        <Block id="same-segment-rule" padding="sm">
            <EditableParagraph id="para-same-segment-rule" blockId="same-segment-rule">
                Two carriages again, and this time two passengers watching them from the same
                side of the wheel. Both passengers see exactly the same angle, however far apart
                they sit. That is the angles in the same segment rule, and it follows straight
                from the doubling rule: both angles are half of the same angle at the centre.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-cyclic-quadrilateral-rule" maxWidth="xl">
        <Block id="cyclic-quadrilateral-rule" padding="sm">
            <EditableParagraph id="para-cyclic-quadrilateral-rule" blockId="cyclic-quadrilateral-rule">
                Now put four passengers on the rim and join them into a quadrilateral. Drag any
                corner below and watch the three totals. The two green ones, made from corners
                that face each other, stay locked at <InlineFormula latex="180^\circ" />. The
                amber one, made from two corners sitting side by side, drifts all over the place.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-same-segment-cyclic-visual" maxWidth="xl">
        <Block id="same-segment-cyclic-visual" padding="sm" hasVisualization>
            <CyclicQuadrilateralExplorer />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-same-segment-cyclic-practice" maxWidth="xl">
        <Block id="same-segment-cyclic-practice" padding="sm">
            <PracticeQuestions questions={SAME_SEGMENT_QUESTIONS} />
        </Block>
    </StackLayout>,
];
