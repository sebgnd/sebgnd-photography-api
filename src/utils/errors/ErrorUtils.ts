import HttpError from './HttpError';

export default class ErrorUtils {
    static isHttpError(error: Error): error is HttpError{
        return error instanceof HttpError;
    }
}