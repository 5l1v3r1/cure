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
        print("database initalized.")
        database_config = Database()
        configuration = config.read_config()
        # Loads the configuration
        database_config.database_name = configuration.get("database_name", "cure")
        database_config.host = configuration.get("database_host", "127.0.0.1")
        database_config.port = configuration.get("database_port", 27017)
        database_config.username = configuration.get("database_username", "cure")
        database_config.password = configuration.get("database_password", "password")
        self.database = database_config
        try:
            self.client = pymongo.MongoClient(
                self.database.host,
                self.database.port,
                username=self.database.username,
                password=self.database.password,
                serverSelectionTimeoutMS=100
            )
            self.client.server_info()
        except pymongo.errors.ServerSelectionTimeoutError:
            print("[Database] [ERROR] Connection timeout while connecting to database - all further operation is unsupported")
        self.cure_database = self.client.get_database(self.database.database_name)

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
    
    def insert_one(self, collection, data):
        """
        Insert an object into the database.
        :param collection: (str) collection name
        :param data: (dict) data to be inserted into the database
        :return: (tuple: bool/ObjectId) True on sucess / the inserted object's ID
        """
        mongo_collection = self.cure_database.get_collection(collection)
        result = mongo_collection.insert_one(data)
        return (result.acknowledged, result.inserted_id)
    
    def delete(self, collection, object_filter):
        """
        Delete an object from the database
        :param collection: (str) collection name
        :param object_filter: (dict) requirements for object to be deleted (supports mongodb operators)
        """
        mongo_collection = self.cure_database.get_collection(collection)
        mongo_collection.delete_many(object_filter)

database = DatabaseManager()