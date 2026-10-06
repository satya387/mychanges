import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    constructor() { }

    public exportAsExcelFile(
        reportHeading: string,
        reportSubHeading: string,
        headersArray: any[],
        json: any[],
        excelFileName: string,
        sheetName: string
    ) {
        const header = headersArray;
        const data = json;

        /* Create workbook and worksheet */
        const workbook = new Workbook();
        workbook.creator = 'Snippet Coder';
        workbook.lastModifiedBy = 'SnippetCoder';
        workbook.created = new Date();
        workbook.modified = new Date();
        const worksheet = workbook.addWorksheet(sheetName);

        /* Add Header Row */
        const headerRow = worksheet.addRow(header);

        // Cell Style : Fill and Border
        headerRow.eachCell((cell, index) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '0D0357' }, // Dark blue background
            };
            cell.font = { color: { argb: 'FFFFFF' }, bold: true }; // White font color
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            worksheet.getColumn(index).width = header[index - 1].length < 20 ? 20 : header[index - 1].length;
        });

        // Add Data
        data.forEach((element: any) => {
            const eachRow = [];
            for (const key in element) {
                if (element.hasOwnProperty(key)) {
                    eachRow.push(element[key]);
                }
            }
            worksheet.addRow(eachRow);
        });

        // Save Excel File
        workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            fs.saveAs(blob, excelFileName + '.xlsx');
        });
    }
}
