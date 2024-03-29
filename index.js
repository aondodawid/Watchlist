const get = (element) => document.getElementById(element);
const content = get('content');
const watchlist = get('watchlist');
const findMovie = get('findMovie');
const search = get('search');
const searchSection = get('search-section');

let renderContent = '';

const renderMinusIcon = () => ` 
    <svg
      data-minus="icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8" r="7.5" stroke="black" stroke-width="1" fill="white" />
      <rect x="3" y="7.5" width="10" height="2" fill="black" />
    </svg>
`;

const renderPlusIcon = () => `
  <svg
  data-plus="icon"
  width="16"
  height="16"
  viewBox="0 0 16 16"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  >
  <path 
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM9 5C9 4.44772 8.55228 4 8 4C7.44772 4 7 4.44772 7 5V7H5C4.44772 7 4 7.44771 4 8C4 8.55228 4.44772 9 5 9H7V11C7 11.5523 7.44772 12 8 12C8.55228 12 9 11.5523 9 11V9H11C11.5523 9 12 8.55228 12 8C12 7.44772 11.5523 7 11 7H9V5Z"
    fill="white"
  />
  </svg>
`;

const watchListInnerHtml = `
  <div class="empty-container">
    <p>
      Your watchlist is looking a little empty...
    </p>
    ${renderPlusIcon()} <span>Let’s add some movies!</span>
  </div>
`;

const searchNotFoundInnerHtml = `
<div class="empty-container">
  <p>
    Unable to find what you’re looking 
  </p>
  <p>
  for. Please try another search.
  </p>
</div>
`;

function triggerWatchlist() {
  findMovie.classList.remove('text-big');
  watchlist.classList.add('text-big');
  searchSection.classList.add('hidden');
  search.value = '';
  renderContent = '';
  renderWatchlist();
}

function addMovieToLocalStorage(element) {
  if (typeof localStorage.getItem('movieList') === 'string') {
    const movieList = localStorage.getItem('movieList').split(',');
    if (!movieList.includes(element.dataset.movie)) {
      movieList.push(element.dataset.movie);
    }
    if (movieList[0] === '') movieList.shift();
    localStorage.setItem('movieList', movieList.join(','));
  } else localStorage.setItem('movieList', element.dataset.movie);
}

function removeMovieFromLocalStorage(element) {
  const movieList = localStorage.getItem('movieList').split(',');
  const updatedMovieList = movieList.filter((movie) => movie !== element.dataset.movie);
  localStorage.setItem('movieList', updatedMovieList.join(','));
}

function renderHTML(data) {
  function isInMovieList(imdbID) {
    if (typeof localStorage.getItem('movieList') === 'string') {
      return localStorage.getItem('movieList').split(',').includes(imdbID);
    }
    return false;
  }

  if (search.value === '' && data === false) {
    renderContent = '<img class="movie-icon" src="./images/Group_199.png" />';
  } else {
    const raiting = data.Ratings[0] ? data.Ratings[0].Value.substring(0, 3) : false;

    renderContent += `
        <div class="movie-container">
        <img
          src="${data.Poster}"
          class="movie-poster"
          alt="movie poster"
        />
        <div class="description-container">
          <div class="title-container">
            <h3>
              ${data.Title}
          
            </h3>
            <p class="rate ${raiting ? '' : 'hidden'}" >  
              <svg
                width="13"
                height="12"
                viewBox="0 0 13 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
              <path
                d="M5.78671 1.19529C6.01122 0.504306 6.98878 0.504305 7.21329 1.19529L8.01547 3.66413C8.11588 3.97315 8.40384 4.18237 8.72876 4.18237H11.3247C12.0512 4.18237 12.3533 5.11208 11.7655 5.53914L9.66537 7.06497C9.40251 7.25595 9.29251 7.59448 9.39292 7.90349L10.1951 10.3723C10.4196 11.0633 9.62875 11.6379 9.04097 11.2109L6.94084 9.68503C6.67797 9.49405 6.32203 9.49405 6.05916 9.68503L3.95903 11.2109C3.37125 11.6379 2.58039 11.0633 2.8049 10.3723L3.60708 7.90349C3.70749 7.59448 3.59749 7.25595 3.33463 7.06497L1.2345 5.53914C0.646715 5.11208 0.948796 4.18237 1.67534 4.18237H4.27124C4.59616 4.18237 4.88412 3.97315 4.98453 3.66414L5.78671 1.19529Z"
                fill="#FEC654"
              />
            </svg>${raiting}</p>
          </div>
          <div class="about-container">
            <p class="about-element">${data.Runtime}</p>
            <p class="about-element">${data.Genre}</p>
            <p class="about-element btn-watchlist" data-movie=${data.imdbID}>
          ${isInMovieList(data.imdbID) ? renderMinusIcon() + 'Remove' : renderPlusIcon() + 'Watchlist'}
              
            </p>
          </div>
          <div class="movie-description">
          ${data.Plot}
          </div>
        </div>
      </div>
  `;
  }
  content.innerHTML = renderContent;
}

