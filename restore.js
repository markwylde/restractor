const axios = require('axios');

async function restore (data, url) {
  const promises = data.map(async document => {
    const postResponse = await axios({
      url,
      method: 'post',
      data: document,
      validateStatus: () => true
    });

    const result = {
      status: postResponse.status,
      data: postResponse.data
    };

    console.log(result);

    if (postResponse.status >= 400) {
      return Object.assign(new Error('could not create document'), { ...result });
    }

    return result;
  });

  return Promise.all(promises);
}

module.exports = restore;
