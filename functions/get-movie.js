const process = require('process')

const axios = require('axios')

const handler = async function (event) {
  const movieId = event.queryStringParameters.movieId

  const { API_SECRET, API_URL } = process.env
  const URL = `${API_URL}?i=${movieId}&apikey=${API_SECRET}`

  try {
    const { data } = await axios.get(URL)

    const { Poster, Title, imdbRating, Runtime, Year, imdbID, Rated, Genre, Plot } = data
    const dataShort = { Poster, Title, imdbRating, Runtime, Year, imdbID, Rated, Genre, Plot }

    return {
      statusCode: 200,
      body: JSON.stringify(dataShort),
    }
  } catch (error) {
    const { data, headers, status, statusText } = error.response
    return {
      statusCode: error.response.status,
      body: JSON.stringify({ status, statusText, headers, data }),
    }
  }
}

module.exports = { handler }
