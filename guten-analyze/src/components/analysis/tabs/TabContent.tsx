import { TabContentProps } from "./types";
import { BookPreviewTab } from "./BookPreviewTab";
import { InteractionsTab } from "./interactions/InteractionsTab";
import { GraphTab } from "./GraphTab";
import CharactersTab from "./characters/CharactersTab";

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
