from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class DocumentBase(BaseModel):
    file_name: str = Field(..., description="Original name of the uploaded PDF file")
    source: Optional[str] = Field(None, description="Metadata source or brand name of the drug")
    version: Optional[str] = Field("1.0", description="Version identifier of the drug label")

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    document_id: str = Field(..., description="Unique ID of the document")
    storage_key: str = Field(..., description="S3/R2 storage key path")
    status: str = Field(..., description="Ingestion status: uploaded, processing, completed, failed, inactive")
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DocumentUploadResponse(BaseModel):
    document: DocumentResponse
    message: str = Field("Document uploaded successfully. Processing started.", description="Status message")

class DocumentProcessResponse(BaseModel):
    document_id: str
    job_id: str
    stage: str
    status: str
    message: str
