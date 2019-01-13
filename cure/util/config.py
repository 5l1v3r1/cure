"""
This utility reads a JSON configuration file.
"""
import json


class ConfigurationManager:

    def __init__(self):
        self.cached_config = None

    def read_config(self):
        """
        Reads the configuration file. If none is specified, it creates one.
        :return: A dictionary containing the config. If an error occurs or a configuration isn't set, returns nothing.
        """

        if self.cached_config is not None:
            return self.cached_config
        try:
            with open("config.json") as config:
                try:
                    parsed_config = json.loads(config)
                    self.cached_config = parsed_config
                    return self.cached_config
                except json.JSONDecodeError as ex:
                    print("[Configuration] [ERROR] invalid json in config file, cannot read.")
                    print("[Configuration] [ERROR] error information: {info}".format(info=ex.msg))
                    return dict()
        except Exception as ex:
            print("[Configuration] [ERROR] an error occurred while reading your config file. please make sure it is "
                  "accessible by the program and there are no other issues with the file.")
            print("[Configuration] [ERROR] exception info: {exception}".format(exception=str(ex)))
            return dict()


config = ConfigurationManager()
