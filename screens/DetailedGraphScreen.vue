<template>
  <view class="container">
    <text>{{buildingAddress}}</text>
    <touchable-opacity :on-press="showDatePicker" v-if="buildingSelected">
      <view class="date-select">
        <text class="date-select-text">
          {{makeTitleDate(currentDate)}}
        </text>
      </view>
    </touchable-opacity>


    <view class="chart-type-title" v-if="buildingSelected">
      <touchable-opacity :on-press="showLeftChartSelector">
        <view class="chart-type-text">
          <text class="chart-type-text-left">{{chartConfig.leftDataTitle}}</text>
        </view>
      </touchable-opacity>
      <touchable-opacity :on-press="showRightChartSelector">
        <view class="chart-type-text"> 
          <text class="chart-type-text-right">{{chartConfig.rightDataTitle}}</text>
        </view>
      </touchable-opacity>
    </view>
    <view class="chart-container" v-if="buildingSelected">
      <chart
        :data="chartData"
        :scale="chartScale"
        :config="chartConfig"
        :highlights="charHighlights"
      />
    </view>

    <date-picker
      :date="currentDate"
      :is-visible="datePickerVisible"
      :on-confirm="onDateSelectConfirm"
      :on-cancel="onDateSelectCancel"
      mode="date"
    />

    <loader-modal :loading="chartLoading"/>
    <chart-selector-modal
      :selected="leftChartSelected"
      :visible="leftChartModalOpen"
      :onClose="onLeftChartTypeModalClose"
      :onSelect="onLeftChartTypeSelect"
    />
    <chart-selector-modal
      :selected="rightChartSelected"
      :visible="rightChartModalOpen"
      :onClose="onRightChartTypeModalClose"
      :onSelect="onRightChartTypeSelect"
    />
  </view>
</template>

