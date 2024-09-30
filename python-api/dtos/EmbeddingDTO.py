from pydantic import BaseModel

class EmbeddingDTO(BaseModel):
    text: str