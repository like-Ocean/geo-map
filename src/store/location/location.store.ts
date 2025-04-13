import { createSelectors } from '@/helpers/create-selectors';
import { OSMLocation } from '@/types/location';
import { create } from 'zustand/react';

interface LocationState {
    location: OSMLocation | null;
    cellSize: number;
}

interface LocationsActions {
    setLocation: (location: OSMLocation | null) => void;
    setCellSize: (size: number) => void;
}

export const useLocationsStoreBase = create<LocationState & LocationsActions>()((set) => ({
    location: null,
    cellSize: 45,
    setLocation: (location) => set({ location }),
    setCellSize: (cellSize) => set({ cellSize }),
}));

export const useLocationStore = createSelectors(useLocationsStoreBase);
