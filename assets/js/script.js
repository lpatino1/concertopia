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
                locateBtn.parent().text(`${data.results[0].components.town}, ${data.results[0].components.state_code}`)
                locateBtn.remove()
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
    mode: "no-cors",
    type: "itunes",
    country: "us",
    format: "singles",
};

fetch('http://www.theaudiodb.com/api/v1/json/523532/trending.php?country=us&type=itunes&format=singles', options)
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
