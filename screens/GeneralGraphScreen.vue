<template>
  <view>
    <scroll-view>
      <view class="container">
        <text class="heading">All graphs</text>
      </view>
      <view class="wrapper">
        <view class="leftside" id="btn">
          <!--  <button v-bind:title="messageDetailed" v-bind:on-press="nextPage"></button>-->
          <touchable-opacity :on-press="onPressButton">
            <image :style="{width: width, height: height}" :source="{uri: imagecircle}" />
          </touchable-opacity>

          <touchable-opacity :on-press="onPressButton">
            <image :style="{width: width, height: height}" :source="{uri: imagecircle}" />
          </touchable-opacity>

          <touchable-opacity :on-press="onPressButton">
            <image :style="{width: width, height: height}" :source="{uri: imagecircle}" />
          </touchable-opacity>
        </view>

        <view class="rightside" id="btn">
          <touchable-opacity :on-press="onPressButton">
            <image :style="{width: width, height: height}" :source="{uri: imagecircle}" />
          </touchable-opacity>

          <touchable-opacity :on-press="onPressButton">
            <image :style="{width: width, height: height}" :source="{uri: imagecircle}" />
          </touchable-opacity>

          <touchable-opacity :on-press="onPressButton">
            <image :style="{width: width, height: height}" :source="{uri: imagecircle}" />
          </touchable-opacity>
        </view>
      </view>
    </scroll-view>
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
      messageDetailed: "Go to DetailedGraphScreen screen",
      imagecircle:
        "https://latex.artofproblemsolving.com/a/e/e/aee55bc00dcef6c78990e2d1dfd119492d1cce7f.png",
      height: 150,
      width: 150
    };
  },
  methods: {
    nextPage() {
      alert("Hello");
      //this.navigation.navigate("GeneralGraph");
    },
    goToDetailedGraphScreen() {
      this.navigation.navigate("DetailedGraph");
    },
    onPressButton() {
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
}
.heading {
  font-size: 30px;
  font-weight: bold;
  color: darkolivegreen;
  margin: 20px;
  align-items: center;
  justify-content: center;
  align-content: center;
}
.rightside {
  align-items: center;
  background-color: aqua;
  /* float: right; */
  width: 50%;
}
.leftside {
  align-items: center;
  background-color: gold;
  /* float: left; */
  width: 50%;
}
/*#btn {
  margin-left: 100px;
  margin-right: 100px;
  padding-right: 60px;
  padding-left: 10px;
}*/
</style>
