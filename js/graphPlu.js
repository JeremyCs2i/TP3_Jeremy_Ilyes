
function getIndexu()
{
  var dataset = [];
  dataset.push(d3.json("ressources/meteo.json"));

  var input = document.getElementById("date").value;
  var dateEntered = new Date(input);
  var day = dateEntered.getDate();
  day = day-1;

  var val = document.getElementById("stations").value;


  Promise.all(dataset).then(function(data) {
    const sta = data[0][day]["station"];

    var index = sta.findIndex(function(item, i){
      return item.n === val
    });

    console.log(index);
  });
}

getIndexu();
