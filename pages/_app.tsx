import { ApolloProvider } from '@apollo/react-hooks'
import { useApollo } from '../lib/apolloClient'

import { GlobalStyle } from '../components/GlobalStyle'

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
    <ApolloProvider client={apolloClient}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
