from datetime import datetime
from pydantic import BaseModel, ConfigDict


class DocumentResponse(BaseModel):
    document_id: str
    file_name: str
    storage_key: str
    source: str | None = None
    version: str | None = None
    status: str | None = None
    created_at: datetime | None = None
    is_active: bool = True

    model_config = ConfigDict(from_attributes=True)


class DocumentUploadResponse(BaseModel):
    document: DocumentResponse
    message: str


class DocumentProcessResponse(BaseModel):
    document_id: str
    job_id: str
    stage: str
    status: str
    message: str