import { writable } from "svelte/store";
import type { GlobalStoreStruct } from "./types/GlobalStore";
import type { StickersCollection } from "./types/stickersCollection";
import type { PanelStruct } from "./types/Panel";

const createRootStore = () => {
  // @ts-ignore
  const getURL = window?.chrome?.runtime?.getURL;
  const packsURL = getURL ? getURL("build/packs.json") : "/build/packs.json";

  const defaultStore: GlobalStoreStruct = {
    activeForm: undefined,
    packs: [],
  };

  const { subscribe, set, update } = writable(defaultStore, set => {
    fetch(packsURL)
      .then<StickersCollection>(response => response.json())
      .then(packs => set({ ...defaultStore, packs }));
  });

  return {
    subscribe,
  };
};

const createPanelStore = () => {
  const defaultStore: PanelStruct = {};
  const { subscribe, set, update } = writable(defaultStore);

  return {
    subscribe,
    openPanel() {
      update(state => ({ ...state, isOpen: true }));
    },
    closePanel() {
      update(state => ({ ...state, isOpen: false }));
    },
  };
};

export const panelStore = createPanelStore();
export const rootStore = createRootStore();
