import { useCallback, useRef, useState, type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph, Slider } from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { PracticeQuestions, type PracticeQuestion } from "./PracticeQuestions";
import {
    pointOnCircle,
    normaliseDegrees,
    directionDegrees,
    minorArcPath,
} from "./circleGeometry";

/* ------------------------------------------------------------------ */
/* Layout constants                                                    */
/* ------------------------------------------------------------------ */

const VIEWBOX_WIDTH = 560;
const VIEWBOX_HEIGHT = 470;
const CENTRE_X = 280;
const CENTRE_Y = 225;
const RADIUS = 145;

/** Angles of the two fixed carriages, in degrees (0 = right, counter-clockwise). */
const FIXED_ANGLE_A = 200;
const FIXED_ANGLE_B = 340;

/** The movable viewpoint travels along the major arc, from just past B to just short of A. */
const VIEWPOINT_START = -15;
const VIEWPOINT_SWEEP = 210;

const toPoint = (angleDegrees: number) =>
    pointOnCircle(CENTRE_X, CENTRE_Y, RADIUS, angleDegrees);

/* ------------------------------------------------------------------ */
/* Interactive visual                                                  */
/* ------------------------------------------------------------------ */

const CENTRE_COLOUR = "#dc2626";
const RIM_COLOUR = "#4f46e5";

