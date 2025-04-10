export function getCardClasses(importance: string) {
  switch (importance) {
    case "main":
      return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20";
    case "secondary":
      return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20";
    default:
      return "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50";
  }
}

export function getImportanceBadgeClasses(importance: string) {
  switch (importance) {
    case "main":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "secondary":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
}
