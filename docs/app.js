const d3 = require("../libreria/d3");

var asuntos = new Array (
        "Pago de la herencia de María Micaela de Zavala (José Joaquín)",
        "pago de la herencia de María Micaela de Zavala (Teresa)"
);
asuntos.reverse ();

function addComas (n) {
        var formatValue = d3.format (0,000);
        return formatValue (n)
        .replace(".",",")
        .replace(".",",")
}

var colores = new Array("#adff2f","#7fff00","#7CFC00");

function getColor(d) {
        return d > 10
        ? colores[3]
        : d > 3
        ? colores[2]
        : d > 5
        ? colores[1]
        : colores[0]
}

var div = d3
.select("#wrapper")
.append("div")
.attr("class", "tooltip")
.attr("opacity", 0);

var Wmap = 600;
var Hmap = 520;
var projection = d3.geo
.mercator()
.translate([410,2140])
.scale(2500);
var path = d3.geo.path().projection(projection);
var map = d3
.select("#mapa")
.append("svg")
.attr("width", Wmap)
.attr("height", Hmap);
d3.select("#asunto").html(
        "asuntos" + asuntos[asuntos.length - 1].substring(5)
      );
      d3.select("#Número-de-cartas").html(asuntos[asuntos.length - 1].substring(0, 4));
      var height = 330,
  width = 885,
  trans = 60;
var w = 950,
  h = 380;
