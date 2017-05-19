jQuery(function($) {
  'use strict';

  function getFieldProps(reqBody) {
    return kintone.api(kintone.api.url('/k/v1/app/form/fields', true), 'GET', reqBody).then(function(resp) {
      return resp.properties;
    }, function(error) {
      return error;
    });
  }

  function getLayout(reqBody) {
    return kintone.api(kintone.api.url('/k/v1/app/form/layout', true), 'GET', reqBody).then(function(resp) {
      return resp.layout
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
      var reqBody = {
        app: appId,
        lang: 'ja',
      }
      var promises = [
        getFieldProps(reqBody),
        getLayout(reqBody),
      ];
      kintone.Promise.all(promises).then(function(values) {
        var properties = values[0];
        var layout = values[1];

        var str = '行番号,列番号,フィールドコード,フィールド名,フィールドの種類\n';
        // レイアウトの行列番号順に文字列生成
        layout.forEach(function(row, rowIdx) {
          row.fields.forEach(function(field, colIdx) {
            var code = field.code;
            str += rowIdx + ',' + colIdx + ',' + code + ',';

            // レイアウトの順に合わせて
            // フィールド一覧のプロパティを追加
            str += properties[code].label + ',' + properties[code].type;
            str += '\n';
          });
        });
        console.log(str);
      });
    }); // click();

    // メニューの空白部分にボタンを設定
    $(kintone.app.getHeaderMenuSpaceElement()).append($getConfigButon);

  }); // kintone.events.on()

});
