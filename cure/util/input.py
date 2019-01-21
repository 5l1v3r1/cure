from cure.types.exception import InvalidJsonError
import json

def parse_json(user_input):
    parsed_data = None

    try:
        parsed_data = json.loads(user_input)
    except ValueError:
        raise InvalidJsonError()
    except TypeError:
        raise InvalidJsonError()
    
    if parsed_data is None:
        raise InvalidJsonError()
    
    return parsed_data