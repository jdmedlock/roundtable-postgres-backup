import PG from 'pg'
import format from 'pg-format'
import faker from 'faker'
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

const sql = `
drop table if exists counterparties;
create table counterparties(id serial unique, name text, business text, phone text, address text);
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
      const rc = faker.helpers.createCard()

      return {
          name: rc.company.name,
          business: rc.company.bs,
          phone: rc.phone,
          address: rc.address.streetA + ', ' + rc.address.streetB + ', '
              + rc.address.zipcode + ' ' + rc.address.city + ', ' + rc.address.county
      }
  }).map(x => [x.name, x.business, x.phone, x.address])

  // perform insert
  console.log('insert data')
  const insertSql = format('insert into counterparties( name, business, phone, address) values %L returning id', arr)
  const res = await client.query(insertSql)
  console.log('inserted records: ', res.rowCount)
}

f().then(() => {
  console.log('finished')
  process.exit(0)
}).catch(error => {
  console.error(error)
})
