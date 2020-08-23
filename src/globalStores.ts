import { writable } from "svelte/store";
import type { GlobalStoreStruct } from "./types/GlobalStore";
import type { StickersCollection } from "./types/stickersCollection";
import type { PanelStruct } from "./types/Panel";

const createRootStore = () => {
  // @ts-ignore
  const getURL = window?.chrome?.runtime?.getURL;
  const packsURL = getURL ? getURL("build/packs.json") : "/build/packs.json";

  const defaultStore: GlobalStoreStruct = {
    packs: [],
  };

  const { subscribe, set, update } = writable(defaultStore, set => {
    fetch(packsURL)
      .then<StickersCollection>(response => response.json())
      .then(packs => set({ ...defaultStore, packs }));
  });

  return {
    set,
    subscribe,
    setTextarea(activeTextarea: HTMLTextAreaElement) {
      update(store => ({ ...store, activeTextarea }));
    },
  };
};

const createPanelStore = () => {
  const defaultStore: PanelStruct = {};
  const { subscribe, set, update } = writable(defaultStore);

  return {
    set,
    subscribe,
    openPanel() {
      update(state => ({ ...state, isOpen: true }));
    },
    closePanel() {
      update(state => ({ ...state, isOpen: false }));
    },
    selectPack(selectedPack) {
      update(state => ({ ...state, selectedPack }));
    },
    setOffsets({ topOffset, leftOffset }) {
      update(state => ({ ...state, leftOffset, topOffset }));
    },
  };
};

export const panelStore = createPanelStore();
export const rootStore = createRootStore();
