import * as fs from "fs";
import { input } from "./input";

interface NodeItem {
  id: string;
  parentId: string;
  timestamps: {
    created: string;
  };
  title?: string;
  text?: string;
}

interface FileJson {
  nodes: NodeItem[];
}

interface FileNodeResult {
  title: string;
  text: string;
  created: string;
  position: number;
}

function jsonToCsv(jsonDataArray: FileJson[]) {
  const csvArray: string[] = [];
  let position = 0;

  // CSV header
  csvArray.push("position,id,title,text,created");

  // Object to map titles and descriptions by parentId
  const parentMap: { [id: string]: FileNodeResult } = {};

  for (const jsonData of jsonDataArray) {
    jsonData.nodes.forEach((item) => {
      const {
        id,
        parentId,
        title,
        text,
        timestamps: { created },
      } = item;

      const idToInsert = title || title === "" ? id : parentId;

      if (!parentMap[idToInsert]) {
        position = position + 1;
        parentMap[idToInsert] = { title: "", text: "", created, position };
      }
      if (title) {
        parentMap[id].title = title;
      }

      if (text) {
        parentMap[parentId].text = text;
      }
    });
  }

  console.log("Converting to CSV");

  // Convert map to csv rows
  for (const parentId in parentMap) {
    const { position, title, text, created } = parentMap[parentId];
    csvArray.push(
      `${position},${parentId},"${title.toLowerCase()}",${JSON.stringify(
        text.replace(/\n|\r/g, "  ").replace(/"/g, "")
      ).trim()},"${created}"`
    );
  }

  const csvData = csvArray.join("\n");

  return { csvData, position };
}

console.log("Starting...");

// Convert JSON to CSV
const { csvData, position } = jsonToCsv(input);

// Write CSV in a file
fs.writeFileSync("output.csv", csvData, "utf-8");

console.log(`Success! Total itens: ${position}`);
