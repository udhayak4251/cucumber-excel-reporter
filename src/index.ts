import { CucumberJsonType } from "./interface/cucumber-json.interface";
import { convertToJSON, isDirectoryExists, makeDirectory, readFile } from "./utils";
import { utils, writeFile } from "xlsx";

type GenerateExcelReportProps = {
  cucumberJsonPaths: string[];
  cucumberExcelReportOutDir: string;
  fileName: string
};

enum ResultEnum {
  passed = "passed",
  failed = "failed",
  skipped = "skipped",
  pending = "pending",
  undefined = "undefined",
  ambiguous = "ambiguous",
}

const getTotalFailedCount = (uniqueId: string, rows: any[]) => {
  return rows
    .filter((row) => row.internalTrackId == uniqueId)
    .filter((row) => row.status !== ResultEnum.passed)?.length;
};

const getCountOfStatus = (
  uniqueId: string,
  rows: any[],
  status: ResultEnum
) => {
  return rows
    .filter((row) => row.internalTrackId == uniqueId)
    .filter((row) => row.status == status)?.length;
};

const GenerateExcelReport = ({
  cucumberJsonPaths,
  cucumberExcelReportOutDir,
  fileName
}: GenerateExcelReportProps) => {
  let allRows = [];
  for (let i = 0; i < cucumberJsonPaths.length; i++) {
    const cucumberJsonPath = cucumberJsonPaths[i];
    //read data
    const rawFileContent = readFile(cucumberJsonPath);
    //Convert into JSON
    const jsonCucumberData: CucumberJsonType = convertToJSON(rawFileContent);
    let rows: any[] = [];
    //read data from Json
    jsonCucumberData.forEach((report) => {
      report.elements.forEach((element) => {
        element.steps.forEach((step) => {
          rows.push({
            internalTrackId: `${report.id}_${element.id}`,
            featureId: report.id,
            feature: report.name,
            scenarioName: element.name,
            id: element.id,
            tags: element.tags.map((tag) => tag.name)?.toString(),
            status: step.result.status,
          });
        });
      });
    });
    //find unique ids
    const findUniqueScenarioIds = new Set(
      rows.map((data) => data.internalTrackId)
    );

    let scenarioWiseRows: any[] = [];

    findUniqueScenarioIds.forEach((uniqueId: string) => {
      const failedCount = getTotalFailedCount(uniqueId, rows);
      const failed = getCountOfStatus(uniqueId, rows, ResultEnum.failed);
      const undefined = getCountOfStatus(uniqueId, rows, ResultEnum.undefined);

      let scenario = rows.find((scenario) => scenario.internalTrackId == uniqueId);
      if (failedCount == 0) {
        scenario.status = ResultEnum.passed;
      } else if (failed > 0) {
        scenario.status = ResultEnum.failed;
      } else if (undefined > 0) {
        scenario.status = ResultEnum.undefined;
      } else {
        scenario.status = "unknown";
      }

      const { internalTrackId,featureId,id, ...rest } = scenario;
      const scenarioData = { sno: scenarioWiseRows.length + 1, ...rest };
      scenarioWiseRows.push(scenarioData);
    });

    //add set of scenario status to all scenarios set
    allRows.push(...scenarioWiseRows);
  }

  console.log(allRows);
  
  /* generate worksheet and workbook */
  const worksheet = utils.json_to_sheet(allRows);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Cucumber Excel Report");

//   /* fix headers */
  utils.sheet_add_aoa(worksheet, [["S.No", "Feature", "Scenario", "Tags"]], { origin: "A1" });

  if(!isDirectoryExists(cucumberExcelReportOutDir)) {
    makeDirectory(cucumberExcelReportOutDir);
  }
  /* create an XLSX file and try to save to Presidents.xlsx */
  writeFile(workbook, `${cucumberExcelReportOutDir}/${fileName}.xlsx`);
};

export { GenerateExcelReport };
