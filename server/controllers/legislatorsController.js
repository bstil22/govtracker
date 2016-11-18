const request = require('request-promise');
 
module.exports = (req, res) => {
  return getDelegates(req.query)
    .then(legislators => {
      res.status(200).json(legislators);
    })
    .catch((err) => {
      res.status(200).json(err.message);
    });
};

function getDelegates (queryParams) {
  return new Promise((resolve, reject) => {
    if (!queryParams.zipCode) {
      reject(new Error('You did not supply a zipCode query param'));
    }
    return request({
      url: 'https://congress.api.sunlightfoundation.com/legislators/locate?zip=' +
      queryParams.zipCode + '&apikey=API_KEY',
      method: 'GET',
      simple: false,
      resolveWithFullResponse: true
    }).then(response => {
      if (response.statusCode >= 400) {
        reject(new Error('Sunlight Labs is hosed'));
      }
      else {
        resolve(response.body);
      }
    }).catch(err => {
      reject(err);
    });
  });

}