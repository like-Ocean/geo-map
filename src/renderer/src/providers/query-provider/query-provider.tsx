import { queryClient } from '@renderer/api/query';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FC, PropsWithChildren } from 'react';

export const QueryProvider: FC<PropsWithChildren> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools buttonPosition="bottom-right" position="right" />
        </QueryClientProvider>
    );
};
