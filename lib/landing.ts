export const landing = {
  title: "EmbodyStar | 探索具身智能",
  description: "探索感知、行动与学习的连接。EmbodyStar 聚焦具身智能，让关于 AI 的想象，从屏幕延伸到真实世界。",
  about: "EmbodyStar 是一个以具身智能为主题的探索项目。具身智能关注智能体如何通过物理身体与环境交互，在真实的行动和反馈中理解世界。",
  repository: "https://github.com/embodystar/embodystar",
};

export const explorationAreas = [
  { title: "感知真实环境", english: "PERCEPTION", description: "从视觉、空间与状态信息出发，探索智能体如何观察周围环境，为理解任务建立基础。", keywords: "视觉感知 / 空间理解 / 状态观察" },
  { title: "让理解成为行动", english: "ACTION", description: "连接任务与动作，关注机器人如何与物体交互，以及从动作规划走向实际执行的过程。", keywords: "任务理解 / 动作规划 / 物理交互" },
  { title: "从经验中学习", english: "LEARNING", description: "以示范、尝试与反馈为线索，理解机器人学习的基本路径，探索经验如何影响下一次行动。", keywords: "示范数据 / 策略学习 / 环境反馈" },
];

export const learningLoop = [
  { title: "观察环境", english: "OBSERVE", description: "从一个具体场景开始，明确环境、物体与任务目标。" },
  { title: "尝试行动", english: "ACT", description: "将任务转化为动作，在交互中连接感知与执行。" },
  { title: "回看与迭代", english: "LEARN", description: "记录过程、分析反馈，再带着新的理解继续探索。" },
];

export const resources = [
  { title: "EmbodyStar", label: "PROJECT / 项目仓库", description: "查看项目源码、当前进展与公开讨论，从这里了解 EmbodyStar。", url: landing.repository },
  { title: "LeRobot", label: "ECOSYSTEM / 开源参考", description: "了解 Hugging Face 社区的开源机器人学习项目，作为进一步探索的参考。", url: "https://github.com/huggingface/lerobot" },
];

export const faqs = [
  { question: "EmbodyStar 关注什么？", answer: "我们关注具身智能中感知、行动与学习的连接，通过概念介绍和开源资源，提供一个了解这一领域的入口。页面展示的是探索方向，已公开的实现与进展请查看 EmbodyStar 项目仓库。" },
  { question: "需要先拥有一台机器人吗？", answer: "不需要。可以先从了解基本概念、阅读项目源码和开源资料开始。实际运行某个机器人项目时，再根据该项目的文档确认所需硬件、数据与环境。" },
  { question: "如何了解进展或参与讨论？", answer: "前往本页链接的 EmbodyStar GitHub 仓库，查看公开代码与更新，或通过仓库中的 Issues 参与讨论。" },
  { question: "页面里的机械臂是 EmbodyStar 的产品吗？", answer: "图片来自 Hugging Face 的 LeRobot 开源项目，用于展示具身智能的实践场景，并非 EmbodyStar 自研产品或商业合作展示。图片来源和许可证见页脚。" },
];
