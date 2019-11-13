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
    console.log("mounttas");
    const miResponse = await fetch("https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/GetMeasurementInfo/?$token=L2FyTzA3UHp1cGdnUzNMcjRuSUIvZ2o0Q2tCclhQam44SGo5Nm9HcE0zcz06TWV0cm9wb2xpYV9BUEk6NjM3MDMxOTIzMzk5NjcxNzEwOlRydWU=&BuildingID=3022");
    const measureInfo = await miResponse.json();

    const tempDatapoints = [];

    for (let i=0; i < measureInfo.length; i++) {
      const name = measureInfo[i].Name;
      if (name.endsWith('_temperature')) {
        const dataPointId = measureInfo[i].DataPointID;
        tempDatapoints.push({datapoint: dataPointId, name: name});
      }
    }
    
    console.log(tempDatapoints);

    const tempResp = await fetch("https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/GetMeasurementDataByIDs/?$token=L2FyTzA3UHp1cGdnUzNMcjRuSUIvZ2o0Q2tCclhQam44SGo5Nm9HcE0zcz06TWV0cm9wb2xpYV9BUEk6NjM3MDMxOTIzMzk5NjcxNzEwOlRydWU=&Building=3022&DataPointIDs=83593&StartTime=2019-06-01&EndTime=2019-06-02");
    const tempInfo = await tempResp.json();

    console.log(tempInfo.length);

    let numEntries = 12;

    const arrayDelta = parseInt(tempInfo.length / numEntries);
    let arrayIndex = 0;

    const chartData = [];
    for (let i=0; i < numEntries; i++) {
      const timestamp = tempInfo[arrayIndex].Timestamp;
      const tempvalue = tempInfo[arrayIndex].Value;

      const date = new Date(timestamp);

      const timestring = `${this.formatNumber(date.getHours())}:${this.formatNumber(date.getMinutes())}`;

      chartData.push({label: timestring, point: [tempvalue, tempvalue]});
      arrayIndex += arrayDelta;
    }

    console.log(chartData);

    this.chartData = chartData;

  },
  methods: {
    formatNumber(number) {
      return (number < 10 ? '0' : '') + number;
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
