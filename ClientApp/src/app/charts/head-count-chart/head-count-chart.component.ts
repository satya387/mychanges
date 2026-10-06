import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { AgChartsAngular } from 'ag-charts-angular';
import { AgCartesianAxisOptions, AgCartesianChartOptions, AgCartesianSeriesOptions, AgCartesianSeriesTooltipRendererParams, AgColumnSeriesOptions, AgLineSeriesOptions } from 'ag-charts-community';

@Component({
  selector: 'app-head-count-chart',
  templateUrl: './head-count-chart.component.html',
  styleUrls: ['./head-count-chart.component.scss']
})
export class BarChartComponent implements OnChanges {

  @Input() selectedOptionLocation: any;
  @Input() headCountData: any;
  public options: AgCartesianChartOptions;

  @ViewChild(AgChartsAngular)
  public agChart!: AgChartsAngular;

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if ('headCountData' in changes || 'selectedOptionLocation' in changes) {
      if (this.headCountData) {
        this.initializeChartOptions(this.headCountData.headCounts);
      }
    }
  }

  initializeChartOptions(headCountData: any) {
    if (this.selectedOptionLocation == '-1') {
      this.options = {
        autoSize: true,
        data: headCountData,
        theme: {
          palette: {
            fills: ["#0D0359",
              "#DBE2FF",
              "#012A75",
              "#FB2166"],

            strokes: ["#0D0359",
              "#DBE2FF",
              "#012A75",
              "#FB2166"]
          }
        },
        series: COLUMN_AND_LINE_FOR_ALL,
        axes: [
          {
            type: "category",
            position: "bottom",
            gridStyle: [
              {
                stroke: undefined
              }
            ]
          },
          {
            // primary y axis
            type: "number",
            position: "left",
            keys: ["totalBillable", "totalNonBillable", "totalUnBillable","totalHeadCount"]

          }
          
          // ,
          // {
          //   // secondary y axis
          //   type: "number",
          //   position: "right",
          //   keys: ["totalHeadCount"],
          //   title: {
          //     text: 'Total headcounts',
          //   },
          // }
        ] as AgCartesianAxisOptions[],
        legend: {
          item: {
            marker: {
              strokeWidth: 0
            }
          }
        }
      };
    }
    else if (this.selectedOptionLocation == '1') {
      this.options = {
        autoSize: true,
        data: headCountData,
        theme: {
          palette: {
            fills: [
              "#533EED",
              "#D4D1ED",
              "#3E2FB2",
              "#FB2166"],

            strokes: [
              "#533EED",
              "#D4D1ED",
              "#3E2FB2",
              "#FB2166"]
          }
        },
        series: COLUMN_AND_LINE_FOR_ONSHORE,
        axes: [
          {
            type: "category",
            position: "bottom",
            gridStyle: [
              {
                stroke: undefined
              }
            ]
          },
          {
            // primary y axis
            type: "number",
            position: "left",
            keys: ["onShoreBillable", "onShoreNonBillable", "onShoreUnBillable","onShore"]

          }
          // ,
          // {
          //   // secondary y axis
          //   type: "number",
          //   position: "right",
          //   keys: ["totalHeadCount"],
          //   title: {
          //     text: 'Total headcounts',
          //   },
          // }
        ] as AgCartesianAxisOptions[],
        legend: {
          item: {
            marker: {
              strokeWidth: 0
            }
          }
        }
      };
    }
    else if (this.selectedOptionLocation == '2') {
      this.options = {
        autoSize: true,
        data: headCountData,
        theme: {
          palette: {
            fills: [
              "#0FE4BD",
              "#C3E4DE",
              "#0BAB8E",
              "#FB2166"],

            strokes: [
              "#0FE4BD",
              "#C3E4DE",
              "#0BAB8E",
              "#FB2166"]
          }
        },
        series: COLUMN_AND_LINE_FOR_OFFSHORE,
        axes: [
          {
            type: "category",
            position: "bottom",
            gridStyle: [
              {
                stroke: undefined
              }
            ]
          },
          {
            // primary y axis
            type: "number",
            position: "left",
            keys: ["offShoreBillable", "offShoreNonBillable", "offShoreUnBillable","offShore"]

          }
          // ,
          // {
          //   // secondary y axis
          //   type: "number",
          //   position: "right",
          //   keys: ["totalHeadCount"],
          //   title: {
          //     text: 'Total headcounts',
          //   },
          // }
        ] as AgCartesianAxisOptions[],
        legend: {
          item: {
            marker: {
              strokeWidth: 0
            }
          }
        }
      };
    }
    else if (this.selectedOptionLocation == '3') {
      this.options = {
        autoSize: true,
        data: headCountData,
        theme: {
          palette: {
            fills: ["#0D0359",
              "#DBE2FF",
              "#012A75",
              "#FB2166"],

            strokes: [
              "#0D0359",
              "#DBE2FF",
              "#012A75",
              "#FB2166"]
          }
        },
        series: COLUMN_AND_LINE_FOR_NEARSHORE,
        axes: [
          {
            type: "category",
            position: "bottom",
            gridStyle: [
              {
                stroke: undefined
              }
            ]
          },
          {
            // primary y axis
            type: "number",
            position: "left",
            keys: ["nearShoreBillable", "nearShoreNonBillable", "nearShoreUnBillable","nearShore"]

          }
          // ,
          // {
          //   // secondary y axis
          //   type: "number",
          //   position: "right",
          //   keys: ["totalHeadCount"],
          //   title: {
          //     text: 'Total headcounts',
          //   },
          // }
        ] as AgCartesianAxisOptions[],
        legend: {
          item: {
            marker: {
              strokeWidth: 0
            }
          }
        }
      };
    }
    // this.options = {
    //   autoSize: true,
    //   data: headCountData,
    //   theme: {
    //     palette: {
    //       fills: ["#0D0359",
    //         "#DBE2FF",
    //         "#0FE4BD",
    //         "#C3E4DE",
    //         "#FB2166",
    //         "#FBBDD0",
    //         "#FB2166"],

    //       strokes: ["#0D0359",
    //         "#DBE2FF",
    //         "#0FE4BD",
    //         "#C3E4DE",
    //         "#FB2166",
    //         "#FBBDD0",
    //         "#FB2166"]
    //     }
    //   },
    //   series: COLUMN_AND_LINE,
    //   axes: [
    //     {
    //       type: "category",
    //       position: "bottom",
    //       gridStyle: [
    //         {
    //           stroke: undefined
    //         }
    //       ]
    //     },
    //     {
    //       // primary y axis
    //       type: "number",
    //       position: "left",
    //       keys: ["onShoreBillable", "onShoreNonBillable", "offShoreBillable", "offShoreNonBillable", "nearShoreBillable", "nearShoreNonBillable", "totalHeadCount"]

    //     }
    //     // ,
    //     // {
    //     //   // secondary y axis
    //     //   type: "number",
    //     //   position: "right",
    //     //   keys: ["totalHeadCount"],
    //     //   title: {
    //     //     text: 'Total headcounts(line)',
    //     //   },
    //     // }
    //   ] as AgCartesianAxisOptions[],
    //   legend: {
    //     item: {
    //       marker: {
    //         strokeWidth: 0
    //       }
    //     }
    //   }
    // };
  }


}

