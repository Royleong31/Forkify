import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './views/searchView.js';
import paginationViews from './views/paginationViews.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) {
      alert('No id given');
      return;
    }

    // UPDATE RESULTS VIEW TO MARK SELECTED SEARCH RESULT
    resultsView.update(model.getSearchResultsPage());

    // LOADING RECIPE
    recipeView.renderSpinner();
    await model.loadRecipe(id);

    // RENDERING RECIPE
    recipeView.render(model.state.recipe);

    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    model.state.search.page = 1;
    resultsView.renderSpinner();
    // 1. Get SEARCH QUERY
    const query = searchView.getQuery();
    if (!query) return;

    // 2. GET SEARCH RESULTS
    await model.loadSearchResults(query);

    //3. RENDER SEARCH RESULTS
    resultsView.render(model.getSearchResultsPage());

    // 4. RENDER  INITIAL PAGINATION
    paginationViews.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  console.log(goToPage);
  model.state.search.page = goToPage;
  // RENDER NEW RESULTS
  resultsView.render(model.getSearchResultsPage());
  // RENDER NEW PAGINATION BUTTONS
  paginationViews.render(model.state.search);
};

const controlServings = function (newServings) {
  // UPDATE THE RECIPE SERVINGS (in state)
  model.updateServings(newServings);
  // UPDATE THE RECIPE VIEW
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // SHOW LOADING SPINNER
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // SUCCESS MESSAGE
    addRecipeView.renderSuccess();

    // RENDER BOOKMAR VIEW
    bookmarksView.render(model.state.bookmarks);

    // CHAGE ID IN URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(() => {
      addRecipeView._closeWindow();
      // RESET HTML
      addRecipeView.resetForm();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err);
  }
};

function init() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes); // tells view to add the event handler once page loads, but the callback is delegated to the controller. View only adds event listener
  searchView.addHandlerSearch(controlSearchResults);
  paginationViews.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();
