// Configuración del mapa
var width = 800; // Ancho del mapa
var height = 600; // Alto del mapa



// Cargar el archivo JSON con los datos geográficos de España y Francia
d3.json("https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/spain-provinces.geojson").then(function(data) {
  // Crear una proyección geográfica
  var projection = d3.geoMercator().fitSize([width, height], data);

  // Crear una ruta generadora de líneas para dibujar las fronteras
  var path = d3.geoPath().projection(projection);

  // Dibujar las fronteras de los países
  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", "none")
    .style("stroke", "black");

  // Resto del código para el mapa interactivo y las funcionalidades adicionales...
});

// 3. Crear botón de selección para elegir un asunto
var select = d3.select("#asuntoSelect");
var mostrarViajeBtn = d3.select("#mostrarViajeBtn");

mostrarViajeBtn.on("click", function() {
  var selectedAsunto = select.property("value");

  // Ocultar todas las líneas
  lineas.style("opacity", 0);

  // Mostrar las líneas correspondientes al asunto seleccionado
  lineas.filter(function(d) { return d.Asunto === selectedAsunto; })
    .style("opacity", 1);
});

// Crear el lienzo SVG
var svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Configuración de colores del siglo XIX
var colorAsunto = d3.scaleOrdinal()
  .domain(["Reparto de bienes", "Pensión de Viudead"])
  .range(["#ff0000", "#00ff00"]);

// Cargar los datos del archivo CSV
d3.csv("datavisualiz-\data\test.csv", function(data) {
  // Parseo de los datos
  data.forEach(function(d) {
    // Convertir columnas numéricas a números
    d.LongOrigen = parseFloat(d.LongOrigen);
    d.LatOrigen = parseFloat(d.LatOrigen);
    d.LongDestino = parseFloat(d.LongDestino);
    d.LatDestino = parseFloat(d.LatDestino);

    // Convertir columna de fecha a objeto Date
    d.Fecha = new Date(d.Fecha);
  });

  // 4. Obtener los puntos de coordenadas precisas
  //    para cada asunto y dibujar los puntos en el mapa
  var puntos = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return d.LongOrigen; })
    .attr("cy", function(d) { return d.LatOrigen; })
    .attr("r", 5) // Tamaño de los puntos
    .style("fill", function(d) { return colorAsunto(d.Asunto); })
    .style("opacity", 0.5);

  // 5. Crear líneas de viaje entre ciudades
  var lineas = svg.selectAll("line")
  .data(data)
  .enter()
  .append("line")
    .attr("x1", function(d) { return d.LongOrigen; })
    .attr("y1", function(d) { return d.LatOrigen; })
    .attr("x2", function(d) { return d.LongDestino; })
    .attr("y2", function(d) { return d.LatDestino; })
    .style("stroke", function(d) { return colorAsunto(d.Asunto); })
    .style("stroke-width", 2)
    .style("opacity", 0);

  // 6. Mostrar datos adicionales al colocar el ratón sobre una ciudad
  puntos.on("mouseover", function(d) {
    // Mostrar tooltip con los datos de la carta
    tooltip.html("Fecha: " + d.Fecha + "<br>"
      + "Origen: " + d.Origen + "<br>"
      + "Destino: " + d.Destino + "<br>"
      + "Remitente: " + d.Remitente + "<br>"
      + "Receptor: " + d.Receptor + "<br>"
      + "ID de carta: " + d.IDCarta)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px")
      .style("opacity", 1);
  }).on("mouseout", function(d) {
    // Ocultar tooltip al quitar el ratón de la ciudad
    tooltip.style("opacity", 0);
  });

  // 3. Crear botón de selección para elegir un asunto
  var asuntos = d3.map(data, function(d) { return d.Asunto; }).keys();
  var select = d3.select("#asuntoSelect")
    .append("select")
    .on("change", function() {
      var selectedAsunto = this.value;
      // Ocultar todas las líneas
      lineas.style("opacity", 0);
      // Mostrar las líneas correspondientes al asunto seleccionado
      lineas.filter(function(d) { return d.Asunto === selectedAsunto; })
        .style("opacity", 1);
    });

  select.selectAll("option")
    .data(asuntos)
    .enter()
    .append("option")
    .text(function(d) { return d; });

  // 7. Crear tooltip con fechas desde 1831 hasta 1842
  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var fechaTooltip = tooltip.append("div")
    .attr("class", "fecha-tooltip");

  fechaTooltip.selectAll("span")
    .data(d3.range(1831, 1843))
    .enter()
    .append("span")
    .text(function(d) { return d; })
    .on("click", function(d) {
      // 8. Mostrar cartas escritas en la fecha seleccionada
      puntos.style("opacity", function(d) {
        return d.Fecha.includes(d3.format("02")(d)) ? 1 : 0;
      });
    });
});
