import {Router} from "express"
import {param} from "express-validator"
import mongoose from "mongoose"

import { getOnePost } from "../controllers/get-one-post"

const getOnePostRouter = Router()

getOnePostRouter
.get('/posts/:id',
 param('id').
 custom((val:string)=> mongoose.Types.ObjectId.isValid(val)).
 withMessage('id must be a valid mongodb objectId'),
 getOnePost)

 export default getOnePostRouter;