var aux = asuntos.length - 1;
var width_slider = 920;
var height_slider = 50;
d3.csv("", function(data) {
d3.json("My-first-project\data\Mapa.json", function(json) {
        var svg = d3
        .select("#slider")
        .attr("class", "chart")
        .append("svg")
        .attr("width", width_slider)
        .attr("height", height_slider);
      var yeardomain = [0, asuntos.length - 1];
      var axisyears = [
        parseFloat(asuntos[0].substring(0, 4)),
        parseFloat(asuntos[0].substring(0, 4)),
        parseFloat(asuntos[0].substring(0, 4)),
        parseFloat(asuntos[asuntos.length - 1].substring(0, 4))
      ];
      var pointerdata = [
        {
          x: 0,
          y: 0
        },
        {
          x: 0,
          y: 25
        },
        {
          x: 25,
          y: 25
        },
        {
          x: 25,
          y: 0
        }
      ];
      var scale = d3.scale
      .linear()
      .domain(yeardomain)
      .rangeRound([0, width]);
    var x = d3.svg
      .axis()
      .scale(scale)
      .orient("top")
      .tickFormat(function(d) {
        return d;
      })
      .tickSize(0)
      .tickValues(axisyears);
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + 15 + ",0)")
      .call(x);
    var drag = d3.behavior
      .drag()
      .origin(function() {
        return {
          x: d3.select(this).attr("x"),
          y: d3.select(this).attr("y")
        };
      })
      .on("dragstart", dragstart)
      .on("drag", dragmove)
      .on("dragend", dragend);

    svg
      .append("g")
      .append("rect")
      .attr("class", "slideraxis")
      .attr("width", width_slider)
      .attr("height", 7)
      .attr("x", 0)
      .attr("y", 16);
    var cursor = svg
      .append("g")
      .attr("class", "move")
      .append("svg")
      .attr("x", width)
      .attr("y", 7)
      .attr("width", 30)
      .attr("height", 60);

    cursor.call(drag);
    var drawline = d3.svg
      .line()
      .x(function(d) {
        return d.x;
      })
      .y(function(d) {
        return d.y;
      })
      .interpolate("linear");
      cursor
      .append("path")
      .attr("class", "cursor")
      .attr("transform", "translate(" + 7 + ",0)")
      .attr("d", drawline(pointerdata));
    cursor.on("mouseover", function() {
      d3.select(".move").style("cursor", "hand");
    });

    function dragmove() {
      var x = Math.max(0, Math.min(width, d3.event.x));
      d3.select(this).attr("x", x);
      var z = parseInt(scale.invert(x));
      aux = z;
      drawMap(z);
    }
    function dragstart() {
        d3.select(".cursor").style("fill", "#D9886C");
      }

      function dragend() {
        d3.select(".cursor").style("fill", "");
      }
      for (var i = 0; i < data.length; i++) {
        var codeState = data[i].code;
        var dataValue = data[i][trimestres[trimestres.length - 1]];
        for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.code;
                if (codeState == jsonState) {
                  json.features[j].properties.value = dataValue;
                  break;
                }
              }
              var cont = map
              .selectAll("#mapa path")
              .data(json.features)
              .enter()
              .append("path")
              .attr("class", "path")
              .attr("d", path)
              .style("fill", function(d) {
                return getColor(d.properties.value);
              })
              .attr("fill-opacity", "1")
              .attr("stroke", "#202020")
              .attr("stroke-width", 0.3)
              .on("mouseover", mouseover)
              .on("mousemove", mousemove)
              .on("mouseout", mouseout);
              function mouseover(d) {
                d3.select(this)
                  .attr("stroke-width", "1px")
                  .attr("fill-opacity", "0.9");
                div.style("opacity", 0.9);
                div.html(
                  "<b>" +
                    d.properties.name +
                    "</b></br>Tasa paro: <b>" +
                    addComas(data[d.properties.code][trimestres[aux]]) +
                    "%</b> <br>" +
                    d.properties
                );
              }
        
              function mouseout(d) {
                d3.select(this)
                  .attr("stroke-width", ".3")
                  .attr("fill-opacity", "1");
                div.style("opacity", 0);
              }
        
              function mousemove(d) {
                div.style({
                  left: function() {
                    if (d3.event.pageX > 780) {
                      return d3.event.pageX - 180 + "px";
                    } else {
                      return d3.event.pageX + 23 + "px";
                    }
                  },
                  top: d3.event.pageY - 20 + "px"
                });
              }

              function drawMap(index) {
                d3.select("#asunto").html("asuntos" + asuntos[index].substring(5));
                d3.select("#Número-de-cartas").html(asuntos[index].substring(0, 4));
                cont.style("fill", function(d) {
                  for (var i = 0; i < data.length; i++) {
                    var codeState = data[i].code;
                    var dataValue = data[i][asuntos[index]];
                    for (var j = 0; j < json.features.length; j++) {
                      var jsonState = json.features[j].properties.code;
                      if (codeState == jsonState) {
                        json.features[j].properties.value = dataValue;
                        break;
                      }
                    }
                  }
                  var value = d.properties.value;
                  if (value) {
                    return getColor(value);
                  } else {
                    return "#ccc";
                  }
                });
                cont
                  .on("mousemove", function(d) {
                    div.style("opacity", 0.9);
                    div
                      .html(
                        "<b>" +
                          d.properties.name +
                          "</b></br>Numero de cartas: <b>" +
                          addComas(data[d.properties.code][asuntos[aux]]) +
                          "%</b> <br>" +
                          d.properties
                      )

                      .style("left", function() {
                        if (d3.event.pageX > 780) {
                          return d3.event.pageX - 180 + "px";
                        } else {
                          return d3.event.pageX + 23 + "px";
                        }
                      })
                      .style("top", d3.event.pageY - 20 + "px");
                  })
                  .on("mouseout", function() {
                    return div.style("opacity", 0);
                  })
                  .on("mouseout", mouseout)
                      }
                    }

                    function maxMin(d, index) {
                        d3.select("#total-cartas").html("");
                        var datos = [];
                        var provincia = [];
                        for (var i = 0; i < data.length - 1; i++) {
                                datos.push(d[i][trimestres[index]]);
                                provincia.push(d[i].state);
                              }
                              var max_min = d3.extent(datos);
                              console.log(max_min);
                        }
                });
              });
            
            d3.select("#wrapper").on("touchstart", function() {
              div
                .transition()
                .duration(100)
                .style("opacity", 0);
            });