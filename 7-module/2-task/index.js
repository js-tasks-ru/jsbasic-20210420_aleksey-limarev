import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this._modal = createElement(this._modalTemplate());
    this._modalTitle = this._modal.querySelector("[data-role='modal-title']");
    this._modalBody = this._modal.querySelector("[data-role='modal-body']");
  }

  get elem() {
    return this._modal;
  }

  get title() {
    return this._modalTitle;
  }

  get body() {
    return this._modalBody;
  }

  open() {
    this._updateBodyForModal();
    this._addCloseActions();

    document.body.append(this._modal);
  }

  setTitle(str) {
    this._modalTitle.textContent = str;
  }

  setBody(body) {
    if (typeof body === "string") {
      return this._modalBody.innerHTML = body;
    }
    if (body instanceof HTMLElement) {
      return this._modalBody.append(body);
    }
  }

  close() {
    this._modal.remove();

    document.body.classList.remove("is-modal-open");
    document.body.style.paddingRight = '';
  }

  _modalTemplate() {
    return `
       <div class="modal">
          <div class="modal__overlay" data-action="close"></div>

          <div class="modal__inner">
            <div class="modal__header">
              <button type="button" class="modal__close" data-action="close">
                <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
              </button>

              <h3 class="modal__title" data-role="modal-title"></h3>
            </div>

            <div class="modal__body" data-role="modal-body"></div>
          </div>

        </div>
    `;
  }

  _updateBodyForModal() {
    const bodyWidthBefore = document.body.clientWidth;

    document.body.classList.add("is-modal-open");

    setTimeout(() => {
      const bodyWidthAfter = document.body.clientWidth;

      if (bodyWidthAfter > bodyWidthBefore) {
        document.body.style.paddingRight = `${bodyWidthAfter - bodyWidthBefore}px`;
      }
    });
  }

  _addCloseActions() {
    this._modal.querySelectorAll("[data-action='close']").forEach(closeElem => {
      closeElem.addEventListener("click", () => this.close(), {once: true});
    });

    document.addEventListener("keydown", (event) => {
      if (event.code === "Escape") {
        this.close();
      }
    }, {once: true});
  }
}