function renderEmptySearchList() {
  watchlist.classList.remove('text-big');
  findMovie.classList.add('text-big');
  searchSection.classList.remove('hidden');
  renderContent = '';
  renderHTML(false);
}

function handleWatchlistBtn(isWatchlist = false) {
  const btns = document.querySelectorAll('.btn-watchlist');
  btns.forEach((btn) => {
    btn.addEventListener('click', function () {
      if (this.children[0].dataset.minus) {
        this.innerHTML = renderPlusIcon() + ' Watchlist';
        removeMovieFromLocalStorage(this);
        if (isWatchlist) {
          if (this.closest('.content').children.length === 1) {
            content.innerHTML = watchListInnerHtml;
            const btnBackToSearch = document.querySelector('.empty-container');
            btnBackToSearch.addEventListener('click', function () {
              renderEmptySearchList();
            });
          } else this.closest('.movie-container').parentNode.removeChild(this.closest('.movie-container'));
        }
      } else {
        addMovieToLocalStorage(this);
        this.innerHTML = renderMinusIcon() + ' Remove';
      }
    });
  });
}

async function renderSearchedMovies(movieToLokFor, isClicked = false) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=71aa02e0&s=${movieToLokFor}`);
    const data = await response.json();
    data.Search.forEach(async (movie) => {
      const res = await fetch(`https://www.omdbapi.com/?apikey=71aa02e0&i=${movie.imdbID}`);
      const dataMovie = await res.json();
      renderHTML(dataMovie);
      handleWatchlistBtn();
    });
  } catch {
    renderContent = '';
    if (isClicked) content.innerHTML = searchNotFoundInnerHtml;
  }
}

function renderWatchlist() {
  let movieArray = [''];
  if (localStorage.getItem('movieList')) movieArray = localStorage.getItem('movieList').split(',');

  movieArray.forEach(async (movie) => {
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=71aa02e0&i=${movie}`);
      const data = await res.json();
      renderHTML(data, true);
      handleWatchlistBtn(true);
    } catch {
      content.innerHTML = watchListInnerHtml;
      const btn = document.querySelector('.empty-container');
      btn.addEventListener('click', function () {
        renderEmptySearchList();
      });
    }
  });
}

document.addEventListener('input', function (e) {
  renderContent = '';
  renderSearchedMovies(e.target.value);
});

document.addEventListener('click', (e) => {
  e.preventDefault();
  switch (e.target.id) {
    case 'watchlist':
      triggerWatchlist();
      break;
    case 'findMovie':
      renderEmptySearchList();
      break;
    case 'search-btn':
      renderContent = '';
      renderSearchedMovies(search.value, true);
      search.value = '';
      break;
    default:
      break;
  }
});
