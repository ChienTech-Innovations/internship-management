import { Injectable, Logger } from '@nestjs/common';
import { DocumentExtractorService } from './document-extractor.service';
import { VectorStoreService } from './vector-store.service';

@Injectable()
export class IndexingService {
  private readonly logger = new Logger(IndexingService.name);

  constructor(
    private documentExtractor: DocumentExtractorService,
    private vectorStore: VectorStoreService,
  ) {}

  /**
   * Full reindex: extract docs for admin + all mentors + all interns, clear store, then add all.
   */
  async reindexAll(): Promise<{ documentsCount: number; message: string }> {
    this.vectorStore.clearStore();

    const [adminDocs, mentorIds, internIds] = await Promise.all([
      this.documentExtractor.extractForAdmin(),
      this.documentExtractor.getAllMentorIds(),
      this.documentExtractor.getAllInternIds(),
    ]);

    let total = 0;
    await this.vectorStore.addDocuments(adminDocs);
    total += adminDocs.length;

    for (const mentorId of mentorIds) {
      const docs = await this.documentExtractor.extractForMentor(mentorId);
      await this.vectorStore.addDocuments(docs);
      total += docs.length;
    }

    for (const internId of internIds) {
      const docs = await this.documentExtractor.extractForIntern(internId);
      await this.vectorStore.addDocuments(docs);
      total += docs.length;
    }

    this.logger.log(`RAG reindex completed: ${total} documents.`);
    return {
      documentsCount: total,
      message: `Đã index ${total} document (admin + ${mentorIds.length} mentor + ${internIds.length} intern).`,
    };
  }
}
