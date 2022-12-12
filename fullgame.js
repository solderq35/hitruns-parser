var storedText;

//https://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
if (!String.linkify) {
  String.prototype.linkify = function () {
    // http://, https://, ftp://
    var urlPattern =
      /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

    // www. sans http:// or https://
    var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

    // Email addresses
    var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

    return this.replace(urlPattern, '<a href="$&">$&</a>')
      .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
      .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
  };
}

function fetchInfo() {
  var runLinkInput = document.getElementById("runLink").value;
  var runDiffInput = document.getElementById("diffInput").value;
  var runReasonInput = document.getElementById("reasonInput").value;
  let idslice = runLinkInput.slice(-8);
  let playerEmbed = "?embed=players,category.variables,level";
  let idPlusEmbeds = idslice.concat(playerEmbed);
  let apiDomain = "https://www.speedrun.com/api/v1/runs/";
  let apiUrl = apiDomain.concat(idPlusEmbeds);
  var playerName = document.getElementById("playerCell");
  var categoryName = document.getElementById("categoryCell");
  var timeName = document.getElementById("timeCell");
  var dateName = document.getElementById("dateCell");
  var videoName = document.getElementById("videoCell");
  var reasonName = document.getElementById("reasonCell");
  var grunName = document.getElementById("grunCell");
  var apiUrlName = document.getElementById("apiUrlDiv");

  fetch(apiUrl).then(function (response) {
    response.text().then(function (text) {
      storedText = text;
      const obj = JSON.parse(text);
      //playerName.innerHTML = obj.data.players.data[0].names.international;

      var finaltime;
      var initialTime = obj.data.times.primary_t;
      var finalTime;
      var minutes;
      var seconds;
      var hours;
      //console.log(initialTime);

      if (obj.data.players.data[0].rel == "user") {
        playerName.innerHTML = obj.data.players.data[0].names.international;
      } else if (obj.data.players.data[0].rel == "guest") {
        playerName.innerHTML = obj.data.players.data[0].name;
      }

      if (initialTime >= 3600) {
        hours = parseInt(initialTime / 3600);
        // console.log(hours);
        minutes = parseInt(initialTime / 60) - hours * 60;
        seconds = initialTime % 60;
        if (seconds > 9 && minutes > 0) {
          finalTime =
            hours.toString() +
            ":" +
            minutes.toString() +
            ":" +
            seconds.toString();
        } else if (seconds <= 9 && minutes > 0) {
          finalTime =
            hours.toString() +
            ":" +
            minutes.toString() +
            ":0" +
            seconds.toString();
          //console.log(hours);
        }
      } else {
        if (initialTime < 60 && initialTime >= 10) {
          finalTime = "0:" + initialTime;
        } else if (initialTime <= 9) {
          finalTime = "0:0" + initialTime;
        } else if (initialTime >= 60) {
          minutes = parseInt(initialTime / 60);
          seconds = initialTime % 60;
          if (seconds > 9 && minutes > 0) {
            finalTime = minutes.toString() + ":" + seconds.toString();
          } else if (seconds <= 9 && minutes > 0) {
            finalTime = minutes.toString() + ":0" + seconds.toString();
          }
        }
      }
      timeName.innerHTML = finalTime;
      dateName.innerHTML = obj.data.date;
      videoName.innerHTML = obj.data.videos.links[0].uri.linkify();
      reasonName.innerHTML = runReasonInput;
      categoryName.innerHTML = obj.data.category.data.name + " " + runDiffInput;
      var commentInitial = obj.data.comment;
      var linkextract = commentInitial.match(/\bhttps?:\/\/\S+/gi);
      grunName.innerHTML = linkextract.toString().linkify();
      apiUrlName.innerHTML = apiUrl.linkify();
    });
  });
}

function done() {
  document.getElementById("log").textContent =
    "Here's what I got! \n" + storedText;
}
