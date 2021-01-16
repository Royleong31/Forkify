import icons from 'url:../../img/icons.svg';

export default class View {
  render(data, render = true) {
    if (!data || data.length === 0) return this.renderError();
    // if (!data || data.length === 0) console.log('something went wrong');;
    this._data = data;
    const markup = this.generateMarkup();
    if (!render) return markup;
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  clear() {
    this._parentElement.innerHTML = '';
  }

  resetForm() {
    const markup = this.generateMarkup();
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  update(data) {
    // if (!data || data === []) return this.renderError();
    this._data = data;
    const newMarkup = this.generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup); // converts a string into a DOM object. (virtual DOM)
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // UPDATES CHANGED TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      // UPDATES CHANGED ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        // if (typeof newEl.dataset.updateTo !== 'undefined') {
        //   curEl.dataset.updateTo = newEl.dataset.updateTo;
        // }

        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div> `;
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSuccess(message = this._message) {
    const markup = `        
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;

    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div> `;
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
