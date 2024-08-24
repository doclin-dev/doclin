from fastapi import FastAPI, HTTPException
from dtos.EmbeddingDTO import EmbeddingDTO
from embedding import generate_embedding

app = FastAPI()

@app.get("/")
def index():
	return {"details": "Hello, world"}

@app.post("/generate_embedding")
def generate_embedding_route(request: EmbeddingDTO):
	try:
		embedding = generate_embedding(request.text)
		return {"embedding": embedding}
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))