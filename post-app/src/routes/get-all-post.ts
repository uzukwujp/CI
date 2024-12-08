import {Router} from "express"

import { getAllPost } from "../controllers/get-all-post"


const getAllPostRouter = Router()


getAllPostRouter
.get('/posts',
 getAllPost
)

export default getAllPostRouter;