/**
 * from 100 to 199 - Informational
 * from 200 to 299 - Sucess
 * from 300 to 399 - Redirection
 * from 400 to 499 - Client Error
 * from 500 to 599 - Server Error
 */

exports.HTTP_100_CONTINUE = 100;

exports.HTTP_200_OK = 200;
exports.HTTP_201_CREATED = 201;
exports.HTTP_204_NO_CONTENT = 204;
exports.HTTP_205_RESET_CONTENT = 205;
exports.HTTP_206_PARTIAL_CONTENT = 206;

exports.HTTP_307_TEMPORARY_REDIRECT = 307;
exports.HTTP_308_PERMANENT_REDIRECT = 308;

exports.HTTP_400_BAD_REQUEST = 400;
exports.HTTP_401_UNAUTHORIZED = 401;
exports.HTTP_403_FORBIDDEN = 403;
exports.HTTP_404_NOT_FOUND = 404;

exports.HTTP_500_INTERNAL_SERVER_ERROR = 500;
exports.HTTP_502_BAD_GATEWAY = 502;