function tooltipRenderer(params: AgCartesianSeriesTooltipRendererParams) {
  const { yValue, xValue } = params;
  return {
    content: `${xValue}: ${yValue}`
  };
}

const OnShoreBillable: AgColumnSeriesOptions = {
  type: "column",
  xKey: "month",
  yKey: "onShoreBillable",
  yName: "Billable",
  label: {
    formatter: (params) => `${parseInt(params.value.toFixed(0))}`,
    color: 'white',
    // placement:'outside',
    fontSize:7,
    fontWeight:'lighter'
  },
  grouped: true,
  strokeWidth: 0,
  stackGroup: "onShore",
  tooltip: {
    renderer: tooltipRenderer
  },
  highlightStyle: {
    item: { fill: "#533EED", stroke: "#533EED" }
  }
};
const OnShoreNonBillable: AgColumnSeriesOptions = {
  type: "column",
  xKey: "month",
  yKey: "onShoreNonBillable",
  yName: "Non Billable",
  label: {
    formatter: (params) => `${parseInt(params.value.toFixed(0))}`,
    color: 'black',
    // placement:'outside',
    fontSize:7,
    fontWeight:'lighter'
  },
  grouped: true,
  strokeWidth: 0,
  stackGroup: "onShore",
  tooltip: {
    renderer: tooltipRenderer
  },
  highlightStyle: {
    item: { fill: "#D4D1ED", stroke: "#D4D1ED" }
  }
};
const OnShoreUnBillable: AgColumnSeriesOptions = {
  type: "column",
  xKey: "month",
  yKey: "onShoreUnBillable",
  yName: "Un Billable",
  label: {
    formatter: (params) => `${parseInt(params.value.toFixed(0))}`,
    color: 'white',
    // placement:'outside',
    fontSize:7,
    fontWeight:'lighter'
  },
  grouped: true,
  strokeWidth: 0,
  stackGroup: "onShore",
  tooltip: {
    renderer: tooltipRenderer
  },
  highlightStyle: {
    item: { fill: "#A49AED", stroke: "#A49AED" }
  }
};
const OffShoreBillable: AgColumnSeriesOptions = {
  type: "column",
  xKey: "month",
  yKey: "offShoreBillable",
  yName: "Billable",
  label: {
    formatter: (params) => `${parseInt(params.value.toFixed(0))}`,
    color: 'white',
    // placement:'outside',
    fontSize:7,
    fontWeight:'lighter'
  },
  grouped: true,
  strokeWidth: 0,
  stackGroup: "offShore",
  tooltip: {
    renderer: tooltipRenderer
  },
  highlightStyle: {
    item: { fill: "#0FE4BD", stroke: "#0FE4BD" }
  }
};
const OffShoreNonBillable: AgColumnSeriesOptions = {
  type: "column",
  xKey: "month",
  yKey: "offShoreNonBillable",
  yName: "Non Billable",
  label: {
    formatter: (params) => `${parseInt(params.value.toFixed(0))}`,
    color: 'black',
    // placement:'outside',
    fontSize:7,
    fontWeight:'lighter'
  },
  grouped: true,
  strokeWidth: 0,
  stackGroup: "offShore",
  tooltip: {
    renderer: tooltipRenderer
  },
  highlightStyle: {
    item: { fill: "#C3E4DE", stroke: "#C3E4DE" }
  }
};
const OffShoreUnBillable: AgColumnSeriesOptions = {
  type: "column",
  xKey: "month",
  yKey: "offShoreUnBillable",
  yName: "Un Billable",
  label: {
    formatter: (params) => `${parseInt(params.value.toFixed(0))}`,
    color: 'white',
    // placement:'outside',
    fontSize:7,
    fontWeight:'lighter'
  },
  grouped: true,
  strokeWidth: 0,
  stackGroup: "offShore",
  tooltip: {
    renderer: tooltipRenderer
  },
  highlightStyle: {
    item: { fill: "#C3E4DE", stroke: "#C3E4DE" }
  }
};
const NearShoreBillable: AgColumnSeriesOptions = {
  type: "column",
  xKey: "month",
  yKey: "nearShoreBillable",
  yName: "Billable",
  label: {
    formatter: (params) => `${parseInt(params.value.toFixed(0))}`,
    color: 'white',
    // placement:'outside',
    fontSize:7,
    fontWeight:'lighter'
  },
  grouped: true,
  strokeWidth: 0,
  stackGroup: "nearShore",
  tooltip: {
    renderer: tooltipRenderer
  },
  highlightStyle: {
    item: { fill: "#0D0359", stroke: "#0D0359" }
  }
};
const NearShoreNonBillable: AgColumnSeriesOptions = {
  type: "column",
  xKey: "month",
  yKey: "nearShoreNonBillable",
  yName: "Non Billable",
  label: {
    formatter: (params) => `${parseInt(params.value.toFixed(0))}`,
    color: 'black',
    // placement:'outside',
    fontSize:7,
    fontWeight:'lighter'
  },
  grouped: true,
  strokeWidth: 0,
  stackGroup: "nearShore",
  tooltip: {
    renderer: tooltipRenderer
  },
  highlightStyle: {
    item: { fill: "#DBE2FF", stroke: "#DBE2FF" }
  }
};
const NearShoreUnBillable: AgColumnSeriesOptions = {
  type: "column",
  xKey: "month",
  yKey: "nearShoreUnBillable",
  yName: "Un Billable",
  label: {
    formatter: (params) => `${parseInt(params.value.toFixed(0))}`,
    color: 'white',
    // placement:'outside',
    fontSize:7,
    fontWeight:'lighter'
  },
  grouped: true,
  strokeWidth: 0,
  stackGroup: "nearShore",
  tooltip: {
    renderer: tooltipRenderer
  },
  highlightStyle: {
    item: { fill: "#DBE2FF", stroke: "#DBE2FF" }
  }
};
const TotalBillable: AgColumnSeriesOptions = {
  type: "column",
  xKey: "month",
  yKey: "totalBillable",
  yName: "Billable",
  label: {
    formatter: (params) => `${parseInt(params.value.toFixed(0))}`,
    color: 'white'
  },
  grouped: true,
  strokeWidth: 0,
  // stackGroup: "nearShore",
  tooltip: {
    renderer: tooltipRenderer
  },
  highlightStyle: {
    item: { fill: "#0D0359", stroke: "#0D0359" }
  }
};
const TotalNonBillable: AgColumnSeriesOptions = {
  type: "column",
  xKey: "month",
  yKey: "totalNonBillable",
  yName: "Non Billable",
  label: {
    formatter: (params) => `${parseInt(params.value.toFixed(0))}`,
    color: 'white'
  },
  grouped: true,
  strokeWidth: 0,
  // stackGroup: "nearShore",
  tooltip: {
    renderer: tooltipRenderer
  },
  highlightStyle: {
    item: { fill: "#DBE2FF", stroke: "#DBE2FF" }
  }
};
const TotalUnBillable: AgColumnSeriesOptions = {
  type: "column",
  xKey: "month",
  yKey: "totalUnBillable",
  yName: "Un Billable",
  label: {
    formatter: (params) => `${parseInt(params.value.toFixed(0))}`,
    color: 'white'
  },
  grouped: true,
  strokeWidth: 0,
  // stackGroup: "nearShore",
  tooltip: {
    renderer: tooltipRenderer
  },
  highlightStyle: {
    item: { fill: "#DBE2FF", stroke: "#DBE2FF" }
  }
};
const Total: AgLineSeriesOptions = {
  type: "line",
  xKey: "month",
  yKey: "totalHeadCount",
  yName: "Total",
  label: {
    formatter: (params) => `${parseInt(params.value.toFixed(0))}`,
    color: 'white'
  },
  strokeWidth: 3,
  marker: {
    enabled: false
  },
  tooltip: {
    renderer: tooltipRenderer
  }
};

