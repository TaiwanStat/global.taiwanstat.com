$.getJSON('country_abbr.json', function(country_abbr) {
  var lang;
  $.getJSON('lang.json', function(_lang) {
    lang = _lang;
  });

  $.getJSON('boca_gov_notice.json', function(gov_notice) {
    var alert_data = {};
    $('#updateAt').text(' '+gov_notice.update);

    $.each(gov_notice, function(country, props) {
      var alert_color = props.level;
      country = country.split(',')[0].replace(/\s+$/, '');

      if (!country_abbr.hasOwnProperty(country)) {
      console.log(country);
        return;
      }

      if (alert_color === 0) {
        alert_data[country_abbr[country]] = {
          'fillKey': 'Gray_alert',
        };
      }
      else if (alert_color == 1) {
        alert_data[country_abbr[country]] = {
          'fillKey': 'Yellow_alert',
        };
      }
      else if (alert_color == 2) {
        alert_data[country_abbr[country]] = {
          'fillKey': 'Orange_alert',
        };
      }
      else if (alert_color == 3) {
        alert_data[country_abbr[country]] = {
          'fillKey': 'Red_alert',
        };
      }
      alert_data[country_abbr[country]].reason = props.reason;
    });
    var height = 500;
    if ($(window).width() < 600) {
      height = 250;
    }

    var map = new Datamap({
      element: document.getElementById('container'),
      width: $('#container').width(),
      height: height,
      fills: {
        Gray_alert: '#7f7f7f',
        Yellow_alert: '#F3D764',
        Orange_alert: '#ff7f0e',
        Red_alert: '#d62728',
        defaultFill: '#abdda4'
      },
      borderColor: '#FDFDFD',
      data: alert_data,
      geographyConfig: {
        popupTemplate: function(geography, data) { 
          var name = geography.properties.name;
          var twName = '';
          if (lang.hasOwnProperty(name))
            twName = ' ' + lang[name].tw;

          if (data && data.reason) {
            return '<div class="hoverinfo msg">' + 
              '<h5>國名：' + name + twName + '</h5>' +
              data.reason + '';
          }
          return '<div class="hoverinfo">' + name + twName + '</div>';
        }
      }
    });
  });
});


