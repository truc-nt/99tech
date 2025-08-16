/*
  Time complexity: O(n)
  Space complexity: O(1)
*/
function sum_to_n_a(n: number): number {
  let sum: number = 0;
  for (let i = 1; i <= n; i++)
    sum += i;
  return sum;
}

/*
  Time complexity: O(1)
  Space complexity: O(1)
*/
function sum_to_n_b(n: number): number {
	return (n * (n + 1)) / 2;
}

/*
  Time complexity: O(n)
  Space complexity: O(n)
*/
function sum_to_n_c(n: number): number {
	return n === 0 ? 0 : n + sum_to_n_c(n - 1);
}
