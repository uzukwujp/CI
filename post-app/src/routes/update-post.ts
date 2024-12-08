import {Router} from "express"
import {query} from "express-validator"

import {updatePost} from "../controllers/update-post"


const updatePostRouter = Router()

updatePostRouter
.put('/posts/',
 query('content').
 isString().
 withMessage("content must is not a valid string"),
 updatePost)

export default updatePostRouter;



