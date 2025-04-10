// Helper function to get the color for the relationship badge
export const getRelationshipBadgeClasses = (nature: string) => {
  const natureLower = nature.toLowerCase();

  if (natureLower === "allies" || natureLower === "friends") {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  } else if (natureLower === "enemies" || natureLower === "rivals") {
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  } else if (natureLower === "family") {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  } else if (natureLower === "romantic") {
    return "bg-pink-100 text-pink-800 dark:bg-pink-500 dark:text-pink-100";
  } else {
    return "bg-gray-100 text-gray-800 dark:bg-gray-400 dark:text-gray-900";
  }
};

// Function to get significance badge color
export const getSignificanceBadgeClasses = (significance: number) => {
  if (significance >= 8) {
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  } else if (significance >= 5) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  } else {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  }
};
