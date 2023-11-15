import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MagnifyingGlassIcon, XMarkIcon} from 'react-native-heroicons/outline';
import {CalendarDaysIcon, MapPinIcon} from 'react-native-heroicons/solid';
import {debounce} from 'lodash';
import {theme} from '../../theme';
import {fetchLocations, fetchWeatherForecast} from '../../api/weather';
import * as Progress from 'react-native-progress';
import {StatusBar} from 'expo-status-bar';
import {weatherImages} from '../../constants';
import {Dimensions} from 'react-native';
import {getData, storeData} from '../../utils/asyncStorage';
import {useNavigation} from '@react-navigation/native';

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({});
  
  const navigation = useNavigation();
  const navigateToOtherScreen = () => {
    // Navigate to the other screen
    navigation.navigate('Info');
  };
  const navigateToWind = () => {
    // Navigate to the other screen
    navigation.navigate('Wind', {
      prop1: weather,
    })
  };

  const handleSearch = search => {
    // console.log('value: ',search);
    if (search && search.length > 2)
      fetchLocations({cityName: search}).then(data => {
        // console.log('got locations: ',data);
        setLocations(data);
      });
  };

  const handleLocation = loc => {
    setLoading(true);
    toggleSearch(false);
    setLocations([]);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7',
    }).then(data => {
      setLoading(false);
      setWeather(data);
      storeData('city', loc.name);
    });
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity = await getData('city');
    let cityName = 'Islamabad';
    if (myCity) {
      cityName = myCity;
    }
    fetchWeatherForecast({
      cityName,
      days: '10',
    }).then(data => {
      // console.log('got data: ',data.forecast.forecastday);
      setWeather(data);
      setLoading(false);
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const {location, current, forecast} = weather;
  const screenHeight = Dimensions.get('window').height;
  const halfScreenHeight = screenHeight * 2;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex w-full relative flex-col">
      <StatusBar style="light" />

      <Image
        source={require('../../assets/images/clouds-blue-sky.jpg')}
        className="absolute w-full h-full  object-cover"
      />
      <ScrollView className="absolute w-full h-full bg-black/40 " />
      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
        </View>
      ) : (
        <SafeAreaView className="flex flex-1 ">
          {/* search section */}
          <View style={{height: '5%'}} className="mx-4 relative z-50">
            <View
              className="flex-row justify-end items-center rounded-full"
              style={{
                backgroundColor: showSearch
                  ? theme.bgWhite(0.2)
                  : 'transparent',
              }}>
              {showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="Search city"
                  placeholderTextColor={'lightgray'}
                  className="pl-6 h-10 pb-1 flex-1 text-base text-white"
                />
              ) : null}
              <TouchableOpacity
                onPress={() => toggleSearch(!showSearch)}
                className="rounded-full p-3 m-1"
                style={{backgroundColor: theme.bgWhite(0.3)}}>
                {showSearch ? (
                  <XMarkIcon size="25" color="white" />
                ) : (
                  <MagnifyingGlassIcon size="25" color="white" />
                )}
              </TouchableOpacity>
            </View>
            {locations.length > 0 && showSearch ? (
              <View className="absolute w-full bg-gray-300 top-16 rounded-3xl ">
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  let borderClass = showBorder
                    ? ' border-b-2 border-b-gray-400'
                    : '';
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleLocation(loc)}
                      className={
                        'flex-row items-center border-0 p-3 px-4 mb-1 ' +
                        borderClass
                      }>
                      <MapPinIcon size="20" color="gray" />
                      <Text className="text-black text-lg ml-2">
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          {/* forecast section */}
          <View className="flex flex-col   justify-center flex-1 mb-2 gap-4">
            {/* location */}
            <Text className="text-white pl-10 text-start text-2xl font-bold">
              Today,
              <Text className="text-xl font-semibold text-gray-300">
                {' '}
                {location?.localtime}
              </Text>
            </Text>

            <Text className="text-white pl-10 text-start text-2xl font-bold">
              {location?.name},
              <Text className="text-xl font-semibold text-gray-300">
                {' '}
                {location?.country}
              </Text>
            </Text>
            <View className="flex flex-row border-b pb-10  border-white/70 self-center w-full gap-2 justify-center items-center">
              <View className="flex-row flex items-center  justify-center gap-2">
                <View className="w-52 h-52 ">
                  <Image
                    // source={{uri: 'https:'+current?.condition?.icon}}
                    source={weatherImages[current?.condition?.text || 'other']}
                    className="w-full h-full backdrop-blur-sm object-cover"
                  />
                </View>
                <View className=" flex justify-center items-center">
                  <Text className="text-center font-bold text-white text-7xl">
                    {current?.temp_c}&#176;
                  </Text>
                  <Text className="text-center font-bold text-gray-400 text-basea pl-8 mb-2">
                    /Real Feel{' '}
                    <Text className="text-white">
                      {current?.feelslike_c}&#176;
                    </Text>
                  </Text>
                  <Text className="text-center text-gray-300 text-xl tracking-widest font-bold translate-x-2">
                    {current?.condition?.text}
                  </Text>
                </View>
              </View>
            </View>

            {/* other stats */}
            <View className="flex-row justify-around  px-2 border-white/50 pt-4  ">
              <View className="flex-col justify-center gap-3 items-center">
                <TouchableOpacity onPress={navigateToWind} className="flex-row gap-2 pl-3 pr-4 pb-2 text-xl  items-center justify-center bg-gray-400/50 rounded-2xl ">
                  <Image
                    source={require('../../assets/icons/wind.png')}
                    className="w-6 h-6"
                  />
                  <Text className="text-white font-semibold text-xl">Wind</Text>
                </TouchableOpacity>
                <Text
                  
                  className="text-white font-semibold text-2xl">
                  {current?.wind_kph}{' '}
                  <Text className="text-gray-400">km/h</Text>
                </Text>
              </View>
              <View className="flex-col justify-center gap-3 items-center">
                <View className="flex-row gap-2 pl-3 pr-4  pb-2 text-xl  items-center justify-center bg-gray-400/50 rounded-2xl ">
                  <Image
                    source={require('../../assets/icons/drop.png')}
                    className="w-6 h-6"
                  />
                  <Text className="text-white font-semibold text-xl">
                    Humidity
                  </Text>
                </View>
                <Text className="text-white font-semibold text-2xl">
                  {current?.humidity} <Text className="text-gray-400">%</Text>
                </Text>
              </View>
            </View>
            <View className="flex-row justify-around  ">
              <View className="flex-col justify-center gap-3 items-center">
                <View className="flex-row gap-2 pl-3 pr-4 pb-2 text-xl  items-center justify-center bg-gray-400/50 rounded-2xl ">
                  <Image
                    source={require('../../assets/icons/rays.png')}
                    className="w-6 h-6 invert"
                  />
                  <Text className="text-white font-semibold text-xl">
                    UV Index
                  </Text>
                </View>
                <Text className="text-white font-semibold text-2xl">
                  {current?.uv}
                </Text>
              </View>
              <View className="flex-col justify-center gap-3 items-center">
                <View className="flex-row gap-2 pl-3 pr-4  pb-2 text-xl  items-center justify-center bg-gray-400/50 rounded-2xl ">
                  <Image
                    source={require('../../assets/icons/gauge.png')}
                    className="w-6 h-6"
                  />
                  <Text className="text-white font-semibold text-xl">
                    Pressure
                  </Text>
                </View>
                <Text className="text-white font-semibold text-2xl">
                  {current?.pressure_mb}
                  <Text className="text-gray-400"> hpa</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* forecast for next days */}
          <View className="mb-2 mt-5 space-y-3">
            <View className="flex-row items-center mx-5 space-x-2">
              <CalendarDaysIcon size="22" color="white" />
              <Text className="text-white text-base">Hourly forecast</Text>
            </View>

            <View
              horizontal
              contentContainerStyle={{paddingHorizontal: 15}}
              showsHorizontalScrollIndicator={true}
              className="flex flex-col gap-2 w-[90%] self-center pb-4 justify-center items-start rounded-2xl mx-1 "
              style={{backgroundColor: theme.bgWhite(0.15)}}>
              {forecast?.forecastday[0]?.hour
                ?.slice(0, 24)
                .map((hourlyData, index) => {
                  const timestampString = hourlyData?.time;
                  const timestamp = Date.parse(timestampString);

                  if (!isNaN(timestamp)) {
                    const date = new Date(timestamp);
                    const formattedTime = date.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: false,
                    });

                    return (
                      <TouchableOpacity
                        key={index}
                        className="border-b-2 border-white/10 px-2">
                        <View className="flex flex-row justify-between gap-10 items-center w-full">
                          <Text className="text-white w-24 font-bold text-xl">
                            {formattedTime}
                          </Text>
                          <Image
                            source={{
                              uri: 'http:' + hourlyData?.condition?.icon,
                            }}
                            className="w-12 h-11"
                          />

                          <Text className="text-white font-bold text-xl w-12">
                            {hourlyData?.temp_c}&#176;
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  } else {
                    console.error('Invalid timestamp string:', timestampString);
                    return null; // or handle the error in another way
                  }
                })}
            </View>
          </View>
          <View className="mb-2 space-y-3">
            <View className="flex-row items-center mx-5 space-x-2">
              <CalendarDaysIcon size="22" color="white" />
              <Text className="text-white text-base">Daily forecast</Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{paddingHorizontal: 20}}
              showsHorizontalScrollIndicator={false}>
              {weather?.forecast?.forecastday?.map((item, index) => {
                const date = new Date(item.date);
                const options = {weekday: 'long'};
                let dayName = date.toLocaleDateString('en-US', options);
                dayName = dayName.split(',')[0];

                return (
                  <TouchableOpacity c>
                    <View
                      key={index}
                      className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                      style={{backgroundColor: theme.bgWhite(0.15)}}>
                      <Image
                        source={{uri: 'http:' + item?.day?.condition?.icon}}
                        className="w-11 h-11"
                      />
                      <Text className="text-white">{dayName}</Text>

                      <Text className="text-white text-xl font-semibold">
                        {item?.day?.avgtemp_c}&#176;
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </ScrollView>
  );
}
