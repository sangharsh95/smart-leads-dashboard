import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';

export const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      if (error && error.errors) {
        res.status(400);
        const errorMessages = error.errors.map((err: any) => `${err.path.join('.')} - ${err.message}`).join(', ');
        return next(new Error(`Validation failed: ${errorMessages}`));
      }
      return next(error);
    }
  };
};
