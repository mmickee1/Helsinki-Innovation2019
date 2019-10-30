import React from 'react';

import {View} from 'react-native';

import Svg, {
  Circle,
  Rect,
  G,
  Path,
  Text as SVGText
} from 'react-native-svg';

drawChartLine = (width, height, yaxis, numPoints) => {
  let path = "";

  for (let i=0; i < numPoints; i++) {
    let xpoint = ((width / (numPoints-1)) * i);

    let ypoint = (height - yaxis) * Math.random();
    
    let cmd = i == 0 ? 'M' : 'L';
    path += `${cmd} ${xpoint} ${yaxis-ypoint} `;
  }

  //path += "Z";

  return path;
};

drawLabels = () => {

  let values = [10, 20, 30, 40, 50, 60];

  return(
    <G x="10">
      {values.map((item, index) => {
        console.log(item);
        return <SVGText x="0" y={item} key={item} fontSize="10" textAnchor="start">{item} °C</SVGText>
      })}
    </G>
  );
}

export class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 300,
      height: 0,
      layoutSet: false,
    }
  }

  onLayout = (event) => {
    const {width, height} = event.nativeEvent.layout;
    console.log(`layout ${width} ${height}`);

    this.setState({width: width, height: height, layoutSet: true});
  }

  

  render() {
    let marginLeft = 5;
    let marginRight = 5;

    let width = this.state.width;
    let height = this.state.height;

    let labelsWidth = 40;
    let labelsHeight = height;
    let chartWidth = width - labelsWidth - marginLeft - marginRight;
    let chartHeight = height;

    let yAxisY = height * 0.7;


    let refShape = `M 0 ${yAxisY-30} h ${chartWidth}`;
    let chartShape = drawChartLine(chartWidth, chartHeight, yAxisY, 15);

    console.log(chartShape);

    return(
      <View style={{width: '100%', height: '100%', backgroundColor: 'transparent'}} onLayout={this.onLayout}>
        <Svg width={width} height={height}>
          <G>
            <G x={marginLeft} y={0} width={labelsWidth} height={labelsHeight}>
              <Rect x={0} rx="0" ry="0" width={labelsWidth} height={labelsHeight} strokeWidth="0" fill="yellow"/>
              {drawLabels()}
            </G>
            <G x={marginLeft+labelsWidth} y="0" width={chartWidth} height={chartHeight}>
              <Rect x={0} rx="0" ry="0" width={chartWidth} height={chartHeight} strokeWidth="0" fill="cyan"/>
              <Path d={`M ${0} ${yAxisY} h ${chartWidth}`} stroke="black"/>

              <Path d={refShape} stroke="blue" strokeWidth="2.5" fill="none"/>
              <Path d={chartShape} stroke="orange" strokeWidth="2.5" fill="none"/>     
            </G>
          </G>
        </Svg>
      </View>
    );
  }
}