import type { StickersCollection } from "./stickersCollection";

export type GlobalStoreStruct = {
  isPanelOpen?: boolean;
  activeTextarea?: HTMLTextAreaElement;
  packs: StickersCollection;
};
