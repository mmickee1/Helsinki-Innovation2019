import React from 'react';

import {View} from 'react-native';

import Svg, {
  Rect,
  G,
  Path,
  Text as SVGText
} from 'react-native-svg';


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


  generateChartX = (area, numPoints, x) => {
    let xpoint = area.x + ((area.width / (numPoints-1)) * x);
    return xpoint;
  }
  
  generateChartY = (area, valueScale, y) => {
    let ypoint = parseInt(area.y + area.height - ((area.height / (valueScale.max - valueScale.min)) * (y - valueScale.min)));
    return ypoint;
  }
  
  drawChartLine = (area, valueScale, data, dataPoint, color) => {
    let path = "";
  
    for (let i=0; i < data.length; i++) {
      let xpoint = this.generateChartX(area, data.length, i);
      let ypoint = this.generateChartY(area, valueScale, data[i].point[dataPoint]);
  
      let cmd = i == 0 ? 'M' : 'L';
      path += `${cmd} ${xpoint} ${ypoint} `;
    }
  
    return(
      <G>
        <Path d={path} stroke={color} strokeWidth="2.5" fill="none"/>
      </G>
    );
  };
  
  drawChartArea = (area, valueScale, data, dataPoint, color) => {
    let path = `M ${this.generateChartX(area, data.length, 0)} ${this.generateChartY(area, valueScale, 0)}`;
  
    for (let i=0; i < data.length; i++) {
      let xpoint = this.generateChartX(area, data.length, i);
      let ypoint = this.generateChartY(area, valueScale, data[i].point[dataPoint]);
  
      path += `L ${xpoint} ${ypoint} `;
    }
  
    path += `L ${this.generateChartX(area, data.length, data.length-1)} ${this.generateChartY(area, valueScale, 0)}`;
    path += "Z";
  
    return(
      <G>
        <Path d={path} stroke="transparent" strokeWidth="0" fill={color} opacity="0.5"/>
      </G>
    )
  }
  
  drawXAxis = (chartArea, chartValueScale, values) => {
    return(
      <G>
        {values.map((item, index) => {
          let stroke, strokeWidth, strokeDashes;
  
          if (item.l === 0) {
            stroke = "black";
            strokeWidth = "1";
            strokeDashes = "";
          } else {
            stroke = "gray";
            strokeWidth = "0.5";
            strokeDashes = "5, 5";
          }
  
          let lineY = this.generateChartY(chartArea, chartValueScale, item.l);
          return(
            <Path
              key={`x${item.l}`}
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
  
  drawYLabels = (chartArea, chartValueScale, values, side) => {
    let anchor, textXpos;
    if (side === "left") {
      anchor = "end";
      textXpos = 12;
    } else {
      anchor = "start";
      textXpos = 2;
    }
    return(
      <G x="4">
        {values.map((item, index) => {
          let textY = this.generateChartY(chartArea, chartValueScale, item);
  
          return <SVGText x={textXpos} y={textY} key={item} fontSize="8" textAnchor={anchor}>{item}</SVGText>
        })}
      </G>
    );
  }

  drawYLabels2 = (chartArea, valueScaleLeft, valueScaleRight, labels) => {
    return(
      <G x="4">
        {labels.map((item, index) => {
          let leftY = this.generateChartY(chartArea, valueScaleLeft, item.l);
          let rightY = this.generateChartY(chartArea, valueScaleRight, item.r);

          return(
            <G key={`lab${index}`}>
              <SVGText x="10" y={leftY} fontSize="8" textAnchor="end">{item.l}</SVGText>
              <SVGText x={chartArea.width+20} y={rightY} fontSize="8" textAnchor="start">{item.r}</SVGText>
            </G>  
          );
        })}
      </G>
    )
  }
  
  drawXLabels = (chartArea, data) => {
    return(
      <G>
        {data.map((item, index) => {
          let x = this.generateChartX(chartArea, data.length, index);
          return(
            <SVGText
              key={`xx${index}`}
              x={0}
              y={0}
              fontSize="8"
              textAnchor="end"
              transform={`translate(${x+3},4) rotate(-90 0,0)`}
            >
              {item.label}
            </SVGText>
          ); 
        })}
      </G>
    );
  }


  drawYAxes = (chartArea, values) => {
    return(
      <G>
        {values.map((item, index) => {
          let x = this.generateChartX(chartArea, values.length, index);
          return <Path key={`yx${index}`} d={`M ${x} 0 v ${chartArea.height}`} stroke="#cfcfcf" strokeWidth="1"/>
        })}
      </G>
    );
  }


  drawHighlights = (chartArea, numPoints, highlights) => {
    return(
      <G>
        {highlights.map((item, index) => {
          let xStart = this.generateChartX(chartArea, numPoints, item.startColumn);
          let xEnd = this.generateChartX(chartArea, numPoints, item.startColumn+item.numColumns);

          let highlightTitle;
          if (item.title) {
            highlightTitle =
            <G>
              <Path
                d={`M ${xStart} ${chartArea.y-2} q 0 -5 5 -5 l ${xEnd-xStart-10} 0 q 5 0 5 5`}
                stroke="black"
                strokeWidth="0.5"
                fill="none"
              />
              <SVGText
                x={xStart + ((xEnd-xStart) / 2)}
                y={chartArea.y - 12}
                fontSize="8"
                textAnchor="middle"
              >
                {item.title}
              </SVGText>
            </G>
          }

          return(
            <G key={`hr${index}`}>
              <Rect
                x={xStart}
                y={chartArea.y}
                rx="0"
                ry="0"
                width={xEnd-xStart}
                height={chartArea.height}
                fill={item.color}
                opacity={item.opacity}
              />
              {highlightTitle}
            </G>
          );
        })}
      </G>
    );
  }

  generateXLabels = (valueScaleLeft, valueScaleRight, numLabels) => {
    const labels = [];
    const yDeltaLeft = (valueScaleLeft.max - valueScaleLeft.min) / numLabels;
    const yDeltaRight = (valueScaleRight.max - valueScaleRight.min) / numLabels;
    for (let i=0; i < numLabels; i++) {
      let label = {l: parseInt(i * yDeltaLeft), r: parseInt(i * yDeltaRight)};
      labels.push(label);
    }
    return labels;
  }

  

  render() {
    let marginLeft = 5;
    let marginRight = 5;
    let marginTop = 50;
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



    //let points = [20, 18, 22, 23, 25, 10, 12, 10, 22, 23, 25, 27, 30, 32];
    //let rightPoints = [0, 50, 75, 50, 50, 100, 120, 130, 200, 180, 190, 50, 0, 0];

    //let times = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

    const data = [
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
    ];


    let chartArea = {x: 0, y: 0, width: chartWidth, height: chartHeight};
    let chartValueScaleLeft = {min: 0, max: 40};
    let chartValueScaleRight = {min: 0, max: 250};

    let leftRefShape = `M 0 ${this.generateChartY(chartArea, chartValueScaleLeft, 22)} h ${chartWidth}`;
    let rightRefShape = `M 0 ${this.generateChartY(chartArea, chartValueScaleRight, 100)} h ${chartWidth}`;

    let highlights = [
      {startColumn: 4, numColumns: 4, color: "orange", opacity: "0.4", title: "jousto"},
    ];

    let numXLabels = 4;
    const xLabels = this.generateXLabels(chartValueScaleLeft, chartValueScaleRight, numXLabels);


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
            <SVGText x={4} y={12} fontSize="10" textAnchor="start">{leftTitle}</SVGText>
            <SVGText x={4} y={12+14} fontSize="14" textAnchor="start">{leftUnit}</SVGText>

            <SVGText x={width-4} y={12} fontSize="10" textAnchor="end">{rightTitle}</SVGText>
            <SVGText x={width-4} y={12+14} fontSize="14" textAnchor="end">{rightUnit}</SVGText>

            {/*
            <G x={marginLeft} y={marginTop} width={labelsWidthLeft} height={labelsHeight}>
              {this.drawYLabels(chartArea, chartValueScaleLeft, xLabelsLeft, "left")}
              
            </G>
            <G x={width-marginRight-labelsWidthRight} y={marginTop} width={labelsWidthRight} height={labelsHeight}>
              {this.drawYLabels(chartArea, chartValueScaleRight, xLabelsRight, "right")}
            </G>*/}
            <G x={marginLeft} y={marginTop}>
              {this.drawYLabels2(chartArea, chartValueScaleLeft, chartValueScaleRight, xLabels)}
            </G>

            <G x={marginLeft+labelsWidthLeft} y={marginTop} width={chartWidth} height={chartHeight}>
              {this.drawXAxis(chartArea, chartValueScaleLeft, xLabels)}
              {this.drawYAxes(chartArea, data)}
              {this.drawHighlights(chartArea, data.length, highlights)}

              
              {this.drawChartArea(chartArea, chartValueScaleRight, data, 1, rightChartColor)}
              {this.drawChartLine(chartArea, chartValueScaleLeft, data, 0, leftChartColor)}
              <Path d={rightRefShape} stroke={rightRefColor} strokeWidth="1" fill="none"/>
              <Path d={leftRefShape} stroke={leftRefColor} strokeWidth="1" fill="none"/>
            </G>

            <G x={marginLeft+labelsWidthLeft} y={marginTop+chartHeight} width={chartArea.width} height={labelsBottomHeight}>
              {this.drawXLabels(chartArea, data)}
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