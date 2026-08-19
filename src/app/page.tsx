"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Cpu, Layers, Eye, Zap, Terminal as TerminalIcon, 
  Sliders, Code, ChevronRight, RefreshCw, Compass, 
  Check, Mail, ArrowRight, Navigation, 
  BookOpen, Send, Monitor
} from "lucide-react";

// --- Types ---
interface AgentNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  type: "explorer" | "coordinator" | "effector";
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  color: string;
}

interface SandboxAgent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  history: { x: number; y: number }[];
  color: string;
}

interface SandboxObstacle {
  x: number;
  y: number;
  r: number;
}

export default function Home() {
  // --- Navigation & UI State ---
  const [activeTab, setActiveTab] = useState<"python" | "typescript">("python");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- Terminal Logs State ---
  const [logs, setLogs] = useState<string[]>([
    "[08:19:20] SYSTEM: embodystar kernel v4.2.1 initialized.",
    "[08:19:21] DISPATCH: Scanning spatial coordinates via lidar...",
    "[08:19:22] SENSOR: Point cloud mapping confidence: 98.4%",
    "[08:19:23] AGENT_A: Target 'blue_bottle' detected at {x: 1.4m, y: -0.3m, z: 0.8m}",
    "[08:19:24] PATH_PLANNER: Collision-free trajectory computed in 3.4ms.",
    "[08:19:25] ACTUATOR: Initiating closed-loop force grasp: torque limit 1.5Nm."
  ]);

  // --- Aesthetic Scan Angle State & Ref-free simulation ---
  const [scanAngle, setScanAngle] = useState(0.5);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanAngle((prev) => (prev + 0.05) % (Math.PI * 2));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // --- Utility Functions (Declared early to satisfy hook scoping) ---
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString("en-GB", { hour12: false });
    setLogs((prev) => [...prev.slice(-9), `[${timestamp}] ${message}`]);
  };
  const [isLidarScanning, setIsLidarScanning] = useState(false);
  const [consoleMetric, setConsoleMetric] = useState({
    cpu: 34,
    confidence: 98.4,
    latency: 3.4,
    torque: 0.8
  });

  // --- Newsletter / Contact State ---
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- Canvas Refs ---
  const networkCanvasRef = useRef<HTMLCanvasElement>(null);
  const lidarCanvasRef = useRef<HTMLCanvasElement>(null);
  const sandboxCanvasRef = useRef<HTMLCanvasElement>(null);

  // --- Lidar Point Cloud Generation & State ---
  const pointsRef = useRef<Point3D[]>([]);
  const lidarAngleRef = useRef({ x: 0.3, y: 0.5, z: 0 });

  // --- Sandbox Simulation State ---
  const sandboxStateRef = useRef<{
    agents: SandboxAgent[];
    obstacles: SandboxObstacle[];
    target: { x: number; y: number };
    isNavigating: boolean;
  }>({
    agents: [],
    obstacles: [],
    target: { x: 500, y: 150 },
    isNavigating: true
  });

  // =========================================================
  // EFFECT 1: Interactive Agent Network Background (Hero)
  // =========================================================
  useEffect(() => {
    const canvas = networkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    // Handle Resize
    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 800;
    };
    window.addEventListener("resize", handleResize);

    // Initialize Nodes
    const nodes: AgentNode[] = [];
    const colors = ["#06b6d4", "#a855f7", "#d946ef", "#ffffff"];
    const types: ("explorer" | "coordinator" | "effector")[] = ["explorer", "coordinator", "effector"];
    for (let i = 0; i < 45; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: types[Math.floor(Math.random() * types.length)]
      });
    }

    // Mouse Tracking
    const mouse = { x: -1000, y: -1000, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Add nodes on click
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      for (let i = 0; i < 3; i++) {
        nodes.push({
          x: clickX,
          y: clickY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: Math.random() * 3 + 2,
          color: "#d946ef", // fuchsia for user-spawned
          type: "explorer"
        });
        if (nodes.length > 80) nodes.shift(); // Keep node count capped
      }
    };
    canvas.addEventListener("click", handleCanvasClick);

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Update & Draw Nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Mouse attraction
        if (mouse.active) {
          const mdx = mouse.x - node.x;
          const mdy = mouse.y - node.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 180) {
            node.x += (mdx / mdist) * 0.2;
            node.y += (mdy / mdist) * 0.2;
          }
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // =========================================================
  // EFFECT 2: 3D Lidar Point Cloud Scanner Simulation
  // =========================================================
  useEffect(() => {
    const canvas = lidarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = 400);
    const height = (canvas.height = 300);

    // Generate 3D point cloud: a stylized "Agent Mind Spherical Constellation"
    const points: Point3D[] = [];
    // Outer Sphere
    for (let i = 0; i < 150; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 80;
      points.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        color: `rgba(6, 182, 212, ${0.4 + Math.random() * 0.5})` // Cyan glows
      });
    }
    // Inner Brain Core
    for (let i = 0; i < 50; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 25 + Math.random() * 10;
      points.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        color: `rgba(168, 85, 247, ${0.7 + Math.random() * 0.3})` // Purple core
      });
    }
    pointsRef.current = points;

    let scanLineY = 0;

    // Projection & Render Loop
    const render = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.2)"; // Faint trailing smear
      ctx.fillRect(0, 0, width, height);

      // Draw Grid / Radar circles
      ctx.strokeStyle = "rgba(6, 182, 212, 0.08)";
      ctx.lineWidth = 1;
      for (let r = 30; r < 140; r += 30) {
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw scanner grid lines
      ctx.beginPath();
      ctx.moveTo(width / 2, 20);
      ctx.lineTo(width / 2, height - 20);
      ctx.moveTo(20, height / 2);
      ctx.lineTo(width - 20, height / 2);
      ctx.stroke();

      // Rotate points
      const rx = lidarAngleRef.current.x;
      const ry = lidarAngleRef.current.y;
      lidarAngleRef.current.y += 0.008; // Continuous rotation
      lidarAngleRef.current.x += 0.003;

      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);

      // Projects and draws 3D points
      pointsRef.current.forEach((pt) => {
        // Rotate Y
        const x1 = pt.x * cosY - pt.z * sinY;
        const z1 = pt.x * sinY + pt.z * cosY;

        // Rotate X
        const y2 = pt.y * cosX - z1 * sinX;
        const z2 = pt.y * sinX + z1 * cosX;

        // Perspective scale factor
        const perspective = 300 / (300 + z2);
        const screenX = width / 2 + x1 * perspective;
        const screenY = height / 2 + y2 * perspective;

        // Render dot if within canvas limits
        if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, perspective * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = pt.color;
          ctx.fill();
        }
      });

      // Scan Laser Sweeping Sweep Effect
      scanLineY = (scanLineY + 2.5) % height;
      ctx.beginPath();
      ctx.moveTo(10, scanLineY);
      ctx.lineTo(width - 10, scanLineY);
      ctx.strokeStyle = isLidarScanning 
        ? "rgba(168, 85, 247, 0.6)" 
        : "rgba(6, 182, 212, 0.25)";
      ctx.lineWidth = isLidarScanning ? 3 : 1.5;
      ctx.stroke();

      // Sweep text indicator
      if (isLidarScanning) {
        ctx.fillStyle = "#a855f7";
        ctx.font = "bold 9px Courier New";
        ctx.fillText("LIDAR SWEEP: ACTIVE RECONSTRUCT", 20, scanLineY - 4);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLidarScanning]);

  // =========================================================
  // EFFECT 3: Interactive Sandbox (Dynamic AI Steering)
  // =========================================================
  useEffect(() => {
    const canvas = sandboxCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 550);
    const height = (canvas.height = 300);

    const state = sandboxStateRef.current;

    // Reset/Initialize Sandbox
    state.agents = [
      { x: 50, y: 80, vx: 0, vy: 0, history: [], color: "#6366f1" },
      { x: 50, y: 150, vx: 0, vy: 0, history: [], color: "#3b82f6" },
      { x: 50, y: 220, vx: 0, vy: 0, history: [], color: "#06b6d4" }
    ];
    state.obstacles = [
      { x: width * 0.35, y: height * 0.4, r: 35 },
      { x: width * 0.65, y: height * 0.65, r: 40 },
      { x: width * 0.5, y: height * 0.2, r: 25 }
    ];
    state.target = { x: width - 80, y: height / 2 };

    // Mouse interactive to drag Target or spawn Obstacles
    const handleSandboxClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Decide: If clicking far right, move target. If middle, place new obstacle.
      if (mouseX > width - 120) {
        state.target = { x: mouseX, y: mouseY };
        addLog(`[SANDBOX] Navigation Target relocated to {x: ${mouseX.toFixed(0)}, y: ${mouseY.toFixed(0)}}`);
      } else {
        // Create an obstacle
        const newObstacle = { x: mouseX, y: mouseY, r: 20 + Math.random() * 20 };
        state.obstacles.push(newObstacle);
        if (state.obstacles.length > 8) state.obstacles.shift(); // Max 8 obstacles
        addLog(`[SANDBOX] New physical obstacle generated at {x: ${mouseX.toFixed(0)}, y: ${mouseY.toFixed(0)}}`);
      }
    };
    canvas.addEventListener("click", handleSandboxClick);

    // Steering Simulation Loop
    const runSandbox = () => {
      ctx.fillStyle = "#0c0a09"; // Very dark brown/black
      ctx.fillRect(0, 0, width, height);

      // Draw target
      ctx.beginPath();
      ctx.arc(state.target.x, state.target.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#22c55e"; // bright green target
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#22c55e";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Pulse ring on target
      const pulseRadius = 8 + (Date.now() % 1000) / 80;
      ctx.beginPath();
      ctx.arc(state.target.x, state.target.y, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(34, 197, 94, ${1 - (Date.now() % 1000) / 1000})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw obstacles
      state.obstacles.forEach((obs) => {
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(41, 37, 36, 0.85)"; // stone gray fill
        ctx.strokeStyle = "rgba(120, 113, 108, 0.4)"; // light stone border
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Draw warning slash lines
        ctx.beginPath();
        ctx.strokeStyle = "rgba(239, 68, 68, 0.15)";
        ctx.lineWidth = 1;
        ctx.moveTo(obs.x - obs.r, obs.y);
        ctx.lineTo(obs.x + obs.r, obs.y);
        ctx.moveTo(obs.x, obs.y - obs.r);
        ctx.lineTo(obs.x, obs.y + obs.r);
        ctx.stroke();
      });

      // Update & Draw Agents
      if (state.isNavigating) {
        state.agents.forEach((agent) => {
          // 1. Steering force to target
          const tx = state.target.x - agent.x;
          const ty = state.target.y - agent.y;
          const distToTarget = Math.sqrt(tx * tx + ty * ty);

          let steerX = 0;
          let steerY = 0;

          if (distToTarget > 1) {
            // Desired velocity toward target at max speed
            const maxSpeed = 2.0;
            const desiredX = (tx / distToTarget) * maxSpeed;
            const desiredY = (ty / distToTarget) * maxSpeed;

            // Steering = Desired - Velocity
            steerX = desiredX - agent.vx;
            steerY = desiredY - agent.vy;
          }

          // 2. Obstacle avoidance
          const avoidWeight = 3.5;
          state.obstacles.forEach((obs) => {
            const ox = agent.x - obs.x;
            const oy = agent.y - obs.y;
            const distToObs = Math.sqrt(ox * ox + oy * oy);
            const safetyRadius = obs.r + 25; // radius + padding

            if (distToObs < safetyRadius) {
              // Strong repulsive steering away from obstacle center
              const forceScale = (1.0 - distToObs / safetyRadius) * avoidWeight;
              steerX += (ox / distToObs) * forceScale;
              steerY += (oy / distToObs) * forceScale;
            }
          });

          // Apply forces to velocity
          const forceCap = 0.15;
          const speedCap = 2.2;

          // Clamp forces
          const steerLen = Math.sqrt(steerX * steerX + steerY * steerY);
          if (steerLen > forceCap) {
            steerX = (steerX / steerLen) * forceCap;
            steerY = (steerY / steerLen) * forceCap;
          }

          agent.vx += steerX;
          agent.vy += steerY;

          // Clamp agent velocity
          const speed = Math.sqrt(agent.vx * agent.vx + agent.vy * agent.vy);
          if (speed > speedCap) {
            agent.vx = (agent.vx / speed) * speedCap;
            agent.vy = (agent.vy / speed) * speedCap;
          }

          // Move agent
          agent.x += agent.vx;
          agent.y += agent.vy;

          // Store trail history
          agent.history.push({ x: agent.x, y: agent.y });
          if (agent.history.length > 25) agent.history.shift();

          // Reset agent if very close to target
          if (distToTarget < 12) {
            agent.x = 40 + Math.random() * 30;
            agent.y = 50 + Math.random() * (height - 100);
            agent.vx = 0;
            agent.vy = 0;
            agent.history = [];
          }
        });
      }

      // Draw Agent Trails and glowing triangles
      state.agents.forEach((agent) => {
        // Draw history trail
        if (agent.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(agent.history[0].x, agent.history[0].y);
          for (let k = 1; k < agent.history.length; k++) {
            ctx.lineTo(agent.history[k].x, agent.history[k].y);
          }
          ctx.strokeStyle = agent.color;
          ctx.globalAlpha = 0.15;
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.globalAlpha = 1.0; // reset
        }

        // Draw Agent Body (Triangle pointing in direction of travel)
        const angle = Math.atan2(agent.vy, agent.vx);
        ctx.save();
        ctx.translate(agent.x, agent.y);
        ctx.rotate(angle);

        ctx.shadowBlur = 10;
        ctx.shadowColor = agent.color;

        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-6, -5);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-6, 5);
        ctx.closePath();
        ctx.fillStyle = agent.color;
        ctx.fill();

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.restore();
        ctx.shadowBlur = 0; // reset
      });

      // Simple instructions overlay in sandbox
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "10px sans-serif";
      ctx.fillText("Click left/center to generate OBSTACLES", 15, height - 25);
      ctx.fillText("Click far right to reposition TARGET", 15, height - 10);

      animationFrameId = requestAnimationFrame(runSandbox);
    };

    runSandbox();

    return () => {
      canvas.removeEventListener("click", handleSandboxClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // --- Utility Functions ---

  // --- Interactive Control Terminal Actions ---
  const triggerScan = () => {
    if (isLidarScanning) return;
    setIsLidarScanning(true);
    addLog("DISPATCH: Initializing full-spectrum 3D volumetric laser scan...");
    
    // Simulate active scan completion over time
    setTimeout(() => {
      setIsLidarScanning(false);
      setConsoleMetric(prev => ({ ...prev, confidence: 99.8, latency: 1.8 }));
      addLog("SENSOR: Volumetric scene scan complete. 2,490 points indexed successfully.");
      addLog("AGENT_A: Local coordinate state synced. Obstacle boundaries updated.");
    }, 2500);
  };

  const executeGrasp = () => {
    addLog("PLANNER: Locking kinematics. Preparing 6-axis actuator gripper grasp vector...");
    setConsoleMetric(prev => ({ ...prev, cpu: 78, torque: 1.4 }));
    
    setTimeout(() => {
      setConsoleMetric(prev => ({ ...prev, cpu: 42, torque: 0.9 }));
      addLog("ACTUATOR: Force torque detected. Grasp completed. [STATUS: SECURED]");
    }, 1500);
  };

  const dispatchAgent = () => {
    addLog("DISPATCH: Pushing direct navigation query to agent neural model.");
    setConsoleMetric(prev => ({ ...prev, cpu: 92, latency: 4.8 }));

    // Reset Sandbox Agents to start moving towards target in sandbox
    const state = sandboxStateRef.current;
    state.agents.forEach((ag, idx) => {
      ag.x = 40 + Math.random() * 20;
      ag.y = 40 + idx * 80 + Math.random() * 30;
      ag.vx = 0;
      ag.vy = 0;
      ag.history = [];
    });

    setTimeout(() => {
      setConsoleMetric(prev => ({ ...prev, cpu: 31, latency: 2.1 }));
      addLog("PATH_PLANNER: Direct path plotted. Obstacle buffer: 25cm. Speed: 1.2m/s.");
    }, 1000);
  };

  const calibrateJoints = () => {
    addLog("SYSTEM: Calibrating 18-DOF motor joint positional offsets...");
    
    setTimeout(() => {
      addLog("SYSTEM: IMU offset drift corrected. Accelerometer baseline balanced.");
      addLog("SYSTEM: Joint torque sensor calibration complete. [BIAS: 0.00mN]");
    }, 800);
  };

  // --- Forms handling ---
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setIsSubscribed(false);
    }, 5000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: "", email: "", message: "" });
      setIsSubmitted(false);
    }, 5000);
  };

  // --- SDK Snippets (rendered inside custom JSX pre blocks below) ---

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen selection:bg-cyan-500 selection:text-white overflow-x-hidden font-sans scroll-smooth">
      
      {/* Background Starfield Canvas Overlay */}
      <div className="absolute inset-0 h-[850px] overflow-hidden pointer-events-none z-0">
        <canvas ref={networkCanvasRef} className="opacity-45 block w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/80 to-neutral-950" />
      </div>

      {/* --- Navigation --- */}
      <nav className="sticky top-0 z-50 bg-neutral-950/75 backdrop-blur-md border-b border-neutral-900 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full overflow-hidden border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.4)] flex items-center justify-center">
                <img 
                  src="/embodystar_avatar.jpg" 
                  alt="embodystar logo" 
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-fuchsia-400 bg-clip-text text-transparent">
                embodystar
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
              <a href="#technology" className="hover:text-cyan-400 transition-colors">Technology</a>
              <a href="#dashboard" className="hover:text-cyan-400 transition-colors">Control Console</a>
              <a href="#sandbox" className="hover:text-cyan-400 transition-colors">Simulation Sandbox</a>
              <a href="#sdk" className="hover:text-cyan-400 transition-colors">Developer SDK</a>
              <a href="#connect" className="hover:text-cyan-400 transition-colors">Get Started</a>
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <a 
                href="#dashboard" 
                className="px-4 py-2 text-xs font-semibold rounded-full border border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:text-white hover:border-cyan-500 hover:bg-cyan-950/10 transition-all"
              >
                Developer Docs
              </a>
              <a 
                href="#connect" 
                className="px-4 py-2 text-xs font-semibold rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white hover:from-cyan-400 hover:to-fuchsia-500 shadow-md shadow-cyan-600/10 hover:shadow-cyan-500/20 transition-all flex items-center gap-1.5"
              >
                Connect Node
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900 focus:outline-none"
              >
                <span className="sr-only">Open Menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Links */}
        {isMenuOpen && (
          <div className="md:hidden bg-neutral-950 border-b border-neutral-900 px-4 pt-2 pb-4 space-y-2">
            <a href="#technology" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white">Technology</a>
            <a href="#dashboard" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white">Control Console</a>
            <a href="#sandbox" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white">Simulation Sandbox</a>
            <a href="#sdk" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white">Developer SDK</a>
            <a href="#connect" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-cyan-400 hover:bg-neutral-900 hover:text-white">Get Started</a>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-28 md:pb-36 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-semibold mb-6 animate-fade-in">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Next-Gen Spatial Intelligence Platform
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              <span className="block bg-gradient-to-r from-white via-neutral-100 to-cyan-200 bg-clip-text text-transparent">
                Where Artificial Minds
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent mt-1 pb-1">
                Inhabit Physical Reality
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-neutral-400 max-w-xl leading-relaxed mb-8">
              An open, distributed foundation for embodied intelligence. Powering autonomous agents that see, hear, reason, navigate, and act across physical robotics and high-fidelity virtual simulations.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a 
                href="#dashboard" 
                className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/15 hover:shadow-cyan-500/30 hover:from-cyan-400 hover:to-fuchsia-500 transition-all flex items-center justify-center gap-2 group"
              >
                Launch Control Console
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#sandbox" 
                className="px-8 py-4 rounded-full border border-neutral-800 bg-neutral-900/40 text-neutral-200 hover:text-white hover:border-cyan-500/40 font-semibold text-sm transition-all hover:bg-neutral-900 flex items-center justify-center gap-2"
              >
                Play Sandbox Simulation
              </a>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 mt-10 border-t border-neutral-900 w-full">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">5ms</div>
                <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mt-1">Saccadic Latency</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">1.8mm</div>
                <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mt-1">Grasp Precision</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">10M+</div>
                <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mt-1">Simulation Hours</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">99.8%</div>
                <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mt-1">Spatial Mapping</div>
              </div>
            </div>
          </div>

          {/* Right Column: High-tech Embodystar Holographic Portal */}
          <div className="lg:col-span-5 flex justify-center items-center w-full mt-10 lg:mt-0">
            <div className="group relative rounded-3xl border border-neutral-900 bg-neutral-900/10 p-6 w-full max-w-[420px] aspect-square flex flex-col justify-center items-center overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] hover:shadow-[0_0_60px_rgba(168,85,247,0.25)] transition-all duration-700">
              
              {/* Corner tech borders */}
              <div className="absolute top-3 left-3 h-3 w-3 border-t border-l border-cyan-500/40" />
              <div className="absolute top-3 right-3 h-3 w-3 border-t border-r border-cyan-500/40" />
              <div className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-cyan-500/40" />
              <div className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-cyan-500/40" />

              {/* Glowing space/grid texture background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-60" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

              <div className="relative h-72 w-72 flex items-center justify-center">
                {/* Rotating border 1: Cyan */}
                <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30 animate-[spin_40s_linear_infinite]" />
                {/* Rotating border 2: Fuchsia (opposite direction) */}
                <div className="absolute -inset-3 rounded-full border border-dashed border-fuchsia-500/20 animate-[spin_60s_linear_infinite_reverse]" />
                {/* Rotating ring 3 with custom style */}
                <div className="absolute inset-4 rounded-full border border-cyan-500/15" />
                <div className="absolute inset-4 rounded-full border-t-2 border-fuchsia-500/40 animate-[spin_10s_linear_infinite]" />

                {/* Glow backdrops */}
                <div className="absolute inset-10 rounded-full bg-cyan-500/10 blur-xl group-hover:bg-cyan-500/15 transition-all duration-700" />
                <div className="absolute inset-14 rounded-full bg-fuchsia-500/10 blur-xl group-hover:bg-fuchsia-500/15 transition-all duration-700" />
                
                {/* Main Logo Image */}
                <div className="relative h-56 w-56 rounded-full overflow-hidden border border-cyan-400/40 shadow-[0_0_40px_rgba(6,182,212,0.5)]">
                  <img 
                    src="/embodystar_square.jpg" 
                    alt="Embodystar Core" 
                    className="h-full w-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Floating telemetry labels */}
                <div className="absolute top-2 left-2 text-[9px] font-mono font-bold text-cyan-400 bg-neutral-950/90 px-2 py-0.5 rounded border border-cyan-500/35 shadow-md">
                  CORE_NODE: ES_01
                </div>
                <div className="absolute bottom-2 right-2 text-[9px] font-mono font-bold text-fuchsia-400 bg-neutral-950/90 px-2 py-0.5 rounded border border-fuchsia-500/35 shadow-md">
                  COGNITIVE_SYNC: 100%
                </div>
                
                {/* Floating active status */}
                <div className="absolute bottom-1/2 left-[-16px] -translate-y-1/2 text-[8px] font-mono text-neutral-500 tracking-widest uppercase origin-center -rotate-90">
                  SYSTEM ACTIVE
                </div>
              </div>

              {/* Bottom Telemetry HUD */}
              <div className="w-full flex items-center justify-between mt-4 px-2 text-[9px] font-mono text-neutral-500 border-t border-neutral-900 pt-3">
                <span className="flex items-center gap-1.5 text-cyan-400/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping" />
                  STABLE TELEMETRY
                </span>
                <span>FREQ: 942.8 GHz</span>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* --- SECTION 1: TECHNOLOGY SHOWCASE (GRID) --- */}
      <section id="technology" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-neutral-900 z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-500 mb-3">Core Infrastructure</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for physical-digital cognitive workflows
          </p>
          <p className="text-neutral-400 mt-4 max-w-xl mx-auto">
            Our technology bridges multi-modal deep models with low-level actuator torques, delivering safe, spatial-cognitive agency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="group relative rounded-2xl border border-neutral-900 bg-neutral-900/20 p-8 hover:border-fuchsia-500/25 transition-all overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="h-12 w-12 rounded-xl bg-fuchsia-600/10 border border-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center mb-6">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Multimodal Core Engine</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Proprietary transformer-based foundation models trained on 3D sensory inputs and physical interactions. Computes dynamic force controls natively.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-2xl border border-neutral-900 bg-neutral-900/20 p-8 hover:border-purple-500/25 transition-all overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="h-12 w-12 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Real-time Spatial Lidar</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Integrates point cloud grids with semantic understanding. Computes spatial bounds, geometry mapping, and movement routes on the edge.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative rounded-2xl border border-neutral-900 bg-neutral-900/20 p-8 hover:border-cyan-500/25 transition-all overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="h-12 w-12 rounded-xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Cooperative Agent Swarms</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Decentralized consensus protocol that coordinates physical drones, robotic manipulators, and virtual NPCs synchronously.
            </p>
          </div>

        </div>
      </section>

      {/* --- SECTION 2: LIVE CONTROL CONSOLE & LIDAR SCANNER --- */}
      <section id="dashboard" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-neutral-900 z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Console Text Intro */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">
              <Monitor className="h-4 w-4" />
              Real-Time Control Interface
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
              Empirical Sensor-Action Loop Interface
            </h2>
            <p className="text-neutral-400 leading-relaxed mb-6">
              Watch an embodied agent observe its surrounding environment and compute trajectories in real time. Use the direct system commands below to trigger active perception.
            </p>

            {/* Quick dashboard trigger controls */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={triggerScan}
                disabled={isLidarScanning}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-800 bg-neutral-900/30 text-neutral-300 hover:text-white hover:border-cyan-500 hover:bg-cyan-950/10 disabled:opacity-50 transition-all text-xs font-bold text-left"
              >
                <div className="h-7 w-7 rounded-lg bg-cyan-600/10 text-cyan-400 flex items-center justify-center">
                  <RefreshCw className={`h-4 w-4 ${isLidarScanning ? "animate-spin" : ""}`} />
                </div>
                <div>
                  <div className="text-white">Scan Lidar Mesh</div>
                  <div className="text-neutral-500 font-normal text-[10px] mt-0.5">3D point acquisition</div>
                </div>
              </button>

              <button 
                onClick={dispatchAgent}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-800 bg-neutral-900/30 text-neutral-300 hover:text-white hover:border-fuchsia-500 hover:bg-fuchsia-950/10 transition-all text-xs font-bold text-left"
              >
                <div className="h-7 w-7 rounded-lg bg-fuchsia-600/10 text-fuchsia-400 flex items-center justify-center">
                  <Navigation className="h-4 w-4 animate-pulse" />
                </div>
                <div>
                  <div className="text-white">Dispatch Agent</div>
                  <div className="text-neutral-500 font-normal text-[10px] mt-0.5">Push route parameters</div>
                </div>
              </button>

              <button 
                onClick={executeGrasp}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-800 bg-neutral-900/30 text-neutral-300 hover:text-white hover:border-purple-500 hover:bg-purple-950/10 transition-all text-xs font-bold text-left"
              >
                <div className="h-7 w-7 rounded-lg bg-purple-600/10 text-purple-400 flex items-center justify-center">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-white">Calibrate Grasp</div>
                  <div className="text-neutral-500 font-normal text-[10px] mt-0.5">Force closed-loop test</div>
                </div>
              </button>

              <button 
                onClick={calibrateJoints}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-800 bg-neutral-900/30 text-neutral-300 hover:text-white hover:border-cyan-500 hover:bg-cyan-950/10 transition-all text-xs font-bold text-left"
              >
                <div className="h-7 w-7 rounded-lg bg-cyan-600/10 text-cyan-400 flex items-center justify-center">
                  <Sliders className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-white">Zero-Drift IMU</div>
                  <div className="text-neutral-500 font-normal text-[10px] mt-0.5">Re-align 18-DOF motor</div>
                </div>
              </button>
            </div>

            {/* Simulated Live System Metrics */}
            <div className="grid grid-cols-2 gap-4 mt-6 p-4 rounded-xl border border-neutral-900 bg-neutral-900/10">
              <div>
                <div className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">Perception CPU</div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-lg font-bold text-white">{consoleMetric.cpu}%</span>
                  <span className="text-[10px] text-green-500 font-medium">Dynamic</span>
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">Map Confidence</div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-lg font-bold text-cyan-400">{consoleMetric.confidence}%</span>
                  <span className="text-[10px] text-neutral-500 font-normal">Stereo</span>
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">Planner Latency</div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-lg font-bold text-white">{consoleMetric.latency}ms</span>
                  <span className="text-[10px] text-green-500 font-medium">Core API</span>
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">Actuator Torque</div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-lg font-bold text-purple-400">{consoleMetric.torque}Nm</span>
                  <span className="text-[10px] text-neutral-400 font-normal">Closed-loop</span>
                </div>
              </div>
            </div>

          </div>

          {/* Console Visualizers (Lidar + Terminal Output) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Lidar Point Cloud Box */}
            <div className="rounded-2xl border border-neutral-900 bg-neutral-950 p-4 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="text-xs font-semibold text-neutral-200 uppercase tracking-widest font-mono">Sensory Volumetric Lidar Feed</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">FRAME_ID: 94002</span>
              </div>

              {/* Lidar Canvas container */}
              <div className="flex justify-center items-center bg-[#0a0a0a] rounded-xl border border-neutral-900/60 p-2 relative h-[280px]">
                <canvas ref={lidarCanvasRef} className="block w-full max-w-[380px] h-[250px]" />
                
                {/* Hologram overlay styling */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a] pointer-events-none" />
                <div className="absolute bottom-4 right-4 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 text-[10px] font-mono px-2.5 py-1 rounded text-cyan-400">
                  REF_XYZ: {scanAngle.toFixed(2)}RAD
                </div>
              </div>
            </div>

            {/* Terminal logs display */}
            <div className="rounded-2xl border border-neutral-900 bg-neutral-950 p-5 font-mono shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-neutral-200 uppercase tracking-widest">Active System Kernel Output</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                </div>
              </div>

              <div className="space-y-1.5 h-[160px] overflow-y-auto text-xs text-neutral-300 custom-scrollbar pr-2 select-text">
                {logs.map((log, i) => (
                  <div 
                    key={i} 
                    className={`whitespace-pre-wrap ${
                      log.includes("SYSTEM:") ? "text-neutral-400" :
                      log.includes("DISPATCH:") ? "text-blue-400" :
                      log.includes("SENSOR:") ? "text-cyan-400" :
                      log.includes("AGENT_A:") ? "text-purple-400 font-semibold" :
                      log.includes("PATH_PLANNER:") ? "text-amber-400" :
                      log.includes("ACTUATOR:") ? "text-emerald-400 font-medium" : "text-neutral-300"
                    }`}
                  >
                    {log}
                  </div>
                ))}
                {/* Blinking cursor log entry */}
                <div className="text-neutral-500 flex items-center">
                  <span>[{new Date().toLocaleTimeString("en-GB", { hour12: false })}] awaiting instruction</span>
                  <span className="ml-1 w-2 h-3 bg-neutral-400 inline-block animate-pulse" />
                </div>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* --- SECTION 3: INTERACTIVE AI SANDBOX --- */}
      <section id="sandbox" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-neutral-900 z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-500 mb-3">Live Simulation Sandbox</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Observe Steering & Collision Avoidance
          </p>
          <p className="text-neutral-400 mt-4 max-w-xl mx-auto">
            These mock agents navigate towards the target (green sphere) using dynamic steering vector mathematics, planning paths around user-placed obstacles in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sandbox Canvas Box */}
          <div className="lg:col-span-8 bg-neutral-950 border border-neutral-900 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase text-neutral-300">2D Spatial Computing Arena</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    const state = sandboxStateRef.current;
                    state.obstacles = [];
                    addLog("[SANDBOX] Cleared all static obstacle constraints from simulation.");
                  }}
                  className="text-[10px] font-mono font-bold border border-neutral-800 bg-neutral-900 px-2 py-1 rounded hover:text-white hover:border-red-500 hover:bg-red-950/10 transition-all"
                >
                  Clear Obstacles
                </button>
                <button 
                  onClick={() => {
                    const state = sandboxStateRef.current;
                    state.isNavigating = !state.isNavigating;
                    addLog(`[SANDBOX] Simulation execution ${state.isNavigating ? "RESUMED" : "PAUSED"}.`);
                  }}
                  className="text-[10px] font-mono font-bold border border-neutral-800 bg-neutral-900 px-2 py-1 rounded hover:text-white hover:border-cyan-500 transition-all flex items-center gap-1"
                >
                  Pause / Resume
                </button>
              </div>
            </div>

            {/* Sandbox Canvas Element */}
            <div className="w-full bg-[#0c0a09] rounded-xl border border-neutral-900/70 overflow-hidden select-none cursor-crosshair">
              <canvas ref={sandboxCanvasRef} className="block w-full h-[300px]" />
            </div>
          </div>

          {/* Sandbox Simulation Theory Panel */}
          <div className="lg:col-span-4 bg-neutral-900/10 border border-neutral-900 rounded-2xl p-6 lg:h-[390px] flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Compass className="h-5 w-5 text-cyan-400" />
                Algorithmic Dynamics
              </h3>
              
              <div className="space-y-4 text-xs text-neutral-400">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    1
                  </div>
                  <p className="leading-relaxed">
                    <strong className="text-white">Steering Vector Field:</strong> Agents calculate target attraction forces proportional to distance, scaling down to zero speed within threshold zones.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    2
                  </div>
                  <p className="leading-relaxed">
                    <strong className="text-white">Active Avoidance:</strong> Each agent maps obstacles inside its sensor sweep range, generating strong lateral torque velocities to steer around barriers cleanly.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    3
                  </div>
                  <p className="leading-relaxed">
                    <strong className="text-white">Local Coordinate Synced:</strong> Live spatial parameters are streamed directly into our API kernel loop, proving seamless agent routing capabilities.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-900 pt-4 mt-6">
              <button 
                onClick={() => {
                  const state = sandboxStateRef.current;
                  const canvas = sandboxCanvasRef.current;
                  if (!canvas) return;
                  state.target = { 
                    x: canvas.width / 2 + (Math.random() - 0.5) * (canvas.width * 0.4), 
                    y: canvas.height / 2 + (Math.random() - 0.5) * (canvas.height * 0.4)
                  };
                  addLog(`[SANDBOX] Random target vector calculated: {x: ${state.target.x.toFixed(0)}, y: ${state.target.y.toFixed(0)}}`);
                }}
                className="w-full text-center px-4 py-3 rounded-xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 hover:text-white hover:bg-cyan-600 transition-all text-xs font-bold"
              >
                Randomize Target Path
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* --- SECTION 4: API SDK SNIPPET SECTION --- */}
      <section id="sdk" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-neutral-900 z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* SDK Explanatory text */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">
              <Code className="h-4 w-4" />
              Developer SDK Interface
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
              Surgical Control in Ten Lines of Code
            </h2>
            <p className="text-neutral-400 leading-relaxed mb-6">
              The embodystar SDK is a unified developer package designed to command diverse robotic actuators and virtual avatars. Integrate multi-modal sensory pipelines and path-planners effortlessly.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-cyan-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Native Hardware Abstraction</h4>
                  <p className="text-neutral-500 text-xs mt-0.5">Compatible with standard robotic arm controllers (ROS2, EtherCAT) and virtual frameworks (Unity, Unreal Engine, Isaac Sim).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-cyan-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Closed-loop Haptic Feedback</h4>
                  <p className="text-neutral-500 text-xs mt-0.5">Sub-millisecond tactile event callbacks enable real-time compliance adjustments and collision fallback actions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* SDK Code Snippet Editor Box */}
          <div className="lg:col-span-7 bg-neutral-950 border border-neutral-900 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
              {/* Language Selector Tabs */}
              <div className="flex gap-2.5">
                <button 
                  onClick={() => setActiveTab("python")} 
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === "python" 
                      ? "bg-cyan-600/10 text-cyan-400 border border-cyan-500/25" 
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  python-sdk
                </button>
                <button 
                  onClick={() => setActiveTab("typescript")} 
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === "typescript" 
                      ? "bg-cyan-600/10 text-cyan-400 border border-cyan-500/25" 
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  typescript-sdk
                </button>
              </div>

              {/* Terminal buttons */}
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
              </div>
            </div>

            {/* Code Highlight Block container */}
            <div className="rounded-xl bg-[#080707] border border-neutral-900 p-4 font-mono text-xs overflow-x-auto select-text select-all leading-relaxed whitespace-pre h-[340px] text-neutral-300">
              {activeTab === "python" ? (
                <div>
                  <span className="text-indigo-400">from</span> embodystar <span className="text-indigo-400">import</span> EmbodiedAgent, Environment3D<br /><br />
                  <span className="text-neutral-500"># 1. Initialize our Embodied AI Agent on a humanoid hardware platform</span><br />
                  agent = EmbodiedAgent(<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;model=<span className="text-emerald-400">&quot;star-embodied-v2&quot;</span>,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;hardware=<span className="text-emerald-400">&quot;humanoid-alpha-4&quot;</span>,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;perception=[<span className="text-emerald-400">&quot;lidar-hdr&quot;</span>, <span className="text-emerald-400">&quot;depth-stereo&quot;</span>, <span className="text-emerald-400">&quot;tactile-matrix&quot;</span>]<br />
                  )<br /><br />
                  <span className="text-neutral-500"># 2. Establish connection to local spatial sensor network</span><br />
                  env = Environment3D.connect_active_workspace()<br /><br />
                  <span className="text-neutral-500"># 3. Request multi-modal action execution with dynamic obstacle fallback</span><br />
                  agent.execute_task(<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;instruction=<span className="text-emerald-400">&quot;Locate the red mechanical component, check for structural defects, and store it in Bin A.&quot;</span>,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;fallback_policy=<span className="text-emerald-400">&quot;safe-standby&quot;</span>,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;max_torque_nm=<span className="text-purple-400">2.5</span><br />
                  )<br /><br />
                  <span className="text-neutral-500"># 4. Read closed-loop sensory metrics from the physical effector</span><br />
                  status = agent.get_telemetry()<br />
                  <span className="text-indigo-400">print</span>(<span className="text-emerald-400">f&quot;Grasp force: </span><span className="text-indigo-400">&#123;</span>status.tactile.force_newtons<span className="text-indigo-400">&#125;</span><span className="text-emerald-400">N | Path confidence: </span><span className="text-indigo-400">&#123;</span>status.planner.confidence<span className="text-indigo-400">&#125;</span><span className="text-emerald-400">%&quot;</span>)
                </div>
              ) : (
                <div>
                  <span className="text-indigo-400">import</span> &#123; EmbodiedAgent, CoordinateSystem &#125; <span className="text-indigo-400">from</span> <span className="text-emerald-400">&apos;embodystar-sdk&apos;</span>;<br /><br />
                  <span className="text-neutral-500">{"// 1. Instantiating our physical agent supervisor"}</span><br />
                  <span className="text-indigo-400">const</span> agent = <span className="text-indigo-400">new</span> EmbodiedAgent(&#123;<br />
                  &nbsp;&nbsp;agentId: <span className="text-emerald-400">&apos;agent-swarm-node-12&apos;</span>,<br />
                  &nbsp;&nbsp;autonomyLevel: <span className="text-emerald-400">&apos;dynamic-cooperative&apos;</span>,<br />
                  &nbsp;&nbsp;telemetryStream: <span className="text-indigo-400">true</span><br />
                  &#125;);<br /><br />
                  <span className="text-neutral-500">{"// 2. Subscribe to spatial environment lidar tracking events"}</span><br />
                  agent.on(<span className="text-emerald-400">&apos;perceptionUpdate&apos;</span>, (pointCloud) =&gt; &#123;<br />
                  &nbsp;&nbsp;<span className="text-indigo-400">const</span> density = pointCloud.getDensity();<br />
                  &nbsp;&nbsp;console.log(<span className="text-emerald-400">{"`[Perception] Active resolution: ${density} pts/m³`"}</span>);<br />
                  &#125;);<br /><br />
                  <span className="text-neutral-500">{"// 3. Command agent to navigate safely around real-time obstacle fields"}</span><br />
                  <span className="text-indigo-400">const</span> targetDestination = <span className="text-indigo-400">new</span> CoordinateSystem(&#123; x: <span className="text-purple-400">12.5</span>, y: <span className="text-purple-400">-4.2</span>, z: <span className="text-purple-400">0.0</span> &#125;);<br />
                  <span className="text-indigo-400">await</span> agent.navigateTo(targetDestination, &#123;<br />
                  &nbsp;&nbsp;obstacleAvoidanceBufferCm: <span className="text-purple-400">30</span>,<br />
                  &nbsp;&nbsp;speedLimitMetersPerSec: <span className="text-purple-400">1.5</span>,<br />
                  &nbsp;&nbsp;onCollisionAvoidance: (obstacle) =&gt; &#123;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;console.warn(<span className="text-emerald-400">{"`Rerouting! Detected dynamic obstacle: ${obstacle.id}`"}</span>);<br />
                  &nbsp;&nbsp;&#125;<br />
                  &#125;);
                </div>
              )}
            </div>
          </div>

        </div>

      </section>

      {/* --- SECTION 5: CONTACT & NEWSLETTER & FOOTER --- */}
      <section id="connect" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-neutral-900 z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Newsletter Box */}
          <div className="lg:col-span-5 bg-neutral-900/10 border border-neutral-900 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Mail className="h-5 w-5 text-cyan-400 animate-pulse" />
              Stay Indexed
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-6">
              Subscribe to the embodystar research log to receive breakthroughs in spatial perception models, multi-agent algorithms, and dynamic kinematics.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@university.edu" 
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                />
              </div>
              <button 
                type="submit"
                className="w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white hover:from-cyan-400 hover:to-fuchsia-500 font-semibold text-xs shadow-md shadow-cyan-600/10 hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubscribed ? "Verification Sent!" : "Register Node / Email"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            {isSubscribed && (
              <div className="mt-4 p-3 bg-cyan-950/20 border border-cyan-500/35 rounded-xl flex items-start gap-2.5 text-xs text-cyan-400">
                <Check className="h-4.5 w-4.5 shrink-0" />
                <p>Node registry successful. Please check your mailbox to authenticate coordinates.</p>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-neutral-950 border border-neutral-900 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Initiate Coordination</h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-6">
              Looking to deploy embodystar models onto bespoke physical robot arms or request hardware partnership? Connect with our technical coordination core.
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 font-mono">Researcher Name</label>
                  <input 
                    type="text" 
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Dr. Evelyn Vance" 
                    required
                    className="w-full bg-neutral-900/35 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 font-mono">Affiliation Email</label>
                  <input 
                    type="email" 
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="evance@spatialcognition.io" 
                    required
                    className="w-full bg-neutral-900/35 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 font-mono">Task Objective / Query Parameters</label>
                <textarea 
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Detail your hardware workspace, robot model, or virtual simulation pipeline requirement here..." 
                  required
                  className="w-full bg-neutral-900/35 border border-neutral-800 rounded-xl p-4 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                />
              </div>
              <button 
                type="submit"
                className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                {isSubmitted ? "Payload Transmitted" : "Transmit Query"}
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            {isSubmitted && (
              <div className="mt-4 p-3 bg-cyan-950/20 border border-cyan-500/35 rounded-xl flex items-start gap-2.5 text-xs text-cyan-400">
                <Check className="h-4.5 w-4.5 shrink-0" />
                <p>Task packet payload accepted. An engineer will coordinate dynamic replies shortly.</p>
              </div>
            )}
          </div>

        </div>

        {/* --- FOOTER --- */}
        <footer className="mt-20 pt-10 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-neutral-500">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full overflow-hidden border border-cyan-500/40 shadow-sm flex items-center justify-center">
              <img src="/embodystar_avatar.jpg" alt="Logo" className="h-full w-full object-cover" />
            </div>
            <span className="font-bold text-neutral-300">embodystar</span>
            <span className="text-xs text-neutral-600">| Embodied Agency Laboratory © 2026</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
            <a href="#dashboard" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              Kernel Docs
            </a>
          </div>
        </footer>

      </section>

    </div>
  );
}

// Add simple CSS styles for custom scrollbar in Tailwind v4
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #0a0a0a;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #262626;
      border-radius: 2px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #404040;
    }
  `;
  document.head.appendChild(style);
}
