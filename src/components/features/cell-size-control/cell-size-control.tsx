import { InputNumber, Slider } from 'antd';
import { Flex } from 'antd';
import { FC } from 'react';
import { useDebounce } from 'use-debounce';
import { useEffect, useState } from 'react';
import { useLocationStore } from '@/store/location';

export const CellSizeControl: FC = () => {
    const cellSize = useLocationStore.use.cellSize();
    const setCellSize = useLocationStore.use.setCellSize();

    const [localSize, setLocalSize] = useState(cellSize);
    const [debouncedSize] = useDebounce(localSize, 500);

    useEffect(() => {
        setCellSize(debouncedSize);
    }, [debouncedSize, setCellSize]);

    return (
        <Flex gap={8} align="center" style={{ marginTop: 10 }}>
            <span>Размер ячейки (км):</span>
            <Slider
                min={1}
                max={200}
                value={localSize}
                onChange={setLocalSize}
                style={{ width: 150}}
                step={1}
            />
            <InputNumber
                min={1}
                max={200}
                value={localSize}
                onChange={(value) => value && setLocalSize(value)}
                step={1}
            />
        </Flex>
    );
};