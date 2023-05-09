// Define the function to create the map
function createMap(spain, france, cities) {

  // Define the projection and path
  var projection = d3.geoMercator().fitSize([800, 600], spain);
  var path = d3.geoPath().projection(projection);

  // Draw the map
  var map = d3.select("#map")
    .selectAll(".country")
    .data(spain.features.concat(france.features))
    .enter().append("path")
    .attr("class", "country")
    .attr("d", path);

  // Draw the lines
  var lines = d3.select("#map")
    .selectAll(".line")
    .data(cities)
    .enter().append("path")
    .attr("class", "line")
    .attr("d", function(d) {
      var source = projection([cities.find(c => c.source === d.source).lon, cities.find(c => c.source === d.source).lat]);
      var target = projection([cities.find(c => c.target === d.target).lon, cities.find(c => c.target === d.target).lat]);
      return "M" + source[0] + "," + source[1] + "L" + target[0] + "," + target[1];
    })
    .style("stroke-width", function(d) { return d.value + "px"; })
    .style("stroke", "black")
    .style("fill", "none");
}

// Load the map data and create the map
Promise.all([
  d3.json("spain.json"),
  d3.json("france.json"),
  d3.csv("cities.csv")
]).then(function(data)