import { InputNumber, Slider, Flex, Modal, Button } from 'antd';
import { FC, useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { useHexagonStore } from '@renderer/store/hexagon';

export const CellSizeControl: FC = () => {
    const cellSize = useHexagonStore.use.cellSize();
    const hexagonValues = useHexagonStore.use.hexagonValues();
    const setCellSize = useHexagonStore.use.setCellSize();
    const resetAllValues = useHexagonStore.use.resetAllValues();

    const [localSize, setLocalSize] = useState(cellSize);
    const [debouncedSize] = useDebounce(localSize, 500);
    const [showConfirm, setShowConfirm] = useState(false);

    const hasData = Object.keys(hexagonValues).length > 0;

    const applySizeChange = useCallback(
        (size: number) => {
            setCellSize(size);
            setShowConfirm(false);
        },
        [setCellSize],
    );

    const handleReset = useCallback(() => {
        resetAllValues();
    }, [resetAllValues]);

    useEffect(() => {
        if (hasData && debouncedSize !== cellSize) {
            setShowConfirm(true);
        } else if (debouncedSize !== cellSize) {
            applySizeChange(debouncedSize);
        }
    }, [debouncedSize, cellSize, hasData, applySizeChange]);

    return (
        <>
            <Flex vertical gap={8} style={{ marginTop: 10 }}>
                <Flex gap={8} align="center">
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

                <Flex justify="flex-start">
                    <Button type="primary" danger onClick={handleReset}>
                        Сброс значений
                    </Button>
                </Flex>
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
                destroyOnHidden
            >
                <p>Изменение размера ячейки приведет к сбросу всех введенных данных!</p>
            </Modal>
        </>
    );
};
