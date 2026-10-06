import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AgCartesianAxisOptions, AgCartesianSeriesOptions, AgCartesianSeriesTooltipRendererParams, AgColumnSeriesOptions, AgLineSeriesOptions } from 'ag-charts-community';
import { TreeNode } from 'primeng/api';

@Component({
    selector: 'app-sga-data-table',
    templateUrl: './sga-data-table.component.html',
    styleUrls: ['./sga-data-table.component.scss']
})
export class SgaDataTableComponent implements OnInit {

  @Input() _employeeData: any;
  @Input() _groupData: any;
  @Input() _overAllData: any;
  @Input() dataForGraph: any;
  @Input() overAllDataForGraph: any;
  @Input() dataGroupLevelForGraph: any;
  @Input() quarterlyChecked: any;
  showData: boolean;
  employeeData: TreeNode[];
  groupData: TreeNode[];
  overAllData: TreeNode[];
  public options1;
  public options2;
  public options3;
  constructor() { }


    ngOnChanges(changes: SimpleChanges) {

        if ('_employeeData' in changes) {

            if (this._employeeData != null) {
                this.showData = true;
                this.employeeData = this._employeeData;
            }
            else {
                this.showData = false;
                this.employeeData = null;
            }

        }

        if ('_groupData' in changes) {

            if (this._groupData != null) {
                this.showData = true;
                this.groupData = this._groupData;
            }
            else {
                this.showData = false;
                this.groupData = null;
            }

        }

        if ('_overAllData' in changes) {

            if (this._overAllData != null) {
                this.showData = true;
                this.overAllData = this._overAllData;
            }
            else {
                this.showData = false;
                this.overAllData = null;
            }

        }

        if ('dataForGraph' in changes) {
            this.initializeExpenseSalaryHeadcountChartEnabling(this.dataForGraph);
        }

        if ('dataGroupLevelForGraph' in changes) {
            this.initializeExpenseSalaryHeadcountChartGrowth(this.dataGroupLevelForGraph);
        }

        if ('overAllDataForGraph' in changes) {
            this.initializeExpenseHeadcountChart(this.overAllDataForGraph);
        }
    }
    ngOnInit(): void {
    }


  initializeExpenseSalaryHeadcountChartEnabling(dataForGraph: any){
    this.options1 = {
      autoSize: true,
      data: dataForGraph,
      title: {
        text: "Function Level",
      },
      theme: {
        palette: {
          fills: ["#3E2FB2", "#FFD485", "#0BAB8E"],
          strokes: ["#3E2FB2", "#FFD485", "#0BAB8E"]
        }
      },
      series: [
        {
          type: 'column',
          xKey: 'qtr',
          yKey: 'salary',
          yName: 'Salary',
          grouped: true,
          fillOpacity: 0.3,
          tooltip: {
            renderer: tooltipRenderer,
          },
          highlightStyle: {
            item: { fill: "#A49AED",
              strokeWidth: 2
             }
          },
        },
        {
          type: 'column',
          xKey: 'qtr',
          yKey: 'expense',
          yName: 'Expense',
          grouped: true,
          fillOpacity: 0.5,
          tooltip: {
            renderer: tooltipRenderer,
          },
          highlightStyle: {
            item: { fill: "#FFD485" }
          }
        },
        {
          type: 'line',
          xKey: 'qtr',
          yKey: 'headCount',
          yName: 'Head Count',
          tooltip: {
            renderer: ({ xValue, yValue }) => ({
              content: `${xValue}: ${yValue}`,
            }),
          },
          highlightStyle: {
            item: { fill: "#0BAB8E" }
          }
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          // title: {
          //   text: 'Period',
          // },
          label: {
            formatter: (params) => `${params.value}`
          }
        },
        {
          // primary y axis
          type: 'number',
          position: 'left',
          keys: ['salary', 'expense'],
          // title: {
          //   text: 'TCV',
          // },
          label: {
            formatter: (params) => `$${(params.value / 1000000)}M`,
          },
        },
        {
          // secondary y axis
          type: 'number',
          position: 'right',
          keys: ['headCount'],
          title: {
            text: 'Head Count',
          },
        },
      ] as AgCartesianAxisOptions[],
    };
  }

