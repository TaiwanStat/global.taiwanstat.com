;(function() {

  var width = 1000,
      height = 700;

  var projection = d3.geo.mercator()
    .scale((width + 1) / 2 / Math.PI)
    .translate([width / 2, height / 2])
    .precision(.1);

  var colors = ["rgb(0,104,55)", "rgb(26,152,80)", "rgb(102,189,99)", "rgb(166,217,106)", "rgb(217,239,139)", "rgb(255,255,191)", "rgb(254,224,139)", "rgb(253,174,97)", "rgb(244,109,67)", "rgb(215,48,39)", "rgb(165,0,38)"];

  var color = d3.scale.quantize()
      .domain([0, 1])
      .range(colors);

  var graticule = d3.geo.graticule();

  var canvas = d3.select("#map").append("canvas")
      .attr("width", width)
      .attr("height", height);

  var context = canvas.node().getContext("2d");

  var path = d3.geo.path()
      .projection(projection)
      .context(context);

  var gdp_context = canvas.node().getContext("2d");

  var gdp_path = d3.geo.path()
      .projection(projection)
      .context(context);

   // slider

  var slider_width = 700;
  var years = d3.range(1960, 2014);

  var x = d3.scale.ordinal()
      .domain(years)
      .rangePoints([0, slider_width])

  var xAxis = d3.svg.axis()
      .scale(x)
      .tickValues(x.domain())
      .orient("bottom");

  var dispatch = d3.dispatch("sliderChangePosition");

  var slider = d3.select(".slider")
      .style("width", slider_width + "px")

  var sliderTray = slider.append("div")
      .attr("class", "slider-tray");

  var sliderHandle = slider.append("div")
      .attr("class", "slider-handle");

  var sliderScale = slider.append('div')
      .attr("id", "slider-scale");

  var sliderScaleSvg = sliderScale.append('svg')
      .attr('width', slider_width + 100)
      .attr('height', 60);

  sliderHandle.append("div")
      .attr("class", "slider-handle-icon")

  var sliderScaleg = sliderScaleSvg.append("g")
      .attr("class", "slider-key")
      .attr('transform', 'translate(30, 0)')

  sliderScaleg.call(xAxis)
    .selectAll('text')
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)" );

  slider.call(d3.behavior.drag()
      .on("dragstart", function() {
        var x_mouse = d3.mouse(sliderTray.node())[0];

        dispatch.sliderChangePosition(x_mouse);
        d3.event.sourceEvent.preventDefault();
      })
      .on("drag", function() {
        var x_mouse = d3.mouse(sliderTray.node())[0];

        dispatch.sliderChangePosition(x_mouse);
      }));



  queue()
    .defer(d3.json, "/global/map/world-110m.json")
    .defer(d3.json, "/global/map/world.geo.json")
    .defer(d3.csv, './data/gdp_growth.csv')
    .await(ready);


  function ready(err, topo, data, gdp) {
    if(err) throw err;

    var land = topojson.feature(topo, topo.objects.land)
    var grid = graticule();

    var start_date = 1960;


    var change_map = function() {

      d3.select('#scale').html('');

      var gdp_date = gdp.map(function(d) {
        return d[start_date];
      })

      var new_features = [];

      data.features.forEach(function(d) {
        gdp.forEach(function(g_val) {
          if(d.id === g_val["Country Code"]) {
            d.properties[start_date] = g_val[start_date];
            new_features.push(d)
          }
        })
      })

      var color_scale = d3.scale.linear()
          .domain([0, d3.max(gdp_date)]);

      var x = d3.scale.linear()
          .domain([0, d3.max(gdp_date)])
          .range([0, 330]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .tickValues(x.domain())
          .orient("bottom");

      var svg = d3.select('#scale')
        .append('svg')
        .attr("width", 400)
        .attr('height', 100);

      var g = svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(40,40)");

      g.selectAll("rect")
        .data(colors)
        .enter().append("rect")
        .attr("height", 10)
        .attr("x", function(d, i) { return 30 * i; })
        .attr("y", -3)
        .attr("width", "30")
        .attr("fill", function(d) { return d; });

      g.call(xAxis).append("text")
        .attr("class", "caption")
        .attr("y", -10)
        .text("GDP 成長率 (%)");

      context.clearRect(0, 0, width, height);
      gdp_context.clearRect(0, 0, width, height);

      context.beginPath();
      path(data);
      context.fillStyle = "#dadac4";
      context.fill();

      context.beginPath();
      path(grid);
      context.lineWidth = .5;
      context.strokeStyle = "rgba(119,119,119,.5)";
      context.stroke();

      context.beginPath();
      path(land);
      context.fillStyle = "#737368";
      context.fill();

      context.beginPath();
      path(data);
      context.lineWidth = .5;
      context.strokeStyle = "#000";
      context.stroke();

      new_features.forEach(function(d) {
        gdp_context.beginPath();
        gdp_path(d);

        if(color_scale(d.properties[start_date]) == "")
          gdp_context.fillStyle = "#333";
        else
          gdp_context.fillStyle = color(color_scale(d.properties[start_date]));

        gdp_context.fill();
      })

      d3.select('#chart-title-year').html(start_date);

      var unit = (slider_width / years.length);
      sliderHandle.style("left", unit * (start_date - 1960) + "px")

      if(start_date !== 2014) {
        start_date++;
      }else {
        clearInterval(loop_map)
      }

    }

    dispatch.on("sliderChangePosition.slider", function(value) {

      if(value > slider_width){
        sliderHandle.style("left", "500px")
        value = 500;
      } else if (value < 0) {
        sliderHandle.style("left", "0px")
        value = 0;
      } else {
        sliderHandle.style("left", value + "px")
      }

      var count = Math.round(value / (slider_width / years.length));
      clearInterval(loop_map);
      loop_map = '';
      start_date = 1960 + count;
      change_map();

    });

    var loop_map = setInterval(change_map, 1000);

    $('#stop-btn').click(function() {
      clearInterval(loop_map);
      loop_map = '';
    })

    $('#start-btn').click(function() {
      if(loop_map === '')
        loop_map = setInterval(change_map, 1000);
    })

    $('#restart-btn').click(function() {
      clearInterval(loop_map);
      loop_map = '';
      start_date = 1960;
      loop_map = setInterval(change_map, 1000);
    })
  }



})();
