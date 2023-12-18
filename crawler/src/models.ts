import fs from "fs";
import { Browser, Page } from "puppeteer";

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

export const OpenPage = async (browser: Browser, url: string) => {
  const pageContent = await browser.newPage();
  await pageContent.goto(url);
  await pageContent.setViewport({width: 1530, height: 1024});
  return pageContent;
}

export const clickInButtonInList = async (pageContent: Page, selector: string) => {
  await pageContent.evaluate((selector) => {
    const elementos:any = document.querySelectorAll(selector);
    if (elementos[4]?.tagName === 'BUTTON') {
      elementos[4].click();
    }
  }, selector);
}

export const GetInnerHTML = async (pageContent: Page, selector: string) => {
  return await pageContent.evaluate((selector) => {
    const elements = document.querySelector(selector);
    return elements ? elements.innerHTML : null;
  }, selector);
}

export const GetInnerText = async (pageContent: Page, selector: string) => {
  return await pageContent.evaluate((selector) => {
    const elements: any = document.querySelector(selector);
    return elements ? elements.innerText : null;
  }, selector);
}

export const AddTextInInput = async (pageContent: Page, selector: string, value: string) => {
  return await pageContent.evaluate((select) => {
    document.querySelector<any>(select).value = value;
  }, selector);
}

export const AddClick = async (pageContent: Page, selector: string) => {
  await pageContent.evaluate((select) => {
    document.querySelector<any>(select).click();
  }, selector);
}

export const GetTextInList = async (pageContent: Page, selector: string) => {
  return await pageContent.evaluate((select) => {
    console.log('Entrou')
    const elements = document.querySelectorAll(select);
    console.log('passou')
    const listInnerHTML: Array<{
      classe: string,
      content: string
    }> = [];
    console.log('All elements: ', elements)

    elements.forEach((element: any) => {
      console.log('element: ', element)
      listInnerHTML.push({
        classe: element.className,
        content: element.innerText
      })
    });
    return listInnerHTML;
  }, selector);
};

export const GetHTMLInList = async (pageContent: Page, selector: string) => {
  return await pageContent.evaluate((select) => {
    const elements = document.querySelectorAll(select);
    const listInnerHTML: Array<{
      classe: string,
      content: string
    }> = [];
    elements.forEach((element: any) => {
      listInnerHTML.push({
        classe: element.classList.value,
        content: element.innerHTML
      })
    });
    return listInnerHTML;
  }, selector);
};
