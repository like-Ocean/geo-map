import { Modal, InputNumber, Flex, Typography } from 'antd';
import { useLocationStore } from '@/store/location';

export const HexagonInputModal = () => {
    const selectedHexagonId = useLocationStore.use.selectedHexagonId();
    const hexagonValues = useLocationStore.use.hexagonValues();
    const setHexagonValue = useLocationStore.use.setHexagonValue();
    const selectHexagon = useLocationStore.use.selectHexagon();

    const value = selectedHexagonId ? hexagonValues[selectedHexagonId] || 0 : 0;

    return (
        <Modal
            title="Введите значение для ячейки"
            open={!!selectedHexagonId}
            onCancel={() => selectHexagon(null)}
            onOk={() => selectHexagon(null)}
        >
            <Flex vertical gap={16}>
                <Typography.Text>Выбранная ячейка: {selectedHexagonId}</Typography.Text>
                {/* мб фиксануть инпут, убрать max */}
                <InputNumber
                    value={value}
                    onChange={(val) => selectedHexagonId && setHexagonValue(selectedHexagonId, Number(val))}
                    min={0}
                    max={1000000}
                    step={100}
                />
            </Flex>
        </Modal>
    );
};