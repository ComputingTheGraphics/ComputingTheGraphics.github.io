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
  if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
  } else {// code for IE6, IE5
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
  var fs = require('fs');
  var allPosts = fs.readdirSync('/posts/');

  for (post in allPosts) {
    postName = post.substring(0, post.size()-3) // remove .md
    print('postName is '+postName);
    if (postName == '404') {
      continue;
    }

    print(post);

    const fileInfo = readHTMLFile(
        'http://www.computingthegraphics.com/posts/' + postName + '.html');
    const htmlDoc = parseHTMLString(fileInfo);
    const htmlSearchString = getSearchStringForDoc(htmlDoc);

    flexSearch.add(postName, htmlSearchString);
  }
};
