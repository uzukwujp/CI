
import app from "./app";
import mongoose from "mongoose";
import { startInstrumentation } from "./instrumentataion";
import {trace, Span,SpanStatusCode,SpanKind} from '@opentelemetry/api';


const startUP = async (portNumber?: number) => {;

  const tracer = trace.getTracer('start-up-operation');

  return tracer.startActiveSpan("start-up-operation",{kind: SpanKind.SERVER},(parentSpan: Span)=> {
    parentSpan.setAttribute("operation", "startup operation")
    parentSpan.addEvent("app startup operation",{process: "post-app"})

    tracer.startActiveSpan("set-mongoUrl-env-variable",{kind: SpanKind.SERVER},(span:Span)=> {

      span.setAttributes({"process": "mongodb", "action": "set env variable"})
      span.addEvent("setting mongodb env variable",{process: "mongodb"})


      if (!process.env.mongoUrl) {
        console.log("mongourl env variable not set")
        span.setStatus({code: SpanStatusCode.ERROR})
        process.exit(1)
      }

      span.end()

    })

    tracer.startActiveSpan("database-connection",{kind: SpanKind.SERVER}, async (span: Span)=>{

      span.setAttributes({"process": "mongod", "action": "connecting to database"})
      span.addEvent("connecting to mongodb database",{process: "mongodb"})

      try {

        await mongoose.connect(process.env.mongoUrl!)
        console.log('connection to database established')
    
      }catch(err){
        console.log(err)
        span.setStatus({code: SpanStatusCode.ERROR})
        span.recordException(err as Error)
        process.exit(1)
    
      }
      span.end()
    
    })

    tracer.startActiveSpan("start-express-server",{kind: SpanKind.SERVER},(span: Span)=> {

      span.setAttributes({"process": "express", "action":"startup express"})
      span.addEvent("starting express app",{process: "express"})

      const port = portNumber
      app.listen(port, ()=> {
        console.log(`server listening on port:${port}`)
      })

      span.end()
      
    })

    parentSpan.end()

  })

}

startInstrumentation()

startUP(4000)