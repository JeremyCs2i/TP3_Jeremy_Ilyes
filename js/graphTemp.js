var margin = {top: 40, right: 30, bottom: 30, left: 50};
var width2 = 500, height2 = 350;

var greyColor = "#898989";
var barColor = d3.interpolateInferno(0.4);
var highlightColor = d3.interpolateInferno(0.3);

var svg2 = d3.select("#chart").append("svg")
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .range([0, width2])
            .padding(0.4);
    var xAxis = svg2.append("g")
      .attr("transform", "translate(0," + height2 + ")")

    var y = d3.scaleLinear()
        .domain([-20,35])
        .range([height2, 0]);
    var yAxis = d3.axisLeft(y).tickSize([]).tickPadding(10);

function update(){
  var dataset = [];
  dataset.push(d3.json("ressources/meteo.json"));
  //
  var input = document.getElementById("date").value;
  var dateEntered = new Date(input);
  var day = dateEntered.getDate();
  day = day-1;
  // var val = document.getElementById("stations").value;
  var lab = document.getElementById("monLab");
  var labd = day + 1;
  var lab2 = document.getElementById("name_sta").textContent;

  if (lab2 == "") {
    lab2="NICE";
  }

  lab.textContent = "Tmpérature en C° à " + lab2 + " le " + labd +" février";
  Promise.all(dataset).then(function(data) {

    const sta = data[0][day]["station"];

    var index = sta.findIndex(function(item, i){
      return item.n === lab2
    });

    if (index == -1) {
      index = 0
    }

    const hours = data[0][day]["station"][index].hours;
    for (var i = 0; i < hours.length; i++) {
      hours[i].t = hours[i].t/100;
    }



    x.domain(hours.map( d => { return d.h; }))
    xAxis.call(d3.axisBottom(x))



    y.domain([-20,35]);


    svg2.append("g")
        .attr("class","y axis")
        .call(yAxis);

    svg2.selectAll(".bar")
        .data(hours)
        .enter().append("rect")
        .attr("class", "bar")
        .style("display", d => { return d.t === null ? "none" : null; })
        .style("fill",  d => {
            return d.t === d3.max(hours,  d => { return d.t; })
            ? highlightColor : barColor
            })
        .attr("x",  d => { return x(d.h); })
        .attr("width", x.bandwidth())
            .attr("y",  d => { return height2; })
            .attr("height", 0)
                .transition()
                .duration(750)
                .delay(function (d, i) {
                    return i * 150;
                })
        .attr("y",  d => { return y(d.t); })
        .attr("height",  d => { return height2 - y(d.t); })


    svg2.selectAll(".label")
        .data(hours)
        .enter()
        .append("text")
        .attr("class", "label")
        .style("display",  d => { return d.t === null ? "none" : null; })
        .attr("x", ( d => { return x(d.h) + (x.bandwidth() / 2) -8 ; }))
            .style("fill",  d => {
                return d.t === d3.max(hours,  d => { return d.t; })
                ? highlightColor : greyColor
                })
        .attr("y",  d => { return height2; })
            .attr("height", 0)
                .transition()
                .duration(750)
                .delay((d, i) => { return i * 150; })
        .text( d => { return (d.t); })
        .attr("y",  d => { return y(d.t) + .1; })
        .attr("dy", "-.7em");

        var u = svg2.selectAll(".bar")
            .data(hours)

        u
            .attr("class", "bar")
            .style("display", d => { return d.t === null ? "none" : null; })
            .style("fill",  d => {
                return d.t === d3.max(hours,  d => { return d.t; })
                ? highlightColor : barColor
                })
            .attr("x",  d => { return x(d.h); })
            .attr("width", x.bandwidth())
                .attr("y",  d => { return height2; })
                .attr("height", 0)
                    .transition()
                    .duration(750)
                    .delay(function (d, i) {
                        return i * 150;
                    })
            .attr("y",  d => { return y(d.t); })
            .attr("height",  d => { return height2 - y(d.t); });

            u
    .exit()
    .remove();


    var aled = svg2.selectAll(".label")
        .data(hours)


      aled
            .attr("class", "label")
            .style("display",  d => { return d.t === null ? "none" : null; })
            .attr("x", ( d => { return x(d.h) + (x.bandwidth() / 2) -8 ; }))
                .style("fill",  d => {
                    return d.t === d3.max(hours,  d => { return d.t; })
                    ? highlightColor : greyColor
                    })
            .attr("y",  d => { return height2; })
                .attr("height", 0)
                    .transition()
                    .duration(750)
                    .delay((d, i) => { return i * 150; })
            .text( d => { return (d.t); })
            .attr("y",  d => { return y(d.t) + .1; })
            .attr("dy", "-.7em");

          aled.exit()
            .remove();
    });
}


