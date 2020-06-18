# Delivery Slots

## Approach

To create this delivery booking system I used the following technologies:

* DyanmoDB for storying data
* GraphQL with Apollo Server for the data endpoint, and to wrap the DynamoDB puts/scans
* React
* Next JS for rendering the React App
* Apollo Client for fetching and caching the GraphQL responses
* Styled Components for adding styles
* date-fns to help with rendering dates

## Notes

* You can select a delivery date in the application, and when you reserve it will add this to a table of reservations
* When the application next loads, it will take these bookings and check to see if there is any availability for the slots
* Currently the availability for the slots is hard coded, but this could be taken from an endpoint
* Having only the bookings in the database means that dates don't need to be added to the data store as they come avaliable


## DyanomoDB

I use this NoSQL database to store bookings as they are made. You can see here the config of this database:

![DynamoDB Config](/database-config.jpg)
