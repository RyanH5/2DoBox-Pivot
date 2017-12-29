/*Global variables*/
var $inputTitle = $('#title');
var $inputBody = $('#body');
var inputFields = ('#title, #body');
var submitButton = $('#submit');
var $titleElement = $('.idea-title');
var $bodyElement = $('.idea-body');
var ideaTextElements = ('.idea-title, .idea-body');
var $ideaQualityElement = $('.idea-quality-value');
var deleteButton = $('.idea-delete');
var voteUpButton = $('.idea-up');
var voteDownButton = $('.idea-down');
var bottomSection = $('.section-bottom');
var maxID = '';

/*On load statements*/
setMaxID();
loadIdeas();
$('#title').focus();
$(submitButton).prop('disabled', true);

/*Event Listeners*/

//Input fields keyup
$(inputFields).on('keyup', function() {
  toggleButtonDisabled();
})

//Save button click
$(submitButton).on('click', function(event) { 
  event.preventDefault();
  prependIdeasToList();
  $(inputFields).val('');
});

//Search input keyup
$('#search').on('keyup', function() {
 var searchRequest = $('#search').val();
 $('article').each(function() {
   var searchResult = $(this).text().indexOf(searchRequest);
   this.style.display = searchResult > -1 ? "" : "none";
 })
});

//Click on idea title and body elements
$(bottomSection).on('click', ideaTextElements, function() {
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
$(bottomSection).on('click', '.idea-delete', function () {
  $(this).parent('article').remove();
  var key = $(this).parent().attr('id');
  localStorage.removeItem(key);
})

//Up vote button click
$(bottomSection).on('click', '.idea-up', function () {
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
$(bottomSection).on('click', '.idea-down', function () {
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

function setMaxID() {
  for(i=0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var item = JSON.parse(localStorage.getItem(key));
    var id = item.id;
    if(id > maxID) {
      maxID = id; 
    }
  }
}

function loadIdeas() {
  for (i=0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var item = JSON.parse(localStorage.getItem(key));
    var id = item.id;
    var title = item.title;
    var body = item.body;
    var quality = item.quality;
    if(quality < 1) {
      var qualityDesc = 'Quality: Swill';
    } else if (quality == 1) {
      var qualityDesc = 'Quality: Plausible';
    } else if (quality > 1) {
    var qualityDesc = 'Quality: Genius';
    };
      $('.prepend').prepend(`
        <article id = "${id}" quality = "${quality}">
             <h2 class="idea-title">${title}</h2>
             <input type="image" src="images/delete.svg" class="idea-delete" value="X">
             <p class="idea-body">${body}</p>
             <input type="image" src="images/upvote.svg" class="idea-up">
             <input type="image" src="images/downvote.svg" class="idea-down">
             <p class="idea-quality-value">${qualityDesc}</p>
            <hr>
        </article>`);
  };
};

function toggleButtonDisabled() {
  if($('#title').val() && $('#body').val()) {
    $(submitButton).prop('disabled', false);
  } else {
    $(submitButton).prop('disabled', true);
  }
};

function prependIdeasToList() {
  var titleInput = $('#title').val();
  var bodyInput = $('#body').val();
  setMaxID();
  maxID++;
  setNewIdea();
  $('.prepend').prepend(`
    <article id = ${maxID} quality = "0">
        <h2 class="idea-title">${titleInput}</h2>
        <input type="image" src="images/delete.svg" class="idea-delete" value="X">
        <p class="idea-body">${bodyInput}</p>
        <input type="image" src="images/upvote.svg" class="idea-up">
        <input type="image" src="images/downvote.svg" class="idea-down">
        <p class="idea-quality-value">Quality: Swill<p>
        <hr>
    </article>`)
  $('#title').focus();
};

function setNewIdea() {
  var newIdeaObject = {
    id: maxID,
    title: $inputTitle.val(),
    body: $inputBody.val(),
    quality: 0
  }
  var stringifiedNewIdeaObject = JSON.stringify(newIdeaObject);
  localStorage.setItem(maxID, stringifiedNewIdeaObject);
  localStorage.getItem(maxID);
};