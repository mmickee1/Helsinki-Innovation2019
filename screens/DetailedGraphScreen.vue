<template>
  <view class="container">
    <text>{{buildingAddress}}</text>
    <touchable-opacity :on-press="showDatePicker">
      <view class="date-select">
        <text class="date-select-text">{{currentDate.toLocaleDateString("fi-FI")}}</text>
      </view>
    </touchable-opacity>

    <view class="chart-container">
      <chart
        :data="chartData"
        :config="chartConfig"
      />
    </view>

    <date-time-picker
      :date="currentDate"
      :is-visible="datePickerVisible"
      :on-confirm="onDateSelectConfirm"
      :on-cancel="onDateSelectCancel"
    />
  </view>
</template>

<script>
import {Chart} from '../components/chart.js';
import DateTimePicker from 'react-native-modal-datetime-picker';
export default {
  data: function() {
    return {
      chartData: [],
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
      currentDate: new Date(),
      datePickerVisible: false,
    }
  },
  async mounted() {
    /*
    const buildingInfo = await this.getBuildingInfo(4285);
    console.log(buildingInfo);



    let startDate = "2019-06-02";
    let endDate = "2019-06-03";

    this.currentDate = new Date(startDate);
    this.buildingAddress = buildingInfo.name;



    const baseUrl = "https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/GetMeasurementInfo/";
    const miResponse = await fetch(`${baseUrl}?$token=${this.apiToken}&BuildingID=${buildingInfo.buildingID}`);
    const measureInfo = await miResponse.json();

    const tempDatapoints = this.findDatapointsByType(measureInfo, "indoor conditions: temperature");
    //console.log(tempDatapoints);
    const co2Datapoints = this.findDatapointsByType(measureInfo, "indoor conditions: co2");
    //console.log(co2Datapoints);

    const tempInfo = await this.getBuildingMeasurements(buildingInfo.buildingID, "83556", startDate, endDate);
    const co2Info = await this.getBuildingMeasurements(buildingInfo.buildingID, "83551", startDate, endDate);

    console.log(tempInfo.length);
    //console.log(tempInfo);


    const hourlyTemp = this.makeHourlyData(tempInfo);
    const hourlyCO2 = this.makeHourlyData(co2Info);

    const chartData = [];
    for (let hour=0; hour < 24; hour++) {
      chartData.push({label: hourlyTemp[hour].time, point: [hourlyTemp[hour].value, hourlyCO2[hour].value]});
    }

    this.chartData = chartData;
    */
    this.updateChart(this.currentDate);
  },
  methods: {
    formatNumber(number) {
      return (number < 10 ? '0' : '') + number;
    },

    async updateChart(date) {
      const buildingInfo = await this.getBuildingInfo(4285);
      //console.log(buildingInfo);

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
      //console.log(tempDatapoints);
      const co2Datapoints = this.findDatapointsByType(measureInfo, "indoor conditions: co2");
      //console.log(co2Datapoints);

      const tempInfo = await this.getBuildingMeasurements(buildingInfo.buildingID, "83556", startDate, endDate);
      const co2Info = await this.getBuildingMeasurements(buildingInfo.buildingID, "83551", startDate, endDate);

      //console.log(tempInfo.length);
      //console.log(tempInfo);

      const hourlyTemp = this.makeHourlyData(tempInfo);
      const hourlyCO2 = this.makeHourlyData(co2Info);

      const chartData = [];
      for (let hour=0; hour < 24; hour++) {
        chartData.push({label: hourlyTemp[hour].time, point: [hourlyTemp[hour].value, hourlyCO2[hour].value]});
      }

      console.log(chartData);

      this.chartData = chartData;
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

        let average = 0;
        if (dataCount > 0) {
          average = sum / dataCount;
        }

        hourlyData[hours] = {value: average, time: `${this.formatNumber(hours)}:00`};
      }
      return hourlyData;
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

    onDateSelectConfirm(date) {
      console.log(date);

      if (date.toDateString() != this.currentDate.toDateString()) {
        this.currentDate = date;
        this.updateChart(this.currentDate);
      }
      
      this.datePickerVisible = false;
    },
    onDateSelectCancel() {
      this.datePickerVisible = false;
    },
    showDatePicker() {
      this.datePickerVisible = true;
    },
  },
  components: {
    Chart,
    DateTimePicker
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
</style>
