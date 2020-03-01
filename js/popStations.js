function populate(){

 var dataset = [];
 dataset.push(d3.json("ressources/meteo.json"));

 Promise.all(dataset).then(function(data) {

   var jour = document.getElementById("date");
   var s2 = document.getElementById("stations");

   s2.text ="";

   var input = jour.value;
   var dateEntered = new Date(input);
   var day = dateEntered.getDate();
   day = day-1;

   const stationsL = data[0][day]["station"];
   var taille = stationsL.length;

   for (var i=0; i<s2.length; i++) {
    s2.remove(i);
   }

   for(var i = 0; i < taille; i++){
     var newOption = document.createElement("option");
     newOption.text = stationsL[i].n ;
     newOption.value = stationsL[i].n;
     s2.appendChild(newOption);
   }
 });

}

populate();
