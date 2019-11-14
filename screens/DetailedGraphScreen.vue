<template>
  <view class="container">
    <text class="heading">Detailed Graph</text>
    <text>Detailed screen of 1 graph</text>

    <view class="chart-container">
      <chart
        :data="chartData"
        :config="chartConfig"
      />
    </view>
  </view>
</template>

<script>
import {Chart} from '../components/chart.js';
export default {
  data: function() {
    return {
      /*
      chartData: [
        {label: "8:00", point: [20, 0]},
        {label: "9:00", point: [18, 50]},
        {label: "10:00", point: [22, 75]},
        {label: "11:00", point: [23, 50]},
        {label: "12:00", point: [25, 50]},
        {label: "13:00", point: [10, 100]},
        {label: "14:00", point: [12, 120]},
        {label: "15:00", point: [10, 130]},
        {label: "16:00", point: [22, 200]},
        {label: "17:00", point: [23, 180]},
        {label: "18:00", point: [25, 190]},
        {label: "19:00", point: [27, 50]},
        {label: "20:00", point: [30, 0]},
        {label: "21:00", point: [32, 0]},
      ],*/
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
      }
    }
  },
  async mounted() {
    const miResponse = await fetch("https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/GetMeasurementInfo/?$token=L2FyTzA3UHp1cGdnUzNMcjRuSUIvZ2o0Q2tCclhQam44SGo5Nm9HcE0zcz06TWV0cm9wb2xpYV9BUEk6NjM3MDMxOTIzMzk5NjcxNzEwOlRydWU=&BuildingID=3022");
    const measureInfo = await miResponse.json();

    const tempDatapoints = this.findDatapointsByType(measureInfo, "_temperature");
    console.log(tempDatapoints);
    const co2Datapoints = this.findDatapointsByType(measureInfo, "_co2");
    console.log(co2Datapoints);

    const tempInfo = await this.getBuildingMeasurements(3022, "83593", "2019-06-01", "2019-06-02");
    const co2Info = await this.getBuildingMeasurements(3022, "83591", "2019-06-01", "2019-06-02");

    console.log(tempInfo.length);
    console.log(co2Info.length);

    let numEntries = 12;

    const arrayDelta = parseInt(tempInfo.length / numEntries);
    let arrayIndex = 0;

    const chartData = [];
    for (let i=0; i < numEntries; i++) {
      const timestamp = tempInfo[arrayIndex].Timestamp;
      const tempvalue = tempInfo[arrayIndex].Value;

      const co2value = co2Info[arrayIndex].Value;

      const date = new Date(timestamp);

      const timestring = `${this.formatNumber(date.getHours())}:${this.formatNumber(date.getMinutes())}`;

      chartData.push({label: timestring, point: [tempvalue, co2value]});
      arrayIndex += arrayDelta;
    }

    console.log(chartData);

    this.chartData = chartData;

  },
  methods: {
    formatNumber(number) {
      return (number < 10 ? '0' : '') + number;
    },
    findDatapointsByType(data, type) {
      const datapoints = [];
      for (let i=0; i < data.length; i++) {
        const name = data[i].Name;
        if (name.endsWith(type)) {
          const dataPointId = data[i].DataPointID;
          datapoints.push({datapoint: dataPointId, name: name});
        }
      }
      return datapoints;
    },
    getBuildingMeasurements(buildingID, datapoints, startTime, endTime) {
      return new Promise(async (resolve, reject) => {
        try {
          const baseUrl = "https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/GetMeasurementDataByIDs/";
          const token = "L2FyTzA3UHp1cGdnUzNMcjRuSUIvZ2o0Q2tCclhQam44SGo5Nm9HcE0zcz06TWV0cm9wb2xpYV9BUEk6NjM3MDMxOTIzMzk5NjcxNzEwOlRydWU=";
          const response = await fetch(`${baseUrl}?$token=${token}&Building=${buildingID}&DataPointIDs=${datapoints}&StartTime=${startTime}&EndTime=${endTime}`);
          let measurements = await response.json();
          resolve(measurements);
        }
        catch (exception) {
          console.log(exception);
          reject(exception);
        }
      });
    }
  },
  components: {
    Chart,
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
</style>