update();




function update2(){

  var dataset = [];
  dataset.push(d3.json("ressources/meteo.json"));

  var input = document.getElementById("date").value;
  var dateEntered = new Date(input);
  var day = dateEntered.getDate();
  day = day-1;
  labd = day +1;
  // var val = document.getElementById("stations").value;
    var lab = document.getElementById("name_sta").textContent;
    var lab2 = document.getElementById("monLab");

    lab2.textContent = "Pluviométrie en mm à " + lab + " le " + labd +" février";


  Promise.all(dataset).then(function(data) {

    const sta = data[0][day]["station"];

    var index = sta.findIndex(function(item, i){
      return item.n === lab
    });

    if (index == -1) {
      index = 0
    }

    const hours = data[0][day]["station"][index].hours;

    x.domain(hours.map( d => { return d.h; }))
    xAxis.call(d3.axisBottom(x))


    y.domain([0, 35]);



    svg2.append("g")
        .attr("class","y axis")
        .call(yAxis);

    svg2.selectAll(".bar")
        .data(hours)
        .enter().append("rect")
        .attr("class", "bar")
        .style("display", d => { return d.p === null ? "none" : null; })
        .style("fill",  d => {
            return d.p === d3.max(hours,  d => { return d.p; })
            ? highlightColor : barColor
            })
        .attr("x",  d => { return x(d.h); })
        .attr("width", x.bandwidth())
            .attr("y",  d => { return height2; })
            .attr("height", 0)
                .transition()
                .duration(750)
                .delay(function (d, i) {
                    return i * 150;
                })
        .attr("y",  d => { return y(d.p); })
        .attr("height",  d => { return height2 - y(d.p); });

    svg2.selectAll(".label")
        .data(hours)
        .enter()
        .append("text")
        .attr("class", "label")
        .style("display",  d => { return d.p === null ? "none" : null; })
        .attr("x", ( d => { return x(d.h) + (x.bandwidth() / 2) -8 ; }))
            .style("fill",  d => {
                return d.p === d3.max(hours,  d => { return d.p; })
                ? highlightColor : greyColor
                })
        .attr("y",  d => { return height2; })
            .attr("height", 0)
                .transition()
                .duration(750)
                .delay((d, i) => { return i * 150; })
        .text( d => { return (d.p); })
        .attr("y",  d => { return y(d.p) + .1; })
        .attr("dy", "-.7em");

        var u = svg2.selectAll(".bar")
            .data(hours)

        u
            .attr("class", "bar")
            .style("display", d => { return d.p === null ? "none" : null; })
            .style("fill",  d => {
                return d.p === d3.max(hours,  d => { return d.p; })
                ? highlightColor : barColor
                })
            .attr("x",  d => { return x(d.h); })
            .attr("width", x.bandwidth())
                .attr("y",  d => { return height2; })
                .attr("height", 0)
                    .transition()
                    .duration(750)
                    .delay(function (d, i) {
                        return i * 150;
                    })
            .attr("y",  d => { return y(d.p); })
            .attr("height",  d => { return height2 - y(d.p); });

            u
    .exit()
    .remove();


    var aled = svg2.selectAll(".label")
        .data(hours)


      aled
            .attr("class", "label")
            .style("display",  d => { return d.p === null ? "none" : null; })
            .attr("x", ( d => { return x(d.h) + (x.bandwidth() / 2) -8 ; }))
                .style("fill",  d => {
                    return d.p === d3.max(hours,  d => { return d.p; })
                    ? highlightColor : greyColor
                    })
            .attr("y",  d => { return height2; })
                .attr("height", 0)
                    .transition()
                    .duration(750)
                    .delay((d, i) => { return i * 150; })
            .text( d => { return (d.p); })
            .attr("y",  d => { return y(d.p) + .1; })
            .attr("dy", "-.7em");

          aled.exit()
            .remove();
    });
}
