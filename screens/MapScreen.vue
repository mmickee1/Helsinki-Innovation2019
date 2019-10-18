<template>
  <view class="container">
    <text class="heading">Map</text>
    <text class="text">Map screen</text>
    <text class="text">Use the swipe gesture to open the drawer navigator</text>
    <button v-bind:title="messageDetailed" v-bind:on-press="goToDetailedGraphScreen"></button>
    <button
      :on-press="nextPage"
      title="Access next page"
      color="#841584"
      accessibility-label="Next Page"
    />
  </view>
</template>

<script>
export default {
  props: {
    navigation: {
      type: Object
    }
  },
  data: function() {
    return {
      messageDetailed: "Go to DetailedGraphScreen screen"
    };
  },
  methods: {
    nextPage() {
      // alert('Hello');
      this.navigation.navigate("GeneralGraph");
    },
    goToDetailedGraphScreen() {
      this.navigation.navigate("DetailedGraph");
    }
  }
};
</script>

<style>
.container {
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 50px;
}
.heading {
  font-size: 30px;
  font-weight: bold;
  color: darkolivegreen;
  margin: 20px;
}
.text {
  text-align: center;
  margin: 10px;
}
</style>
