export const apiKey = '859227ae186a4e2a99d70746232111';

export const weatherImages = {
    'Partly cloudy': require('../assets/images/partlycloudy.png'),
    'Moderate rain': require('../assets/images/moderaterain.png'),
    'Patchy rain possible': require('../assets/images/moderaterain.png'),
    'Sunny': require('../assets/images/sun.png'),
    'Clear': require('../assets/images/sun.png'),
    'Overcast': require('../assets/images/cloud.png'),
    'Cloudy': require('../assets/images/cloud.png'),
    'Light rain': require('../assets/images/moderaterain.png'),
    'Moderate rain at times': require('../assets/images/moderaterain.png'),
    'Heavy rain': require('../assets/images/heavyrain.png'),
    'Heavy rain at times': require('../assets/images/heavyrain.png'),
    'Moderate or heavy freezing rain': require('../assets/images/heavyrain.png'),
    'Moderate or heavy rain shower': require('../assets/images/heavyrain.png'),
    'Moderate or heavy rain with thunder': require('../assets/images/heavyrain.png'),
    'Mist': require('../assets/images/mist.png'),
    'other': require('../assets/images/moderaterain.png')
}
export const weatherIcon = {
    "Humidity": require('../assets/icons/drop.png'),
    "Uv Index": require("../assets/icons/rays.png"),
    "Wind": require('../assets/icons/wind.png'),
    "Pressure": require('../assets/icons/gauge.png')
}
export const weatherEndpoint = {
    "Humidity": "humidity",
    "Uv Index": "uv",
    "Wind": "wind_kph",
    "Pressure": "pressure_mb",
}
export const weatherUnit = {
    "Humidity": "%",
    "Uv Index": "",
    "Wind": "km/h",
    "Pressure": "hpa"
}
export const subName = {
    "humidity": "avghumidity",
    "uv": "uv",
    "wind_kph": "maxwind_kph",
    "Pressure": ""
}
export const comparisonName = {
    "Humidity": "average humidity",
    "Uv Index": "average UV Index",
    "Wind": "max wind speed"
}
export const mapWindDirection = direction => {
    const directionMap = {
      N: 'North',
      NNE: 'North / North-East',
      NE: 'North-East',
      ENE: 'East / North-East',
      E: 'East',
      ESE: 'East / South-East',
      SE: 'South-East',
      SSE: 'South / South-East',
      S: 'South',
      SSW: 'South / South-West',
      SW: 'South-West',
      WSW: 'West / South-West',
      W: 'West',
      WNW: 'West / North-West',
      NW: 'North-West',
      NNW: 'North / North-West',
    };

    return directionMap[direction] || direction;
  };