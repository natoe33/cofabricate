export type LoginState =
  | "logging-in"
  | "logged-in"
  | "contacting-remote-signer"
  | "logged-out";

export const loginState: LoginState | null = null;
