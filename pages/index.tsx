import { useState } from 'react'
import { GetStaticProps } from 'next'

import { initializeApollo } from '../lib/apolloClient'

import { Layout } from '../components/Layout'

import {
  DeliverySlotPicker,
  GET_BOOKINGS_QUERY,
} from '../components/DeliverySlotPicker'

export default function Index() {
  const [restrictedItem, setRestrictedItem] = useState(false)

  const handleClick = (e) => setRestrictedItem(!restrictedItem)

  return (
    <Layout>
      <h1>Patch</h1>

      <h2>Select Your Delivery Slot</h2>
      <label onClick={handleClick}>
        <input type="checkbox" value={restrictedItem ? ' true' : 'false'} />
        Huge Plant (Restricted on Wednesdays)
      </label>
      <DeliverySlotPicker restrictedItem={restrictedItem} />
    </Layout>
  )
}

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
