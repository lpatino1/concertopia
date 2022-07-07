
////////////////////////////////////////////////////////////////////////////////

//Mobile Collapse Navbar from Materialize
$(document).ready(function(){
    $('.sidenav').sidenav();
  });

//Ticketmaster API
var requestTickermaster = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=K4bW9KYnGTzMZH5cHGLHBQ6Y2l0AO1cQ';

function getEvents (request){
    fetch(requestTickermaster)
        .then(response => response.json())
        .then(function (data){
            console.log(data);
        })
}

getEvents(requestTickermaster);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////readability/modularity
var locateBtn = $(".locate")

//user Location
//success call back

function locateUser() {
    navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude
        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=888ab51ae378491c9cc6646f56803e81`)
            .then(response => response.json())
            .then(function (data) {
                locateBtn.removeClass("btn")
                locateBtn.removeClass("waves-effect")
                locateBtn.removeClass("waves-light")
                locateBtn.removeClass("locate")
                locateBtn.text(`${data.results[0].components.town},${data.results[0].components.state_code}`)
                localStorage.setItem("data", JSON.stringify(data))
            }
            )
    }, locationDenied)
}

locateBtn.click(locateUser)

//failure call back
function locationDenied() {
    locateBtn.addClass("hide")
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////readability/modularity


//condition for if user refuses location info - display USA top charts, functionality wont change much except ticketmaster search range will be updated to the whole US
tBody = $("tbody")
//temp api for music metadata, pending api key, but this gets the gist across
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '2ae20cebb7mshe4506161a53081cp173350jsn28fba4d2ea65',
        'X-RapidAPI-Host': 'theaudiodb.p.rapidapi.com'
    }
};

fetch('https://theaudiodb.p.rapidapi.com/trending.php?country=us&type=itunes&format=singles', options)
    .then(response => response.json())
    .then(function (data) {
        console.log(data)
        $("h1").text(`${data.trending[0].strTrack}`)
        $("h2").text(`${data.trending[0].strArtist}`)
        $("img").attr("src",`${data.trending[0].strTrackThumb}`)
        for (i = 1; i < data.trending.length; i++) {
            var tRow = tBody.append(`<tr>`)
            tRow.append(`<td>${data.trending[i].strTrack}</td>`)
            tRow.append(`<td>${data.trending[i].strArtist}</td>`)
            tRow.append(`<td>${data.trending[i].strAlbum}</td>`)
        }
    })
    .catch(err => console.error(err));

