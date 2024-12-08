import {Request, Response} from "express"
import {trace, Span, SpanStatusCode, SpanKind} from '@opentelemetry/api';

import Post from "../models/post"



const tracer = trace.getTracer("get-one-post")


export const getOnePost =  async(req: Request, res: Response) => {

  let traceID;

  const result = await tracer.startActiveSpan("get-one-post",{kind: SpanKind.SERVER}, async(span: Span)=> {

    span.setAttributes({
      'http.method': req.method,
      'http.route': '/posts/:id',
      'http.scheme': req.protocol,
      'http.user_agent': req.get('User-Agent') || '',
      'http.client_ip': req.ip,
      'http.host': req.hostname
    })

    const {id} = req.params

    const post = await Post.findById({_id: id})

    span.addEvent("fetch one post",{
      'res.status': 200,
      'success': true,
     })

     span.setStatus({code: SpanStatusCode.OK})

    traceID = span.spanContext().traceId

    span.end()

    return post;

  })

  console.log(`fetching a post: ${result?._id}, traceId: ${traceID}`)

  res.send({post: result,  status: true});

};