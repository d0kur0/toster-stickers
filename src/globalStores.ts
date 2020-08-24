import { writable } from "svelte/store";
import type { RootStore } from "./types/rootStore";
import type { StickersCollection } from "./types/stickersCollection";
import type { PanelStruct } from "./types/panel";
import type { LastUsedStickers } from "./types/lastUsedStickers";

const createRootStore = () => {
  // @ts-ignore
  const getURL = window?.chrome?.runtime?.getURL;
  const packsURL = getURL ? getURL("build/packs.json") : "/build/packs.json";

  const defaultStore: RootStore = {
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
    clearSelectPack() {
      update(state => ({ ...state, selectedPack: undefined }));
    },
    setOffsets({ topOffset, leftOffset }) {
      update(state => ({ ...state, leftOffset, topOffset }));
    },
  };
};

const createLastUsedStickersStore = () => {
  const LIMIT = 12;
  const defaultStore: LastUsedStickers = [];
  const { subscribe, set, update } = writable(defaultStore, set => {
    if (localStorage.lastUsedStickers === undefined) return;

    try {
      const lastUsedStickers = JSON.parse(localStorage.lastUsedStickers);
      set(lastUsedStickers);
    } catch (e) {
      localStorage.lastUsedStickers = "";
    }
  });

  return {
    set,
    subscribe,
    add(image) {
      update(store => {
        console.log(store);
        if (store.includes(image)) return store;
        if (store.length > LIMIT) store.pop();

        store.push(image);
        localStorage.lastUsedStickers = JSON.stringify(store);
        return store;
      });
    },
  };
};

export const panelStore = createPanelStore();
export const rootStore = createRootStore();
export const lastUsedStickersStore = createLastUsedStickersStore();
