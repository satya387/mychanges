import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AgChartOptions, AgSeriesNodeClickParams } from 'ag-charts-community';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnChanges {

  public options: AgChartOptions;
  @Output() locationClicked = new EventEmitter<string>();
  @Input() headCountPie: any;
  constructor() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if ('headCountPie' in changes) {
      if (this.headCountPie) {
        this.initializeChartOptions(this.headCountPie);
      }
    }
  }

  initializeChartOptions(headCountPie: any) {
    this.options = {
      data: headCountPie
      // [
      //   { location: "On Shore", headCount: 56.9 },
      //   { location: "Off Shore", headCount: 22.5 },
      //   { location: "Near Shore", headCount: 6.8 }
      // ]
      ,
      series: [
        {
          type: "pie",
          calloutLabelKey: "location",
          angleKey: "headCount",
          innerRadiusOffset: -50,
          sectorLabelKey: 'headCount',
          fills: ["#0D0359", "#0FE4BD", "#533EED"
          ],
          strokes: ["#0D0359", "#0FE4BD", "#533EED"
          ],
          highlightStyle: { item: { fill: undefined } },
          sectorLabel: {
            color: 'white',
        },
          listeners: {
            nodeClick: (params) => this.handlePieSliceClick(params)
          }
        }
      ]
    };
  }

  handlePieSliceClick(params: AgSeriesNodeClickParams<any>) {
    const selectedLocation = params.datum.location;
    console.log(`Pie slice clicked: ${selectedLocation}`);
    this.locationClicked.emit(selectedLocation);
  }

  ngOnInit(): void {
  }

}
