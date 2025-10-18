export enum HttpStatusCode {
    SUCCESS = 'AF_OK_200',               // 200 OK
    CREATED = 'AF_CR_201',               // 201 Created
    NO_CONTENT = 'AF_NC_204',            // 204 No Content

    BAD_REQUEST = 'AF_BR_400',           // 400 Bad Request
    UNAUTHORIZED = 'AF_UA_401',          // 401 Unauthorized
    FORBIDDEN = 'AF_FB_403',             // 403 Forbidden
    NOT_FOUND = 'AF_NF_404',             // 404 Not Found
    CONFLICT = 'AF_CF_409',              // 409 Conflict
    UNPROCESSABLE_ENTITY = 'AF_UE_422',  // 422 Unprocessable Entity
    TOO_MANY_REQUESTS = 'AF_TM_429',     // 429 Too Many Requests

    INTERNAL_SERVER_ERROR = 'AF_SE_500', // 500 Internal Server Error
    BAD_GATEWAY = 'AF_BG_502',           // 502 Bad Gateway
    SERVICE_UNAVAILABLE = 'AF_SU_503',   // 503 Service Unavailable
}

export const responseMessage: Record<HttpStatusCode, string> = {
  [HttpStatusCode.SUCCESS]: 'Request completed successfully.',
  [HttpStatusCode.CREATED]: 'Resource created successfully.',
  [HttpStatusCode.NO_CONTENT]: 'Request successful but no content returned.',

  [HttpStatusCode.BAD_REQUEST]: 'The request could not be understood or was missing required parameters.',
  [HttpStatusCode.UNAUTHORIZED]: 'Authentication is required or has failed.',
  [HttpStatusCode.FORBIDDEN]: 'You do not have permission to access this resource.',
  [HttpStatusCode.NOT_FOUND]: 'The requested resource was not found.',
  [HttpStatusCode.CONFLICT]: 'A conflict occurred with the current state of the resource.',
  [HttpStatusCode.UNPROCESSABLE_ENTITY]: 'The request was well-formed but contains semantic errors.',
  [HttpStatusCode.TOO_MANY_REQUESTS]: 'Too many requests. Please try again later.',

  [HttpStatusCode.INTERNAL_SERVER_ERROR]: 'An unexpected error occurred on the server.',
  [HttpStatusCode.BAD_GATEWAY]: 'The server received an invalid response from the upstream server.',
  [HttpStatusCode.SERVICE_UNAVAILABLE]: 'The server is currently unavailable. Please try again later.',
};

export class HttpResponse {
  public static success<T>(result?: T, message?: string) {
    return {
      code: HttpStatusCode.SUCCESS,
      message: message ?? responseMessage[HttpStatusCode.SUCCESS],
      result: result,
    };
  }

  public static created<T>(result?: T, message?: string) {
    return {
      code: HttpStatusCode.CREATED,
      message: message ?? responseMessage[HttpStatusCode.CREATED],
      result: result,
    };
  }

  public static noContent() {
    return {
      code: HttpStatusCode.NO_CONTENT,
      message: responseMessage[HttpStatusCode.NO_CONTENT],
      result: null,
    };
  }

  private static error<T>(statusCode: HttpStatusCode, message?: string, result?: T) {
    return {
      code: statusCode,
      message: message ?? responseMessage[statusCode],
      result: result ?? null,
    };
  }

  public static badRequest<T>(message?: string, result?: T) {
    return this.error(HttpStatusCode.BAD_REQUEST, message, result);
  }

  public static unauthorized<T>(message?: string, result?: T) {
    return this.error(HttpStatusCode.UNAUTHORIZED, message, result);
  }

  public static forbidden<T>(message?: string, result?: T) {
    return this.error(HttpStatusCode.FORBIDDEN, message, result);
  }

  public static notFound<T>(message?: string, result?: T) {
    return this.error(HttpStatusCode.NOT_FOUND, message, result);
  }

  public static conflict<T>(message?: string, result?: T) {
    return this.error(HttpStatusCode.CONFLICT, message, result);
  }

  public static unprocessableEntity<T>(message?: string, result?: T) {
    return this.error(HttpStatusCode.UNPROCESSABLE_ENTITY, message, result);
  }

  public static tooManyRequests<T>(message?: string, result?: T) {
    return this.error(HttpStatusCode.TOO_MANY_REQUESTS, message, result);
  }

  public static internalServerError<T>(message?: string, result?: T) {
    return this.error(HttpStatusCode.INTERNAL_SERVER_ERROR, message, result);
  }

  public static serviceUnavailable<T>(message?: string, result?: T) {
    return this.error(HttpStatusCode.SERVICE_UNAVAILABLE, message, result);
  }
}
