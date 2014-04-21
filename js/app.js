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
    var mimeTypesView = new MimeTypesView({collection: mimeTypes});
    mimeTypes.fetch({
      success : function(model, err) {
        $('thead').after(mimeTypesView.render().el);
      }
    });
  }

  return App;
});