import { OSMLocation } from '@renderer/types/location';
import { Flex, Typography } from 'antd';
import { FC } from 'react';

interface Props {
    location: OSMLocation;
}

export const LocationSearchItem: FC<Props> = ({ location }) => {
    return (
        <Flex vertical>
            <Typography.Title level={5}>{location.name}</Typography.Title>

            <Typography.Text type="secondary" style={{ whiteSpace: 'pre-wrap' }}>
                {location.display_name}
            </Typography.Text>
        </Flex>
    );
};
