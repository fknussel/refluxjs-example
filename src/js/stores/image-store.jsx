var Api = require('../utils/api');
var Reflux = require('reflux');
var Actions = require('../actions');
var _ = require('lodash');

module.exports = Reflux.createStore({

  listenables: [Actions],

  getImages: function (topicId) {
    return Api.get('topics/' + topicId).then(function (response) {
      this.images = _.reject(response.data, function (image) {
        return image.is_album;
      });

      this.triggerChange();
    }.bind(this));
  },

  find: function (imageId) {
    var image = _.find(this.images, { id: imageId });

    if (image) {
      return image;
    } else {
      return this.getImageById(imageId);
      // return null;
    }
  },

  getImageById: function (imageId) {
    return Api.get('gallery/image/' + imageId).then(function (response) {
      if (this.images) {
        this.images.push(response.data);
      } else {
        this.images = [response.data];
      }

      this.triggerChange();
    }.bind(this));
  },

  triggerChange: function () {
    this.trigger('change', this.images);
  }
});
