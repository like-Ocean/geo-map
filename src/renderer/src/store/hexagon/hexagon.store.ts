import { createSelectors } from '@renderer/helpers/create-selectors';
import { create } from 'zustand';
import { calculateTension } from '@renderer/utils/tension-calculator';
import { HexagonFeature } from '@renderer/types/hexagon';

interface HexagonState {
    cellSize: number;
    hexagonValues: Record<string, number>;
    userValues: Record<string, boolean>;
    sources: Record<string, number>;
    grid: HexagonFeature[];
    selectedHexagonId: string | null;
}

interface HexagonActions {
    setCellSize: (size: number) => void;
    setHexagonValue: (hexId: string, value: number) => void;
    selectHexagon: (hexId: string | null) => void;
    addSource: (hexId: string, value: number) => void;
    removeSource: (hexId: string) => void;
    setGrid: (grid: HexagonFeature[]) => void;
    setUserValue: (hexId: string, value: boolean) => void;
    recalculateTension: () => void;
    resetAllValues: () => void;
}

export const useHexagonStoreBase = create<HexagonState & HexagonActions>()((set, get) => ({
    cellSize: 45,
    hexagonValues: {},
    userValues: {},
    sources: {},
    grid: [],
    selectedHexagonId: null,

    setCellSize: (cellSize) => {
        set({
            cellSize,
            hexagonValues: {},
            userValues: {},
            sources: {},
            grid: [],
            selectedHexagonId: null,
        });
    },

    setHexagonValue: (hexId, value) => {
        set((state) => ({
            hexagonValues: { ...state.hexagonValues, [hexId]: value },
            userValues: { ...state.userValues, [hexId]: true },
        }));
        get().recalculateTension();
    },

    selectHexagon: (hexId) => set({ selectedHexagonId: hexId }),

    addSource: (hexId, value) => {
        set((state) => ({
            sources: { ...state.sources, [hexId]: value },
        }));
        get().recalculateTension();
    },

    removeSource: (hexId) => {
        set((state) => {
            const newSources = { ...state.sources };
            delete newSources[hexId];
            return { sources: newSources };
        });
        get().recalculateTension();
    },

    setGrid: (grid) => set({ grid }),

    setUserValue: (hexId, value) => {
        set((state) => ({
            userValues: { ...state.userValues, [hexId]: value },
        }));
    },

    recalculateTension: () => {
        const { grid, sources, userValues, hexagonValues } = get();

        if (grid.length === 0) return;

        const calculatedGrid = calculateTension(grid, sources);

        const mergedGrid = calculatedGrid.map((hex) => {
            if (userValues[hex.id]) {
                return {
                    ...hex,
                    properties: {
                        ...hex.properties,
                        value: hexagonValues[hex.id] || 0,
                    },
                };
            }
            return hex;
        });

        const newValues = mergedGrid.reduce(
            (acc, hex) => {
                acc[hex.id] = hex.properties.value;
                return acc;
            },
            {} as Record<string, number>,
        );

        set({ hexagonValues: newValues });
    },
    resetAllValues: () => {
        set({
            hexagonValues: {},
            userValues: {},
            sources: {},
            selectedHexagonId: null,
        });
        get().recalculateTension();
    },
}));

export const useHexagonStore = createSelectors(useHexagonStoreBase);
