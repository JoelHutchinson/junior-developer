from pydantic import BaseModel
from typing import Optional

class Source(BaseModel):
    id: str
    title: str
    source: str

class Data(BaseModel):
    category: str
    sources: list[Source]
    content: str

# Enriched models for API responses
class EnrichedSource(BaseModel):
    id: str
    title: str
    source: str
    favicon_url: str
    is_cited: bool

class EnrichedData(BaseModel):
    id: str
    category: str
    content: str
    sources: list[EnrichedSource]