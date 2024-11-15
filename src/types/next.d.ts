// next.d.ts (or types.d.ts)
import { NextApiHandler } from "next";

declare module "next/server" {
  export interface NextRequest {
    // You can define any custom request properties here
  }

  export interface NextResponse {
    // You can define any custom response properties here
  }

  // Add the custom handler type for POST and generateToken
  export interface APIHandler {
    POST: NextApiHandler;
    generateToken: (userId: string) => string;
  }
}
