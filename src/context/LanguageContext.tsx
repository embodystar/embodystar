"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "es" | "zh";

export type TranslationKeys =
  | "nav_technology"
  | "nav_dashboard"
  | "nav_sandbox"
  | "nav_sdk"
  | "nav_connect"
  | "nav_docs"
  | "nav_connect_node"
  | "hero_badge"
  | "hero_title_1"
  | "hero_title_2"
  | "hero_subtitle"
  | "hero_cta_console"
  | "hero_cta_sandbox"
  | "core_badge"
  | "core_title_1"
  | "core_title_2"
  | "core_subtitle"
  | "core_multimodal_title"
  | "core_multimodal_desc"
  | "core_lidar_title"
  | "core_lidar_desc"
  | "core_swarms_title"
  | "core_swarms_desc"
  | "console_badge"
  | "console_title"
  | "console_desc"
  | "console_metric_cpu"
  | "console_metric_confidence"
  | "console_metric_latency"
  | "console_metric_torque"
  | "console_btn_lidar_on"
  | "console_btn_lidar_off"
  | "console_btn_add_node"
  | "console_btn_scan_mesh"
  | "console_btn_scan_mesh_desc"
  | "console_btn_dispatch"
  | "console_btn_dispatch_desc"
  | "console_btn_calibrate"
  | "console_btn_calibrate_desc"
  | "console_btn_imu"
  | "console_btn_imu_desc"
  | "sandbox_badge"
  | "sandbox_title_1"
  | "sandbox_title_2"
  | "sandbox_desc"
  | "sandbox_instructions_title"
  | "sandbox_instruction_1"
  | "sandbox_instruction_2"
  | "sandbox_instruction_3"
  | "sandbox_telemetry_title"
  | "sdk_badge"
  | "sdk_title_1"
  | "sdk_title_2"
  | "sdk_desc"
  | "sdk_python"
  | "sdk_typescript"
  | "connect_title"
  | "connect_desc"
  | "connect_tab_join"
  | "connect_tab_newsletter"
  | "connect_form_name"
  | "connect_form_email"
  | "connect_form_node_type"
  | "connect_form_node_physical"
  | "connect_form_node_virtual"
  | "connect_form_location"
  | "connect_form_message"
  | "connect_form_submit_join"
  | "connect_form_submit_newsletter"
  | "connect_success_join"
  | "connect_success_newsletter"
  | "footer_desc"
  | "footer_col_platform"
  | "footer_col_resources"
  | "footer_col_company"
  | "footer_link_features"
  | "footer_link_api"
  | "footer_link_pricing"
  | "footer_link_documentation"
  | "footer_link_guides"
  | "footer_link_community"
  | "footer_link_about"
  | "footer_link_blog"
  | "footer_link_careers"
  | "footer_rights";

