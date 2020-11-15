from flask import json
from flask_restful import Resource
from marshmallow import Schema, fields
from webargs.flaskparser import use_args
from db import mongo
from util import mongo_id_decoder, validate_club_info_id

class GetSchema(Schema):
    _id = fields.Function(deserialize=mongo_id_decoder)
    clubName = fields.Str()
    title = fields.Str()
    link = fields.Str()

class PostSchema(Schema):
    clubName = fields.Str(required = True)
    title = fields.Str(required = True)
    link = fields.Str(required = True)

class PutQuerySchema(Schema):
    _id = fields.Function(
        deserialize=mongo_id_decoder, validate=validate_club_info_id, required=True
    )

class PutBodySchema(Schema):
    clubName = fields.Str(required = True)
    title = fields.Str(required = True)
    link = fields.Str(required = True)


class DeleteSchema(Schema):
    _id = fields.Function(
        deserialize=mongo_id_decoder, validate=validate_club_info_id, required=True
    )

class ClubInfo(Resource):
    @use_args(GetSchema(), location="querystring")
    def get(self, query):
        # Search for all users that match query arguments
        clubInfo = [clubInfo for clubInfo in mongo.db.club_info.find(query)]
        return json.jsonify(data=clubInfo)

    @use_args(PostSchema(), location="json")
    def post(self, body):
        # Create user with data from request
        mongo.db.club_info.insert_one(body)
        return json.jsonify(data=body)

    @use_args(PutQuerySchema(), location="querystring")
    @use_args(PutBodySchema(), location="json")
    def put(self, query, body):
        club_info_id = query.get("_id")
        # Update user with data from request
        mongo.db.club_info.update_one({"_id": club_info_id}, {"$set": body})
        updated_club_info = mongo.db.club_info.find_one({"_id": club_info_id})
        return json.jsonify(data=updated_club_info)

    @use_args(DeleteSchema(), location="querystring")
    def delete(self, query):
        club_info_id = query.get("_id")
        # Delete user based on _id
        mongo.db.club_info.delete_one({"_id": club_info_id})
        return {"message": "Club Info was deleted"}
