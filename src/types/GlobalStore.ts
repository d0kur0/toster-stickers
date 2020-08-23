import type { StickersCollection } from "./stickersCollection";

export type GlobalStoreStruct = {
  isPanelOpen?: boolean;
  activeForm: HTMLFormElement | undefined;
  packs: StickersCollection;
};
