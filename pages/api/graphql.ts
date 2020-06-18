import { ApolloServer, gql } from 'apollo-server-micro'
import { nanoid } from 'nanoid'

// TODO: Could optimise this to only include parts of the library we need
import AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient();


const typeDefs = gql`
  type Query {
    bookings: [Booking!]!
  }

  type Mutation {
    createBooking(slotDate: String, slotCode: String): Booking!
  }

  type Booking {
    slotDate: String
    bookingId: String
    slotCode: String
  }
`

const resolvers = {
  Query: {
    async bookings() {


      const scanDatabase = (params) => new Promise((success, error) => {
        docClient.scan(params, function(err, data) {
          if (err) {
            error(err);
          } else {
            success(data);
          }
        })
      })

      // try catch
      const data = await scanDatabase({
        TableName : "PatchDeliverySlots",
      })

      const response = data.Items.map(item => ({
        slotDate: item.slotDate,
        bookingId: item.bookingId,
        slotCode: item.slotCode
      }))

      return response
    },
  },
  Mutation: {
    async createBooking(_parent, args) {

      const { bookingId, slotDate, slotCode } = args;

      const putItem = (params) => new Promise((success, error) => {
        docClient.put(params, function(err, data) {
          if (err) {
            error(err)
          } else {
            success(data)
          }
        })
      })

      let response
      try {
        response = await putItem({
          TableName: 'PatchDeliverySlots',
          Item: {
            slotDate,
            bookingId: nanoid(),
            slotCode
          }
        })
      } catch (err) {
        console.error('Could not put item', err)
      }

      return {
        slotDate,
        bookingId,
        slotCode,
      }
    }
  }
}

const apolloServer = new ApolloServer({ typeDefs, resolvers })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({ path: '/api/graphql' })
