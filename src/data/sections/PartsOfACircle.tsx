import { useState, type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph, Button } from "@/components/atoms";
import { PracticeQuestions, type PracticeQuestion } from "./PracticeQuestions";

/* ------------------------------------------------------------------ */
/* Interactive labelled circle                                         */
/* ------------------------------------------------------------------ */

type CirclePartId =
    | "centre"
    | "radius"
    | "diameter"
    | "chord"
    | "arc"
    | "tangent"
    | "segment";

interface CirclePart {
    id: CirclePartId;
    name: string;
    description: string;
}

const CIRCLE_PARTS: CirclePart[] = [
    {
        id: "centre",
        name: "Centre",
        description: "The point exactly in the middle. Every point on the rim is the same distance from it.",
    },
    {
        id: "radius",
        name: "Radius",
        description: "A line from the centre out to the rim. Every radius of a circle is the same length.",
    },
    {
        id: "diameter",
        name: "Diameter",
        description: "A chord that passes through the centre. It is the longest chord, and twice the radius.",
    },
    {
        id: "chord",
        name: "Chord",
        description: "A straight line joining any two points on the rim. It does not have to go through the centre.",
    },
    {
        id: "arc",
        name: "Arc",
        description: "A curved piece of the rim itself, between two points.",
    },
    {
        id: "tangent",
        name: "Tangent",
        description: "A straight line that touches the rim at exactly one point and never crosses it.",
    },
    {
        id: "segment",
        name: "Segment",
        description: "The region between a chord and the arc it cuts off.",
    },
];

const ACTIVE = "#4f46e5";
const IDLE = "#cbd5e1";

