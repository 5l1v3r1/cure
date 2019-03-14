import bson

class DatabaseObject:
    """
    This class represents an object in a database.
    """

    @classmethod
    def from_dict(cls, dictionary):
        database_object = cls()
        for k, v in dictionary.items():
            if k == "_id" and hasattr(database_object, "mongodb_id"):
                setattr(database_object, "mongodb_id", v)
                continue
            if k.startswith("_"):
                continue
            if not hasattr(database_object, k):
                continue
            setattr(database_object, k, v)
        return database_object

    @classmethod
    def as_database_object(cls, instance):
        values = {}
        for k, v in vars(instance).items():
            if k.startswith("_"):
                continue
            if k == "mongodb_id":
                k = "_id"
            values[k] = v
        return values