<script>
import {Chart} from '../components/chart.js';
import DatePicker from 'react-native-modal-datetime-picker';
import {LoaderModal} from '../components/loadermodal.js';
import {ChartSelectorModal} from '../components/chartselectormodal.js';
export default {
  data: function() {
    return {
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
  },
  props: {
    navigation: {
      type: Object
    }
  },

  async mounted() {

    console.log('mounted');
    console.log(this.navigation.state);

    const params = this.navigation.state.params;
    if (params) {
      this.buildingSelected = true;
    
    
      const co2dps = params.co2dp.split(';');
      const pm10dps = params.pm10dp.split(";");
      const tempdps =  params.temperaturedp.split(";");
      const vocdps = params.vocdp.split(";");
    

      this.buildingID = params.buildingID;
      this.currentDate = new Date(params.timeStart);

      this.chartTypes[1].datapoint = tempdps[0];
      this.chartTypes[2].datapoint = co2dps[0];
      // moisture missing
      this.chartTypes[4].datapoint = pm10dps[0];
      this.chartTypes[5].datapoint = vocdps[0];

      //console.log(this.buildingID);

      let leftType = 0;
      let rightType = 1;
      this.leftChartSelected = leftType;
      this.chartConfig.leftDataTitle = this.chartTypes[leftType].name;
      this.chartConfig.leftDataUnit = this.chartTypes[leftType].unit;
      this.rightChartSelected = rightType;
      this.chartConfig.rightDataTitle = this.chartTypes[rightType].name;
      this.chartConfig.rightDataUnit = this.chartTypes[rightType].unit;

      await this.updateChart(this.currentDate, this.leftChartSelected, this.rightChartSelected);
    }

    if (!this.buildingSelected) {
      this.buildingAddress = "Ei rakennusta valittuna";
    }
  },

  methods: {
    formatNumber(number) {
      return (number < 10 ? '0' : '') + number;
    },

    async updateChart(date) {
      //const buildingInfo = await this.getBuildingInfo(this.buildingID);
      //console.log(buildingInfo);

    const buildingInfo = {buildingID: this.buildingID, buildingAddress: ""};

      //console.log(date);
      //console.log(`${date.getFullYear()}-${this.formatNumber(date.getMonth()+1)}-${this.formatNumber(date.getDate())}`);
      const nextDay = new Date(date.getTime() + (24 * 60 * 60 * 1000));

      //let startDate = "2019-06-02";
      //let endDate = "2019-06-03";

      const startDate = `${date.getFullYear()}-${this.formatNumber(date.getMonth()+1)}-${this.formatNumber(date.getDate())}`;
      const endDate = `${nextDay.getFullYear()}-${this.formatNumber(nextDay.getMonth()+1)}-${this.formatNumber(nextDay.getDate())}`;

      this.buildingAddress = buildingInfo.name;

      const baseUrl = "https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/GetMeasurementInfo/";
      const miResponse = await fetch(`${baseUrl}?$token=${this.apiToken}&BuildingID=${buildingInfo.buildingID}`);
      const measureInfo = await miResponse.json();

      const tempDatapoints = this.findDatapointsByType(measureInfo, "indoor conditions: temperature");
      const co2Datapoints = this.findDatapointsByType(measureInfo, "indoor conditions: co2");

      let leftDatapoint = this.chartTypes[this.leftChartSelected].datapoint;
      let rightDatapoint = this.chartTypes[this.rightChartSelected].datapoint;

      const measureTasks = [
        this.leftChartSelected == 0
          ? this.getEnergyConsumption(buildingInfo.buildingID, startDate, startDate, 1)
          : this.getBuildingMeasurements(buildingInfo.buildingID, leftDatapoint, startDate, endDate),
        this.rightChartSelected == 0
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
        this.chartTypes[this.leftChartSelected].defaultScale,
        this.chartTypes[this.rightChartSelected].defaultScale,
      ];
      
      this.chartData = chartData;
      this.chartScale = chartScale;
    },

    findDatapointsByType(data, type) {
      const datapoints = [];
      for (let i=0; i < data.length; i++) {
        if (data[i].Category == type) {
          const dataPointId = data[i].DataPointID;
          datapoints.push({datapoint: dataPointId, name: data[i].Name});
        }
      }
      return datapoints;
    },

    getBuildingMeasurements(buildingID, datapoints, startTime, endTime) {
      return new Promise(async (resolve, reject) => {
        try {
          const baseUrl = "https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/GetMeasurementDataByIDs/";
          const response = await fetch(`${baseUrl}?$token=${this.apiToken}&Building=${buildingID}&DataPointIDs=${datapoints}&StartTime=${startTime}&EndTime=${endTime}`);
          let measurements = await response.json();
          resolve(measurements);
        }
        catch (exception) {
          console.log(exception);
          reject(exception);
        }
      });
    },

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
    },

    getEnergyConsumption(buildingID, startTime, endTime, energyType) {
      return new Promise(async (resolve, reject) => {
        try {
          const baseUrl = "https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/GetConsumptionsByCategory/";
          const request = `${baseUrl}?$format=json&$token=${this.apiToken}&Building=${buildingID}&StartTime=${startTime}&EndTime=${endTime}&EnergyTypeIDs=${energyType}&TimeGrouping=hour`;
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
    },

    getBuildingInfo(site) {
      return new Promise(async (resolve, reject) => {
        try {
          const baseUrl = "https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/GetUserBuildings/";
          const response = await fetch(`${baseUrl}?$token=${this.apiToken}&$format=json`);
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
    },

    async onDateSelectConfirm(date) {
      console.log(date);

      if (date.toDateString() != this.currentDate.toDateString()) {
        this.chartLoading = true;
        await this.updateChart(date);
        this.chartLoading = false;
        this.currentDate = date;
      }
      
      this.datePickerVisible = false;
    },

    onDateSelectCancel() {
      this.datePickerVisible = false;
    },

    showDatePicker() {
      this.datePickerVisible = true;
    },

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
    },

    makeTitleDate(date) {
      const days = ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'];
      return `${days[date.getDay()]} ${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
    },

    onLeftChartTypeModalClose() {
      this.leftChartModalOpen = false;
    },
    onRightChartTypeModalClose() {
      this.rightChartModalOpen = false;
    },

    showLeftChartSelector() {
      this.leftChartModalOpen = true;
    },
    showRightChartSelector() {
      this.rightChartModalOpen = true;
    },

    async onLeftChartTypeSelect(type) {
      this.leftChartSelected = type;
      this.chartConfig.leftDataTitle = this.chartTypes[type].name;
      this.chartConfig.leftDataUnit = this.chartTypes[type].unit;

      this.chartLoading = true;
      await this.updateChart(this.currentDate);
      this.chartLoading = false;
    },
    async onRightChartTypeSelect(type) {
      this.rightChartSelected = type;
      this.chartConfig.rightDataTitle = this.chartTypes[type].name;
      this.chartConfig.rightDataUnit = this.chartTypes[type].unit;

      this.chartLoading = true;
      await this.updateChart(this.currentDate);
      this.chartLoading = false;
    }
  },
  components: {
    Chart,
    DatePicker,
    LoaderModal,
    ChartSelectorModal,
  }
};
</script>

<style>
.container {
  align-items: center;
  justify-content: flex-start;
  flex: 1;
}
.heading {
  font-size: 30px;
  font-weight: bold;
  color: darkolivegreen;
  margin: 20px;
}
.chart-container {
  width: 100%;
  height: 290px;
}
.date-select {
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 18px;
  background-color:blueviolet;
  height: 36px;
  padding-left: 20px;
  padding-right: 20px;
  align-content: center;
  justify-content: center;
}
.date-select-text {
  color: whitesmoke;
}
.loader-modal {
  height: 100%;
  background-color: transparent;
  align-content: center;
  justify-content: center;
}
.chart-type-title {
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
}
.chart-type-text {
  width: 100px;
  background-color: blueviolet;
  padding: 5;
}
.chart-type-text-left {
  text-align: left;
  color: white;
}
.chart-type-text-right {
  text-align: right;
  color: white;
}

</style>
