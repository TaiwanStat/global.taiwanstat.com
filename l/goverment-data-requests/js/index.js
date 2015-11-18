(function(window) {

  var diameter = $('#chart').width(),
    format = d3.format(",d"),
    color = d3.scale.category20c();
  var height = $(window).height() + 150;
  var key = 'Requests_for_User_Data';
  var data;
  var font_size = '12px';

  var padding = 48;
  if (diameter < 600) {
    diameter = $(window).width() - 20;
    padding = 220;
    font_size = '9px';
  }

  var bubble = d3.layout.pack()
      .sort(null)
      .size([diameter, height])
      .padding(padding);

  var svg = d3.select("#chart").append("svg")
      .attr("width", diameter)
      .attr("height", height + 200)
      .attr("class", "bubble");
      
  var tooltip = d3.select("#chart")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("color", "white")
      .style("padding", "8px")
      .style("background-color", "rgba(0, 0, 0, 0.75)")

      .style("border-radius", "6px")
      .style("font", "12px sans-serif")
      .text("tooltip");

  d3.json("./data/data.json", function(error, d) {
    data = d;
    draw(data);
  });

  function draw(data) {

    var node = svg.selectAll(".node")
        .data(bubble.nodes(classes(data))
        .filter(function(d) { return !d.children; }))
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
        .attr("r", function(d) { return d.r + 10; })
        .attr("class", function(d) { return d.className; }) 
        .style("fill", function(d) { 
          return d.color; 
        })
        .on("mouseover", function(d) {
          tooltip.text(d.className + ": " + format(d.value));
          tooltip.style("visibility", "visible");
           d3.select(this).style('stroke', '#000');
           d3.select(this).style('stroke-width', '2');
        })
        .on("mousemove", function() {
            return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
        })
        .on("mouseout", function(){
          d3.select(this).style('stroke', '');
          return tooltip.style("visibility", "hidden");}
        );

    if ($(window).width() > 600) {
      d3.select('.台灣').style('stroke', '#222');
      d3.select('.台灣').style('stroke-width', '3');
    }

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .style('font-size', font_size)
        .style('z-index', '20')
        .text(function(d) {
          return d.className; 
        });
    d3.select(self.frameElement).style("height", diameter + "px");
  }

  function classes(data) {
    var reformat = [];

    data.forEach(function(child) {
      var value = child.Requests_for_User_Data;
      var color;
      if (value < 500) {
        color = '#aec7e8';
      }
      else if (value < 1000) {
        color = '#1f77b4';
      }
      else if (value < 5000) {
        color = '#ff9896';
      }
      else if (value < 10000) {
        color = '#ffbb78';
      }
      else if (value < 50000){
        color = '#ff7f0e';
      }
      else {
        color = '#d62728';
      }

      reformat.push({
        color: color,
        className: child.country, 
        value: child[key]
      });
    });

    return {children: reformat};
  }
  $('.checkbox')
    .checkbox({
      onChange: function() {
        var checkboxs = $(this);
        checkboxs.each(function(i) {
          if (checkboxs[i].checked) {
            key = checkboxs[i].value;
            $('svg').empty();
            draw(data);
          }
        });
      }
    });
  $(window).resize(function(){ 
    diameter = $('#chart').width();
    height = $(window).height() + 150;
    $('#chart').empty();
    bubble = d3.layout.pack()
      .sort(null)
      .size([diameter, height])
      .padding(padding);

    svg = d3.select("#chart").append("svg")
      .attr("width", diameter)
      .attr("height", height + 200)
      .attr("class", "bubble");

    tooltip = d3.select("#chart")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("color", "white")
      .style("padding", "8px")
      .style("background-color", "rgba(0, 0, 0, 0.75)")

      .style("border-radius", "6px")
      .style("font", "12px sans-serif")
      .text("tooltip");

    draw(data);
  });

})(window);