  initializeExpenseSalaryHeadcountChartGrowth(dataGroupLevelForGraph: any){
    this.options2 = {
      autoSize: true,
      data: dataGroupLevelForGraph,
      title: {
        text: "Function Group Level",
      },
      theme: {
        palette: {
          fills: ["#3E2FB2", "#FFD485", "#0BAB8E"],
          strokes: ["#3E2FB2", "#FFD485", "#0BAB8E"]
        }
      },
      series: [
        {
          type: 'column',
          xKey: 'qtr',
          yKey: 'salary',
          yName: 'Salary',
          grouped: true,
          fillOpacity: 0.3,
          tooltip: {
            renderer: tooltipRenderer,
          },
          highlightStyle: {
            item: { fill: "#A49AED" }
          }
        },
        {
          type: 'column',
          xKey: 'qtr',
          yKey: 'expense',
          yName: 'Expense',
          grouped: true,
          fillOpacity: 0.5,
          tooltip: {
            renderer: tooltipRenderer,
          },
          highlightStyle: {
            item: { fill: "#FFD485" }
          }
        },
        {
          type: 'line',
          xKey: 'qtr',
          yKey: 'headCount',
          yName: 'Head Count',
          tooltip: {
            renderer: ({ xValue, yValue }) => ({
              content: `${xValue}: ${yValue}`,
            }),
          },
          highlightStyle: {
            item: { fill: "#0BAB8E" }
          }
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          // title: {
          //   text: 'Period',
          // },
          label: {
            formatter: (params) => `${params.value}`
          }
        },
        {
          // primary y axis
          type: 'number',
          position: 'left',
          keys: ['salary', 'expense'],
          // title: {
          //   text: 'TCV',
          // },
          label: {
            formatter: (params) => `$${(params.value / 1000000)}M`,
          },
        },
        {
          // secondary y axis
          type: 'number',
          position: 'right',
          keys: ['headCount'],
          title: {
            text: 'Head Count',
          },
        },
      ] as AgCartesianAxisOptions[],
    };
  }

  initializeExpenseHeadcountChart(overAllDataForGraph: any){
    this.options3 = {
      autoSize: true,
      data: overAllDataForGraph,
      title: {
        text: "Over All Level",
      },
      theme: {
        palette: {
          fills: ["#3E2FB2", "#0BAB8E"],
          strokes: ["#3E2FB2", "#0BAB8E"]
        }
      },
      series: [
        {
          type: 'column',
          xKey: 'qtr',
          yKey: 'revenue',
          yName: 'Revenue',
          grouped: true,
          fillOpacity: 0.3,
          tooltip: {
            renderer: tooltipRenderer,
          },
          highlightStyle: {
            item: { fill: "#A49AED" }
          }
        },
        {
          type: 'line',
          xKey: 'qtr',
          yKey: 'headCount',
          yName: 'Head Count',
          tooltip: {
            renderer: ({ xValue, yValue }) => ({
              content: `${xValue}: ${yValue}`,
            }),
          },
          highlightStyle: {
            item: { fill: "#0BAB8E" }
          }
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          // title: {
          //   text: 'Period',
          // },
          label: {
            formatter: (params) => `${params.value}`
          }
        },
        {
          // primary y axis
          type: 'number',
          position: 'left',
          keys: ['revenue'],
          // title: {
          //   text: 'TCV',
          // },
          label: {
            formatter: (params) => `$${(params.value / 1000000)}M`,
          },
        },
        {
          // secondary y axis
          type: 'number',
          position: 'right',
          keys: ['headCount'],
          title: {
            text: 'Head Count',
          },
        },
      ] as AgCartesianAxisOptions[],
    };
  }

}

function tooltipRenderer({
    xValue,
    yValue,
}: AgCartesianSeriesTooltipRendererParams) {
  let dollarValue = yValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return {
    content: `${xValue}: $${dollarValue}`,
  };
}







