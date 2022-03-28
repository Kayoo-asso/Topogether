import React, { useEffect, useState } from "react";

export type FetchResult<T> = {
    type: 'success',
    data: T
} | {
    type: 'error',
    error: unknown,
} | {
    type: 'loading'
};

export function useAsyncData<T>(fetch: () => Promise<T>, deps?: React.DependencyList): FetchResult<T> {
    const [result, setResult] = useState<FetchResult<T>>({
        type: 'loading'
    });

    useEffect(() => {
        fetch()
            .then(data => setResult({
                type: 'success',
                data
            }))
            .catch(error => setResult({
                type: 'error',
                error
            }));
    }, deps);

    return result;
}