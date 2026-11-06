export type Kind = "Models" | "Datasets" | "Simulation" | "Research" | "Tools";
export type Resource = { id: string; title: string; org: string; kind: Kind; description: string; tags: string[]; url: string; art: string };
export const resources: Resource[] = [
  { id: "lerobot", title: "LeRobot", org: "Hugging Face", kind: "Models", description: "Make robotics more accessible with pretrained models, datasets, and tools for real-world robotics.", tags: ["Imitation learning", "PyTorch"], url: "https://github.com/huggingface/lerobot", art: "robot" },
  { id: "mujoco", title: "MuJoCo", org: "Google DeepMind", kind: "Simulation", description: "A fast, general-purpose physics engine for robotics research and development.", tags: ["Physics engine", "Open source"], url: "https://mujoco.org/", art: "simulation" },
  { id: "openx", title: "Open X-Embodiment", org: "Open X-Embodiment", kind: "Datasets", description: "Explore a collection of robotic learning datasets spanning multiple robot embodiments.", tags: ["Manipulation", "Multi-robot"], url: "https://robotics-transformer-x.github.io/", art: "dataset" },
  { id: "openvla", title: "OpenVLA", org: "OpenVLA team", kind: "Models", description: "An open-source vision-language-action model for generalist robotic manipulation.", tags: ["Vision-language-action", "Open source"], url: "https://openvla.github.io/", art: "model" },
  { id: "diffusion", title: "Diffusion Policy", org: "Columbia University", kind: "Research", description: "Learn visuomotor policies by representing robot behavior as an action diffusion process.", tags: ["Policy learning", "Manipulation"], url: "https://diffusion-policy.cs.columbia.edu/", art: "research" },
  { id: "ros", title: "ROS 2", org: "Open Robotics", kind: "Tools", description: "A flexible collection of libraries and tools to build your next robotics application.", tags: ["Development", "Middleware"], url: "https://docs.ros.org/", art: "tools" },
];
