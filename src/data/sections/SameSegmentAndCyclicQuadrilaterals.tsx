import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph, InlineFormula } from "@/components/atoms";
import { VisualOptionCards } from "@/components/organisms";

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
                from the doubling rule: both angles are half of the same centre angle.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-cyclic-quadrilateral-rule" maxWidth="xl">
        <Block id="cyclic-quadrilateral-rule" padding="sm">
            <EditableParagraph id="para-cyclic-quadrilateral-rule" blockId="cyclic-quadrilateral-rule">
                Now put four points on the rim and join them into a quadrilateral. Its opposite
                angles add to <InlineFormula latex="180^\circ" /> &mdash; the corners that face
                each other across the shape, never the two that sit side by side. So what happens
                to one corner when the opposite one is moved?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-same-segment-cyclic-visual" maxWidth="xl">
        <Block id="same-segment-cyclic-visual" padding="sm">
            <VisualOptionCards
                blockId="same-segment-cyclic-visual"
                intro="Pick how your students will explore these two rules."
                cards={[
                    {
                        id: "four-corners-live-totals",
                        title: "A quadrilateral in a circle with both pairs of corners totalled live",
                        looks: "Four draggable points on the rim joined into a quadrilateral. All four angles are labelled, and two running totals are shown: one for the opposite pair, one for a neighbouring pair.",
                        manipulate: "Students drag any corner around the rim and watch which total stays fixed",
                        reveals: "Only the opposite pair holds at 180 degrees; the neighbouring pair wanders freely",
                        recommended: true,
                        targetsMisconception: "Students add adjacent angles instead of opposite ones",
                    },
                    {
                        id: "two-viewers-same-segment",
                        title: "Two viewing points on the rim showing the same angle",
                        looks: "A circle with a chord and two movable points above it, each with its angle drawn and measured, plus a shaded segment showing which side counts.",
                        manipulate: "Students drag either viewer along the rim and compare the two readings",
                        reveals: "Angles in the same segment stay equal, and cross into the other segment and they stop being equal",
                    },
                    {
                        id: "rules-side-by-side",
                        title: "One circle showing both rules at once, switchable",
                        looks: "A single circle that switches between the same segment picture and the four-corner quadrilateral, with the relevant angles highlighted each time.",
                        manipulate: "Students switch between the two rules and drag the points in each",
                        reveals: "Both rules come from the same doubling idea seen from different positions",
                    },
                ]}
            />
        </Block>
    </StackLayout>,
];
