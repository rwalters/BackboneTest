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
    comparator: function(mimeType) {
        return mimeType.get('type');
    },
    orderByType: function() {
      this.comparator = function(mimeType) {
        return mimeType.get('type');
      }
      this.sort();
    },
    orderByDescription: function() {
      this.comparator = function(mimeType){
        return mimeType.get('description');
      };
      this.sort();
    },
    orderByFileExtension: function() {
      this.comparator = function(mimeType){
        return mimeType.get('fileExtension');
      };
      this.sort();
    },
    orderBySupported: function() {
      this.comparator = function(mimeType){
        return mimeType.get('supported');
      };
      this.sort();
    },
    parse: function(response){
      return response.mimeTypeFullList;
    },
    url: 'https://api.qa.mimedia.com/2.0/mimetypesfull/supported/list/',
    model: MimeType
  });
  var MimeTypesView = Backbone.View.extend({
    tagName: '<tbody>',
    initialize: function(){
      this.collection.on('reset', this.render, this);
    },
    render: function(){
      this.addAll();
      return this;
    },
    addAll: function(){
      this.$el.empty
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
          mimeTypes.orderByType();
          var mimeTypesView = new MimeTypesView({collection: mimeTypes});
          $('thead').after(mimeTypesView.render().el);
        }
      });
    });
    
    $('#fileExtension').click(function(){
      console.log("fileExtension");
      mimeTypes.fetch({
        success : function(model, err) {
          mimeTypes.orderByFileExtension();
          var mimeTypesView = new MimeTypesView({collection: mimeTypes});
          $('thead').after(mimeTypesView.render().el);
        }
      });
    });

    $('#description').click(function(){
      console.log("description");
      mimeTypes.fetch({
        success : function(model, err) {
          mimeTypes.orderByDescription();
          var mimeTypesView = new MimeTypesView({collection: mimeTypes});
          $('thead').after(mimeTypesView.render().el);
        }
      });
    });

    $('#supported').click(function(){
      console.log("supported");
      mimeTypes.fetch({
        success : function(model, err) {
          mimeTypes.orderBySupported();
          var mimeTypesView = new MimeTypesView({collection: mimeTypes});
          $('thead').after(mimeTypesView.render().el);
        }
      });
    });

    $('#type').trigger('click');
  }

  return App;
});