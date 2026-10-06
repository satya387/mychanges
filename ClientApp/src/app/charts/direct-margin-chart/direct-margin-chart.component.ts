import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AgCartesianSeriesTooltipRendererParams, AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-direct-margin-chart',
  templateUrl: './direct-margin-chart.component.html',
  styleUrls: ['./direct-margin-chart.component.scss']
})
export class MarginChartComponent implements OnChanges {

  public options: AgChartOptions;
  @Input() directMarginData: any;
  public percentage_off :number;
  public percentage_org: number;
  public percentage_on: number;
  public percentage_near: number;
  constructor() { 
  
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('directMarginData' in changes) {
      if (this.directMarginData) {
        this.initializeChartOptions(this.directMarginData);
      }
    }
  }
  
  initializeChartOptions(directMarginData: any){
    this.percentage_near = directMarginData?.locationWiseDM?.nearShore == null ? 0 : directMarginData?.locationWiseDM?.nearShore;
    this.percentage_off = directMarginData?.locationWiseDM?.offshore == null ? 0 : directMarginData?.locationWiseDM?.offshore;
    this.percentage_on = directMarginData?.locationWiseDM?.onshore == null ? 0 : directMarginData?.locationWiseDM?.onshore;
    this.percentage_org = directMarginData?.orgLevelDM?.actual == null? 0 : directMarginData?.orgLevelDM?.actual;
    const transformedData = directMarginData.directMargins.map(item => ({
      ...item,
      target: item.target === 0 ? null : item.target,
      actual: item.actual === 0 ? null : item.actual,
      forecast: item.forecast === 0 ? null : item.forecast
    }));
    this.options = {
      autoSize: true,
      // title: {
      //   text: "Revenue"
      // },
      data: transformedData,
      // [
      //   {
      //     monthNames: "Sep",
      //     target: 0.1,
      //     actual: 0.7
      //   },
      //   {
      //     monthNames: "Oct",
      //     target: 0.2,
      //     actual: 0.8
      //   },
      //   {
      //     monthNames: "Nov",
      //     target: 0.1,
      //     actual: 0.9
      //   }
      // ],
      series: [
        {
          xKey: "monthNames",
          yKey: "target",
          yName: "Target",
          stroke: "#0D0359",
          label: {
            formatter: (params) => `${(Math.round(params.value))}`  //`${(params.value.toFixed(2))}%`
          },
          marker: {
            fill: "#0D0359",stroke:"#0D0359"
          },
          tooltip: {
            renderer: this.tooltipRenderer
          },
          highlightStyle: {
            item: { fill: "#0D0359", stroke: "#0D0359" }
          }
        },
        {
          xKey: "monthNames",
          yKey: "actual",
          yName: "Actual",
          stroke: "#0FE4BD",
          label: {
            formatter: (params) => `${(Math.round(params.value))}`  //`${(params.value.toFixed(2))}%`
          },
          marker: {
            fill: "#0FE4BD",stroke:"#0FE4BD"
          },
          tooltip: {
            renderer: this.tooltipRenderer
          },
          highlightStyle: {
            item: { fill: "#0FE4BD", stroke: "#0FE4BD" }
          }
        },
        {
          xKey: "monthNames",
          yKey: "forecast",
          yName: "Forecast",
          stroke: "#ffa500",
          label: {
            formatter: (params) => `${(Math.round(params.value))}` //`${(params.value.toFixed(2))}%`
          },
          marker: {
            fill: "#ffa500", stroke: "#ffa500"
          }
          ,
          tooltip: {
            renderer: this.tooltipRenderer
          },
          highlightStyle: {
            item: { fill: "#ffa500", stroke: "#ffa500" }
          }
        }
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          label: {
            rotation: 0
          }
        },
        {
          type: "number",
          position: "left",
          label: {
            formatter: (params) => `${params.value} %`
          }
        }
      ]
    };
  }
  ngOnInit(): void {
  }

  public tooltipRenderer(params: AgCartesianSeriesTooltipRendererParams) {
    const { yValue, xValue } = params;
    return {
      content: `${xValue}: ${yValue}%`
    };
  }
  
  public  getFillImageOff() {
    const fillPercentageOff = Math.min(Math.max(this.percentage_off, 0), 100);
    return `conic-gradient(from 0deg, #6A5ACD ${fillPercentageOff * 3.6}deg, transparent 0deg 360deg)`;
  }
  public  getFillImageCY() {
    const fillPercentageCY = Math.min(Math.max(this.percentage_org, 0), 100);
    return `conic-gradient(from 0deg, #6A5ACD ${fillPercentageCY * 3.6}deg, transparent 0deg 360deg)`;
  }
  public  getFillImageOn() {
    const fillPercentage = Math.min(Math.max(this.percentage_on, 0), 100);
    return `conic-gradient(from 0deg, #6A5ACD ${fillPercentage * 3.6}deg, transparent 0deg 360deg)`;
  }

  public  getFillImageNear() {
    const fillPercentage = Math.min(Math.max(this.percentage_near, 0), 100);
    return `conic-gradient(from 0deg, #6A5ACD ${fillPercentage * 3.6}deg, transparent 0deg 360deg)`;
  }

}
