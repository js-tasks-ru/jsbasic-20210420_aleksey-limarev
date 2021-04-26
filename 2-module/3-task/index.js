let calculator = {
  read(a, b) {
    this.operand1 = a;
    this.operand2 = b;
  },

  sum() {
    return this.operand1 + this.operand2;
  },

  mul() {
    return this.operand1 * this.operand2;
  }
};

// НЕ УДАЛЯТЬ СТРОКУ, НУЖНА ДЛЯ ПРОВЕРКИ
window.calculator = calculator; // делает ваш калькулятор доступным глобально
