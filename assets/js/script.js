
////////////////////////////////////////////////////////////////////////////////
//Ticketmaster Widget Location

//Mobile Collapse Navbar from Materialize
$(document).ready(function () {
    $('.sidenav').sidenav();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////readability/modularity
var locateBtn = $(".locate")

//user Location
//success call back

if(localStorage.getItem("data") !== null){
    var data = JSON.parse(localStorage.getItem("data"))
    console.log(data)
    locateBtn.parent().text(`${data.results[0].components.town}, ${data.results[0].components.state_code}`)
    locateBtn.remove()
}

function locateUser(event) {
    event.stopPropagation()
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


tBody = $(".mainTable")
//on page load popular artsists/song info is shown
var options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '2ae20cebb7mshe4506161a53081cp173350jsn28fba4d2ea65',
        'X-RapidAPI-Host': 'theaudiodb.p.rapidapi.com'
    }
};

var histArr = []

//retrieves lyrics of top trending song
fetch('https://theaudiodb.p.rapidapi.com/trending.php?country=us&type=itunes&format=singles', options)
    .then(response => response.json())
    .then(function (data) {

        

        $("h1").text(`${data.trending[0].strTrack}`)
        $("h2").text(`${data.trending[0].strArtist}`)
        $("img").attr("src", `${data.trending[0].strTrackThumb}`)

        for (i = 1; i < data.trending.length; i++) {
            tBody.append(`<tr class=${i}>`)

            var newTr = $(`.${i}`)

            newTr.append(`<td>${data.trending[i].strTrack}</td>`)
            newTr.append(`<td>${data.trending[i].strArtist}</td>`)
            newTr.append(`<td>${data.trending[i].strAlbum}</td>`)
            newTr.append(`<td><a class="listen waves-effect waves-light btn">Play</a></td>`)
        }

        searchName = data.trending[0].strArtist
        searchSong = data.trending[0].strTrack


        fetch(`https://api.lyrics.ovh/v1/${searchName}/${searchSong}`)
            .then(response => response.json())
            .then(function (data) {
                var lyricsArr = data.lyrics.split("\n")
                $("#songLyrics").text("")
                for (i = 0; i < lyricsArr.length; i++) {
                    $("#songLyrics").append(`<li>${lyricsArr[i]}</li>`)
                }
            }
            )
    })
    .catch(err => console.error(err));

//function for artist search
var searchArt = $(".artistName")
$(".submitBtn").click(function (event) {

    event.stopPropagation();

    var optionsSearch = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '2ae20cebb7mshe4506161a53081cp173350jsn28fba4d2ea65',
            'X-RapidAPI-Host': 'theaudiodb.p.rapidapi.com'
        }
    };
    //artist search audiodb
    fetch(`https://theaudiodb.p.rapidapi.com/track-top10.php?s=${searchArt.val()}`, optionsSearch)
        .then(response => response.json())
        .then(function (data) {
            tBody.empty();


            console.log(data)

            //edge case for no api
            if (data.track !== null) {
                searchName = data.track[0].strArtist
                searchSong = data.track[0].strTrack



                //lyrics api
                fetch(`https://api.lyrics.ovh/v1/${searchName}/${searchSong}`)
                    .then(response => response.json())
                    .then(function (data) {
                        $("#songLyrics").empty()
                        if (data.lyrics !== null) {
                            var lyricsArr = data.lyrics.split("\n")
                            for (i = 0; i < lyricsArr.length; i++) {
                                $("#songLyrics").append(`<li>${lyricsArr[i]}</li>`)
                            }
                        }
                    }
                    )
            }

            if (data.track !== null) {
                $("h1").text(`${data.track[0].strTrack}`)
                $("h2").text(`${data.track[0].strArtist}`)

                if (data.track[0].strTrackThumb === null) {
                    $("img").attr("src", "./assets/images/placeholder.png")
                } else {
                    $("img").attr("src", `${data.track[0].strTrackThumb}`)
                }

                for (i = 1; i < data.track.length; i++) {

                    tBody.append(`<tr class=iter${i}>`)

                    var newTr = $(`.iter${i}`)

                    newTr.append(`<td>${data.track[i].strTrack}</td>`)
                    newTr.append(`<td>${data.track[i].strArtist}</td>`)
                    newTr.append(`<td>${data.track[i].strAlbum}</td>`)
                    newTr.append(`<td><a class="listen waves-effect waves-light btn">Play</a></td>`)


                }
            } else {
                $("h1").text(`Artist not found, please search for another.`)
                $("h2").text("")
                $("img").attr("src", "./assets/images/placeholder.png")
            }

        })
}

)

histArr = []
if (localStorage.getItem("songHist")==null){
    localStorage.setItem("songHist", JSON.stringify(histArr))
}else{
    $(".histTable").empty()
    var histAppend = JSON.parse(localStorage.getItem(`songHist`))
    for (i = 0; i < histAppend.length; i++) {
        $(".histTable").append(`<tr class=hist${i}>`)

        var newTr = $(`.hist${i}`)
   
        newTr.append(histAppend[i])
}
}



tBody.on("click", $(".listen"), function (event) {
    event.stopPropagation()
    

    if (event.target.classList.contains("listen")) {
        
        console.log("working")
            
            //I think the problem is here, getting ta help tomorrow morning
            var histObj = JSON.parse(localStorage.getItem("songHist"))
            histArr.push(histObj)
            console.log(histObj)
            histArr.unshift($(event.target).parent().parent().html())
          
            console.log(histArr)
           
            localStorage.setItem(`songHist`, JSON.stringify(histArr))


            $(".histTable").empty()
            var histAppend = JSON.parse(localStorage.getItem(`songHist`))
            for (i = 0; i < histAppend.length; i++) {
                $(".histTable").append(`<tr class=hist${i}>`)

                var newTr = $(`.hist${i}`)
               
                newTr.append(histAppend[i])
            

            //spotify code

  }
}})

// Spotify SDK URI
/*const play = ({
    spotify_uri,
    playerInstance: {
        _options: {
            getOAuthToken
        }
    }
}) => {
    getOAuthToken(access_token => {
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [spotify_uri] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
        });
    });
};

play({
    playerInstance: new Spotify.Player({ name: "..." }),
    spotify_uri: 'spotify:track:7xGfFoTpQ2E7fRF5lN10tr',
});

window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQAJAkKrkod5qCghiemtF1ziauo7mdDJWqdlz_GDCwEiW9V4z3PHz5T7nF5rXR_OK2vSEip-9072N8-gzxdwHZMtkfJeiw3EXsuX46f4ZdnXVGPzbGOlNRy06u9ofatFnc5ixdR62-6-uV7DMIi9MQdVcpAqcOGauxIIwU5GFaRB9LQHG5gC-vVHniezdr8U';
    const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    document.getElementById('togglePlay').onclick = function () {
        player.togglePlay();
    };

    player.connect();
}*/