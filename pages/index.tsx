import { useState } from 'react'
import { GetStaticProps } from 'next'

import { initializeApollo } from '../lib/apolloClient'

import { Layout } from '../components/Layout'

import { DeliverySlotPicker } from '../components/DeliverySlotPicker'

export default function Index() {
  const [restrictedItem, setRestrictedItem] = useState(0)

  const handleClick = (e) => setRestrictedItem(restrictedItem ? 0 : 1)

  return (
    <Layout>
      <h1>Plot</h1>

      <h2>Select Your Delivery Slot</h2>
      <input
        type="checkbox"
        value={restrictedItem ? 1 : 0}
        id="huge"
        onClick={handleClick}
      />
      <label htmlFor="huge">Huge Item (Restricted on Wednesdays)</label>

      <DeliverySlotPicker restrictedItem={restrictedItem} />
    </Layout>
  )
}

// TODO: Include this code to pre-load the query on SSR, giving full SSR support

// export const getStaticProps: GetStaticProps = async () => {
//   const apolloClient = initializeApollo()

//   await apolloClient.query({
//     query: GET_BOOKINGS_QUERY,
//   })

//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
//     },
//     unstable_revalidate: 1,
//   }
// }
