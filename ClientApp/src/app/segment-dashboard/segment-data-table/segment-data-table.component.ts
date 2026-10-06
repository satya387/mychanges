import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
//import { AgCartesianAxisOptions, AgCartesianSeriesOptions, AgCartesianSeriesTooltipRendererParams, AgColumnSeriesOptions, AgLineSeriesOptions } from 'ag-charts-community';
import { TreeNode } from 'primeng/api';

@Component({
    selector: 'app-segment-data-table',
    templateUrl: './segment-data-table.component.html',
    styleUrls: ['./segment-data-table.component.scss']
})
export class SegmentDataTableComponent implements OnInit {

//   @Input() _employeeData: any;
//   @Input() _groupData: any;
  @Input() _treeData: any;
  @Input() _pivotColumns: any;
  @Input() _buSegments: any;
  @Input() _buGroups: any;
//   @Input() dataForGraph: any;
//   @Input() overAllDataForGraph: any;
//   @Input() dataGroupLevelForGraph: any;
  @Input() quarterlyChecked: any;
//   showData: boolean;
//   employeeData: TreeNode[];
//   groupData: TreeNode[];
treeData: TreeNode[] = [];
pivotColumns: any[] = [];
buGroups: any[] = [];
buSegments: any[] = [];
//   public options1;
//   public options2;
//   public options3;
  constructor() { }


    ngOnChanges(changes: SimpleChanges) {

        if ('_treeData' in changes) {

            if (this._treeData != null) {
                // this.showData = true;
                this.treeData = this._treeData;
                this.setParentReferences(this.treeData); // fix parent links
                console.log(this.treeData);
            }
            else {
                // this.showData = false;
                this.treeData = null;
            }
            if (this._pivotColumns != null) {
                // this.showData = true;
                this.pivotColumns = this._pivotColumns;
                console.log(this.pivotColumns);
            }
            else {
                // this.showData = false;
                this.pivotColumns = null;
            }
            if (this._buSegments != null) {
              // this.showData = true;
              this.buSegments = this._buSegments;
              console.log(this.buSegments);
          }
          else {
              // this.showData = false;
              this.buSegments = null;
          }
            if (this._buGroups != null) {
                // this.showData = true;
                this.buGroups = this._buGroups;
                console.log(this.buGroups);
            }
            else {
                // this.showData = false;
                this.buGroups = null;
            }
        }
    }
    ngOnInit(): void {
    }
    getBUColSpan(bu: any): number {
      return this.pivotColumns.filter(c => c.field.startsWith(`${bu.name}~`)).length;
    }
  
    getSegmentColSpan(segment: any): number {
      return this.pivotColumns.filter(c => c.field.includes(`~${segment.name}~`)).length;
    }

    // getCategory(node: any): string {
    //   return node?.data?.category || node?.parent?.data?.category || node?.parent?.parent?.data?.category || '';
    // }
    
    // getCustomer(node: any): string {
    //   return node?.data?.customer || node?.parent?.data?.customer || node?.parent?.parent?.data?.customer || '';
    // }
    
    // getProject(node: any): string {
    //   return node?.data?.project || '';
    // }

    /** Walk up to the nearest ancestor that has `.data.category` */
getCategory(r: any): string {
  let node = r.node;
  while (node && !node.data?.category && node.parent) {
    node = node.parent;
  }
  return node.data?.category ?? '';
}

/** Walk up to the nearest ancestor that has `.data.customer` */
getCustomer(r: any): string {
  let node = r.node;
  while (node && !node.data?.customer && node.parent) {
    node = node.parent;
  }
  return node.data?.customer ?? '';
}

/** Only the leaf (level 2) has `.data.project` */
getProject(r: any): string {
  return r.node.data?.project ?? '';
}
getBUValue(rowNode: any, field: string): any {
  const level = rowNode?.level;

  if (level === 2) {
    return rowNode?.node?.data?.[field] ?? '';
  }

  // Go down to the leaf level
  const child = rowNode?.node?.children?.[0];
  const grandchild = child?.children?.[0];

  return grandchild?.data?.[field] ?? '';
}
getOrgTotal(rowNode: any): number | string {
  // Drill down to project node
  const customerNode = rowNode?.node?.children?.[0];
  const projectNode = customerNode?.children?.[0];

  return projectNode?.data?.orgTotal ?? '';
}

    setParentReferences(nodes: any[], parent: any = null): void {
      for (const node of nodes) {
        node.parent = parent;
        if (node.children && node.children.length) {
          this.setParentReferences(node.children, node);
        }
      }
    }
}







