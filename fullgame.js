var storedText;

if(!String.linkify) {
    String.prototype.linkify = function() {

        // http://, https://, ftp://
        var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        // www. sans http:// or https://
        var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

        // Email addresses
        var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

        return this
            .replace(urlPattern, '<a href="$&">$&</a>')
            .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
            .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
    };
}

function fetchInfo()
{
	var runLinkInput = document.getElementById('runLink').value;
	var runDiffInput = document.getElementById('diffInput').value;
	var runReasonInput = document.getElementById('reasonInput').value;
	//runLinkInput 
	//console.log(runLinkInput);
	let idslice = runLinkInput.slice(-8);
	let playerEmbed = "?embed=players,category.variables,level"
	let idPlusEmbeds = idslice.concat(playerEmbed);
	let apiDomain = "https://www.speedrun.com/api/v1/runs/";
	let apiUrl = apiDomain.concat(idPlusEmbeds);
	//console.log(apiUrl);
	var playerName = document.getElementById('playerCell');
	var categoryName = document.getElementById('categoryCell');
	var timeName = document.getElementById('timeCell');
	var dateName = document.getElementById('dateCell');
	var videoName = document.getElementById('videoCell');
	var reasonName = document.getElementById('reasonCell');
	//console.log(playerName);
	fetch(apiUrl)
  .then(function(response) {
    response.text().then(function(text) {
      storedText = text;
	//txt2 = text.split('"rules":"')[0] +'"players":{"type"'+ text.split('"players":{"type"')[1];
	const obj = JSON.parse(text);
	//console.log(txt2);
	//const obj2 = JSON.parse(txt2);
	//document.getElementById("demo").innerHTML = obj.data.category.data.name;
	  
	//document.getElementById("playerName").innerHTML = obj.data.players.data[0].names.international;
	//delete obj.data.players;
	//var req = [obj.data.values];
	//console.log(Object.keys(req));
//var obj2 = { name: "John", age: 30, city: "New York" };
//var result = req[Object.keys(req)[0]];
//var result2 = result[Object.keys(result)[0]];
//console.log(result2);
//var test33 = "obj.data.category.data.variables.data[0].values.values." + result2 + ".label";
//console.log(test33);
//console.log(JSON.parse(test33));
	  playerName.innerHTML = obj.data.players.data[0].names.international;
	  timeName.innerHTML = obj.data.times.primary_t;
	  dateName.innerHTML = obj.data.date;
	  videoName.innerHTML = (obj.data.videos.links[0].uri).linkify();
	  reasonName.innerHTML = runReasonInput;
	  //categoryName.innerHTML = obj.data.category.data.variables.data[0].values.values.gq7jpmpq.label;
	  //categoryName.innerHTML = obj.data.level.data.name + " " + obj.data.category.data.name + " " + eval(test33);
	  categoryName.innerHTML =  obj.data.category.data.name + " " + runDiffInput;
	  //levelName.innerHTML = obj.data.level.data.name;

    });
  });
  
}

function done() {
  document.getElementById('log').textContent =
    "Here's what I got! \n" + storedText;
}

