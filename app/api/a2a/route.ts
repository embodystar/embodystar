import { handleA2aRequest } from "../../../lib/a2a-service";

export async function POST(request: Request) {
  return handleA2aRequest(request);
}
