////////////////////////////////////////////////////////////////////////////////

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