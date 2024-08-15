import { RequestHandler } from 'express';
import { ObjectSchema } from 'yup';

export type TProperty = 'body' | 'headers' | 'params' | 'query';

export type TSchemas = Record<TProperty, ObjectSchema<any>>;

export type TValidation = (schemas: Partial<TSchemas>) => RequestHandler;
