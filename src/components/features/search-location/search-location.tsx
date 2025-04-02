import { useSearchLocationsQuery } from '@/api/nominatim/location/search-locations';
import { LocationSearchItem } from '@/components/common/location-search-item';
import { useLocationStore } from '@/store/location';
import { FlagOutlined } from '@ant-design/icons';
import { OSMLocation } from '@/types/location';
import { useDebounce } from 'use-debounce';
import { useState } from 'react';
import { Select } from 'antd';

type LocationSelectOption = {
    location: OSMLocation;
    value: number;
    label: string;
};

export const SearchLocation = () => {
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);

    const location = useLocationStore.use.location();
    const setLocation = useLocationStore.use.setLocation();

    const value = location && {
        value: location.place_id,
        label: location.name,
    };

    const { data, isPending } = useSearchLocationsQuery({
        search: debouncedSearch || location?.name || '',
    });

    const locations = data || [];

    const options: LocationSelectOption[] = locations.map((location) => ({
        value: location.place_id,
        label: location.name,
        location,
    }));

    const onSearchHandler = (value: string) => {
        setSearch(value);
    };

    const onSelectHandler = (location: OSMLocation) => {
        setLocation(location);
    };

    const onClearHandler = () => {
        setLocation(null);
    };

    return (
        <Select
            allowClear
            placeholder="Поиск мест"
            variant="filled"
            value={value}
            showSearch
            searchValue={search}
            onSelect={(_, option) => onSelectHandler(option.location)}
            onSearch={onSearchHandler}
            onClear={onClearHandler}
            options={options}
            filterOption={false}
            loading={isPending}
            optionRender={(option) => <LocationSearchItem location={option.data.location} />}
            style={{ minWidth: 400 }}
            prefix={<FlagOutlined style={{ marginRight: 4 }} />}
        />
    );
};
