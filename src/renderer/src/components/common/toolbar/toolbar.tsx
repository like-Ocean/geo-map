import styles from './toolbar.module.css';
import { SearchLocation } from '@renderer/components/features/search-location';
import { CellSizeControl } from '@renderer/components/features/cell-size-control';
import { Card, Button, Switch } from 'antd';
import { useCallback } from 'react';
import { useHexagonStore } from '@renderer/store/hexagon';

export const Toolbar = () => {
    const resetAllValues = useHexagonStore.use.resetAllValues();

    const handleReset = useCallback(() => {
        resetAllValues();
    }, [resetAllValues]);

    const showLabels = useHexagonStore.use.showLabels();
    const toggleShowLabels = useHexagonStore.use.toggleShowLabels();

    const handleToggle = useCallback(() => {
        toggleShowLabels();
    }, [toggleShowLabels]);

    return (
        <Card className={styles.toolbar} size="small">
            <SearchLocation />
            <CellSizeControl />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Button style={{ marginTop: '5px' }} type="primary" danger onClick={handleReset}>
                    Сброс значений
                </Button>
                <div style={{ marginTop: '5px' }}>
                    <span style={{ marginRight: '5px' }}>Отображение текста:</span>
                    <Switch checked={showLabels} onChange={handleToggle} />
                </div>
            </div>
        </Card>
    );
};
