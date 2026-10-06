import { Component, OnInit, SimpleChanges } from '@angular/core';
import {
  AgCartesianAxisOptions,
  AgCartesianChartOptions,
  AgCartesianSeriesOptions,
  AgCartesianSeriesTooltipRendererParams,
  AgColumnSeriesOptions,
  AgLineSeriesOptions,
} from 'ag-charts-community';
import { OpportunityRlsExpenseService } from '../opportunity-rls-expense.service';

@Component({
  selector: 'app-dashboard-charts',
  templateUrl: './dashboard-charts.component.html',
  styleUrls: ['./dashboard-charts.component.scss'],
})
export class DashboardChartsComponent implements OnInit {
  public options1: AgCartesianChartOptions | null = null;
  public options2;
  public options3;
  public options4;
  public options5;
  public options6;
  public options7;
  public options8;
  public options9;
  public options10;
  public options11;
  public options12;
  public resourceTalentMixes: any;
  public clientPartnerChart: any;
  years: number[] = [];
  selectedYear: number = new Date().getFullYear();

  constructor(private oppRlsExpService: OpportunityRlsExpenseService) {
   
  }

  ngOnInit(): void {
    this.initializeYears();
    this.allApipiCalls(this.selectedYear);
  }

  allApipiCalls(selectedYear: number){
     // ARC DB - Dashboard Chart's Section
     this.oppRlsExpService.getSoldOpportunityData(selectedYear).subscribe((data: any) => {
      this.initializeSoldOpportunityChart(data?.data?.barChartDataTCVByMonth);
    });

    this.oppRlsExpService.getTopTenTCVData(selectedYear).subscribe((data: any) => {
      this.initializeTopTenChart(data?.data?.barChartDataTopTenTCV);
    });

    this.oppRlsExpService
      .getTopSkillsByRevenueDemandData(selectedYear)
      .subscribe((data: any) =>
        this.initializeTopSkillByRevenue(
          data?.data?.barChartDataTopSkillsByRevenue
        )
      );

    this.oppRlsExpService.getOpportunityByClientPartnerData(selectedYear).subscribe((data: any) => { });

    this.oppRlsExpService.getAverageDirectMarginData(selectedYear).subscribe((data: any) => this.initializeAverageDirectMarginChart(data?.data?.averageDirectMargins
    ));

    this.oppRlsExpService.getFTEHeadCountData(selectedYear).subscribe((data: any) => {console.log(data);
      const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      const transformedData = data.data.fteHeadCounts.reduce((acc, item) => {
        let monthEntry = acc.find(entry => entry.MonthName === item.monthName);
      
        if (!monthEntry) {
          monthEntry = { MonthName: item.monthName, NearShore: 0, OffShore: 0, OnShore: 0 };
          acc.push(monthEntry);
        }
      
        monthEntry[item.location] += item.resourceCount;
      
        return acc;
      }, [] as { MonthName: string, NearShore: number, OffShore: number, OnShore: number }[]);
      
      transformedData.sort((a, b) => monthOrder.indexOf(a.MonthName) - monthOrder.indexOf(b.MonthName));
      
      this.initializeFteHeadCountsChart(transformedData);
    });

    this.oppRlsExpService.getResourceTalentMixData(selectedYear).subscribe((data: any) => this.resourceTalentMixes = data?.data?.resourceTalentMixes);

    this.oppRlsExpService.getShoreWiseAverageBillRateData(selectedYear).subscribe((data: any) => {const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      const transformedData = data.data.shoreWiseAverageBillRates.reduce((acc, item) => {
        let monthEntry = acc.find(entry => entry.MonthName === item.monthName);
      
        if (!monthEntry) {
          monthEntry = { MonthName: item.monthName, NearShore: 0, OffShore: 0, OnShore: 0, BillRate: item.billRate };
          acc.push(monthEntry);
        }
      
        monthEntry[item.location] += item.resourceCount;
      
        return acc;
      }, [] as { MonthName: string, NearShore: number, OffShore: number, OnShore: number, BillRate: number }[]);
      
      transformedData.sort((a, b) => monthOrder.indexOf(a.MonthName) - monthOrder.indexOf(b.MonthName));
    console.log('averagebill rate', transformedData);
    this.initializeShoreWiseAvgBillRate(transformedData);
    });

    this.oppRlsExpService.getShoreWiseAverageCostData(selectedYear).subscribe((data: any) => {
      const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      const transformedData = data.data.shoreWiseAverageCosts.reduce((acc, item) => {
        let monthEntry = acc.find(entry => entry.MonthName === item.monthName);
      
        if (!monthEntry) {
          monthEntry = { MonthName: item.monthName, NearShore: 0, OffShore: 0, OnShore: 0, Cost: item.cost };
          acc.push(monthEntry);
        }
      
        monthEntry[item.location] += item.resourceCount;
      
        return acc;
      }, [] as { MonthName: string, NearShore: number, OffShore: number, OnShore: number, Cost: number }[]);
      
      transformedData.sort((a, b) => monthOrder.indexOf(a.MonthName) - monthOrder.indexOf(b.MonthName));

      console.log('getShoreWiseAverageCostData', transformedData);
      this.initializeShoreWiseAvgCost(transformedData);
    });

    this.oppRlsExpService.getShoreWiseMarginMixData(selectedYear).subscribe((data: any) => {
      const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      const transformedData = data.data.shoreWiseMarginMixs.reduce((acc, item) => {
        let monthEntry = acc.find(entry => entry.MonthName === item.monthName);
      
        if (!monthEntry) {
          monthEntry = { MonthName: item.monthName, NearShore: 0, OffShore: 0, OnShore: 0};
          acc.push(monthEntry);
        }
      
        monthEntry[item.location] += item.margin;
      
        return acc;
      }, [] as { MonthName: string, NearShore: number, OffShore: number, OnShore: number }[]);
      
      transformedData.sort((a, b) => monthOrder.indexOf(a.MonthName) - monthOrder.indexOf(b.MonthName));
      console.log("getShoreWiseMarginMixData", transformedData);
      this.initializeMarginByShore(transformedData);
    });

    // Erika DB - Dashboard Chart's Section

    this.oppRlsExpService.getOpportunityByTCV(selectedYear).subscribe((data: any) => this.initializeOpportunityCountAndTcvByMonth(data?.data?.opportunityCountAndTCVByMonths));
    this.oppRlsExpService.getOpportunityByCP(selectedYear).subscribe((data: any) => this.clientPartnerChart = data?.data?.opportunityByCPs);
    this.oppRlsExpService.getOpportunityCountMonthWiseByStage(selectedYear).subscribe((data: any) => {
      const transformedData = data?.data?.opportunityCountMonthWiseByStages.reduce((acc, item) => {
        // Find if the month already exists in the accumulator
        let existingMonth = acc.find(entry => entry.MonthName === item.monthName);
    
        if (!existingMonth) {
            // Add a new entry if it doesn't exist
            existingMonth = { MonthName: item.monthName };
            acc.push(existingMonth);
        }
    
        // Add the stage count to the existing entry
        existingMonth[item.stage] = item.opportunityCount;
    
        return acc;
    }, []);
    this.initializeOpenVsCloseOpportunities(transformedData);
    
    });
    this.oppRlsExpService.getTopTenTCVByAccount(selectedYear).subscribe((data: any) => console.log(data));
    this.oppRlsExpService.getOpportunityByStage(selectedYear).subscribe((data: any) => {
      const transformedData = data?.data?.opportunityByStages.map(item => ({
        Stage: item.stage,
        opportunityCount: item.opportunityCount,
        TCV: item.tcv
    }));

    const stageOrder = ['Closed', 'Hold', 'Loses', 'Opened'];
    const sortedData = transformedData.sort(
      (a, b) => stageOrder.indexOf(a.Stage) - stageOrder.indexOf(b.Stage)
    );

    this.initializeOpportunityTcvByStatus(sortedData);
    // this.initializeOpportunityTcvByStatus(transformedData);
    });
  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 2;
    const endYear = currentYear;
    for (let year = startYear; year <= endYear; year++) {
      this.years.push(year);
    }
  }

  onYearChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedYear = parseInt(selectedValue, 10);
    console.log('Selected Year:', this.selectedYear);
    this.allApipiCalls(this.selectedYear);
  }

  initializeOpportunityTcvByStatus(data: any){
    this.options2 = {
      autoSize: true,
      data: data,
      theme: {
        palette: {
          fills: ["#77E4D0", "#FFD485", "#BC194D", "#b3bff0", "#F44336"],
          strokes: ["#77E4D0", "#FFD485", "#BC194D", "#b3bff0", "#F44336"],
        },
      },
      series: [
        {
          type: 'pie',
          angleKey: 'TCV',
          labelKey: 'Stage',
          calloutLabelKey: 'Stage',
          sectorLabelKey: "TCV",
          sectorLabel: {
            color: "white",
            fontWeight: "bold",
            formatter: (params) => `$${(params.sectorLabelValue / 1000000).toFixed(2)}M`,
          },
          tooltip: {
            renderer: ({ datum, labelKey, angleKey }) => ({
              content: `Opportunities: ${datum['opportunityCount']}<br>TCV: $${datum[angleKey]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
            }),
          },
          highlightStyle: {
            item: { fill: undefined },
          },
        },
      ],
      legend: {
        position: 'bottom',
      },
    };

  }

  initializeOpenVsCloseOpportunities(data: any){
    this.options4 = {
      autoSize: true,
      data: data,
      series: [
        {
          type: 'column',
          xKey: 'MonthName',
          yKey: 'Close',
          yName: 'Close Opportunities',
          fillOpacity: 0.5,
          fill: '#77E4D0',
          stroke: '#77E4D0',
          cornerRadius: 10,
          stacked: true, 
          tooltip: {
            renderer: ({ datum, yKey, yName }) => ({
              content: `${yName} in ${datum.MonthName}: ${datum[yKey]}`,
            }),
          },
          highlightStyle: {
            item: { fill: "#77E4D0" }
          }
        },
        {
          type: 'column',
          xKey: 'MonthName',
          yKey: 'Open',
          yName: 'Open Opportunities',
          fill: '#b3bff0',
          stroke: '#b3bff0',
          cornerRadius: 10,
          fillOpacity: 0.5,
          stacked: true, 
          tooltip: {
            renderer: ({ datum, yKey, yName }) => ({
              content: `${yName} in ${datum.MonthName}: ${datum[yKey]}`,
            }),
          },
          highlightStyle: {
            item: { fill: "#b3bff0" }
          }
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Month',
          },
        },
        {
          type: 'number',
          position: 'left',
          title: {
            text: 'Opportunity Count',
          },
        },
      ],
      legend: {
        position: 'bottom',
      },
    };
  }

  initializeOpportunityCountAndTcvByMonth(data: any){
    this.options1 = {
      autoSize: true,
      data: data,
      theme: {
        palette: {
          fills: ["#3E2FB2"],
          strokes: ["#3E2FB2"]
        }
      },
      series: [
        {
          type: 'column',
          xKey: 'monthName',
          yKey: 'tcv',
          yName: 'TCV',
          grouped: false,
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
          xKey: 'monthName',
          yKey: 'opportunityCount',
          yName: 'Opportunity Count',
          tooltip: {
            renderer: ({ xValue, yValue }) => ({
              content: `${xValue}: ${yValue}`,
            }),
          },
          highlightStyle: {
            item: { fill: "#3E2FB2" }
          }
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Month',
          },
        },
        {
          // primary y axis
          type: 'number',
          position: 'left',
          keys: ['tcv'],
          title: {
            text: 'TCV',
          },
          label: {
            formatter: (params) => `$${(params.value / 1000000)}M`,
          },
        },
        {
          // secondary y axis
          type: 'number',
          position: 'right',
          keys: ['opportunityCount'],
          title: {
            text: 'Opportunity Count',
          },
        },
      ] as AgCartesianAxisOptions[],
    };

  }

  // initializeClientPartnerChart(data: any){

  //   this.options3 = {
  //     autoSize: true,
  //     data: data ,
  //     series: [
  //       {
  //         type: 'bar',
  //         xKey: 'clientPartner',
  //         yKey: 'close',
  //         stacked: true,
  //         yName: 'Close',
  //         fill: '#77E4D0',
  //         stroke: '#77E4D0',
  //         tooltip: {
  //           renderer: ({ datum, yName, yKey }) => ({
  //             content: `Opportunities: ${datum[yKey]}`,
  //           }),
  //         },
  //         highlightStyle: {
  //           item: { fill: "#77E4D0" }
  //         }
  //       },
  //       {
  //         type: 'bar',
  //         xKey: 'clientPartner',
  //         yKey: 'hold',
  //         stacked: true,
  //         yName: 'Hold',
  //         fill: '#FFD485',
  //         stroke: '#FFD485',
  //         tooltip: {
  //           renderer: ({ datum, yName, yKey }) => ({
  //             content: `Opportunities: ${datum[yKey]}`,
  //           }),
  //         },
  //         highlightStyle: {
  //           item: { fill: "#FFD485" }
  //         }
  //       },
  //       {
  //         type: 'bar',
  //         xKey: 'clientPartner',
  //         yKey: 'loses',
  //         stacked: true,
  //         yName: 'Loses',
  //         fill: '#BC194D',
  //         stroke: '#BC194D',
  //         tooltip: {
  //           renderer: ({ datum, yName, yKey }) => ({
  //             content: `Opportunities: ${datum[yKey]}`,
  //           }),
  //         },
  //         highlightStyle: {
  //           item: { fill: "#BC194D" }
  //         }
  //       },
  //       {
  //         type: 'bar',
  //         xKey: 'clientPartner',
  //         yKey: 'opened',
  //         stacked: true,
  //         yName: 'Opened',
  //         fill: '#b3bff0',
  //         stroke: '#b3bff0',
  //         tooltip: {
  //           renderer: ({ datum, yName, yKey }) => ({
  //             content: `Opportunities: ${datum[yKey]}`,
  //           }),
  //         },
  //         highlightStyle: {
  //           item: { fill: "#b3bff0" }
  //         }
  //       },
  //     ],
  //     axes: [
  //       {
  //         type: 'number',
  //         position: 'bottom',
  //         title: {
  //           text: 'Opportunity Count',
  //         },
  //       },
  //       {
  //         type: 'category',
  //         position: 'left',
  //         title: {
  //           text: 'Client Partner',
  //         },
  //       },
  //     ],
  //     legend: {
  //       position: 'bottom',
  //     },
  //   };
  // }

  initializeMarginByShore(data: any){
    this.options8 = {
      autoSize: true,
      data: data,     
      series: [
        {
          type: 'line',
          xKey: 'MonthName',
          yKey: 'NearShore',
          yName: 'NearShore',
          fillOpacity: 0.3,
          stroke: "#0D0359",
          tooltip: {
            renderer: tooltipRenderer,
          },
          marker: {
            fill: "#0D0359", stroke: "#0D0359"
          },
          highlightStyle: {
            item: { fill: "#0D0359", stroke: "#0D0359" }
          }
        },
        {
          type: 'line',
          xKey: 'MonthName',
          yKey: 'OffShore',
          yName: 'OffShore',
          stroke: "#ffa500",
          fillOpacity: 0.3,
          marker: {
            fill: "#ffa500", stroke: "#ffa500"
          }
          ,
          tooltip: {
            renderer: tooltipRenderer,
          }, highlightStyle: {
            item: { fill: "#ffa500", stroke: "#ffa500" }
          }
        },
        {
          type: 'line',
          xKey: 'MonthName',
          yKey: 'OnShore',
          yName: 'OnShore',
          stroke: "#0FE4BD",
          fillOpacity: 0.3,
          marker: {
            fill: "#0FE4BD", stroke: "#0FE4BD"
          },
          tooltip: {
            renderer: tooltipRenderer,
          },
          highlightStyle: {
            item: { fill: "#0FE4BD", stroke: "#0FE4BD" }
          }
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Month',
          },
        },
        {
          // primary y axis
          type: 'number',
          position: 'left',
          keys: ['NearShore', 'OnShore', 'OffShore'],
          title: {
            text: 'Shore',
          },
          label: {
            formatter: (params) => `$${(params.value / 1000000).toFixed(0)}M`,
          },
        },
      ] as AgCartesianAxisOptions[],
    };
  }

  initializeShoreWiseAvgBillRate(data: any){
    this.options9 = {
      autoSize: true,
      data: data,
      series: [
        // {
        //   type: 'column',
        //   xKey: 'MonthName',
        //   yKey: 'NearShore',
        //   yName: 'NearShore Resource',
        //   fillOpacity: 0.5,
        //   fill: '#5DADE2',
        //   cornerRadius: 10,

        //   tooltip: {
        //     renderer: ({ datum, yKey, yName }) => ({
        //       content: `${yName} in ${datum.MonthName}: ${datum[yKey]}`,
        //     }),
        //   },
        // },
        // {
        //   type: 'column',
        //   xKey: 'MonthName',
        //   yKey: 'OnShore',
        //   yName: 'OnShore Resource',
        //   fill: '#EC7063',
        //   cornerRadius: 10,
        //   fillOpacity: 0.5,
        //   tooltip: {
        //     renderer: ({ datum, yKey, yName }) => ({
        //       content: `${yName} in ${datum.MonthName}: ${datum[yKey]}`,
        //     }),
        //   },
        // },
        // {
        //   type: 'column',
        //   xKey: 'MonthName',
        //   yKey: 'OffShore',
        //   yName: 'OffShore Resource',
        //   fill: '#a569bd',
        //   cornerRadius: 10,
        //   fillOpacity: 0.5,
        //   tooltip: {
        //     renderer: ({ datum, yKey, yName }) => ({
        //       content: `${yName} in ${datum.MonthName}: ${datum[yKey]}`,
        //     }),
        //   },
        // },
        {
          type: 'line',
          xKey: 'MonthName',
          yKey: 'BillRate',
          yName: 'Bill Rate',
          stroke: "#0D0359",
          marker: {
            fill: "#0D0359", stroke: "#0D0359"
          },
          highlightStyle: {
            item: { fill: "#0D0359", stroke: "#0D0359" }
          },
          tooltip: {
            renderer: tooltipRenderer,
          },
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Month',
          },
        }
        ,
        // {
        //   type: 'number',
        //   position: 'left',
        //   keys: ['OffShore', 'NearShore', 'OnShore'],
        //   title: {
        //     text: 'Opportunity Count',
        //   },
        // },
        {
          type: 'number',
          position: 'left',
          keys: ['BillRate'],
          title: {
            text: 'Bill Rate',
          },
          label: {
            formatter: (params) => `$${(params.value / 1000000).toFixed(0)}M`,
          },
        }
      ],
      legend: {
        position: 'bottom',
      },
    };
  }

  initializeShoreWiseAvgCost(data: any){
    this.options10 = {
      autoSize: true,
      data: data,
      series: [
        // {
        //   type: 'column',
        //   xKey: 'MonthName',
        //   yKey: 'NearShore',
        //   yName: 'NearShore Resource',
        //   fillOpacity: 0.5,
        //   fill: '#5DADE2',
        //   cornerRadius: 10,

        //   tooltip: {
        //     renderer: ({ datum, yKey, yName }) => ({
        //       content: `${yName} in ${datum.MonthName}: ${datum[yKey]}`,
        //     }),
        //   },
        // },
        // {
        //   type: 'column',
        //   xKey: 'MonthName',
        //   yKey: 'OnShore',
        //   yName: 'OnShore Resource',
        //   fill: '#EC7063',
        //   cornerRadius: 10,
        //   fillOpacity: 0.5,
        //   tooltip: {
        //     renderer: ({ datum, yKey, yName }) => ({
        //       content: `${yName} in ${datum.MonthName}: ${datum[yKey]}`,
        //     }),
        //   },
        // },
        // {
        //   type: 'column',
        //   xKey: 'MonthName',
        //   yKey: 'OffShore',
        //   yName: 'OffShore Resource',
        //   fill: '#a569bd',
        //   cornerRadius: 10,
        //   fillOpacity: 0.5,
        //   tooltip: {
        //     renderer: ({ datum, yKey, yName }) => ({
        //       content: `${yName} in ${datum.MonthName}: ${datum[yKey]}`,
        //     }),
        //   },
        // },
        {
          type: 'line',
          xKey: 'MonthName',
          yKey: 'Cost',
          yName: 'Cost',
          stroke: "#0FE4BD",
          fillOpacity: 0.3,
          marker: {
            fill: "#0FE4BD", stroke: "#0FE4BD"
          },
          highlightStyle: {
            item: { fill: "#0FE4BD", stroke: "#0FE4BD" }
          },
          tooltip: {
            renderer: tooltipRenderer,
          },
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Month',
          },
        },
        // {
        //   type: 'number',
        //   position: 'left',
        //   keys: ['OffShore', 'NearShore', 'OnShore'],
        //   title: {
        //     text: 'Opportunity Count',
        //   },
        // },
        {
          type: 'number',
          position: 'left',
          keys: ['Cost'],
          title: {
            text: 'Cost',
          },
          label: {
            formatter: (params) => `$${(params.value / 1000000).toFixed(0)}M`,
          },
        },
      ],
      legend: {
        position: 'bottom',
      },
    };
  }
  

  initializeSoldOpportunityChart(data: any) {
    this.options6 = {
      autoSize: true,
      data: data,
      theme: {
        palette: {
          fills: ['#3E2FB2'],
          strokes: ['#3E2FB2'],
        },
      },
      series: BAR_AND_LINE,
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Month',
          },
        },
        {
          // primary y axis
          type: 'number',
          position: 'left',
          keys: ['tcvInMillons'],
          title: {
            text: 'TCV',
          },
          label: {
            formatter: (params) => `$${(params.value / 1000000).toFixed(0)}M`,
          },
        },
        {
          // secondary y axis
          type: 'number',
          position: 'right',
          keys: ['opportunityCount'],
          title: {
            text: 'Opportunity Count',
          },
        },
      ] as AgCartesianAxisOptions[],
    };
  }

  initializeTopTenChart(data: any) {
    this.options5 = {
      autoSize: true,
      data: data,
      theme: {
        palette: {
          fills: ['#3E2FB2'],
          strokes: ['#3E2FB2'],
        },
      },
      series: [
        {
          type: 'bar',
          xKey: 'clientName',
          yKey: 'tcv',
          yName: 'TCV',
          fillOpacity: 0.5,
          fill: '#3E2FB2',
          cornerRadius: 10,
          label: {
            formatter: (params) => `$${(params.value / 1000000).toFixed(2)}M`,
            color: 'white',
          },
          highlightStyle: {
            item: { fill: '#3E2FB2' },
          },
          tooltip: {
            renderer: tooltipRenderer,
          },
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'left',
          label: {
            rotation: 0,
            formatter: (params) => {
              const MAX_LABEL_LENGTH = 10;
              const accountName = params.value;
              if (accountName.length > MAX_LABEL_LENGTH) {
                return accountName.substring(0, MAX_LABEL_LENGTH) + '...';
              } else {
                return accountName;
              }
            },
          },
        },
        {
          type: 'number',
          position: 'bottom',
          title: {
            text: 'TCV',
          },
          label: {
              formatter: (params) => `$${(params.value / 1000000).toFixed(0)}M`,
          },
        },
      ],
      legend: {
        position: 'bottom',
      },
    };
  }

  initializeTopSkillByRevenue(data: any) {
    this.options12 = {
      autoSize: true,
      data: data,
      series: [
        {
          type: 'column',
          xKey: 'primarySkill',
          yKey: 'revenue',
          yName: 'Revenue',
          grouped: false,
          fillOpacity: 0.3,
          fill: '#77E4D0',
          stroke: '#77E4D0',
          tooltip: {
            renderer: tooltipRenderer,
          },
          highlightStyle: {
            item: { fill: "#77E4D0" }
          }
        }
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Skill',
          },
        },
        {
          // primary y axis
          type: 'number',
          position: 'left',
          keys: ['revenue'],
          title: {
            text: 'Revenue',
          },
          label: {
            formatter: (params) => `$${(params.value / 1000000).toFixed(0)}M`,
          },
        }
      ],
      legend: {
        position: 'bottom',
      },
    };
  }

  initializeAverageDirectMarginChart(data: any) {
    this.options7 = {
      autoSize: true,
      data: data,
      series: [
        {
          type: 'line',
          xKey: 'monthName',
          yKey: 'margin',
          yName: 'Margin',
          fillOpacity: 0.3,
          stroke: "#0D0359",
          tooltip: {
            renderer: tooltipRenderer,
          },
          marker: {
            fill: "#0D0359", stroke: "#0D0359"
          },
          highlightStyle: {
            item: { fill: "#0D0359", stroke: "#0D0359" }
          }
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Month',
          },
        },
        {
          // primary y axis
          type: 'number',
          position: 'left',
          keys: ['margin'],
          title: {
            text: 'Average Margin',
          },
          label: {
            formatter: (params) => `$${(params.value / 1000000).toFixed(0)}M`,
          },
        },
      ] ,
      legend: {
        position: 'bottom',
      },
    };
  }

  initializeFteHeadCountsChart(data: any){
    this.options11 = {
      autoSize: true,
      data: data,
      series: [
        {
          type: 'column',
          xKey: 'MonthName',
          yKey: 'NearShore',
          yName: 'NearShore Resource',
          fillOpacity: 0.5,
          fill: '#A3A3A3',
          stroke: '#A3A3A3',
          cornerRadius: 10,
          stacked: true, 

          tooltip: {
            renderer: ({ datum, yKey, yName }) => ({
              content: `${yName} in ${datum.MonthName}: ${datum[yKey]}`,
            }),
          },
          highlightStyle: {
            item: { fill: "#A3A3A3" }
          }
        },
        {
          type: 'column',
          xKey: 'MonthName',
          yKey: 'OnShore',
          yName: 'OnShore Resource',
          fill: '#533EED',
          stroke: '#533EED',
          cornerRadius: 10,
          fillOpacity: 0.5,
          stacked: true, 
          tooltip: {
            renderer: ({ datum, yKey, yName }) => ({
              content: `${yName} in ${datum.MonthName}: ${datum[yKey]}`,
            }),
          },
          highlightStyle: {
            item: { fill: "#533EED" }
          }
        },
        {
          type: 'column',
          xKey: 'MonthName',
          yKey: 'OffShore',
          yName: 'OffShore Resource',
          fill: '#0FE4BD',
          stroke: '#0FE4BD',
          cornerRadius: 10,
          fillOpacity: 0.5,
          stacked: true, 
          tooltip: {
            renderer: ({ datum, yKey, yName }) => ({
              content: `${yName} in ${datum.MonthName}: ${datum[yKey]}`,
            }),
          },
          highlightStyle: {
            item: { fill: "#0FE4BD" }
          }
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Month',
          },
        },
        {
          type: 'number',
          position: 'left',
          keys: ['OffShore', 'NearShore', 'OnShore'],
          title: {
            text: 'Opportunity Count',
          },
        },
      ],
      legend: {
        position: 'bottom',
      },
    };
  }
}

const TCV: AgColumnSeriesOptions = {
  type: 'column',
  xKey: 'monthName',
  yKey: 'tcvInMillons',
  yName: 'TCV',
  grouped: false,
  fill: '#3E2FB2',
  fillOpacity: 0.3,
  tooltip: {
    renderer: tooltipRenderer,
  },
  highlightStyle: {
    item: { fill: "#A49AED" }
  }
};

const OpportunityCount: AgLineSeriesOptions = {
  type: 'line',
  xKey: 'monthName',
  yKey: 'opportunityCount',
  yName: 'Opportunity Count',
  stroke: '#3E2FB2',
  tooltip: {
    renderer: ({ xValue, yValue }) => ({
      content: `${xValue}: ${yValue}`,
    }),
  },
  highlightStyle: {
    item: { fill: "#3E2FB2" }
  }
};

function tooltipRenderer({
  xValue,
  yValue,
}: AgCartesianSeriesTooltipRendererParams) {
  let dollarValue = yValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return {
    content: `${xValue}: $${dollarValue}`,
  };
}

const BAR_AND_LINE: AgCartesianSeriesOptions[] = [
  { ...TCV, type: 'column' },
  { ...OpportunityCount, type: 'line' },
];
