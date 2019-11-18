import React from 'react';

import {View} from 'react-native';

import Svg, {
  Defs,
  ClipPath,
  Rect,
  G,
  Path,
  Circle,
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
  
  drawLineChart = (area, valueScale, data, dataPoint, color) => {
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
  
  drawAreaChart = (area, valueScale, data, dataPoint, color) => {
    let path = `M ${this.generateChartX(area, data.length, 0)} ${this.generateChartY(area, valueScale, valueScale.min)}`;
  
    for (let i=0; i < data.length; i++) {
      let xpoint = this.generateChartX(area, data.length, i);
      let ypoint = this.generateChartY(area, valueScale, data[i].point[dataPoint]);
  
      path += `L ${xpoint} ${ypoint} `;
    }
  
    path += `L ${this.generateChartX(area, data.length, data.length-1)} ${this.generateChartY(area, valueScale, valueScale.min)}`;
    path += "Z";
  
    return(
      <G>
        <Path d={path} stroke="transparent" strokeWidth="0" fill={color} opacity="0.5"/>
      </G>
    )
  }

  drawBarChart = (area, valueScale, data, dataPoint, color) => {
    const barWidth = (area.width / data.length) - 4;
    let bars = [];
    for (let i=0; i < data.length-1; i++) {
      bars.push(data[i]);
    }

    return(
      <G>
        {bars.map((item, index) => {
          let xpoint = this.generateChartX(area, data.length, index);
          let ypoint = this.generateChartY(area, valueScale, item.point[dataPoint]);
          let barHeight = area.height - ypoint;
          return(
            <Rect
              key={`bar${index}`}
              x={xpoint+3}
              y={ypoint}
              rx="0"
              ry="0"
              width={barWidth}
              height={barHeight}
              fill={color}
              strokeWidth="0"
              opacity="0.5"
            >
            </Rect>
          ); 
        })}
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

  drawYLabels = (chartArea, valueScaleLeft, valueScaleRight, labels, color) => {
    return(
      <G x="4">
        {labels.map((item, index) => {
          let leftY = this.generateChartY(chartArea, valueScaleLeft, item.l);
          let rightY = this.generateChartY(chartArea, valueScaleRight, item.r);

          return(
            <G key={`lab${index}`}>
              <SVGText
                x="10"
                y={leftY}
                fontSize="8"
                fontWeight="bold"
                textAnchor="end"
                fill={color}
              >
                {parseInt(Math.round(item.l))}
              </SVGText>
              <SVGText
                x={chartArea.width+20}
                y={rightY}
                fontSize="8"
                fontWeight="bold" 
                textAnchor="start"
                fill={color}
              >
                {parseInt(Math.round(item.r))}
              </SVGText>
            </G>  
          );
        })}
      </G>
    )
  }
  
  drawXLabels = (chartArea, data, color) => {
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
              fill={color}
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
      let xleft = (i * yDeltaLeft) + valueScaleLeft.min;
      let xright = (i * yDeltaRight) + valueScaleRight.min;
      let label = {l: xleft, r: xright};
      labels.push(label);
    }
    return labels;
  }

  drawReferenceLine = (chartArea, valueScale, refValue, color, side) => {
    const lineY = parseInt(this.generateChartY(chartArea, valueScale, refValue));
    const ballX = side === "left" ? 0 : chartArea.width;
    const pathShape = `M 0 ${lineY} h ${chartArea.width}`;
    return(
      <G>
        <Path d={pathShape} stroke={color} strokeWidth="1" fill="none"/>
        <Circle cx={ballX} cy={lineY} r="3" fill={color}/>
      </G>
    );
  }

  

  render() {
    let width = this.state.width;
    let height = this.state.height;

    let marginLeft = 5;
    let marginRight = 5;
    let marginTop = 50;
    let marginBottom = 50;

    let labelsWidthLeft = 20;
    let labelsWidthRight = 20;
    let labelsBottomHeight = 30;
    
    

    let chartWidth = width - labelsWidthLeft - labelsWidthRight - marginLeft - marginRight;
    let chartHeight = height - marginTop - marginBottom - labelsBottomHeight;

    let leftChartColor = this.props.config.leftDataColor;
    let rightChartColor = this.props.config.rightDataColor;
    let leftRefColor = this.props.config.leftRefColor;
    let rightRefColor = this.props.config.rightRefColor;
    let leftTitle = this.props.config.leftDataTitle;
    let leftUnit = this.props.config.leftDataUnit;
    let rightTitle = this.props.config.rightDataTitle;
    let rightUnit = this.props.config.rightDataUnit;

    const data = this.props.data;
    if (!data) {
      return (<View></View>);
    }


    const chartArea = {x: 0, y: 0, width: chartWidth, height: chartHeight};
    const chartValueScaleLeft = {min: 20, max: 25};
    const chartValueScaleRight = {min: 400, max: 500};

    const leftReferenceValue = 22;
    const rightReferenceValue = 400;

    let highlights = this.props.highlights;
    if (!highlights) {
      highlights = [];
    }

    /*
    let highlights = [
      {startColumn: 4, numColumns: 4, color: "orange", opacity: "0.4", title: "jousto"},
    ];
    */

    const numXLabels = 4;
    const xLabels = this.generateXLabels(chartValueScaleLeft, chartValueScaleRight, numXLabels);

    console.log(xLabels);

    const bottomArea = {
      x: labelsWidthLeft,
      y: marginTop + chartHeight + labelsBottomHeight,
      width: width - labelsWidthLeft - labelsWidthRight,
      height: height - marginTop - chartHeight
    };

    const chartClip = `M 0 0 h ${chartArea.width} v ${chartArea.height} h ${-chartArea.width} Z`;


    return(
      <View style={{width: '100%', height: '100%', backgroundColor: '#f8f8f8'}} onLayout={this.onLayout}>
        <Svg width={width} height={height}>
          <Defs>
            <ClipPath id="chartClip">
              <Path d={chartClip}/>
            </ClipPath>
          </Defs>
          <G>
            {/* Draw chart title and units in left and right */}
            <SVGText x={4} y={12} fontSize="10" textAnchor="start">{leftTitle}</SVGText>
            <SVGText x={4} y={12+14} fontSize="14" textAnchor="start">{leftUnit}</SVGText>

            <SVGText x={width-4} y={12} fontSize="10" textAnchor="end">{rightTitle}</SVGText>
            <SVGText x={width-4} y={12+14} fontSize="14" textAnchor="end">{rightUnit}</SVGText>

            {/*
            <Rect x={0} y={marginTop} rx="0" ry="0" width={labelsWidthLeft+marginLeft} height={chartArea.height+2} fill={leftChartColor}/>
            <Rect x={width-labelsWidthRight-marginRight} y={marginTop} rx="0" ry="0" width={labelsWidthRight+marginRight} height={chartArea.height+2} fill={rightChartColor}/>
            */}

            {/* Draw labels in Y-direction */}
            <G x={marginLeft} y={marginTop}>
              
              {this.drawYLabels(chartArea, chartValueScaleLeft, chartValueScaleRight, xLabels, "black")}
            </G>

            {/* Draw the main chart */}
            <G x={marginLeft+labelsWidthLeft} y={marginTop} width={chartWidth} height={chartHeight}>
              {this.drawXAxis(chartArea, chartValueScaleLeft, xLabels)}
              {this.drawYAxes(chartArea, data)}
              {this.drawHighlights(chartArea, data.length, highlights)}
              
              <G clipPath="url(#chartClip)">
                {this.drawAreaChart(chartArea, chartValueScaleRight, data, 1, rightChartColor)}
                {/*this.drawBarChart(chartArea, chartValueScaleRight, data, 1, rightChartColor)*/}
                {this.drawLineChart(chartArea, chartValueScaleLeft, data, 0, leftChartColor)}
              </G>

              {this.drawReferenceLine(chartArea, chartValueScaleRight, rightReferenceValue, rightRefColor, "right")}
              {this.drawReferenceLine(chartArea, chartValueScaleLeft, leftReferenceValue, leftRefColor, "left")}
            </G>

            {/* Draw labels in X-direction */}
            <G x={marginLeft+labelsWidthLeft} y={marginTop+chartHeight} width={chartArea.width} height={labelsBottomHeight}>
              {this.drawXLabels(chartArea, data, "black")}
            </G>

            {/* Draw chart explanations in the bottom */}
            <G x={bottomArea.x} y={bottomArea.y} width={bottomArea.width} height={bottomArea.height}>
              <G x="4" y="8">
                <Rect x={0} y={0} rx="2" ry="2" width="14" height="14" stroke="black" strokeWidth="0.5" fill={leftChartColor}/>
                <SVGText x={18} y={10} fontSize="8">{leftTitle}</SVGText>
                <Rect x={0} y={20} rx="2" ry="2" width="14" height="14" stroke="black" strokeWidth="0.5" fill={leftRefColor}/>
                <SVGText x={18} y={20+10} fontSize="8">{`${leftTitle} (tavoitearvo)`}</SVGText>
              </G>

              <G x={4 + bottomArea.width/2} y="8">
                <Rect x={0} y={0} rx="2" ry="2" width="14" height="14" stroke="black" strokeWidth="0.5" fill={rightChartColor}/>
                <SVGText x={18} y={10} fontSize="8">{rightTitle}</SVGText>
                <Rect x={0} y={20} rx="2" ry="2" width="14" height="14" stroke="black" strokeWidth="0.5" fill={rightRefColor}/>
                <SVGText x={18} y={20+10} fontSize="8">{`${rightTitle} (tavoitearvo)`}</SVGText>
              </G>
            </G>
          </G>
        </Svg>
      </View>
    );
  }
}