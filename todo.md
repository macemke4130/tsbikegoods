# To Do!

## Auth

- Update Auth variables from local storage to globalReducer state
- Register page probably has some legaleze
- Login user upon registration
- Private route component

## Profile Page

- Build
- If current user is not profile user, shows current listings and basic info
- If current user is logged in viewing their own profile, show more info and edit button.
  - This section is visible to only you.
- URL should be "/user-lucasmace"

## Alert User Component

- Should be in App level or in individual components?
- If App level, listen for window messages?
- Is this what Redux is for?

# Metadata

- Install helmet and prerender.io or something that will work
- Open Graph data for every listing
- Use main photo for Open Graph data
- https://medium.com/%2540mpgelber7495/how-to-change-link-previews-open-graph-with-a-client-side-rendered-react-app-using-react-helmet-ab2a5e2059f7

## Analytics

- Determine device
- Number of times a product is viewed - Display on PDP
- Count page views
- Count "Contact Seller" clicks
- Count

## CRUD

- Price? Willing to take trade.
- Convert brands from string to int for database insert
- Make `<dialog>` to catch FREE listings
- Create Listing page: If brands doesn't exist in list, create new brand
- newProduct: Needs list date, number of views since listing

## Profile

- Default Physical Location - Used for "local pickup" items

## PLP

- List all
- Sort by...
- Navigation: Show per item type

## Routing

- React Router? Somthing newer?

## Database

- Learn how to insert data into two tables at once in SQL
  https://www.geeksforgeeks.org/insert-multiple-values-into-multiple-tables-using-a-single-statement-in-sql-server/
- Add product weight to goods
- Preferred method of contact
- Phone Number
- Email, Text, Call

## GraphQL

## Styling

## Hosting

- Figure out photo upload and hosting
- Pricing

## Articles

- How to take good photos
- How to write good descriptions
- Packaging and Shipping advice (Hail USPS)
- Privacy Statement - We don't use cookies, IDK WTF you are. I already know you like bikes and that's enough.
  - What we do anonomously collect and why - Table
- Accessability Statement
- Legal Statement

## Reviews

- Come up with a way that they won't suck
- Review of seller performance
- X stars in the last 90 days
- Review to Sold Items ratio must be 1:1

## Search

- Search Products
- Search Users
