import * as fs from "fs";
import {input} from "./input";

interface NodeItem {
  id: string;
  parentId: string;
  timestamps: {
    updated: string;
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
  updated: string;
  position: number;
}

function jsonToCsv(jsonDataArray: FileJson[]) {
  const csvArray: string[] = [];
  let position = 0;

  // Cabeçalho do CSV
  csvArray.push("position,id,title,text,updated");

  // Objeto para mapear parentId com título e texto correspondentes
  const parentMap: { [id: string]: FileNodeResult } = {};

  for (const jsonData of jsonDataArray) {
    jsonData.nodes.forEach((item) => {
      const {
        id,
        parentId,
        title,
        text,
        timestamps: { updated },
      } = item;

      const idToInsert = title || title === "" ? id : parentId;

      if (!parentMap[idToInsert]) {
        position = position + 1;
        parentMap[idToInsert] = { title: "", text: "", updated, position };
      }
      if (title) {
        parentMap[id].title = title;
      }

      if (text) {
        parentMap[parentId].text = text;
      }
    });
  }

  console.log("Convertendo para CSV");

  // Converter o mapeamento em linhas CSV
  for (const parentId in parentMap) {
    const { position, title, text, updated } = parentMap[parentId];
    csvArray.push(
      `${position},${parentId},"${title.toLowerCase()}",${JSON.stringify(
        text.replace(/\n|\r/g, "  ")
      ).trim()},"${updated}"`
    );
  }

  // Converter o array em uma única string com quebras de linha
  const csvData = csvArray.join("\n");

  return { csvData, position };
}

console.log("Iniciando...");

// Converter o JSON em CSV
const { csvData, position } = jsonToCsv(input);

// Escrever o CSV em um arquivo
fs.writeFileSync("output.csv", csvData, "utf-8");

console.log(`Finalizado! Total de itens: ${position}`);