const translations: Record<Language, Record<TranslationKeys, string>> = {
  en: {
    nav_technology: "Technology",
    nav_dashboard: "Control Console",
    nav_sandbox: "Simulation Sandbox",
    nav_sdk: "Developer SDK",
    nav_connect: "Get Started",
    nav_docs: "Developer Docs",
    nav_connect_node: "Connect Node",
    
    hero_badge: "Next-Gen Spatial Intelligence Platform",
    hero_title_1: "Where Artificial Minds",
    hero_title_2: "Inhabit Physical Reality",
    hero_subtitle: "An open, distributed foundation for embodied intelligence. Powering autonomous agents that see, hear, reason, navigate, and act across physical robotics and high-fidelity virtual simulations.",
    hero_cta_console: "Launch Control Console",
    hero_cta_sandbox: "Play Sandbox Simulation",
    
    core_badge: "Core Infrastructure",
    core_title_1: "Multi-Agent Networks",
    core_title_2: "Designed for Spatial Scale",
    core_subtitle: "Bridging the gap between simulation and the physical world. Our framework powers distributed systems that share perception, coordinate planning, and execute actions with sub-millisecond precision.",
    core_multimodal_title: "Multimodal Core Engine",
    core_multimodal_desc: "Processes visual, tactile, and auditory inputs simultaneously to establish spatial context awareness.",
    core_lidar_title: "Real-time Spatial Lidar",
    core_lidar_desc: "Generates dense 3D point cloud structures at 60Hz, providing sub-millimeter hazard mapping.",
    core_swarms_title: "Cooperative Agent Swarms",
    core_swarms_desc: "Enables distributed consensus, swarm collision avoidance, and collaborative task delegation.",
    
    console_badge: "Control Console",
    console_title: "Live Telemetry & Diagnostics",
    console_desc: "Real-time stream of sensor telemetry, network status, and actuator outputs from registered physical and virtual nodes.",
    console_metric_cpu: "Core CPU Load",
    console_metric_confidence: "Sensory Confidence",
    console_metric_latency: "Network Latency",
    console_metric_torque: "Actuator Torque",
    console_btn_lidar_on: "Stop Lidar Scan",
    console_btn_lidar_off: "Start Lidar Scan",
    console_btn_add_node: "Simulate Swarm Node",
    console_btn_scan_mesh: "Scan Lidar Mesh",
    console_btn_scan_mesh_desc: "3D point acquisition",
    console_btn_dispatch: "Dispatch Agent",
    console_btn_dispatch_desc: "Push route parameters",
    console_btn_calibrate: "Calibrate Grasp",
    console_btn_calibrate_desc: "Force closed-loop test",
    console_btn_imu: "Zero-Drift IMU",
    console_btn_imu_desc: "Re-align 18-DOF motor",
    
    sandbox_badge: "Live Simulation Sandbox",
    sandbox_title_1: "Interactive",
    sandbox_title_2: "Neural Playground",
    sandbox_desc: "Witness the autonomous spatial planning algorithms in action. Adjust parameters in real-time to observe obstacle avoidance, multi-agent pathfinding, and target acquisition.",
    sandbox_instructions_title: "Sandbox Controls",
    sandbox_instruction_1: "Click inside the viewport to dynamically place targets for the agent swarm.",
    sandbox_instruction_2: "Toggle custom barriers and obstacles to test real-time path replanning.",
    sandbox_instruction_3: "Adjust physics multipliers to test performance under varying constraint loads.",
    sandbox_telemetry_title: "Sandbox Real-Time Telemetry",
    
    sdk_badge: "Developer SDK",
    sdk_title_1: "Simple APIs for",
    sdk_title_2: "Complex Kinematics",
    sdk_desc: "Write high-level sensory and movement directives in language ecosystems you already know. The underlying runtime translates these commands to real-time industrial actuator trajectories.",
    sdk_python: "Python SDK",
    sdk_typescript: "TypeScript SDK",
    
    connect_title: "Initiate Coordination",
    connect_desc: "Join the distributed network of spatial intelligence nodes. Enter your credentials or run our installer scripts to begin.",
    connect_tab_join: "Join Network",
    connect_tab_newsletter: "Newsletter",
    connect_form_name: "Name",
    connect_form_email: "Email Address",
    connect_form_node_type: "Node Class",
    connect_form_node_physical: "Physical Robotics Edge",
    connect_form_node_virtual: "Virtual Simulation Node",
    connect_form_location: "Geographic Location",
    connect_form_message: "Proposed Use Case",
    connect_form_submit_join: "Initialize Node Connection",
    connect_form_submit_newsletter: "Subscribe to Updates",
    connect_success_join: "Connection request submitted! Check terminal logs above for verification.",
    connect_success_newsletter: "Subscribed successfully! Welcome to the forefront of spatial intelligence.",
    
    footer_desc: "The open runtime for distributed spatial intelligence, bridging artificial minds and physical reality.",
    footer_col_platform: "Platform",
    footer_col_resources: "Resources",
    footer_col_company: "Company",
    footer_link_features: "Features",
    footer_link_api: "API Reference",
    footer_link_pricing: "Pricing",
    footer_link_documentation: "Documentation",
    footer_link_guides: "Guides",
    footer_link_community: "Community",
    footer_link_about: "About Us",
    footer_link_blog: "Blog",
    footer_link_careers: "Careers",
    footer_rights: "© 2026 embodystar. All rights reserved. Spatial intelligence for a physical world.",
  },
  es: {
    nav_technology: "Tecnología",
    nav_dashboard: "Consola de Control",
    nav_sandbox: "Sandbox de Simulación",
    nav_sdk: "SDK de Desarrollador",
    nav_connect: "Comenzar",
    nav_docs: "Doc de Desarrollo",
    nav_connect_node: "Conectar Nodo",
    
    hero_badge: "Plataforma de Inteligencia Espacial de Próxima Generación",
    hero_title_1: "Donde las Mentes Artificiales",
    hero_title_2: "Habitan la Realidad Física",
    hero_subtitle: "Una base abierta y distribuida para la inteligencia encarnada. Potenciando agentes autónomos que ven, oyen, razonan, navegan y actúan a través de robótica física y simulaciones virtuales de alta fidelidad.",
    hero_cta_console: "Iniciar Consola de Control",
    hero_cta_sandbox: "Jugar Simulación en Sandbox",
    
    core_badge: "Infraestructura Central",
    core_title_1: "Redes de Multi-Agentes",
    core_title_2: "Diseñadas para Escala Espacial",
    core_subtitle: "Cerrando la brecha entre la simulación y el mundo físico. Nuestro marco de trabajo impulsa sistemas distribuidos que comparten la percepción, coordinan la planificación y ejecutan acciones con una precisión de submilisegundos.",
    core_multimodal_title: "Motor Núcleo Multimodal",
    core_multimodal_desc: "Procesa entradas visuales, táctiles y auditivas simultáneamente para establecer conciencia del contexto espacial.",
    core_lidar_title: "Lidar Espacial en Tiempo Real",
    core_lidar_desc: "Genera estructuras densas de nubes de puntos 3D a 60Hz, ofreciendo mapeo de peligros submilimétrico.",
    core_swarms_title: "Enjambres de Agentes Cooperativos",
    core_swarms_desc: "Permite el consenso distribuido, la prevención de colisiones en enjambre y la delegación de tareas colaborativas.",
    
    console_badge: "Consola de Control",
    console_title: "Telemetría y Diagnósticos en Vivo",
    console_desc: "Transmisión en tiempo real de telemetría de sensores, estado de la red y salidas de actuadores de nodos físicos y virtuales registrados.",
    console_metric_cpu: "Carga de CPU Central",
    console_metric_confidence: "Confianza Sensorial",
    console_metric_latency: "Latencia de Red",
    console_metric_torque: "Torque del Actuador",
    console_btn_lidar_on: "Detener Escaneo Lidar",
    console_btn_lidar_off: "Iniciar Escaneo Lidar",
    console_btn_add_node: "Simular Nodo de Enjambre",
    console_btn_scan_mesh: "Escanear Malla Lidar",
    console_btn_scan_mesh_desc: "Adquisición de puntos 3D",
    console_btn_dispatch: "Despachar Agente",
    console_btn_dispatch_desc: "Enviar parámetros de ruta",
    console_btn_calibrate: "Calibrar Agarre",
    console_btn_calibrate_desc: "Prueba de bucle cerrado",
    console_btn_imu: "IMU sin Deriva",
    console_btn_imu_desc: "Alinear motor 18-DOF",
    
    sandbox_badge: "Sandbox de Simulación en Vivo",
    sandbox_title_1: "Patio de Recreo",
    sandbox_title_2: "Neuronal Interactivo",
    sandbox_desc: "Sea testigo de los algoritmos de planificación espacial autónoma en acción. Ajuste los parámetros en tiempo real para observar la evasión de obstáculos, la búsqueda de rutas de múltiples agentes y la adquisición de objetivos.",
    sandbox_instructions_title: "Controles de Sandbox",
    sandbox_instruction_1: "Haga clic dentro del visor para colocar dinámicamente objetivos para el enjambre de agentes.",
    sandbox_instruction_2: "Alterne barreras y obstáculos personalizados para probar la replanificación de rutas en tiempo real.",
    sandbox_instruction_3: "Ajuste los multiplicadores de física para probar el rendimiento bajo cargas de restricciones variables.",
    sandbox_telemetry_title: "Telemetría en Tiempo Real de Sandbox",
    
    sdk_badge: "SDK para Desarrolladores",
    sdk_title_1: "APIs Simples para",
    sdk_title_2: "Cinemática Compleja",
    sdk_desc: "Escriba directivas de movimiento y sensoriales de alto nivel en ecosistemas de lenguajes que ya conoce. El tiempo de ejecución subyacente traduce estos comandos en trayectorias de actuadores industriales en tiempo real.",
    sdk_python: "Python SDK",
    sdk_typescript: "TypeScript SDK",
    
    connect_title: "Iniciar Coordinación",
    connect_desc: "Únase a la red distribuida de nodos de inteligencia espacial. Ingrese sus credenciales o ejecute nuestros scripts de instalación para comenzar.",
    connect_tab_join: "Unirse a la Red",
    connect_tab_newsletter: "Boletín Informativo",
    connect_form_name: "Nombre",
    connect_form_email: "Dirección de Correo",
    connect_form_node_type: "Clase de Nodo",
    connect_form_node_physical: "Borde de Robótica Física",
    connect_form_node_virtual: "Nodo de Simulación Virtual",
    connect_form_location: "Ubicación Geográfica",
    connect_form_message: "Caso de Uso Propuesto",
    connect_form_submit_join: "Inicializar Conexión de Nodo",
    connect_form_submit_newsletter: "Suscribirse a Actualizaciones",
    connect_success_join: "¡Solicitud de conexión enviada! Revise los registros del terminal arriba para verificar.",
    connect_success_newsletter: "¡Suscripción exitosa! Bienvenido a la vanguardia de la inteligencia espacial.",
    
    footer_desc: "El tiempo de ejecución abierto para la inteligencia espacial distribuida, tendiendo puentes entre las mentes artificiales y la realidad física.",
    footer_col_platform: "Plataforma",
    footer_col_resources: "Recursos",
    footer_col_company: "Compañía",
    footer_link_features: "Características",
    footer_link_api: "Referencia de API",
    footer_link_pricing: "Precios",
    footer_link_documentation: "Documentación",
    footer_link_guides: "Guías",
    footer_link_community: "Comunidad",
    footer_link_about: "Nosotros",
    footer_link_blog: "Blog",
    footer_link_careers: "Carreras",
    footer_rights: "© 2026 embodystar. Todos los derechos reservados. Inteligencia espacial para un mundo físico.",
  },
  zh: {
    nav_technology: "核心技术",
    nav_dashboard: "控制面板",
    nav_sandbox: "模拟沙盒",
    nav_sdk: "开发者 SDK",
    nav_connect: "立即开始",
    nav_docs: "开发文档",
    nav_connect_node: "连接节点",
    
    hero_badge: "下一代空间智能平台",
    hero_title_1: "当人工智能心智",
    hero_title_2: "栖息于物理现实",
    hero_subtitle: "一个开放、分布式的具身智能基础。规划、控制并赋予智能体在物理机器人和高保真虚拟模拟中看、听、推理、导航和行动的能力。",
    hero_cta_console: "启动控制台",
    hero_cta_sandbox: "进行沙盒模拟",
    
    core_badge: "核心基础设施",
    core_title_1: "多智能体网络",
    core_title_2: "专为空间规模设计",
    core_subtitle: "弥合模拟与物理世界之间的差距。我们的框架为分布式系统提供动力，实现感知共享、协调规划并以亚毫秒级的精度执行行动。",
    core_multimodal_title: "多模态核心引擎",
    core_multimodal_desc: "同时处理视觉、触觉和听觉输入，以建立空间上下文意识。",
    core_lidar_title: "实时空间激光雷达",
    core_lidar_desc: "以 60Hz 产生密集的 3D 点云结构，提供亚毫米级的危险制图。",
    core_swarms_title: "合作智能体集群",
    core_swarms_desc: "实现分布式共识、集群避障和协同任务委派。",
    
    console_badge: "控制面板",
    console_title: "实时遥测与诊断",
    console_desc: "来自注册的物理和虚拟节点的传感器遥测、网络状态和执行器输出的实时数据流。",
    console_metric_cpu: "核心 CPU 负载",
    console_metric_confidence: "感知可信度",
    console_metric_latency: "网络延迟",
    console_metric_torque: "执行器扭矩",
    console_btn_lidar_on: "停止雷达扫描",
    console_btn_lidar_off: "启动雷达扫描",
    console_btn_add_node: "模拟集群节点",
    console_btn_scan_mesh: "扫描雷达网格",
    console_btn_scan_mesh_desc: "三维点云采集",
    console_btn_dispatch: "派遣智能体",
    console_btn_dispatch_desc: "推送路由参数",
    console_btn_calibrate: "标定抓取",
    console_btn_calibrate_desc: "力闭环测试",
    console_btn_imu: "无漂移 IMU",
    console_btn_imu_desc: "重新对齐 18 自由度电机",
    
    sandbox_badge: "实时模拟沙盒",
    sandbox_title_1: "互动式",
    sandbox_title_2: "神经网络游乐场",
    sandbox_desc: "见证自主空间规划算法的实际运作。实时调整参数，观察避障、多智能体路径寻找和目标获取。",
    sandbox_instructions_title: "沙盒控制指南",
    sandbox_instruction_1: "在视口内点击，为智能体集群动态放置目标点。",
    sandbox_instruction_2: "切换自定义屏障和障碍物，测试实时路径重新规划。",
    sandbox_instruction_3: "调节物理倍数，测试在不同约束负载下的性能表现。",
    sandbox_telemetry_title: "沙盒实时遥测",
    
    sdk_badge: "开发者 SDK",
    sdk_title_1: "面向复杂运动学",
    sdk_title_2: "的极简 API",
    sdk_desc: "在您已熟知的语言生态中编写高级感知和运动指令。底层的运行引擎将这些命令实时转化为工业执行器的运动轨迹。",
    sdk_python: "Python SDK",
    sdk_typescript: "TypeScript SDK",
    
    connect_title: "启动网络协同",
    connect_desc: "加入分布式的空间智能节点网络。输入您的凭证或运行我们的安装脚本以开始。",
    connect_tab_join: "加入网络",
    connect_tab_newsletter: "订阅动态",
    connect_form_name: "姓名",
    connect_form_email: "电子邮箱",
    connect_form_node_type: "节点类别",
    connect_form_node_physical: "物理机器人边缘端",
    connect_form_node_virtual: "虚拟模拟节点",
    connect_form_location: "地理位置",
    connect_form_message: "拟用场景说明",
    connect_form_submit_join: "初始化节点连接",
    connect_form_submit_newsletter: "订阅更新动态",
    connect_success_join: "连接申请已提交！请在上方查看终端日志进行验证。",
    connect_success_newsletter: "订阅成功！欢迎来到空间智能的最前沿。",
    
    footer_desc: "分布式空间智能的开放运行引擎，弥合人工心智与物理现实之间的桥梁。",
    footer_col_platform: "平台产品",
    footer_col_resources: "相关资源",
    footer_col_company: "公司信息",
    footer_link_features: "功能特性",
    footer_link_api: "API 参考手册",
    footer_link_pricing: "价格方案",
    footer_link_documentation: "技术文档",
    footer_link_guides: "入门向导",
    footer_link_community: "开发者社区",
    footer_link_about: "关于我们",
    footer_link_blog: "官方博客",
    footer_link_careers: "加入我们",
    footer_rights: "© 2026 embodystar. 保留所有权利。服务于物理世界的空间智能。",
  },
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  // Load language preference from localStorage if available
  useEffect(() => {
    const savedLanguage = localStorage.getItem("embodystar_language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es" || savedLanguage === "zh")) {
      const timeoutId = window.setTimeout(() => setLanguage(savedLanguage), 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("embodystar_language", lang);
  };

  const t = (key: TranslationKeys): string => {
    const langDict = translations[language];
    return langDict[key] || translations["en"][key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
