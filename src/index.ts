import { CucumberJsonType, Element } from "./interface/cucumber-json.interface";
import { convertToJSON, isDirectoryExists, makeDirectory, readFile } from "./utils";
import { utils, writeFile } from "xlsx";
import * as _ from "lodash";

type additionalPropsObject = {
  columnName: string,
  eval: string
}

type GenerateExcelReportProps = {
  cucumberJsonPaths: string[];
  cucumberExcelReportOutDir: string;
  fileName: string,
  includeSteps?: boolean,
  includeLogs?: boolean,
  includeJsonPath?: boolean,
  additionalProps?: additionalPropsObject[]
};

enum ResultEnum {
  passed = "passed",
  failed = "failed",
  skipped = "skipped",
  pending = "pending",
  undefined = "undefined",
  ambiguous = "ambiguous",
}

const getStatus = (element: Element) => {
  const passedCount = element.steps.filter(step => step.result.status == ResultEnum.passed).length;
  const failedCount = element.steps.filter(step => step.result.status == ResultEnum.failed).length;
  const undefinedCount = element.steps.filter(step => step.result.status == ResultEnum.undefined).length;
  if (passedCount == element.steps.length) {
    return ResultEnum.passed
  } else if (failedCount > 0) {
    return ResultEnum.failed
  } else if (undefinedCount > 0) {
    return ResultEnum.undefined
  } else {
    return 'unknown'
  }
}

const GenerateExcelReport = ({
  cucumberJsonPaths,
  cucumberExcelReportOutDir,
  fileName,
  includeSteps,
  includeLogs,
  includeJsonPath,
  additionalProps
}: GenerateExcelReportProps) => {
  let allRows: any = [];
  let additionalColumnNames:string[] = [];
  //adding additional columns for scenario and this step is not needed for steps since one time activity is enough and scenario data will be processed in all case
  additionalProps?.forEach((prop)=> {
    additionalColumnNames.push(prop.columnName);
  });

  for (let i = 0; i < cucumberJsonPaths.length; i++) {
    const cucumberJsonPath = cucumberJsonPaths[i];
    //read data
    const rawFileContent = readFile(cucumberJsonPath);
    //Convert into JSON
    const jsonCucumberData: CucumberJsonType = convertToJSON(rawFileContent);
    //read data from Json
    jsonCucumberData.forEach((report) => {
      report.elements.forEach((element) => {
        //addition props adding process
        let tempProps:any = {};
        additionalProps?.forEach((prop)=> {
          tempProps[prop.columnName] = eval(prop.eval);
        })
        //Scenario Level data processing
        allRows.push({
          internalTrackId: `${report.id}_${element.id}`,
          hooks: "",
          tags: element.tags.map((tag) => tag.name.replace('@', ''))?.toString(),
          featureId: report.id,
          feature: report.name,
          scenarioName: element.name,
          stepName: "",
          id: element.id,
          status: getStatus(element),
          logs: "",
          cucumberJsonPath,
          ...tempProps
        });
        //process steps only if includeSteps is true
        if (includeSteps == true) {
        //addition props adding process
        let tempProps:any = {};
        additionalProps?.forEach((prop)=> {
          tempProps[prop.columnName] = eval(prop.eval);
        })
          //Step Level data processing
          element.steps.forEach((step, index) => {
            if (!(step.keyword.includes('Before') || step.keyword.includes('After'))) {
              allRows.push({
                internalTrackId: `${report.id}_${element.id}`,
                hooks: step.keyword,
                tags: "",
                featureId: "",
                feature: "",
                scenarioName: "",
                stepName: `${step.keyword}${step.name}`,
                id: "",
                status: step.result.status,
                logs: step.result.error_message,
                cucumberJsonPath
              });
            }
          });
        }
      });
    });
  }

  
  //default column names for scenario
  let defaultColumnNamesForScenario = ["sNo", "tags", "feature", "scenarioName", "status", ...additionalColumnNames];
  let defaultColumnNamesForSteps = ["sNo", "tags", "feature", "scenarioName", "stepName", "status", ...additionalColumnNames];

  
  if (includeLogs == true) {
    defaultColumnNamesForSteps.push("logs")
  }

  if (includeJsonPath == true) {
    defaultColumnNamesForScenario.push("cucumberJsonPath")
    defaultColumnNamesForSteps.push("cucumberJsonPath")
  }

  let filteredRows: any[] = [];
  //adding serial number to the rows at scenario level
  if (includeSteps == false) {
    filteredRows = allRows.map((row: any, index: number) => {
      const pickedObject = _.pick(row, defaultColumnNamesForScenario);
      const testCaseNumber = index + 1;
      return { sNo: testCaseNumber, ...pickedObject }
    })
  }
  //adding serial number to the rows at step level
  if (includeSteps == true) {
    filteredRows = allRows.map((row: any, index: number) => {
      const pickedObject = _.pick(row, defaultColumnNamesForSteps);
      const testCaseNumber = index + 1;
      return { sNo: testCaseNumber, ...pickedObject }
    })
  }



  /* generate worksheet and workbook */
  const changeFirstLetterToUppercase = (columnNames: string[]) => {
    return columnNames.map(e => e.substring(0, 1).toUpperCase() + e.substring(1))
  }

  const worksheet = utils.json_to_sheet(filteredRows);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Cucumber Excel Report");
  if (includeSteps) {
    /* fix headers */
    utils.sheet_add_aoa(worksheet, [changeFirstLetterToUppercase(defaultColumnNamesForSteps)], { origin: "A1" });
  } else {
    /* fix headers */
    utils.sheet_add_aoa(worksheet, [changeFirstLetterToUppercase(defaultColumnNamesForScenario)], { origin: "A1" });
  }




  if (!isDirectoryExists(cucumberExcelReportOutDir)) {
    makeDirectory(cucumberExcelReportOutDir);
  }
  /* create an XLSX file and try to save to Presidents.xlsx */
  writeFile(workbook, `${cucumberExcelReportOutDir}/${fileName}.xlsx`);
};

export { GenerateExcelReport };
