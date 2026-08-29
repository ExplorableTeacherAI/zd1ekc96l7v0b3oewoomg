import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph, InlineFormula } from "@/components/atoms";
import { VisualOptionCards } from "@/components/organisms";

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
                half of 180 is 90. Swap the diameter for an ordinary chord and the right angle
                vanishes. So how far off 90 does an ordinary chord push you?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-semicircle-angle-visual" maxWidth="xl">
        <Block id="semicircle-angle-visual" padding="sm">
            <VisualOptionCards
                blockId="semicircle-angle-visual"
                intro="Pick how your students will see when a right angle really appears."
                cards={[
                    {
                        id: "diameter-versus-chord-switch",
                        title: "A circle where the base line switches between a diameter and an ordinary chord",
                        looks: "A circle with a line across it joined to a movable point on the rim, the angle at that point shown in degrees, and a marker on the centre showing whether the line passes through it.",
                        manipulate: "Students switch the base line between a diameter and an ordinary chord, then drag the top point around",
                        reveals: "The angle is locked at 90 degrees only while the base line passes through the centre",
                        recommended: true,
                        targetsMisconception: "Students treat any chord as a diameter and expect 90 degrees everywhere",
                    },
                    {
                        id: "sweep-the-right-angle",
                        title: "A triangle on a diameter that sweeps around the rim leaving a trail",
                        looks: "A fixed diameter with a triangle standing on it, the right angle marked with a square, and a faint trail of earlier positions.",
                        manipulate: "Students drag the top corner all the way around the semicircle",
                        reveals: "Every single position gives the same right angle, so the shape changes but the angle does not",
                    },
                    {
                        id: "half-of-a-straight-line",
                        title: "A diagram linking the 180 degrees at the centre to the 90 degrees at the rim",
                        looks: "A circle with the straight angle at the centre marked in one colour and the angle at the rim in another, with both values displayed.",
                        manipulate: "Students move the rim point and watch the two values side by side",
                        reveals: "The semicircle rule is just the angle at the centre rule with a straight line at the centre",
                    },
                ]}
            />
        </Block>
    </StackLayout>,
];
