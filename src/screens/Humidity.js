import {Dimensions, StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
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
import {theme} from '../../theme';
import {XMarkIcon} from 'react-native-heroicons/outline';
const Humidity = ({route}) => {
  const [history, setHistory] = useState({});
  const [currentInterface, setCurrentInterface] = useState(0);
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

  const weather = route.params?.prop1;
  const navigation = useNavigation();

  const screenHeight = Dimensions.get('window').height;

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  const dailyHumidity = Array.from({length: 24}, (_, index) => {
    const hourData =
      weather?.forecast?.forecastday[currentInterface]?.hour[index];
    return hourData.humidity;
  });
  const comparisonData = [
    weather?.forecast?.forecastday[0]?.day?.avghumidity,
    history?.forecast?.forecastday[0]?.day?.avghumidity,
  ];

  const [isFocus, setIsFocus] = useState(false);
  const currentHour = new Date().getHours();
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
        style={{backgroundColor: theme.bgWhite(0.3)}}
        onPress={navigateToHome}
        className="w-12 h-12 right-4 absolute top-12 rounded-full p-3 m-1 bg-gray-400/50
        ">
        <XMarkIcon size="25" color="white" />
      </TouchableOpacity>
      <View className="text-gray-200 flex flex-row self-center absolute items-center justify-center top-16 text-xl w-auto h-auto gap-2">
        <Image
          source={require('../../assets/icons/drop.png')}
          className="w-6 h-6"
        />
        <Text className="text-white font-semibold text-xl ">Humidity</Text>
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
          <View
            className={`w-auto flex flex-row justify-start pl-4 h-8 text-end items-end ${
              currentInterface == 0 ? 'block' : 'hidden'
            } `}>
            <Text className="text-white text-4xl font-semibold w-auto text-end h-auto ">
              {weather?.current?.humidity}
            </Text>
            <Text className="text-gray-300 text-2xl text-end h-8">{' %'}</Text>
          </View>
          <View
            className={`w-auto flex flex-row justify-start pl-4 h-8 text-end items-end ${
              currentInterface == 0 ? 'hidden' : 'block'
            } `}>
            <Text className="text-white text-4xl font-semibold w-auto text-end h-auto ">
              {
                weather?.forecast?.forecastday[currentInterface].day
                  ?.avghumidity
              }
            </Text>
            <Text className="text-gray-300 text-2xl text-end h-8">{' %'}</Text>
          </View>
          <Text
            className={`text-gray-300 text-xl w-full pl-4 h-8  mb-4 ${
              currentInterface == 0 ? 'hidden' : 'block'
            }`}>
            Average
          </Text>
          <Text
            className={`text-gray-300 text-xl w-full pl-4 h-8 mb-4 ${
              currentInterface == 0 ? 'block' : 'hidden'
            }`}>
            Dew point:{' '}
            {`${weather?.forecast?.forecastday[currentInterface]?.hour[currentHour]?.dewpoint_c} \u00b0C`}
          </Text>
        </View>
        <LineChart
          data={{
            labels: ['00', '06', '12', '18'],
            datasets: [
              {
                data: dailyHumidity,
              },
            ],
          }}
          width={400}
          height={340}
          hideGrid={true}
          fromZero={true}
          withDots={false}
          segments={6}
          yAxisSuffix={' %'}
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
              The current humidity is {weather?.current?.humidity} %. Today the
              average humidity is{' '}
              {weather?.forecast?.forecastday[0]?.day?.avghumidity} %. The dew
              point fluctuates from{' '}
              {`${Math.min(
                ...(weather?.forecast?.forecastday[0]?.hour.map(
                  hour => hour?.dewpoint_c || 0,
                ) || []),
              )}\u00b0C to ${Math.max(
                ...(weather?.forecast?.forecastday[0]?.hour.map(
                  hour => hour?.dewpoint_c || 0,
                ) || []),
              )}\u00b0C throughout the day.`}
            </Text>
          </View>
          <View className={`${currentInterface == 0 ? 'hidden' : 'block'}`}>
            <Text className="text-white flex text-base rounded-lg w-[350]  h-auto ml-4 px-4 py-3 bg-gray-600/80">
              On{' '}
              {new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(
                new Date(
                  weather?.forecast?.forecastday[currentInterface]?.date,
                ),
              )}
              , the average humidity is{' '}
              {
                weather?.forecast?.forecastday[currentInterface]?.day
                  ?.avghumidity
              }{' '}
              %. The dew point fluctuates from{' '}
              {`${Math.min(
                ...(weather?.forecast?.forecastday[currentInterface]?.hour.map(
                  hour => hour?.dewpoint_c || 0,
                ) || []),
              )}\u00b0C to ${Math.max(
                ...(weather?.forecast?.forecastday[currentInterface]?.hour.map(
                  hour => hour?.dewpoint_c || 0,
                ) || []),
              )}\u00b0C throughout the day.`}
            </Text>
          </View>
        </View>
        <View className="flex flex-col gap-2">
          <Text className="text-white text-xl w-full font-semibold pl-4 h-auto">
            Map
          </Text>
          <View>
            <Text className="text-white flex text-base rounded-lg w-[350]  h-auto ml-4 px-4 py-3 bg-gray-600/80">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters
            </Text>
          </View>
        </View>
        <View
          className={`flex flex-col gap-2 ${
            currentInterface == 0 ? 'block' : 'hidden'
          }`}>
          <Text
            className={`text-white text-xl w-full font-semibold pl-4 h-auto `}>
            Comparison
          </Text>
          <View>
            <View className="flex  rounded-lg w-[350] gap-2 flex-col  h-[200] ml-4 px-4 py-3 bg-gray-600/80">
              <Text className="text-white text-base">
                The average humidity of today is{' '}
                {weather?.forecast?.forecastday[0]?.day?.avghumidity >
                history?.forecast?.forecastday[0]?.day?.avghumidity
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
            About relative humidity
          </Text>
          <View>
            <Text className="text-white flex text-base rounded-lg w-[350] text-justify h-auto ml-4 px-4 py-3 bg-gray-600/80">
              Relative humidity is the ratio of how much water vapour is in the
              air to how much water vapour the air could potentially contain at
              a given temperature. It varies with the temperature of the air:
              colder air can hold less vapour.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Humidity;
