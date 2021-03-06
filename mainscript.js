// Test to Speech
var volume_btn;

let speech = new SpeechSynthesisUtterance();

speech.lang = "en-US";

speech.volume = 1;

speech.rate = 1;
speech.pitch = 1;

try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}

var Textbox = $('#chats');

var Content = '';

recognition.continuous = true;

recognition.onresult = function(event) {

  var current = event.resultIndex;

  var transcript = event.results[current][0].transcript;
    Content="";
    Content += transcript;
    console.log("Content value is ",Content)

var UserResponse = '<img class="userAvatar" src=' + "userAvatar.jpg" + '><p class="userMsg">' + Content + ' </p><div class="clearfix"></div>';
    $(UserResponse).appendTo(".chats").show("slow");
    scrollToBottomOfResults();
    send(Content);
    Textbox.val(Content);

};

//
//$('#volume').click(function(e) {
//var volume_btn=true;
//});



var un_mute = document.getElementById('un-mute');

un_mute.onclick = function() {
//var btn=$("input[type='checkbox']").val();
//alert($('#un-mute').html());
//console.log(btn);
//speech.volume = 0;
var selectedLanguage = new Array();
$('input[name="un-mute"]:checked').each(function() {
selectedLanguage.push(this.value);
});

if(selectedLanguage.length==1)
{
speech.volume = 0;
}
else
{
speech.volume = 1;
}
}



$('#mike-btn').mousedown(function(e) {


  $("#mike-btn").css("background-color","lightblue");

  if (Content.length) {
//    alert("under content");
    Content += ' ';
    console.log("content is" , Content);
  }
  recognition.start();
});


$('#mike-btn').mouseup(function(e) {


  $("#mike-btn").css("background-color","white");
  if (Content.length) {
    Content += ' ';
    console.log("content is" , Content);
  }
  recognition.stop();
});



Textbox.on('input', function() {
  Content = $(this).val();
  console.log("Content value is ",Content)
})

 var btn_clicked;
 var audio = new Audio("notify.mp3");
 $('#not').hide();
//Bot pop-up intro


btn_clicked=false;

document.addEventListener('DOMContentLoaded', function() {
    var elemsTap = document.querySelector('.tap-target');
    var instancesTap = M.TapTarget.init(elemsTap, {});
    instancesTap.open();
    setTimeout(function() { instancesTap.close(); }, 4000);

});


//initialization
$(document).ready(function() {

//
//document.getElementById('alarm').autoplay = true;
//document.getElementById('alarm').muted=true;
//document.getElementById('alarm').play();

    $('#userInput').focus();

    //Bot pop-up intro
    $("div").removeClass("tap-target-origin")

    //drop down menu for close, restart conversation & clear the chats.
    $('.dropdown-trigger').dropdown();

    //initiate the modal for displaying the charts, if you dont have charts, then you comment the below line
    $('.modal').modal();



    //enable this if u have configured the bot to start the conversation.
//     showBotTyping();
//     $("#userInput").prop('disabled', true);

    //global variables
//    restartConversation();
//    send("/restart");
     action_name = "action_greet_gif";
//     action_name="utter_greet"
    user_id = "VirtiBot";

    //if you want the bot to start the conversation
//    restartConversation();
      action_trigger();


})

// ========================== restart conversation ========================
function restartConversation() {
    $("#userInput").prop('disabled', true);
    //destroy the existing chart
    $('.collapsible').remove();

    if (typeof chatChart !== 'undefined') { chatChart.destroy(); }

    $(".chart-container").remove();
    if (typeof modalChart !== 'undefined') { modalChart.destroy(); }
    $(".chats").html("");
    $(".usrInput").val("");
    send("/restart");
}

// ========================== let the bot start the conversation ========================
function action_trigger() {

    // send an event to the bot, so that bot can start the conversation by greeting the user
    $.ajax({
        url: `https://rasa-chatbot.azurewebsites.net/conversations/${user_id}/execute`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ "name": action_name, "policy": "MappingPolicy", "confidence": "0.98" }),
        success: function(botResponse, status) {
            console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);

            if (botResponse.hasOwnProperty("messages")) {
                setBotResponse(botResponse.messages);
            }
            $("#userInput").prop('disabled', false);
        },
        error: function(xhr, textStatus, errorThrown) {

            // if there is no response from rasa server

            setBotResponse("");
            console.log("Error from bot end: ", textStatus);
            $("#userInput").prop('disabled', false);
        }
    });

}