const AngleAtTheCentreExplorer = () => {
    /** Position of the movable viewpoint along its arc, 0 to 100. */
    const [position, setPosition] = useState(45);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const draggingRef = useRef(false);

    const pointA = toPoint(FIXED_ANGLE_A);
    const pointB = toPoint(FIXED_ANGLE_B);
    const viewpointAngle = VIEWPOINT_START + (position / 100) * VIEWPOINT_SWEEP;
    const viewpoint = toPoint(viewpointAngle);

    // Angle at the centre, standing on the arc that does NOT contain the viewpoint.
    const centreAngle = Math.abs(normaliseDegrees(FIXED_ANGLE_B - FIXED_ANGLE_A));

    // Angle at the rim, measured from the movable viewpoint.
    const toA = directionDegrees(viewpoint, pointA);
    const toB = directionDegrees(viewpoint, pointB);
    const rimAngle = Math.abs(normaliseDegrees(toB - toA));

    const updateFromPointer = useCallback((clientX: number, clientY: number) => {
        const svg = svgRef.current;
        if (!svg) return;
        const bounds = svg.getBoundingClientRect();
        const scaleX = VIEWBOX_WIDTH / bounds.width;
        const scaleY = VIEWBOX_HEIGHT / bounds.height;
        const x = (clientX - bounds.left) * scaleX;
        const y = (clientY - bounds.top) * scaleY;
        const angle = (Math.atan2(CENTRE_Y - y, x - CENTRE_X) * 180) / Math.PI;

        // Keep the viewpoint on the major arc: snap back if it strays below.
        let offset = angle - VIEWPOINT_START;
        while (offset < 0) offset += 360;
        if (offset > VIEWPOINT_SWEEP) {
            offset = offset - VIEWPOINT_SWEEP > (360 - VIEWPOINT_SWEEP) / 2 ? 0 : VIEWPOINT_SWEEP;
        }
        setPosition((offset / VIEWPOINT_SWEEP) * 100);
    }, []);

    return (
        <div className="w-full">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                className="w-full h-auto max-w-[560px] mx-auto block touch-none select-none"
                role="img"
                aria-label="A circle with a movable point on the rim and both angles shown"
                onPointerDown={(event) => {
                    draggingRef.current = true;
                    event.currentTarget.setPointerCapture(event.pointerId);
                    updateFromPointer(event.clientX, event.clientY);
                }}
                onPointerMove={(event) => {
                    if (!draggingRef.current) return;
                    updateFromPointer(event.clientX, event.clientY);
                }}
                onPointerUp={() => {
                    draggingRef.current = false;
                }}
                onPointerLeave={() => {
                    draggingRef.current = false;
                }}
            >
                <circle cx={CENTRE_X} cy={CENTRE_Y} r={RADIUS} fill="none" stroke="#94a3b8" strokeWidth={2} />

                {/* The arc both angles stand on */}
                <path
                    d={minorArcPath(CENTRE_X, CENTRE_Y, RADIUS, FIXED_ANGLE_A, FIXED_ANGLE_B)}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={6}
                    strokeLinecap="round"
                />

                {/* Radii to the two fixed carriages */}
                <line x1={CENTRE_X} y1={CENTRE_Y} x2={pointA.x} y2={pointA.y} stroke={CENTRE_COLOUR} strokeWidth={3} />
                <line x1={CENTRE_X} y1={CENTRE_Y} x2={pointB.x} y2={pointB.y} stroke={CENTRE_COLOUR} strokeWidth={3} />

                {/* Lines from the movable viewpoint */}
                <line x1={viewpoint.x} y1={viewpoint.y} x2={pointA.x} y2={pointA.y} stroke={RIM_COLOUR} strokeWidth={3} />
                <line x1={viewpoint.x} y1={viewpoint.y} x2={pointB.x} y2={pointB.y} stroke={RIM_COLOUR} strokeWidth={3} />

                {/* Angle markers */}
                <path
                    d={minorArcPath(CENTRE_X, CENTRE_Y, 42, FIXED_ANGLE_A, FIXED_ANGLE_B)}
                    fill="none"
                    stroke={CENTRE_COLOUR}
                    strokeWidth={2.5}
                />
                <path
                    d={minorArcPath(viewpoint.x, viewpoint.y, 30, toA, toB)}
                    fill="none"
                    stroke={RIM_COLOUR}
                    strokeWidth={2.5}
                />

                {/* Points */}
                <circle cx={CENTRE_X} cy={CENTRE_Y} r={6} fill={CENTRE_COLOUR} />
                <circle cx={pointA.x} cy={pointA.y} r={6} fill="#334155" />
                <circle cx={pointB.x} cy={pointB.y} r={6} fill="#334155" />
                <circle cx={viewpoint.x} cy={viewpoint.y} r={11} fill={RIM_COLOUR} stroke="#ffffff" strokeWidth={3} />

                {/* Point labels */}
                <text x={CENTRE_X - 14} y={CENTRE_Y + 22} textAnchor="end" fontSize="16" fontWeight="600" fill={CENTRE_COLOUR}>
                    O
                </text>
                <text x={pointA.x - 14} y={pointA.y + 20} textAnchor="end" fontSize="16" fontWeight="600" fill="#334155">
                    A
                </text>
                <text x={pointB.x + 14} y={pointB.y + 20} textAnchor="start" fontSize="16" fontWeight="600" fill="#334155">
                    B
                </text>
                <text
                    x={viewpoint.x}
                    y={viewpoint.y - 20}
                    textAnchor="middle"
                    fontSize="16"
                    fontWeight="600"
                    fill={RIM_COLOUR}
                >
                    P (drag me)
                </text>

                {/* Readouts */}
                <text x={24} y={442} textAnchor="start" fontSize="17" fontWeight="600" fill={CENTRE_COLOUR}>
                    Angle at O: {Math.round(centreAngle)}&#176;
                </text>
                <text x={VIEWBOX_WIDTH - 24} y={442} textAnchor="end" fontSize="17" fontWeight="600" fill={RIM_COLOUR}>
                    Angle at P: {Math.round(rimAngle)}&#176;
                </text>
                <text x={CENTRE_X} y={442} textAnchor="middle" fontSize="17" fontWeight="600" fill="#334155">
                    O &#247; P = {(centreAngle / rimAngle).toFixed(1)}
                </text>
            </svg>

            <div className="mx-auto max-w-[460px] mt-4">
                <Slider
                    value={[position]}
                    min={0}
                    max={100}
                    step={0.5}
                    onValueChange={(value) => setPosition(value[0])}
                    aria-label="Move the viewpoint around the rim"
                />
                <div className="mt-2 text-center text-sm text-slate-600">
                    Drag point P around the rim, or use the slider.
                </div>
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Practice                                                            */
/* ------------------------------------------------------------------ */

const ANGLE_AT_THE_CENTRE_QUESTIONS: PracticeQuestion[] = [
    {
        id: "halve-the-centre-angle",
        prompt: "Two carriages make an angle of 84° at the hub. A passenger on the far arc looks at the same two carriages. What angle does the passenger see?",
        options: [
            { id: "forty-two", label: "42°" },
            { id: "eighty-four", label: "84°" },
            { id: "one-sixty-eight", label: "168°" },
        ],
        correctId: "forty-two",
        correctFeedback: "Yes. The hub angle is the double one, so the passenger sees half of it.",
        hints: {
            "eighty-four": "The two angles are never equal. Drag P around the diagram above and watch the ratio readout — it stays at 2.0, not 1.0.",
            "one-sixty-eight": "That doubles the hub angle instead of halving it. In the diagram, which of the two numbers is always the larger one?",
        },
    },
    {
        id: "double-from-the-rim",
        prompt: "A passenger on the rim sees an angle of 35° between two carriages. What is the angle between those same two spokes at the hub?",
        options: [
            { id: "thirty-five", label: "35°" },
            { id: "seventy", label: "70°" },
            { id: "seventeen-point-five", label: "17.5°" },
        ],
        correctId: "seventy",
        correctFeedback: "Correct. Working from the rim to the centre you multiply by two, so 35° becomes 70°.",
        hints: {
            "thirty-five": "That is the belief that the two angles match. Set P anywhere in the diagram above and compare the two readouts — they are never the same number.",
            "seventeen-point-five": "That halves when it should double. The angle at the hub is always the bigger of the two — check the readouts above.",
        },
    },
    {
        id: "wrong-arc",
        prompt: "The angle at the centre standing on chord AB is 100°. A student says every point on the rim must therefore see AB at 50°. When is that student wrong?",
        options: [
            { id: "never", label: "Never — it is always 50°" },
            { id: "other-arc", label: "When the point sits on the other arc, the far side of AB" },
            { id: "long-chord", label: "When the chord AB is longer than the radius" },
        ],
        correctId: "other-arc",
        correctFeedback: "Exactly. From the other arc the angle stands on the reflex 260° at the centre, so it is 130°, not 50°.",
        hints: {
            never: "Try to move P past A or past B in the diagram above — it refuses to go, because on that side the rule uses a different angle at the centre.",
            "long-chord": "Chord length has nothing to do with it. Look at where P is allowed to travel in the diagram — what happens on the other side of AB?",
        },
    },
];

/* ------------------------------------------------------------------ */
/* Blocks                                                              */
/* ------------------------------------------------------------------ */

export const angleAtTheCentreBlocks: ReactElement[] = [
    <StackLayout key="layout-angle-at-centre-heading" maxWidth="xl">
        <Block id="angle-at-centre-heading" padding="md">
            <EditableH2 id="h2-angle-at-centre-heading" blockId="angle-at-centre-heading">
                The Angle at the Centre
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-angle-at-centre-setup" maxWidth="xl">
        <Block id="angle-at-centre-setup" padding="sm">
            <EditableParagraph id="para-angle-at-centre-setup" blockId="angle-at-centre-setup">
                Take two carriages, A and B, on the Ferris wheel rim. Their spokes meet at the
                hub O and make an angle there. A passenger P sitting anywhere else on the rim
                also sees an angle between those same two carriages. Two angles, one pair of
                carriages, and they are always linked.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-angle-at-centre-rule" maxWidth="xl">
        <Block id="angle-at-centre-rule" padding="lg">
            <FormulaBlock latex="\text{angle at the centre} = 2 \times \text{angle at the circumference}" />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-angle-at-centre-conditions" maxWidth="xl">
        <Block id="angle-at-centre-conditions" padding="sm">
            <EditableParagraph id="para-angle-at-centre-conditions" blockId="angle-at-centre-conditions">
                Twice, not equal. Drag P right around the rim and watch both readings: the angle
                at O never moves, the angle at P never moves, and the ratio stays at 2.0. Notice
                that P will not travel past A or B &mdash; on that side the angles stand on a
                different arc, and the rule no longer applies.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-angle-at-centre-visual" maxWidth="xl">
        <Block id="angle-at-centre-visual" padding="sm" hasVisualization>
            <AngleAtTheCentreExplorer />
        </Block>
    </StackLayout>,
];
