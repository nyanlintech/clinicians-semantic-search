from pydantic_settings import BaseSettings, SettingsConfigDict # type: ignore
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Therapist Semantic Search"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database - all values will be loaded from .env
    DB_HOST: str
    DB_PORT: str
    DB_USER: str
    DB_PASS: str
    DB_NAME: str

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        env_prefix="",  # No prefix for environment variables
    )

settings = Settings()
