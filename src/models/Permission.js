const { db, getTotalRows } = require('../utils/DBUtils')

const getPermissionById = async (param) => {
    let query = 'SELECT ' 
    + 'f.function_id, f.function_name, f.parent_function_id, create_permission, read_permission, update_permission, delete_permission '
    + 'FROM '
    + 'm_functions f '
    + 'LEFT JOIN m_permissions p ON p.function_id = f.function_id '
    + 'WHERE '
    + 'p.role_id = ${roleId} or f.parent_function_id IS NULL'
    
    console.log("🚀 ~ getPermissionById ~ query:", query)
        return await db.manyOrNone(query, param)
}

const getPermissionByRoleIdAndFunctionId = async (role_id, function_id) => {
    let query = 'SELECT ' 
    + 'p.create_permission as allowCreate, p.read_permission as allowRead, p.update_permission as allowUpdate, p.delete_permission as allowDelete, p.function_id, f.function_name '
    + 'FROM '
    + 'm_permissions p '
    + 'JOIN m_functions f ON p.function_id = f.function_id '
    + 'WHERE '
    + 'p.role_id = $1 AND p.function_id = $2'

    return await db.oneOrNone(query, [role_id, function_id])
}

module.exports = {getPermissionById, getPermissionByRoleIdAndFunctionId}