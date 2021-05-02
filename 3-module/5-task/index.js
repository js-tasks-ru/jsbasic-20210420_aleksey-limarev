function getMinMax(str) {
  const resultArray = str.split(' ')
                         .reduce((accumulator, curItem) => accumulator.concat(curItem.split(',')), [])
                         .filter(item => isFinite(item) && item !== '')
                         .sort((a, b) => +a - +b);

  /*
     вместо str.split(' ').ruduce(...) можно было передать в split регулярное выражение str.split(/[,\s]/)
     и сразу получить разбитый по двум делителям массив, но так как мы еще не проходили регулярные выражения,
     то я использовал такую реализацию.
  */

  return {
    min: +resultArray[0],
    max: +resultArray[resultArray.length - 1],
  };
}
