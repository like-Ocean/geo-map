import { createSelectors } from '@/helpers/create-selectors';
import { create } from 'zustand/react';

interface HexagonState {
    cellSize: number;
    hexagonValues: Record<string, number>;
    selectedHexagonId: string | null;
}

interface HexagonActions {
    setCellSize: (size: number) => void;
    setHexagonValue: (hexId: string, value: number) => void;
    selectHexagon: (hexId: string | null) => void;
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
}));

export const useHexagonStore = createSelectors(useHexagonStoreBase);
