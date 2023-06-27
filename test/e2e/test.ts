import { GenerateExcelReport } from "../../src";

GenerateExcelReport({
    cucumberJsonPaths: ["test/data/cucumber_1.json"],
    cucumberExcelReportOutDir: "cucumber_excel_report",
    fileName: 'Cucumber_Excel_report',
    includeSteps:true
})