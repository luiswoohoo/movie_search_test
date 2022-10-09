const initialState = document.querySelector('.initial-state')
const populatedState = document.querySelector('.populated-state')

function getStoredMovies() {
  let storedMovies = []

  for (let i = 0; i < localStorage.length; i++) {
    const movieData = localStorage.getItem(localStorage.key(i))
    storedMovies.push(movieData)
  }
  return storedMovies
}

function renderStoredMoviesHtml(storedMoviesArray) {
  if (storedMoviesArray.length) {
    initialState.innerHTML = ''
    initialState.classList.remove('initial-height')
    populatedState.innerHTML = ''

    for (const movie of storedMoviesArray) {
      const movieObj = JSON.parse(movie)
      if (movieObj.Poster === 'N/A') {
        movieObj.Poster = '/img/film.svg'
      }
      populatedState.innerHTML += `
            <div class="movie-card">
                <div class="movie-poster">
                    <img src="${movieObj.Poster}" alt="movie poster" >
                </div>
                <div class="movie-details">
                    <div class="md-row-1">
                        <p class="title">${movieObj.Title}</p>
                        <p class="rating"><span class="star-emoji">&#11088;</span> ${movieObj.imdbRating}</p>
                    </div>
                    <div class="md-row-2">
                        <p class="runtime">${movieObj.Runtime}</p>
                        <p class="year">${movieObj.Year}</p>
                        <p class="watchlist"><img src="img/minus.svg" class="minus-symbol removeMovie" data-movieID="${movieObj.imdbID}">Remove</p>
                    </div>
                    <div class="md-row-3">
                        <p class="rated">${movieObj.Rated}</p>
                        <p class="genre">${movieObj.Genre}</p>
                    </div>
                    <div class="md-row-4">
                        <p class="plot">${movieObj.Plot}</p>
                    </div>
                </div>
            </div>`
    }
  }

  addWatchListEvent()
}

function addWatchListEvent() {
  const watchlistBtns = document.querySelectorAll('.removeMovie')
  for (const wlBtn of watchlistBtns) {
    wlBtn.addEventListener('click', removeMovieData)
  }
}

function removeMovieData() {
  const movieID = this.dataset.movieid

  localStorage.removeItem(movieID)
  location.reload()
}

const storedMovies = getStoredMovies()
renderStoredMoviesHtml(storedMovies)
