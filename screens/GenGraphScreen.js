import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  ScrollView,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker'
import axios from 'axios';


const titles = {
  titles: [
    {
      energy: 'Energian kulutus'
    }, {
      temperature: 'Lämpötila'
    }, {
      type: 'Tyyppi'
    }, {
      co2: 'CO2-Hiukkaset'
    }, {
      pm10: 'PM10-Hiukkaset'
    }, {
      voc: 'VOC-hiukkaset'
    }, {
      all: 'All Graphs'
    }
  ]
};

// Make a request for a user with a given ID
const apitoken = 'L2FyTzA3UHp1cGdnUzNMcjRuSUIvZ2o0Q2tCclhQam44SGo5Nm9HcE0zcz06TWV0cm9wb2xpYV9BUEk6NjM3MDMxOTIzMzk5NjcxNzEwOlRydWU='
const nuukaApi = 'https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/'
const getMeasurementDataByID = 'GetMeasurementDataByIDs/?&Building='
const dataPointIDS = '&DataPointIDs='
const startTimeStatic = '&StartTime='
const endTimeStatic = '&EndTime='
const timeStampZone = '&TimestampTimeZone=UTCOffset&MeasurementSystem=SI&$format=json&$token='
const datapointerinos = [];
let datapointerinosvalues = 0;


/*
//Performing multiple concurrent requests
function getUserAccount() {
  return axios.get('/user/12345');
}
function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}
axios.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread(function (acct, perms) {
    // Both requests are now complete
  }));*/


//esimerkki co2 arvojen saamisesta
//https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/GetMeasurementDataByIDs/?&Building=2410&DataPointIDs=83511;83519;83527&StartTime=2019-08-01&EndTime=2019-08-30&TimestampTimeZone=UTCOffset&MeasurementSystem=SI&$format=json&$token=L2FyTzA3UHp1cGdnUzNMcjRuSUIvZ2o0Q2tCclhQam44SGo5Nm9HcE0zcz06TWV0cm9wb2xpYV9BUEk6NjM3MDMxOTIzMzk5NjcxNzEwOlRydWU=

//working startTime: 2019 elokuu. eli 2019-08-1   ja 2019-08-1

/*
CO2 levels from https://www.kane.co.uk/knowledge-centre/what-are-safe-levels-of-co-and-co2-in-rooms
I received 450-650 from nuuka api
250-350     ppm	    Normal background concentration in outdoor ambient air
350-1,000   ppm	    Concentrations typical of occupied indoor spaces with good air exchange
1,000-2,000 ppm	    Complaints of drowsiness and poor air.
2,000-5,000 ppm	    Headaches, sleepiness and stagnant, stale, stuffy air. Poor concentration,
                    loss of attention, increased heart rate and slight nausea may also be present.
5,000       ppm	    Workplace exposure limit (as 8-hour TWA) in most jurisdictions.
>40,000     ppm	    Exposure may lead to serious oxygen deprivation resulting in permanent brain damage, 
                    coma, even death.*/

