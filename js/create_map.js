var width = 700, height = 550;

const path = d3.geoPath();

const projection1 = d3.geoConicConformal() // Lambert-93
    .center([2.454071, 46.279229]) // Center on France
    .scale(2600)
    .translate([width / 2 - 50, height / 2]);

path.projection(projection1);

const svg = d3.select('#map').append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "Greens");

const deps = svg.append("g");


function transform(data){

  var dateControl = document.querySelector('input[type="date"]');

  var dateEntered = new Date(dateControl.value);

  var day = dateEntered.getDate();
  day = day-1;


var station = data[day]["station"];
var result = station.map(function(elt){
  return {lat : elt.lat,
          lng : elt.lng,
          name : elt.n,
          temp : elt.t / 100}
});

return result;
};

function drawCircles(data) {

  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  var project = d3.geoConicConformal()
  .center([2.454071, 46.279229]) // Center on France
  .scale(2600)
  .translate([width / 2 - 50, height / 2]);

        svg.selectAll("circle")
       //3.2 Joignons les données à la sélection
        .data(data)
       //3.3 Lions les données à la sélection
        .join("circle")
           // Ajoutons les éléments SVG

       //3.4 Modifions les attributs de nos cercles en fonction des données
           .attr("cy",  function (d) {  return project([d.lng,d.lat])[1]; }) // Le centre du cercle à 60px du haut de mon SVG
           .attr("cx",  function (d) {  return project([d.lng,d.lat])[0]; })
           .attr("r", "3px")
           .attr("fill", "red")
           .on("mouseover",function affiche(e,i){
             div.transition()
                 .duration(200)
                 .style("opacity", .9);
             div.html("<b>ville </b>" + e.name + "<br>" +
           "<b>Température </b>" + e.temp + "<br>")
                 .style("left", (d3.event.pageX + 30) + "px")
                 .style("top", (d3.event.pageY - 30) + "px");
           })
           .on("mouseout", function(d) {
                   div.style("opacity", 0);
                   div.html("")
                       .style("left", "-500px")
                       .style("top", "-500px");
                });
}

function drawMap(){
var promises = [];
promises.push(d3.json('ressources/departments.json'));
promises.push(d3.csv("ressources/population.csv"));
promises.push(d3.json("ressources/meteo.json"));
Promise.all(promises).then(function(values) {
    const geojson = values[0]; // Récupération de la première promesse : le contenu du fichier JSON
    const csv = values[1]; // Récupération de la deuxième promesse : le contenu du fichier csv
    const metjson = values[2];

    var features = deps
        .selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr('id', function(d) {return "d" + d.properties.CODE_DEPT;})
        .attr("d", path);

        result = transform(metjson);
drawCircles(result);

        // deps
        // .selectAll("path")
        // .data(result)
        // .enter()
        // .append("circle")
        // 		.attr("cx", function (d) {  return projection(d)[0]; })
        // 		.attr("cy", function (d) { return projection(d)[1]; })
        // 		.attr("r", "8px")
        // 		.attr("fill", "red");

var quantile = d3.scaleQuantile()
    .domain([0, d3.max(csv, function(e) { return +e.POP; })])
    .range(d3.range(9));

var legend = svg.append('g')
    .attr('transform', 'translate(525, 150)')
    .attr('id', 'legend');

legend.selectAll('.colorbar')
    .data(d3.range(9))
    .enter().append('svg:rect')
        .attr('y', function(d) { return d * 20 + 'px'; })
        .attr('height', '20px')
        .attr('width', '20px')
        .attr('x', '0px')
        .attr("class", function(d) { return "q" + d + "-9"; });

var legendScale = d3.scaleLinear()
    .domain([0, d3.max(csv, function(e) { return +e.POP; })])
    .range([0, 9 * 20]);

var legendAxis = svg.append("g")
  .attr('transform', 'translate(550, 150)')
  .call(d3.axisRight(legendScale).ticks(6));

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


// metjson.forEach(function(e,i) {
//     d3.select()
//         .attr("class", function(d) { return "department q" + quantile(+e.POP) + "-9"; })
//         .on("mouseover", function(d) {
//             div.transition()
//                 .duration(200)
//                 .style("opacity", .9);
//             div.html("<b>Région : </b>" + e.NOM_REGION + "<br>"
//                     + "<b>Département : </b>" + e.NOM_DEPT + "<br>"
//                     + "<b>Population : </b>" + e.POP + "<br>")
//                 .style("left", (d3.event.pageX + 30) + "px")
//                 .style("top", (d3.event.pageY - 30) + "px");
//         })
//         .on("mouseout", function(d) {
//                 div.style("opacity", 0);
//                 div.html("")
//                     .style("left", "-500px")
//                     .style("top", "-500px");
//         });
// });


csv.forEach(function(e,i) {
    d3.select("#d" + e.CODE_DEPT)
        .attr("class", function(d) { return "department q" + quantile(+e.POP) + "-9"; })
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("<b>Région : </b>" + e.NOM_REGION + "<br>"
                    + "<b>Département : </b>" + e.NOM_DEPT + "<br>"
                    + "<b>Population : </b>" + e.POP + "<br>")
                .style("left", (d3.event.pageX + 30) + "px")
                .style("top", (d3.event.pageY - 30) + "px");
        })

        .on("mouseout", function(d) {
                div.style("opacity", 0);
                div.html("")
                    .style("left", "-500px")
                    .style("top", "-500px");
        });
});




d3.select("select").on("change", function() {
    d3.selectAll("svg").attr("class", this.value);
});
});
}

drawMap();
