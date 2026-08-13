from sentence_transformers import SentenceTransformer


class EmbeddingService:

    def __init__(self):
        self.model = SentenceTransformer("BAAI/bge-m3")

    def create_embedding(self, text: str):
        embedding = self.model.encode(
            text,
            normalize_embeddings=True
        )

        return embedding.tolist()

    def create_embeddings(self, texts):
        embeddings = self.model.encode(
            texts,
            normalize_embeddings=True
        )

        return embeddings.tolist()


embedding_service = EmbeddingService()