const parseHTMLString = (() => {
  const parser = new DOMParser();
  return str => parser.parseFromString(str, "text/html");
})();

const getSearchStringForDoc = doc => {
  return [
    doc.title,
    doc.body.innerText
  ].map(str => str.trim())
   .join(" ");
};

// const stringMatchesQuery = (str, query) => {
//   str = str.toLowerCase();
//   query = query.toLowerCase();
  
//   return query
//     .split(/\W+/)
//     .some(q => str.includes(q))
// };

const htmlStringMatchesQuery = (str, query) => {
  const htmlDoc = parseHTMLString(str);
  const htmlSearchString = getSearchStringForDoc(htmlDoc);
};

const readHTMLFile = (filePath, filename) => {
  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.open("GET",filePath,false);
  xmlhttp.send();
  xmlDoc=xmlhttp.responseText;
  return xmlDoc;
};

function readFile(file) {
  return new Promise((resolve, reject) => {
    let fr = new FileReader();
    fr.onload = x=> resolve(fr.result);
    fr.readAsText(file);
})}

const loadAllPosts = (flexSearch) => {
  for (idx in keysOfPosts) {
    if (keysOfPosts[idx] == '404' || keysOfPosts[idx] == 'contact') {
      continue;
    }

    print(keysOfPosts[idx])

    // const fileInfo = readHTMLFile('./posts/'+keysOfPosts[idx]+'.html');
    const fileInfo = readFile('./posts/'+keysOfPosts[idx]+'.md'); // TODO ---- need to implement readMDFile-----

    var converter = new showdown.Converter();
    const htmlOfMd = converter.makeHtml(fileInfo);
    
    // convert md to html for search
    const htmlDoc = parseHTMLString(htmlOfMd);
    const htmlSearchString = getSearchStringForDoc(htmlDoc);

    // add loaded version of website to data dictionary in data.js
    htmlOfPosts[keysOfPosts[idx]] = htmlDoc;
    dataOfPosts[keysOfPosts[idx]] = htmlSearchString;
    flexSearch.add(keysOfPosts[idx], htmlSearchString);
  }
};