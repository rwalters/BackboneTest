define(["backbone"], function(Backbone){
  var MimeType = Backbone.Model.extend({ });
  var MimeTypes = Backbone.Collection.extend({
    parse: function(response){
      return response.mimeTypeFullList;
    },
    url: 'https://api.qa.mimedia.com/2.0/mimetypesfull/supported/list/',
    model: MimeType
  });

  var App = Backbone.View.extend({
    initialize: function(){
      var mimeTypes = new MimeTypes;
        mimeTypes.fetch({ success : function(model, err) { console.log(mimeTypes.at(0).attributes) } });
      }
  });
  return App;
});