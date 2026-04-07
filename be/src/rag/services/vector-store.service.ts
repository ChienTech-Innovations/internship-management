import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { VectorStore } from '@langchain/core/vectorstores';
import { EmbeddingService } from './embedding.service';
import {
  RAG_COLLECTION_NAME,
  RAG_CHUNK_SIZE,
  RAG_CHUNK_OVERLAP,
  RAG_TOP_K,
} from '../rag.constants';
import type {
  RagDocument,
  RagDocumentMetadata,
} from '../interfaces/rag-document.interface';

/** Metadata as flat record for Chroma filter (string values) */
function toChromaMetadata(meta: RagDocumentMetadata): Record<string, string> {
  const out: Record<string, string> = {
    scope: meta.scope,
    type: meta.type,
    entityId: meta.entityId,
  };
  if (meta.mentorId) out.mentorId = meta.mentorId;
  if (meta.internId) out.internId = meta.internId;
  return out;
}

@Injectable()
export class VectorStoreService {
  private readonly logger = new Logger(VectorStoreService.name);
  private vectorStore: VectorStore | null = null;
  private readonly chromaUrl: string | null;
  private readonly collectionName = RAG_COLLECTION_NAME;
  private readonly textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: RAG_CHUNK_SIZE,
    chunkOverlap: RAG_CHUNK_OVERLAP,
    separators: ['\n\n', '\n', '. ', ' ', ''],
  });

  constructor(
    private configService: ConfigService,
    private embeddingService: EmbeddingService,
  ) {
    const url = this.configService.get<string>('CHROMA_URL');
    const host = this.configService.get<string>('CHROMA_HOST');
    this.chromaUrl =
      url ||
      (host
        ? `http://${host}:${this.configService.get('CHROMA_PORT') || 8000}`
        : null);
  }

  /**
   * Get or create vector store. Uses Chroma if CHROMA_URL/CHROMA_HOST set, else InMemory (dev).
   */
  private getVectorStore(): VectorStore | null {
    const embeddings = this.embeddingService.getEmbeddings();
    if (!embeddings) {
      this.logger.warn(
        'Embeddings not configured; RAG retrieval will be empty.',
      );
      return null;
    }

    if (this.vectorStore) return this.vectorStore;

    if (this.chromaUrl) {
      try {
        this.vectorStore = new Chroma(embeddings, {
          url: this.chromaUrl,
          collectionName: this.collectionName,
        });
        this.logger.log(`Chroma vector store connected: ${this.chromaUrl}`);
      } catch (e) {
        this.logger.warn('Chroma connection failed, using in-memory store', e);
        this.vectorStore = new MemoryVectorStore(embeddings);
      }
    } else {
      this.logger.log(
        'CHROMA_URL not set; using in-memory vector store (dev).',
      );
      this.vectorStore = new MemoryVectorStore(embeddings);
    }
    return this.vectorStore;
  }

  /**
   * Clear in-memory store (for full reindex). Chroma: delete collection manually or restart Chroma.
   */
  clearStore(): void {
    this.vectorStore = null;
    this.logger.log('Vector store cleared (in-memory).');
  }

  /**
   * Chunk RagDocuments and convert to LangChain Document with metadata
   */
  private async chunkDocuments(documents: RagDocument[]): Promise<Document[]> {
    const langchainDocs: Document[] = [];
    for (const doc of documents) {
      const chunks = await this.textSplitter.splitText(doc.content);
      const meta = toChromaMetadata(doc.metadata);
      for (const text of chunks) {
        langchainDocs.push(new Document({ pageContent: text, metadata: meta }));
      }
    }
    return langchainDocs;
  }

  /**
   * Add documents to vector store (chunk -> embed -> add). Replaces collection if Chroma; appends if InMemory.
   */
  async addDocuments(documents: RagDocument[]): Promise<void> {
    if (documents.length === 0) return;
    const embeddings = this.embeddingService.getEmbeddings();
    if (!embeddings) return;

    const chunked = await this.chunkDocuments(documents);
    const store = this.getVectorStore();
    if (!store) return;

    if (this.vectorStore instanceof Chroma) {
      await this.vectorStore.addDocuments(chunked);
    } else {
      await (this.vectorStore as MemoryVectorStore).addDocuments(chunked);
    }
    this.logger.log(
      `Added ${chunked.length} chunks from ${documents.length} documents`,
    );
  }

  /**
   * Replace entire collection: clear then add. InMemory: reset and add. Chroma: add to existing (run clear manually for full reindex).
   */
  async replaceCollection(documents: RagDocument[]): Promise<void> {
    const embeddings = this.embeddingService.getEmbeddings();
    if (!embeddings) return;

    if (!this.chromaUrl) {
      this.clearStore();
    }
    await this.addDocuments(documents);
  }

  /**
   * Similarity search with role-based filter. Returns top-k chunks.
   */
  async similaritySearch(
    query: string,
    k: number = RAG_TOP_K,
    filter: { scope: string; mentorId?: string; internId?: string },
  ): Promise<Document[]> {
    const store = this.getVectorStore();
    if (!store) return [];

    const where: Record<string, string> = { scope: filter.scope };
    if (filter.mentorId) where.mentorId = filter.mentorId;
    if (filter.internId) where.internId = filter.internId;

    try {
      let results: Document[];
      if (store instanceof Chroma) {
        results = await store.similaritySearch(query, k, where);
      } else {
        const filterFn = (doc: Document) => {
          const m = doc.metadata as Record<string, string>;
          if (m?.scope !== filter.scope) return false;
          if (filter.mentorId && m?.mentorId !== filter.mentorId) return false;
          if (filter.internId && m?.internId !== filter.internId) return false;
          return true;
        };
        results = await (store as MemoryVectorStore).similaritySearch(
          query,
          k,
          filterFn,
        );
      }
      return results.slice(0, k);
    } catch (e) {
      this.logger.error('Similarity search failed', e);
      return [];
    }
  }
}
