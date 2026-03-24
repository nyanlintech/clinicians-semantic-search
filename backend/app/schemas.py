from pydantic import BaseModel
from typing import List, Optional


class TherapistBase(BaseModel):
    name: str
    full_name: Optional[str]
    pronouns: Optional[str]
    title: Optional[str]
    credentials: Optional[str]
    status: Optional[str]
    intro: Optional[str]
    ideal_client: Optional[str]
    approach_summary: Optional[str]
    specialties_summary: Optional[str]
    rate_min: Optional[str]
    rate_max: Optional[str]
    free_consultation: Optional[bool]
    practicing_since: Optional[str]
    languages: Optional[str]
    services: Optional[List[str]]
    insurance: Optional[List[str]]
    specialities: Optional[dict]
    other_techniques: Optional[List[str]]
    other_issues: Optional[List[str]]
    url: Optional[str]
    image: Optional[str]
    telehealth: Optional[bool]
    in_person: Optional[bool]


class TherapistCreate(TherapistBase):
    embedding: Optional[List[float]]


class TherapistOut(TherapistBase):
    id: int
    embedding: Optional[List[float]]

    class Config:
        orm_mode = True
