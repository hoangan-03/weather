import {Dimensions} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {getData} from '../../utils/asyncStorage';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import {fetchHistory} from '../../api/weather';
const Wind = ({route}) => {
  const [history, setHistory] = useState({});
  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity = await getData('city');
    let cityName = 'Islamabad';
    if (myCity) {
      cityName = myCity;
    }
    fetchHistory({
      cityName,
      dt: '2023-11-14',
    }).then(data => {
      setHistory(data);
    });
  };
  const weather = route.params?.prop1;
  const navigation = useNavigation();
  const mapWindDirection = direction => {
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
  const screenHeight = Dimensions.get('window').height;

  const navigateToWind = () => {
    // Navigate to the other screen
    navigation.navigate('Home');
  };
  return (
    <ScrollView
      style={[{height: screenHeight}]}
      className="w-full flex relative  ">
      <Image
        source={require('../../assets/wind.jpg')}
        className="absolute w-full h-full  object-cover "
      />
      <View className="w-full h-full absolute bg-black/50 backdrop-blur-sm"></View>
      <TouchableOpacity
        onPress={navigateToWind}
        className="w-12 h-12 right-4 absolute top-14 bg-gray-400/50 rounded-2xl"></TouchableOpacity>
      <View className="text-gray-200 flex flex-row self-center absolute items-center justify-center top-16 text-xl w-auto h-auto gap-2">
        <Image
          source={require('../../assets/icons/wind.png')}
          className="w-6 h-6"
        />
        <Text className="text-white font-semibold text-xl ">Wind</Text>
      </View>

      <View className="w-full flex flex-col gap-7   h-full justify-start items-start pt-24 pl-3 ">
        <View className="flex flex-col gap-3">
          <View className="w-auto flex flex-row justify-start pl-4 h-8 text-end items-end">
            <Text className="text-white text-4xl font-semibold w-auto text-end h-auto ">
              {weather?.current?.wind_kph}
            </Text>
            <Text className="text-gray-300 text-xl text-end h-6"> km/h</Text>
          </View>
          <Text className="text-gray-200 text-xl w-full pl-4 h-8 mb-4">
            Max Wind: {weather?.forecast?.forecastday[0]?.day?.maxwind_kph} km/h
          </Text>
        </View>
        <LineChart
          data={{
            labels: ['00', '06', '12', '18'],
            datasets: [
              {
                data: [
                  weather?.forecast?.forecastday[0]?.hour[0].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[1].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[2].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[3].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[4].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[5].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[6].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[7].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[8].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[9].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[10].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[11].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[12].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[13].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[14].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[15].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[16].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[17].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[18].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[19].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[20].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[21].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[22].wind_kph,
                  weather?.forecast?.forecastday[0]?.hour[23].wind_kph,
                ],
              },
            ],
          }}
          width={400}
          height={340}
          hideGrid={true}
          fromZero={true}
          withDots={false}
          segments={6}
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
          <Text className="text-white text-2xl w-full font-semibold pl-4 h-auto">
            Summary
          </Text>
          <View>
            <Text className="text-white flex text-base rounded-lg w-[350]  h-auto ml-4 px-4 py-3 bg-gray-600/80">
              The current wind is {weather?.current?.wind_kph} km/h from the{' '}
              {mapWindDirection(weather?.current?.wind_dir)}. Today, the wind
              speed is up to{' '}
              {weather?.forecast?.forecastday[0]?.day?.maxwind_kph} km/h
            </Text>
          </View>
        </View>
        <View className="flex flex-col gap-2">
          <Text className="text-white text-2xl w-full font-semibold pl-4 h-auto">
            Map
          </Text>
          <View>
            <Text className="text-white flex text-base rounded-lg w-[350]  h-auto ml-4 px-4 py-3 bg-gray-600/80">
              The current wind is {weather?.current?.wind_kph} km/h from the{' '}
              {mapWindDirection(weather?.current?.wind_dir)}. Today, the wind
              speed is up to{' '}
              {weather?.forecast?.forecastday[0]?.day?.maxwind_kph} km/h
            </Text>
          </View>
        </View>
        <View className="flex flex-col gap-2">
          <Text className="text-white text-2xl w-full font-semibold pl-4 h-auto">
            Comparison
          </Text>
          <View>
            <View className="flex  rounded-lg w-[350] gap-2 flex-col  h-[200] ml-4 px-4 py-3 bg-gray-600/80">
              <Text className="text-white text-base">
                The Max Wind of today is{' '}
                {weather?.forecast?.forecastday[0]?.day?.maxwind_kph >
                history?.forecast?.forecastday[0]?.day?.maxwind_kph
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
                      data: [
                        weather?.forecast?.forecastday[0]?.day?.maxwind_kph,
                        history?.forecast?.forecastday[0]?.day?.maxwind_kph,
                      ],
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
                  color: () => `rgba(255, 225, 255, 1)`,
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
          <Text className="text-white text-2xl w-full font-semibold pl-4 h-auto">
            Summary
          </Text>
          <View>
            <Text className="text-white flex text-base rounded-lg w-[350]  h-auto ml-4 px-4 py-3 bg-gray-600/80">
              The current wind is {weather?.current?.wind_kph} km/h from the{' '}
              {mapWindDirection(weather?.current?.wind_dir)}. Today, the wind
              speed is up to{' '}
              {weather?.forecast?.forecastday[0]?.day?.maxwind_kph} km/h
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Wind;
