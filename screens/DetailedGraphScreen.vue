<template>
  <view class="container">
    <text class="heading">Detailed Graph</text>
    <text>Detailed screen of 1 graph</text>

    <view class="chart-container">
      <chart/>
    </view>
  </view>
</template>

<script>
import {Chart} from '../chart.js';
export default {
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
