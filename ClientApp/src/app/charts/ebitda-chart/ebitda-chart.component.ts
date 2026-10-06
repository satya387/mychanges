import { Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { AgCartesianSeriesTooltipRendererParams, AgChartOptions } from 'ag-charts-community';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-ebitda-chart',
  templateUrl: './ebitda-chart.component.html',
  styleUrls: ['./ebitda-chart.component.scss']
})
export class EbitdaChartComponent implements OnChanges {
  public isAddBack: boolean = false;
  
  Addbackcontrol = new FormControl();
  @Output() addBackCheckboxChange: EventEmitter<boolean> = new EventEmitter();
  public optionsDollar: AgChartOptions;
  public optionsPercentage: AgChartOptions;
  @Input() ebitdaData: any;
  @Input() selectedOption: any;
  public percentage_off :number;
  public percentage_org: number;
  public percentage_on: number;
  public percentage_near: number;
  constructor() { 
  
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('ebitdaData' in changes || 'selectedOption' in changes) {
      if (this.ebitdaData) {
        // console.log('ebitdaData',this.ebitdaData);
        this.initializeChartOptions(this.ebitdaData);
      }
    }
  }

  initializeChartOptions(ebitdaData: any) {
    const transformedData = ebitdaData.ebitda.map(item => ({
      ...item,
      ebitda: item.ebitda === 0 ? null : item.ebitda,
      ebitdaActualFX: item.ebitdaActualFX === 0 ? null : item.ebitdaActualFX,
      ebitdaMargin: item.ebitdaMargin === 0 ? null : item.ebitdaMargin,
      ebitdaActualFXMargin: item.ebitdaActualFXMargin === 0 ? null : item.ebitdaActualFXMargin
    }));
  
    // Options for EBITDA($)
    if(this.selectedOption == 1){
      this.optionsDollar = {
        autoSize: true,
        data: transformedData,
        series: [
          {
            xKey: "monthNames",
            yKey: "ebitda",
            yName: "EBITDA($)",
            stroke: "#0D0359",
            label: {
              formatter: (params) => `${((params.value / 1000000).toFixed(2))}`
            },
            marker: {
              fill: "#0D0359",
              stroke: "#0D0359"
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
            yKey: "ebitdaActualFX",
            yName: "Forex - EBITDA($)",
            stroke: "#0FE4BD",
            label: {
              formatter: (params) => `${((params.value / 1000000).toFixed(2))}`
            },
            marker: {
              fill: "#0FE4BD",
              stroke: "#0FE4BD"
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
   
    // Options for EBITDA(%)
    if(this.selectedOption == 2){
      this.optionsPercentage = {
        autoSize: true,
        data: transformedData,
        series: [
          {
            xKey: "monthNames",
            yKey: "ebitdaMargin",
            yName: "EBITDA(%)",
            stroke: "#0D0359",
            label: {
              formatter: (params) =>  `${(Math.round(params.value))}` //`${(params.value.toFixed(2))}%`
            },
            marker: {
              fill: "#0D0359",
              stroke: "#0D0359"
            },
            tooltip: {
              renderer: this.tooltipRendererinPercentage
            },
            highlightStyle: {
              item: { fill: "#0D0359", stroke: "#0D0359" }
            }
          },
          {
            xKey: "monthNames",
            yKey: "ebitdaActualFXMargin",
            yName: "Forex - EBITDA(%)",
            stroke: "#0FE4BD", 
            label: {
              formatter: (params) =>  `${(Math.round(params.value))}` //`${(params.value.toFixed(2))}%`
            },
            marker: {
              fill: "#0FE4BD",
              stroke: "#0FE4BD"
            },
            tooltip: {
              renderer: this.tooltipRendererinPercentage
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
              formatter: (params) => `${params.value} %`
            }
          }
        ]
      };
    }
  }  

  ngOnInit(): void {
  }

  onCheckboxChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.addBackCheckboxChange.emit(isChecked);
  }

  public tooltipRenderer(params: AgCartesianSeriesTooltipRendererParams) {
    const { yValue, xValue } = params;
    let dollarValue = yValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return {
      content: `${xValue}: $${dollarValue}`
    };
  }
  
  public tooltipRendererinPercentage(params: AgCartesianSeriesTooltipRendererParams) {
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
