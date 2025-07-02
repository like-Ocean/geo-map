import { SearchLocation } from '@renderer/components/features/search-location';
import { CellSizeControl } from '@renderer/components/features/cell-size-control';
import { Card } from 'antd';
import styles from './toolbar.module.css';


export const Toolbar = () => {
    return (
        <Card className={styles.toolbar} size="small">
            <SearchLocation />
            <CellSizeControl />
        </Card>
    );
};
