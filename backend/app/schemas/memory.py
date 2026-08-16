from datetime import datetime
from pydantic import BaseModel


class MemoryBase(BaseModel):
    content: str


class MemoryCreate(MemoryBase):
    pass


class MemoryResponse(MemoryBase):
    memory_id: str
    user_id: str
    created_at: datetime | None = None
    updated_at: datetime | None = None
    citations: list[dict] | None = None
    is_default: bool = False

    class Config:
        from_attributes = True


class MemoryToggle(BaseModel):
    memory_enabled: bool
