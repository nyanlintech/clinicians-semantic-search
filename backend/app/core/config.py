import json

from pydantic_settings import BaseSettings, SettingsConfigDict # type: ignore
from pydantic import field_validator
from typing import List, Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "Therapist Semantic Search"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    ENVIRONMENT: str = "local"
    DATABASE_URL: Optional[str] = None
    SEARCH_MODEL_NAME: str = "all-MiniLM-L6-v2"
    PRELOAD_SEARCH_MODEL: bool = False

    # Comma-separated list of allowed CORS origins, e.g.:
    # ALLOWED_ORIGINS=https://example.com,https://www.example.com
    ALLOWED_ORIGINS: str | List[str] = ["http://localhost:5173"]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v: object) -> object:
        if isinstance(v, str):
            value = v.strip()
            if value.startswith("["):
                try:
                    parsed = json.loads(value)
                except json.JSONDecodeError:
                    pass
                else:
                    if isinstance(parsed, list):
                        return [str(origin).strip() for origin in parsed if str(origin).strip()]
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return v

    # Local DB — required when ENVIRONMENT=local
    LOCAL_DB_HOST: Optional[str] = None
    LOCAL_DB_PORT: Optional[str] = None
    LOCAL_DB_USER: Optional[str] = None
    LOCAL_DB_PASS: Optional[str] = None
    LOCAL_DB_NAME: Optional[str] = None

    # Production DB — required when ENVIRONMENT=production
    PROD_DB_HOST: Optional[str] = None
    PROD_DB_PORT: Optional[str] = None
    PROD_DB_USER: Optional[str] = None
    PROD_DB_PASS: Optional[str] = None
    PROD_DB_NAME: Optional[str] = None

    @property
    def resolved_database_url(self) -> str:
        if self.DATABASE_URL:
            if self.DATABASE_URL.startswith("postgres://"):
                return self.DATABASE_URL.replace(
                    "postgres://",
                    "postgresql+psycopg://",
                    1,
                )
            if self.DATABASE_URL.startswith("postgresql://"):
                return self.DATABASE_URL.replace(
                    "postgresql://",
                    "postgresql+psycopg://",
                    1,
                )
            return self.DATABASE_URL

        if self.ENVIRONMENT == "production":
            missing = [k for k, v in {
                "PROD_DB_HOST": self.PROD_DB_HOST,
                "PROD_DB_PORT": self.PROD_DB_PORT,
                "PROD_DB_USER": self.PROD_DB_USER,
                "PROD_DB_PASS": self.PROD_DB_PASS,
                "PROD_DB_NAME": self.PROD_DB_NAME,
            }.items() if v is None]
            if missing:
                raise ValueError(f"Missing production DB settings: {', '.join(missing)}")
            return f"postgresql+psycopg://{self.PROD_DB_USER}:{self.PROD_DB_PASS}@{self.PROD_DB_HOST}:{self.PROD_DB_PORT}/{self.PROD_DB_NAME}"
        else:
            missing = [k for k, v in {
                "LOCAL_DB_HOST": self.LOCAL_DB_HOST,
                "LOCAL_DB_PORT": self.LOCAL_DB_PORT,
                "LOCAL_DB_USER": self.LOCAL_DB_USER,
                "LOCAL_DB_PASS": self.LOCAL_DB_PASS,
                "LOCAL_DB_NAME": self.LOCAL_DB_NAME,
            }.items() if v is None]
            if missing:
                raise ValueError(f"Missing local DB settings: {', '.join(missing)}")
            return f"postgresql+psycopg://{self.LOCAL_DB_USER}:{self.LOCAL_DB_PASS}@{self.LOCAL_DB_HOST}:{self.LOCAL_DB_PORT}/{self.LOCAL_DB_NAME}"

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        env_prefix="",
    )


settings = Settings()
