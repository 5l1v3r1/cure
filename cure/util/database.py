"""
This file contains the database manager. It does require a little explanation...

self.database is the Database object (not the actual database)
self.cure_database is the actual pymongo database
self.client is the MongoClient
"""
from cure.util.config import config
import pymongo


class Database:

    username = "cure"
    password = "password"
    host = "127.0.0.1"
    port = 27017
    database_name = "cure"


class DatabaseManager:

    def __init__(self):
        database = Database()
        configuration = config.read_config()
        # Loads the configuration
        database.database_name = configuration.get("database_name", "cure")
        database.host = configuration.get("database_host", "127.0.0.1")
        database.port = configuration.get("database_port", 27017)
        database.username = configuration.get("database_username", "cure")
        database.password = configuration.get("database_password", "password")
        self.database = database
        print("[Database] [INFO] Connecting to database...")
        self.client = pymongo.MongoClient(
            self.database.host,
            self.database.port,
            username=self.database.username,
            password=self.database.password
        )
        self.cure_database = self.client.get_database(self.database.database_name)
        print("[Database] [INFO] Connected to database!")

    def find(self, collection, parameters):
        """
        Find multiple results in the database
        :param collection: (str) collection name
        :param parameters: (dict) search parameters [note: mongodb operators ($lt, $gt, etc.) are allowed]
        :return: An array of results.
        """
        mongo_collection = self.cure_database.get_collection(collection)
        results = mongo_collection.find(parameters)
        return results

    def find_one(self, collection, parameters):
        """
        Find one result in the database
        :param collection: (str) collection name
        :param parameters: (dict) search filter parameters [note: mongodb operators are allowed]
        :return: An array of results.
        """
        mongo_collection = self.cure_database.get_collection(collection)
        result = mongo_collection.find_one(parameters)
        return result

database = DatabaseManager()
