export const landing = {
  title: "EmbodyStar | Exploring Embodied Intelligence",
  description: "Explore the connection between perception, action, and learning. EmbodyStar brings the possibilities of AI beyond the screen and into the physical world.",
  about: "EmbodyStar is a project exploring embodied intelligence: how agents interact with their environment through a physical body, and learn from actions and feedback.",
  approach: "We follow the full loop, from sensing the environment and understanding a task to taking action and learning from the result. Open ideas, tools, and resources offer a starting point for exploration.",
  focusNote: "These are areas of exploration. See the project repository for current implementations and progress.",
  repository: "https://github.com/embodystar/embodystar",
};

export const explorationAreas = [
  { title: "Perceive the world", english: "PERCEPTION", description: "Explore how agents observe their surroundings through visual, spatial, and state information, building a foundation for understanding a task.", keywords: "Vision / Spatial understanding / State observation" },
  { title: "Turn intent into action", english: "ACTION", description: "Connect tasks with movement. Explore how robots interact with objects and move from planning an action to carrying it out.", keywords: "Task understanding / Planning / Physical interaction" },
  { title: "Learn from experience", english: "LEARNING", description: "Follow demonstrations, attempts, and feedback to understand the foundations of robot learning and how experience informs the next action.", keywords: "Demonstrations / Policy learning / Feedback" },
];

export const learningLoop = [
  { title: "Read the scene", english: "OBSERVE", description: "Start with a concrete setting. Identify the environment, the objects, and the task." },
  { title: "Take action", english: "ACT", description: "Turn a task into movement, connecting perception and execution through interaction." },
  { title: "Reflect and improve", english: "LEARN", description: "Record the process, examine the feedback, and bring what you learn to the next attempt." },
];

export const resources = [
  { title: "EmbodyStar", label: "PROJECT / SOURCE CODE", description: "Explore the source code, current progress, and public discussions in the project repository.", url: landing.repository },
  { title: "LeRobot", label: "ECOSYSTEM / OPEN SOURCE", description: "Discover the Hugging Face community's open-source robot learning project as a reference for further exploration.", url: "https://github.com/huggingface/lerobot" },
];

export const faqs = [
  { question: "What does EmbodyStar explore?", answer: "We explore the connections between perception, action, and learning in embodied intelligence. Concepts and open-source resources provide a starting point. This page describes our areas of interest; see the EmbodyStar repository for published implementations and progress." },
  { question: "Do I need a robot to get started?", answer: "No. Start with the concepts, project source code, and open-source resources. Before running a particular robotics project, check its documentation for the required hardware, data, and environment." },
  { question: "How can I follow progress or contribute?", answer: "Visit the EmbodyStar GitHub repository linked on this page to explore the code and updates, or join the discussion through repository Issues." },
  { question: "Is the robot arm an EmbodyStar product?", answer: "The image comes from Hugging Face's LeRobot project and illustrates an embodied intelligence setting. It does not show an EmbodyStar product or imply a commercial partnership. Image credits and the license are linked in the footer." },
];
