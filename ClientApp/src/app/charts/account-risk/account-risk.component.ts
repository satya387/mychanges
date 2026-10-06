import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-account-risk',
  templateUrl: './account-risk.component.html',
  styleUrls: ['./account-risk.component.scss']
})
export class AccountRiskComponent implements OnInit {

  public options: AgChartOptions;
  @Input() accRisksData: any;
  acc: any
  constructor() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if ('accRisksData' in changes) {
      if (this.accRisksData) {
        this.initializeChartOptions(this.accRisksData);
      }
    }
  }

  initializeChartOptions(accRisksData: any) {

    this.acc=[{
      impactName: "Critical", impactCount: 0
    },{
      impactName: "High", impactCount: 12
    },{ impactName: "Medium", impactCount: 3},
  { impactName: "Low", impactCount: 0}];
    this.options = {
      data: this.acc
      // accRisksData
      ,
      series: [
        {
          type: "pie",
          calloutLabelKey: "impactName",
          angleKey: "impactCount",
          innerRadiusOffset: -50,
          sectorLabelKey: 'impactCount',
          fills: ["#0D0359", "#0FE4BD", "#533EED", "#FB2166"
          ],
          strokes: ["#0D0359", "#0FE4BD", "#533EED", "#FB2166"
          ],
          highlightStyle: { item: { fill: undefined } },
          sectorLabel: {
            color: 'white',
        }
        }
      ]
    };
  }

  // handlePieSliceClick(params: AgSeriesNodeClickParams<any>) {
  //   const selectedLocation = params.datum.location;
  //   console.log(`Pie slice clicked: ${selectedLocation}`);
  //   this.locationClicked.emit(selectedLocation);
  // }

  ngOnInit(): void {
  }
  hasData(): boolean {
    return this.acc.some(data => data.impactCount > 0);
  }

}
