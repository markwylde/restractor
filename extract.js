const axios = require('axios');

async function fetchPage (url, pageNumber = 1, data = []) {
  try {
    const previousUrl = url.replace('{page}', pageNumber - 1);
    const currentUrl = url.replace('{page}', pageNumber);

    if (pageNumber > 1 && previousUrl === currentUrl) {
      return data;
    }

    const response = await axios(url.replace('{page}', pageNumber));
    data = data.concat(response.data);

    if (response.data.length === 0) {
      return data;
    }

    return fetchPage(url, pageNumber + 1, data);
  } catch (error) {
    console.log(error);
    if (error.response.status === 404 && pageNumber > 1) {
      return data;
    }

    throw error;
  }
}

async function extract (url) {
  return fetchPage(url);
}

module.exports = extract;
