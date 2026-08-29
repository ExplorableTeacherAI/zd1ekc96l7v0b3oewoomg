import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph } from "@/components/atoms";
import { VisualOptionCards } from "@/components/organisms";

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
                A chord joins any two points on the rim. A diameter is the one special chord
                that passes through the centre, and that single difference decides which
                theorems you are allowed to use. A tangent touches the rim at exactly one point
                and never crosses it.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-parts-of-circle-visual" maxWidth="xl">
        <Block id="parts-of-circle-visual" padding="sm">
            <VisualOptionCards
                blockId="parts-of-circle-visual"
                intro="Pick how your students will get the vocabulary of a circle secure."
                cards={[
                    {
                        id: "click-to-label",
                        title: "A circle where students click each part to see it named and highlighted",
                        looks: "One large circle with the centre, radius, diameter, chord, arc, tangent and segment drawn on it. Only the part being explored is coloured; the rest sits quietly in grey.",
                        manipulate: "Students click a name from a list and the matching part lights up on the circle",
                        reveals: "Each word points to one specific feature, and the diameter is simply the chord that goes through the centre",
                        recommended: true,
                    },
                    {
                        id: "drag-the-endpoints",
                        title: "A circle with a chord students can drag until it becomes a diameter",
                        looks: "A circle with a chord joining two draggable points on the rim, its length shown, and the centre marked.",
                        manipulate: "Students drag the two ends of the chord around the rim and watch it pass through the centre",
                        reveals: "A diameter is the longest chord and the only one that passes through the centre",
                        targetsMisconception: "Students treat any chord as a diameter",
                    },
                    {
                        id: "wheel-with-parts",
                        title: "A Ferris wheel with the parts of a circle drawn onto it",
                        looks: "A simple Ferris wheel: carriages spaced around the rim, spokes to the hub, a support bar touching the wheel at one point.",
                        manipulate: "Students tap a spoke, a bar between carriages or the support to see which circle word it matches",
                        reveals: "The parts of a circle are real features of a real object, not abstract labels",
                    },
                ]}
            />
        </Block>
    </StackLayout>,
];