export default class GenGraphScreen extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      mystate: 'test',
      co2state: 0,
      pm10state: 0,
      vocstate: 0,
      energystate: 0,
      temperaturestate: 0,
      cotwovaluerino: 0,
      typestate: 0,
      energycolor: styles.greencircle,
      temperaturecolor: styles.greencircle,
      co2color: styles.greencircle,
      pm10color: styles.greencircle,
      voccolor: styles.greencircle,
      typecolor: styles.greencircle,

      buildingID: 2410,
      datapoint1: 83511 + ';',
      datapoint2: 83519 + ';',
      datapoint3: 83527 + ';',
      dateStart: '',  //has to be year-month-date
      dateEnd: '',

      showloading: false
    }
  }

  componentDidMount() {
    console.log('component did mount');
    let that = this;
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    that.setState({
      dateStart:
        year + '-' + month + '-' + date,
    });
    that.setState({
      dateEnd:
        year + '-' + month + '-' + date,
    });
  }

  testState = () => {
    this.setState({ mystate: 'updated' })
  }
  changeCO2State = (data) => {
    if (data > 0 && data < 1000) {
      this.setState({ co2color: styles.yellowcircle })
    } else if (data > 1000 && data < 2000) {
      this.setState({ co2color: styles.redcircle })
    } else {
      this.setState({ co2color: styles.greencircle })
    }
    this.setState({ co2state: data + ' ppm' })
  }

  goToNextScreen = (buildingID, timeStart, timeStop, datapointArray, graphType) => {
    console.log(buildingID, timeStart, timeStop, datapointArray, graphType);
    this.props.navigation.navigate('DetailedGraph', {
      buildingID: buildingID,
      timeStart: timeStart,
      timeStop: timeStop,
      datapointArray: datapointArray,
      graphType: graphType
    })
  }

  loading = () => {
    this.setState({ showloading: true })
  }
  loadingdone = () => {
    this.setState({ showloading: false })
  }

  getValuesFromNuuka = () => {
    console.log('accessing nuuka api');
    this.loading();
    axios.get(nuukaApi + getMeasurementDataByID + this.state.buildingID + dataPointIDS
      + this.state.datapoint1 + this.state.datapoint2 + this.state.datapoint3
      + startTimeStatic + this.state.dateStart + endTimeStatic + this.state.dateEnd
      + timeStampZone + apitoken)
      .then(datapoints => {
        datapoints.data.forEach(function (point) {
          datapointerinos.push(pointObj = {
            cotwovaluerino: point.Value
          });
          datapointerinosvalues = datapointerinosvalues + point.Value;
        });
        var co2value = datapointerinosvalues / datapointerinos.length;
        co2value = co2value.toFixed(0);
        this.changeCO2State(co2value);
        console.log('changed state');
        console.log('loading finished');
        this.loadingdone();
      })
      .catch(function (error) {
        console.log(error);
        this.loadingdone();
      })
  }


  render() {
    var x = 0;
    return (
      <View style={styles.container}>

        <DatePicker
          style={{ width: 150 }}
          date={this.state.dateStart}
          mode="date"
          placeholder={this.state.dateStart}
          format="YYYY-MM-DD"
          minDate="2015-05-01"
          maxDate="2025-06-01"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
          }}
          onDateChange={(startTime) => {
            this.setState({ dateStart: startTime })
            console.log('date changed ' + startTime);
            this.getValuesFromNuuka();
          }}
        />
        {this.state.showloading &&
          <View>
            <ActivityIndicator />
          </View>}

        <DatePicker
          style={{ width: 150 }}
          date={this.state.dateEnd}
          mode="date"
          placeholder={this.state.dateEnd}
          format="YYYY-MM-DD"
          minDate={this.state.dateStart}
          maxDate="2025-06-01"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
          }}
          onDateChange={(endTime) => {
            this.setState({ dateEnd: endTime })
            console.log('date changed ' + endTime);
            this.loading();
            this.getValuesFromNuuka();
          }}
        />
        <ScrollView style={styles.child}>

          <TouchableOpacity onPress={() => {
            this.goToNextScreen(this.state.buildingID, this.state.dateStart, this.state.dateEnd, [this.state.datapoint1, this.state.datapoint2, this.state.datapoint3], titles.titles[0].energy);
          }} >
            <View style={[styles.circle, this.state.energycolor]}>
              <Text style={styles.value}> {this.state.energystate}</Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>{titles.titles[0].energy}</Text>
          </View>


          <TouchableOpacity onPress={() => {
            this.goToNextScreen(this.state.buildingID, this.state.dateStart, this.state.dateEnd, [this.state.datapoint1, this.state.datapoint2, this.state.datapoint3], titles.titles[1].temperature);
          }} >
            <View style={[styles.circle, this.state.temperaturecolor]}>
              <Text style={styles.value}>{this.state.temperaturestate}</Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>{titles.titles[1].temperature}</Text>
          </View>

          <TouchableOpacity onPress={() => {
            this.goToNextScreen(this.state.buildingID, this.state.dateStart, this.state.dateEnd, [this.state.datapoint1, this.state.datapoint2, this.state.datapoint3], titles.titles[2].type);
          }} >
            <View style={[styles.circle, this.state.typecolor]}>
              <Text style={styles.value}>{this.state.typestate}</Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>{titles.titles[2].type}</Text>
          </View>

        </ScrollView>


        <ScrollView style={styles.childright}>

          <TouchableOpacity onPress={() => {
            this.goToNextScreen(this.state.buildingID, this.state.dateStart, this.state.dateEnd, [this.state.datapoint1, this.state.datapoint2, this.state.datapoint3], titles.titles[3].co2);
          }} >
            <View style={[styles.circle, this.state.co2color]}>
              <Text style={styles.value}>{this.state.co2state}</Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>{titles.titles[3].co2}</Text>
          </View>


          <TouchableOpacity onPress={() => {
            this.goToNextScreen(this.state.buildingID, this.state.dateStart, this.state.dateEnd, [this.state.datapoint1, this.state.datapoint2, this.state.datapoint3], titles.titles[4].pm10);
          }} >
            <View style={[styles.circle, this.state.pm10color]}>
              <Text style={styles.value}>{this.state.pm10state}</Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>{titles.titles[4].pm10}</Text>
          </View>


          <TouchableOpacity onPress={() => {
            this.goToNextScreen(this.state.buildingID, this.state.dateStart, this.state.dateEnd, [this.state.datapoint1, this.state.datapoint2, this.state.datapoint3], titles.titles[5].voc);
          }} >
            <View style={[styles.circle, this.state.voccolor]}>
              <Text style={styles.value}>{this.state.vocstate} </Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>{titles.titles[5].voc}</Text>
          </View>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 8,
    marginHorizontal: 8,
  },
  child: {
    paddingTop: 10,
    flexBasis: '50%',
    width: '50%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  childright: {
    paddingTop: 10,
    flexBasis: '50%',
    width: '50%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    paddingBottom: 16
  },
  circle: {
    width: 150,
    height: 150,
    textAlign: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  redcircle: {
    color: '#ff0000',
    backgroundColor: '#ff0000',
  },
  greencircle: {
    color: '#00ff00',
    backgroundColor: '#00ff00',
  },
  yellowcircle: {
    color: '#ffff00',
    backgroundColor: '#fff000',
  },
  value: {
    marginBottom: 15,
    marginTop: 15,
    fontWeight: 'bold',
    fontSize: 24
  },
  loaderstyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});