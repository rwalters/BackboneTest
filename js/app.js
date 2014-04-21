define(["backbone"], function(Backbone){
  var MimeType = Backbone.Model.extend({ });
  var MimeTypeView = Backbone.View.extend({
    template: _.template('<tr><td><%= type %></td><td><%= fileExtension %></td><td><%= description %></td><td><%= supported %></td></tr>'),
    render: function(){
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });
  var MimeTypes = Backbone.Collection.extend({
    parse: function(response){
      return response.mimeTypeFullList;
    },
    url: 'https://api.qa.mimedia.com/2.0/mimetypesfull/supported/list/',
    model: MimeType
  });
  var MimeTypesView = Backbone.View.extend({
    initialize: function(){
      this.collection.on('reset', this.render, this);
    },
    render: function(){
      this.addAll();
      return this;
    },
    addAll: function(){
      this.$el.html("<table><th><td>Type</td><td>File Extension</td><td>Description</td><td>Supported Format</td></th>");
      this.collection.forEach(this.addOne, this);
      this.$el.append("</table>");
    },
    addOne: function(mimeType){
      var mimeTypeView = new MimeTypeView({model: mimeType});
      this.$el.append(mimeTypeView.render().el);
    }
  });

  var App = function() {
    var mimeTypes = new MimeTypes;
    var mimeTypesView = new MimeTypesView({collection: mimeTypes});
    mimeTypes.fetch({
      success : function(model, err) {
        $('#app').html(mimeTypesView.render().el);
      }
    });
  }

  return App;
});