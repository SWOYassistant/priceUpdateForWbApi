function createDictionaryFromSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Цены и скидки");  // можете заменить название листа на название вашего листа с ценами и скидками
  var data = sheet.getDataRange().getValues();

  // Инициализируем пустой список для данных
  var dataList = [];
  var maxItemsPerRequest = 1000;
  var requests = [];
  
  // Пропускаем заголовки (первую строку)
  for (var i = 1; i < data.length; i++) {
    var nmID = data[i][0];
    var price = data[i][1];
    var discount = data[i][2];
    
    // Проверяем, что цена и скидка не пусты одновременно
    if ((price !== "" && price !== null) || (discount !== "" && discount !== null)) {
      // Создаем словарь для текущей строки
      var item = {
        "nmID": nmID,
        "price": price,
        "discount": discount
      };

      // Добавляем словарь в список
      dataList.push(item);

      // Если количество товаров достигло maxItemsPerRequest, создаем новый запрос
      if (dataList.length === maxItemsPerRequest) {
        requests.push({"data": dataList});
        dataList = [];
      }
    }
  }

  // Добавляем оставшиеся данные, если они есть
  if (dataList.length > 0) {
    requests.push({"data": dataList});
  }

  // Выводим все запросы в лог
  //for (var j = 0; j < requests.length; j++) {
  //  Logger.log(requests[j]);
  //}

  // Здесь можно отправлять запросы по отдельности, например:
   for (var j = 0; j < requests.length; j++) {
     sendRequest(requests[j]);
  // }
}}

// Пример функции для отправки запроса
function sendRequest(data) {
  var url = "https://discounts-prices-api.wb.ru/api/v2/upload/task"; // Укажите URL вашего API
  var wb_api_token = "ВАШ_ТОКЕН"  //замените ВАШ_ТОКЕН на ваш api токен wildberries
    var headers = {
    "Authorization": "Bearer ${wb_api_token}",
    "Content-Type": "application/json"
  };
  var options = {
    "method": "post",
    "headers": headers,
    "contentType": "application/json",
    "payload": JSON.stringify(data)
  };
  
  var response = UrlFetchApp.fetch(url, options);

  // Logger.log(response.getContentText());
}
