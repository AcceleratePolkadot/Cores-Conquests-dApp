import type reactiveDotConfig from "./src/config/reactive-dot";

declare module "@reactive-dot/core" {
  export interface Register {
    config: typeof reactiveDotConfig;
  }
}
