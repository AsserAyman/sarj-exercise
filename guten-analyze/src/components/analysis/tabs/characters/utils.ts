export function getCardClasses(importance: string) {
  switch (importance) {
    case "main":
      return "border-green-800 bg-green-900/20";
    case "secondary":
      return "border-blue-800 bg-blue-900/20";
    default:
      return "border-gray-700 bg-gray-800/50";
  }
}

export function getImportanceBadgeClasses(importance: string) {
  switch (importance) {
    case "main":
      return "bg-green-900 text-green-300";
    case "secondary":
      return "bg-blue-900 text-blue-300";
    default:
      return "bg-gray-800 text-gray-300";
  }
}
