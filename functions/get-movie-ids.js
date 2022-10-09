const process = require('process')

const axios = require('axios')

const handler = async function (event) {
  const movie = event.queryStringParameters.movie

  const { API_SECRET, API_URL } = process.env
  const URL = `${API_URL}?s=${movie}&type=movie&apikey=${API_SECRET}`

  try {
    const { data } = await axios.get(URL)

    return {
      statusCode: 200,
      body: JSON.stringify(data),
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
