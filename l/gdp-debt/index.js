$("#slider").slider({
	value:2013,
	min: 1973,
	max: 2013,
	step: 1,
	slide: function( event, ui ) {
		$("#year-label").text(ui.value);
		redraw(ui.value.toString());
	}
});

var countrydebt;
var isDebt = false;
	$("#year-label").text("2013");

d3.json("./data.json", function(d) {
  countrydebt = d;
});
var statedebt;
d3.json("./state_data.json", function(d) {
  statedebt = d;
});

var countrygdp;
d3.json("./countrygdp.json", function(d) {
  countrygdp = d;
});
	
$("#year").val($("#slider").slider("value") );
windowWidth = $(window).width();

var w = 720;
var h = 500;
var s = 120;
var factor = 60000.0;
var size = 10;
var Msize = 12;
if (windowWidth < 600) {
  w = windowWidth;
  s = 70;
  factor = 100000.0;
  size = 8;
  Msize = 10;
}

var stateMap = {
  NAC: "北美",
  LCN: "拉丁美洲",
  ECS: "歐洲＆中亞",
  MEA: "中東&北非",
  SSF: "撒哈拉以南非洲",
  SAS: "南亞",
  EAS: "亞太地區"
};

var color = "#1f77b4 ";

//var bar;
var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d["properties"]["name"] });
var stategdp = new Firebase('https://team7project2.firebaseio.com/');

var state_data = stategdp;
var scaleX  = d3.scale.linear().range([0, 320]);
var scalefactor = 1./factor;

var xy = d3.geo.equirectangular()
	.scale(s)
	.translate([w / 2, h / 2]);

var path = d3.geo.path()
	.projection(xy);
var svg = d3.select("#graph").insert("div").insert("svg")
	.attr("width", w)
	.attr("height", h);

var svgbar = d3.select("#bar").insert("div").insert("svg");
var barHeight = 27;	
var states = svg.append("g")
	.attr("id", "states");
states.call(tip);
var circles = svg.append("g")
	.attr("id", "circles")
	.style("fill","steelblue");
var labels = svg.append("g")
	.attr("id", "labels");
var centered;


d3.json('./geolist.json', function(data) {
	states.selectAll("path")
		.data(data.features)
	.enter().append("path")
		.attr("d", path)
		.on("mouseover", function(d) {
				tip.show(d);
				//d3.select(this).style("fill","#6C0");
		})
		.on("mouseout",function(d) {
				tip.hide(d);
				d3.select(this).style("fill","#F1EEE8");
		});
	states.selectAll("path")
		.attr("class",function(d) { return d["properties"]["name"]});
  });

GDP();

function GDP(){
  isDebt = false;
	$('#debt').removeClass("blue");
	$('#gdp').addClass("blue");
	state_data = stategdp;
	scalefactor=1./factor;

  state_data.on("value",function(gdp){
    circles.selectAll("circle")
      .data(gdp.val())
    .enter()
    .append("circle")
      .attr("class",function(d) { return d["Country Code"]})
      .attr("cx", function(d, i) { return xy([+d.longitude,+d.latitude])[0]; })
      .attr("cy", function(d, i) { return xy([+d.longitude,+d.latitude])[1]; })
      .attr("r",  function(d) { return (Math.sqrt(d[$("#slider").slider("value")]))*scalefactor; })				
        .on("mouseover",function(d){
              d3.select(this).style("fill","#4864B3");})
        .on("mouseout", function(d){
          d3.select(this).style("fill","steelblue");})
      .on("click", function(d){
        clicked(d);
        redrawbar(d, $("#slider").slider("value"));
      });
    labels.selectAll("text").remove();
    labels.selectAll("labels")
        .data(gdp.val())
      .enter()
      .append("text")
          .attr("x", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[0]; })
          .attr("y", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[1]-15; })
          .attr("dy", "1em")
          .attr("text-anchor", "middle")
      .append("tspan")
        .text(function(d) { 
          return stateMap[d["Country Code"]]; 
        })
        .attr("x", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[0]; })		
        .attr("dy", "1em")
    labels.selectAll("text")
      .append("tspan")
        .text(function(d) { 
          return Math.round(d[$("#slider").slider("value")]/1000000000)/1000 +  "兆美金"; 
        })
        .attr("x", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[0]; })
        .attr("dy", "1em")
    svgbar.selectAll("g").remove();
    bardraw(gdp.val(), $("#slider").slider("value"));
    redraw($("#slider").slider("value"));
  });
}

