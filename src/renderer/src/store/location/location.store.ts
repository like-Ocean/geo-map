import { createSelectors } from '@renderer/helpers/create-selectors';
import { OSMLocation } from '@renderer/types/location';
import { create } from 'zustand/react';

interface LocationState {
    location: OSMLocation | null;
}

interface LocationsActions {
    setLocation: (location: OSMLocation | null) => void;
}

export const useLocationsStoreBase = create<LocationState & LocationsActions>()((set) => ({
    location: null,
    setLocation: (location) => set({ location }),
}));

export const useLocationStore = createSelectors(useLocationsStoreBase);
