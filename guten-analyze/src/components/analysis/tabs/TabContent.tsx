import { TabContentProps } from "./types";
import { BookPreviewTab } from "./BookPreviewTab";
import { CharactersTab } from "./CharactersTab";
import { InteractionsTab } from "./InteractionsTab";
import { GraphTab } from "./GraphTab";

export function TabContent({
  text,
  characters,
  interactions,
  activeTab,
}: TabContentProps) {
  return (
    <div className="p-6">
      {activeTab === "book" && <BookPreviewTab text={text} />}

      {activeTab === "characters" && <CharactersTab characters={characters} />}

      {activeTab === "interactions" && (
        <InteractionsTab interactions={interactions} />
      )}

      {activeTab === "graph" && (
        <GraphTab characters={characters} interactions={interactions} />
      )}
    </div>
  );
}
