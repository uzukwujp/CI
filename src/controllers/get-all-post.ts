import {Request, Response} from "express"
import {trace, Span, SpanStatusCode, SpanKind} from '@opentelemetry/api';

import Post from "../models/post"

const tracer = trace.getTracer("get-all-post")


export const getAllPost =  async(req: Request, res: Response) => {

  let traceID;

  const results = await tracer.startActiveSpan("get-all-posts",{kind: SpanKind.SERVER}, async (span: Span) => {

    span.setAttributes({
      'http.method': req.method,
      'http.route': '/posts',
      'http.scheme': req.protocol,
      'http.user_agent': req.get('User-Agent') || '',
      'http.client_ip': req.ip,
      'http.host': req.hostname
    })

    const posts =  await Post.find({})

    span.addEvent("fetch all post",{
      'res.status': 200,
      'success': true,
     })

    span.setStatus({code: SpanStatusCode.OK})

    traceID = span.spanContext().traceId
  
    span.end()

    return posts
  })

  console.log(`fetching all post, traceID: ${traceID}`)

  res.send(results)

}; 