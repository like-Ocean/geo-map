import { Modal, InputNumber, Flex, Typography, Button } from 'antd';
import { useHexagonStore } from '@/store/hexagon';
import { useEffect, useState } from 'react';

export const HexagonInputModal = () => {
    const selectedHexagonId = useHexagonStore.use.selectedHexagonId();
    const hexagonValues = useHexagonStore.use.hexagonValues();
    const setHexagonValue = useHexagonStore.use.setHexagonValue();
    const selectHexagon = useHexagonStore.use.selectHexagon();

    const [localValue, setLocalValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (selectedHexagonId) {
            setLocalValue(hexagonValues[selectedHexagonId] || 0);
        }
    }, [selectedHexagonId, hexagonValues]);

    const handleOk = async () => {
        setIsLoading(true);
        try {
            if (selectedHexagonId) {
                setHexagonValue(selectedHexagonId, localValue);
            }
            selectHexagon(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        selectHexagon(null);
    };

    const handleChange = (value: number | null) => {
        if (value !== null) {
            const validatedValue = Math.max(value, 10);
            setLocalValue(validatedValue);
        }
    };

    return (
        <Modal
            title="Введите значение для ячейки (в тысячах)"
            open={!!selectedHexagonId}
            onCancel={handleCancel}
            onOk={handleOk}
            destroyOnClose
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Отмена
                </Button>,
                <Button key="submit" type="primary" loading={isLoading} onClick={handleOk}>
                    Сохранить
                </Button>,
            ]}
        >
            <Flex vertical gap={16}>
                <Typography.Text strong>Выбранная ячейка: {selectedHexagonId}</Typography.Text>

                <InputNumber
                    value={localValue}
                    onChange={handleChange}
                    min={10}
                    step={100}
                    addonAfter="тыс."
                    style={{ width: '100%' }}
                />

                <Typography.Text type="secondary">Пример: 60 → 60.000 человек</Typography.Text>
            </Flex>
        </Modal>
    );
};
