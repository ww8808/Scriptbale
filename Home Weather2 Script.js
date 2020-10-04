// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: magic;
// To use, add a parameter to the widget with a format of: image.png|padding-top|text-color
// The image should be placed in the iCloud Scriptable folder (case-sensitive).
// The padding-top spacing parameter moves the text down by a set amount.
// The text color parameter should be a hex value.

// For example, to use the image bkg_fall.PNG with a padding of 40 and a text color of red,
// the parameter should be typed as: bkg_fall.png|40|#ff0000

// All parameters are required and separated with "|"

// Parameters allow different settings for multiple widget instances.

let widgetHello = new ListWidget(); 
var today = new Date();

var widgetInputRAW = args.widgetParameter;

try {
	widgetInputRAW.toString();
} catch(e) {
	throw new Error("Please long press the widget and add a parameter.");
}

var widgetInput = widgetInputRAW.toString();

var inputArr = widgetInput.split("|");

// iCloud file path
var scriptableFilePath = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/";
var removeSpaces1 = inputArr[0].split(" "); // Remove spaces from file name
var removeSpaces2 = removeSpaces1.join('');
var tempPath = removeSpaces2.split(".");
var backgroundImageURLRAW = scriptableFilePath + tempPath[0];

var fm = FileManager.iCloud();
var backgroundImageURL = scriptableFilePath + tempPath[0] + ".";
var backgroundImageURLInput = scriptableFilePath + removeSpaces2;

// For users having trouble with extensions
// Uses user-input file path is the file is found
// Checks for common file format extensions if the file is not found
if (fm.fileExists(backgroundImageURLInput) == false) {
		var fileTypes = ['png', 'jpg', 'jpeg', 'tiff', 'webp', 'gif'];

		fileTypes.forEach(function(item) {
			if (fm.fileExists((backgroundImageURL + item.toLowerCase())) == true) {
				backgroundImageURL = backgroundImageURLRAW + "." + item.toLowerCase();
			} else if (fm.fileExists((backgroundImageURL + item.toUpperCase())) == true) {
				backgroundImageURL = backgroundImageURLRAW + "." + item.toUpperCase();
			}
		});
} else {
	backgroundImageURL = scriptableFilePath + removeSpaces2;
}

var spacing = parseInt(inputArr[1]);

//API_KEY
let API_WEATHER = "XXXXXXXXXXXXXXXXXXXXXX";//Load Your api here
let CITY_WEATHER = "XXXXXXX";//add your city ID

//Get storage
var base_path = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/weather/";
var fm = FileManager.iCloud();

// Fetch Image from Url
async function fetchimageurl(url) {
	const request = new Request(url)
	var res = await request.loadImage();
	return res;
}

// Get formatted Date
function getformatteddate(){
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return months[today.getMonth()] + " " + today.getDate()
}

// Long-form days and months
var days = ['周日','周一','周二','周三','周四','周五','周六'];
var months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

// Load image from local drive
async function fetchimagelocal(path){
  var finalPath = base_path + path + ".png";
  if(fm.fileExists(finalPath)==true){
	console.log("file exists: " + finalPath);
	return finalPath;
  }else{
	//throw new Error("Error file not found: " + path);
	if(fm.fileExists(base_path)==false){
	  console.log("Directry not exist creating one.");
	  fm.createDirectory(base_path);
	}
	console.log("Downloading file: " + finalPath);
	await downloadimg(path);
	if(fm.fileExists(finalPath)==true){
	  console.log("file exists after download: " + finalPath);
	  return finalPath;
	}else{
	  throw new Error("Error file not found: " + path);
	}
  }
}

