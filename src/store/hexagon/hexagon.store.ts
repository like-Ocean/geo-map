import { createSelectors } from '@/helpers/create-selectors';
import { create } from 'zustand/react';

interface HexagonState {
    cellSize: number;
    hexagonValues: Record<string, number>;
    selectedHexagonId: string | null;

    sources: Record<string, number>;
}

interface HexagonActions {
    setCellSize: (size: number) => void;
    setHexagonValue: (hexId: string, value: number) => void;
    selectHexagon: (hexId: string | null) => void;

    addSource: (hexId: string, value: number) => void;
    removeSource: (hexId: string) => void;
}

export const useHexagonStoreBase = create<HexagonState & HexagonActions>()((set) => ({
    cellSize: 45,
    hexagonValues: {},
    selectedHexagonId: null,

    setCellSize: (cellSize) => set({ 
        cellSize,
        hexagonValues: {},
        selectedHexagonId: null
    }),
    setHexagonValue: (hexId, value) =>
        set((state) => ({
            hexagonValues: { ...state.hexagonValues, [hexId]: value },
        })),
    selectHexagon: (hexId) => set({ selectedHexagonId: hexId }),

    sources: {},
    addSource: (hexId, value) => set(state => ({
        sources: { ...state.sources, [hexId]: value }
    })),
    removeSource: (hexId: string) => set(state => {
        const newSources = { ...state.sources };
        delete newSources[hexId];
        return { sources: newSources };
    }),
}));

export const useHexagonStore = createSelectors(useHexagonStoreBase);