//=====================================	user enter or sends the message =====================
$(".usrInput").on("keyup keypress", function(e) {
 $('#userInput').focus();
    var keyCode = e.keyCode || e.which;

    var text = $(".usrInput").val();
    if (keyCode === 13) {

        if (text == "" || $.trim(text) == "") {
            e.preventDefault();
            return false;
        } else {
            //destroy the existing chart, if yu are not using charts, then comment the below lines
            $('.collapsible').remove();
            if (typeof chatChart !== 'undefined') { chatChart.destroy(); }

            $(".chart-container").remove();
            if (typeof modalChart !== 'undefined') { modalChart.destroy(); }



            $("#paginated_cards").remove();
            $(".suggestions").remove();
            $(".quickReplies").remove();
            $(".usrInput").blur();
            setUserResponse(text);
            send(text);
            e.preventDefault();
            $('#userInput').focus();
            return false;
        }
    }
});

$("#sendButton").on("click", function(e) {
    $('#userInput').focus();
    var text = $(".usrInput").val();
    if (text == "" || $.trim(text) == "") {
        e.preventDefault();
        return false;
    } else {
        //destroy the existing chart

//        chatChart.destroy();
        $(".chart-container").remove();
        if (typeof modalChart !== 'undefined') { modalChart.destroy(); }

        $(".suggestions").remove();
        $("#paginated_cards").remove();
        $(".quickReplies").remove();
        $(".usrInput").blur();
        setUserResponse(text);
        send(text);
        e.preventDefault();
        $('#userInput').focus();
        return false;
    }
})

//==================================== Set user response =====================================
function setUserResponse(message) {
    var UserResponse = '<img class="userAvatar" src=' + "userAvatar.jpg" + '><p class="userMsg">' + message + ' </p><div class="clearfix"></div>';
    $(UserResponse).appendTo(".chats").show("slow");

    $(".usrInput").val("");
    scrollToBottomOfResults();
    showBotTyping();
    $(".suggestions").remove();
}

//=========== Scroll to the bottom of the chats after new message has been added to chat ======
function scrollToBottomOfResults() {

    var terminalResultsDiv = document.getElementById("chats");
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
}