const PartsOfACircleDiagram = () => {
    const [selected, setSelected] = useState<CirclePartId>("radius");
    const part = CIRCLE_PARTS.find((item) => item.id === selected) as CirclePart;

    const on = (id: CirclePartId) => selected === id;
    const stroke = (id: CirclePartId) => (on(id) ? ACTIVE : IDLE);
    const strokeWidth = (id: CirclePartId) => (on(id) ? 4 : 2);

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 justify-center mb-4">
                {CIRCLE_PARTS.map((item) => (
                    <Button
                        key={item.id}
                        size="sm"
                        variant={on(item.id) ? "default" : "outline"}
                        onClick={() => setSelected(item.id)}
                    >
                        {item.name}
                    </Button>
                ))}
            </div>

            <svg
                viewBox="0 0 560 450"
                className="w-full h-auto max-w-[560px] mx-auto block"
                role="img"
                aria-label="A circle with its parts labelled"
            >
                {/* Segment shading (drawn first so lines sit on top) */}
                <path
                    d="M370,322 A140,140 0 0 1 210,336 Z"
                    fill={on("segment") ? "rgba(79,70,229,0.18)" : "transparent"}
                    stroke="none"
                />

                {/* The circle itself */}
                <circle cx={280} cy={215} r={140} fill="none" stroke="#94a3b8" strokeWidth={2} />

                {/* Arc (part of the rim, top right) */}
                <path
                    d="M350,94 A140,140 0 0 1 415,179"
                    fill="none"
                    stroke={stroke("arc")}
                    strokeWidth={on("arc") ? 6 : 0}
                    strokeLinecap="round"
                />

                {/* Diameter */}
                <line
                    x1={140}
                    y1={215}
                    x2={420}
                    y2={215}
                    stroke={stroke("diameter")}
                    strokeWidth={strokeWidth("diameter")}
                />

                {/* Radius */}
                <line
                    x1={280}
                    y1={215}
                    x2={181}
                    y2={116}
                    stroke={stroke("radius")}
                    strokeWidth={strokeWidth("radius")}
                />

                {/* Chord */}
                <line
                    x1={370}
                    y1={322}
                    x2={210}
                    y2={336}
                    stroke={stroke("chord")}
                    strokeWidth={strokeWidth("chord")}
                />

                {/* Tangent */}
                <line
                    x1={170}
                    y1={75}
                    x2={390}
                    y2={75}
                    stroke={stroke("tangent")}
                    strokeWidth={strokeWidth("tangent")}
                />
                <circle cx={280} cy={75} r={4} fill={on("tangent") ? ACTIVE : IDLE} />

                {/* Centre */}
                <circle cx={280} cy={215} r={on("centre") ? 7 : 5} fill={on("centre") ? ACTIVE : "#94a3b8"} />

                {/* Labels — only the selected part is named */}
                {on("centre") && (
                    <text x={280} y={202} textAnchor="middle" fontSize="15" fill={ACTIVE} fontWeight="600">
                        Centre
                    </text>
                )}
                {on("radius") && (
                    <text x={222} y={152} textAnchor="end" fontSize="15" fill={ACTIVE} fontWeight="600">
                        Radius
                    </text>
                )}
                {on("diameter") && (
                    <text x={200} y={240} textAnchor="middle" fontSize="15" fill={ACTIVE} fontWeight="600">
                        Diameter
                    </text>
                )}
                {on("chord") && (
                    <text x={290} y={368} textAnchor="middle" fontSize="15" fill={ACTIVE} fontWeight="600">
                        Chord
                    </text>
                )}
                {on("arc") && (
                    <text x={536} y={132} textAnchor="end" fontSize="15" fill={ACTIVE} fontWeight="600">
                        Arc
                    </text>
                )}
                {on("tangent") && (
                    <text x={400} y={62} textAnchor="start" fontSize="15" fill={ACTIVE} fontWeight="600">
                        Tangent
                    </text>
                )}
                {on("segment") && (
                    <text x={290} y={398} textAnchor="middle" fontSize="15" fill={ACTIVE} fontWeight="600">
                        Segment
                    </text>
                )}
            </svg>

            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                <span className="font-semibold text-indigo-700">{part.name}: </span>
                <span className="text-slate-700">{part.description}</span>
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Practice                                                            */
/* ------------------------------------------------------------------ */

const PARTS_OF_A_CIRCLE_QUESTIONS: PracticeQuestion[] = [
    {
        id: "spoke-length",
        prompt: "A Ferris wheel measures 18 metres straight across through its centre. How long is one spoke, from the hub to a carriage?",
        options: [
            { id: "nine", label: "9 metres" },
            { id: "eighteen", label: "18 metres" },
            { id: "thirty-six", label: "36 metres" },
        ],
        correctId: "nine",
        correctFeedback: "Yes. Straight across through the centre is the diameter, and a spoke is a radius \u2014 exactly half of it.",
        hints: {
            eighteen: "That is the whole way across. Select Diameter and then Radius above and compare how far each line reaches.",
            "thirty-six": "That has doubled instead of halved. Select Diameter above \u2014 the radius is the shorter of the two.",
        },
    },
    {
        id: "two-correct-names",
        prompt: "A straight line joins two carriages and happens to pass right through the hub. Which names are both correct for that line?",
        options: [
            { id: "chord-only", label: "Chord only" },
            { id: "diameter-only", label: "Diameter only" },
            { id: "chord-and-diameter", label: "Both chord and diameter" },
            { id: "tangent", label: "Tangent" },
        ],
        correctId: "chord-and-diameter",
        correctFeedback: "Correct. Every diameter is a chord \u2014 it is just the special one that passes through the centre.",
        hints: {
            "chord-only": "True, but not the full answer. Select Diameter above and check whether it also joins two points on the rim.",
            "diameter-only": "Almost. Select Chord above, then Diameter \u2014 look at what both lines have in common.",
            tangent: "A tangent only touches the rim once. Select Tangent above and see whether it crosses the circle at all.",
        },
    },
    {
        id: "impossible-chord",
        prompt: "A circle has a radius of 6 cm. Which of these could NOT be the length of a chord in that circle?",
        options: [
            { id: "five", label: "5 cm" },
            { id: "eleven", label: "11 cm" },
            { id: "fourteen", label: "14 cm" },
        ],
        correctId: "fourteen",
        correctFeedback: "Exactly. The longest possible chord is the diameter, 12 cm, so 14 cm cannot fit inside the circle.",
        hints: {
            five: "A short chord near the edge is perfectly possible. Work out the diameter first, then ask which option is too long to fit.",
            eleven: "That one still fits. Select Diameter above \u2014 how long is the longest chord when the radius is 6 cm?",
        },
    },
];

/* ------------------------------------------------------------------ */
/* Blocks                                                              */
/* ------------------------------------------------------------------ */

export const partsOfACircleBlocks: ReactElement[] = [
    <StackLayout key="layout-parts-of-circle-heading" maxWidth="xl">
        <Block id="parts-of-circle-heading" padding="md">
            <EditableH2 id="h2-parts-of-circle-heading" blockId="parts-of-circle-heading">
                The Parts of a Circle
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-parts-of-circle-why-names-matter" maxWidth="xl">
        <Block id="parts-of-circle-why-names-matter" padding="sm">
            <EditableParagraph id="para-parts-of-circle-why-names-matter" blockId="parts-of-circle-why-names-matter">
                Every circle theorem is written in the language of radius, chord, arc and
                tangent. Choose the wrong word and you reach for the wrong rule, so it pays to
                be certain of each one.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-parts-of-circle-key-distinctions" maxWidth="xl">
        <Block id="parts-of-circle-key-distinctions" padding="sm">
            <EditableParagraph id="para-parts-of-circle-key-distinctions" blockId="parts-of-circle-key-distinctions">
                Click each name below to light up that part of the circle. Watch the difference
                between a chord, which joins any two points on the rim, and a diameter, which is
                the one chord passing through the centre. That single difference decides which
                theorems you are allowed to use.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-parts-of-circle-visual" maxWidth="xl">
        <Block id="parts-of-circle-visual" padding="sm" hasVisualization>
            <PartsOfACircleDiagram />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-parts-of-circle-practice" maxWidth="xl">
        <Block id="parts-of-circle-practice" padding="sm">
            <PracticeQuestions questions={PARTS_OF_A_CIRCLE_QUESTIONS} />
        </Block>
    </StackLayout>,
];
