// selected1
var s1 = {
	"l": 0,
	"r": 0
};

var config = [];
var theme = localStorage.getItem("theme") || "light";
document.getElementById("theme").href = "./themes/" + theme + ".css";
var lang = localStorage.getItem("lang") || "en_us";
var langFile = {}
var dropShown = false;
var releaseDate = new Date("2019 May 07 18:00:00 UTC").getTime();
var msWeek = new Date("1970 Jan 08 00:00:00 UTC").getTime();
var now = new Date().getTime();
var rotation = ["v", "a", "s"];
var bestConsole = {
	"v": {
		"primary": "c1",
		"secondary": "c3",
		"primaryLeft": "pad.left1",
		"primaryRight": "pad.right1",
		"secondaryLeft": "pad.left3"
	},
	"a": {
		"primary": "c2",
		"secondary": "c3",
		"primaryLeft": "pad.left2",
		"primaryRight": "pad.right2",
		"secondaryLeft": "pad.left3"
	},
	"s": {
		"primary": "c3",
		"secondary": "c2",
		"primaryLeft": "pad.left3",
		"primaryRight": "pad.right3",
		"secondaryLeft": "pad.left2"
	}
};
var light = rotation[Math.floor((now - releaseDate) / msWeek) % 3];

function solve(li, ri) {
	if (li !== 0) {
		// left pressed, so clear selected and set new
		for (var i = 1; i <= 12; i++) {
			document.getElementById("l" + i).className = "";
		}
		document.getElementById("l" + li).className = "selected";
		s1.l = li;
	} else if (ri !== 0) {
		// right pressed, so clear selected and set new
		for (var i = 1; i <= 12; i++) {
			document.getElementById("r" + i).className = "";
		}
		document.getElementById("r" + ri).className = "selected";
		s1.r = ri;
	} else {
		alert("how did you make this appear?\nLike really, let me know, you should not see this.")
		return;
	}

	if (s1.l === 0 || s1.r === 0) {
		return;
	}

	// Find all matches since we have a full pair
	var matches = [];
	for (var i = 0; i < config.length; i++) {
		if (config[i][bestConsole[light].primary].l === s1.l && config[i][bestConsole[light].primary].r === s1.r) {
			matches.push(config[i]);
		}
	}

	// Clear table body
	document.getElementById("results-body").innerHTML = "";
	document.getElementById("results-info").innerText = "";
	if (matches.length > 0) {
		matches.forEach(e => {
			document.getElementById("results-body").innerHTML += "<tr id='row" + (e.n.n - 1) + "' class='" + (e.n.d ? "used" : "") + "' onclick='markUsed(" + (e.n.n - 1) + ")'><td>" + getLang("pad.num" + e[bestConsole[light].secondary].l) + "</td><td class=\"colored\" style=\"background-color: " + e.n.c + ";\">" + getLang("results." + e.n.c) + " " + getLang("pad.num" + e.n.l) + "</td></tr>";
		});
	} else {
		document.getElementById("results-info").innerText = getLang("results.wrong");
	}
}

function markUsed(i) {
	config[i].n.d = !config[i].n.d;

	if (config[i].n.d) {
		document.getElementById("row" + i).className = "used";
	} else {
		document.getElementById("row" + i).className = "";
	}
}

function toggleHelp(i) {
	i ? document.getElementById("help-overlay").className = "show-overlay" : document.getElementById("help-overlay").className = "";
}

function toggleSettings(i) {
	i ? document.getElementById("settings-overlay").className = "show-overlay" : document.getElementById("settings-overlay").className = "";
	if (i) {
		document.getElementById("void").className = "";
		document.getElementById("arc").className = "";
		document.getElementById("solar").className = "";

		document.getElementById("light").className = "";
		document.getElementById("dark").className = "";

		switch(light) {
			case "v":
				document.getElementById("void").className = "selected";
				break;
			case "a":
				document.getElementById("arc").className = "selected";
				break;
			case "s":
				document.getElementById("solar").className = "selected";
				break;
		}

		switch(theme) {
			case "light":
				document.getElementById("light").className = "selected";
				break;
			case "dark":
				document.getElementById("dark").className = "selected";
				break;
		}
	}
}

