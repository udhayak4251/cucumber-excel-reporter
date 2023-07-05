import { GenerateExcelReport } from "../../src";

GenerateExcelReport({
    cucumberJsonPaths: ["test/data/cucumber_1.json"],
    cucumberExcelReportOutDir: "cucumber_excel_report",
    fileName: 'Cucumber_Excel_report',
    includeSteps:true,
    includeLogs: false,
    includeJsonPath: false,
    additionalProps: [
        {columnName: "Test Case Id", eval: "element.tags.map((tag) => tag.name)?.toString().match(/\\d{6}/g)?.toString()"}
    ]
})