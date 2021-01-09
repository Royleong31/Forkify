import icons from 'url:../../img/icons.svg';

export default class View {
  render(data) {
    // if (!data || data.length === 0) return this.renderError();
    if (!data || data.length === 0) console.log('something went wrong');;
    this._data = data;
    const markup = this.generateMarkup();
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  clear() {
    this._parentElement.innerHTML = '';
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