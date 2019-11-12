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
      ],
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
