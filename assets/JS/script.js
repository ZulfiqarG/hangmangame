// var doc = $('document')
var word = '';
var def = [];
var type = '';

var lives = 0;
var livesLeft = $('#livesLeft');
var livesImg = $('#hMan')

var btnEasy = $('#easy');
var btnNorm = $('#norm')
var btnHard = $('#hard');

var easyMode = false;
var normalMode = true;
var hardMode = false;

var newWordBtn = $('.newWord');
var wordSec = $('#wordSec');
var specChars = ' ';
var incLetts = new Set();




var i = 0;


$(btnEasy).click(function () {
    easyMode = true;
    normalMode = false;
    hardMode = false;
})
$(btnNorm).click(function () {
    easyMode = false;
    normalMode = true;
    hardMode = false;
})
$(btnHard).click(function () {
    easyMode = false;
    normalMode = false;
    hardMode = true
})





function setRemainingLives() {
    $(livesLeft).text(lives)
}
function startLives() {
    if (easyMode) {
        lives = 12
    };
    if (normalMode) {
        lives = 9
    };
    if (hardMode) {
        lives = 6
    };

}
function gameOver() {
    alert('game over');
    $(wordSec).empty();
    $(livesLeft).text('Lives');
    $(livesImg).attr('src', 'assets/Images/HM6.jpg');
    incLetts = new Set()
    $('#incorrect').empty()
}
function newWord() {
    /////////////////////////////////////////////////////////////////////////////////////GetWord
    $('#endGame').remove();
    const getWord = {
        "async": true,
        "crossDomain": true,
        "url": "https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMax=9",
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "4da867e0dcmshf5413d6cc321d0fp1ff473jsn6f3d5faf2ce2",
            "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
        }
    };
    $.ajax(getWord).done(function (wordResponse) {

        word = wordResponse.word;
        
        for (var C of word) {
            var n = C.search(/\s/);  ///////////////  /\s/ === Space Character
            if (n < 0 && C !== "-" && C !== ".") {
                $(wordSec).append(`
            <div class="letter">${C}</div>
            `)
            } else {
                $(wordSec).append(`
                <div class="letter correct" style="height:5%">${C}</div>`);
            }
        }
        //////////////////////////////////////////////////////////////////////////////////Get Definition
        const getDef = {
            "async": true,
            "crossDomain": true,
            "url": "https://wordsapiv1.p.rapidapi.com/words/" + word + "/definitions",
            "method": "GET",
            "headers": {
                "X-RapidAPI-Key": "4da867e0dcmshf5413d6cc321d0fp1ff473jsn6f3d5faf2ce2",
                "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
            }
        };

        $.ajax(getDef).done(function (defResponse) {
            def.length = 0;
            type = '';
            for (var defItem of defResponse.definitions) {
                def.push(defItem.definition)
            }
            // console.log(word)
            try {
                type = defItem.partOfSpeech

            } catch (e) {
            }

            if (def.length === 0) {
                def = ['No Definition apparently... How embarassing']
            }


        });

        $('#endGame').remove();
    });
    $(livesImg).attr('src', 'assets/Images/HM6.jpg');
    incLetts = new Set()
    $('#incorrect').empty()

}
///////////////////////////////////////////////////////////////////////NEW WORD BUTTON
$(document).on('click', '.newWord', (function () {
    $(wordSec).empty();
    // setRemainingLives();
    newWord();
    startLives();
    setRemainingLives();
}))
//////////////////////////////////////////////////////////////////////KEYPRESS LISTENER
$(document).keydown(function (event) {
    /////////////////////////////////////////////////////////////NON-LETTER KEYS
 
    if (event.keyCode < 65 || event.keyCode > 90) {
        
        return
    }
    var key = event.originalEvent.key;
    var letters = $('.letter');

    /////////////////////////////////////////////////////////////////Check Input Correct
    for (var L of letters) {
        if (L.innerText === key.toUpperCase()) {
            $(L).addClass('correct');
        }
    }
    /////////////////////////////////////////////////////////////////////////Win State
    if ($('.correct').length === $('.letter').length && word.length > 0) {
        
        $(document.body).prepend(
            `<section id="endGame">
            <h4 class="EGItmes" id="type">${type}</h4>
                <h1 class="EGItems" id="word">${word}</h1>
                <ol id="defList"></ol>
        <button class="newWord">New Word</button>
      </section > `
        )
        for (Item of def) {

            $('#endGame').append(
                "-", Item,
                '<br>',
                '<br>'

            )
        }
    }

    if (word.indexOf(key) === -1 && incLetts.has(key) === false && word.length > 0) {
        
        lives = lives - 1;
        setRemainingLives();
        $('#incorrect').append(`<div class="inc">${key}</div>`);
        incLetts.add(key);
        

    }



    if (lives === 5) {
        $(livesImg).attr('src', 'assets/Images/HM5.jpg')
    }
    if (lives === 4) {
        $(livesImg).attr('src', 'assets/Images/HM4.jpg')
    }
    if (lives === 3) {
        $(livesImg).attr('src', 'assets/Images/HM3.jpg')
    }
    if (lives === 2) {
        $(livesImg).attr('src', 'assets/Images/HM2.jpg')
    }
    if (lives === 1) {
        $(livesImg).attr('src', 'assets/Images/HM1.jpg')
    }
    if (lives === 0 && word.length > 0) {
        
        gameOver();
    }
})

