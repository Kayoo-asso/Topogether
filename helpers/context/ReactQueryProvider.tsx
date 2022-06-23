import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { PropsWithChildren, useState } from "react";

export type ReactQueryProviderProps = PropsWithChildren<{
  pageProps: any
}>;

export function ReactQueryProvider({ children, pageProps }: ReactQueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        {children}
      </Hydrate>
    </QueryClientProvider>

  )
}