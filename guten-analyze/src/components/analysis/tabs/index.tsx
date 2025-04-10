import React, { useState } from "react";
import { BookTabsProps, TabType } from "./types";
import { TabButton } from "./TabButton";
import { TabContent } from "./TabContent";
import { BookIcon, CharactersIcon, InteractionsIcon, GraphIcon } from "./icons";

export function BookTabs({ text, characters, interactions }: BookTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("book");

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex flex-wrap">
          <TabButton
            isActive={activeTab === "book"}
            onClick={() => setActiveTab("book")}
            icon={BookIcon}
            label="Book Preview"
          />
          <TabButton
            isActive={activeTab === "characters"}
            onClick={() => setActiveTab("characters")}
            disabled={characters.length === 0}
            icon={CharactersIcon}
            label="Characters"
          />
          <TabButton
            isActive={activeTab === "interactions"}
            onClick={() => setActiveTab("interactions")}
            disabled={interactions.length === 0}
            icon={InteractionsIcon}
            label="Interactions"
          />
          <TabButton
            isActive={activeTab === "graph"}
            onClick={() => setActiveTab("graph")}
            disabled={interactions.length === 0}
            icon={GraphIcon}
            label="Relationship Graph"
          />
        </nav>
      </div>

      <TabContent
        text={text}
        characters={characters}
        interactions={interactions}
        activeTab={activeTab}
      />
    </div>
  );
}
