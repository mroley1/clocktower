from fastapi import APIRouter, Body, Request, Response, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import List
import json

from models import Role

router = APIRouter()

@router.get("/list", response_description="List all roles")
def list_roles(request: Request):
    roles = []
    collection = request.app.database["roles"].find({}, {"id": 1, "_id": 0})
    for entry in collection:
        roles.append(entry["id"])
    return roles

@router.get("/single/{id}", response_description="List a single role role/single/{id}", response_model=Role)
def list_role(id: str, request: Request):
    if (role := request.app.database["roles"].find_one({"id": id})) is not None:
        return role
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Role with ID {id} not found")

@router.get("/multi/", response_description="retreive multiple roles from list role/multi/?roleList=[]")
def list_role(request: Request, roleList: str = "[]"):
    roleList = json.loads(roleList)
    rolesJson = []
    for role in roleList:
        rolesJson.append({"id": role})
    if (roles := list(request.app.database["roles"].find({"$or":rolesJson}, {"_id":0}))) is not None:
        return roles
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"error finding all roles")