//============== send the user message to rasa server =============================================
function send(message) {

    $.ajax({
        url: "https://rasa-chatbot.azurewebsites.net/webhooks/rest/webhook",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ message: message, sender: user_id }),
        success: function(botResponse, status) {
            console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);

            // if user wants to restart the chat and clear the existing chat contents
            if (message.toLowerCase() == '/restart') {
                $("#userInput").prop('disabled', false);

                //if you want the bot to start the conversation after restart
                 action_trigger();
                return;
            }
            setBotResponse(botResponse);

        },
        error: function(xhr, textStatus, errorThrown) {

            if (message.toLowerCase() == '/restart') {
                // $("#userInput").prop('disabled', false);

                //if you want the bot to start the conversation after the restart action.
                 action_trigger();
                 return;
            }

            // if there is no response from rasa server
            setBotResponse("");
            console.log("Error from bot end: ", textStatus);
        }
    });
}
var count=0
//=================== set bot response in the chats ===========================================
function setBotResponse(response) {

    //display bot response after 500 milliseconds
    setTimeout(function() {
        hideBotTyping();

        if (response.length < 1) {
            //if there is no response from Rasa, send  fallback message to the user
            var fallbackMsg = "I am facing some issues, please try again later!!!";

            var BotResponse = '<img class="botAvatar" src="satyamaevjayte.png"/><p class="botMsg" > <b>' + fallbackMsg + '</b> </p><div class="clearfix"></div>';

            $(BotResponse).appendTo(".chats").hide().fadeIn(1000);

           speech.text=fallbackMsg
          window.speechSynthesis.speak(speech);
            scrollToBottomOfResults();
        } else {



            //if we get response from Rasa
            for (i = 0; i < response.length; i++) {

                //check if the response contains "text"

                if (response[i].hasOwnProperty("text")) {
                    var BotResponse = '<img class="botAvatar" src="satyamaevjayte.png"/><p class="botMsg"><b>' + response[i].text + '</b></p><div class="clearfix"></div>';
                    $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
                    speech.text=response[i].text
                   window.speechSynthesis.speak(speech);
                }

                //check if the response contains "images"
                if (response[i].hasOwnProperty("image")) {
                    var BotResponse = '<div class="singleCard">' + '<img class="imgcard" height="500px" src="' + response[i].image + '">' + '</div><div class="clearfix">';
                    $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
                }


                //check if the response contains "buttons"
                if (response[i].hasOwnProperty("buttons")) {
                    console.log("response is",response[i].buttons);
                    addSuggestion(response[i].buttons);
                }

                //check if the response contains "attachment"
                if (response[i].hasOwnProperty("attachment")) {

                    //check if the attachment type is "video"
                    if (response[i].attachment.type == "video") {
                        video_url = response[i].attachment.payload.src;

                        var BotResponse = '<div class="video-container"> <iframe src="' + video_url + '" frameborder="0" allowfullscreen></iframe> </div>'
                        $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
                    }

                }
                //check if the response contains "custom" message
                if (response[i].hasOwnProperty("custom")) {

                    //check if the custom payload type is "quickReplies"
                    if (response[i].custom.payload == "quickReplies") {
                        quickRepliesData = response[i].custom.data;
                        showQuickReplies(quickRepliesData);
                        return;
                    }

                    //check if the custom payload type is "pdf_attachment"
                    if (response[i].custom.payload == "pdf_attachment") {

                        renderPdfAttachment(response[i]);
                        return;
                    }

                    //check if the custom payload type is "dropDown"
                    if (response[i].custom.payload == "dropDown") {
                        dropDownData = response[i].custom.data;
                        renderDropDwon(dropDownData);
                        return;
                    }

                    //check if the custom payload type is "location"
                    if (response[i].custom.payload == "location") {
                        $("#userInput").prop('disabled', true);
                        getLocation();
                        scrollToBottomOfResults();
                        return;
                    }
                    //check if the custom payload type is "dateTime"
                    if (response[i].custom.payload == "dateTime") {
                        console.log("payload received")
                        getdate();
                        scrollToBottomOfResults();
                        return;
                    }

                    if (response[i].custom.payload == "Links") {
                        console.log("payload received")
                        console.log(response[i].custom.data)
                        links=response[i].custom.data


                        getlinks(links);
                        scrollToBottomOfResults();
                        return;
                    }


                    if (response[i].custom.payload == "GIF") {
                        console.log("payload received")
                        getGif();
                        scrollToBottomOfResults();
                        return;
                    }

                    if (response[i].custom.payload == "Feedback") {
                        console.log("payload received")
                        getFeedback();
                        scrollToBottomOfResults();
                        return;
                    }



                    //check if the custom payload type is "cardsCarousel"
                    if (response[i].custom.payload == "cardsCarousel") {
                          Departments = (response[i].custom.data)
                          showCardsCarousel(Departments);
                          return;
                        }

                    //check if the custom payload type is "chart"
                    if (response[i].custom.payload == "chart") {

                        // sample format of the charts data:
                        // var chartData = { "title": "Leaves", "labels": ["Sick Leave", "Casual Leave", "Earned Leave", "Flexi Leave"], "backgroundColor": ["#36a2eb", "#ffcd56", "#ff6384", "#009688", "#c45850"], "chartsData": [5, 10, 22, 3], "chartType": "pie", "displayLegend": "true" }

                        //store the below parameters as global variable,
                        // so that it can be used while displaying the charts in modal.
                        chartData = (response[i].custom.data)
                        title = chartData.title;
                        labels = chartData.labels;
                        backgroundColor = chartData.backgroundColor;
                        chartsData = chartData.chartsData;
                        chartType = chartData.chartType;
                        displayLegend = chartData.displayLegend;

                        // pass the above variable to createChart function
                        createChart(title, labels, backgroundColor, chartsData, chartType, displayLegend)
                        return;
                    }

                    //check of the custom payload type is "collapsible"
                    if (response[i].custom.payload == "collapsible") {
                        data = (response[i].custom.data);
                        //pass the data variable to createCollapsible function
                        createCollapsible(data);
                    }
                }
                console.log("Count Before", count)
                count=count+1
                console.log("count Inside ", count)
//                if(btn_clicked == true)
//                {
//                console.log("under if condition ");
//                console.log("Count after button clicked ",count);
//                if (count ==0){
//
//                $('#not').hide();
//                }
//                $('#not').html(count);
//                audio.play();
//                }
//          if(btn_clicked==true)
//     {    count=0
//          $('#not').hide();
//          console.log("Button Clicked True");
//     }
          if(btn_clicked==false)
     {   if (count != 0)
        {
          $('#not').show();
          console.log(count);
          $('#not').html(count);
          audio.play();
//          document.getElementById('alarm').muted = false;
//          document.getElementById('alarm').play();

          console.log("Buttom clicked False");
        }
     }
     else
     {

     count=0
          $('#not').hide();
          console.log("Button Clicked True");

     }


            }
            scrollToBottomOfResults();
        }
    }, 500);
}

