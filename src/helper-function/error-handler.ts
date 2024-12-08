import express, {Request, Response, NextFunction} from "express";
import {trace, Span,SpanStatusCode, SpanKind} from '@opentelemetry/api';


const tracer = trace.getTracer("error-handler")



export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction ) => {

  let traceID;

  return tracer.startActiveSpan("error-handler",{kind: SpanKind.SERVER}, (span: Span)=>{

    span.setStatus({code: SpanStatusCode.ERROR})
    span.recordException(err)

    traceID = span.spanContext().traceId

    console.error({error: err, traceID: traceID})

    const message = "internal server error"

    span.addEvent("internal server error", {
      stack: err.stack,
      message: err.message
    })

    span.end()

    res.status(500).send(`${message}`) 

  });

}