import uuid
from typing import Optional
from pydantic import BaseModel, Field

arbitrary_types_allowed=True

class Role(BaseModel):
    id: str = Field(...)
    name: str = Field(...)
    description: str = Field(...)
    alignment: str = Field(...)
    type: str = Field(...)
    firstNight: str = Field(...)
    otherNight: str = Field(...)
    changeMakeup: list = Field(...)
    secret: bool = Field(...)
    actions: list = Field(...)
    hardMad: bool = Field(...)
    getsBluffs: bool = Field(...)
    reminders: list = Field(...)
    