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
      $('tbody').remove();
      this.collection.forEach(this.addOne, this);
    },
    addOne: function(mimeType){
      var mimeTypeView = new MimeTypeView({model: mimeType});
      this.$el.append(mimeTypeView.render().el);
    }
  });

  var App = function() {
    var mimeTypes = new MimeTypes;
    
    $('#type').click(function(){ 
      console.log("type");
      mimeTypes.fetch({
        success : function(model, err) {
          mimeTypes.sortMimeTypes("type");
          var mimeTypesView = new MimeTypesView({collection: mimeTypes});
          $('table').append(mimeTypesView.render().el);
        }
      });
    });
    
    $('#fileExtension').click(function(){
      console.log("fileExtension");
      mimeTypes.fetch({
        success : function(model, err) {
          mimeTypes.sortMimeTypes("fileExtension");
          var mimeTypesView = new MimeTypesView({collection: mimeTypes});
          $('table').append(mimeTypesView.render().el);
        }
      });
    });

    $('#description').click(function(){
      console.log("description");
      mimeTypes.fetch({
        success : function(model, err) {
          mimeTypes.sortMimeTypes("description");
          var mimeTypesView = new MimeTypesView({collection: mimeTypes});
          $('table').append(mimeTypesView.render().el);
        }
      });
    });

    $('#supported').click(function(){
      console.log("supported");
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