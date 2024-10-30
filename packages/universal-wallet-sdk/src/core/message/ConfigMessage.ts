import { Message } from "./Message";

export interface ConfigMessage extends Message {
  event: ConfigEvent;
}

export type ConfigEvent =
  | "PopupLoaded"
  | "PopupUnload";

export type SignerType = "scw";
