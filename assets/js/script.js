//get user location coordinates from browser
//user lat and long responses from navigator.geolocation.getCurrentPosition

var locateBtn = $(".locate")
var response
//user Location
//success call back

function locateUser() {
    navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude
        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=888ab51ae378491c9cc6646f56803e81`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                locateBtn.removeClass("btn waves-effect waves-light")
                locateBtn.text(`${data.results[0].components.town},${data.results[0].components.state_code}`)
                localStorage.setItem("data", JSON.stringify(data))
            }
            )})
    }


locateBtn.click(locateUser)

//failure call back
function locationDenied() {
    locateBtn.addClass("hide")
}


