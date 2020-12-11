$(document).ready(function () {
    /* User statistics fields */
    var path = [];
    var clueCount = 0;
    var helpCount = 0;
    var popupBoxCount = 0;

    /*array of objects: {time: x, question: y}*/
    var timePerQuestion = [];

    /*Counts the number of times that a user updates their choice per question */
    var selectCount = 0;
    var selectCountPerQuestion = [];

    var timePerComment = [];
    /* number of times that the user read the prompt per question: {count: x, question: y} */
    var prevCount = 0;
    var readPrompt = [];

    var totalTime = 0;
    
    /* End  */
    

    let mapQuestions = new Map();
    initQMap(mapQuestions);

    let mapClues = new Map();
    initCMap(mapClues);

    let mapCorrect = new Map();
    initCorrectMap(mapCorrect);

    let mapPopup = new Map();
    initPMap(mapPopup);

    var currentDisplay = "div.introMessage";

    var sendBack = ["q6", "q27", "q28", "q30", "q32", "q38", "q39"];
    var prompt = document.createElement("div");
    prompt.className = "hidden";
    prompt.id = "questionPrompt";

    var choice = document.createElement("div");
    choice.className = "hidden";
    choice.id = "choiceOptions"

    /*account for padding */
    var displayOff = $("div.displayMessage").offset();

    var prevDisplay = "";

    /*points to the default root node */
    var currentQuestion = "q0";

    var currentChoice = "";

    var currentClue = "";

    var currentNote = "";

    var decisionCounter = 1;

    var startTimeQuestion = 0;
    var endTimeQuestion = 0;

    var startTimeSimulation = $.now();
    var endTimeSimulation = $.now();
    //alert(startTimeSimulation);
    //var endTimeSimulation = 0;

    var startHover = 0;
    var endHover = 0;

    //document.getElementById("textNotification").play();
    // var audio = new Audio("../audio/explosion.mp3");
    var audio = document.createElement("audio")
    document.body.appendChild(audio);
    audio.src = "../audio/notification.wav";

    var audioExplosion = document.createElement("audio")
    document.body.appendChild(audioExplosion);
    audioExplosion.src = "../audio/explosion.mp3";
    //document.getElementById("​explosion");
    $("body").click(function () {
        // audio.play()
    });

    $("#startButton").click(function () {
        $("#startButton").fadeOut("fast");
        $("#clue-0").fadeOut("fast");
        removeIcon();
        $("div.introMessage").fadeOut("slow", function () {
            $(prompt).prepend("<h2>Decision #1</h2><br>")
            $("#q1").removeClass("hidden");
            $("#q1").appendTo(prompt);
            $(prompt).appendTo("div.displayMessage");

            $(prompt).fadeIn("slow");
            $("#continueButton").fadeIn("slow");
            currentDisplay = "#" + prompt.id;
            startTimeQuestion = $.now();
            currentQuestion = "q1";
        });
    });

    $("#startButton").hover(function () {
        $(this).addClass("highlight");
    }, function () {
        $(this).removeClass("highlight");
    });

    $("#continueButton").click(function () {
        $(currentDisplay).fadeOut("fast", function () {
            var loaded = 0;
            if (prevDisplay != "") {
                loaded = 1;
            }
            prevDisplay = $(currentDisplay).detach();
            if (!loaded) {
                if($.inArray(sendBack) < 0){
                    $(choice).prepend("<h2>Make Your Decision</h2><br>");
                }
                else{
                    $(choice).prepend("<h2>Click submit to continue simulation</h2><br>");
                }
                /*Get choice mappings for the current question */
                var choiceMappings = mapQuestions.get(currentQuestion);
                choiceMappings.forEach(function (element, index) {
                    var c = element.choice;
                    $(c).removeClass("hidden");
                    $(c).appendTo(choice);
                    //$("#"+possibleChoices[index]).removeClass("hidden");
                    $("<br><br>").appendTo(choice);
                    //$("#"+ possibleChoices[index]).appendTo(choice);
                });
            }
            removeIcon();
            $(choice).appendTo("div.displayMessage");
            $(choice).fadeIn("slow");
            $("#continueButton").fadeOut("fast", function () {
                $("#submitButton").fadeIn("slow");
                $("#prevButton").fadeIn("slow");
            });
        });

        //alert("go to the options");
    });

    $("#continueButton").hover(function () {
        $(this).addClass("highlight");
    }, function () {
        $(this).removeClass("highlight");
    });

    /* Selecting a choice option */
    $("div.optionBoxes").click(function () {
        selectCount++;
        $("div.optionBoxes").css("background-color", "yellowgreen");
        $(this).css("background-color", "#3d423d");

        currentChoice = $(this).html();

    });

    /* Highlight a choice option when hovering*/
    $("div.optionBoxes").hover(function () {
        $(this).addClass("highlight");
        //prevColor = color;
    }, function () {
        $(this).removeClass("highlight");
    });

    var end = ["q25", "q34", "q36", "q37"];
    var defaultOptions = ["q6", "q27", "q28", "q30", "q32", "q38", "q39", "q25", "q34", "q36", "q37"];
    $("#submitButton").click(function () {
        if ($.inArray(currentQuestion, defaultOptions) >= 0) {
            currentChoice = "a";
        }
        if (currentChoice == "") {
            alert(currentQuestion + ": Invalid submission. Please enter a choice before submitting");
            return;
        }

        removeIcon();
        var t = {
            count: prevCount,
            question: currentQuestion
        };
        readPrompt.push(JSON.stringify(t));
        
        endTimeQuestion = $.now();
        var timeLapsed = ((endTimeQuestion - startTimeQuestion)/1000);
        var t2 ={
            time: timeLapsed,
            question: currentQuestion
        };
        timePerQuestion.push(JSON.stringify(t2));

        var t3 ={
            count: selectCount,
            question: currentQuestion
        };
        selectCountPerQuestion.push(JSON.stringify(t3));

        prevCount = 0;
        var correctChoice = mapCorrect.get(currentQuestion);

        /* see if there is a correct answer / note for the student*/
        if (correctChoice) {
            if (currentChoice != correctChoice.correct) {
                currentNote = correctChoice.note;
                audio.play();
                //need to add the associated note from the object returned from the map

                $("#" + correctChoice.note).fadeIn();
                $(".choiceAnalysis").fadeIn("fast");
                $(".choiceAnalysis").animate({
                    height: "55%"
                }, 1700);
            }

        }
        
        var next = getNextQ();

        if($.inArray(next, path) >= 0){
            alert(path);
        }
        path.push(next);


        $(choice).fadeOut("fast", function () {
            // var newMessage = document.createElement("div");
            // newMessage.className = "hidden";
            // newMessage.id = "message";
            //in seconds 
            // alert(timeLapsed);
            $(prompt).empty();
            if(next != "q13" && $.inArray(next, end) < 0){
                $(prompt).prepend("<h2>Decision #" + (++decisionCounter));
            }

            if($.inArray(next, end) >= 0 ){
                endSimulationDefault();
                return;
            }
            $("#" + next).removeClass("hidden");
            $("#" + next).appendTo(prompt);
            $(prompt).appendTo("div.displayMessage");

            $(prompt).fadeIn("slow");
            $("#prevButton").fadeOut("fast");
            $("#submitButton").fadeOut("fast", function () {
                /*END BRANCH */
                if(next != "q13"){
                    $("#continueButton").fadeIn("slow");
                    startTimeQuestion = $.now();
                }
                else{
                    setTimeout(endSimulation, 7000);
                }
            });

        });
        $("div.optionBoxes").css("background-color", "yellowgreen");
        //  $("div.optionBoxes").addClass("hidden");
        $(choice).empty();
        prevDisplay = "";
        currentChoice = "";
        currentQuestion = next;
        selectCount = 0;
        // removeIcon();
        if (currentClue != "") {
            $("#" + currentClue).fadeOut("fast");
        }
        //need to figure out the next question to map to and load into prompt and make that the screen
    });
    $("#submitButton").hover(function () {
        $(this).addClass("highlight");
    }, function () {
        $(this).removeClass("highlight");
    });

    $("#prevButton").click(function () {
        prevCount++;
        $(choice).fadeOut("fast", function () {
            $(prompt).appendTo("div.displayMessage");
            $(prompt).fadeIn("slow");
            $("#prevButton").fadeOut("fast");
            $("#submitButton").fadeOut("fast", function () {
                $("#continueButton").fadeIn("slow");
            });
        });
        //  alert("go back to the decision info");
    });

    $("#prevButton").hover(function () {
        $(this).addClass("highlight");
    }, function () {
        $(this).removeClass("highlight");
    });



    function getNextQ() {
        var choiceMappings = mapQuestions.get(currentQuestion);
        var ret = "";
        choiceMappings.forEach(function (element, index) {
            if (element.choice[1] == currentChoice) {
                ret = element.branch;
            }
        });
        return ret;
    }

    $("#bookIcon").click(function () {
        // $("div.clue").appendTo(prompt);
        if ($("div.clue").css("display") == "none") {
            $(currentDisplay).addClass("blur");
            $(prompt).addClass("blur");
            $(choice).addClass("blur");

            clueCount++;
            //need to map the question to a clue id to display 
            //display, no clues for this decision
            var c = mapClues.get(currentQuestion);
            if (c) {
                // alert(c);
                if ($("#defaultClue").css("display") != "none") {
                    $("#defaultClue").fadeOut(0);
                }
                $("#" + c).fadeIn(0);
                currentClue = c;
            }
            else {
                if (currentDisplay != "div.introMessage") {
                    $("#defaultClue").fadeIn(0);
                    currentClue = "defaultClue";
                }
            }
            resetHelpBack();
            $("div.help").fadeOut("fast", function () {
                $("div.clue").fadeIn("fast");
            });
        }
        else {
            removeIcon();
        }
    });

    $("#helpIcon").click(function () {
        if ($("div.back").css("display") == "none") {
            if ($("div.front").css("display") == "none") {
                helpCount++
                $(currentDisplay).addClass("blur");
                $(prompt).addClass("blur");
                $(choice).addClass("blur");
                $("div.clue").fadeOut("fast", function () {
                    $("div.front").fadeIn("fast");
                });
                return;
            }
        }
        removeIcon();

    });

    $("div.closeIcon").click(function () {
        // alert("you want to close?");
        $("#" + currentNote).fadeOut("fast");
        $(".choiceAnalysis").animate({
            height: "0%"
        }, 1700);
        $(".choiceAnalysis").fadeOut(0);
    });

    var offsetTarget = "";
    var offsetBox = "";
    var position = "";
    var popupMessage = "";
    $("span.popupText").hover(function (e) {
        startHover = $.now();
        var curr_id = $(this).attr("id");
        offsetTarget = $(this).offset();
        offsetBox = $("div.popupBox").offset();
        position = $("div.popupBox").position();
        var w = $(this).width();
        var w2 = $("div.popupBox").width();
        var w3 = $("div.displayMessage").width();
        /*compute position */
        var l = (offsetTarget.left - offsetBox.left + w + 10);

        if (l + w2 > (displayOff.left) + w3) {
            l -= (w + w2);
        }
        var t = (offsetTarget.top - offsetBox.top) / 2;
        // var id = $(this).attr("id");
        $("div.popupBox").addClass("borderStyle");

        popupMessage = mapPopup.get(curr_id);
        if (popupMessage) {
            $("#" + popupMessage).fadeIn(0);
        }
        else{
            alert("no message");
        }

        //need to get the mapped information for the pop-up box 
        $("div.popupBox").animate({
            height: "60%",
            top: t,
            left: l
        }, 0);
    }, function (e) {
        //hover out
        endHover = $.now();
        var curr_id = $(this).attr("id");
        popupMessage = mapPopup.get(curr_id);
        
        var t = {
            time: (endHover - startHover)/1000, 
            id: popupMessage
        };
        timePerComment.push(JSON.stringify(t));
        //alert(endHover);
        popupBoxCount++;

        $("div.popupbox").removeClass("borderStyle");

        if (popupMessage != "") {
            $("#" + popupMessage).fadeOut(0, function () {
                $("div.popupBox").animate({
                    height: "0%",
                    top: 10,
                    left: 10
                }, 0);
            });
        }
        else {
            $("div.popupBox").animate({
                height: "0%",
                top: 10,
                left: 10
            }, 0);
        }
        popupMessage = "";
        //need to unanimate
    });

    $("#arrow").click(function () {
        $("div.front").fadeOut("fast");
        $("div.back").fadeIn(0);
        $("div.back").animate({
            left: "100px",
            width: "75%"
        }, 1500, function () {
            $("#helpText").fadeIn("slow");
        });

    });

    $("div.displayMessage").click(function () {
        removeIcon();
    });

    function removeIcon() {
        resetHelpBack();
        $("div.clue").fadeOut("fast", function () {
            $(currentDisplay).removeClass("blur");
            $(prompt).removeClass("blur");
            $(choice).removeClass("blur");
        });
    }

    function resetHelpBack() {
        $("div.help").fadeOut("fast");
        $("div.back").animate({
            left: "250px",
            width: "300px"
        });
        $("#helpText").fadeOut("slow");
    }
    
    function endSimulationDefault(){
        endTimeSimulation = $.now();
        totalTime = (endTimeSimulation - startTimeSimulation)/1000;
        $("<p>Thank you for participating in this simulation. Please click end simulation to complete your session. </p>").appendTo("div.displayMessage");
        $("#prevButton").fadeOut("fast");
        $("#submitButton").fadeOut("fast", function(){
            $("#btn-finish").fadeIn("fast");
        });
    }

    function endSimulation(){
        audioExplosion.play();
        endTimeSimulation = $.now();
        totalTime = (endTimeSimulation - startTimeSimulation)/1000;
        $("#beirutExplosion").appendTo("div.displayMessage");
        $("#beirutExplosion").fadeIn("slow");
        $("<p>Thank you for participating in this simulation. Please click end simulation to complete your session. </p>").appendTo("div.displayMessage");
        $("#prevButton").fadeOut("fast");
        $("#submitButton").fadeOut("fast", function(){
            $("#btn-finish").fadeIn("fast");
        });

    }
    /*Consider storing this in a csv or JSON file and import */
    function initQMap(m) {
        /*notations are as following per question {[choice option][question number], corresponding branch of choice} */
        m.set("q1", [{ choice: "#a1", branch: "q2" }, { choice: "#b1", branch: "q15" }]); //b -->q15
        m.set("q2", [{ choice: "#a2", branch: "q3" }, { choice: "#b2", branch: "q35" }, { choice: "#c2", branch: "q18" }]);
        m.set("q3", [{ choice: "#a3", branch: "q4" }, { choice: "#b3", branch: "q20" }, { choice: "#c3", branch: "q38" }]);
        m.set("q4", [{ choice: "#a4", branch: "q22" }, { choice: "#b4", branch: "q5" }, { choice: "#c4", branch: "q23" }]);
        m.set("q5", [{ choice: "#a5", branch: "q24" }, { choice: "#b5", branch: "q6" }]);
        m.set("q6", [{ choice: "#a6", branch: "q7" }]); //q6 does not have any choices 
        m.set("q7", [{ choice: "#a7", branch: "q8" }, { choice: "#b7", branch: "q26" }]);
        m.set("q8", [{ choice: "#a8", branch: "q9" }, { choice: "#b8", branch: "q28" }]);
        m.set("q9", [{ choice: "#a9", branch: "q29" }, { choice: "#b9", branch: "q10" }]);
        m.set("q10", [{ choice: "#a10", branch: "q39" }, { choice: "#b10", branch: "q11" }]);
        m.set("q11", [{ choice: "#a11", branch: "q39" }, { choice: "#b11", branch: "q12" }]);
        m.set("q12", [{ choice: "#a12", branch: "q34" }, { choice: "#b12", branch: "q33" }, { choice: "#c12", branch: "q13" }]);
        m.set("q13", [{ choice: "#a13", branch: "end" }]);
        //q14
        m.set("q15", [{ choice: "#a15", branch: "q18" }, { choice: "#b15", branch: "q16" }, { choice: "#c15", branch: "q17" }]);
        m.set("q16", [{ choice: "#a16", branch: "q3" }, { choice: "#b16", branch: "q17"}]);
        m.set("q17", [{ choice: "#a17", branch: "q3" }]); //update mapping
        m.set("q18", [{ choice: "#a18", branch: "q3" }, { choice: "#b18", branch: "q19"}]);
        m.set("q19", [{ choice: "#a19", branch: "q3" }, { choice: "#b19", branch: "end"}]);
        m.set("q20", [{ choice: "#a20", branch: "q4" }, { choice: "#b20", branch: "q37"}]);

        m.set("q21", [{ choice: "#a21", branch: "q4" }, { choice: "#b21", branch: "end"}]);
        m.set("q22", [{ choice: "#a22", branch: "q25" }, { choice: "#b22", branch: "q23"}, { choice: "#c22", branch: "q5"}]);
        m.set("q23", [{ choice: "#a23", branch: "q25" }, { choice: "#b23", branch: "q5"}]);
        m.set("q24", [{ choice: "#a24", branch: "q6" }, { choice: "#b24", branch: "q25"}]);
        m.set("q25", [{ choice: "#a25", branch: "end" }]);

        m.set("q26", [{ choice: "#a26", branch: "q8" }, { choice: "#b26", branch: "q25"}]);
        m.set("q27", [{ choice: "#a27", branch: "q8" }]);
        m.set("q28", [{ choice: "#a27", branch: "q9" }]);

        m.set("q29", [{ choice: "#a29", branch: "q10" }, { choice: "#b29", branch: "q30"}]);
        m.set("q30", [{ choice: "#a30", branch: "q10"}]);
        m.set("q31", [{ choice: "#a31", branch: "q39" }, { choice: "#b31", branch: "q40"}]);
        m.set("q32", [{ choice: "#a32", branch: "q12" }]);

        m.set("q34", [{ choice: "#a34", branch: "end" }]);
        m.set("q33", [{ choice: "#a33", branch: "q34" }, { choice: "#b33", branch: "q13"}]);
        m.set("q35", [{ choice: "#a35", branch: "q35-5" }, { choice: "#b35", branch: "q3"}]);
        m.set("q35-5", [{ choice: "#a35-5", branch: "q37" }, { choice: "#b35-5", branch: "q43"}]);
        m.set("q36", [{ choice: "#a36", branch: "end" }]);

        m.set("q37", [{ choice: "#a37", branch: "end" }]);
        m.set("q38", [{ choice: "#a38", branch: "q4" }]);
        m.set("q39", [{ choice: "#a39", branch: "q12" }]);
    }

    /* SPECIAL CASES: 
        -q25 is an end position 
        -q27 -- default returns to 8 
        -q28 - default returns to 9 
        -q30 - default returns to 10
        -q32 - default returns to 12 
        -q38 -- default returns to 4 
        -q39 -- default returns to 12 

        -q34 is an end position
        -q36 is an end position
        -q37 is an end position

    */
   function detachClueMap(m){

   }

    function initCMap(m) {
        m.set("q4", "clue-1");
        m.set("q9", "clue-2");
    }




    function initCorrectMap(m) {
        m.set("q1", { correct: "a", note: "n1" });
        m.set("q2", { correct: "a", note: "n2" });
        m.set("q3", { correct: "a", note: "n3" });
        // m.set("q4", "b");
        // m.set("q5", "b");
        // m.set("q7", "a");
        // m.set("q8", "a");
        // m.set("q9", "b");
        // m.set("q10", "b");
        // m.set("q11", "b");
        // m.set("q12", "c");

    }

    /*defines the div mappings for the pop-ups */
    function initPMap(m) {
        m.set("p1", "pop-up1");
        m.set("p2", "pop-up2");
        m.set("p3", "pop-up3");
        m.set("p4", "pop-up4");
    }

    (function(){
        $("#btn-finish").click(function(event){
            if(event){
                event.preventDefault();
            }
            // console.log(clueCount);
            // console.log(helpCount);
            // console.log(popupBoxCount);
            // console.log(totalTime);
            var user = {
                path: path.toString(),
                clues: clueCount, 
                helpers: helpCount, 
                popUps: popupBoxCount, 
                promptUse: readPrompt.toString(), 
                questions: timePerQuestion.toString(),
                sessionTime: totalTime,
                answerClick: selectCountPerQuestion.toString(),
                popupTime: timePerComment.toString()
            }
            // console.log("CAN FINISH THIS INSHALLAH");
            $.ajax({
                url: '/user',
                method: 'post',
                data: user,
                success: function(resp){
                    console.log("success: "+ JSON.stringify(resp));
                    $("#btn-finish").fadeOut("slow");
                },
                error: function(resp){

                }
            })
        });
    })()

}); 