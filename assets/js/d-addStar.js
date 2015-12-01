$('#addStar_ChooseFileBtn').click(function() {
  $('#addStar_StarPhoto').click();
});

$('#addStar_Submit').click(function() {
  return !($('#addStar_StarName').val() == '' || $('#addStar_StarPhoto').val() == '');
});
