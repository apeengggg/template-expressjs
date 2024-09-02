const pgp = require('pg-promise')({
    schema: ['public']
})

const opt = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS
}

const db = pgp(opt)

async function testConnection() {
    try {
      await db.one('SELECT NOW()');
      console.log('Database connection successful');
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  }

testConnection()

const getTotalRows = async (innerQuery, queryParams, dbParam) => {
    let countQuery = 
        ' SELECT count(1) ' +
        ' FROM ( ' + innerQuery + ' ) A '
        let totalRows = { count: 0 }
    if(dbParam) {
        totalRows = await dbParam.one(countQuery, queryParams)        
    } else {
        totalRows = await db.one(countQuery, queryParams)    
        console.log('count query', countQuery)
        console.log("🚀 ~ getTotalRows ~ totalRows:", totalRows)
    }
    return totalRows.count
}

module.exports = { db, getTotalRows}