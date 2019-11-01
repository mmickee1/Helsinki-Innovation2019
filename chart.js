import React from 'react';

import {View} from 'react-native';

import Svg, {
  Circle,
  Rect,
  G,
  Path,
  Text as SVGText
} from 'react-native-svg';

generateChartX = (area, numPoints, x) => {
  let xpoint = area.x + ((area.width / (numPoints-1)) * x);
  return xpoint;
}

generateChartY = (area, valueScale, y) => {
  let ypoint = parseInt(area.y + area.height - ((area.height / (valueScale.max - valueScale.min)) * (y - valueScale.min)));
  return ypoint;
}

drawChartLine = (area, valueScale, points) => {
  let path = "";

  console.log(area.width);
  console.log(area.height);

  

  for (let i=0; i < points.length; i++) {
    //let xpoint = area.x + ((area.width / (points.length-1)) * i);
    
    let xpoint = generateChartX(area, points.length, i);
    //let ypoint = parseInt(area.y + area.height - (((valueScale.max - valueScale.min) / height) * points[i]));
    
    let ypoint = generateChartY(area, valueScale, points[i]);

    let cmd = i == 0 ? 'M' : 'L';
    path += `${cmd} ${xpoint} ${ypoint} `;
  }

  //path += "Z";

  return path;
};

drawXAxis = (chartArea, chartValueScale, values) => {
  return(
    <G>
      {values.map((item, index) => {
        let stroke, strokeWidth, strokeDashes;

        if (item === 0) {
          stroke = "black";
          strokeWidth = "1";
          strokeDashes = "";
        } else {
          stroke = "gray";
          strokeWidth = "0.5";
          strokeDashes = "5, 5";
        }

        let lineY = generateChartY(chartArea, chartValueScale, item);
        return(
          <Path
            key={`x${item}`}
            d={`M ${chartArea.x} ${lineY} h ${chartArea.width}`}
            strokeWidth={strokeWidth}
            stroke={stroke}
            strokeDasharray={strokeDashes}
          />
        );
      })}
    </G>
  );
}

drawLabels = (chartArea, chartValueScale, values) => {
  return(
    <G x="4">
      {values.map((item, index) => {
        console.log(item);

        let textY = generateChartY(chartArea, chartValueScale, item);

        return <SVGText x={0} y={textY+4} key={item} fontSize="8" textAnchor="start">{item} °C</SVGText>
      })}
    </G>
  );
}

drawYAxes = (chartArea, values) => {
  return(
    <G>
      {values.map((item, index) => {
        let x = generateChartX(chartArea, values.length, index);
        return <Path d={`M ${x} 0 v ${chartArea.height}`} stroke="#cfcfcf" strokeWidth="1"/>
      })}
    </G>
  );
}

drawHighlights = (chartArea, numPoints, highlights) => {
  return(
    <G>
      {highlights.map((item, index) => {
        let xStart = generateChartX(chartArea, numPoints, item.startColumn);
        let xEnd = generateChartX(chartArea, numPoints, item.startColumn+item.numColumns);
        return(
          <Rect
            key={`hr${index}`}
            x={xStart}
            y={chartArea.y}
            rx="0"
            ry="0"
            width={xEnd-xStart}
            height={chartArea.height}
            fill={item.color}
            opacity={item.opacity}
          />
        );
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

    let labelsWidth = 28;
    let labelsHeight = height;
    let chartWidth = width - labelsWidth - marginLeft - marginRight;
    let chartHeight = height;

    let yAxisY = height * 0.7;

    let points = [20, 18, 22, 23, 25, 10, 12, 10, 22, 23, 25, 27, 30, 32];

    let chartArea = {x: 0, y: 0, width: chartWidth, height: chartHeight};
    let chartValueScale = {min: -5, max: 45};

    let chartShape = drawChartLine(chartArea, chartValueScale, points);

    console.log(chartShape);

    let refShape = `M 0 ${generateChartY(chartArea, chartValueScale, 22)} h ${chartWidth}`;

    let highlights = [
      {startColumn: 0, numColumns: 1, color: "orange", opacity: "0.2"},
      {startColumn: 4, numColumns: 4, color: "orange", opacity: "0.2"},
      {startColumn: 12, numColumns: 1, color: "orange", opacity: "0.2"}
    ];

    let xLines = [0, 10, 20, 30, 40];

    return(
      <View style={{width: '100%', height: '100%', backgroundColor: '#f8f8f8'}} onLayout={this.onLayout}>
        <Svg width={width} height={height}>
          <G>
            <G x={marginLeft} y={0} width={labelsWidth} height={labelsHeight}>
              {drawLabels(chartArea, chartValueScale, xLines)}
            </G>
            <G x={marginLeft+labelsWidth} y="0" width={chartWidth} height={chartHeight}>
              {drawXAxis(chartArea, chartValueScale, xLines)}
              {drawYAxes(chartArea, points)}
              {drawHighlights(chartArea, points.length, highlights)}

              <Path d={refShape} stroke="blue" strokeWidth="1" fill="none"/>
              <Path d={chartShape} stroke="orange" strokeWidth="2.5" fill="none"/>
            </G>
          </G>
        </Svg>
      </View>
    );
  }
}