const NearShore: AgLineSeriesOptions = {
  type: "line",
  xKey: "month",
  yKey: "nearShore",
  yName: "Total",
  label: {
    formatter: (params) => `${parseInt(params.value.toFixed(0))}`,
    color: 'black',
    fontSize: 7
  },
  strokeWidth: 3,
  marker: {
    enabled: true
  },
  tooltip: {
    renderer: tooltipRenderer
  }
};

const OnShore: AgLineSeriesOptions = {
  type: "line",
  xKey: "month",
  yKey: "onShore",
  yName: "Total",
  label: {
    formatter: (params) => `${parseInt(params.value.toFixed(0))}`,
    color: 'black',
    fontSize: 7
  },
  strokeWidth: 3,
  marker: {
    enabled: true
  },
  tooltip: {
    renderer: tooltipRenderer
  }
};

const OffShore: AgLineSeriesOptions = {
  type: "line",
  xKey: "month",
  yKey: "offShore",
  yName: "Total",
  label: {
    formatter: (params) => `${parseInt(params.value.toFixed(0))}`,
    color: 'black',
    fontSize: 7
  },
  strokeWidth: 3,
  marker: {
    enabled: true
  },
  tooltip: {
    renderer: tooltipRenderer
  }
};

// const COLUMN_AND_LINE: AgCartesianSeriesOptions[] = [
//   { ...OnShoreBillable, type: "column" },
//   { ...OnShoreNonBillable, type: "column" },
//   { ...OffShoreBillable, type: "column" },
//   { ...OffShoreNonBillable, type: "column" },
//   { ...NearShoreBillable, type: "column" },
//   { ...NearShoreNonBillable, type: "column" },
//   { ...Total, type: "line" }
// ];
const COLUMN_AND_LINE_FOR_ONSHORE: AgCartesianSeriesOptions[] = [
  { ...OnShoreBillable, type: "column" },
  { ...OnShoreNonBillable, type: "column" },
  { ...OnShoreUnBillable, type: "column" },
  { ...OnShore, type: "line" }
];
const COLUMN_AND_LINE_FOR_OFFSHORE: AgCartesianSeriesOptions[] = [
  { ...OffShoreBillable, type: "column" },
  { ...OffShoreNonBillable, type: "column" },
  { ...OffShoreUnBillable, type: "column" },
  { ...OffShore, type: "line" }
];
const COLUMN_AND_LINE_FOR_NEARSHORE: AgCartesianSeriesOptions[] = [
  { ...NearShoreBillable, type: "column" },
  { ...NearShoreNonBillable, type: "column" },
  { ...NearShoreUnBillable, type: "column" },
  { ...NearShore, type: "line" }
];
const COLUMN_AND_LINE_FOR_ALL: AgCartesianSeriesOptions[] = [
  { ...TotalBillable, type: "column" },
  { ...TotalNonBillable, type: "column" },
  { ...TotalUnBillable, type: "column" },
  { ...Total, type: "line" }
];