function DEBT(){
  isDebt = true;
	$('#debt').addClass("blue");
	$('#gdp').removeClass("blue");

	scalefactor= 1.0 / (factor / 3);

  var data = statedebt;

	circles.selectAll("circle")
		.data(data)
	.enter()
	.append("circle")
		.attr("class",function(d) { return d["Country Code"]})
		.attr("cx", function(d, i) { return xy([+d.longitude,+d.latitude])[0]; })
		.attr("cy", function(d, i) { return xy([+d.longitude,+d.latitude])[1]; })
		.attr("r",  function(d) { return (Math.sqrt(d[$("#slider").slider("value")]))*scalefactor; })				
			.on("mouseover",function(d){
       d3.select(this).style("fill","#4864B3");
      })
			.on("mouseout", function(d){
				d3.select(this).style("fill","steelblue");})
		.on("click", function(d){
			clicked(d);
			redrawbar(d, $("#slider").slider("value"));
		});
	labels.selectAll("text").remove();
	labels.selectAll("labels")
      .data(data)
    .enter()
    .append("text")
        .attr("x", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[0]; })
        .attr("y", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[1]-15; })
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
		.append("tspan")
			.text(function(d) { 
			    return stateMap[d["Country Code"]];
			})
			.attr("x", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[0]; })		
			.attr("dy", "1em")
	labels.selectAll("text")
		.append("tspan")
      .text(function(d) { 
			  return Math.round(d[$("#slider").slider("value")]/1000000000)/1000 +  "兆美金"; 
      })
			.attr("x", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[0]; })
			.attr("dy", "1em")
	svgbar.selectAll("g").remove();
	bardraw(data, $("#slider").slider("value"));
	redraw($("#slider").slider("value"));
}


