import {Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import {getData} from '../../utils/asyncStorage';
import {weatherIcon} from '../../constants';
import {weatherEndpoint} from '../../constants';
import {weatherUnit} from '../../constants';
import {subName} from '../../constants';
import {mapWindDirection} from '../../constants';
import {comparisonName} from '../../constants';
import {LineChart, BarChart} from 'react-native-chart-kit';
import {fetchHistory} from '../../api/weather';
import {theme} from '../../theme';
import {XMarkIcon} from 'react-native-heroicons/outline';
import {ChevronDownIcon} from 'react-native-heroicons/outline';
import {CheckIcon} from 'react-native-heroicons/solid';
const MenuItem = ({name, iconName, onPress, isSelected}) => (
  <TouchableOpacity
    className="w-full h-auto justify-between text-center hover:bg-gray-800 gap-4 flex flex-row pr-1 pl-3 py-2 items-center"
    onPress={onPress}>
    <TouchableOpacity className="flex flex-row justify-center items-center">
      <View className={`${isSelected ? 'block' : 'hidden'} w-auto h-auto`}>
        <CheckIcon color="white" size={25} />
      </View>
      <TouchableOpacity>
        <Text className="text-white text-xl ml-2">{name}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
    <Image source={weatherIcon[iconName]} className="w-5 h-5" />
  </TouchableOpacity>
);
const Uv = ({route}) => {
  const [currentInterface, setCurrentInterface] = useState(0);
  const navigation = useNavigation();
  const navigateToScreen = (screenName, index) => {
    navigation.navigate(screenName, {
      prop1: weather,
    });
    setCurrentInterface(index);
  };

  const navigateToWind = indexx => navigateToScreen('Wind', indexx);
  const navigateToHumidity = indexx => navigateToScreen('Humidity', indexx);
  const navigateToUv = indexx => navigateToScreen('Uv Index', indexx);
  const navigateToPressure = indexx => navigateToScreen('Pressure', indexx);
  const navigateToPrecipitation = indexx =>
    navigateToScreen('Precipitation', indexx);
  const navigateToRainProb = indexx =>
    navigateToScreen('Rain Probability', indexx);
  const navigateToVision = indexx => navigateToScreen('Vision', indexx);
  const navigateToSunrise = indexx => navigateToScreen('Sunrise', indexx);
  const [openMenu, setOpenMenu] = useState(false);

  const weather = route.params?.prop1;
  const screenHeight = Dimensions.get('window').height;
  const [history, setHistory] = useState({});

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity = await getData('city');
    let cityName = 'Ha Noi';

    if (myCity) {
      cityName = myCity;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const formattedYesterday = `${yesterday.getFullYear()}-${(
      yesterday.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${yesterday.getDate().toString().padStart(2, '0')}`;

    fetchHistory({
      cityName,
      dt: formattedYesterday,
    }).then(data => {
      setHistory(data);
    });
  };

  const name = route.name;
  const modifiedEndPoint = `${weatherEndpoint[name]}`;

  const navigateToHome = () => {
    navigation.navigate('Home');
  };
  const dailyStats = Array.from({length: 24}, (_, index) => {
    const hourData =
      weather?.forecast?.forecastday[currentInterface]?.hour[index];
    if (hourData && weatherEndpoint[name]) {
      return hourData[modifiedEndPoint];
    } else {
      return null;
    }
  });
  const comparisonData = [
    weather?.forecast?.forecastday[0]?.day?.[subName[modifiedEndPoint]],
    history?.forecast?.forecastday[0]?.day?.[subName[modifiedEndPoint]],
  ];

  const currentHour = new Date().getHours();
  const additionalEle = {
    Humidity: `Dew point: ${weather?.forecast?.forecastday[currentInterface]?.hour[currentHour]?.dewpoint_c}°C`,
    'Uv Index': 'Current UVI World Health Organization',
    Wind: `Max Wind: ${weather?.forecast?.forecastday[currentInterface]?.day?.maxwind_kph} km/h`,
    Pressure: 'Average',
    Precipitation: 'Daily Total',
    'Rain Probability': 'Today',
    Vision:
      weather?.forecast?.forecastday[currentInterface]?.hour[currentHour]
        ?.vis_km >= 15
        ? 'Totally Clear'
        : weather?.forecast?.forecastday[currentInterface]?.hour[currentHour]
            ?.vis_km >= 10
        ? 'Clear'
        : `Bad`,
  };
  const forecastadditionalEle = {
    Humidity: `Average`,
    'Uv Index': 'Average UVI World Health Organization',
    Wind: `Max Wind: ${weather?.forecast?.forecastday[currentInterface]?.day?.maxwind_kph} km/h`,
    Pressure: 'Average',
    Precipitation: 'Daily Total',
    'Rain Probability': 'Average change of rain',
    Vision:
      weather?.forecast?.forecastday[currentInterface]?.day?.avgvis_km >= 15
        ? 'Totally Clear'
        : weather?.forecast?.forecastday[currentInterface]?.day?.avgvis_km >= 10
        ? 'Clear'
        : `Bad`,
  };
  const maxUV = Math.max(
    ...(weather?.forecast?.forecastday[currentInterface]?.hour.map(
      hour => hour?.uv || 0,
    ) || []),
  );
  const averagePressure =
    Math.round(
      weather?.forecast?.forecastday[currentInterface]?.hour.reduce(
        (sum, hour) => sum + (hour?.pressure_mb || 0),
        0,
      ) / weather?.forecast?.forecastday[currentInterface]?.hour.length,
    ) || 0;

  let uvIndexLevel;
  if (maxUV >= 0 && maxUV <= 2) {
    uvIndexLevel = 'Low';
  } else if (maxUV >= 3 && maxUV <= 5) {
    uvIndexLevel = 'Medium';
  } else if (maxUV >= 6 && maxUV <= 7) {
    uvIndexLevel = 'High';
  } else if (maxUV >= 8 && maxUV <= 10) {
    uvIndexLevel = 'Very High';
  } else {
    uvIndexLevel = 'Extreme';
  }

  const summary = {
    Humidity: `The current humidity is ${
      weather?.current?.humidity
    }%. Today, the average humidity is ${
      weather?.forecast?.forecastday[0]?.day?.avghumidity
    }%. The dew point fluctuates from ${Math.min(
      ...(weather?.forecast?.forecastday[0]?.hour.map(
        hour => hour?.dewpoint_c || 0,
      ) || []),
    )}\u00b0C to ${Math.max(
      ...(weather?.forecast?.forecastday[0]?.hour.map(
        hour => hour?.dewpoint_c || 0,
      ) || []),
    )}\u00b0C throughout the day.`,
    Wind: `The current wind is ${
      weather?.current?.wind_kph
    } km/h from the ${mapWindDirection(
      weather?.current?.wind_dir,
    )}. Today, the wind speed is up to ${
      weather?.forecast?.forecastday[0]?.day?.maxwind_kph
    } km/h, with gusts reaching up to ${weather?.current?.gust_kph} km/h`,
    'Uv Index': `Currently, The UV Index is ${
      weather?.current?.uv
    }. Today, the highest UV Index is ${maxUV}, considered ${uvIndexLevel} in WHO UV Index. ${
      uvIndexLevel == 'High' ||
      uvIndexLevel == 'Very High' ||
      uvIndexLevel == 'Extreme'
        ? 'It is advisable to employ sun protection measures.'
        : ''
    }`,
    Precipitation: `It has been precipitation of ${weather?.forecast?.forecastday[0]?.day?.totalprecip_mm}mm in last 24 hours.`,
  };
  const forecastSummary = {
    Humidity: `On ${new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(
      new Date(weather?.forecast?.forecastday[currentInterface]?.date),
    )}, the average humidity is ${
      weather?.forecast?.forecastday[currentInterface]?.day?.avghumidity
    }%. The dew point fluctuates from ${Math.min(
      ...(weather?.forecast?.forecastday[currentInterface]?.hour.map(
        hour => hour?.dewpoint_c || 0,
      ) || []),
    )}\u00b0C to ${Math.max(
      ...(weather?.forecast?.forecastday[currentInterface]?.hour.map(
        hour => hour?.dewpoint_c || 0,
      ) || []),
    )}\u00b0C throughout the day.`,
    Wind: `On ${new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(
      new Date(weather?.forecast?.forecastday[currentInterface]?.date),
    )}, the wind speed will be up to ${
      weather?.forecast?.forecastday[currentInterface]?.day?.maxwind_kph
    } km/h.`,
    'Uv Index': `On ${new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
    }).format(
      new Date(weather?.forecast?.forecastday[currentInterface]?.date),
    )}, the highest UV Index is ${maxUV}, considered ${uvIndexLevel} in WHO UV Index. ${
      uvIndexLevel == 'High' ||
      uvIndexLevel == 'Very High' ||
      uvIndexLevel == 'Extreme'
        ? 'It is advisable to employ sun protection measures.'
        : ''
    }`,
    Precipitation: `On ${new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
    }).format(
      new Date(weather?.forecast?.forecastday[currentInterface]?.date),
    )}, total precipitation will be ${
      weather?.forecast?.forecastday[currentInterface]?.day?.totalprecip_mm
    }mm.`,
  };
  const DefinitionTitle = {
    Wind: 'How Wind Speed is measured?',
    Humidity: 'About relative Humidity',
    'Uv Index': 'About UV Index',
    Pressure: 'About Pressure',
    Precipitation: 'About Precipitation',
  };
  const Definition = {
    'Uv Index':
      'The UV index, is an international standard measurement of the strength of the sunburn-producing ultraviolet (UV) radiation at a particular place and time. It is primarily used in daily and hourly forecasts aimed at the general public. The UV index is designed as an open-ended linear scale, directly proportional to the intensity of UV radiation, and adjusting for wavelength based on what causes human skin to sunburn. The purpose of the UV index is to help people effectively protect themselves from UV radiation.',
    Wind: 'Wind speed is measured using a cup anemometer with three or four cups arranged symmetrically. The rotation of the cups is proportional to the wind speed in standard instruments, ensuring an accurate approximation.',
    Humidity:
      'Relative humidity is the ratio of how much water vapour is in the air to how much water vapour the air could potentially contain at a given temperature. It varies with the temperature of the air: colder air can hold less vapour.',
    Pressure:
      'Pressure refers to atmospheric pressure, which is the force per unit area exerted on a surface by the weight of the air above that surface in the atmosphere of Earth (or another celestial body). High atmospheric pressure generally indicates clear and settled weather, while low pressure often indicates unsettled or stormy weather. Changes in atmospheric pressure are closely monitored in weather forecasting, and they play a crucial role in understanding and predicting weather patterns.',
    Precipitation: '',
  };

  const menuItems = [
    {
      name: 'Wind',
      iconName: 'Wind',
      onPress: () => navigateToWind(currentInterface),
      isSelected: name === 'Wind',
    },
    {
      name: 'Humidity',
      iconName: 'Humidity',
      onPress: () => navigateToHumidity(currentInterface),
      isSelected: name === 'Humidity',
    },
    {
      name: 'UV Index',
      iconName: 'Uv Index',
      onPress: () => navigateToUv(currentInterface),
      isSelected: name === 'Uv Index',
    },
    {
      name: 'Pressure',
      iconName: 'Pressure',
      onPress: () => navigateToPressure(currentInterface),
      isSelected: name === 'Pressure',
    },
    {
      name: 'Rain Probability',
      iconName: 'Rain Probability',
      onPress: () => navigateToRainProb(currentInterface),
      isSelected: name === 'Rain Probability',
    },
    {
      name: 'Precipitation',
      iconName: 'Precipitation',
      onPress: () => navigateToPrecipitation(currentInterface),
      isSelected: name === 'Precipitation',
    },
    {
      name: 'Vision',
      iconName: 'Vision',
      onPress: () => navigateToVision(currentInterface),
      isSelected: name === 'Vision',
    },
    {
      name: 'Sunrise',
      iconName: 'Sunrise',
      onPress: () => navigateToSunrise(currentInterface),
      isSelected: name === 'Sunrise',
    },
  ];

  return (
    <ScrollView
      style={[{height: screenHeight}]}
      className="w-full flex relative  ">
      <Image
        source={require('../../assets/wind.jpg')}
        className="absolute w-full h-full  object-cover "
      />
      <View className="w-full h-full absolute bg-black/50 backdrop-blur-sm"></View>
      <TouchableOpacity className="w-[70px] mr-4 h-auto gap-2 absolute top-[240px] right-[10px] z-[1000]">
        <TouchableOpacity
          className={`w-[70px]  h-[30px] bg-gray-500 rounded-[15px] gap-2 flex flex-row justify-center`}
          onPress={() => setOpenMenu(!openMenu)}>
          <Image source={weatherIcon[route.name]} className="w-4 h-4" />
          <ChevronDownIcon size="20" color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex w-[200px] absolute right-0 top-10 rounded-xl bg-gray-800 h-[400px] flex-col ${
            openMenu ? 'block' : 'hidden'
          }`}>
          {menuItems.map((menuItem, index) => (
            <MenuItem
              key={index}
              name={menuItem.name}
              iconName={menuItem.iconName}
              onPress={menuItem.onPress}
              isSelected={menuItem.isSelected}
            />
          ))}
        </TouchableOpacity>
      </TouchableOpacity>
      <TouchableOpacity
        style={{backgroundColor: theme.bgWhite(0.3)}}
        onPress={navigateToHome}
        className="w-12 h-12 right-4 absolute top-12 rounded-full p-3 m-1 bg-gray-400/50
        ">
        <XMarkIcon size="25" color="white" />
      </TouchableOpacity>
      <View className="text-gray-200 flex flex-row self-center absolute items-center justify-center top-16 text-xl w-auto h-auto gap-2">
        <Image source={weatherIcon[route.name]} className="w-6 h-6" />
        <Text className="text-white font-semibold text-xl ">{route.name}</Text>
      </View>

      <View className="w-full flex flex-col gap-7   h-full justify-start items-start pt-24 pl-3 ">
        <View className="flex-row w-[400] justify-between gap-2 flex p-4">
          {[...Array(7).keys()].map(index => (
            <TouchableOpacity
              key={index}
              className={`flex flex-col gap-2 justify-center items-center`}
              onPress={() => setCurrentInterface(index)}>
              <Text className="text-white uppercase">
                {new Intl.DateTimeFormat('en-US', {weekday: 'short'}).format(
                  new Date(weather?.forecast?.forecastday[index]?.date),
                )}
              </Text>
              <View
                className={`flex justify-center items-center flex-row rounded-full h-8 w-8 ${
                  currentInterface === index ? 'bg-blue-300' : ''
                }`}>
                <Text
                  className={`text-base h-auto w-auto font-bold ${
                    currentInterface === index ? 'text-black' : 'text-white'
                  }`}>
                  {new Date(weather?.forecast?.forecastday[index]?.date)
                    .getDate()
                    .toString()
                    .padStart(2, '0')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View className="flex flex-col gap-3">
          <View className="w-full h-auto flex flex-row justify-between items-center">
            <View
              className={`w-auto flex flex-row justify-start pl-4 h-8 text-end items-end ${
                currentInterface == 0 ? 'block' : 'hidden'
              } `}>
              <Text className="text-white text-4xl font-semibold w-auto text-end h-auto ">
                {weather?.current?.[modifiedEndPoint]}
              </Text>
              <Text className="text-gray-300 text-2xl text-end h-8">
                {weatherUnit[name]}
              </Text>
            </View>
          </View>
          <View
            className={`w-auto flex flex-row justify-start pl-4 h-8 text-end items-end ${
              currentInterface == 0 || name == 'Wind' ? 'hidden' : 'block'
            } `}>
            <Text className="text-white text-4xl font-semibold w-auto text-end h-auto">
              {name === 'Pressure'
                ? averagePressure
                : weather?.forecast?.forecastday[currentInterface]?.day?.[
                    subName[modifiedEndPoint]
                  ]}
            </Text>

            <Text className="text-gray-300 text-2xl text-end h-8">
              {weatherUnit[name]}
            </Text>
          </View>
          <Text
            className={`text-gray-300 text-xl w-full pl-4 h-8  mb-4 ${
              currentInterface == 0 ? 'hidden' : 'block'
            }`}>
            {forecastadditionalEle[name]}
          </Text>
          <Text
            className={`text-gray-300 text-xl w-full pl-4 h-8 mb-4 ${
              currentInterface == 0 ? 'block' : 'hidden'
            }`}>
            {additionalEle[name]}
          </Text>
        </View>
        <LineChart
          data={{
            labels: ['00', '06', '12', '18'],
            datasets: [
              {
                data: dailyStats,
              },
            ],
          }}
          width={400}
          height={340}
          hideGrid={true}
          fromZero={true}
          withDots={false}
          segments={6}
          yAxisSuffix={weatherUnit[name]}
          yAxisInterval={1}
          chartConfig={{
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,

            decimalPlaces: 0,
            color: () => `rgba(0, 225, 255, 0.8)`,
            labelColor: () => `rgba(255, 255, 255, 1)`,
            strokeWidth: 3,

            propsForBackgroundLines: {
              stroke: '#FFFFFF',
              opacity: 0.2,
            },
            style: {
              borderRadius: 20,
              borderWidth: 2,

              borderColor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
          bezier
          style={{
            display: 'flex',
            alignSelf: 'center',
            justifyContent: 'flex-start',
            width: 400,
            height: 350,
            marginRight: 20,
          }}
        />
        <View className="flex flex-col gap-2">
          <Text className="text-white text-xl w-full font-semibold pl-4 h-auto">
            Summary
          </Text>
          <View className={`${currentInterface == 0 ? 'block' : 'hidden'}`}>
            <Text className="text-white flex text-base rounded-lg w-[350]  h-auto ml-4 px-4 py-3 bg-gray-600/80">
              {summary[name]}
            </Text>
          </View>
          <View className={`${currentInterface == 0 ? 'hidden' : 'block'}`}>
            <Text className="text-white flex text-base rounded-lg w-[350]  h-auto ml-4 px-4 py-3 bg-gray-600/80">
              {forecastSummary[name]}
            </Text>
          </View>
        </View>

        <View
          className={`flex flex-col gap-2 ${
            currentInterface == 0 && name != 'Pressure' ? 'block' : 'hidden'
          }`}>
          <Text
            className={`text-white text-xl w-full font-semibold pl-4 h-auto `}>
            Comparison
          </Text>
          <View>
            <View className="flex  rounded-lg w-[350] gap-2 flex-col  h-[200] ml-4 px-4 py-3 bg-gray-600/80">
              <Text className="text-white text-base">
                The {comparisonName[name]} of today is{' '}
                {weather?.forecast?.forecastday[0]?.day?.[
                  subName[modifiedEndPoint]
                ] >
                history?.forecast?.forecastday[0]?.day?.[
                  subName[modifiedEndPoint]
                ]
                  ? 'higher'
                  : 'lower'}{' '}
                than that of yesterday.
              </Text>
              <BarChart
                className="rotate-90"
                style={{
                  display: 'flex',
                  width: 'auto',
                  height: 150,
                }}
                data={{
                  labels: ['Today', 'Yesterday'],
                  datasets: [
                    {
                      data: comparisonData,
                    },
                  ],
                }}
                width={180}
                height={250}
                withHorizontalLabels={false}
                fromZero={true}
                showBarTops
                showValuesOnTopOfBars
                verticalLabelRotation={-90}
                withInnerLines={false}
                yAxisSuffix="km/h"
                chartConfig={{
                  backgroundGradientFromOpacity: 0,
                  backgroundGradientToOpacity: 0,
                  decimalPlaces: 1,
                  color: () => `rgba(255, 255, 255, 1)`,
                  propsForLabels: {
                    stroke: '#FFFFFF',
                    opacity: 1,
                    letterSpacing: 1,
                    fontSize: 15,
                  },
                }}
              />
            </View>
          </View>
        </View>
        <View className="flex flex-col gap-2 mb-10">
          <Text className="text-white text-xl w-full font-semibold pl-4 h-auto">
            {DefinitionTitle[name]}
          </Text>
          <View>
            <Text className="text-white flex text-base rounded-lg w-[350] text-justify h-auto ml-4 px-4 py-3 bg-gray-600/80">
              {Definition[name]}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Uv;
