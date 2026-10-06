import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-utilization-chart',
  templateUrl: './utilization-chart.component.html',
  styleUrls: ['./utilization-chart.component.scss']
})
export class UtilizationChartComponent implements OnInit, OnChanges {

  public options: AgChartOptions;
  @Input() selectedOptionLocation: any;
  @Input() utilizationData: any;
  constructor() {

  }
  ngOnChanges(changes: SimpleChanges) {
    if ('utilizationData' in changes) {
      if (this.utilizationData) {
        this.initializeChartOptions(this.utilizationData);
      }
    }
  }

  initializeChartOptions(utilizationData: any) {
    if (this.selectedOptionLocation == '1') {
      if (utilizationData.utilizationOnShore.length == 1) {
        this.options = {
          data: utilizationData.utilizationOnShore,
          series: [
            {
              type: "line",
              xKey: "monthNames",
              yKey: "utilization",
              yName: "Utilization",
              label: {
                formatter: (params) => `${(Math.round(params.value))}` //`${(params.value.toFixed(2).replace('%', ''))}`
              },
              marker: {
                enabled: true, fill: "#3E2FB2", stroke: "#3E2FB2"
              },
              tooltip: {
                renderer: (params) => {
                  return {
                    content: `${params.xValue}: ${params.yValue}%`
                  };
                }
              },
              stroke: "#3E2FB2",
              highlightStyle: {
                item: { fill: "#3E2FB2", stroke: "#3E2FB2" }
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
                format: "#{.0f} %"
              }
            }
          ]
        };
      }
      else {
        this.options = {
          data: utilizationData.utilizationOnShore,
          series: [
            {
              type: "area",
              xKey: "monthNames",
              yKey: "utilization",
              yName: "Utilization",
              label: {
                formatter: (params) => `${(Math.round(params.value))}`  //`${(params.value.toFixed(2).replace('%', ''))}`
              },
              marker: {
                enabled: true, fill: "#3E2FB2", stroke: "#3E2FB2"
              },
              tooltip: {
                renderer: (params) => {
                  return {
                    content: `${params.xValue}: ${params.yValue}%`
                  };
                }
              },
              fill: "#3E2FB2",
              stroke: "#3E2FB2",
              fillOpacity: 0.2,
              highlightStyle: {
                item: { fill: "#3E2FB2", stroke: "#3E2FB2" }
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
                format: "#{.0f} %"
              }
            }
          ]
        };
      }
    }
    else if (this.selectedOptionLocation == '2') {
      if (utilizationData.utilizationOffShore.length == 1) {
        this.options = {
          data: utilizationData.utilizationOffShore,
          series: [
            {
              type: "line",
              xKey: "monthNames",
              yKey: "utilization",
              yName: "Utilization",
              label: {
                formatter: (params) => `${(Math.round(params.value))}`  //`${(params.value.toFixed(2).replace('%', ''))}`
              },
              marker: {
                enabled: true, fill: "#0BAB8E", stroke: "#0BAB8E"
              },
              tooltip: {
                renderer: (params) => {
                  return {
                    content: `${params.xValue}: ${params.yValue}%`
                  };
                }
              },
              stroke: "#0BAB8E",
              highlightStyle: {
                item: { fill: "#0BAB8E", stroke: "#0BAB8E" }
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
                format: "#{.0f} %"
              }
            }
          ]
        };
      }
      else {
        this.options = {
          data: utilizationData.utilizationOffShore,
          series: [
            {
              type: "area",
              xKey: "monthNames",
              yKey: "utilization",
              yName: "Utilization",
              label: {
                formatter: (params) => `${(Math.round(params.value))}` //`${(params.value.toFixed(2).replace('%', ''))}`
              },
              marker: {
                enabled: true, fill: "#0BAB8E", stroke: "#0BAB8E"
              },
              tooltip: {
                renderer: (params) => {
                  return {
                    content: `${params.xValue}: ${params.yValue}%`
                  };
                }
              },
              fill: "#0BAB8E",
              stroke: "#0BAB8E",
              fillOpacity: 0.2,
              highlightStyle: {
                item: { fill: "#0BAB8E", stroke: "#0BAB8E" }
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
                format: "#{.0f} %"
              }
            }
          ]
        };
      }
    }
    else if (this.selectedOptionLocation == '3') {
      if (utilizationData.utilizationNearShore.length == 1) {
        this.options = {
          data: utilizationData.utilizationNearShore,
          series: [
            {
              type: "line",
              xKey: "monthNames",
              yKey: "utilization",
              yName: "Utilization",
              label: {
                formatter: (params) => `${(Math.round(params.value))}`  //`${(params.value.toFixed(2).replace('%', ''))}`
              },
              marker: {
                enabled: true, fill: "#012A75", stroke: "#012A75"
              },
              tooltip: {
                renderer: (params) => {
                  return {
                    content: `${params.xValue}: ${params.yValue}%`
                  };
                }
              },
              stroke: "#012A75",
              highlightStyle: {
                item: { fill: "#012A75", stroke: "#012A75" }
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
                format: "#{.0f} %"
              }
            }
          ]
        };
      }
      else {
        this.options = {
          data: utilizationData.utilizationNearShore,
          series: [
            {
              type: "area",
              xKey: "monthNames",
              yKey: "utilization",
              yName: "Utilization",
              label: {
                formatter: (params) => `${(Math.round(params.value))}` //`${(params.value.toFixed(2).replace('%', ''))}`
              },
              marker: {
                enabled: true, fill: "#012A75", stroke: "#012A75"
              },
              tooltip: {
                renderer: (params) => {
                  return {
                    content: `${params.xValue}: ${params.yValue}%`
                  };
                }
              },
              fill: "#012A75",
              stroke: "#012A75",
              fillOpacity: 0.2,
              highlightStyle: {
                item: { fill: "#012A75", stroke: "#012A75" }
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
                format: "#{.0f} %"
              }
            }
          ]
        };
      }
    }
  }
  ngOnInit(): void {

  }
}
