from fastapi import APIRouter, Body, Request, Response, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import List

from models import Role

router = APIRouter()

@router.get("/", response_description="List all roles")
def list_roles(request: Request):
    roles = []
    collection = request.app.database["roles"].find({}, {"id": 1, "_id": 0})
    for entry in collection:
        roles.append(entry["id"])
    return roles

@router.get("/{id}", response_description="List a single role /{id}", response_model=Role)
def list_role(id: str, request: Request):
    if (role := request.app.database["roles"].find_one({"id": id})) is not None:
        return role
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Role with ID {id} not found")