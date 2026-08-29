import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph, InlineFormula, Table } from "@/components/atoms";
import { VisualOptionCards } from "@/components/organisms";

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
                in the far segment.
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
        <Block id="theorems-together-visual" padding="sm">
            <VisualOptionCards
                blockId="theorems-together-visual"
                intro="Pick how your students will see the theorems summarised and worked through."
                cards={[
                    {
                        id: "worked-example-steps",
                        title: "A worked question revealed one step at a time",
                        looks: "A circle diagram with one angle given and a missing angle marked. Beside it, the solution appears line by line, each line naming the theorem used.",
                        manipulate: "Students press next to uncover the following step, and can jump back to any earlier step",
                        reveals: "How to chain two theorems: find one angle first, then use it to reach the answer",
                        recommended: true,
                    },
                    {
                        id: "theorem-gallery",
                        title: "A gallery of six small circle diagrams, one per theorem",
                        looks: "Six mini diagrams laid out in a grid, each showing one theorem with its angles marked and its name underneath.",
                        manipulate: "Students click a diagram to enlarge it and read the rule in full",
                        reveals: "The whole set of theorems side by side, so the right one can be matched to a question by its picture",
                    },
                    {
                        id: "spot-the-theorem",
                        title: "A single diagram where students choose which theorem applies",
                        looks: "One circle carrying a diameter, a tangent and a quadrilateral, with a different angle highlighted each round.",
                        manipulate: "Students pick the theorem that unlocks the highlighted angle and get instant feedback",
                        reveals: "Choosing the right theorem is about spotting the feature in the diagram, not memorising an order",
                    },
                ]}
            />
        </Block>
    </StackLayout>,
];
