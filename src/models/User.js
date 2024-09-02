const { db, getTotalRows } = require('../utils/DBUtils')

const searchQuery = (withPassword = false) => {
    let query = 
          'SELECT '
        + 'u.user_id, '
        + 'u.nip, '
        + 'u.name, '
        + 'u.email, '
        + 'u.phone, '
        + 'u.role_id, '
        + 'r.role_name, '
        

        if(withPassword) {
            query += 'u.password, '
        }

        query += 'u.status '
        + 'FROM '
        + 'm_users u '
        + 'LEFT JOIN m_roles r ON r.role_id = u.role_id '
        + 'WHERE '
        + '1=1 '

    return query
}

/* search user */
const searchUser = async (param, roleId) => {

    let query = searchQuery()
    let queryParams = []

    // dynamic condition and parameters
    if(param.userId && param.userId != "") {
        queryParams.push(param.userId)
        query = query + ` AND u.user_id = $${queryParams.length} `        
    }
    if(param.roleId && param.roleId != "") {
        queryParams.push(param.roleId)
        query = query + ` AND u.role_id = $${queryParams.length} `        
    }
    if(param.name && param.name != "") {
        queryParams.push('%' + param.name + '%')
        query = query + ` AND LOWER(u.name) like LOWER($${queryParams.length}) `
    }
    if(param.email && param.email != "") {
        queryParams.push('%' + param.email + '%')
        query = query + ` AND LOWER(u.email) like LOWER($${queryParams.length}) `
    }

    // dynamic order
    if(param.orderBy && param.orderBy != "") {
        let dir = 'asc'
        if(param.dir && (param.dir == "asc" || param.dir == 'desc')) {
            dir = param.dir
        }

        query = query + ` ORDER BY "${param.orderBy}" ${dir} `
    } else {
        query = query + ` ORDER BY u.user_id ASC `
    }

    // get total rows
    console.log("🚀 ~ searchUser ~ queryParams:", query, queryParams)
    let totalRows = await getTotalRows(query, queryParams)
    // console.log('total rows', totalRows)

    // limit and paging and such
    let limit = 5
    if(param.perPage && param.perPage != "") {
        limit = param.perPage
    }
    
    let offset = 0
    if(param.page && param.page != "") {
        offset = limit * (param.page - 1)
    }

    query = query + ` LIMIT ${limit} OFFSET ${offset} `    

    try {
        const result = await db.manyOrNone(query, queryParams);
        let totalPages = Math.ceil(totalRows / param.perPage)

        return { page: param.page, 
            perPage: param.perPage,
            totalRows,        
            totalPages,
            result, 
        }    
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }

    
}

module.exports = {searchUser}