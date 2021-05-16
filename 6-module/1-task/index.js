/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
export default class UserTable {
  constructor(rows) {
    this._table = document.createElement("table");
    this._users = rows;
    this._titles = ["Имя", "Возраст", "Зарплата", "Город", ""];

    this._renderTable();
  }

  _tableCellTemplate({ type, value }) {
    return `<${type}>${value}</${type}>`;
  }

  _onTableRowClick(event) {
    if (event.target.dataset.action !== "close") {return;}

    /*
    намеренно не использовал стрелочную функцию, так как при обработке клика
    в качестве this будет использован DOM элемент tr, которому навешен этот
    обработчик и который собственно и нужно удалить
    */
    this.remove();
  }

  _tableBodyRowTemplate({name, age, salary, city}) {
    const cellValues = [name, age, salary, city, "<button data-action='close'>X</button>"];

    return `<tr data-type="content">
                ${ cellValues.map((field) => this._tableCellTemplate({type: "td", value: field})).join('') }
            </tr>`;
  }

  _tableBodyTemplate() {
    return `<tbody>
                ${ this._users.map((user) => this._tableBodyRowTemplate(user)).join('') }
            </tbody>`;
  }

  _tableHeadTemplate() {
    return `<thead>
              <tr>
                ${ this._titles.map((title) => this._tableCellTemplate({type: "th", value: title})).join('') }
              </tr>
            </thead>`;
  }

  _renderTable() {
    this._table.innerHTML += this._tableHeadTemplate();
    this._table.innerHTML += this._tableBodyTemplate();

    this._table.querySelectorAll("[data-type='content']").forEach(tr => {
      tr.addEventListener("click", this._onTableRowClick);
    });
  }

  get elem() {
    return this._table;
  }
}
