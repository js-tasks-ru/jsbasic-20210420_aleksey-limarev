function factorial(n) {
  if(n <= 1) return 1;

  let res = 1;

  for (let i = 1; i <= n; i++) {
    res *= i;
  }

  return res;
}
