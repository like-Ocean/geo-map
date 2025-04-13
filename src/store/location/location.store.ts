import { createSelectors } from '@/helpers/create-selectors';
import { OSMLocation } from '@/types/location';
import { create } from 'zustand/react';

interface LocationState {
    location: OSMLocation | null;
    cellSize: number;

    hexagonValues: Record<string, number>;
    selectedHexagonId: string | null;
}

interface LocationsActions {
    setLocation: (location: OSMLocation | null) => void;
    setCellSize: (size: number) => void;

    setHexagonValue: (hexId: string, value: number) => void;
    selectHexagon: (hexId: string | null) => void;
}

export const useLocationsStoreBase = create<LocationState & LocationsActions>()((set) => ({
    location: null,
    cellSize: 45,
    setLocation: (location) => set({ location }),
    setCellSize: (cellSize) => set({ cellSize }),

    hexagonValues: {},
    selectedHexagonId: null,
    setHexagonValue: (hexId, value) => set((state) => ({
        hexagonValues: { ...state.hexagonValues, [hexId]: value }
    })),
    selectHexagon: (hexId) => set({ selectedHexagonId: hexId }),
}));

export const useLocationStore = createSelectors(useLocationsStoreBase);
