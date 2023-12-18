import fs from "fs";

export const saveInFile = (body: any, router: string, json = true) => {
    fs.writeFile(`${__dirname}${router}`,
    json ? JSON.stringify(body, null, 2) : body, 
    (err) => {
      if (err) {
        console.log(err)
      };
    });
}

export function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};
