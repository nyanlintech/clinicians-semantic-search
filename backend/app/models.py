from typing import Any, Optional

from sqlalchemy import Boolean, Float, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Therapist(Base):
    __tablename__ = "therapists"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    pronouns: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    title: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    credentials: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    intro: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    ideal_client: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    approaches: Mapped[Optional[list[Any]]] = mapped_column(ARRAY(JSONB), nullable=True)
    rate_min: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    rate_max: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    free_consultation: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    practicing_since: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    languages: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    services: Mapped[Optional[list[str]]] = mapped_column(ARRAY(String), nullable=True)
    insurance: Mapped[Optional[list[str]]] = mapped_column(ARRAY(String), nullable=True)
    specialities: Mapped[Optional[list[Any]]] = mapped_column(ARRAY(JSONB), nullable=True)
    other_techniques: Mapped[Optional[list[str]]] = mapped_column(ARRAY(String), nullable=True)
    other_issues: Mapped[Optional[list[str]]] = mapped_column(ARRAY(String), nullable=True)
    url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    image: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    telehealth: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    in_person: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    embedding: Mapped[Optional[list[float]]] = mapped_column(ARRAY(Float), nullable=True)
