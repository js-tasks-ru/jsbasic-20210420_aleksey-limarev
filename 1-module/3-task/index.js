function ucFirst(str) {
  return (!str) ? str : (!str[1]) ? str.toUpperCase() : str[0].toUpperCase() + str.slice(1);
}
