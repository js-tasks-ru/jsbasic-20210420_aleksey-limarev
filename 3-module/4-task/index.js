function showSalary(users, maxAge) {

  return users.reduce((arr, {age, name, balance}) => age <= maxAge ? arr.concat(`${name}, ${balance}`) : arr, [])
              .join('\n');

}
