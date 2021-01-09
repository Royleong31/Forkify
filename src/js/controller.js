import * as model from './model.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './views/searchView.js';
import paginationViews from './views/paginationViews.js';

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

    // LOADING RECIPE
    recipeView.renderSpinner();
    await model.loadRecipe(id);
    console.log(model.state.recipe);

    // RENDERING RECIPE
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
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
  recipeView.render(model.state.recipe);
};

function init() {
  recipeView.addHandlerRender(controlRecipes); // tells view to add the event handler once page loads, but the callback is delegated to the controller. View only adds event listener
  searchView.addHandlerSearch(controlSearchResults);
  paginationViews.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
}

init();
