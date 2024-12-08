import {Request, Response} from "express";
import {trace, Span, SpanStatusCode, SpanKind} from '@opentelemetry/api';

import Post from "../models/post"

const tracer = trace.getTracer("update-post")


export const updatePost = async(req: Request, res: Response) => {

  let traceID;

  const result = await tracer.startActiveSpan("update-post",{kind: SpanKind.SERVER}, async(span: Span)=> {

    span.setAttributes({
      'http.method': req.method,
      'http.route': "/posts?postId=value&content=value",
      'http.scheme': req.protocol,
      'http.user_agent': req.get('User-Agent') || '',
      'http.client_ip': req.ip,
      'http.host': req.hostname
    })

    const {postId } = req.query

    const content = req.query.content as string

    const post = await Post.findById({_id: postId})

    post?.comments.push(content)

    await post?.save()

    span.addEvent("updating a post",{
      'res.status': 200,
      'success': true,
     })
    span.setStatus({code: SpanStatusCode.OK})

    traceID = span.spanContext().traceId

    span.end()


    return post


  });

  console.log(`post updated successfully, traceId: ${traceID} `)

  res.send(result)

};