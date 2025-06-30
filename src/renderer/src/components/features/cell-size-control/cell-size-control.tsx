import { InputNumber, Slider, Flex, Modal } from 'antd';
import { FC, useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { useHexagonStore } from '@renderer/store/hexagon';

export const CellSizeControl: FC = () => {
    const cellSize = useHexagonStore.use.cellSize();
    const hexagonValues = useHexagonStore.use.hexagonValues();
    const setCellSize = useHexagonStore.use.setCellSize();
    
    const [localSize, setLocalSize] = useState(cellSize);
    const [debouncedSize] = useDebounce(localSize, 500);
    const [showConfirm, setShowConfirm] = useState(false);

    const hasData = Object.keys(hexagonValues).length > 0;

    const applySizeChange = useCallback(
        (size: number) => {
            setCellSize(size);
            setShowConfirm(false);
        },
        [setCellSize]
    );

    useEffect(() => {
        if (hasData && debouncedSize !== cellSize) {
            setShowConfirm(true);
        } else if (debouncedSize !== cellSize) {
            applySizeChange(debouncedSize);
        }
    }, [debouncedSize, cellSize, hasData, applySizeChange]);

    return (
        <>
            <Flex gap={8} align="center" style={{ marginTop: 10 }}>
                <span>Размер ячейки (км):</span>
                <Slider
                    min={1}
                    max={200}
                    value={localSize}
                    onChange={setLocalSize}
                    style={{ width: 150 }}
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

            <Modal
                title="Внимание!"
                open={showConfirm}
                onOk={() => applySizeChange(debouncedSize)}
                onCancel={() => {
                    setLocalSize(cellSize);
                    setShowConfirm(false);
                }}
                cancelText="Отмена"
                okText="Продолжить"
            >
                <p>Изменение размера ячейки приведет к сбросу всех введенных данных!</p>
            </Modal>
        </>
    );
};