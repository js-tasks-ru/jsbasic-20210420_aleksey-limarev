function ucFirst(str) {
  if (!str) {
    return str;
  }

  return (!str[1]) ? str.toUpperCase() : str[0].toUpperCase() + str.slice(1);
}
