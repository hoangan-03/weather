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
  const data = [
    {label: 'miles/hour (mi/h)', value: 1},
    {label: 'kilometer/hour (km/h)', value: 2},
  ];
  const dataa = Array.from({length: 24}, (_, index) => {
    const hourData = weather?.forecast?.forecastday[0]?.hour[index];
    return hourData ? hourData[value === 2 ? 'wind_kph' : 'wind_mph'] : null;
  });
  const [value, setValue] = useState(2);
  const [isFocus, setIsFocus] = useState(false);
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
        onPress={navigateToWind}
        className="w-12 h-12 right-4 absolute top-12 rounded-full p-3 m-1 bg-gray-400/50
        ">
        <XMarkIcon size="25" color="white" />
      </TouchableOpacity>
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
              {value === 2
                ? weather?.current?.wind_kph
                : weather?.current?.wind_mph}
            </Text>
            <Text className="text-gray-300 text-xl text-end h-8">
              {' '}
              {value == 2 ? 'km/h' : 'mph'}{' '}
            </Text>
          </View>
          <Text className="text-gray-200 text-xl w-full pl-4 h-8 mb-4">
            Max Wind:{' '}
            {value === 2
              ? weather?.forecast?.forecastday[0]?.day?.maxwind_kph + ' km/h'
              : weather?.forecast?.forecastday[0]?.day?.maxwind_mph + ' mph'}
          </Text>
        </View>
        <LineChart
          data={{
            labels: ['00', '06', '12', '18'],
            datasets: [
              {
                data: dataa,
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
          <Text className="text-white text-xl w-full font-semibold pl-4 h-auto">
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
          <Text className="text-white text-xl w-full font-semibold pl-4 h-auto">
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
          <Text className="text-white text-xl w-full font-semibold pl-4 h-auto">
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
            How Wind Speed is measured?
          </Text>
          <View>
            <Text className="text-white flex text-base rounded-lg w-[350] text-justify h-auto ml-4 px-4 py-3 bg-gray-600/80">
              Wind speed is measured using a cup anemometer with three or four
              cups arranged symmetrically. The rotation of the cups is
              proportional to the wind speed in standard instruments, ensuring
              an accurate approximation.
            </Text>
          </View>
        </View>
        <View className="flex flex-col gap-2 mb-10">
          <Text className="text-white text-xl w-full font-semibold pl-4 h-auto">
            How Wind Speed is measured?
          </Text>
          <View style={styles.container}>
            <Dropdown
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedStyle={styles.selectedTextStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              itemContainerStyle={styles.itemContainerStyle}
              iconStyle={styles.iconStyle}
              itemTextStyle={styles.itemTextStyle}
              data={data}
              activeColor="#dee9ff"
              maxHeight={300}
              labelField="label"
              valueField="value"
              alwaysRenderSelectedItem
              placeholder={!isFocus ? 'Unit' : '...'}
              showsVerticalScrollIndicator={false}
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setValue(item.value);
                setIsFocus(false);
              }}
              dropdownPosition="top"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Wind;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingTop: 10,
  },
  itemContainerStyle: {
    backgroundColor: 'white',
  },

  dropdown: {
    height: 50,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(74, 85, 104, 0.8)',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',

    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'white',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'white',
  },
  itemTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
