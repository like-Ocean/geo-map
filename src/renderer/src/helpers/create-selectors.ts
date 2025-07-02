/* eslint-disable @typescript-eslint/no-explicit-any */

// https://zustand.docs.pmnd.rs/guides/auto-generating-selectors
import { StoreApi, UseBoundStore } from 'zustand';

export type StoreWithSelectors<S> = S extends { getState: () => infer T }
    ? S & { use: { [K in keyof T]: () => T[K] } }
    : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
    const store = _store as StoreWithSelectors<typeof _store>;
    store.use = {};
    for (const k of Object.keys(store.getState())) {
        (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
    }

    return store;
};
