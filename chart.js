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

drawChartLine = (area, valueScale, points, color) => {
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
  return(
    <G>
      <Path d={path} stroke={color} strokeWidth="2.5" fill="none"/>
    </G>
  );
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

drawLabels = (xpos, chartArea, chartValueScale, values, side) => {
  let anchor, textXpos;
  if (side === "left") {
    anchor = "end";
    textXpos = 12;
  } else {
    anchor = "start";
    textXpos = 2;
  }
  return(
    <G x={xpos}>
      {values.map((item, index) => {
        console.log(item);

        let textY = generateChartY(chartArea, chartValueScale, item);

        return <SVGText x={textXpos} y={textY} key={item} fontSize="8" textAnchor={anchor}>{item}</SVGText>
      })}
    </G>
  );
}

drawYAxes = (chartArea, values) => {
  return(
    <G>
      {values.map((item, index) => {
        let x = generateChartX(chartArea, values.length, index);
        return <Path key={`yx${index}`} d={`M ${x} 0 v ${chartArea.height}`} stroke="#cfcfcf" strokeWidth="1"/>
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
    let marginTop = 30;
    let marginBottom = 50;

    let width = this.state.width;
    let height = this.state.height;

    let labelsWidthLeft = 20;
    let labelsWidthRight = 20;
    let labelsBottomHeight = 30;
    let labelsHeight = height;
    let chartWidth = width - labelsWidthLeft - labelsWidthRight - marginLeft - marginRight;
    let chartHeight = height - marginTop - marginBottom - labelsBottomHeight;

    let leftChartColor = "orange";
    let rightChartColor = "magenta";
    let leftRefColor = "blue";
    let rightRefColor = "green";
    let leftTitle = "Lämpötila";
    let leftUnit = "°C";
    let rightTitle = "CO2";
    let rightUnit = "ppm";



    let points = [20, 18, 22, 23, 25, 10, 12, 10, 22, 23, 25, 27, 30, 32];
    //let rightPoints = [0, 50, 75, 50, 50, 100, 120, 130, 200, 180, 190, 50, 0, 0];

    let rightPoints = [0, 200, 0];

    let chartArea = {x: 0, y: 0, width: chartWidth, height: chartHeight};
    let chartValueScale = {min: 0, max: 45};
    let chartValueScaleRight = {min: 0, max: 250};

    let leftRefShape = `M 0 ${generateChartY(chartArea, chartValueScale, 22)} h ${chartWidth}`;
    let rightRefShape = `M 0 ${generateChartY(chartArea, chartValueScaleRight, 100)} h ${chartWidth}`;

    let highlights = [
      {startColumn: 4, numColumns: 4, color: "orange", opacity: "0.2"},
    ];

    let xLabelsLeft = [0, 10, 20, 30, 40];
    let xLabelsRight = [0, 50, 100, 150, 200];

    let bottomArea = {
      x: labelsWidthLeft,
      y: marginTop + chartHeight + labelsBottomHeight,
      width: width - labelsWidthLeft - labelsWidthRight,
      height: height - marginTop - chartHeight
    };


    return(
      <View style={{width: '100%', height: '100%', backgroundColor: '#f8f8f8'}} onLayout={this.onLayout}>
        <Svg width={width} height={height}>
          <G>
            <SVGText x={2} y={12} fontSize="10" textAnchor="start">{leftTitle}</SVGText>
            <SVGText x={2} y={12+14} fontSize="14" textAnchor="start">{leftUnit}</SVGText>

            <SVGText x={width-2} y={12} fontSize="10" textAnchor="end">{rightTitle}</SVGText>
            <SVGText x={width-2} y={12+14} fontSize="14" textAnchor="end">{rightUnit}</SVGText>

            <G x={marginLeft} y={marginTop} width={labelsWidthLeft} height={labelsHeight}>
              {drawLabels(4, chartArea, chartValueScale, xLabelsLeft, "left")}
              {drawLabels(labelsWidthLeft + chartWidth + 4, chartArea, chartValueScaleRight, xLabelsRight, "right")}
            </G>
            <G x={marginLeft+labelsWidthLeft} y={marginTop} width={chartWidth} height={chartHeight}>
              {drawXAxis(chartArea, chartValueScale, xLabelsLeft)}
              {drawYAxes(chartArea, points)}
              {drawHighlights(chartArea, points.length, highlights)}

              <Path d={leftRefShape} stroke={leftRefColor} strokeWidth="1" fill="none"/>
              <Path d={rightRefShape} stroke={rightRefColor} strokeWidth="1" fill="none"/>
              {drawChartLine(chartArea, chartValueScale, points, leftChartColor)}
              {drawChartLine(chartArea, chartValueScaleRight, rightPoints, rightChartColor)}
            </G>

            <G x={bottomArea.x} y={bottomArea.y} width={bottomArea.width} height={bottomArea.height}>
              <G x="4" y="8">
                <Rect x={0} y={0} rx="2" ry="2" width="14" height="14" stroke="black" strokeWidth="0.5" fill={leftChartColor}/>
                <SVGText x={18} y={10} fontSize="8">{leftTitle}</SVGText>
                <Rect x={0} y={20} rx="2" ry="2" width="14" height="14" stroke="black" strokeWidth="0.5" fill={leftRefColor}/>
                <SVGText x={18} y={20+10} fontSize="8">{`${leftTitle} (vertailuarvo)`}</SVGText>
              </G>

              <G x={4 + bottomArea.width/2} y="8">
                <Rect x={0} y={0} rx="2" ry="2" width="14" height="14" stroke="black" strokeWidth="0.5" fill={rightChartColor}/>
                <SVGText x={18} y={10} fontSize="8">{rightTitle}</SVGText>
                <Rect x={0} y={20} rx="2" ry="2" width="14" height="14" stroke="black" strokeWidth="0.5" fill={rightRefColor}/>
                <SVGText x={18} y={20+10} fontSize="8">{`${rightTitle} (vertailuarvo)`}</SVGText>
              </G>
            </G>
          </G>
        </Svg>
      </View>
    );
  }
}