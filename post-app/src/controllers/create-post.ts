import Post from "../models/post";
import {Response, Request} from "express";
import {trace, context, Span, SpanKind, SpanStatusCode} from '@opentelemetry/api';



const tracer = trace.getTracer("create-post")



export const createPost =   async(req: Request, res: Response) => {

  let traceID;

  const result = await tracer.startActiveSpan("create-post",{kind: SpanKind.SERVER}, async (span: Span) => {

    span.setAttributes({
      'http.method': req.method,
      'http.route': '/posts',
      'http.scheme': req.protocol,
      'http.user_agent': req.get('User-Agent') || '',
      'http.client_ip': req.ip,
      'http.host': req.hostname
    })


    const {title} = req.body;

    const post = Post.build({
    title: title,
    comments: []
    })

   await post.save()

   span.addEvent("post creation successful",{
    'res.status': 201,
    'success': true,
   })

   span.setStatus({code: SpanStatusCode.OK})

   traceID = span.spanContext().traceId

   span.end()

   return post;

  });

  console.log(`post successfully created, traceID: ${traceID}`)

  res.status(201).send(result)

};
