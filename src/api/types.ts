import { UseLazyQueryOptions } from '@/hooks/use-lazy-query';
import { DefaultError, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

export type QueryOptions<Data = unknown> = Omit<UseQueryOptions<Data>, 'queryKey' | 'queryFn'>;

export type MutationOptions<Data = unknown, Params = unknown> = Omit<
    UseMutationOptions<Data, DefaultError, Params>,
    'queryKey' | 'queryFn'
>;

export type LazyQueryOptions<Data = unknown, Params = unknown> = Omit<
    UseLazyQueryOptions<Data, DefaultError, Params>,
    'queryKey' | 'queryFn'
>;
