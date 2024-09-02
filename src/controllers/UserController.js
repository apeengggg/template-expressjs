const { BadRequest, SearchOk } = require('../utils/ResponseUtil')
const logger = require('../utils/LoggerUtil')

const { searchUser} = require('../models/User')
const { db, getTotalRows } = require('../utils/DBUtils')
class UserController {
    
    async doSearch(req, res) {
        const param = req.query
        try {

            const { page, perPage, totalPages, totalRows, result } = await searchUser(param, "")
            SearchOk(res, 1, 10, 10, 1, result)
        } catch(err) {
            logger.error('UserController.doSearch', err)
            if(err.routine == "errorMissingColumn") {
                BadRequest(res, `Cannot order result by ${param.orderBy}`)
            } else {
                BadRequest(res, "Bad Request")
            }
        }
    }
}

module.exports = UserController