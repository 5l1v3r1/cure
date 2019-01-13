import json
import flask
import cure.types.exception as errors


def parse_json(func):
    def decorator():
        result = func()
        if type(result) == dict:
            result = json.dumps(result)
        response = flask.Response(result)
        response.headers["Content-Type"] = "application/json"
        return response
    return decorator


def catch_user_error(func):
    def decorator():
        try:
            return func()
        except errors.UserError as user_error:
            response = flask.Response(json.dumps({
                "error": {
                    "identifier": user_error.identifier,
                    "code": user_error.code,
                    "friendly_name": user_error.friendly_name
                }
            }))
            # return 400 bad request
            response.status_code = 400
            return response
    return decorator