//====================================== Toggle chatbot =======================================
$("#profile_div").click(function() {
    count=0;
    btn_clicked=true;
//    count=0;

    $(".profile_div").toggle();
    $(".widget").show();
    scrollToBottomOfResults();
    count=0;
    $('#not').hide();
    console.log("show in function")
    $('#userInput').focus();
});


//====================================== Render Pdf attachment =======================================
function renderPdfAttachment(data) {
    pdf_url = data.custom.url;
    pdf_title = data.custom.title;
    pdf_attachment =
        '<div class="pdf_attachment">' +
        '<div class="row">' +
        '<div class="col s3 pdf_icon"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></div>' +
        '<div class="col s9 pdf_link">' +
        '<a href="' + pdf_url + '" target="_blank">' + pdf_title + ' </a>' +
        '</div>' +
        '</div>' +
        '</div>'
    $(".chats").append(pdf_attachment);
    scrollToBottomOfResults();

}



//====================================== DropDown ==================================================
//render the dropdown messageand handle user selection
function renderDropDwon(data) {
    var options = "";
    for (i = 0; i < data.length; i++) {
        options += '<option value="' + data[i].value + '">' + data[i].label + '</option>'
    }
    var select = '<div class="dropDownMsg"><select class="browser-default dropDownSelect"> <option value="" disabled selected>Choose your option</option>' + options + '</select></div>'
    $(".chats").append(select);
    scrollToBottomOfResults();

    //add event handler if user selects a option.
    $("select").change(function() {
        var value = ""
        var label = ""
        $("select option:selected").each(function() {
            label += $(this).text();
            value += $(this).val();
        });

        setUserResponse(label);
        send(value);
        $(".dropDownMsg").remove();
    });
}

//====================================== Suggestions ===========================================

function addSuggestion(textToAdd) {
    setTimeout(function() {
        var suggestions = textToAdd;
        console.log("suggestions", textToAdd);
        var suggLength = textToAdd.length;
        console.log("suggestion Length ",suggLength);
        $(' <div class="singleCard"> <div class="suggestions"><div class="menu"></div></div></diV>').appendTo(".chats").hide().fadeIn(1000);
        // Loop through suggestions
        for (i = 0; i < suggLength; i++) {
            $('<div class="menuChips" data-payload=\'' + (suggestions[i].payload) + '\'>' + suggestions[i].title + "</div>").appendTo(".menu");
        }
        scrollToBottomOfResults();
        $("#userInput" ).hide();
    }, 1000);
}

// on click of suggestions, get the value and send to rasa
$(document).on("click", ".menu .menuChips", function() {
    var text = this.innerText;
    var payload = this.getAttribute('data-payload');
    console.log("payload: ", this.getAttribute('data-payload'))
    setUserResponse(text);
    send(payload);

    //delete the suggestions once user click on it
    $(".suggestions").remove();
    $("#userInput" ).show();

});

//====================================== functions for drop-down menu of the bot  =========================================

