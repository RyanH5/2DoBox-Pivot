window.onload = function() {
  loadCard();
  $('#input-title').focus();
  $('#submit-btn').prop('disabled', true);
}

$('.input-fields').on('keyup', toggleButtonDisabled);
$('#submit-btn').on('click', submitBtn); 
$('#search').on('keyup', searchBar);
$('#show-completed').on('click', loadAllCards);
$('.prepend-card').on('keyup', '.card-input-title', editTitle);
$('.prepend-card').on('keyup', '.card-input-body', editBody);
$('.prepend-card').on('click', '.delete-btn', deleteBtn);
$('.prepend-card').on('click', '.downvote-btn', downvoteBtn);
$('.prepend-card').on('click', '.upvote-btn', upvoteBtn);
$('.prepend-card').on('click', '.completed-task', completedTask);

function toggleButtonDisabled() {
  if($('#input-title').val() && $('#input-body').val()) {
    $('#submit-btn').prop('disabled', false);
  } else {
    $('#submit-btn').prop('disabled', true);
  }
}

function submitBtn(event) {
  event.preventDefault();
  var newCard = new Card($('#input-title').val(), $('#input-body').val());
  prependCard(newCard);
  addToStorage(newCard);
  console.log(newCard)
  $('.input-fields').val('');
};

function searchBar() {
 var searchRequest = $('#search').val();
 $('.newArticle').each(function() {
   var searchResult = $(this).text().indexOf(searchRequest);
   this.style.display = searchResult > -1 ? "" : "none";
 })
};

function completedTask() {
  var key = $(this).parent().attr('id');
  var parsedToDo = getFromStorage(key);
  $(this).parent().addClass('strike-through');
  parsedToDo.completed = true;
  addToStorage(parsedToDo);
}

function editTitle () {
  var itemId = $(this).parent('.newArticle').attr('id');
  var parsedContent = JSON.parse(localStorage.getItem(itemId));
  parsedContent['title'] = $(this).text();
  addToStorage(parsedContent);
}

function editBody () {
  var itemId = $(this).parent('.newArticle').attr('id');
  var parsedContent = JSON.parse(localStorage.getItem(itemId));
  parsedContent['body'] = $(this).text();
  addToStorage(parsedContent);
} 

function upvoteBtn() {
  var increaseImportance = this;
  var upQualityParse = changeVote(increaseImportance, 1);
  addToStorage(upQualityParse);
}

function downvoteBtn() {
  var decreaseImportance = this;
  var upQualityParse = changeVote(decreaseImportance, -1);
  addToStorage(upQualityParse);
}

function changeVote(changeImportance, newIndex) {
  var key = $(changeImportance).parent().attr('id');
  var upQuality = localStorage.getItem(key);
  var upQualityParse = JSON.parse(upQuality);
  upQualityParse.qualityNumber = upQualityParse.qualityNumber + newIndex;
  $(changeImportance).siblings('.impt-value').text(upQualityParse.quality[upQualityParse.qualityNumber]);
  return upQualityParse;
}

function deleteBtn() {
  $(this).parent('.newArticle').remove();
  var key = $(this).parent().attr('id');
  localStorage.removeItem(key);
}

function Card (title, body) {
  this.title = title;
  this.body = body;
  this.uniqueId = $.now();
  this.quality = ['none', 'low', 'normal', 'high', 'critical'];
  this.qualityNumber = 0;
  this.completed = false;
  this.count = 0;
};

function prependCard (Card) {
  $('.prepend-card').prepend(`
    <article class="newArticle" id=${Card.uniqueId}>
    <h2 class="card-input-title" contenteditable="true">${Card.title}</h2>
    <input type="image" src="images/delete.svg" class="delete-btn" value="X">
    <p class="card-input-body" contenteditable="true">${Card.body}</p>
    <input type="image" src="images/upvote.svg" class="upvote-btn" alt="upvote-button">
    <input type="image" src="images/downvote.svg" class="downvote-btn" alt="downvote-button">
    <p class="impt-title">importance:</p>
    <p class="impt-value">${Card.quality[Card.qualityNumber]}</p>
    <button class="completed-task">Completed Task</button>
    <hr>
    </article>`)
  $('#input-title').focus();
};

function getFromStorage(key) {
  var toDo = localStorage.getItem(key);
  var parsedToDo = JSON.parse(toDo);
  return parsedToDo;
}

function recentToDos() {
  if (localStorage.length > 10) {
    $('.newArticle').hide();
    console.log($('.newArticle').hide());
    (`<button class="show-more">Show more TODOs</button>`);
  }
}

function addToStorage(object) {
  var stringObj = JSON.stringify(object);
  localStorage.setItem(object.uniqueId, stringObj);
}

function loadAllCards(event) {
  event.preventDefault();
  for (var i = 0; i < localStorage.length; i++) {
    var getObject = localStorage.getItem(localStorage.key(i));
    var loadObject = JSON.parse(getObject);
    if (loadObject.completed === true) {
      prependCard(loadObject);
      $(`#${loadObject.uniqueId}`).addClass('strike-through');
    }
  }
}

function loadCard() {
  for (var i = 0; i < localStorage.length; i++) {
    var getObject = localStorage.getItem(localStorage.key(i));
    var loadObject = JSON.parse(getObject);
    if (loadObject.completed === false) {
      prependCard(loadObject);
    }
  }
}
