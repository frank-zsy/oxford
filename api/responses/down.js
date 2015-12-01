module.exports = function sendDown (data, options) {

  var res = this.res;

  // Set status code
  res.status(500);

  res.send(JSON.stringify({msg: data}));

};
