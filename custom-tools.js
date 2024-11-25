import { DynamicTool, StringToolOutput } from "bee-agent-framework/tools/base";
import { z } from "zod";

export const createSupportTicket = new DynamicTool({
  name: "CreateSupportTicket",
  description: "Create a support ticket",
  inputSchema: z.object({
    description: z.string(),
  }),
  async handler(input) {
    const ticketNumber = Math.floor(Math.random() * 1000000);
    return new StringToolOutput(`Ticket ${ticketNumber} created successfully`);
  },
});
