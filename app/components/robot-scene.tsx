"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { defaultPose, robotJoints, robotSegments, sampleRobot, tubePoint, type Vec3 } from "../../lib/robot-geometry";

export function RobotScene() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [pose, setPose] = useState(defaultPose);
  const [mode, setMode] = useState<"points" | "wireframe">("points");
  const [running, setRunning] = useState(true);
  const [supported, setSupported] = useState(true);
  const pointer = useRef(0);
  const segments = useMemo(() => robotSegments(pose.shoulder, pose.elbow), [pose]);
  const points = useMemo(() => sampleRobot(segments), [segments]);
  const current = useRef({ points, segments, mode, running });
  const end = robotJoints(pose.shoulder, pose.elbow)[3];

  useEffect(() => { current.current = { points, segments, mode, running }; }, [points, segments, mode, running]);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => setRunning(!preference.matches);
    applyPreference();
    preference.addEventListener("change", applyPreference);
    return () => preference.removeEventListener("change", applyPreference);
  }, []);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext("2d");
    if (!context) { setSupported(false); return; }
    let width = 600;
    let height = 470;
    let visible = true;
    let frame = 0;
    let previousTime = 0;
    let rotation = -0.55;
    let elapsed = 0;
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      element.width = width * ratio;
      element.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    });
    resize.observe(element);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(element);

    const draw = (time: number) => {
      frame = requestAnimationFrame(draw);
      const delta = Math.min(time - previousTime, 60);
      if (delta < 32) return;
      previousTime = time;
      if (!visible || document.hidden || !width || !height) return;
      const state = current.current;
      if (state.running) { rotation += delta * 0.00007; elapsed += delta * 0.001; }
      const yaw = rotation + pointer.current * 0.35;
      const scale = Math.min(width / 4.65, height / 3.5);
      const project = ([x, y, z]: Vec3) => {
        const rx = x * Math.cos(yaw) + z * Math.sin(yaw);
        const rz = -x * Math.sin(yaw) + z * Math.cos(yaw);
        const ry = (y - 1.35) * Math.cos(-0.19) - rz * Math.sin(-0.19);
        const depth = (y - 1.35) * Math.sin(-0.19) + rz * Math.cos(-0.19);
        const perspective = 7 / (7 + depth);
        return [width * 0.47 + rx * scale * perspective, height * 0.48 - ry * scale * perspective, depth];
      };
      const line = (from: Vec3, to: Vec3, color: string, lineWidth = 1) => {
        const a = project(from); const b = project(to);
        context.beginPath(); context.moveTo(a[0], a[1]); context.lineTo(b[0], b[1]);
        context.strokeStyle = color; context.lineWidth = lineWidth; context.stroke();
      };
      context.clearRect(0, 0, width, height);
      for (let grid = -6; grid <= 6; grid++) {
        line([grid * 0.5, -0.03, -3], [grid * 0.5, -0.03, 3], "rgba(87,154,153,.14)");
        line([-3, -0.03, grid * 0.5], [3, -0.03, grid * 0.5], "rgba(87,154,153,.14)");
      }
      const ringRadius = 0.85 + (elapsed * 0.3) % 1.4;
      context.beginPath();
      for (let i = 0; i <= 100; i++) {
        const angle = i / 100 * Math.PI * 2;
        const point = project([Math.cos(angle) * ringRadius, -0.02, Math.sin(angle) * ringRadius]);
        if (i === 0) context.moveTo(point[0], point[1]); else context.lineTo(point[0], point[1]);
      }
      context.strokeStyle = "rgba(89,255,204,.22)"; context.stroke();
      line([0, 0, 0], [1, 0, 0], "#53f3c0", 1.5);
      line([0, 0, 0], [0, 1, 0], "#74bbff", 1.5);
      line([0, 0, 0], [0, 0, 1], "#c7a1ff", 1.5);
      if (state.mode === "wireframe") {
        for (const segment of state.segments) {
          for (let ring = 0; ring < 12; ring++) {
            const angle = ring / 12 * Math.PI * 2;
            line(tubePoint(segment, 0, angle), tubePoint(segment, 1, angle), segment.accent ? "rgba(139,189,255,.75)" : "rgba(85,245,199,.6)");
          }
          for (const t of [0, 0.25, 0.5, 0.75, 1]) {
            for (let ring = 0; ring < 24; ring++) {
              line(tubePoint(segment, t, ring / 24 * Math.PI * 2), tubePoint(segment, t, (ring + 1) / 24 * Math.PI * 2), "rgba(113,255,217,.36)");
            }
          }
        }
      } else {
        const projected = state.points.map((point) => ({ ...point, screen: project(point.position) })).sort((a, b) => b.screen[2] - a.screen[2]);
        for (const point of projected) {
          const alpha = Math.max(0.18, point.intensity * (0.8 - point.screen[2] * 0.07));
          context.fillStyle = point.accent ? `rgba(155,196,255,${alpha})` : `rgba(103,255,210,${alpha})`;
          const radius = point.accent ? 1.5 : 1.15;
          context.fillRect(point.screen[0], point.screen[1], radius, radius);
        }
      }
      const joints = robotJointsFromSegments(state.segments);
      joints.forEach((joint, index) => {
        const point = project(joint);
        context.beginPath(); context.arc(point[0], point[1], 5, 0, Math.PI * 2);
        context.fillStyle = "#071318"; context.fill(); context.strokeStyle = "#adffdc"; context.stroke();
        context.fillStyle = "#9dbeb9"; context.font = "9px monospace"; context.fillText(`J${index + 1}`, point[0] + 12, point[1] - 10);
      });
    };
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); };
  }, []);

  return <div className="robot-scene">
    <div className="scene-heading mono"><span><i className="status-dot" /> KINEMATIC STUDY</span><span>ES / 001</span></div>
    <div className="scene-viewport" onPointerMove={(event) => { if (event.pointerType === "mouse") { const bounds = event.currentTarget.getBoundingClientRect(); pointer.current = (event.clientX - bounds.left) / bounds.width - 0.5; } }} onPointerLeave={() => { pointer.current = 0; }}>
      <div className="scene-orbit orbit-one" aria-hidden="true" /><div className="scene-orbit orbit-two" aria-hidden="true" />
      <span className="scene-coordinate mono">Y ↑<br />X ↗ Z →</span>
      <canvas ref={canvas} aria-label="Interactive three-dimensional robot arm. Use the joint sliders below to change its pose." role="img" />
      {!supported && <p className="canvas-fallback">3D rendering is unavailable. Joint controls and coordinates remain available below.</p>}
      <span className="scene-watermark" aria-hidden="true">EMBODIED</span>
      <div className="scene-view-controls"><button type="button" aria-label={running ? "Pause rotation" : "Resume rotation"} aria-pressed={!running} onClick={() => setRunning(!running)}>{running ? <span aria-hidden="true">Ⅱ</span> : <span aria-hidden="true">▷</span>}</button><button type="button" onClick={() => { setPose(defaultPose); pointer.current = 0; }} aria-label="Reset robot joints">↺</button></div>
    </div>
    <div className="scene-modes mono" aria-label="Visualization mode"><button type="button" aria-pressed={mode === "points"} onClick={() => setMode("points")}><span /> Point cloud</button><button type="button" aria-pressed={mode === "wireframe"} onClick={() => setMode("wireframe")}><span /> Wireframe</button><span className="model-label">CONCEPT MODEL</span></div>
    <div className="joint-controls"><label htmlFor="shoulder"><span className="mono">J1 / SHOULDER <output>{pose.shoulder}°</output></span><input id="shoulder" type="range" min="-60" max="35" value={pose.shoulder} onChange={(event) => setPose({ ...pose, shoulder: Number(event.target.value) })} /></label><label htmlFor="elbow"><span className="mono">J2 / ELBOW <output>{pose.elbow}°</output></span><input id="elbow" type="range" min="45" max="135" value={pose.elbow} onChange={(event) => setPose({ ...pose, elbow: Number(event.target.value) })} /></label></div>
    <div className="scene-readout mono"><span>END EFFECTOR <small>/ MODEL UNITS</small></span><output aria-label="End effector coordinates">X {end[0].toFixed(2)} <span>Y {end[1].toFixed(2)} Z {end[2].toFixed(2)}</span></output></div>
  </div>;
}

function robotJointsFromSegments(segments: ReturnType<typeof robotSegments>): Vec3[] {
  return [segments[2].from, segments[2].to, segments[3].to, segments[4].to];
}
