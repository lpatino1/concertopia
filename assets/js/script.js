
////////////////////////////////////////////////////////////////////////////////
//Ticketmaster Widget Location



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
//on page load popular artsists/song info is shown
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
            var tRow = tBody.append(`<tr class="currentData">`)
            tRow.append(`<td>${data.trending[i].strTrack}</td>`)
            tRow.append(`<td>${data.trending[i].strArtist}</td>`)
            tRow.append(`<td>${data.trending[i].strAlbum}</td>`)
        }
    })
    .catch(err => console.error(err));

//function for artist search
var searchArt = $("#artistName")
$(".submitBtn").click(function(event){
    
    event.stopPropagation();
    
    const optionsSearch = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '2ae20cebb7mshe4506161a53081cp173350jsn28fba4d2ea65',
            'X-RapidAPI-Host': 'theaudiodb.p.rapidapi.com'
        }
    };

    fetch(`https://theaudiodb.p.rapidapi.com/track-top10.php?s=${searchArt.val()}`, optionsSearch)
    .then(response => response.json())
    .then(function (data) {
        tBody.empty();
        console.log(data)
        if(data.track !== null){
        $("h1").text(`${data.track[0].strTrack}`)
        $("h2").text(`${data.track[0].strArtist}`)

        if(data.track[0].strTrackThumb === null){
            $("img").attr("src","./assets/images/placeholder.png")
        }else{
            $("img").attr("src",`${data.track[0].strTrackThumb}`)}

        for (i = 1; i < data.track.length; i++) {
            var tRow = tBody.append(`<tr>`)
            tRow.append(`<td>${data.track[i].strTrack}</td>`)
            tRow.append(`<td>${data.track[i].strArtist}</td>`)
            tRow.append(`<td>${data.track[i].strAlbum}</td>`)
        }
    }else{
        $("h1").text(`Artist not found, please search for another.`)
        $("h2").text("")
        $("img").attr("src","./assets/images/placeholder.png")
    }

})
}

)