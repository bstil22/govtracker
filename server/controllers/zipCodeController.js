const request = require('request-promise');
 
module.exports = (req, res) => {
  return getDelegates()
    .then(legislators => {
      res.status(200).send({legislators})
    })
    .catch(() => {
      res.status(200).send('Sunlight Labs is hosed');
    });
};

function getDelegates () {
  return new Promise((resolve, reject) => {
    return request({
      url: 'https://congress.api.sunlightfoundation.com/legislators/locate?zip=11216&apikey=API_KEY',
      method: 'GET',
      simple: false,
      resolveWithFullResponse: true
    }).then(response => {
      if (response.statusCode >= 400) {
        reject(new Error(`Status code: ${response.statusCode}`));
      }
      else {
        resolve(response.body)
      }
    }).catch(err => {
      reject(err);
    });
  });

}