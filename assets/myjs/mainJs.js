/*function goToPage(postName) {
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
}*/

function validUrl(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}

function goToPage(postName) {
    console.log(postName)

    // Check if it's a valid file stored in the posts directory
    // Update the url so back spacing / going back a tab works as expected.
    postLocation = window.location.href+"posts/"+postName+".md"
    suburl = validUrl(postLocation) ? postName : "404" 
    window.location.href = "https://www.computingthegraphics.com/?post="+suburl;

    hideSearch(true);
}

// TODO - handle these appropriately!!!
function readVisitorCounter() {
    
}

function updateVisitorCounter() {
    var fs = require('fs');
    text = fs.readFile('./count.txt', funciton(err, data) {
        if (err) {
            return console.error(err);
        }
        console.log("Asynchronous read: " + data.toString());
        return data.toString();
    }
    console.log(text);
    count = 1 + parseInt(text)
   
    fs.writeFile('./count.txt', ''+count, (err) => {
        if (err) throw err;
        console.log('It's saved!');
    });
}

function createPostsMenu() {
    console.log('CREATING POSTS MENU')
    const folderFormat = "<li><span class='opener'>TITLE</span><ul>POSTS</ul></li>\n"
    const postFormat = "<li><a href='javascript:void(0)' onclick=\"goToPage('POST_TITLE')\">POST_TITLE</a></li>\n"
    var postsText = "<h4>Posts</h4>\n"

    // https://docs.github.com/en/rest/reference/git#trees
    await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
        owner: 'ComputingTheGraphics',
        repo: 'ComputingTheGraphics.github.io',
        tree_sha: 'TODO-------'
    })

    var directories = []
    for (dir in directories) {
        var folderString = "" + folderFormat;
        folderString.replace("TITLE", dir);

        var posts = []
        var postsString = ""
        for (post in posts) {
            var individualPost = "" + postFormat;
            individualPost.replace("POST_TITLE", post);
            postsString += postFormat;
        }
        
        folderString.replace("POSTS", postsString);
        postsText += folderString 
    }
    console.log(postsText)

    document.getElementById('menu').innerHTML = postsText;
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
    // Loading a post?
    console.log('load up a post////')
	var post = getValueFromUrl('post');
    console.log('post is '+post)
	if (post == undefined) {
		post = 'Overview/welcome';
	}
	var mdHtmlPageIFrame = document.getElementById("mainloader");
    mdHtmlPageIFrame.src = '/posts/'+post+'.html'

    // Searching?
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
	return url.searchParams.get(key);
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

function dataFromPost(mdPost) {
    var allPosts = fs.readdirSync('/posts/');
    var fs = require('fs');
    fs.readFile('/posts/' + mdPost, function (err, data) {
      if (err) {
         return console.error(err);
      }
      console.log("Asynchronous read: " + data.toString());
      return data.toString();
   });
}

function search(value) {
	var linksText = "";
	var result = flexsearch.search(value);
	var letter_buffer = 40; // want 5 letter on either side of searched for value

	var adding_s = (result.length == 1) ? "" : "s";
	var linksText = "Found " + result.length + " relevant post" + adding_s + ":<br/><br/>";
	for (idx in result) {
		var resultPost = result[idx];

        var postText = dataFromPost(resultPost+'.md');

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
