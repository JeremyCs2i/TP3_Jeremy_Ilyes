const width = 700, height = 550;

const path = d3.geoPath();

const projection = d3.geoConicConformal() // Lambert-93
    .center([2.454071, 46.279229]) // Center on France
    .scale(2600)
    .translate([width / 2, height / 2]);

path.projection(projection);

const svg = d3.select('#map').append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height);

const deps = svg.append("g");

d3.json('departments.json').then(function(geojson) {
    deps.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path);
});

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.json('departments.json').then(function(geojson) {			
        deps.selectAll("path")
            .data(geojson.features)
            .enter()
            .append("path")
            .attr('class', 'department')
            .attr("d", path)
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html("Département : " + d.properties.NOM_DEPT + "<br/>"
                      +  "Région : " + d.properties.NOM_REGION)
                    .style("left", (d3.event.pageX + 30) + "px")
                    .style("top", (d3.event.pageY - 30) + "px")
            })
            .on("mouseout", function(d) {
                div.style("opacity", 0);
                div.html("")
                    .style("left", "-500px")
                    .style("top", "-500px");
            });
    });
