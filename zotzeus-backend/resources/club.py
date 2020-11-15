from flask import json
from flask_restful import Resource
from marshmallow import Schema, fields
from webargs.flaskparser import use_args
from db import mongo
from util import mongo_id_decoder, validate_club_id

class GetSchema(Schema):
    _id = fields.Function(deserialize=mongo_id_decoder)
    clubName = fields.Str()
    email = fields.Email()
    meetingTime = fields.Str()

class PostSchema(Schema):
    clubName = fields.Str(required=True)
    email = fields.Email(required=True)
    meetingTime = fields.Str(required=True)

class PutQuerySchema(Schema):
    _id = fields.Function(
        deserialize=mongo_id_decoder, validate=validate_club_id, required=True
    )

class PutBodySchema(Schema):
    clubName = fields.Str(required=True)
    email = fields.Email(required=True)
    meetingTime = fields.Str(required=True)

class DeleteSchema(Schema):
    _id = fields.Function(
        deserialize=mongo_id_decoder, validate=validate_club_id, required=True
    )

class Club(Resource):
    @use_args(GetSchema(), location="querystring")
    def get(self, query):
        # Search for all users that match query arguments
        clubs = [club for club in mongo.db.club.find(query)]
        return json.jsonify(data=clubs)

    @use_args(PostSchema(), location="json")
    def post(self, body):
        # Create user with data from request
        mongo.db.club.insert_one(body)
        return json.jsonify(data=body)

    @use_args(PutQuerySchema(), location="querystring")
    @use_args(PutBodySchema(), location="json")
    def put(self, query, body):
        club_id = query.get("_id")
        # Update user with data from request
        mongo.db.club.update_one({"_id": club_id}, {"$set": body})
        updated_club = mongo.db.club.find_one({"_id": club_id})
        return json.jsonify(data=updated_club)

    @use_args(DeleteSchema(), location="querystring")
    def delete(self, query):
        club_id = query.get("_id")
        # Delete user based on _id
        mongo.db.club.delete_one({"_id": club_id})
        return {"message": "Club was deleted"}
