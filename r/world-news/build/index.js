(function() {

  var overlay;
  var map;
  var cutoffPoint = 4;
  CustomMarker.prototype = new google.maps.OverlayView();

  // Initialize the map and the custom overlay.
  function initMap(data) {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: {lat: 20, lng: 20}
    });
    map.addListener('zoom_changed', function() {
      var zoomLevel = this.getZoom();
      if (zoomLevel < cutoffPoint) {
        $('.mdl-card__supporting-text').hide();
      }
      else {
        $('.mdl-card__supporting-text').show();
      }
    });

    data.forEach(function(item) {
      var latlng = new google.maps.LatLng(item.latlng[0], item.latlng[1]);
      new CustomMarker(latlng, item.title, item.body, item.img, item.link, item.date, map);
    });
  }

  /** @constructor */
  function CustomMarker(latlng, title, body, img, link, date, map) {

    // Initialize all properties.
    this.latlng_ = latlng;
    this.img_ = img;
    this.title_ = title;
    this.body_  = body;
    this.link_ = link;
    this.date_ = date;
    this.map_ = map;

    // Define a property to hold the image's div. We'll
    // actually create this div upon receipt of the onAdd()
    // method so we'll leave it null for now.
    this.div_ = null;


    // Explicitly call setMap on this overlay.
    this.setMap(map);
  }

  var News = React.createClass({displayName: "News",
    render: function() {
      var style = {
         background: 'url(' + this.props.img + ') bottom right 15% no-repeat #46B6AC',
         backgroundSize: '100% 100%',
         color: '#fff'
      };
      return (
          React.createElement("div", {className: "card-square mdl-card mdl-shadow--2dp"}, 
          React.createElement("div", {className: "mdl-card__title mdl-card--expand", style: style}, 
            React.createElement("h2", {className: "mdl-card__title-text"}, this.props.title)
          ), 
          React.createElement("div", {className: "mdl-card__supporting-text"}, 
            "更新時間: ", this.props.date, 
            React.createElement("p", null, 
            this.props.body, " ", React.createElement("a", {href: ""}, "觀看更多...")
            )
          )
          )
      );
    }
  });

  CustomMarker.prototype.onAdd = function() {
    var vm = this;
    var div = document.createElement('div');
    div.className = 'news';
    this.div_ = div;

    google.maps.event.addDomListener(this.div_, "click", function() {
         google.maps.event.trigger(self, "click");
         window.open(vm.link_, name="_self"); 
    });
    google.maps.event.addDomListener(this.div_, "mouseover", function() {
      if (map.getZoom() < cutoffPoint) {
        vm.div_.lastChild.lastChild.style.display = 'block';
        vm.div_.style.width = '220px';
        vm.div_.style.height = '300px';
      }
        vm.div_.style.zIndex = '999999';
    });
    google.maps.event.addDomListener(this.div_, "mouseout", function() {
      if (map.getZoom() < cutoffPoint) {
        vm.div_.lastChild.lastChild.style.display = 'none';
        vm.div_.style.width = '150px';
        vm.div_.style.height = '130px';
      }
        vm.div_.style.zIndex = '1';
    });


    React.render(React.createElement(News, {title: this.title_, body: this.body_, img: this.img_, 
        date: this.date_}), div);
    var panes = this.getPanes();
    panes.overlayImage.appendChild(div);
  
  };

  CustomMarker.prototype.draw = function() {
     var div = this.div_;
     var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
     if (point) {
       div.style.left = point.x + 'px';
       div.style.top = point.y + 'px';
       div.style.width = '130px';
       div.style.height = '100px';
    }
  };

  CustomMarker.prototype.onRemove = function() {
    if (this.div) {
      this.div.parentNode.removeChild(this.div);
      this.div = null;
    }
  };

  CustomMarker.prototype.draw = function() {
     var div = this.div_;
     var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
     var zoomLevel = map.getZoom();
     if (point) {
       div.style.left = point.x + 'px';
       div.style.top = point.y + 'px';
       if (zoomLevel < 4) {
         div.style.width = '150px';
         div.style.height = '110px';
       }
       else {
         div.style.width = '220px';
         div.style.height = '320px';
       }
     }
  };

  CustomMarker.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  };

  var myFirebaseRef = new Firebase("https://realtaiwanstat.firebaseio.com");
  myFirebaseRef.child("world_news").limitToLast(1).on("child_added", function(snapshot) {
      var raw = snapshot.val();  // Alerts "San Francisco"
      var data = JSON.parse(raw);
    google.maps.event.addDomListener(window, 'load', initMap(data));
    document.getElementById("map").scrollIntoView()
  });

})();