function setLight(l) {
	light = l;
	document.getElementById("void").className = "";
	document.getElementById("arc").className = "";
	document.getElementById("solar").className = "";
	document.getElementById("solving-void").className = "";
	document.getElementById("solving-arc").className = "";
	document.getElementById("solving-solar").className = "";

	document.getElementById("results-label-change").innerHTML = getLang(bestConsole[light].secondaryLeft);
	document.getElementById("right-label-change").innerHTML = getLang(bestConsole[light].primaryLeft);
	document.getElementById("left-label-change").innerHTML = getLang(bestConsole[light].primaryRight);

	for (var i = 1; i <= 12; i++) {
		document.getElementById("l" + i).className = "";
		document.getElementById("r" + i).className = "";
	}

	s1 = {
		"l": 0,
		"r": 0
	};
	document.getElementById("results-body").innerHTML = "";
	document.getElementById("results-info").innerText = getLang("results.before");

	switch(light) {
		case "v":
			document.getElementById("void").className = "selected";
			document.getElementById("solving-void").className = "show-solving";
			break;
		case "a":
			document.getElementById("arc").className = "selected";
			document.getElementById("solving-arc").className = "show-solving";
			break;
		case "s":
			document.getElementById("solar").className = "selected";
			document.getElementById("solving-solar").className = "show-solving";
			break;
	}

	var b = new XMLHttpRequest();
	b.open("GET", "configs/" + light + ".json");
	b.setRequestHeader("Cache-Control", "max-age=0");
	b.overrideMimeType("application/json")
	b.onreadystatechange = function() {
		if(b.readyState === XMLHttpRequest.DONE && b.status === 200) {
			config = JSON.parse(b.responseText);
		} else if(b.status === 404) {
			alert("config missing. :/");
		}
	}
	b.send();
}

function setTheme(t) {
	theme = t;
	localStorage.setItem("theme", theme);
	document.getElementById("light").className = "";
	document.getElementById("dark").className = "";
	switch(theme) {
		case "light":
			document.getElementById("light").className = "selected";
			break;
		case "dark":
			document.getElementById("dark").className = "selected";
			break;
	}
	document.getElementById("theme").href = "./themes/" + theme + ".css";
}

function getLang(item) {
	var string = "";
	if (item.indexOf(".") > 0) {
		var p1 = item.split(".")[0];
		var p2 = item.split(".")[1];
		string = langFile[p1][p2];
	} else {
		string = langFile[item];
	}
	return string;
}

function setLang() {
	document.querySelectorAll("[data-lang]").forEach(e => {
		e.innerHTML = getLang(e.dataset.lang);
	});
}

function selectLang() {
	lang = document.getElementById("language-select").value;
	localStorage.setItem("lang", lang);
	var b = new XMLHttpRequest();
	b.open("GET", "lang/" + lang + ".json");
	b.setRequestHeader("Cache-Control", "max-age=0");
	b.overrideMimeType("application/json")
	b.onreadystatechange = function() {
		if(b.readyState === XMLHttpRequest.DONE && b.status === 200) {
			langFile = JSON.parse(b.responseText);
			setLang();
			setLight(light);
		} else if(b.status === 404) {
			alert("langfile missing. :/");
		}
	}
	b.send();
}

function toggleAbout(i) {
	i ? document.getElementById("about-overlay").className = "show-overlay" : document.getElementById("about-overlay").className = "";
}

function toggleDropDown() {
	dropShown = !dropShown;
	dropShown ? document.getElementById("drop-down").className = "show-drop" : document.getElementById("drop-down").className = "";
}

document.onclick= function(event) {
    // Compensate for IE<9's non-standard event model
    //
    if (event===undefined) event= window.event;
    var target= 'target' in event? event.target : event.srcElement;

	if (target.tagName === "A") {return;}
	document.getElementById("drop-down").className = "";
	dropShown = false;
};

// Get and save the current config
var b = new XMLHttpRequest();
b.open("GET", "configs/" + light + ".json");
b.setRequestHeader("Cache-Control", "max-age=0");
b.overrideMimeType("application/json")
b.onreadystatechange = function() {
	if(b.readyState === XMLHttpRequest.DONE && b.status === 200) {
		config = JSON.parse(b.responseText);
	} else if(b.status === 404) {
		alert("config missing. :/");
	}
}
b.send();

// Check browser to determine if in optimal orientation
window.onload = () => {
	var b = new XMLHttpRequest();
	b.open("GET", "lang/" + lang + ".json");
	b.setRequestHeader("Cache-Control", "max-age=0");
	b.overrideMimeType("application/json")
	b.onreadystatechange = function() {
		if(b.readyState === XMLHttpRequest.DONE && b.status === 200) {
			langFile = JSON.parse(b.responseText);
			setLang();
			setLight(light);
		} else if(b.status === 404) {
			alert("langfile missing. :/");
		}
	}
	b.send();


	if (/Mobi/.test(navigator.userAgent) && (window.innerHeight < window.innerWidth)) {
		alert("Hey!\n\nLooks like you are on a smartphone and in landscape mode.\nI recommend using this tool in portait mode as all content fits nicely without scrolling but it will function fine in landscape.")
	}
};

window.addEventListener("orientationchange", function() {
	if (screen.orientation.type === "landscape-secondary") {
		alert("Hey!\n\nLooks like your device is designed for portait use, just like this tool.\nI recommend using this tool in portait mode as all content fits nicely without scrolling but it will function fine in landscape.");
	}
}, false);