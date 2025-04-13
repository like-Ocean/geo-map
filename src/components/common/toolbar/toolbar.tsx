import { SearchLocation } from '@/components/features/search-location';
import { CellSizeControl } from '@/components/features/cell-size-control';
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
