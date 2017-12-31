window.onload = function() {
  loadCard();
  $('#input-title').focus();
  $(submitBtn).prop('disabled', true);
}

/*Global variables*/
var $inputTitle = $('#input-title');
var $inputBody = $('#input-body');
var inputFields = ('#input-title, #input-body');
var submitBtn = $('#submit-btn');
var $titleElement = $('.idea-title');
var $bodyElement = $('.idea-body');
var ideaTextElements = ('.idea-title, .idea-body');
var $ideaQualityElement = $('.idea-quality-value');
var deleteButton = $('.idea-delete');
var voteUpButton = $('.idea-up');
var voteDownButton = $('.idea-down');
var sectionSearch = $('.section-search');
// var maxID = '';
var prepend = $('.prepend');

/*Event Listeners*/

//Input fields keyup
$(inputFields).on('keyup', function() {
  toggleButtonDisabled();
})

//Submit button click
$(submitBtn).on('click', function(event) { 
  event.preventDefault();
  var newCard = new Card($inputTitle.val(), $inputBody.val());
  newCard.prependCard();
  addToStorage(newCard);
  $(inputFields).val('');
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
$(prepend).on('click', ideaTextElements, function() {
  $(this).attr('contenteditable','true');
  $(this).keypress(function(event) {
    if(event.which == 13){
      var itemID = $(this).parent().attr('id');
      var quality = $(this).parent().attr('quality');
      if ($(this).hasClass('idea-title')) {
        var $title = $(this).text();
        var $body = $(this).siblings('.idea-body').text();
      } else {
        var $title = $(this).siblings('.idea-title').text();
        var $body = $(this).text();
      }
      var updatedValues = {
        id: itemID,
        title: $title,
        body: $body,
        quality: quality
      }
      var stringifiedUpdatedIdea = JSON.stringify(updatedValues);
      localStorage.setItem(itemID, stringifiedUpdatedIdea);
      $(this).blur();
    };
  });
});


//Delete button click
$(prepend).on('click', '.idea-delete', function () {
  $(this).parent('.newArticle').remove();
  var key = $(this).parent().attr('id');
  localStorage.removeItem(key);
})

//Up vote button click
$(prepend).on('click', '.idea-up', function () {
  var itemID = $(this).parent().attr('id');
  var title = $(this).siblings('.idea-title').text();
  var body = $(this).siblings('.idea-body').text();
  var quality = $(this).parent().attr('quality');
  if (quality < 2) {
    quality = parseInt(quality) + 1;
    $(this).parent().attr('quality',quality);
  }
  if(quality < 1) {
    $(this).siblings('.idea-quality-value').text('Quality: Swill');
  } else if (quality == 1) {
    $(this).siblings('.idea-quality-value').text('Quality: Plausible');
  } else if (quality > 1) {
    $(this).siblings('.idea-quality-value').text('Quality: Genius');
  };
  var updatedValues = {
    id: itemID,
    title: title,
    body: body,
    quality: quality
  }
  var stringifiedUpdatedIdea = JSON.stringify(updatedValues);
  localStorage.setItem(itemID, stringifiedUpdatedIdea);
  $(this).blur();
});

//Down vote click
$(prepend).on('click', '.idea-down', function () {
  var itemID = $(this).parent().attr('id');
  var title = $(this).siblings('.idea-title').text();
  var body = $(this).siblings('.idea-body').text();
  var quality = $(this).parent().attr('quality');
  if (quality > 0){
    quality = parseInt(quality) - 1;
    $(this).parent().attr('quality',quality);
  }
  if(quality < 1){
    $(this).siblings('.idea-quality-value').text('Quality: Swill');
  } else if (quality == 1){
    $(this).siblings('.idea-quality-value').text('Quality: Plausible');
  } else if (quality > 1){
    $(this).siblings('.idea-quality-value').text('Quality: Genius');
  };
  var updatedValues = {
    id: itemID,
    title: title,
    body: body,
    quality: quality
  }
  var stringifiedUpdatedIdea = JSON.stringify(updatedValues);
  localStorage.setItem(itemID, stringifiedUpdatedIdea);
  $(this).blur();
});

/*Functions*/

/*won't need this function since you can use $.now() to create uniqueid*/
// function setMaxID() {
//   for(i=0; i < localStorage.length; i++) {
//     var key = localStorage.key(i);
//     var item = JSON.parse(localStorage.getItem(key));
//     var id = item.id;
//     if(id > maxID) {
//       maxID = id; 
//     }
//   }
// }

/*Add Constructor function and prototype with template literal*/
function Card (uniqueId, title, body, quality) {
  this.uniqueId = uniqueId || $.now();
  this.title = title;
  this.body = body;
  this.quality = quality;
};

Card.prototype.prependCard = function() {
  var titleInput = $('#input-title').val();
  var bodyInput = $('#input-body').val();
  $('.prepend').prepend(`
    <article class="newArticle" id=${this.uniqueId} >
    <h2 class="idea-title">${this.title}</h2>
    <input type="image" src="images/delete.svg" class="idea-delete" value="X">
    <p class="idea-body">${this.body}</p>
    <input type="image" src="images/upvote.svg" class="idea-up" alt="upvote-button">
    <input type="image" src="images/downvote.svg" class="idea-down" alt="downvote-button">
    <p class="idea-quality-value">Quality: Swill<p>
    <hr>
    </article>`)
  $('#input-title').focus();
};

function addToStorage(object) {
  var stringObj = JSON.stringify(object);
  localStorage.setItem(object.uniqueId, stringObj);
  // localStorage.getItem(maxID);
};

function loadCard() {
  for (i=0; i < localStorage.length; i++) {
    var getObject = localStorage.getItem(localStorage.key(i));
    var loadObject = JSON.parse(getObject);
    var persistCard = new Card(loadObject.title, loadObject.body, loadObject.uniqueId, loadObject.quality);
  }
}

/*removed from loadCard function*/
    // var id = item.id;
    // var title = item.title;
    // var body = item.body;
    // var quality = item.quality;
    // if(quality < 1) {
    //   var qualityDesc = 'Quality: Swill';
    // } else if (quality == 1) {
    //   var qualityDesc = 'Quality: Plausible';
    // } else if (quality > 1) {
    //   var qualityDesc = 'Quality: Genius';
    // };
    // $('.prepend').prepend(`
    //   <article class="newArticle" id ="${id}" quality="${quality}">
    //   <h2 class="idea-title">${title}</h2>
    //   <input type="image" src="images/delete.svg" class="idea-delete" value="X">
    //   <p class="idea-body">${body}</p>
    //   <input type="image" src="images/upvote.svg" class="idea-up">
    //   <input type="image" src="images/downvote.svg" class="idea-down">
    //   <p class="idea-quality-value">${qualityDesc}</p>
    //   <hr>
    //   </article>`);
//   };
// };

function toggleButtonDisabled() {
  if($('#input-title').val() && $('#input-body').val()) {
    $(submitBtn).prop('disabled', false);
  } else {
    $(submitBtn).prop('disabled', true);
  }
};