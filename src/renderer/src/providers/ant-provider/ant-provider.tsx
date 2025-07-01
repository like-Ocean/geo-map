import { ConfigProvider } from 'antd';
import { FC, PropsWithChildren } from 'react';
import ruRU from 'antd/locale/ru_RU';

export const AntProvider: FC<PropsWithChildren> = ({ children }) => {
    return (
        <ConfigProvider
            locale={ruRU}
            theme={{
                components: { Form: { itemMarginBottom: 0 }, Typography: { titleMarginBottom: 0 } },
            }}
        >
            {children}
        </ConfigProvider>
    );
};
