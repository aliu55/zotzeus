import json
from marshmallow import ValidationError
from bson.objectid import ObjectId
from db import mongo


class MongoEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


def mongo_id_decoder(obj):
    # Try to convert str to Mongo Object ID
    try:
        return ObjectId(obj)
    except Exception:
        raise ValidationError("Invalid User Id Format", "_id")


def validate_club_id(club_id):
    club = mongo.db.club.find_one({"_id": ObjectId(club_id)})
    if not club:
        raise ValidationError("Club Id Not Found", "_id")

def validate_club_info_id(club_info_id):
    club_info = mongo.db.club_info.find_one({"_id": ObjectId(club_info_id)})
    if not club_info:
        raise ValidationError("Club Info Id Not Found", "_id")
