jQuery(function($) {
  'use strict';

  function getFieldProps(body) {
    kintone.api(kintone.api.url('/k/v1/app/form/fields', true), 'GET', body, function(resp) {
      var properties = resp.properties;
      var str = 'フィールドコード,フィールド名,フィールドの種類\n';
      for (var key in properties) {
        var prop = properties[key];
        str += key + ',' + prop.label + ',' + prop.type + '\n';
      }
      return str;
    }, function(error) {
      return error;
    });
  }

  kintone.events.on('app.record.index.show', function(event) {
    // ボタン増殖を防ぐ
    if ($('#get_config_button')[0]) {
      return;
    }


    // フォームのフィールド一覧を取得ボタン
    var $getConfigButon = $('<button>', {
      id: 'get_config_button',
      text: 'フォーム設定の取得',
    }).click(function() {
      var appId = event.appId;
      var body = {
        app: appId,
        lang: 'ja',
      }
      var str = getFieldProps(body);
      console.log(str);
    }); // click();

    // メニューの空白部分にボタンを設定
    $(kintone.app.getHeaderMenuSpaceElement()).append($getConfigButon);

  }); // kintone.events.on()

});
