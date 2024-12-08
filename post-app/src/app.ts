import express from "express";
import {json} from "body-parser";
import "express-async-errors";
import cors from "cors"

import createPostRouter from "./routes/createPost";
import getAllPostRouter from "./routes/get-all-post";
import getOnePostRouter from "./routes/get-one-post";
import updatePostRouter from "./routes/update-post";
import { errorHandler } from "./helper-function/error-handler";
import { extractPropagatedContext } from "./helper-function/extract-propagated-context";
import { setup_metrics } from "./helper-function/setup-metrics";

const app = express()

app.set('trust proxy', false);
app.use(cors())
app.use(json())


app.use(extractPropagatedContext)
app.use(setup_metrics)
app.use(createPostRouter)
app.use(getOnePostRouter)
app.use(getAllPostRouter)
app.use(updatePostRouter)
app.use(errorHandler)




export default app;