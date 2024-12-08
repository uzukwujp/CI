import {Router} from "express"
import {body} from 'express-validator';

import {createPost} from "../controllers/create-post"


const createPostRouter = Router()

createPostRouter
.post('/posts',
 body('title').
 isString().
 withMessage("title is not a valid string"),
 createPost
)

export default createPostRouter;