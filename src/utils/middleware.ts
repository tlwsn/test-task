import Ajv, { JSONSchemaType } from "ajv";
import { Request, Response, NextFunction } from "express";

export function validateBody<T>(schema: JSONSchemaType<T>) {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    return (req: Request<{}, {}, T>, res: Response, next: NextFunction) => {
        if (!validate(req.body))
            return res
                .status(400)
                .json({ success: false, errors: validate.errors });
        req.body = req.body as T;
        return next();
    };
}
