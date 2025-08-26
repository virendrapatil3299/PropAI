// Color mapping for grade badge
export function getGradeColor(grade?: string): string {
  switch (grade?.toUpperCase()) {
    case "A":
      return "bg-green-100 text-green-700"
    case "B":
      return "bg-yellow-100 text-yellow-700"
    case "C":
      return "bg-red-100 text-red-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

// Color mapping for recommended action badge
export function getActionColor(action?: string): string {
  switch (action?.toUpperCase()) {
    case "BUY":
      return "bg-green-100 text-green-700"
    case "SELL":
      return "bg-red-100 text-red-700"
    case "HOLD":
      return "bg-yellow-100 text-yellow-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}
