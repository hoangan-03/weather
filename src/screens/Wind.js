import React from 'react';
import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

const Wind = ({route}) => {
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

  const navigateToWind = () => {
    // Navigate to the other screen
    navigation.navigate('Home');
  };
  return (
    <ScrollView className="w-full h-full flex bg-black/70  ">
      <View className="w-full flex flex-col  h-full justify-start items-start mt-11 gap-4 pt-24 pl-5 ">
        <TouchableOpacity
          onPress={navigateToWind}
          className="flex-row w-12 h-12 right-4 absolute top-10  gap-2 pl-23 pr-4 pb-2 text-xl  items-center justify-center bg-gray-400/50 rounded-2xl "></TouchableOpacity>
        <View className="text-gray-200 flex flex-row absolute  items-center justify-center top-10 text-xl w-full h-auto gap-2">
          <Image
            source={require('../../assets/icons/wind.png')}
            className="w-6 h-6"
          />
          <Text className="text-white font-semibold text-xl">Wind</Text>
        </View>
        <View className="w-auto flex flex-row justify-start pl-4 h-8 text-end items-end">
          <Text className="text-white text-4xl w-auto text-end h-auto ">
            {weather?.current?.wind_kph}
          </Text>
          <Text className="text-gray-300 text-xl text-end h-6"> km/h</Text>
        </View>
        <Text className="text-gray-200 text-xl w-full pl-4 h-8 mb-4">
          Max Wind: {weather?.forecast?.forecastday[0]?.day?.maxwind_kph} km/h
        </Text>
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
        <Text className="text-white text-2xl w-full pl-4 h-auto">Summary</Text>
        <Text className="text-white text-start text-base rounded-2xl w-[360] h-auto px-4 py-3 bg-gray-100/10">
          The current wind is {weather?.current?.wind_kph} km/h from the{' '}
          {mapWindDirection(weather?.current?.wind_dir)}. Today, the wind speed
          is up to {weather?.forecast?.forecastday[0]?.day?.maxwind_kph} km/h
        </Text>
      </View>
    </ScrollView>
  );
};

export default Wind;
