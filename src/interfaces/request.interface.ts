import type { Request } from "express";

import type { AuthTokenPayload } from "./auth.interface";

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}
