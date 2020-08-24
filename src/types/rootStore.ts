import type { StickersCollection } from "./stickersCollection";

export type RootStore = {
  isPanelOpen?: boolean;
  activeTextarea?: HTMLTextAreaElement;
  packs: StickersCollection;
};
