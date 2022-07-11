
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

if (localStorage.getItem("data") !== null) {
    var data = JSON.parse(localStorage.getItem("data"))
    var lng = data.results[0].geometry.lng
    var lat = data.results[0].geometry.lat
 
    locateBtn.parent().text(`${data.results[0].components.town}, ${data.results[0].components.state_code}`)
    locateBtn.parent().css("padding-left", "35%")
    
    locateBtn.remove()
    $("[w-type]").attr("w-latlong", `${lat},${lng}`)
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
                locateBtn.parent().css("width", "100%")
              
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


fetch('https://theaudiodb.p.rapidapi.com/trending.php?country=us&type=itunes&format=singles', options)
    .then(response => response.json())
    .then(function (data) {
       
        $("h1").text(`${data.trending[0].strTrack}`)
        $("h2").text(`${data.trending[0].strArtist}`);
        $("img").attr("src", `${data.trending[0].strTrackThumb}`);

        for (i = 0; i < data.trending.length; i++) {
            tBody.append(`<tr class=${i}>`);

            var newTr = $(`.${i}`);

            newTr.append(`<td>${data.trending[i].strTrack}</td>`);
            newTr.append(`<td>${data.trending[i].strArtist}</td>`);
            newTr.append(`<td>${data.trending[i].strAlbum}</td>`);
            newTr.append(`<td><a class="listen waves-effect waves-light btn">Play</a></td>`);
        }

        searchName = data.trending[0].strArtist;
        searchSong = data.trending[0].strTrack;

        fetch(`https://api.lyrics.ovh/v1/${searchName}/${searchSong}`)
            .then(response => response.json())
            .then(function (data) {
                var lyricsArr = data.lyrics.split("\n")
                $("#songLyrics").text("");
                for (i = 0; i < lyricsArr.length; i++) {
                    $("#songLyrics").append(`<li>${lyricsArr[i]}</li>`);
                }
            }
            )
    })
    .catch(err => console.error(err));

//function for artist search
var searchArt = $(".artistName");
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

    

            //edge case for no api
            if (data.track !== null) {
                searchName = data.track[0].strArtist;
                searchSong = data.track[0].strTrack;

                //lyrics api
                fetch(`https://api.lyrics.ovh/v1/${searchName}/${searchSong}`)
                    .then(response => response.json())
                    .then(function (data) {
                        
                        $("#songLyrics").empty();
                        if (data.lyrics !== null) {
                            var lyricsArr = data.lyrics.split("\n");
                            for (i = 0; i < lyricsArr.length; i++) {
                                $("#songLyrics").append(`<li>${lyricsArr[i]}</li>`);
                            }
                        }
                    }
                    )
            }

            if (data.track !== null) {
                $("h1").text(`${data.track[0].strTrack}`);
                $("h2").text(`${data.track[0].strArtist}`);

                if (data.track[0].strTrackThumb === null) {
                    $("img").attr("src", "./assets/images/placeholder.png");
                } else {
                    $("img").attr("src", `${data.track[0].strTrackThumb}`);
                }

                for (i = 0; i < data.track.length; i++) {

                    tBody.append(`<tr class=iter${i}>`);

                    var newTr = $(`.iter${i}`);

                    newTr.append(`<td>${data.track[i].strTrack}</td>`);
                    newTr.append(`<td>${data.track[i].strArtist}</td>`);
                    newTr.append(`<td>${data.track[i].strAlbum}</td>`);
                    newTr.append(`<td><a class="listen waves-effect waves-light btn">Play</a></td>`);

                }
            } else {
                $("h1").text(`Artist not found, please search for another.`);
                $("h2").text("");
                $("img").attr("src", "./assets/images/placeholder.png");
            }

        })
})

histArr = []
if (localStorage.getItem("songHist") == null) {
    localStorage.setItem("songHist", JSON.stringify(histArr));
} else {
    $(".histTable").empty()
    histArr = JSON.parse(localStorage.getItem(`songHist`));
    for (i = 0; i < histArr.length; i++) {
        $(".histTable").append(`<tr class=hist${i}>`);

        var newTr = $(`.hist${i}`);
      
        newTr.append(histArr[i]);
    }
}



$("table").on("click", ".listen", function (event) {
    event.stopPropagation();

           
    var histObj = JSON.parse(localStorage.getItem("songHist"));

    
    histArr.unshift($(event.target).parent().parent().html());

    

    localStorage.setItem(`songHist`, JSON.stringify(histArr));


    $(".histTable").empty();
    var histAppend = JSON.parse(localStorage.getItem(`songHist`));
    for (i = 0; i < histAppend.length; i++) {
        $(".histTable").append(`<tr class=hist${i}>`);

        var newTr = $(`.hist${i}`);

        newTr.append(histAppend[i]);

    };
});

//youtube 
$("table").on("click", ".listen", function (event) {
    event.stopPropagation()
    $(".youtube").html(`<h3><a href = "https://www.youtube.com/results?search_query=${$(event.target).parent().parent().children().eq(0).text()}+${$(event.target).parent().parent().children().eq(1).text()}}">Listen to ${$(event.target).parent().parent().children().eq(0).text()} by ${$(event.target).parent().parent().children().eq(1).text()}</a></h3>`)
})