//restart function to restart the conversation.
$("#btn-restart").click(function() {
    $("#btn-restart").toggleClass( "highlight" );
    restartConversation()
//    recognition.stop()
    $("#userInput" ).show();
   $('#userInput').focus();
});

//clear function to clear the chat contents of the widget.
$("#clear").click(function() {
    $(".chats").fadeOut("normal", function() {
        $(".chats").html("");
        $(".chats").fadeIn();
    });
});

$("#clear").click(function() {
    $(".chats").fadeOut("normal", function() {
        $(".chats").html("");
        $(".chats").fadeIn();
    });
});



//close function to close the widget.

$("#btn-close").click(function() {
    btn_clicked=false;
//    count=0;
    $(".profile_div").toggle();
    $(".widget").hide();
    $('#not').html(count);
    console.log("hide in function")
    scrollToBottomOfResults();

});


//
//$("#chat_head").click(function() {
//    $(".profile_div").toggle();
//    $(".widget").toggle();
//    scrollToBottomOfResults();
//});


//====================================== Cards Carousel =========================================
//====================================== Cards Carousel =========================================

//====================================== Cards Carousel =========================================
function createCardsCarousel(cardsData) {
  let cards = "";
  for (let i = 0; i < cardsData.length; i += 1) {
    const title = cardsData[i];
    const ratings = `${Math.round((cardsData[i].ratings / 5) * 100)}%`;
    const item = `<div class="carousel_cards in-left">
    <img class="cardBackgroundImage" src="satyamaevjayte.png">
    <div class="cardFooter">
    <div class="cardsButtons" >
        <input class="favorite styled" style="
              transition: all .5s ease;
              top:-2px;
      display: block;
      box-sizing: border-box;
      height:50%
      margin: 0 auto;
      width: 100%;
      height:100%;
      max-width: 200px;
    background-color : transparent;
      border-radius: 1px;
      color: #fff;
      text-align: center;
      text-decoration: none;
      letter-spacing: 1px;
      transition: all 0.3s ease-out;
      position: relative;
      border: none;
      white-space: normal;





    "type="button" id="btn" value="${title}" onclick="msg(value)">
    </div></div></div>`;

    cards += item;
  }

  const cardContents = `<div id="paginated_cards" class="cards"> <div class="cards_scroller">${cards} <span class="arrow prev fa fa-chevron-circle-left "></span> <span class="arrow next fa fa-chevron-circle-right" ></span> </div> </div>`;
  return cardContents;
}
//
function msg(value) {
// value=document.getElementById("btn").value;

 $(".cards").remove();
//value.appendTo(".chats").show();
 send(value);
}

/**
 * appends cards carousel on to the chat screen
 * @param {Array} cardsToAdd json array
 */
function showCardsCarousel(cardsToAdd) {
  const cards = createCardsCarousel(cardsToAdd);

  $(cards).appendTo(".chats").show();

  if (cardsToAdd.length <= 2) {
    $(`.cards_scroller>div.carousel_cards:nth-of-type(${i})`).fadeIn(3000);
  } else {
    for (let i = 0; i < cardsToAdd.length; i += 1) {
      $(`.cards_scroller>div.carousel_cards:nth-of-type(${i})`).fadeIn(3000);
    }
    $(".cards .arrow.prev").fadeIn("3000");
    $(".cards .arrow.next").fadeIn("3000");
  }

  scrollToBottomOfResults();

  const card = document.querySelector("#paginated_cards");
  const card_scroller = card.querySelector(".cards_scroller");
  const card_item_size = 225;

  /**
   * For paginated scrolling, simply scroll the card one item in the given
   * direction and let css scroll snaping handle the specific alignment.
   */
  function scrollToNextPage() {
    card_scroller.scrollBy(card_item_size, 0);
  }

  function scrollToPrevPage() {
    card_scroller.scrollBy(-card_item_size, 0);
  }

  card.querySelector(".arrow.next").addEventListener("click", scrollToNextPage);
  card.querySelector(".arrow.prev").addEventListener("click", scrollToPrevPage);
}

//====================================== Quick Replies ==================================================

