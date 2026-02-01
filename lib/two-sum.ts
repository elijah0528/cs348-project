/**
 * Finds two numbers in the array that add up to the target sum.
 *
 * @param nums - Array of integers to search.
 * @param target - Target sum to match.
 * @returns Tuple of indices [i, j] where nums[i] + nums[j] === target,
 * or null if no pair exists.
 */
export function twoSum(nums: number[], target: number): [number, number] | null {
  const indicesByValue = new Map<number, number>()

  for (let index = 0; index < nums.length; index++) {
    const value = nums[index]
    const complement = target - value
    const complementIndex = indicesByValue.get(complement)

    if (complementIndex !== undefined) {
      return [complementIndex, index]
    }

    indicesByValue.set(value, index)
  }

  return null
}
