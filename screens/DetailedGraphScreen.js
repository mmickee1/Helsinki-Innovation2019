import React, { Component } from 'react';
import {  
  Text,
  View,  
  TouchableOpacity,
} from 'react-native';

import {Chart} from '../components/chart.js';
import DatePicker from 'react-native-modal-datetime-picker';
import {LoaderModal} from '../components/loadermodal.js';
import {ChartSelectorModal} from '../components/chartselectormodal.js';

export default class DetailedGraphScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartTypes: [
        {key: "energy", name: 'Energia', unit: 'kW/h', datapoint: 0, defaultScale: {min: 0, max: 200}},
        {key: "temp", name: 'Lämpötila', unit: '°C', datapoint: '83556', defaultScale: {min: 20, max: 25}},
        {key: "co2", name: "CO2", unit: 'ppm', datapoint: '83551', defaultScale: {min: 400, max: 1000}},
        {key: "moisture", name: 'Kosteus', unit: '%', datapoint: '83552', defaultScale: {min: 0, max: 100}},
        {key: "pm10", name: 'PM10', unit: 'μg/m3', datapoint: '83554', defaultScale: {min: 0, max: 10}},
        {key: "voc", name: 'VOC', unit: 'ppb', datapoint: '83557', defaultScale: {min: 0, max: 1000}},
      ],

      chartData: [],
      chartScale: [{min: 20, max: 25}, {min: 400, max: 500}],
      chartConfig: {
        leftDataColor: "orange",
        rightDataColor: "magenta",
        leftRefColor: "blue",
        rightRefColor: "green",
        leftDataTitle: "Lämpötila",
        leftDataUnit: "°C",
        rightDataTitle: "CO2",
        rightDataUnit: "ppm",
      },
      apiToken: "L2FyTzA3UHp1cGdnUzNMcjRuSUIvZ2o0Q2tCclhQam44SGo5Nm9HcE0zcz06TWV0cm9wb2xpYV9BUEk6NjM3MDMxOTIzMzk5NjcxNzEwOlRydWU=",
      buildingAddress: "",
      buildingID: 0,
      currentDate: new Date(),
      datePickerVisible: false,
      chartLoading: false,
      leftChartModalOpen: false,
      rightChartModalOpen: false,
      leftChartSelected: 0,
      rightChartSelected: 1,
      buildingSelected: false,

      charHighlights: [
        {startColumn: 8, numColumns: 3, color: "orange", opacity: "0.4", title: "jousto"},
      ],
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("will receive props");

    this.loadBuilding();
  }

  componentWillUpdate(nextProps, prevState) {
    if (nextProps.navigation.state.params) {
      if (nextProps.navigation.state.params.buildingID !== prevState.buildingID) {
        this.setState({
          buildingID: nextProps.navigation.state.params.buildingID,
          timeStart: nextProps.navigation.state.params.timeStart
        }, function () {
          console.log('state changed successfully: ' + this.state.buildingID);
          this.loadBuilding();
        })
      }
    }
  }

  async loadBuilding() {
    const params = this.props.navigation.state.params;

    /*
    const params = {
      vocdp: "61707;61708;61709;61710;61711;61712;61713;61714;61715;61716;",
      co2dp: "83517;83525;83533;83541;83549;83557;83565;83573;83582;83589;",
      pm10dp: "83514;83522;83530;83538;83546;83554;83562;83570;83579;83586;",
      temperaturedp: "61682;61683;61684;61685;61686;61687;61688;61689;61690;61691;",
      timeStart: "2019-12-10",
      buildingID: 2410,
    };
    */

    if (params) {      
      this.setState({buildingSelected: true});
    
    
      const co2dps = params.co2dp.split(';');
      const pm10dps = params.pm10dp.split(";");
      const tempdps =  params.temperaturedp.split(";");
      const vocdps = params.vocdp.split(";");
    
      const chartTypes = this.state.chartTypes;
      chartTypes[1].datapoint = tempdps[0];
      chartTypes[2].datapoint = co2dps[0];
      // moisture missing
      chartTypes[4].datapoint = pm10dps[0];
      chartTypes[5].datapoint = vocdps[0];

    
      //console.log(this.buildingID);

      let leftType = 0;
      let rightType = 1;      

      const chartConfig = this.state.chartConfig;
      chartConfig.leftDataTitle = chartTypes[leftType].name;
      chartConfig.leftDataUnit = chartTypes[leftType].unit;
      chartConfig.rightDataTitle = chartTypes[rightType].name;
      chartConfig.rightDataUnit = chartTypes[rightType].unit;

      const currentDate = new Date(params.timeStart);

      this.setState({
        buildingID: params.buildingID,
        chartTypes: chartTypes,
        chartConfig: chartConfig,
        leftChartSelected: leftType,
        rightChartSelected: rightType,
        currentDate: currentDate,
      });

      await this.updateChart(params.buildingID, currentDate, leftType, rightType);
    } else if (!this.state.buildingSelected) {
      this.setState({buildingAddress: "Ei rakennusta valittuna"});      
    }
  }



  async componentDidMount() {
    console.log('mounted');
    console.log(this.props.navigation.state);

    /*
    2410 2019-12-10 2019-12-10 Array [
      "61707;61708;61709;61710;61711;61712;61713;61714;61715;61716;",
      "83517;83525;83533;83541;83549;83557;83565;83573;83582;83589;",
      "83514;83522;83530;83538;83546;83554;83562;83570;83579;83586;",
      "47532;61677;61678;",
      "61682;61683;61684;61685;61686;61687;61688;61689;61690;61691;",
    ] CO2-Hiukkaset
    */

    this.loadBuilding();
  }

  render() {

    if (!this.state.buildingSelected) {
      return(
        <View style={{height: "100%"}}>
          <Text style={{alignSelf: "center"}}>Ei rakennusta valittuna</Text>
        </View>
      )
    }


    return(
      <View style={{height: "100%"}}>
          <Text style={{alignSelf: "center"}}>{this.state.buildingAddress}</Text>
          <TouchableOpacity onPress={() => {this.showDatePicker()}}>
            <View style={{width: "60%", marginTop: 5, marginBottom: 5, borderRadius: 18, backgroundColor: "blueviolet", height: 36, paddingLeft: 20, paddingRight: 20, alignContent: "center", justifyContent: "center", alignSelf: "center"}}>
              <Text style={{color: "whitesmoke", alignSelf: "center"}}>
                {this.makeTitleDate(this.state.currentDate)}
              </Text>
            </View>
          </TouchableOpacity>

        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <TouchableOpacity onPress={() => {this.showLeftChartSelector()}}>
            <View style={{width: 100, padding: 5, backgroundColor: "blueviolet"}}>
              <Text style={{color: "whitesmoke", textAlign: "left"}}>
                {this.state.chartConfig.leftDataTitle}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this.showRightChartSelector()}}>
            <View style={{width: 100, padding: 5, backgroundColor: "blueviolet"}}> 
              <Text style={{color: "whitesmoke", textAlign: "right"}}>
                {this.state.chartConfig.rightDataTitle}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{width: "100%", height: 290}}>
          <Chart
            data={this.state.chartData}
            scale={this.state.chartScale}
            config={this.state.chartConfig}
            highlights={this.state.charHighlights}
          />
        </View>

        <DatePicker
          date={this.state.currentDate}
          isVisible={this.state.datePickerVisible}
          onConfirm={(date) => {this.onDateSelectConfirm(date)}}
          onCancel={() => {this.onDateSelectCancel()}}
          mode="date"
        />

        <LoaderModal loading={this.state.chartLoading}/>

        <ChartSelectorModal
          selected={this.state.leftChartSelected}
          visible={this.state.leftChartModalOpen}
          onClose={() => {this.onLeftChartTypeModalClose()}}
          onSelect={(type) => {this.onLeftChartTypeSelect(type)}}
        />
        <ChartSelectorModal
          selected={this.state.rightChartSelected}
          visible={this.state.rightChartModalOpen}
          onClose={() => {this.onRightChartTypeModalClose()}}
          onSelect={(type) => {this.onRightChartTypeSelect(type)}}
        />
      </View>
    );
  }

  formatNumber(number) {
    return (number < 10 ? '0' : '') + number;
  }

  async updateChart(building, date, leftType, rightType) {
    //const buildingInfo = await this.getBuildingInfo(this.buildingID);
    //console.log(buildingInfo);

    const buildingInfo = {buildingID: building, buildingAddress: ""};

    //console.log(date);
    //console.log(`${date.getFullYear()}-${this.formatNumber(date.getMonth()+1)}-${this.formatNumber(date.getDate())}`);
    const nextDay = new Date(date.getTime() + (24 * 60 * 60 * 1000));

    //let startDate = "2019-06-02";
    //let endDate = "2019-06-03";

    const startDate = `${date.getFullYear()}-${this.formatNumber(date.getMonth()+1)}-${this.formatNumber(date.getDate())}`;
    const endDate = `${nextDay.getFullYear()}-${this.formatNumber(nextDay.getMonth()+1)}-${this.formatNumber(nextDay.getDate())}`;

    this.setState({buildingAddress: buildingInfo.name});


    const baseUrl = "https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/GetMeasurementInfo/";
    const miResponse = await fetch(`${baseUrl}?$token=${this.state.apiToken}&BuildingID=${buildingInfo.buildingID}`);
    const measureInfo = await miResponse.json();

    const tempDatapoints = this.findDatapointsByType(measureInfo, "indoor conditions: temperature");
    const co2Datapoints = this.findDatapointsByType(measureInfo, "indoor conditions: co2");

    let leftDatapoint = this.state.chartTypes[leftType].datapoint;
    let rightDatapoint = this.state.chartTypes[rightType].datapoint;

    const measureTasks = [
      leftType == 0
        ? this.getEnergyConsumption(buildingInfo.buildingID, startDate, startDate, 1)
        : this.getBuildingMeasurements(buildingInfo.buildingID, leftDatapoint, startDate, endDate),
      rightType == 0
        ? this.getEnergyConsumption(buildingInfo.buildingID, startDate, startDate, 1)
        : this.getBuildingMeasurements(buildingInfo.buildingID, rightDatapoint, startDate, endDate),
    ];

    // fetch all measurements in parallel
    const measurements = await Promise.all(measureTasks);

    const tempInfo = measurements[0];
    const co2Info = measurements[1];

    // make hourly data from Nuuka raw data
    const hourlyTemp = this.makeHourlyData(tempInfo);
    const hourlyCO2 = this.makeHourlyData(co2Info);

    // format data to be shown in the chart
    const chartData = [];
    for (let hour=0; hour < 24; hour++) {
      chartData.push({label: hourlyTemp[hour].time, point: [hourlyTemp[hour].value, hourlyCO2[hour].value]});
    }

    // calculate chart value scale based on data
    const tempScale = this.findMinMax(hourlyTemp);
    const co2Scale = this.findMinMax(hourlyCO2);

/*
    const chartScale = [
      {min: tempScale.min - ((tempScale.max-tempScale.min) * 0.2), max: tempScale.max + ((tempScale.max-tempScale.min) * 0.2)},
      {min: co2Scale.min - ((co2Scale.max-co2Scale.min) * 0.2), max: co2Scale.max + ((co2Scale.max-co2Scale.min) * 0.2)}
    ];

*/
    const chartScale = [
      this.state.chartTypes[leftType].defaultScale,
      this.state.chartTypes[rightType].defaultScale,
    ];
    
    this.setState({
      chartData: chartData,
      chartScale: chartScale,
    })    
  }

  findDatapointsByType(data, type) {
    const datapoints = [];
    for (let i=0; i < data.length; i++) {
      if (data[i].Category == type) {
        const dataPointId = data[i].DataPointID;
        datapoints.push({datapoint: dataPointId, name: data[i].Name});
      }
    }
    return datapoints;
  }

  getBuildingMeasurements(buildingID, datapoints, startTime, endTime) {
    return new Promise(async (resolve, reject) => {
      try {
        const baseUrl = "https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/GetMeasurementDataByIDs/";
        const response = await fetch(`${baseUrl}?$token=${this.state.apiToken}&Building=${buildingID}&DataPointIDs=${datapoints}&StartTime=${startTime}&EndTime=${endTime}`);
        let measurements = await response.json();
        resolve(measurements);
      }
      catch (exception) {
        console.log(exception);
        reject(exception);
      }
    });
  }

  makeHourlyData(rawData) {
    const indexedData = [];

    // make indexed data
    rawData.forEach((item) => {
      const timestamp = new Date(item.Timestamp);
      const index = (timestamp.getHours() * 60) + timestamp.getMinutes();
      if (!indexedData[index]) {
        indexedData[index] = item.Value;
      }
    });

    const hourlyData = [];

    // calculate average hourly data from indexed minute data
    for (let hours=0; hours < 24; hours++) {
      let sum = 0;
      let dataCount = 0;
      for (let mins=0; mins < 60; mins++) {
        const value = indexedData[(hours*60) + mins];
        if (value) {
          sum += value;
          dataCount++;
        }
      }

      // calculate average based on number of valid entries (this way missing data doesn't affect average)
      let average = 0;
      if (dataCount > 0) {
        average = sum / dataCount;
      }

      hourlyData[hours] = {value: average, time: `${this.formatNumber(hours)}:00`};
    }
    return hourlyData;
  }

  getEnergyConsumption(buildingID, startTime, endTime, energyType) {
    return new Promise(async (resolve, reject) => {
      try {
        const baseUrl = "https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/GetConsumptionsByCategory/";
        const request = `${baseUrl}?$format=json&$token=${this.state.apiToken}&Building=${buildingID}&StartTime=${startTime}&EndTime=${endTime}&EnergyTypeIDs=${energyType}&TimeGrouping=hour`;
        const response = await fetch(request);
        
        const rawValues = await response.json();

        const results = [];

        rawValues.forEach((item) => {
          if (item.GroupDescription === "Electricity") {
            results.push({
              Value: item.Consumption,
              CO2Value: item.CO2Value,
              Timestamp: item.Date,
            });
          }
        });

        resolve(results);
      }
      catch (exception) {
        reject(exception);
      }
    });
  }

  getBuildingInfo(site) {
    return new Promise(async (resolve, reject) => {
      try {
        const baseUrl = "https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/GetUserBuildings/";
        const response = await fetch(`${baseUrl}?$token=${this.state.apiToken}&$format=json`);
        let info = await response.json();
        
        //console.log(info);

        let results = {};

        info.forEach((item) => {
          if (item.P_SiteNumber == site && item.IsProperty == true) {
            console.log(item);
            results = {buildingID: item.BuildingStructureID, name: item.Description};
          }
        });

        resolve(results);
      }
      catch (exception) {
        console.log(exception);
        reject(exception);
      }
    });
  }

  async onDateSelectConfirm(date) {
    console.log(date);

    if (date.toDateString() != this.state.currentDate.toDateString()) {      
      this.setState({chartLoading: true});
      await this.updateChart(this.state.buildingID, date, this.state.leftChartSelected, this.state.rightChartSelected);
      this.setState({chartLoading: false});
      this.setState({currentDate: date});
    }
    
    this.setState({datePickerVisible: false});
  }

  onDateSelectCancel() {
    this.setState({datePickerVisible: false});
  }

  showDatePicker() {    
    this.setState({datePickerVisible: true});
  }

  findMinMax(data) {
    let min = data[0].value;
    let max = min;
    data.forEach((item) => {
      if (item.value < min) {
        min = item.value;
      }
      if (item.value > max) {
        max = item.value;
      }
    });
    return {min: min, max: max};
  }

  makeTitleDate(date) {
    const days = ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'];
    return `${days[date.getDay()]} ${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
  }

  onLeftChartTypeModalClose() {
    this.setState({leftChartModalOpen: false});
  }

  onRightChartTypeModalClose() {
    this.setState({rightChartModalOpen: false});
  }

  showLeftChartSelector() {    
    this.setState({leftChartModalOpen: true});
  }

  showRightChartSelector() {    
    this.setState({rightChartModalOpen: true});
  }

  async onLeftChartTypeSelect(type) {
    const chartConfig = this.state.chartConfig;
    chartConfig.leftDataTitle = this.state.chartTypes[type].name;
    chartConfig.leftDataUnit = this.state.chartTypes[type].unit;
    
    this.setState({chartConfig: chartConfig, leftChartSelected: type});

    this.setState({chartLoading: true});
    await this.updateChart(this.state.buildingID, this.state.currentDate, type, this.state.rightChartSelected);    
    this.setState({chartLoading: false});
  }
  async onRightChartTypeSelect(type) {
    const chartConfig = this.state.chartConfig;
    chartConfig.rightDataTitle = this.state.chartTypes[type].name;
    chartConfig.rightDataUnit = this.state.chartTypes[type].unit;

    this.setState({chartConfig: chartConfig, rightChartSelected: type});    

    this.setState({chartLoading: true});
    await this.updateChart(this.state.buildingID, this.state.currentDate, this.state.leftChartSelected, type);
    this.setState({chartLoading: false});
  }
}