function clicked(d){
	var x, y, k
	q = xy("500","250")[0];
	z = xy("500","250")[1];
	if (d&&centered!==d.longitude) {
		x = xy([+d.longitude,+d.latitude])[0];
		y = xy([+d.longitude,+d.latitude])[1];
		k = 2;
		centered = d.longitude;
		d3.selectAll("circle").style("visibility","hidden");
		d3.select("circle."+d["Country Code"])
			.style("visibility","visible")
			.on("mouseover",function(d){
      })
			.on("mouseout", function(d){
			});


	} else {

		x = q;
		y = z;
		k = 1;
		centered = null;

		$('text').remove();
		d3.selectAll("circle").style("visibility","visible")
		d3.select("circle."+d["Country Code"])
			.style("fill","steelblue")
			.on("mouseover",function(d){
       d3.select(this).style("fill","#4864B3");
      })
			.on("mouseout", function(d){
				d3.select("circle."+d["Country Code"]).style("fill","steelblue");})
		state_data.on("value",function(gdp){
    var data = gdp.val();
    if (isDebt)
      data = statedebt;
			labels.selectAll("labels")
				.data(data)
			.enter()
			.append("text")
					.attr("x", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[0]; })
					.attr("y", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[1]-15; })
					.attr("dy", "0.5em")
					.attr("text-anchor", "middle")
					.append("tspan")
						.text(function(d) { 
			        return stateMap[d["Country Code"]];
						})
						.attr("x", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[0]; })		
						.attr("dy", "1em")
			      .style("font-size", Msize);

			labels.selectAll("text")
				.append("tspan")
          .text(function(d) { 
			      return Math.round(d[$("#slider").slider("value")]/1000000000)/1000 +  "兆美金"; 
          })
					.attr("x", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[0]; })
					.attr("dy", "1.5em")
			    .style("font-size", size);
		});
	}
	states.classed("active", centered)
	circles.classed("active", centered)
	labels.classed("active", centered)
	states.transition()
		.duration(750)
		.attr("transform", "translate(" + q + "," + z + ")scale(" + k + ")translate(" + -x + "," + -y +  ")")
		
	circles.transition()
		.duration(750)
		.attr("transform", "translate(" + q + "," + z + ")scale(" + k + ")translate(" + -x + "," + -y +  ")")
		.style("stroke-width", 1.5 / k + "px")
	labels.transition()
		.duration(750)
		.attr("transform", "translate(" + q + "," + z + ")scale(" + k + ")translate(" + -x + "," + -y +  ")")		
}
function bardraw(d, year){
	var dataset = [];
	var datasetbar = [];
	var bar =svgbar.attr("width", '400').attr("height", '320')
			.selectAll("g")
				.data(d)
			.enter().append("g")
				.attr("transform",function(d, i) { 
					dataset.push(Math.round(d[year]/1000000));
					datasetbar.push(Math.round(d["2013"]/1000000));
					return "translate(0," + i *barHeight + ")";
				 })

	var max = d3.max(datasetbar);	
	scaleX.domain([0,d3.max(datasetbar)]);
	
	bar.append("rect")
		.style("fill", color)
		.attr("width", function(d) { 
		  return scaleX(d[year]/1000000);
		})
    .attr("height", barHeight - 1)			
    .on("mouseover", function(d){
        circles.select("circle."+d["Country Code"] )
        .style("fill","#4864B3");})
    .on("mouseout", function(d){
        circles.select("circle."+d["Country Code"] )
        .style("fill","steelblue");})

    bar.append("text")				
      //.attr("x",function(d) { return scaleX(d[year]/1000000)+10;})
      .attr("x",function(d) { return 10;})
      .attr("y", barHeight / 2)
      .attr("dy", ".5em")
      .text(function(d) { 
				  return d["Country Name"] + " " + (Math.round(d[year]/1000000000))/1000 + '兆美金';
      });

    sortbar(d,bar,dataset);
}
function redrawbar(d,year){

	var dataset = [];
	var datasetbar = [];
	var range = d["Country Code"];

	if (d&&centered===d.longitude) {
	  console.log(d);
    var data;
    if (isDebt) {
      data = countrydebt;
    }
    else {
      data = countrygdp;
    }

    svgbar.transition()
      .attr("width", w)
      .attr("height", function(d){return 320;})
    svgbar.selectAll("g").remove();
    var bar =svgbar.attr("width", w).attr("height", 320)
      .selectAll("g")
        .data(data[range])
      .enter().append("g")
        .attr("transform",function(d, i) { 
          dataset.push(Math.round(d[year]/1000000));
          datasetbar.push(Math.round(d["2013"]/1000000));
          return "translate(0," + i *barHeight + ")"; })
    scaleX.domain([0,d3.max(datasetbar)]);				
    bar.append("rect")
      .style("fill", color)
        .attr("width", function(d) { return scaleX(d[year]/1000000);})
        .attr("height", barHeight - 1)
        .on("mouseover",function(d){
          states.selectAll("path."+d["Country Name"])
            .style("fill","#4864B3");
        })
        .on("mouseout",function(d){
          states.selectAll("path."+d["Country Name"])
            .style("fill","#F1EEE8");
        })

    bar.append("text")				
      .attr("x", 10)
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) {
        return d["Country Name"] + " " + (Math.round(d[year]/1000000000)) + '億美金';
      })

    sortbar(data[range],bar,dataset);
  }
	else{
		svgbar.selectAll("g").remove();
		state_data.on("value",function(gdp){
			bardraw(gdp.val(), $("#slider").slider("value"));
		});
	}
}
function sortbar(d,bar,dataset){
	var index = d3.range(d.length);
	var sortnum = d3.range(d.length);
	index.sort(function(a, b) { 
		return dataset[a] - dataset[b];
	});
	index.reverse();
	sortnum.sort(function(a, b) { 
		return index[a] - index[b];
	});
	bar.transition()				
		.duration(750)
		.delay(function(d, i) { return i * 50; })
		.attr("transform", function(d, i) { return "translate(0," + sortnum[i]*barHeight + ")"; });
};
function redraw(year) {
	circles.selectAll("circle")
	.transition()
		.duration(1000).ease("linear")
		 .attr("r",  function(d) { 
		   return 15+(Math.sqrt(d[year]))*scalefactor ; })
	labels.selectAll("text")
			.text(function(d) { 
			  return stateMap[d["Country Code"]];
			})
			.attr("x", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[0]; })		
			.attr("dy", "1em")
			.style("font-size", Msize);

	labels.selectAll("text")
		.append("tspan")
			.text(function(d) { 
			  return Math.round(d[year]/1000000000)/1000 +  "兆美金"; 
			})
			.attr("x", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[0]; })
			.style("font-size", size)
			.attr("dy", "1.5em")

	svgbar.selectAll("rect")
	.transition()
		.duration(100)
			.attr("width", function(d) { return scaleX(d[year]/1000000);})
	svgbar.selectAll("text")
	.transition()
		.duration(100)
			.attr("x",function(d) { return 20;})
			.text(function(d) { 
				  return d["Country Name"] + " " + (Math.round(d[year]/1000000000))/1000 + '兆美金';
			})
};
