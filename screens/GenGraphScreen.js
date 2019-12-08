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
var datapointerinosco2 = [];
let datapointerinosvaluesco2 = 0;

var datapointerinosvoc = [];
let datapointerinosvaluesvoc = 0;

var datapointerinospm10 = [];
let datapointerinosvaluespm10 = 0;

var datapointerinosenergy = [];
let datapointerinosvaluesenergy = 0;

var datapointerinostemperature = [];
let datapointerinosvaluestemperature = 0;


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


/* Nuuka data:
Min kesä	Max kesä	Min talvi	Max talvi	Min kesä	Max kesä	Min talvi	Max talvi	Min kesä	Max kesä	Min talvi	Max talvi
Sisälämpötila (C)	22	25	20,5	22,5	21	26	20,5	23	20	27	20	25
Suhteellinen ilmankosteus (%)	 	 	25	45	 	 	 	 	 	 	 	 
CO2 (ppm)	0	750	0	750	0	950	0	950	0	1200	0	1200
Haihtuvien orgaanisten yhdisteiden kokonaismäärä (TVOC, ppb)	0	660	0	660	0	660	0	660	 	 	 	 
Paine-ero sisä / ulkona (Pa)	-2	2	-2	2	-2	2	-2	2	 	 	 	 
PM2,5 (μg / m3)	0	10	0	10	0	10	0	10	0	25	0	25
PM2,5 sisällä / ulkopuolella (0-1)	0	0,5	0	0,5	0	0,7	0	0,7	 	 	 	 
PM10 (μg / m3)	0	25	0	25	0	25	0	25	 	 	 	 
Tuloilman lämpötila (C)	 	 	17	19	 	 	17	19	 	 	 	 
Vetoa aistivien osuus (%)	0	10	0	10	0	15	0	15	 	 	 	 
Ilman liikenopeus (m / s)	0	0,2	0	0,15	0	0,25	0	0,2	0	0,3	0	0,2
Radonpitoisuus (Bq / m3)	0	100	0	100	0	100	0	100	0	200	0	200*/

/* eli green, yellow, red
lämpötila 21-23,  20-21/23-25, -20 25+
co2  0-750, 750-950, 950+
pm10 0-10, 10-20, 20+
voc 0-0.5 , 0.5-1, 1+   //ppm = (μg / m3)  / 1000
energy WHITE CIRLCE, cant be calculated yet before nuuka's api is updated 
*/

