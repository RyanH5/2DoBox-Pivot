window.onload = function() {
  loadCard();
  $('#input-title').focus();
  $('#submit-btn').prop('disabled', true);
}

/*Event Listeners*/

//Input fields keyup
$('.input-fields').on('keyup', function() {
  toggleButtonDisabled();
})

//Submit button click
$('#submit-btn').on('click', function(event) { 
  event.preventDefault();
  var newCard = new Card($('#input-title').val(), $('#input-body').val());
  prependCard(newCard);
  addToStorage(newCard);
  console.log(newCard)
  $('.input-fields').val('');
});

//Search input keyup
$('#search').on('keyup', function() {
 var searchRequest = $('#search').val();
 $('.newArticle').each(function() {
   var searchResult = $(this).text().indexOf(searchRequest);
   this.style.display = searchResult > -1 ? "" : "none";
 })
});

//Click on idea title and body elements
// $(prepend).on('click', ideaTextElements, function() {
//   $(this).attr('contenteditable','true');
//   $(this).keypress(function(event) {
//     if(event.which == 13){
//       var itemID = $(this).parent().attr('id');
//       var quality = $(this).parent().attr('quality');
//       if ($(this).hasClass('idea-title')) {
//         var $title = $(this).text();
//         var $body = $(this).siblings('.idea-body').text();
//       } else {
//         var $title = $(this).siblings('.idea-title').text();
//         var $body = $(this).text();
//       }
//       var updatedValues = {
//         id: itemID,
//         title: $title,
//         body: $body,
//         quality: quality
//       }
//       var stringifiedUpdatedIdea = JSON.stringify(updatedValues);
//       localStorage.setItem(itemID, stringifiedUpdatedIdea);
//       $(this).blur();
//     };
//   });
// });


//Delete button click
$('.prepend').on('click', '.delete-btn', function () {
  $(this).parent('.newArticle').remove();
  console.log(34)
  var key = $(this).parent().attr('id');
  localStorage.removeItem(key);
})

// upvote button

$('.prepend').on('click', '.upvote-btn', function(e) {
  var qualityArray = ['swill', 'plausible', 'genius'];
  var key = $(this).parent().attr('id');
  var upQuality = localStorage.getItem(key);
  var upQualityParse = JSON.parse(upQuality);
    if ($(this).siblings('.quality-value').text() === 'swill')  {
      $(this).siblings('.quality-value').text(qualityArray[1]);
      upQualityParse.qualityNumber = 1;
    } else if ($(this).siblings('.quality-value').text() === 'plausible') {
      $(this).siblings('.quality-value').text(qualityArray[2])
      upQualityParse.qualityNumber = 2;
    }
    var stringifyQuality = JSON.stringify(upQualityParse);
    localStorage.setItem(key, stringifyQuality)
});

//Down vote click
$('.prepend').on('click', '.downvote-btn', function(e) {
  var qualityArray = ['swill', 'plausible', 'genius'];
  var key = $(this).parent().attr('id');
  var downQuality = localStorage.getItem(key);
  var downQualityParse = JSON.parse(downQuality);
    if ($(this).siblings('.quality-value').text() === 'genius') {
      $(this).siblings('.quality-value').text(qualityArray[1]);
      downQualityParse.qualityNumber = 1;
    } else if ($(this).siblings('.quality-value').text() === 'plausible') {
      $(this).siblings('.quality-value').text(qualityArray[0]);
      downQualityParse.qualityNumber = 0;
    }
    var stringifyQuality = JSON.stringify(downQualityParse);
    localStorage.setItem(key, stringifyQuality)
  })

/*Functions*/

/*Add Constructor function and prototype with template literal*/
function Card (title, body) {
  this.title = title;
  this.body = body;
  this.uniqueId = $.now();
  this.quality = ['swill', 'plausible', 'genius'];
  this.qualityNumber = 0;
};

function prependCard (Card) {
  // var titleInput = $('#input-title').val();
  // var bodyInput = $('#input-body').val();
  $('.prepend').prepend(`
    <article class="newArticle" id=${Card.uniqueId} >
    <h2 class="card-input-title">${Card.title}</h2>
    <input type="image" src="images/delete.svg" class="delete-btn" value="X">
    <p class="card-input-body">${Card.body}</p>
    <input type="image" src="images/upvote.svg" class="upvote-btn" alt="upvote-button">
    <input type="image" src="images/downvote.svg" class="downvote-btn" alt="downvote-button">
    <p class="quality-title">quality:</p>
    <p class="quality-value">${Card.quality[Card.qualityNumber]}</p>
    <hr>
    </article>`)
  $('#input-title').focus();
};

function addToStorage(object) {
  var stringObj = JSON.stringify(object);
  localStorage.setItem(object.uniqueId, stringObj);

};

function loadCard() {
  for (i=0; i < localStorage.length; i++) {
    var getObject = localStorage.getItem(localStorage.key(i));
    var loadObject = JSON.parse(getObject);
    // var persistCard = new Card(loadObject.title, loadObject.body, loadObject.uniqueId, loadObject.quality);
    prependCard(loadObject);
  }
}

function toggleButtonDisabled() {
  if($('#input-title').val() && $('#input-body').val()) {
    $('#submit-btn').prop('disabled', false);
  } else {
    $('#submit-btn').prop('disabled', true);
  }
};