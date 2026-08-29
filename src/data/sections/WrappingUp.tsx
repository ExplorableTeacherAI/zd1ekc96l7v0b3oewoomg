import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph, InlineFormula } from "@/components/atoms";

export const wrappingUpBlocks: ReactElement[] = [
    <StackLayout key="layout-wrapping-up-heading" maxWidth="xl">
        <Block id="wrapping-up-heading" padding="md">
            <EditableH2 id="h2-wrapping-up-heading" blockId="wrapping-up-heading">
                Wrapping Up
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wrapping-up-single-idea" maxWidth="xl">
        <Block id="wrapping-up-single-idea" padding="sm">
            <EditableParagraph id="para-wrapping-up-single-idea" blockId="wrapping-up-single-idea">
                Every rule here grows from one small fact: all the radii of a circle are the
                same length, so the triangles inside it are isosceles and their base angles are
                equal. The centre angle being double, the right angle in a semicircle, the equal
                angles in the same segment, the opposite corners adding to{" "}
                <InlineFormula latex="180^\circ" /> &mdash; all of it comes from there.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wrapping-up-what-next" maxWidth="xl">
        <Block id="wrapping-up-what-next" padding="sm">
            <EditableParagraph id="para-wrapping-up-what-next" blockId="wrapping-up-what-next">
                So a missing angle in a circle is hardly ever truly missing. Find the feature in
                the diagram, pick the theorem that matches it, work out one angle and let it
                carry you to the next. Next you will write these arguments out as proofs, giving
                the reason beside every step rather than just the number.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
