export const a2aProtocolVersion = "1.0";

// Bump this version when the card or its advertised behavior changes.
export const agentCard = {
  name: "EmbodyStar Content Agent",
  version: "1.0.0",
  description: "Returns EmbodyStar's published project overview, exploration areas, conceptual architecture, open-source resources, and FAQs as Markdown. A stateless, read-only content service; each valid text request retrieves the current overview.",
  supportedInterfaces: [
    {
      url: "https://embodystar.com/api/a2a",
      protocolBinding: "JSONRPC",
      protocolVersion: a2aProtocolVersion,
    },
  ],
  provider: { organization: "EmbodyStar", url: "https://embodystar.com/" },
  documentationUrl: "https://embodystar.com/a2a-docs.md",
  capabilities: {
    streaming: false,
    pushNotifications: false,
    extendedAgentCard: false,
  },
  defaultInputModes: ["text/plain", "text/markdown"],
  defaultOutputModes: ["text/markdown"],
  skills: [
    {
      id: "get-public-content",
      name: "Retrieve public project content",
      description: "Retrieves the complete published EmbodyStar overview in Markdown, including project focus, conceptual architecture, resource links, and FAQs. Request text does not filter or change the returned content. No robot control, model inference, or persistent conversation is provided.",
      tags: ["embodied-intelligence", "project-information", "documentation", "resources"],
      examples: ["Get the EmbodyStar project overview.", "Retrieve the public documentation and resource links."],
    },
  ],
};
