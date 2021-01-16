import View from './View.js';
import icons from 'url:../../img/icons.svg';

class Pagination extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goTo = +btn.dataset.goto;
      console.log(goTo);
      handler(goTo);
    });
  }
  generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // PAGE 1 AND THERE ARE OTHER PAGES
    if (curPage === 1 && numPages > 1) {
      return `
      <button class="btn--inline pagination__btn--next" data-goto="${
        curPage + 1
      }">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
    }
    // PAGE 1 AND THERE ARE NO OTHER PAGES
    else if (curPage === 1 && numPages === 1) {
      return '';
    }

    // LAST PAGE
    else if (curPage === numPages) {
      return `
      <button class="btn--inline pagination__btn--prev" data-goto="${
        curPage - 1
      }">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>`;
    }
    // OTHER PAGE
    else if (curPage < numPages) {
      return `
      <button class="btn--inline pagination__btn--prev" data-goto="${
        curPage - 1
      }">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      <button class="btn--inline pagination__btn--next" data-goto="${
        curPage + 1
      }">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
    }
  }
}

export default new Pagination();