function showQuickReplies(quickRepliesData) {
    var chips = ""
    for (i = 0; i < quickRepliesData.length; i++) {
        var chip = '<div class="chip" data-payload=\'' + (quickRepliesData[i].payload) + '\'>' + quickRepliesData[i].title + '</div>'
        chips += (chip)
    }

    var quickReplies = '<div class="quickReplies">' + chips + '</div><div class="clearfix"></div>'
    $(quickReplies).appendTo(".chats").fadeIn(1000);
    scrollToBottomOfResults();
    const slider = document.querySelector('.quickReplies');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 3; //scroll-fast
        slider.scrollLeft = scrollLeft - walk;
    });

}

// on click of quickreplies, get the value and send to rasa
$(document).on("click", ".quickReplies .chip", function() {
    var text = this.innerText;
    var payload = this.getAttribute('data-payload');
    console.log("chip payload: ", this.getAttribute('data-payload'))
    setUserResponse(text);
    send(payload);

    //delete the quickreplies
    $(".quickReplies").remove();

});

//====================================== Get User Location ==================================================
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getUserPosition, handleLocationAccessError);
    } else {
        response = "Geolocation is not supported by this browser.";
    }
}

function getFeedback()
{
Feedback=('<div class="app"><h3>How was the chat?</h3><p>Let us know your valuable feedback</p><div class="container"><div class="item"><label for="0"><input class="radio" type="radio" name="feedback" id="0" value="0"><span>&#129324;</span></label></div>  <div class="item"><label for="1"><input class="radio" type="radio" name="feedback" id="1" value="1"><span>&#128533;</span></label></div>  <div class="item"><label for="2"><input class="radio" type="radio" name="feedback" id="2" value="2"><span>&#128566;</span></label></div>   <div class="item"><label for="3"><input class="radio" type="radio" name="feedback" id="3" value="3"><span>&#128516;</span></label></div>  <div class="item"><label for="4"><input class="radio" type="radio" name="feedback" id="4" value="4"><span>&#128525;</span></label></div> </div></div>')
$(Feedback).appendTo(".chats").hide().fadeIn(1000);
}




function getdate() {

$('<div id="calender"><div class="container"><div class="panel panel-primary"><div class="panel-heading">Schedule an Appointment</div><div class="col-md-6"><div class="form-group"><div class="input-group date" id="datetimepicker1"><input type="text" class="form-control" /><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div><input type="submit" id="sub" class="btn btn-primary" value="Submit"></di  v></div></div></div></div></div></div>').appendTo(".chats").hide().fadeIn(1000);
 scrollToBottomOfResults();
 console.log("Date time construction");

 $('#datetimepicker1').datetimepicker();

  $("#sub").click(function(){
    var dat= $("input:text").val();
    setUserResponse(dat);
    scrollToBottomOfResults();

    send(dat);
//    showBotTyping();

   $("#calender").remove();

  });
//  $( "#userInput" ).autocomplete({
//  autoFocus: true
//});
}

function getlinks(links)
{
  var result = links.link(links);
  var project_links = '<img class="botAvatar" src="satyamaevjayte.png"/><p class="botMsg"><b>' + result + '</b></p><div class="clearfix"></div>';
                    $(project_links).appendTo(".chats").hide().fadeIn(1000);
}


function getGif(){

showBotTyping();

var gif=$('<div class="tenor-gif-embed" data-postid="17895561" data-share-method="host" data-width="100%" data-aspect-ratio="1.0"><a href="https://tenor.com/view/star-gold-entertainment-bollywood-covid19-corona-gif-17895561">Star Gold Entertainment GIF</a> from <a href="https://tenor.com/search/stargold-gifs">Stargold GIFs</a></div><script type="text/javascript" async src="https://tenor.com/embed.js"></script>').appendTo(".chats").hide().fadeIn(1000);
           response="gif from rasa";
//           send(response);
           scrollToBottomOfResults();
}



function getUserPosition(position) {
    response = "Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude;
    console.log("location: ", response);

    //here you add the intent which you want to trigger
    response = '/inform{"latitude":' + position.coords.latitude + ',"longitude":' + position.coords.longitude + '}';
    $("#userInput").prop('disabled', false);
    send(response);
    showBotTyping();
}

