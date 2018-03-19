var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    if (this.get('like')) {
      this.set('like', false);
    } else {
      this.set('like', true);
    }
    this.collection.sort();
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    // this.model.on('change', this.sort())
  },

  comparator: 'title',

  sortByField: function(field) {
    this.comparator = field; //is this Backbone?
    this.sort(field); // how do we get the webpage to sort
  }

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    // your code here
    // tell collection to rerender every time there's a change event
    this.model.on('change', this.render, this);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    this.model.toggleLike();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    //register an event listener (change) when comparator changes
    //rerender
    this.collection.on('sort', this.render, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
