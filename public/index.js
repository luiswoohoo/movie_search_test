const searchBtn = document.getElementById('search-btn')
const searchBar = document.getElementById('search-bar')
const initialState = document.querySelector('.initial-state')
const populatedState = document.querySelector('.populated-state')

let globalMoviesArray = []

async function getMovies() {
    globalMoviesArray = []
    try {
        const movieIds = await getMovieIds()
        const detailedMovieData = await getMovieDetails(movieIds)
        renderMovieHtml(detailedMovieData)
        addWatchListEvent()
    } catch (error) {
        renderSearchErrorHtml()
    }
}

async function getMovieIds() {
    const movie = searchBar.value.replace(/\s+/g, '+')

    const searchURL = `/.netlify/functions/get-movie-ids?movie=${movie}`
    
    const res = await fetch(searchURL)
    const searchData = await res.json()

    if (searchData.Response === 'False') {
        renderSearchErrorHtml()
    } else {
        const movieIds = searchData.Search.map((movie) => movie.imdbID)
        return movieIds
    }

}

async function getMovieDetails(movieIdsArray) {
    let movies = []
    for (const movieId of movieIdsArray) {

        const res = await fetch(`/.netlify/functions/get-movie?movieId=${movieId}`)
        const movieDetails = await res.json()
        movies.push(movieDetails)
        globalMoviesArray.push(movieDetails)
    }
    return movies
}

function renderMovieHtml(movieDetailsArray) {
    // accept array of objects
    // render desired information
    initialState.innerHTML = ''
    initialState.classList.remove('initial-height')
    populatedState.innerHTML = ''

    for (const movie of movieDetailsArray) {
        if (movie.Poster === "N/A") {
            movie.Poster = "/img/film-icon.png"
        }

        populatedState.innerHTML += `
        <div class="movie-card">
            <div class="movie-poster">
                <img src="${movie.Poster}" alt="movie poster" >
            </div>
            <div class="movie-details">
                <div class="md-row-1">
                    <p class="title">${movie.Title}</p>
                    <p class="rating"><span class="star-emoji">&#11088;</span> ${movie.imdbRating}</p>
                </div>
                <div class="md-row-2">
                    <p class="runtime">${movie.Runtime}</p>
                    <p class="year">${movie.Year}</p>
                    <p class="watchlist"><img src="img/plus.png" class="plus-symbol addMovie" data-movieID="${movie.imdbID}">Watchlist</p>
                </div>
                <div class="md-row-3">
                    <p class="rated">${movie.Rated}</p>
                    <p class="genre">${movie.Genre}</p>
                </div>
                <div class="md-row-4">
                    <p class="plot">${movie.Plot}</p>
                </div>
            </div>
        </div>`
    }


}

function renderSearchErrorHtml() {
    initialState.classList.add('initial-height')
    initialState.innerHTML = `<p>Unable to find what you're looking for.<br>Please try another search.</p>`
    populatedState.innerHTML = ''
}

function addWatchListEvent() {
    const watchlistBtns = document.querySelectorAll('.addMovie')
    for (const wlBtn of watchlistBtns) {
        wlBtn.addEventListener('click', saveMovieData)
    }
}

function saveMovieData() {
    console.log(this)
    console.log(this.attributes.src)
    this.classList.add("check-symbol")
    this.classList.remove("plus-symbol")
    this.removeEventListener('click', saveMovieData)
    this.attributes.src.nodeValue = "img/check.png"

    const movieID = this.dataset.movieid

    const movieObj = globalMoviesArray.find( (movie) => movie.imdbID === movieID )
    console.log(movieObj)

    const movieData = JSON.stringify(movieObj)

    localStorage.setItem(movieID, movieData)
}

searchBtn.addEventListener('click', getMovies)
searchBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click()
    }
})
