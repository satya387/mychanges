import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AgCartesianSeriesTooltipRendererParams, AgChartOptions } from "ag-charts-community";
import { ChartsService } from '../charts.service';

@Component({
  selector: 'app-revenue-top-five-chart',
  templateUrl: './revenue-top-five-chart.component.html',
  styleUrls: ['./revenue-top-five-chart.component.scss']
})


export class LineChartComponent implements OnChanges {

  @Input() revenueData: any;
  public options: AgChartOptions | null = null;
  public top_five_chart_options: AgChartOptions | null = null;
  public ytdTarget: any;
  public ytdActuals: any;
  public ytdVariance: any;
  public offShoreActuals = 1000;
  public onShoreActuals = 800;
  public nearShoreActuals = 200;

  constructor(public chartsService: ChartsService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('revenueData' in changes) {
      if (this.revenueData) {
        this.ytdTarget = (this.revenueData.revenueYtdDto.ytdTarget / 1000000).toFixed(2) + " M";
        this.ytdActuals = (this.revenueData.revenueYtdDto.ytdActual / 1000000).toFixed(2) + " M";
        this.ytdVariance = (this.revenueData.revenueYtdDto.ytdVariance / 1000000).toFixed(2) + " M";
        this.initializeChartOptions(this.revenueData);
      }
    }
  }
  initializeChartOptions(revenueData: any) {

    const transformedData = revenueData.revenues.map(item => ({
      ...item,
      target: item.target === 0 ? null : item.target,
      actual: item.actual === 0 ? null : item.actual,
      forecast: item.forecast === 0 ? null : item.forecast
    }));
    this.options = {
      autoSize: true,
      data: transformedData,
      series: [
        {
          xKey: "monthNames",
          yKey: "target",
          yName: "Target",
          stroke: "#0D0359",
          label: {
            formatter: (params) => `${((params.value / 1000000).toFixed(2))}`
          },
          marker: {
            fill: "#0D0359", stroke: "#0D0359"
          },
          tooltip: {
            renderer: this.tooltipRenderer
          }, highlightStyle: {
            item: { fill: "#0D0359", stroke: "#0D0359" }
          }
        },
        {
          xKey: "monthNames",
          yKey: "actual",
          yName: "Actual",
          stroke: "#0FE4BD",
          label: {
            formatter: (params) => `${((params.value / 1000000).toFixed(2))}`
          },
          marker: {
            fill: "#0FE4BD", stroke: "#0FE4BD"
          }
          ,
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
            formatter: (params) => `${((params.value / 1000000).toFixed(2))}`
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
        // ,
        // {
        //   xKey: "monthNames",
        //   yKey: "forecast",
        //   yName: "Forecast",
        //   stroke: "#6A5ACD",
        //   label: {
        //     formatter: (params) => `${((params.value / 1000000).toFixed(2))}`
        //   },
        //   marker: {
        //     fill: "#6A5ACD",
        //   },
        //   tooltip: {
        //     renderer: this.tooltipRenderer
        //   }
        // }
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
            formatter: (params) => `${(params.value / 1000000)} M`
          }
        }
      ]
    };

    this.top_five_chart_options = {
      // title: {
      //   text: "Top Five Performing Account"
      // },
      // subtitle: {
      //   text: "in million U.S. dollars"
      // },
      data: revenueData.accountWiseRevenues,
      // this.getData(),
      theme: {
        palette: {
          fills: ["#3E2FB2"],
          strokes: ["#3E2FB2"]
        }
      },
      series: [
        {
          type: "bar",
          xKey: "accountName",
          yKey: "actual",
          yName: "Actual Revenue",
          label: {
            formatter: (params) => `${((params.value / 1000000).toFixed(2))}M`,
            color: 'white'
          },
          stacked: true,
          tooltip: {
            renderer: this.tooltipRenderer
          },
          highlightStyle: {
            item: { fill: "#3E2FB2" }
          }
        }
      ]
      ,
      axes: [
        {
          type: "number",
          position: "bottom",
          label: {
            formatter: (params) => `${(params.value / 1000000)} M`
          }
        },
        {
          type: "category",
          position: "left",
          label: {
            rotation: 0,
            formatter: (params) => {
              const MAX_LABEL_LENGTH = 10;
              const accountName = params.value;
              if (accountName.length > MAX_LABEL_LENGTH) {
                return accountName.substring(0, MAX_LABEL_LENGTH) + "...";
              } else {
                return accountName;
              }
            },
          }
        }
      ]
    };
  }
  // getData() {
  //   return [
  //     {
  //       accountName: "Emids1",
  //       actual: 550
  //       // ,
  //       // target: 1100,
  //       // variance: 550
  //     },
  //     {
  //       accountName: "Emids2",
  //       actual: 3947.51
  //       // ,
  //       // target: 7895.02,
  //       // variance: 3947.51
  //     },
  //     {
  //       accountName: "Emids3",
  //       actual: 10093.45
  //       // ,
  //       // target: 10093.45,
  //       // variance: 0
  //     },
  //     {
  //       accountName: "Emids4",
  //       actual: 18646
  //       // ,
  //       // target: 26040,
  //       // variance: 7394
  //     },
  //     {
  //       accountName: "Emids5",
  //       actual: 26626.14
  //       // ,
  //       // target: 26626.14,
  //       // variance: 0
  //     }
  //   ];
  // }
  public tooltipRenderer(params: AgCartesianSeriesTooltipRendererParams) {
    const { yValue, xValue } = params;
    let dollarValue = yValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return {
      content: `${xValue}: $${dollarValue}`
    };
  }
}

