import uuid
from typing import Optional
from pydantic import BaseModel, Field

arbitrary_types_allowed=True

class Role(BaseModel):
    id: str = Field(...)
    name: str = Field(...)
    description: str = Field(...)
    alignment: str = Field(...)
    className: str = Field(..., alias="class")
    tokens: list = Field(...)
    first_night_desc: str = Field(...)
    other_night_desc: str = Field(...)
    change_makeup: list = Field(...)
    hide_token: bool = Field(...)
    hide_face: bool = Field(...)
    