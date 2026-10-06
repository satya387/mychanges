import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AgCartesianSeriesTooltipRendererParams, AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-shared-cost-chart',
  templateUrl: './shared-cost-chart.component.html',
  styleUrls: ['./shared-cost-chart.component.scss']
})
export class SharedCostChartComponent implements OnChanges {

  public optionsDSC: AgChartOptions;
  public optionsBuCost: AgChartOptions;
  public optionsSGA: AgChartOptions;
  @Input() sharedCostsData: any;
  @Input() selectedOption: any;
  public percentage_off :number;
  public percentage_org: number;
  public percentage_on: number;
  public percentage_near: number;
  public ytdBuCost: any;
  public ytdDSC: any;
  public ytdSGA: any;

  constructor() { 
  
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('sharedCostsData' in changes || 'selectedOption' in changes) {
      if (this.sharedCostsData) {
        this.ytdBuCost = this.sharedCostsData?.sharedCostYTD?.ytdBuCost === 0 ? 0 : (this.sharedCostsData?.sharedCostYTD?.ytdBuCost/1000000).toFixed(2) + 'M';
        this.ytdDSC = this.sharedCostsData?.sharedCostYTD?.ytddsc === 0 ? 0 : (this.sharedCostsData?.sharedCostYTD?.ytddsc/1000000).toFixed(2) + 'M';
        this.ytdSGA = this.sharedCostsData?.sharedCostYTD?.ytdsga === 0 ? 0 : (this.sharedCostsData?.sharedCostYTD?.ytdsga/1000000).toFixed(2) + 'M';

        // console.log('sharedCostsData', this.sharedCostsData);
        this.initializeChartOptions(this.sharedCostsData);
      }
    }
  }
  
  // initializeChartOptions(sharedCostsData: any){
  //   const transformedData = sharedCostsData.sharedCosts.map(item => ({
  //     ...item,
  //     target: item.dsc === 0 ? null : item.dsc,
  //     actual: item.buCost === 0 ? null : item.buCost,
  //     forecast: item.sga === 0 ? null : item.sga
  //   }));
  //   this.options = {
  //     autoSize: true,
  //     data: transformedData,
  //     series: [
  //       {
  //         xKey: "monthNames",
  //         yKey: "dsc",
  //         yName: "DSC",
  //         stroke: "#0D0359",
  //         label: {
  //           formatter: (params) => `${((params.value / 1000000).toFixed(2))}`
  //         },
  //         marker: {
  //           fill: "#0D0359",stroke:"#0D0359"
  //         },
  //         tooltip: {
  //           renderer: this.tooltipRenderer
  //         },
  //         highlightStyle: {
  //           item: { fill: "#0D0359", stroke: "#0D0359" }
  //         }
  //       },
  //       {
  //         xKey: "monthNames",
  //         yKey: "buCost",
  //         yName: "BuCost",
  //         stroke: "#0FE4BD",
  //         label: {
  //           formatter: (params) => `${((params.value / 1000000).toFixed(2))}`
  //         },
  //         marker: {
  //           fill: "#0FE4BD",stroke:"#0FE4BD"
  //         },
  //         tooltip: {
  //           renderer: this.tooltipRenderer
  //         },
  //         highlightStyle: {
  //           item: { fill: "#0FE4BD", stroke: "#0FE4BD" }
  //         }
  //       },
  //       {
  //         xKey: "monthNames",
  //         yKey: "sga",
  //         yName: "SGA",
  //         stroke: "#ffa500",
  //         label: {
  //           formatter: (params) => `${((params.value / 1000000).toFixed(2))}`
  //         },
  //         marker: {
  //           fill: "#ffa500", stroke: "#ffa500"
  //         }
  //         ,
  //         tooltip: {
  //           renderer: this.tooltipRenderer
  //         },
  //         highlightStyle: {
  //           item: { fill: "#ffa500", stroke: "#ffa500" }
  //         }
  //       }
  //     ],
  //     axes: [
  //       {
  //         type: "category",
  //         position: "bottom",
  //         label: {
  //           rotation: 0
  //         }
  //       },
  //       {
  //         type: "number",
  //         position: "left",
  //         label: {
  //           formatter: (params) => `${(params.value / 1000000)} M`
  //         }
  //       }
  //     ]
  //   };
  // }



  initializeChartOptions(sharedCostsData: any) {
    const transformedData = sharedCostsData.sharedCosts.map(item => ({
      ...item,
      target: item.dsc === 0 ? null : item.dsc,
      actual: item.buCost === 0 ? null : item.buCost,
      forecast: item.sga === 0 ? null : item.sga
    }));
  
    // DSC Chart
    if(this.selectedOption == 1){
      this.optionsDSC = {
        autoSize: true,
        data: transformedData,
        series: [
          {
            xKey: "monthNames",
            yKey: "dsc",
            yName: "DSC",
            stroke: "#0D0359",
            marker: {
              fill: "#0D0359",
              stroke: "#0D0359"
            },
            label: {
              formatter: (params) => `${((params.value / 1000000).toFixed(2))}`
            },
            tooltip: {
              renderer: this.tooltipRenderer
            },
            highlightStyle: {
              item: { fill: "#0D0359", stroke: "#0D0359" }
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
              formatter: (params) => `${(params.value / 1000000)} M`
            }
          }
        ]
      };
    }
  
    // BuCost Chart
    if(this.selectedOption == 2){
      this.optionsBuCost = {
        autoSize: true,
        data: transformedData,
        series: [
          {
            xKey: "monthNames",
            yKey: "buCost",
            yName: "BuCost",
            stroke: "#0FE4BD",
            marker: {
              fill: "#0FE4BD",
              stroke: "#0FE4BD"
            },
            label: {
              formatter: (params) => `${((params.value / 1000000).toFixed(2))}`
            },
            tooltip: {
              renderer: this.tooltipRenderer
            },
            highlightStyle: {
              item: { fill: "#0FE4BD", stroke: "#0FE4BD" }
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
              formatter: (params) => `${(params.value / 1000000)} M`
            }
          }
        ]
      };
    }
  
    // SGA Chart
    if(this.selectedOption == 3){
      this.optionsSGA = {
        autoSize: true,
        data: transformedData,
        series: [
          {
            xKey: "monthNames",
            yKey: "sga",
            yName: "SGA",
            stroke: "#ffa500",
            marker: {
              fill: "#ffa500",
              stroke: "#ffa500"
            },
            label: {
              formatter: (params) => `${((params.value / 1000000).toFixed(2))}`
            },
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
              formatter: (params) => `${(params.value / 1000000)} M`
            }
          }
        ]
      };
    }
  }
  


  ngOnInit(): void {
  }

  public tooltipRenderer(params: AgCartesianSeriesTooltipRendererParams) {
    const { yValue, xValue } = params;
    let dollarValue = yValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return {
      content: `${xValue}: $${dollarValue}`
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
