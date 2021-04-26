let calculator = {
  firstOperand: null,
  secondOperand: null,

  read(a, b) {
    this.firstOperand = a;
    this.secondOperand = b;
  },

  sum() {
    return this.firstOperand + this.secondOperand;
  },

  mul() {
    return this.firstOperand * this.secondOperand;
  }
};

// НЕ УДАЛЯТЬ СТРОКУ, НУЖНА ДЛЯ ПРОВЕРКИ
window.calculator = calculator; // делает ваш калькулятор доступным глобально
