/**
 * Document for RAG indexing: content + metadata for role-based filtering
 */
export interface RagDocumentMetadata {
  scope: 'admin' | 'mentor' | 'intern';
  mentorId?: string;
  internId?: string;
  type: string;
  entityId: string;
}

export interface RagDocument {
  content: string;
  metadata: RagDocumentMetadata;
}