/*
TVOC Level mg/m3	   Level of Concern
Less than 0.3 mg/m3	   Low
0.3 to 0.5 mg/m3	   Acceptable
0.5 to 1 mg/m3	   Marginal
1 to 3 mg/m3	   High*/

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
    //console.log(props);
    //receive here id set as building id
    //console.log('STATE PARAMS ' + props.navigation.state.params.buildingID + props.navigation.state.params.buildingName); //näkyy jos klikkaa kartalta tälle sivulle
    this.state = {
      loading: 'initial',
      co2state: 0, //ppm
      pm10state: 0, //ppm
      vocstate: 0, //ppm
      energystate: 0, //kWh
      temperaturestate: 0,
      cotwovaluerino: 0,
      typestate: 0,
      energycolor: styles.neutralcircle,
      temperaturecolor: styles.greencircle,
      co2color: styles.greencircle,
      pm10color: styles.greencircle,
      voccolor: styles.greencircle,
      typecolor: styles.greencircle,

      buildingID: 2410, //2410 else
      datapoint1: 83511 + ';',
      datapoint2: 83519 + ';',
      datapoint3: 83527 + ';',
      dateStart: '',  //has to be year-month-date
      dateEnd: '',
      dateToday: '',
      currentBuilding: 'Kaisaniemen ala-aste', //_getBuildingName, //Kaisaniemen ala-aste
      showloading: false,

      pickerValue: '',

      hourslider: [8, 16],

      energyElect: 0,
      energyHeat: 0,

      rooms: ['room1'],
      //muista lisää ; joka datapointin jälkeen et query on ok
      co2dp: '83511;',
      pm10dp: '',
      vocdp: '',
      tempdp: '',
      energydp: '',

      energyDataPoints: [],
      co2DataPoints: [],
      pm10DataPoints: [],
      temperatureDataPoints: [],
      vocDataPoints: [],
    }
  }

  getBuildingID() {
    return this.props.navigation.state.params.buildingID || 2410
  }

  getBuildingName() {
    return this.props.navigation.state.params.buildingName || 'Kaisaniemen Ala-Aste'
  }

  componentWillMount() {
    console.log('component will mount');
    let that = this;
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    console.log('BUILDING ID AFTER CXALL ' + that.getBuildingID());
    that.setState({
      buildingID: that.getBuildingID(),
    });
    console.log('BUILDING BNAME AFTER CXALL ' + that.getBuildingName());
    that.setState({
      currentBuilding: that.getBuildingName()
    });
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
    that.setState({
      loading: 'true'
    });
    // that.prefixvalues();
  }


  //max datapoints for one request is 100!!!
  prefixvalues() {
    var measurementInfo = nuukaApi + getMeasurementInfo + this.state.buildingID + measurementSystem + apitoken;
    axios.get(measurementInfo).then(datapoints => { //CATEGORIA:  eli: points.Category       indoor conditions: co2   indoor conditions: temperature    indoor conditions: pm10 (uq/m3)   indoor conditions: tvoc (ppb)              energiaan: electricity heating
      var roomList = [];

      var validDataPointsEnergy = '';
      var energydpcalculator = 0;

      var validDataPointsCO2 = '';
      var co2dpcalculator = 0;

      var validDataPointsVOC = '';
      var vocdpcalculator = 0;

      var validDataPointsPM10 = '';
      var pm10dpcalculator = 0;

      var validDataPointsTemperature = '';
      var temp2dpcalculator = 0;

      for (let point of datapoints.data) {
        if (point.Category === 'indoor conditions: co2') {
          if (co2dpcalculator === 10) {
            break;
          }
          roomList.push(point.Name);
          validDataPointsCO2 = validDataPointsCO2 + point.DataPointID + ';';
          co2dpcalculator += 1;
          console.log('co2dpcalculator size: ' + co2dpcalculator);
        }
      }

      for (let point of datapoints.data) {
        if (point.Category === 'indoor conditions: tvoc (ppb)') {
          if (vocdpcalculator === 10) {
            break;
          }
          validDataPointsVOC = validDataPointsVOC + point.DataPointID + ';';
          vocdpcalculator += 1;
        }
      }

      for (let point of datapoints.data) {
        if (point.Category === 'indoor conditions: pm10 (uq/m3)') {
          if (pm10dpcalculator === 10) {
            break;
          }
          validDataPointsPM10 = validDataPointsPM10 + point.DataPointID + ';';
          pm10dpcalculator += 1;
        }
      }

      for (let point of datapoints.data) {
        if (point.Category === 'electricity') {  //heating is in MWh , change it first , then add this to if statement /* || point.Category === 'heating'*/
          if (energydpcalculator === 10) {
            break;
          }
          validDataPointsEnergy = validDataPointsEnergy + point.DataPointID + ';';
          energydpcalculator += 1;
        }
      }

      for (let point of datapoints.data) {
        if (point.Category === 'indoor conditions: temperature') {
          if (temp2dpcalculator === 10) {
            break;
          }
          validDataPointsTemperature = validDataPointsTemperature + point.DataPointID + ';';
          temp2dpcalculator += 1;
          console.log('temperaturedpcalculator size: ' + temp2dpcalculator);
        }
      }

      this.setState({ rooms: roomList })
      this.setState({ co2dp: validDataPointsCO2 })
      this.setState({ vocdp: validDataPointsVOC })
      this.setState({ pm10dp: validDataPointsPM10 })
      this.setState({ energydp: validDataPointsEnergy })
      this.setState({ tempdp: validDataPointsTemperature })
      console.log('COMPONENT FETCHED AND RECEIVED DATAPOINTS');
      this.getValuesFromNuuka();
    }).catch(function (error) {
      console.log(error);
    });
  }

  componentDidMount() {
    console.log('component did mount');
    this.checkPrefix();
    //this.getValuesFromNuuka();
  }

  checkPrefix() {
    this.prefixvalues();
  }

  changeCO2State = (data) => {
    //0-750, 750-950, 950+
    if (data > 0 && data <= 750) {
      this.setState({ co2color: styles.greencircle })
    } else if (data > 750 && data <= 950) {
      this.setState({ co2color: styles.yellowcircle })
    } else if (data > 950) {
      this.setState({ co2color: styles.redcircle })
    } else {
      this.setState({ co2color: styles.neutralcircle })
    }
    this.setState({ co2state: data + ' ppm' })
  }

  changeVOCstate = (data) => {
    //voc 0-0.5 , 0.5-1, 1+   //ppm = (μg / m3)  / 1000
    if (data > 0 && data <= 0.5) {
      this.setState({ voccolor: styles.greencircle })
    } else if (data > 0.5 && data <= 1) {
      this.setState({ voccolor: styles.yellowcircle })
    } else if (data > 1) {
      this.setState({ voccolor: styles.redcircle })
    } else {
      this.setState({ voccolor: styles.neutralcircle })
    }
    this.setState({ vocstate: data + ' μg / m3' })
  }

  changePM10state = (data) => {
    //pm10 0-10, 10-20, 20+
    if (data > 0 && data <= 10) {
      this.setState({ pm10color: styles.greencircle })
    } else if (data > 10 && data <= 20) {
      this.setState({ pm10color: styles.yellowcircle })
    } else if (data > 20) {
      this.setState({ pm10color: styles.redcircle })
    } else {
      this.setState({ pm10color: styles.neutralcircle })
    }
    this.setState({ pm10state: data + ' μg / m3' })
  }

  changeENERGYstate = (data) => {
    //energy not yet calculated per m2. Just showing raw data value in kWh.
    this.setState({ energycolor: styles.neutralcircle })
    this.setState({ energystate: data + ' kWh' })
    this.setState({ energyElect: data + ' kWh' })
  }

  changeTEMPERATUREstate = (data) => {
    //lämpötila 21-23,  20-21/23-25, -20 25+
    console.log('average temperature: ' + data);
    if (data > 21 && data <= 23) {
      this.setState({ temperaturecolor: styles.greencircle })
    } else if ((data > 20 || data <= 21) || (data > 23 || data <= 25)) {
      this.setState({ temperaturecolor: styles.yellowcircle })
    } else if (data > 25 || data < 20) {
      this.setState({ temperaturecolor: styles.redcircle })
    } else {
      this.setState({ temperaturecolor: styles.neutralcircle })
    }
    this.setState({ temperaturestate: data + ' C' })
  }

  updateElecConsumption = (kwh) => {
    this.setState({ energystate: kwh + ' kWh' })
    this.setState({ energyElect: kwh + ' kWh' })
  }

  goToNextScreen = (buildingID, timeStart, timeStop, datapointArray, graphType) => { //[this.state.co2dp, this.state.vocdp, this.state.pm10dp, this.state.energydp, this.state.tempdp]
    console.log(buildingID, timeStart, timeStop, datapointArray, graphType); //datapointArray[0], datapointArray[1], datapointArray[2], datapointArray[3], datapointArray[4],
    this.props.navigation.navigate('Kuvaaja', {
      buildingID: buildingID,
      timeStart: timeStart,
      timeStop: timeStop,
      co2dp: datapointArray[0],
      vocdp: datapointArray[1],
      pm10dp: datapointArray[2],
      energydp: datapointArray[3],
      temperaturedp: datapointArray[4],
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
    this.setState({ hourslider: hours })
    this.getValuesFromNuuka();
  }

  updateRooms = (rooms) => {
    console.log('rooms ' + rooms);
    this.setState({ rooms: rooms })
  }

  updateCO2dps = (validDataPointsCO2) => {
    this.setState({ co2dp: validDataPointsCO2 })
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


  /* const p = new Promise(resovle => setTimeout(resovle));
   new Promise(resolve => resolve(p)).then(() => {
     console.log("tick 3");
   });
   p.then(() => {
     console.log("tick 1");
   }).then(() => {
     console.log("tick 2");
   });*/
  getValuesFromNuuka = () => {
    console.log('accessing nuuka api for values');
    this.loading();
    const dates = startTimeStatic + this.state.dateStart + "%20" + this.state.hourslider[0] + ":00" + endTimeStatic + this.state.dateEnd + "%20" + this.state.hourslider[1] + ":00";
    // const measurementDataIDsCO2 = nuukaApi + getMeasurementDataByID + this.state.buildingID + dataPointIDS + this.state.datapoint1 + this.state.datapoint2 + this.state.datapoint3 + dates + timeStampZone + apitoken //muuta datapointit ja nimi
    const constumptionsByCategory = nuukaApi + getConsumptionsByCategory + this.state.buildingID + dates + energyTypeIDs + timeGrouping + apitoken;

    const measurementDataIDsCO2 = nuukaApi + getMeasurementDataByID + this.state.buildingID + dataPointIDS + this.state.co2dp + dates + timeStampZone + apitoken;
    const measurementDataIDsVOC = nuukaApi + getMeasurementDataByID + this.state.buildingID + dataPointIDS + this.state.vocdp + dates + timeStampZone + apitoken;
    const measurementDataIDsENERGY = nuukaApi + getMeasurementDataByID + this.state.buildingID + dataPointIDS + this.state.energydp + dates + timeStampZone + apitoken;
    const measurementDataIDsPM10 = nuukaApi + getMeasurementDataByID + this.state.buildingID + dataPointIDS + this.state.pm10dp + dates + timeStampZone + apitoken;
    const measurementDataIDsTEMPERATURE = nuukaApi + getMeasurementDataByID + this.state.buildingID + dataPointIDS + this.state.tempdp + dates + timeStampZone + apitoken;



    //CO2 VALUE FETCHING
    axios.get(measurementDataIDsCO2).then(datapoints => {
      datapoints.data.forEach(function (point) {
        if (point.Value !== 0) {
          datapointerinosco2.push(pointObj = {
            cotwovaluerino: point.Value
          });
          datapointerinosvaluesco2 = datapointerinosvaluesco2 + point.Value;
        }
      });
      var co2value = datapointerinosvaluesco2 / datapointerinosco2.length;
      co2value = co2value.toFixed(0);
      this.changeCO2State(co2value);
      console.log("CO2value after update: " + co2value);
    })
      .catch(function (error) {
        console.log(error);
        this.loadingdone();
      });

    //electricity
    axios.get(measurementDataIDsENERGY).then(datapoints => {
      datapoints.data.forEach(function (point) {
        if (point.Value !== 0) {
          datapointerinosenergy.push(pointObj = {
            x: point.Value
          });
          datapointerinosvaluesenergy = datapointerinosvaluesenergy + point.Value;
        }
      });
      var energyvalue = datapointerinosvaluesenergy / datapointerinosenergy.length;
      energyvalue = energyvalue.toFixed(0);
      this.changeENERGYstate(energyvalue);
      console.log("energyvalue after update: " + energyvalue);
    })
      .catch(function (error) {
        console.log(error);
        this.loadingdone();
      });

    //temperature
    axios.get(measurementDataIDsTEMPERATURE).then(datapoints => {
      console.log('query ' + measurementDataIDsTEMPERATURE);
      datapoints.data.forEach(function (point) {
        if (point.Value !== 0) {
          datapointerinostemperature.push(pointObj = {
            x: point.Value
          });
          datapointerinosvaluestemperature = datapointerinosvaluestemperature + point.Value;
        }
      });
      var temperaturevalue = datapointerinosvaluestemperature / datapointerinostemperature.length;
      console.log('temperaturevalue after axios ' + temperaturevalue);
      temperaturevalue = temperaturevalue.toFixed(1);
      this.changeTEMPERATUREstate(temperaturevalue);
    })
      .catch(function (error) {
        console.log(error);
        this.loadingdone();
      });

    //PM10 VALUE FETCHING
    axios.get(measurementDataIDsPM10).then(datapoints => {
      datapoints.data.forEach(function (point) {
        if (point.Value !== 0) {
          datapointerinospm10.push(pointObj = {
            x: point.Value
          });
          datapointerinosvaluespm10 = datapointerinosvaluespm10 + point.Value;
        }
      });
      var pm10value = datapointerinosvaluespm10 / datapointerinospm10.length;
      pm10value = pm10value.toFixed(2);
      this.changePM10state(pm10value);
      console.log("pm10value after update: " + pm10value);
    })
      .catch(function (error) {
        console.log(error);
        this.loadingdone();
      });

    //VOC VALUE FETCHING   
    axios.get(measurementDataIDsVOC).then(datapoints => {
      datapoints.data.forEach(function (point) {
        if (point.Value !== 0) {
          datapointerinosvoc.push(pointObj = {
            x: point.Value
          });
          datapointerinosvaluesvoc = datapointerinosvaluesvoc + point.Value;
        }
      });
      var vocvalue = datapointerinosvaluesvoc / datapointerinosvoc.length;
      vocvalue = vocvalue / 1000;
      vocvalue = vocvalue.toFixed(2);
      this.changeVOCstate(vocvalue);
      console.log("VOCvalue after update: " + vocvalue);
      this.setState({ loading: 'false' })
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
    })
      .catch(function (error) {
        console.log(error);
      });*/
    // });
  }

  /*  {this.state.showloading &&
      <View>
        <ActivityIndicator />
      </View>
    }*/
  render() {

    if (this.state.loading === 'initial') {
      return <Text>Intializing... </Text>
    }


    if (this.state.loading === 'true') {
      console.log('This happens 5th - when waiting for data.');
      return <Text>Loading...  </Text>
    }

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

            <Text style={styles.value}>{this.state.currentBuilding}</Text>
            <Text>Valitun ajanjakson keskiarvot.</Text>

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
            this.goToNextScreen(this.state.buildingID, this.state.dateStart, this.state.dateEnd, [this.state.co2dp, this.state.vocdp, this.state.pm10dp, this.state.energydp, this.state.tempdp], titles.titles[0].energy);
          }} >
            <View style={[styles.circle, this.state.energycolor]}>
              <Text style={styles.value}> {this.state.energystate}</Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>{titles.titles[0].energy}</Text>
          </View>


          <TouchableOpacity onPress={() => {
            this.goToNextScreen(this.state.buildingID, this.state.dateStart, this.state.dateEnd, [this.state.co2dp, this.state.vocdp, this.state.pm10dp, this.state.energydp, this.state.tempdp], titles.titles[1].temperature);
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
            this.goToNextScreen(this.state.buildingID, this.state.dateStart, this.state.dateEnd, [this.state.co2dp, this.state.vocdp, this.state.pm10dp, this.state.energydp, this.state.tempdp], titles.titles[3].co2);
          }} >
            <View style={[styles.circle, this.state.co2color]}>
              <Text style={styles.value}>{this.state.co2state}</Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>{titles.titles[3].co2}</Text>
          </View>


          <TouchableOpacity onPress={() => {
            this.goToNextScreen(this.state.buildingID, this.state.dateStart, this.state.dateEnd, [this.state.co2dp, this.state.vocdp, this.state.pm10dp, this.state.energydp, this.state.tempdp], titles.titles[4].pm10);
          }} >
            <View style={[styles.circle, this.state.pm10color]}>
              <Text style={styles.value}>{this.state.pm10state}</Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>{titles.titles[4].pm10}</Text>
          </View>


          <TouchableOpacity onPress={() => {
            this.goToNextScreen(this.state.buildingID, this.state.dateStart, this.state.dateEnd, [this.state.co2dp, this.state.vocdp, this.state.pm10dp, this.state.energydp, this.state.tempdp], titles.titles[5].voc);
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

/* piilotettu koska huonelistaus oli mahdoton saada oikein tämän hetken asetuksilla. valmis koodi jo olemassa.
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

            </Picker>*/


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
    borderColor: '#000000',
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
  neutralcircle: {
    color: '#ffff',
    backgroundColor: '#ffff',
    borderColor: '#000000'
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