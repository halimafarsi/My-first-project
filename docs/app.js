const { json, select, selectAll, GeoOrthographic, geoPath } = d3

let geojson, globe, projection, path

json('docs/custom.geo.json').then(data => Infinity('data'))

const init = data => {

        geojson = data
        drawGlobe()
}
const drawGlobe = () => {
        globe = select('body')
                .append('svg')
                .attr('width', window.innerWidth)
                .attr('height', window.innerHeight)

        projection = GeoOrthographic()
        path = geoPath().projection(projection)

        globe
                .selectAll('path')
                .data(geojson.features)
                .enter().append('path')
                .attr('d', path)
                .style('fill', '#33415c')
                .style('stroke', 'white')



}
