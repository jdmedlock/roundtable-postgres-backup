import PG from 'pg'
import format from 'pg-format'
import { faker } from '@faker-js/faker'
import dotenv from 'dotenv'

dotenv.config()

const sql = `
  drop table if exists users;
  create table users(id serial unique, 
    firstname text, 
    lastname text, 
    phone text, 
    streetaddress text,
    city text, 
    zipcode text, 
    countrycode text
    );
`

// Create an array of numbers spanning a desired range
const range = (start, end) => Array.from(
  Array(Math.abs(end - start) + 1), 
  (_, i) => start + i
)

// Define and load the test DB with data
const createTestTable = async function () {

  const numRecords = process.env.DB_NO_ROWS === undefined 
    ? 10 
    : Number(process.env.DB_NO_ROWS)

  const client = new PG.Client({
      connectionString: process.env.DB_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false }
  })

  // Connect to the PostgreSQL test DB
  console.log('Connecting to database instance...')
  await client.connect()

  // Create a test table
  console.log('Creating table...')
  //await client.query(sql)

  // Populate the test table with rows of data
  console.log('Loading test data...')
  const testData = range(0, numRecords-1).map(i => {
    return {
      firstname: `${ faker.person.firstName() }`,
      lastname: `${ faker.person.lastName() }`,
      phone: `${ faker.phone.number() }`,
      streetaddress: `${ faker.location.streetAddress() }`,
      city: `${ faker.location.city() }`,
      zipcode: `${ faker.location.zipCode() }`, 
      countrycode: `${ faker.location.countryCode('alpha-2') }`
    }
  }).map(x => [x.firstname, x.lastname, x.phone, x.streetaddress, x.city, x.zipcode, x.countrycode])

  // Insert the test rows into the DB 
  console.time('Inserting test data...')
  const insertSql = format('insert into users( firstname, lastname, phone, streetaddress, city, zipcode, countrycode) values %L returning id', testData)
  console.timeLog('Inserting test data...')
  const res = await client.query(insertSql)
  console.log(`Test DB created. Inserted ${ res.rowCount } rows`)
}

createTestTable()
.then(() => {
  console.log('Sucessfully completed')
  process.exit(0)
})
.catch(error => {
  console.error(error)
  process.exit(0)
})
