import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph } from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { VisualOptionCards } from "@/components/organisms";

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
                Take two carriages on the Ferris wheel rim. Their spokes meet at the hub and
                make an angle there. A passenger sitting anywhere else on the rim also sees an
                angle between those same two carriages. Two angles, one pair of carriages, and
                they are always linked.
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
                Twice, not equal. And the rule only holds while both angles stand on the same
                arc, so the passenger must be on the far side of the two carriages, not tucked
                between them. So does it really stay double wherever that passenger sits? Time
                to test it.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-angle-at-centre-visual" maxWidth="xl">
        <Block id="angle-at-centre-visual" padding="sm">
            <VisualOptionCards
                blockId="angle-at-centre-visual"
                intro="Pick how your students will discover the doubling rule."
                cards={[
                    {
                        id: "drag-the-viewpoint",
                        title: "A circle with a movable point on the rim showing both angles as numbers",
                        looks: "A circle with two fixed points on the rim joined to the centre and to a third movable point. Both angles are drawn and their sizes shown in degrees, with the ratio between them displayed.",
                        manipulate: "Students drag the movable point around the rim and watch the two numbers change together",
                        reveals: "The centre angle stays exactly twice the other one no matter where the point sits, so equal is never right",
                        recommended: true,
                        targetsMisconception: "Students think the centre angle equals the circumference angle",
                    },
                    {
                        id: "same-arc-versus-different-arc",
                        title: "Two circles side by side: one where the rule works, one where it fails",
                        looks: "The same pair of points on both circles. On the left the third point sits on the major arc; on the right it sits on the minor arc. Both pairs of angles are labelled, and the failing case is flagged.",
                        manipulate: "Students switch the third point between the two arcs and compare the numbers",
                        reveals: "The doubling rule only applies when both angles stand on the same arc",
                        targetsMisconception: "Students use the centre rule when the angles sit on different arcs",
                    },
                    {
                        id: "isosceles-proof-steps",
                        title: "A step-by-step build showing why the doubling happens",
                        looks: "A circle with the two isosceles triangles formed by the radii shaded in different colours, with the equal base angles marked.",
                        manipulate: "Students step forward through the proof one line at a time",
                        reveals: "The doubling comes straight from the equal base angles of the isosceles triangles made by the radii",
                    },
                ]}
            />
        </Block>
    </StackLayout>,
];
