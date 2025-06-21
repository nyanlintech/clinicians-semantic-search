from pydantic_settings import BaseSettings, SettingsConfigDict # type: ignore
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Therapist Semantic Search"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    LOCAL_DB_HOST: str
    LOCAL_DB_PORT: str
    LOCAL_DB_USER: str
    LOCAL_DB_PASS: str
    LOCAL_DB_NAME: str

    PROD_DB_HOST: str
    PROD_DB_PORT: str
    PROD_DB_USER: str
    PROD_DB_PASS: str
    PROD_DB_NAME: str

    @property
    def DATABASE_URL(self) -> str:
        if self.ENVIRONMENT == "production":
            return f"postgresql://{self.PROD_DB_USER}:{self.PROD_DB_PASS}@{self.PROD_DB_HOST}:{self.PROD_DB_PORT}/{self.PROD_DB_NAME}"
        else:
            return f"postgresql://{self.LOCAL_DB_USER}:{self.LOCAL_DB_PASS}@{self.LOCAL_DB_HOST}:{self.LOCAL_DB_PORT}/{self.LOCAL_DB_NAME}"

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        env_prefix="",
    )

settings = Settings()
