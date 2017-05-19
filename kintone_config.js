jQuery(function($) {
  'use strict';

  kintone.events.on('app.record.index.show', function(event) {
    // ボタン増殖を防ぐ
    if ($('#get_config_button')[0]) {
      return;
    }

    var appId = event.appId;
    var body = {
      app: appId,
      lang: 'ja',
    }

    // フォームのフィールド一覧を取得ボタン
    var $getConfigButon = $('<button>', {
      id: 'get_config_button',
      text: 'フォーム設定の取得',
    }).click(function() {
      kintone.api(kintone.api.url('/k/v1/app/form/fields', true), 'GET', body, function(resp) {
        var properties = resp.properties;
        var str = 'フィールドコード,フィールド名,フィールドの種類\n';
        for (var key in properties) {
          var prop = properties[key];
          str += key + ',' + prop.label + ',' + prop.type + '\n';
        }
        console.log(str);
      }, function(error) {
        console.log(error);
      });
    }); // click();

    // メニューの空白部分にボタンを設定
    $(kintone.app.getHeaderMenuSpaceElement()).append($getConfigButon);

  }); // kintone.events.on()

});
