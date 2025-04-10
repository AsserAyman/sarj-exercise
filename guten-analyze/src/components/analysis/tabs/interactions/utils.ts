export const getRelationshipBadgeClasses = (nature: string) => {
  const natureLower = nature.toLowerCase();

  if (natureLower === "allies" || natureLower === "friends") {
    return "bg-green-900 text-green-300";
  } else if (natureLower === "enemies" || natureLower === "rivals") {
    return "bg-red-900 text-red-300";
  } else if (natureLower === "family") {
    return "bg-blue-900 text-blue-300";
  } else if (natureLower === "romantic") {
    return "bg-pink-500 text-pink-100";
  } else {
    return "bg-gray-400 text-gray-900";
  }
};

export const getSignificanceBadgeClasses = (significance: number) => {
  if (significance >= 8) {
    return "bg-red-900 text-red-300";
  } else if (significance >= 5) {
    return "bg-yellow-900 text-yellow-300";
  } else {
    return "bg-blue-900 text-blue-300";
  }
};
