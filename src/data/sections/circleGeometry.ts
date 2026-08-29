/**
 * Small shared geometry helpers used by the circle theorem visuals.
 * Angles are in degrees, measured the usual mathematical way
 * (0 = to the right, increasing counter-clockwise on screen).
 */

export interface Point {
    x: number;
    y: number;
}

/** A point on a circle of the given centre and radius. */
export const pointOnCircle = (
    centreX: number,
    centreY: number,
    radius: number,
    angleDegrees: number,
): Point => ({
    x: centreX + radius * Math.cos((angleDegrees * Math.PI) / 180),
    y: centreY - radius * Math.sin((angleDegrees * Math.PI) / 180),
});

/** Bring an angle into the range (-180, 180]. */
export const normaliseDegrees = (angleDegrees: number): number => {
    let value = angleDegrees;
    while (value <= -180) value += 360;
    while (value > 180) value -= 360;
    return value;
};

/** The direction from one point to another, in degrees. */
export const directionDegrees = (from: Point, to: Point): number =>
    (Math.atan2(from.y - to.y, to.x - from.x) * 180) / Math.PI;

/** Path data for the smaller arc between two directions around a centre. */
export const minorArcPath = (
    centreX: number,
    centreY: number,
    radius: number,
    startDegrees: number,
    endDegrees: number,
): string => {
    const start = pointOnCircle(centreX, centreY, radius, startDegrees);
    const end = pointOnCircle(centreX, centreY, radius, endDegrees);
    const sweepFlag = normaliseDegrees(endDegrees - startDegrees) > 0 ? 0 : 1;
    return `M ${start.x.toFixed(1)},${start.y.toFixed(1)} A ${radius},${radius} 0 0 ${sweepFlag} ${end.x.toFixed(1)},${end.y.toFixed(1)}`;
};

/** The angle at `vertex` inside the triangle vertex-first-second, in degrees. */
export const angleAtVertex = (vertex: Point, first: Point, second: Point): number =>
    Math.abs(
        normaliseDegrees(directionDegrees(vertex, second) - directionDegrees(vertex, first)),
    );
