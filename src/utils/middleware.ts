import Ajv, { JSONSchemaType } from "ajv";
import e, { Request, Response, NextFunction, Errback } from "express";
import { MongoServerError } from "mongodb";
import HttpException from "./HttpException";

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

export function handleError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof MongoServerError) {
        if (err.code == 11000) {
            const field = Object.keys(err.keyValue);
            const error = `An account with that ${field} already exists.`;
            return res.status(409).json({
                success: false,
                errors: [{ message: error }],
            });
        }
    } else if (err instanceof HttpException) {
        return res.status(err.code).json({
            success: false,
            errors: [{ message: err.message }],
        });
    } else if (err instanceof SyntaxError) {
        return res.status(400).json({
            success: false,
            errors: [{ message: "Bad request" }],
        });
    }

    res.status(500).json({
        success: false,
        errors: [{ message: "Server error" }],
    });
    next();
}
