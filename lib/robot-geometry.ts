export type Vec3 = [number, number, number];
export type Segment = {
  from: Vec3;
  to: Vec3;
  radius: number;
  accent?: boolean;
};
export type ScenePoint = { position: Vec3; intensity: number; accent: boolean };

export const defaultPose = { shoulder: -28, elbow: 105 };

export function robotJoints(shoulder: number, elbow: number): Vec3[] {
  const angles = [shoulder, shoulder + elbow, shoulder + elbow + 70];
  const lengths = [1.45, 1.35, 0.46];
  const joints: Vec3[] = [[0, 0.48, 0]];
  angles.forEach((angle, index) => {
    const radians = (angle * Math.PI) / 180;
    const previous = joints[index];
    joints.push([
      previous[0] + Math.sin(radians) * lengths[index],
      previous[1] + Math.cos(radians) * lengths[index],
      0,
    ]);
  });
  return joints;
}

export function robotSegments(shoulder: number, elbow: number): Segment[] {
  const joints = robotJoints(shoulder, elbow);
  const tip = joints[3];
  return [
    { from: [0, 0, 0], to: [0, 0.16, 0], radius: 0.6 },
    { from: [0, 0.16, 0], to: joints[0], radius: 0.27 },
    ...joints.slice(0, -1).map((from, index) => ({
      from,
      to: joints[index + 1],
      radius: [0.16, 0.13, 0.1][index],
    })),
    ...joints.slice(0, 3).map((joint) => ({
      from: [joint[0], joint[1], -0.23] as Vec3,
      to: [joint[0], joint[1], 0.23] as Vec3,
      radius: 0.25,
      accent: true,
    })),
    ...[-1, 1].flatMap((side): Segment[] => [
      {
        from: tip,
        to: [tip[0], tip[1] - 0.1, side * 0.17],
        radius: 0.055,
        accent: true,
      },
      {
        from: [tip[0], tip[1] - 0.1, side * 0.17],
        to: [tip[0], tip[1] - 0.4, side * 0.17],
        radius: 0.045,
        accent: true,
      },
    ]),
  ];
}

export function tubePoint(segment: Segment, t: number, angle: number): Vec3 {
  const direction = segment.to.map(
    (value, index) => value - segment.from[index],
  );
  const length = Math.hypot(...direction);
  const axis = direction.map((value) => value / length);
  const reference = Math.abs(axis[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
  const cross = [
    axis[1] * reference[2] - axis[2] * reference[1],
    axis[2] * reference[0] - axis[0] * reference[2],
    axis[0] * reference[1] - axis[1] * reference[0],
  ];
  const crossLength = Math.hypot(...cross);
  const u = cross.map((value) => value / crossLength);
  const v = [
    axis[1] * u[2] - axis[2] * u[1],
    axis[2] * u[0] - axis[0] * u[2],
    axis[0] * u[1] - axis[1] * u[0],
  ];
  return segment.from.map(
    (value, index) =>
      value +
      direction[index] * t +
      segment.radius *
        (u[index] * Math.cos(angle) + v[index] * Math.sin(angle)),
  ) as Vec3;
}

export function sampleRobot(segments: Segment[]): ScenePoint[] {
  return segments.flatMap((segment) => {
    const points: ScenePoint[] = [];
    const slices = Math.max(
      8,
      Math.ceil(
        Math.hypot(
          ...segment.to.map((value, index) => value - segment.from[index]),
        ) * 38,
      ),
    );
    for (let slice = 0; slice <= slices; slice++) {
      for (let ring = 0; ring < 24; ring++) {
        const angle = (ring / 24) * Math.PI * 2;
        points.push({
          position: tubePoint(segment, slice / slices, angle),
          intensity: 0.35 + 0.65 * (0.5 + Math.sin(angle) * 0.5),
          accent: Boolean(segment.accent),
        });
      }
    }
    return points;
  });
}
