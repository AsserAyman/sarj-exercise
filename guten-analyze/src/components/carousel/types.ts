export interface BookCarouselProps {
  bookIds: string[];
  onSelectBook: (bookId: string) => void;
}

export interface BookDetails {
  id: string;
  coverUrl: string;
  title?: string;
}

export interface BookCardProps {
  book: BookDetails;
  isActive: boolean;
  position: number;
  distanceFromActive: number;
  zIndex: number;
  scale: number;
  opacity: number;
  rotation: number;
  onClick: () => void;
}

export interface CarouselControlsProps {
  currentIndex: number;
  totalItems: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}
