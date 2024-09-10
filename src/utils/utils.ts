import { v4 as uuidv4 } from "uuid";
import json from "./currencies.json";
import cjson from "./countries.json";

export type LoginState =
  | "logging-in"
  | "logged-in"
  | "contacting-remote-signer"
  | "logged-out";

export const loginState: LoginState | null = null;

export class Utils {
  constructor() {}

  generateUUID = (): string => {
    return uuidv4();
  };

  getCurrencies = async () => {
    const currencies = json;
    return currencies;
  };

  getCountries = async () => {
    const countries = cjson;
    return countries;
  };
}