function handleLocationAccessError(error) {

    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.")
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.")
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.")
            break;
    }

    response = '/inform{"user_location":"deny"}';
    send(response);
    showBotTyping();
    $(".usrInput").val("");
    $("#userInput").prop('disabled', false);


}

//======================================bot typing animation ======================================
function showBotTyping() {

    var botTyping = '<img class="botAvatar" id="botAvatar" src="satyamaevjayte.png"/><div class="botTyping">' + '<div class="bounce1"></div>' + '<div class="bounce2"></div>' + '<div class="bounce3"></div>' + '</div>'
    $(botTyping).appendTo(".chats");
    $('.botTyping').show();
    scrollToBottomOfResults();
}

function hideBotTyping() {
    $('#botAvatar').remove();
    $('.botTyping').remove();
}

//====================================== Collapsible =========================================

// function to create collapsible,
// for more info refer:https://materializecss.com/collapsible.html
function createCollapsible(data) {
    //sample data format:
    //var data=[{"title":"abc","description":"xyz"},{"title":"pqr","description":"jkl"}]
    list = "";
    for (i = 0; i < data.length; i++) {
        item = '<li>' +
            '<div class="collapsible-header">' + data[i].title + '</div>' +
            '<div class="collapsible-body"><span>' + data[i].description + '</span></div>' +
            '</li>'
        list += item;
    }
    var contents = '<ul class="collapsible">' + list + '</uL>';
    $(contents).appendTo(".chats");

    // initialize the collapsible
    $('.collapsible').collapsible();
    scrollToBottomOfResults();
}


//====================================== creating Charts ======================================

//function to create the charts & render it to the canvas
function createChart(title, labels, backgroundColor, chartsData, chartType, displayLegend) {

    //create the ".chart-container" div that will render the charts in canvas as required by charts.js,
    // for more info. refer: https://www.chartjs.org/docs/latest/getting-started/usage.html
    var html = '<div class="chart-container"> <span class="modal-trigger" id="expand" title="expand" href="#modal1"><i class="fa fa-external-link" aria-hidden="true"></i></span> <canvas id="chat-chart" ></canvas> </div> <div class="clearfix"></div>'
    $(html).appendTo('.chats');

    //create the context that will draw the charts over the canvas in the ".chart-container" div
    var ctx = $('#chat-chart');

    // Once you have the element or context, instantiate the chart-type by passing the configuration,
    //for more info. refer: https://www.chartjs.org/docs/latest/configuration/
    var data = {
        labels: labels,
        datasets: [{
            label: title,
            backgroundColor: backgroundColor,
            data: chartsData,
            fill: false
        }]
    };
    var options = {
        title: {
            display: true,
            text: title
        },
        layout: {
            padding: {
                left: 5,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
        legend: {
            display: displayLegend,
            position: "right",
            labels: {
                boxWidth: 5,
                fontSize: 10
            }
        }
    }

    //draw the chart by passing the configuration
    chatChart = new Chart(ctx, {
        type: chartType,
        data: data,
        options: options
    });

    scrollToBottomOfResults();
}

// on click of expand button, get the chart data from gloabl variable & render it to modal
$(document).on("click", "#expand", function() {

    //the parameters are declared gloabally while we get the charts data from rasa.
    createChartinModal(title, labels, backgroundColor, chartsData, chartType, displayLegend)
});

//function to render the charts in the modal
function createChartinModal(title, labels, backgroundColor, chartsData, chartType, displayLegend) {
    //if you want to display the charts in modal, make sure you have configured the modal in index.html
    //create the context that will draw the charts over the canvas in the "#modal-chart" div of the modal
    var ctx = $('#modal-chart');

    // Once you have the element or context, instantiate the chart-type by passing the configuration,
    //for more info. refer: https://www.chartjs.org/docs/latest/configuration/
    var data = {
        labels: labels,
        datasets: [{
            label: title,
            backgroundColor: backgroundColor,
            data: chartsData,
            fill: false
        }]
    };
    var options = {
        title: {
            display: true,
            text: title
        },
        layout: {
            padding: {
                left: 5,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
        legend: {
            display: displayLegend,
            position: "right"
        },

    }

    modalChart = new Chart(ctx, {
        type: chartType,
        data: data,
        options: options
    });

}
