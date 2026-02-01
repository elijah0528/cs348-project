/**
 * Finds all unique triplets in the array that sum to the target.
 *
 * @param nums - Array of integers to search.
 * @param target - Target sum to match (defaults to 0).
 * @returns Array of triplets [a, b, c] where a + b + c === target.
 */
export function threeSum(nums: number[], target: number = 0): [number, number, number][] {
  const results: [number, number, number][] = []

  if (nums.length < 3) {
    return results
  }

  // Sort the array for two-pointer technique
  const sorted = [...nums].sort((a, b) => a - b)

  for (let i = 0; i < sorted.length - 2; i++) {
    // Skip duplicates for the first element
    if (i > 0 && sorted[i] === sorted[i - 1]) {
      continue
    }

    const complement = target - sorted[i]
    let left = i + 1
    let right = sorted.length - 1

    while (left < right) {
      const sum = sorted[left] + sorted[right]

      if (sum === complement) {
        results.push([sorted[i], sorted[left], sorted[right]])

        // Skip duplicates for the second element
        while (left < right && sorted[left] === sorted[left + 1]) {
          left++
        }
        // Skip duplicates for the third element
        while (left < right && sorted[right] === sorted[right - 1]) {
          right--
        }

        left++
        right--
      } else if (sum < complement) {
        left++
      } else {
        right--
      }
    }
  }

  return results
}
