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

const readFile = (filePath, filename) => {
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


const loadAllPosts = (flexSearch) => {
  for (idx in keysOfPosts) {
    if (keysOfPosts[idx] == '404' || keysOfPosts[idx] == 'contact') {
      continue;
    }
    const fileInfo = readFile('./posts/'+keysOfPosts[idx]+'.html');
    const htmlDoc = parseHTMLString(fileInfo);
    const htmlSearchString = getSearchStringForDoc(htmlDoc);

    // add loaded version of website to data dictionary in data.js
    htmlOfPosts[keysOfPosts[idx]] = fileInfo;
    dataOfPosts[keysOfPosts[idx]] = htmlSearchString;
    flexSearch.add(keysOfPosts[idx], htmlSearchString);
  }
};