let storedText;

//https://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
if (!String.linkify) {
  String.prototype.linkify = function () {
    // http://, https://, ftp://
    let urlPattern =
      /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

    // www. sans http:// or https://
    let pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

    // Email addresses
    let emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

    return this.replace(urlPattern, '<a href="$&">$&</a>')
      .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
      .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
  };
}

function fetchInfo() {
  let runLinkInput = document.getElementById("runLink").value;
  let runDiffInput = document.getElementById("diffInput").value;
  let runReasonInput = document.getElementById("reasonInput").value;
  let idslice = runLinkInput.slice(-8);
  let playerEmbed = "?embed=players,category.variables,level";
  let idPlusEmbeds = idslice.concat(playerEmbed);
  let apiDomain = "https://www.speedrun.com/api/v1/runs/";
  //https://www.speedrun.com/api/v1/leaderboards/j1ne5891/level/y9mg6vx9/7kj890zd?var-p854xo3l=21g85z6l&var-ylpe1pv8=klrpdvwq&embed=platforms%2Cplayers&timing=realtime_noloads&top=1
  //let apiUrl = "https://www.speedrun.com/api/v1/runs/znqq2e8z?embed=players,category.variables,level";
  let apiUrl = "https://www.speedrun.com/api/v1/leaderboards/j1ne5891/level/y9mg6vx9/7kj890zd?var-p854xo3l=21g85z6l&var-ylpe1pv8=klrpdvwq&embed=players,category.variables,level&top=1"
  let apiUrl2 = "https://www.speedrun.com/api/v1/leaderboards/j1ne5891/level/y9mg6vx9/7kj890zd?var-p854xo3l=21g85z6l&var-ylpe1pv8=klrpdvwq&embed=players,category.variables,level&top=1"
  let playerName = document.getElementById("playerCell_0");
  let categoryName = document.getElementById("categoryCell_0");
  let timeName = document.getElementById("timeCell_0");
  let dateName = document.getElementById("dateCell_0");
  let videoName = document.getElementById("videoCell_0");
  let reasonName = document.getElementById("reasonCell_0");
  let apiUrlName = document.getElementById("apiUrlDiv_0");

  fetch(apiUrl).then(function (response) {
    response.text().then(function (text) {
      storedText = text;
      const obj = JSON.parse(text);
	  console.log(obj.data.runs[0].run.times.primary_t);
      //playerName.innerHTML = obj.data.players.data[0].names.international;
      let finaltime;
      let initialTime = obj.data.runs[0].run.times.primary_t;
      let finalTime;
      let minutes;
      let seconds;
      let hours;
      //console.log(initialTime);
      //console.log(obj.data.players.data[0].rel);
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
      categoryName.innerHTML =
        obj.data.level.data.name +
        " " +
        obj.data.category.data.name +
        " " +
        runDiffInput;
      apiUrlName.innerHTML = apiUrl.linkify();
    });
  });
  
}

function done() {
  document.getElementById("log").textContent =
    "Here's what I got! \n" + storedText;
}


window.onload = fetchInfo;