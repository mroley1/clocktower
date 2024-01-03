from fastapi import APIRouter, Body, Request, Response, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import List

from models import Script

router = APIRouter()

@router.get("/", response_description="List all scripts")
def list_scripts(request: Request):
    pipeline = [
        {
            "$group": {
                "_id": {
                    "$concat": [
                        "$meta.author",
                        "$meta.name"
                    ]
                },
                "author": {
                    "$first": "$meta.author"
                },
                "name": {
                    "$first": "$meta.name"
                },
                "difficulty": {
                    "$first": "$meta.difficulty"
                },
                "description": {
                    "$first": "$meta.description"
                },
                "scripts": {
                    "$push": "$$ROOT",
                }
            }
        },
        {
            "$project": {
                "_id": 0,
                "scripts._id": 0
            }
        }
    ]
    scripts = list(request.app.database["scripts"].aggregate(pipeline))
    return scripts

# @router.get("/{id}", response_description="List a single role /{id}", response_model=Script)
# def list_role(id: str, request: Request):
#     if (role := request.app.database["roles"].find_one({"id": id})) is not None:
#         return role
#     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Role with ID {id} not found")
