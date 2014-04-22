define(["backbone"], function(Backbone){
  var MimeType = Backbone.Model.extend({ });
  var MimeTypeView = Backbone.View.extend({
    tagName: '<tr>',
    template: _.template('<td><%= type %></td><td><%= fileExtension %></td><td><%= description %></td><td><%= supported %></td>'),
    render: function(){
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });
  var MimeTypes = Backbone.Collection.extend({
    sortAttribute: "",
    defaultSortAttribute: "type",
    sortDirection: 1,

    comparator: function(a, b) {
      var a = a.get(this.sortAttribute || this.defaultSortAttribute),
          b = b.get(this.sortAttribute || this.defaultSortAttribute);

      if (a == b) return 0;

      if (this.sortDirection == 1) {
        return a > b ? 1 : -1;
      } else {
        return a < b ? 1 : -1;
      }
    },
    sortMimeTypes: function (attr) {
      if (this.sortAttribute == attr) {
        this.sortDirection *= -1;
      } else {
        this.sortDirection = 1;
        this.sortAttribute = attr;
      }
      this.sort();
    },
    parse: function(response){
      return response.mimeTypeFullList;
    },
    url: 'https://api.qa.mimedia.com/2.0/mimetypesfull/supported/list/',
    model: MimeType
  });
  var MimeTypesView = Backbone.View.extend({
    tagName: 'tbody',
    initialize: function(){
      this.collection.on('reset', this.render, this);
    },
    render: function(){
      this.addAll();
      return this;
    },
    addAll: function(){
      this.$el.empty
      $(this.tagName).remove();
      this.collection.forEach(this.addOne, this);
    },
    addOne: function(mimeType){
      var mimeTypeView = new MimeTypeView({model: mimeType});
      this.$el.append(mimeTypeView.render().el);
    }
  });

  var App = function() {
    var mimeTypes = new MimeTypes;
    
    var applications = new RegExp("^application/", "i");
    var audios = new RegExp("^audio/", "i");
    var images = new RegExp("^image/", "i");
    var texts = new RegExp("^text/", "i");
    var videos = new RegExp("^video/", "i");

    $('#type').click(function(){
      mimeTypes.fetch({
        success : function(model, err) {
          var appCount = mimeTypes.filter(function(data) { return applications.test(data.get("type")); }).length
          var audioCount = mimeTypes.filter(function(data) { return audios.test(data.get("type")); }).length
          var imageCount = mimeTypes.filter(function(data) { return images.test(data.get("type")); }).length
          var textCount = mimeTypes.filter(function(data) { return texts.test(data.get("type")); }).length
          var videoCount = mimeTypes.filter(function(data) { return videos.test(data.get("type")); }).length

          $("#applications").html(appCount);
          $("#audios").html(audioCount);
          $("#images").html(imageCount);
          $("#texts").html(textCount);
          $("#videos").html(videoCount);

          mimeTypes.sortMimeTypes("type");
          var mimeTypesView = new MimeTypesView({collection: mimeTypes});
          $('table').append(mimeTypesView.render().el);
        }
      });
    });

    $('#fileExtension').click(function(){
      mimeTypes.fetch({
        success : function(model, err) {
          mimeTypes.sortMimeTypes("fileExtension");
          var mimeTypesView = new MimeTypesView({collection: mimeTypes});
          $('table').append(mimeTypesView.render().el);
        }
      });
    });

    $('#description').click(function(){
      mimeTypes.fetch({
        success : function(model, err) {
          mimeTypes.sortMimeTypes("description");
          var mimeTypesView = new MimeTypesView({collection: mimeTypes});
          $('table').append(mimeTypesView.render().el);
        }
      });
    });

    $('#supported').click(function(){
      mimeTypes.fetch({
        success : function(model, err) {
          mimeTypes.sortMimeTypes("supported");
          var mimeTypesView = new MimeTypesView({collection: mimeTypes});
          $('table').append(mimeTypesView.render().el);
        }
      });
    });

    $('#type').trigger('click');
  }

  return App;
});