async function downloadimg(path){
	const url = "http://a.animedlweb.ga/weather/weathers25_2.json";
	const data = await fetchWeatherData(url);
	var dataimg = null;
	var name = null;
	if(path.includes("bg")){
	  dataimg = data.background;
	  name = path.replace("_bg","");
	}else{
	  dataimg = data.icon;
	  name = path.replace("_ico","");
	}
	var imgurl=null;
	switch (name){
	  case "01d":
		imgurl = dataimg._01d;
	  break;
	  case "01n":
		imgurl = dataimg._01n;
	  break;
	  case "02d":
		imgurl = dataimg._02d;
	  break;
	  case "02n":
		imgurl = dataimg._02n;
	  break;
	  case "03d":
		imgurl = dataimg._03d;
	  break;
	  case "03n":
		imgurl = dataimg._03n;
	  break;
	  case "04d":
		imgurl = dataimg._04d;
	  break;
	  case "04n":
		imgurl = dataimg._04n;
	  break;
	  case "09d":
		imgurl = dataimg._09d;
	  break;
	  case "09n":
		imgurl = dataimg._09n;
	  break;
	  case "10d":
		imgurl = dataimg._10d;
	  break;
	  case "10n":
		imgurl = dataimg._10n;
	  break;
	  case "11d":
		imgurl = dataimg._11d;
	  break;
	  case "11n":
		imgurl = dataimg._11n;
	  break;
	  case "13d":
		imgurl = dataimg._13d;
	  break;
	  case "13n":
		imgurl = dataimg._13n;
	  break;
	  case "50d":
		imgurl = dataimg._50d;
	  break;
	  case "50n":
		imgurl = dataimg._50n;
	  break;
	}
	const image = await fetchimageurl(imgurl);
	console.log("Downloaded Image");
	fm.writeImage(base_path+path+".png",image);
}

//get Json weather
async function fetchWeatherData(url) {
  const request = new Request(url);
  const res = await request.loadJSON();
  return res;
}

// Get Location 
/*Location.setAccuracyToBest();
let curLocation = await Location.current();
console.log(curLocation.latitude);
console.log(curLocation.longitude);*/
let wetherurl = "http://api.openweathermap.org/data/2.5/weather?id=" + CITY_WEATHER + "&APPID=" + API_WEATHER + "&units=metric";
//"http://api.openweathermap.org/data/2.5/weather?lat=" + curLocation.latitude + "&lon=" + curLocation.longitude + "&appid=" + API_WEATHER + "&units=metric";
//"http://api.openweathermap.org/data/2.5/weather?id=" + CITY_WEATHER + "&APPID=" + API_WEATHER + "&units=metric"

const weatherJSON = await fetchWeatherData(wetherurl);
const cityName = weatherJSON.name;
const weatherarry = weatherJSON.weather;
const iconData = weatherarry[0].icon;
const weathername = weatherarry[0].main;
const curTempObj = weatherJSON.main;
const curTemp = curTempObj.temp;
const highTemp = curTempObj.temp_max;
const lowTemp = curTempObj.temp_min;
const feel_like = curTempObj.feels_like;
//Completed loading weather data

// Greetings arrays per time period. 
var greetingsMorning = [
    '早上好.靓仔'
    ];
    var greetingsNoon = [
    '中午好.靓仔'
    ];
    var greetingsAfternoon = [
    '下午好.靓仔'
    ];
    var greetingsEvening = [
    '晚上好.靓仔'
    ];
    var greetingsNight = [
    '睡觉时间.靓仔'
    ];
    var greetingsLateNight = [
    '赶紧睡觉!!!'
    ];

// Holiday customization
var holidaysByKey = {
	// month,week,day: datetext
	"11,4,4": "Happy Thanksgiving!"
}

var holidaysByDate = {
	// month,date: greeting
	"1,1": "Happy " + (today.getFullYear()).toString() + "!",
	"10,31": "Happy Halloween!",
	"12,25": "Merry Christmas!"
}

var holidayKey = (today.getMonth() + 1).toString() + "," +  (Math.ceil(today.getDate() / 7)).toString() + "," + (today.getDay()).toString();

var holidayKeyDate = (today.getMonth() + 1).toString() + "," + (today.getDate()).toString();

// Date Calculations
var weekday = days[ today.getDay() ];
var month = months[ today.getMonth() ];
var date = today.getDate();
var hour = today.getHours();

