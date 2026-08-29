import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH1, EditableParagraph } from "@/components/atoms";

export const circleTheoremsIntroductionBlocks: ReactElement[] = [
    <StackLayout key="layout-circle-theorems-title" maxWidth="xl">
        <Block id="circle-theorems-title" padding="md">
            <EditableH1 id="h1-circle-theorems-title" blockId="circle-theorems-title">
                Circle Theorems
            </EditableH1>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-circle-theorems-hook" maxWidth="xl">
        <Block id="circle-theorems-hook" padding="sm">
            <EditableParagraph id="para-circle-theorems-hook" blockId="circle-theorems-hook">
                A Ferris wheel is a circle full of straight lines. Every carriage is joined to
                the centre by a spoke, and passengers looking across at one another make angles
                inside the rim. Those angles are not random. Wherever a passenger sits, the
                angle they see follows a rule, and once you know the rule you can work out an
                angle nobody could reach with a protractor.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-circle-theorems-promise" maxWidth="xl">
        <Block id="circle-theorems-promise" padding="sm">
            <EditableParagraph id="para-circle-theorems-promise" blockId="circle-theorems-promise">
                In this lesson you will use the circle theorems to find missing angles, starting
                with the angle at the centre and the angle in a semicircle. You already name the
                parts of a circle, use angles on a straight line, around a point and in a
                triangle, spot an isosceles triangle, and know that a quadrilateral's angles add
                to 360 degrees. That is everything you need to begin.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
