export type ClipcaseConfig = { storageDir: string };
export type CaseMetadata = { name: string; title: string; createdAt: string; updatedAt: string; entries: EntryMetadata[] };
export type EntryMetadata = { id: string; caseName: string; createdAt: string; source: string; tags: string[]; hash: string; bytes: number; path: string };
export type AddEntryInput = { caseName: string; text: string; source?: string; tags?: string[]; allowSecret?: boolean; now?: Date };
export type SecretFinding = { label: string; pattern: string };