// Append ordinal suffix to date
function ordinalSuffix(input) {
	if (input % 10 == 1 && date != 11) {
		return input.toString() + "日";
	} else if (input % 10 == 2 && date != 12) {
		return input.toString() + "日";
	} else if (input % 10 == 3 && date != 13) {
		return input.toString() + "日";
	} else {
		return input.toString() + "日";
	}
}

// Generate date string
var datefull = month + " " + ordinalSuffix(date) +", " + weekday;

// Support for multiple greetings per time period
function randomGreeting(greetingArray) {
	return Math.floor(Math.random() * greetingArray.length);
}

var greeting = new String("Howdy.")
if (hour < 5 && hour >= 1) { // 1am - 5am
	greeting = greetingsLateNight[randomGreeting(greetingsLateNight)];
} else if (hour >= 23 || hour < 1) { // 11pm - 1am
	greeting = greetingsNight[randomGreeting(greetingsNight)];
} else if (hour < 11) { // Before noon (5am - 12pm)
	greeting = greetingsMorning[randomGreeting(greetingsMorning)];
} else if (hour >=11 && hour <= 13)  { // 11am - 1pm
	greeting = greetingsNoon[randomGreeting(greetingsNoon)];
} else if (hour > 13 && hour <= 17) { // 1pm - 5pm
	greeting = greetingsAfternoon[randomGreeting(greetingsAfternoon)];
} else if (hour > 17 && hour < 23) { // 5pm - 11pm
	greeting = greetingsEvening[randomGreeting(greetingsEvening)];
} 

// Overwrite greeting if calculated holiday
if (holidaysByKey[holidayKey]) {
	greeting = holidaysByKey[holidayKey];
}

// Overwrite all greetings if specific holiday
if (holidaysByDate[holidayKeyDate]) {
	greeting = holidaysByDate[holidayKeyDate];
}

// Try/catch for color input parameter
try {
	inputArr[2].toString();
} catch(e) {
	throw new Error("Please long press the widget and add a parameter.");
}

let themeColor = new Color(inputArr[2].toString());

/* --------------- */
/* Assemble Widget */
/* --------------- */
 
//Top spacing
widgetHello.addSpacer(20);
 
// Greeting label
let hello = widgetHello.addText(greeting);
hello.font = Font.regularSystemFont(35);
hello.textColor = themeColor;
hello.centerAlignText();
 
//Spacing between greeting and date
widgetHello.addSpacer(10);
  
// Date label in stack
let datetext = widgetHello.addText(datefull + '\xa0\xa0\xa0\xa0');
datetext.font = Font.regularSystemFont(18);
datetext.textColor = themeColor;
datetext.textOpacity = (0.8);
datetext.centerAlignText();

//Spacing between date and summary
widgetHello.addSpacer(10);

// Widget feel temp
let feel = weathername + " today" + "." + " It feels like " + Math.round(feel_like) + "\u2103" + ";" + " the high will be " + Math.round(highTemp) + "\u2103";//"H:"+highTemp+"\u00B0"+" L:"+lowTemp+"\u00B0"
var hltemptext = widgetHello.addText(feel);
hltemptext.textColor = themeColor;
hltemptext.font = Font.regularSystemFont(12);
hltemptext.centerAlignText();
hltemptext.textOpacity = (0.7);

//define horizontal stack
let hStack = widgetHello.addStack();
hStack.layoutHorizontally();

// Centers weather line
hStack.addSpacer(90)

//image
var img = Image.fromFile(await fetchimagelocal(iconData + "_ico"));
 
//image in stack
let widgetimg = hStack.addImage(img);
widgetimg.imageSize = new Size(40, 40);
widgetimg.centerAlignImage();
 
//tempeture label in stack
let temptext = hStack.addText('\xa0\xa0'+ Math.round(curTemp).toString()+"\u2103");
temptext.font = Font.regularSystemFont(40);
temptext.textColor = themeColor;
//temptext.textOpacity = (0.5);
temptext.centerAlignText();


// Bottom Spacer
widgetHello.addSpacer();
widgetHello.setPadding(10, 0, 0, 0);
 
// Background image
widgetHello.backgroundImage = Image.fromFile(backgroundImageURL);
 
// Set widget
Script.setWidget(widgetHello);
