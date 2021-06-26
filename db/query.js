const { Client } = require('pg')

const client = new Client ({
  user: 'postgres',
  password: '1sdcAragorn',
  host: 'localhost',
  database: 'sdc',
  port: 5432,
})

client.connect()
  .then(() => console.log('Connected successfully'))
  .catch((err) => console.log('Failed to establish connection'))

var check = function() {
  console.log('check')
}

module.exports.check = check;