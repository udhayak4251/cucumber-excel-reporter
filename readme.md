
# Cucumber Excel Reporter
Generate cucumber excel reports from cucumber json reports


## Library

* XLSX

This project is implemented using NodeJs/Typescript.



## Project Clone

[https://github.com/udhayak4251/cucumber-excel-reporter](https://github.com/udhayak4251/cucumber-excel-reporter)


## Install cucumber-excel-reporter

Install the packages using following command.

```bash
  npm i cucumber-excel-reporter
```


## Usage
## Simple
```bash
import { GenerateExcelReport } from "cucumber-excel-reporter";

GenerateExcelReport({
    cucumberJsonPaths: [
        'reports/cucumber.json'
    ],
    cucumberExcelReportOutDir: "excel_reports",
    fileName: "Cucumber_excel_report"
})
```
## With Steps
```bash
import { GenerateExcelReport } from "cucumber-excel-reporter";

GenerateExcelReport({
    cucumberJsonPaths: [
        'reports/cucumber.json'
    ],
    cucumberExcelReportOutDir: "excel_reports",
    fileName: "Cucumber_excel_report",
    includeSteps:true
})
```
## With Logs
```bash
import { GenerateExcelReport } from "cucumber-excel-reporter";

GenerateExcelReport({
    cucumberJsonPaths: [
        'reports/cucumber.json'
    ],
    cucumberExcelReportOutDir: "excel_reports",
    fileName: "Cucumber_excel_report",
    includeSteps:true,
    includeLogs: true
})
```
## With include Json path
```bash
import { GenerateExcelReport } from "cucumber-excel-reporter";

GenerateExcelReport({
    cucumberJsonPaths: ["test/data/cucumber_1.json"],
    cucumberExcelReportOutDir: "cucumber_excel_report",
    fileName: 'Cucumber_Excel_report',
    includeSteps:true,
    includeLogs: true,
    includeJsonPath: true
})
```


## Screenshots without steps
![Cucumber Excel Report](/examples/cucumberexcelreport.png?raw=true "Cucumber Excel Report")

## Screenshots with steps
![Cucumber Excel Report with steps](/examples/cucumberexcelreportwithsteps.png?raw=true "Cucumber Excel Report with steps")

## Screenshots with logs
![Cucumber Excel Report with logs](/examples/cucumberexcelreportwithlogs.png?raw=true "Cucumber Excel Report with logs")

## Screenshots with included Json path
![Cucumber Excel Report with included Json path](/examples/cucumberexcelreportwithsource.png?raw=true "Cucumber Excel Report with included Json path")

## Feedback/Support

For support and Feedback, email udhayak4251@gmail.com
