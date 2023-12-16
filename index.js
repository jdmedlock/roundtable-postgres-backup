import PG from 'pg'
import format from 'pg-format'
import { faker } from '@faker-js/faker'
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

const sql = `
drop table if exists users;
create table users(id serial unique, firstname text, lastname text, phone text, address text);
`

const range = (start, end) => Array.from(
    Array(Math.abs(end - start) + 1), 
    (_, i) => start + i
  )

const f = async function () {

  const numRecords = process.env.DB_NO_ROWS === undefined 
    ? 10 
    : Number(process.env.DB_NO_ROWS)

  const client = new PG.Client({
      connectionString: process.env.DB_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false }
  })

  // connect
  console.log('connecting')
  await client.connect()

  // create table
  console.log('creating table')
  await client.query(sql)

  console.log('creating fake data')
  const arr = range(0, numRecords).map(i => {

      return {
          firstname: `${faker.person.firstName()}`,
          lastname: `${faker.person.lastName()}`,
          phone: `${faker.phone.number()}`,
          address: `${faker.location.streetAddress()}` + ', ' 
              + `${faker.location.zipCode()}` + ' ' 
              + `${faker.location.city()}` + ', ' 
              + `${faker.location.county()}`
      }
  }).map(x => [x.firstname, x.lastname, x.phone, x.address])

  console.log('arr: ', arr)

  // perform insert
  console.log('insert data')
  const insertSql = format('insert into users( firstname, lastname, phone, address) values %L returning id', arr)
  const res = await client.query(insertSql)
  console.log('inserted records: ', res.rowCount)
}

f().then(() => {
  console.log('finished')
  process.exit(0)
}).catch(error => {
  console.error(error)
})
