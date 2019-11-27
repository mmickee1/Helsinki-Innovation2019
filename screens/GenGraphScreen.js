import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  ScrollView,
  Picker,
  Button,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker'
import axios from 'axios';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import xml2js from 'react-native-xml2js'


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

const getMeasurementInfo = 'GetMeasurementInfo/?&BuildingID='
const measurementSystem = '&MeasurementSystem=SI&$format=json&$token='
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


const getConsumptionsByCategory = 'GetConsumptionsByCategory/?Building='
const energyTypeIDs = '&EnergyTypeIDs=1,2' //1 for elecricity and 2 for heating => total consumption
const timeGrouping = '&TimeGrouping=hour&ShowMetaData=false&MeasurementSystem=SI&$format=xml&$token='



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

/*
          <TouchableOpacity onPress={() => {
this.goToNextScreen(this.state.buildingID, this.state.dateStart, this.state.dateEnd, [this.state.datapoint1, this.state.datapoint2, this.state.datapoint3], titles.titles[2].type);
}} >
<View style={[styles.circle, this.state.typecolor]}>
<Text style={styles.value}>{this.state.typestate}</Text>
</View>
</TouchableOpacity>
<View>
<Text style={styles.title}>{titles.titles[2].type}</Text>
</View>*/

export default class GenGraphScreen extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    //receive here id set as building id
    this.state = {
      mystate: 'test',
      co2state: 0, //ppm
      pm10state: 0, //ppm
      vocstate: 0, //ppm
      energystate: 0, //kWh
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
      dateToday: '',

      showloading: false,

      pickerValue: '',

      hourslider: [8, 16],

      energyElect: 0,
      energyHeat: 0,

      rooms: [],
      //muista lisää ; joka datapointin jälkeen et query on ok
      energyDataPoints: [],
      co2DataPoints: [],
      pm10DataPoints: [],
      temperatureDataPoints: [],
      vocDataPoints: [],
    }
  }

  //something like this. not yet working..
  /*static defaultNavigationOptions = ({ navigation }) => {
    console.log('inside nav' + navigation)
    return {
      headerRight: () => (
        <Button
          //onPress={navigation.getParam('increaseCount')}
          //title="+1"
         // color={Platform.OS === 'ios' ? '#fff' : null}
         title='hey'
        />
      ),
    };
  };*/

  componentWillMount() {
    console.log('component will mount');
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
    that.setState({
      dateToday:
        year + '-' + month + '-' + date,
    })
  }
  componentDidMount() {
    console.log('component did mount');
    this.getValuesFromNuuka();
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

  updateElecConsumption = (kwh) => {
    this.setState({ energystate: kwh + ' kWh' })
    this.setState({ energyElect: kwh + ' kWh' })
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

  selectRoom = (room) => {
    this.setState({ pickerValue: room })
  }

  multiSliderValuesChange = (hours) => {
    console.log('data changed: ' + hours);
    this.setState({ hourslider: hours })
    this.getValuesFromNuuka();
  }

  updateRooms = (rooms) => {
    console.log('rooms ' + rooms);
    // console.log(rooms.key + rooms.value);
    this.setState({ rooms: rooms })
  }


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
  getValuesFromNuuka = () => {
    console.log('accessing nuuka api');
    this.loading();
    const dates = startTimeStatic + this.state.dateStart + "%20" + this.state.hourslider[0] + ":00" + endTimeStatic + this.state.dateEnd + "%20" + this.state.hourslider[1] + ":00";
    const measurementInfo = nuukaApi + getMeasurementInfo + this.state.buildingID + measurementSystem + apitoken;
    const measurementDataIDsCO2 = nuukaApi + getMeasurementDataByID + this.state.buildingID + dataPointIDS + this.state.datapoint1 + this.state.datapoint2 + this.state.datapoint3 + dates + timeStampZone + apitoken //muuta datapointit ja nimi
    const constumptionsByCategory = nuukaApi + getConsumptionsByCategory + this.state.buildingID + dates + energyTypeIDs + timeGrouping + apitoken

    //tässä saa buildingID:llä haettua kaikki datapointit per categoria. myös huonelistaukset.
    axios.get(measurementInfo).then(datapoints => { //CATEGORIA:  eli: points.Category       indoor conditions: co2   indoor conditions: temperature    indoor conditions: pm10 (uq/m3)   indoor conditions: tvoc (ppb)              energiaan: electricity heating
      //points.Description //katkase siitä vaan luokan numero. voi olla vaikka: I203_QE_09_319_M I203 Tila 319 huoneilman hiilidioksidi. tila/luokka ei tarvitse, vain numero. alkuun voi lisää kokonaisena sen huonelistaan. filter myöhemmin.
      var roomList = [];

      var roomsList = {}; //   roomsList.push({
      // [point.]: product.votes
      //});
      var validDataPointsEnergy = [];
      var validDataPointsCO2 = [];
      var validDataPointsVOC = [];
      var validDataPointsPM10 = [];
      var validDataPointsTemperature = [];
      datapoints.data.forEach(function (point) { //validdatapoints and roomlist
        //console.log(point);
        if (point.Category === 'indoor conditions: co2') { //jokasest omasta tämmöne ja lisää ne omiin listoihin?
          //lisää roomlist name ja datapoint number

          roomList.push(point.Name);
          /* roomList.push(po = {
 
             room: point.Name
           });*/
        }
      });
      console.log('accessed measurementinfo call!!');
      this.updateRooms(roomList);
      this.loadingdone();
    })
      .catch(function (error) {
        console.log(error);
        this.loadingdone();
      });


    //tässä hakee huoneelle (huoneen datapointeilla) olevat co2 arvot. samanlaiset kutsut muillekin 
    axios.get(measurementDataIDsCO2).then(datapoints => {
      console.log('GET REQUEST: ' + measurementDataIDsCO2);
      datapoints.data.forEach(function (point) {
        datapointerinos.push(pointObj = {
          cotwovaluerino: point.Value
        });
        datapointerinosvalues = datapointerinosvalues + point.Value;
      });
      var co2value = datapointerinosvalues / datapointerinos.length;
      co2value = co2value.toFixed(0);
      this.changeCO2State(co2value);
      console.log('changed state successfully');
      this.loadingdone();
    })
      .catch(function (error) {
        console.log(error);
        this.loadingdone();
      });

      //hae ehkä energiakulutus toisesta endpointista
    /*axios.get(constumptionsByCategory).then(datapoints => {
      var elec = [];
      var elecnumb = 0;
      var heat = [];
      var heatnumb = 0;
      console.log('GET REQUEST: ' + constumptionsByCategory);
      xml2js.parseString(datapoints.data, function (err, result) {
        result.Result.NewDataSet.forEach(function (point) {
          point.Table1.forEach(function (point) { //kato viel et matchaa numerot oikein ! et heat+elec on oikeist
            console.log(point.Consumption[0]);
            elec.push(pointObj = {
              elecvalue: parseInt(point.Consumption[0])
            });
            elecnumb = elecnumb + parseInt(point.Consumption[0]); //parseInt(point.Consumption)
          });
        });
        /* if (point.EnergyTypeID == 1) { //1 elecricity,  2 heating          //voi laskee yhteen mutta kato et kwh. eikä water kuutiometri tms..
           elec.push(point.Consumption);
           console.log('ADDED CONSUMPTION POINT: ' + point.Consumption);
         }*/
    //elecvalue = elecvalue.toFixed(0);
    /*    console.log('elecnumb: ' + elecnumb);
        console.log('elecvalue length: ' + elec.length);
      });
      console.log('accessed consumptionbycategory call!!');
      var elecvalue = elecnumb / elec.length;
      elecvalue = elecvalue.toFixed(0);
      this.updateElecConsumption(elecvalue); //updates elec consumption average per day during selected time period. NOT total consumption!!
      this.loadingdone();
    })
      .catch(function (error) {
        console.log(error);
      });*/
  }


  render() {
    var x = 0;
    return (
      <View style={styles.container} >

        <DatePicker
          style={{ width: 150 }}
          date={this.state.dateStart}
          mode="date"
          placeholder={this.state.dateStart}
          format="YYYY-MM-DD"
          minDate="2015-05-01"
          maxDate={this.state.dateToday}
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
          </View>
        }

        < DatePicker
          style={{ width: 150 }}
          date={this.state.dateEnd}
          mode="date"
          placeholder={this.state.dateEnd}
          format="YYYY-MM-DD"
          minDate={this.state.dateStart}
          maxDate={this.state.dateToday}
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
            this.getValuesFromNuuka();
          }}
        />
        < ScrollView style={styles.child} >

          <View style={styles.picker}>
            <Text>
              <Text style={{ fontWeight: "bold" }}>Valitse huone</Text>
            </Text>
            <Picker
              mode="dropdown"
              selectedValue={(this.state && this.state.pickerValue) || ''}
              onValueChange={(itemValue, itemIndex) => {
                this.selectRoom(itemValue);
              }}>
              <Picker.Item label={""} value={""} />
              {this.state.rooms.map((item, index) => {
                return (<Picker.Item label={item} value={index} key={index} />)
              })}

            </Picker>

            <MultiSlider
              values={[this.state.hourslider[0], this.state.hourslider[1]]}
              sliderLength={144}
              onValuesChange={this.multiSliderValuesChange}
              min={0}
              max={23}
              step={1}
            />
            <Text style={styles.titlee}>Kellonaika:   {this.state.hourslider[0]}  -  {this.state.hourslider[1]}</Text>
          </View>

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


        </ScrollView >


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
      </View >
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
    flexBasis: '50%',
    width: '50%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 100,

  },
  childright: {
    flexBasis: '50%',
    width: '50%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 100,
  },
  header: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    paddingBottom: 16,
  },
  circle: {
    width: 150,
    height: 150,
    textAlign: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  picker: {
    width: 150,
    marginTop: 30,
    marginBottom: 30,
  }
});