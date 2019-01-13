from cure.util.database import database
import random


class TokenObject:

    user_id = None
    token = 0

    def __init__(self, user_id, user_token):
        self.user_id = user_id
        self.token = user_token


class TokenManager:

    def __init__(self):
        self.token_cache = []

    def generate_token(self):
        """
        Generates a random token
        :return: a random 16-length integer for a token
        """
        random_range_start = 10 ^ 16
        random_range_end = (10 ^ 17) - 1
        token = random.randint(random_range_start, random_range_end)
        if self.get_user_for_token(token) is not None:
            return self.generate_token()
        return token

    def get_token_for_user(self, user_id):
        """
        Get the token for a user
        :param user_id: The user's ID, as a string.
        :return: The token for the user
        """
        for token in self.token_cache:
            if token.user_id == user_id:
                return token
        result = database.find_one("token", {
            "user_id": user_id
        })
        if result is not None:
            self.token_cache.append(TokenObject(result.get("user_id", ""), result.get("token", 0)))
        return result.get("token", 0)

    def get_user_for_token(self, token):
        """
        Get the user ID for a token
        :param token: The token to get the ID for
        :return: The user's ID
        """
        for cached_token in self.token_cache:
            if cached_token.token == token:
                return cached_token
        result = database.find_one("token", {
            "token": token
        })
        if result is not None:
            self.token_cache.append(TokenObject(result.get("user_id", ""), result.get("token", 0)))
        return result.get("user_id", None)

    def clear_token_cache(self):
        """
        Clears the token cache
        :return: Nothing
        """
        self.token_cache.clear()


token_manager = TokenManager()
