/**
* Stars.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  globalId: 'Stars',
  autoCreatedAt: true,
  autoUpdatedAt: true,

  attributes: {

    name: {
      type: 'string',
      required: true
    },

    faceId: {
      type: 'string',
      required: true
    },

    faceRectangle: {
      type: 'json',
      required: true
    },

    faceLandmarks: {
      type: 'json',
      required: true
    },

    attributes: {
      type: 'json',
      required: true
    },

    filePath: {
      type: 'string'
    }

  }

};
