import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AgBarSeriesOptions, AgCartesianAxisOptions, AgCartesianChartOptions, AgCartesianSeriesOptions, AgCartesianSeriesTooltipRendererParams, AgColumnSeriesOptions } from 'ag-charts-community';


@Component({
  selector: 'app-book-to-bill',
  templateUrl: './book-to-bill.component.html',
  styleUrls: ['./book-to-bill.component.scss']
})
export class BookToBillComponent implements OnChanges {

  @Input() bookToBillData: any;
  public options: AgCartesianChartOptions;
  
  constructor() {
   
   }

   ngOnChanges(changes: SimpleChanges) {
    if ('bookToBillData' in changes) {
      if (this.bookToBillData) {
        this.initializeChartOptions(this.bookToBillData);
      }
    }
  }

  initializeChartOptions(bookToBillData: any) {

    if(bookToBillData && bookToBillData.length){
      this.options = {
        autoSize: true,
        data: bookToBillData,      
        theme: {
          palette: {
            fills: [
              "#533EED",
             ],
  
            strokes: [
              "#533EED",
              ]
          }
        },
        series: COLUMN_BOOK_TO_BILL,
        axes: [
          {
            type: "category",
            position: "bottom",
            // gridStyle: [
            //   {
            //     stroke: undefined
            //   }
            // ]
          },
          {
            // primary y axis
            type: "number",
            position: "left",
            keys: ["revenue"],
            label: {
              formatter: (params) => `${(params.value / 1000000)} M`
            }
  
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
    else{
      this.options = {
        autoSize: true,
        data: [],      
        theme: {
          palette: {
            fills: [
              "#533EED",
             ],
  
            strokes: [
              "#533EED",
              ]
          }
        },
        series: [{}],
     
      };
    }
  
  }
}

function tooltipRenderer(params: AgCartesianSeriesTooltipRendererParams) {
  const { yValue, xValue } = params;
  let dollarValue = yValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return {
    content: `${xValue}: $${dollarValue}`
  };
}
const Data: AgBarSeriesOptions = {
  type: "bar",
  xKey: "monthName",
  yKey: "revenue",
  yName: "Revenue",
  label: {
    formatter: (params) => `${((params.value / 1000000).toFixed(2))}M`,
    color: 'white',
    // placement:'outside',
    fontSize:7,
    fontWeight:'lighter'
  },
  // grouped: false,
  tooltip: {
    renderer: tooltipRenderer,
  },
  highlightStyle: {
    item: { fill: "#533EED", stroke: "#533EED" }
  }
};

const COLUMN_BOOK_TO_BILL: AgCartesianSeriesOptions[] = [
  { ...Data, type: "column" },
];