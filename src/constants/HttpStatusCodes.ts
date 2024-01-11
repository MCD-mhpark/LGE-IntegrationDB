/* eslint-disable max-len */
/**
 * This file was copied from here: https://gist.github.com/scokmen/f813c904ef79022e84ab2409574d1b45
 */

/**
 * Hypertext Transfer Protocol (HTTP) response status codes.
 * @see {@link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes}
 */
enum HttpStatusCodes {

    /**
     * The server has received the request headers and the client should proceed to send the request body
     * (in the case of a request for which a body needs to be sent; for example, a POST request).
     * Sending a large request body to a server after a request has been rejected for inappropriate headers would be inefficient.
     * To have a server check the request's headers, a client must send Expect: 100-continue as a header in its initial request
     * and receive a 100 Continue status code in response before sending the body. The response 417 Expectation Failed indicates the request should not be continued.
     */
    CONTINUE = 100,

    SWITCHING_PROTOCOLS = 101,

    PROCESSING = 102,

    OK = 200,

    CREATED = 201,

    ACCEPTED = 202,

    NON_AUTHORITATIVE_INFORMATION = 203,

    NO_CONTENT = 204,

    RESET_CONTENT = 205,

    PARTIAL_CONTENT = 206,

    MULTI_STATUS = 207,

    ALREADY_REPORTED = 208,

    IM_USED = 226,

    MULTIPLE_CHOICES = 300,

    MOVED_PERMANENTLY = 301,

    FOUND = 302,

    SEE_OTHER = 303,

    NOT_MODIFIED = 304,

    BAD_REQUEST = 400,

    UNAUTHORIZED = 401,

    PAYMENT_REQUIRED = 402,

    FORBIDDEN = 403,

    NOT_FOUND = 404,

    METHOD_NOT_ALLOWED = 405,

    NOT_ACCEPTABLE = 406,

    PROXY_AUTHENTICATION_REQUIRED = 407,

    REQUEST_TIMEOUT = 408,

    CONFLICT = 409,

    GONE = 410,

    LENGTH_REQUIRED = 411,

    PRECONDITION_FAILED = 412,

    PAYLOAD_TOO_LARGE = 413,

    URI_TOO_LONG = 414,

    UNSUPPORTED_MEDIA_TYPE = 415,

    RANGE_NOT_SATISFIABLE = 416,

    EXPECTATION_FAILED = 417,

    I_AM_A_TEAPOT = 418,

    MISDIRECTED_REQUEST = 421,

    UNPROCESSABLE_ENTITY = 422,

    LOCKED = 423,

    FAILED_DEPENDENCY = 424,

    UPGRADE_REQUIRED = 426,

    PRECONDITION_REQUIRED = 428,

    TOO_MANY_REQUESTS = 429,

    REQUEST_HEADER_FIELDS_TOO_LARGE = 431,

    UNAVAILABLE_FOR_LEGAL_REASONS = 451,

    INTERNAL_SERVER_ERROR = 500,

    NOT_IMPLEMENTED = 501,

    BAD_GATEWAY = 502,

    SERVICE_UNAVAILABLE = 503,

    GATEWAY_TIMEOUT = 504,

    HTTP_VERSION_NOT_SUPPORTED = 505,

    VARIANT_ALSO_NEGOTIATES = 506,

    INSUFFICIENT_STORAGE = 507,

    LOOP_DETECTED = 508,

    NOT_EXTENDED = 510,

    NETWORK_AUTHENTICATION_REQUIRED = 511
}

export default HttpStatusCodes;
