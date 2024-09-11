const { BadRequest, SearchOk, Ok, InternalServerErr } = require('../utils/ResponseUtil')
const logger = require('../utils/LoggerUtil')
const { GetMsg } = require('../utils/MessageUtil')
const { searchUser, createUser, getOneSystem, getOneUserByNip, updateUser, deleteUser, getOneUserByUserId} = require('../models/User')
const bcrypt = require('bcrypt')
const saltRounds = parseInt(process.env.SALT_ROUND)
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

class UserController {
    
    async doSearch(req, res) {
        const param = req.query
        try {

            const { page, perPage, totalPages, totalRows, result } = await searchUser(param, "")
            SearchOk(res, page, perPage, totalPages, totalRows, result)
        } catch(err) {
            logger.error('UserController.doSearch', err)
            if(err.routine == "errorMissingColumn") {
                BadRequest(res, `Cannot order result by ${param.orderBy}`)
            } else {
                BadRequest(res, "Bad Request")
            }
        }
    }

    async doCreate(req, res){
        const body = req.body
        const uploadDir = path.resolve(__dirname, '../..', 'public', 'foto-profile');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        try{
            const userByNip = await getOneUserByNip({nip: body.nip})

            if(userByNip != null) {
                BadRequest(res, GetMsg('found.duplicate', 'NIP', body.nip))
                return
            }

            const role = await getOneSystem({roleId: body.roleId})
            // console.log("🚀 ~ UserController ~ doCreate ~ role:", role)
            if(role == null) {
                BadRequest(res, GetMsg('not.found.in.master', 'Role Id', body.roleId))
                return
            }

            body.userId = uuidv4()
            let foto = req.files.foto, foto_file_name = body.userId+'_'+foto.name, upload_path = path.join(uploadDir, foto_file_name)
            // console.log('uploadpath', upload_path)
            foto.mv(upload_path, async function(err){
                if(err){
                    logger.error('UserController.doCreate', 'Error Upload Photo Profile'); return BadRequest(res, 'Bad Request')
                }

                let hash = await bcrypt.hash(body.password, saltRounds)
                if(hash != undefined) {
                    body.password = hash
                    body.foto = 'foto-profile/'+foto_file_name
                    // console.log("🚀 ~ UserController ~ doCreate ~ body:", body)
                    await createUser(body, "")
                    Ok(res, 'User created successfully')
                } else {
                    InternalServerErr(res, "Error during saving data")
                }
            })
        }catch(err) {
            logger.error('UserController.doCreate', err)
            InternalServerErr(res, "Internal Server Error")
        }
    }

    async doUpdate(req, res){
        const body = req.body
        console.log("🚀 ~ UserController ~ doUpdate ~ body:", req.body)
        try{
            const userByUserId = await getOneUserByUserId({userId: body.userId})
            console.log("🚀 ~ UserController ~ doUpdate ~ userByUserId:", userByUserId)
            if(userByUserId == null) {
                logger.error('UserController.doUpdate', {stack: 'Not Found User'})
                BadRequest(res, "Bad Request")
                return
            }

            const role = await getOneSystem({roleId: body.roleId})
            console.log("🚀 ~ UserController ~ doUpdate ~ role:", role)
            if(role == null) {
                BadRequest(res, GetMsg('not.found.in.master', 'Role Id', body.roleId))
                return
            }

            if(body.password != ""){
                let hash = await bcrypt.hash(body.password, saltRounds)
                if(hash != undefined) {
                    body.password = hash
                    console.log("🚀 ~ UserController ~ doUpdate ~ body:", body)
                } else {
                    InternalServerErr(res, "Error during update data")
                }
            }
            
            await updateUser(body, "")
            Ok(res, 'User updated successfully')
        }catch(err) {
            logger.error('UserController.doUpdate', err)
            InternalServerErr(res, "Internal Server Error")
        }
    }

    async doDelete(req, res){
        const body = req.body
        console.log("🚀 ~ UserController ~ doDelete ~ body:", req.body)
        try{
            const userByUserId = await getOneUserByUserId({userId: body.userId})
            console.log("🚀 ~ UserController ~ doDelete ~ userByUserId:", userByUserId)
            if(userByUserId == null) {
                logger.error('UserController.doDelete', 'Not Found NIP')
                BadRequest(res, "Bad Request")
                return
            }
            
            await deleteUser(body, "")
            Ok(res, 'User deleted successfully')
        }catch(err) {
            logger.error('UserController.doDelete', err)
            InternalServerErr(res, "Internal Server Error")
        }
    }
}

module.exports = UserController