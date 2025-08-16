function sum_to_n_a(n) {
    var sum = 0;
    for (var i = 1; i <= n; i++)
        sum += i;
    return sum;
}
function sum_to_n_b(n) {
    return (n * (n + 1)) / 2;
}
function sum_to_n_c(n) {
    return n === 0 ? 0 : n + sum_to_n_c(n - 1);
}
console.log(sum_to_n_a(5), sum_to_n_b(5), sum_to_n_c(5));
