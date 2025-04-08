export interface BookMetadata {
  id: string;
  title: string;
  author: string;
  url: string;
}

export interface BookData {
  metadata: BookMetadata | null;
  text: string | null;
}
