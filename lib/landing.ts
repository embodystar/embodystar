export const landing = {
  title: "EmbodyStar | Exploring Embodied Intelligence",
  description:
    "Explore the connection between perception, action, and learning. EmbodyStar brings the possibilities of AI beyond the screen and into the physical world.",
  about:
    "EmbodyStar is a project exploring embodied intelligence: how agents interact with their environment through a physical body, and learn from actions and feedback.",
  approach:
    "We follow the full loop, from sensing the environment and understanding a task to taking action and learning from the result. Open ideas, tools, and resources offer a starting point for exploration.",
  focusNote:
    "These are areas of exploration. See the project repository for current implementations and progress.",
  repository: "https://github.com/embodystar/embodystar",
};

export const explorationAreas = [
  {
    title: "Perceive the world",
    english: "PERCEPTION",
    description:
      "Explore how agents observe their surroundings through visual, spatial, and state information, building a foundation for understanding a task.",
    keywords: "Vision / Spatial understanding / State observation",
  },
  {
    title: "Turn intent into action",
    english: "ACTION",
    description:
      "Connect tasks with movement. Explore how robots interact with objects and move from planning an action to carrying it out.",
    keywords: "Task understanding / Planning / Physical interaction",
  },
  {
    title: "Learn from experience",
    english: "LEARNING",
    description:
      "Follow demonstrations, attempts, and feedback to understand the foundations of robot learning and how experience informs the next action.",
    keywords: "Demonstrations / Policy learning / Feedback",
  },
];

export const learningLoop = [
  {
    title: "Read the scene",
    english: "OBSERVE",
    description:
      "Start with a concrete setting. Identify the environment, the objects, and the task.",
  },
  {
    title: "Take action",
    english: "ACT",
    description:
      "Turn a task into movement, connecting perception and execution through interaction.",
  },
  {
    title: "Reflect and improve",
    english: "LEARN",
    description:
      "Record the process, examine the feedback, and bring what you learn to the next attempt.",
  },
];

export const resources = [
  {
    title: "EmbodyStar",
    label: "PROJECT / SOURCE CODE",
    description:
      "Explore the source code, current progress, and public discussions in the project repository.",
    url: landing.repository,
  },
  {
    title: "LeRobot",
    label: "ECOSYSTEM / OPEN SOURCE",
    description:
      "Discover the Hugging Face community's open-source robot learning project as a reference for further exploration.",
    url: "https://github.com/huggingface/lerobot",
  },
];

export const faqs = [
  {
    question: "What does EmbodyStar explore?",
    answer:
      "We explore the connections between perception, action, and learning in embodied intelligence. Concepts and open-source resources provide a starting point. This page describes our areas of interest; see the EmbodyStar repository for published implementations and progress.",
  },
  {
    question: "Do I need a robot to get started?",
    answer:
      "No. Start with the concepts, project source code, and open-source resources. Before running a particular robotics project, check its documentation for the required hardware, data, and environment.",
  },
  {
    question: "How can I follow progress or contribute?",
    answer:
      "Visit the EmbodyStar GitHub repository linked on this page to explore the code and updates, or join the discussion through repository Issues.",
  },
  {
    question: "Is the robot arm an EmbodyStar product?",
    answer:
      "The image comes from Hugging Face's LeRobot project and illustrates an embodied intelligence setting. It does not show an EmbodyStar product or imply a commercial partnership. Image credits and the license are linked in the footer.",
  },
];

export const architectureStages = [
  {
    id: "perception",
    label: "01 / PERCEPTION",
    title: "Make the world observable.",
    description:
      "Visual input and robot state become an observation: the information a policy can use to choose an action.",
    input: "Image + joint state",
    output: "Observation o_t",
    filename: "observation.example.json",
    code: '{\n  "observation": {\n    "image": {\n      "shape": [480, 640, 3],\n      "encoding": "rgb8"\n    },\n    "joint_positions": [-0.49, 1.83],\n    "frame": "robot_base"\n  }\n}',
    note: "An illustrative observation schema, not a live camera stream.",
  },
  {
    id: "action",
    label: "02 / ACTION",
    title: "Give intent a direction.",
    description:
      "A policy maps observations to an action representation. Joint targets are one way to describe what a robot should do next.",
    input: "Observation o_t",
    output: "Action a_t",
    filename: "action.example.json",
    code: '{\n  "action": {\n    "representation": "joint_targets",\n    "joint_positions": [-0.35, 1.57],\n    "units": "radians",\n    "reference_frame": "robot_base"\n  },\n  "execution": "illustrative_only"\n}',
    note: "Example targets explain the data flow; no physical hardware is connected.",
  },
  {
    id: "learning",
    label: "03 / LEARNING",
    title: "Close the feedback loop.",
    description:
      "Recorded observations, actions, and outcomes form an episode. Reviewing this experience connects execution with learning.",
    input: "Action + next observation",
    output: "Episode record",
    filename: "episode.example.json",
    code: '{\n  "episode": {\n    "task": "reach_target",\n    "transitions": [\n      {\n        "observation": "o_t",\n        "action": "a_t",\n        "next_observation": "o_t+1"\n      }\n    ]\n  }\n}',
    note: "A conceptual episode structure, not a training result or performance claim.",
  },
];
