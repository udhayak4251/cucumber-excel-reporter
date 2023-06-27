
# Cucumber Excel Reporter
Generate cucumber excel reports from cucumber json reports


## Library

* XLSX

This project is implemented using NodeJs/Typescript.



## Project Clone

[https://github.com/udhayak4251/cucumber-excel-reporter](https://github.com/udhayak4251/cucumber-excel-reporter)


## Install cucumber-excel-reporter

Install all the packages of this project by following command.

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

## Screenshots without steps
![Alt text](/examples/cucumberexcelreport.png?raw=true "Cucumber Excel Report")

## Screenshots with steps
![Alt text](/examples/cucumberexcelreportwithsteps.png?raw=true "Cucumber Excel Report with steps")

## Feedback/Support

For support and Feedback, email udhayak4251@gmail.com
