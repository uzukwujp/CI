import {context, propagation} from '@opentelemetry/api';
import {Request, Response, NextFunction} from "express"

export const extractPropagatedContext = (req: Request, res: Response, next: NextFunction) => {

  const extractedContext = propagation.extract(context.active(), req.headers);

  context.with(extractedContext, () => {
    next();
  });

};

