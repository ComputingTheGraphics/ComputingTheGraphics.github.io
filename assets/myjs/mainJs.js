function goToPage(postName) {
	console.log(postName)

	index = keysOfPosts.indexOf(postName.toLowerCase());
	mediumIndex = mediumPosts.indexOf(postName.toLowerCase());
	found = index >= 0;
	suburl = found ? keysOfPosts[index] : "404";
	if !(index >= 0) {
		index = mediumPosts.indexOf(postName.toLowerCase());
	}
	
	

	if (!found) {

	}

	window.location.href = "https://www.computingthegraphics.com/?post="+suburl;

	hideSearch(true);
}

function getDocHeight(doc) {
    doc = doc || document;
    // stackoverflow.com/questions/1145850/
    var body = doc.body, html = doc.documentElement;
    var height = Math.max( body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight );
    return height;
}

function setIframeHeight(id) {
    var ifrm = document.getElementById(id);
    var doc = ifrm.contentDocument? ifrm.contentDocument: 
        ifrm.contentWindow.document;
    ifrm.style.visibility = 'hidden';
    ifrm.style.height = "500px"; // reset to minimal height ...
    // IE opt. for bing/msn needs a bit added or scrollbar appears
    ifrm.style.height = getDocHeight( doc ) + 4 + "px";
    ifrm.style.visibility = 'visible';
}

function urlUpdated() {
	var post = getValueFromUrl('post');
	if (post == undefined) {
		post = 'welcome';
	}

	var postContent = document.getElementById("text-post-content");
	console.log(postContent)

	postContent.innerHTML = htmlOfPosts[post];

	console.log(postContent.innerHTML);

	searchVal = getValueFromUrl('searchtext');

	if (post == "404") {
		setSearch("", searching=false);
		hideSearch(false);
	} else if (searchVal != undefined) {
		setSearch(searchVal, searching=true);
		hideSearch(false);
	}
}

function getValueFromUrl(key) {
	var urlString = window.location.href; 
	var url = new URL(urlString);
	var value = url.searchParams.get(key);
	return value
}

function hideSearch(hiding) {
	if (hiding) {
		document.webpagesearchbar.style.display = "none";
	} else {
		document.webpagesearchbar.style.display = "block";
	}
}

function setSearch(value, searching) {
	document.webpagesearchbar.searchtext.placeholder = value;
	if (searching) {
		search(value);
	}
}

// https://npm.runkit.com/flexsearch?q=#contextual_enable
var flexsearch = new FlexSearch({
	encode: "icase",
	suggest: true,
    tokenize: "full",
});
function setupSearch() {
	loadAllPosts(flexsearch);
	console.log('setup search');
	console.log('setup search runs everytime the page is reloaded - is this okay?');
}
setupSearch();


function boldString(str, substr) {
  var strRegExp = new RegExp(substr, 'g');
  return str.replace(strRegExp, '<b>'+substr+'</b>');
}

function search(value) {
	var linksText = "";
	var result = flexsearch.search(value);
	var letter_buffer = 40; // want 5 letter on either side of searched for value

	var adding_s = (result.length == 1) ? "" : "s";
	var linksText = "Found " + result.length + " relevant post" + adding_s + ":<br/><br/>";
	for (idx in result) {
		var resultPost = result[idx];

		var postText = dataOfPosts[resultPost];

		var resultIdx = postText.indexOf(value);

		var valueBegIdx = resultIdx;
		var valueEndIdx = resultIdx + value.length;

		// finds subsection around the term
		var minIdx = valueBegIdx - letter_buffer;
		var maxIdx = valueEndIdx + letter_buffer + 1;
		minIdx = minIdx < 0 ? 0 : minIdx;
		maxIdx = maxIdx > postText.length ? postText.length : maxIdx;

		var resultText = "&emsp; ..." + boldString(postText.substring(minIdx, maxIdx), value) + "...";
		var resultLink = "&emsp; <a href=\'javascript:void(0)\' onclick=\"goToPage(\'"+resultPost+"\');\">"+resultPost+"</a>";

		linksText += "" + resultLink + "<br/>" + resultText + "<br/>";
	}

	if (linksText == "") {
		linksText = "No result was found... :("
	}

	document.getElementById('searchoutput').innerHTML = linksText;
}