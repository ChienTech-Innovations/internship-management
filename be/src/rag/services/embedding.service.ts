import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Embeddings } from '@langchain/core/embeddings';

@Injectable()
export class EmbeddingService {
  private readonly embeddings: Embeddings | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      const model =
        this.configService.get<string>('OPENAI_EMBEDDING_MODEL') ||
        'text-embedding-3-small';
      this.embeddings = new OpenAIEmbeddings({
        openAIApiKey: apiKey,
        modelName: model,
      });
    }
  }

  getEmbeddings(): Embeddings | null {
    return this.embeddings;
  }

  isConfigured(): boolean {
    return this.embeddings !== null;
  }
}
