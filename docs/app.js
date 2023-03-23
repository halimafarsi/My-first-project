const { json, select, selectAll, geoStereographic, geoPath } = d3

let geojson, Map, projection, path

json('data\Mapa.json').then(data => init(data))

const init = data => {

        geojson = data
        drawMap()
}
const drawMap = () => {
        Map = select('body')
                .append('svg')
                .attr('width', window.innerWidth)
                .attr('height', window.innerHeight)

        projection = d3.geoStereographic()
        path = geoPath().projection(projection)

        globe
                .selectAll('path')
                .data(geojson.features)
                .enter().append('path')
                .attr('d', path)
                .style('fill', '#33415c')
                .style('stroke', 'white')



}
