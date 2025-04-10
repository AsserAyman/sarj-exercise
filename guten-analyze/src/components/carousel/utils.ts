export function getBookTitle(id: string): string {
  const titles: Record<string, string> = {
    "1342": "Pride and Prejudice",
    "64317": "The Great Gatsby",
    "2701": "Moby Dick",
    "11": "Alice's Adventures in Wonderland",
    "2600": "War and Peace",
    "1661": "The Adventures of Sherlock Holmes",
    "84": "Frankenstein",
    "1787": "Hamlet",
  };
  return titles[id] || `Book #${id}`;
}

export function getBookCoverUrl(id: string): string {
  return `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.medium.jpg`;
}

export function generateBookDetails(bookIds: string[]) {
  return bookIds.map((id) => ({
    id,
    coverUrl: getBookCoverUrl(id),
    title: getBookTitle(id),
  }));
}
