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

  function downloadCsv(csvbuf) {
    function createSjisBlob(str) {
      // 文字列を配列に
      var array = [];
      for (var i = 0, il = str.length; i < il; i++) array.push(str.charCodeAt(i));

      // encoding.jsで文字コードをSJISに変換
      var sjisArray = Encoding.convert(array, 'SJIS', 'UNICODE');

      // バイナリとしてBlobオブジェクト作成
      var uint8Array = new Uint8Array(sjisArray);
      return new Blob([uint8Array], { type: 'text/csv' });
    }

    // var blob = new Blob([csvbuf], { type: 'text/csv' }); // createUtf8Blob
    var blob = createSjisBlob(csvbuf);
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'download.csv';
    link.id = 'csv_export_link'
    document.body.appendChild(link);
    link.click();
  }

  kintone.events.on('app.record.index.show', function(event) {
    // ボタン増殖を防ぐ
    if ($('#get_config_button')[0]) {
      return;
    }

    // ボタン生成
    var $getConfigButon = $('<button>', {
      id: 'get_config_button',
      text: 'フォーム設定のダウンロード',
    }).click(function() {
      // 2回目以降のダウンロードは生成済みCSVデータを使用
      if ($('#csv_export_link')[0]) {
        $('#csv_export_link')[0].click();
        return;
      }

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

        var csvbuf = '行番号,列番号,フィールドコード,フィールド名,フィールドの種類\n';
        // レイアウトの行列番号順に文字列生成
        layout.forEach(function(row, rowIdx) {
          row.fields.forEach(function(field, colIdx) {
            var code = field.code;
            csvbuf += rowIdx + ',' + colIdx + ',' + code + ',';

            // レイアウトの順に合わせて
            // フィールド一覧のプロパティを追加
            csvbuf += properties[code].label + ',' + properties[code].type;
            csvbuf += '\n';
          });
        });
        console.log(csvbuf);

        // ダウンロード
        downloadCsv(csvbuf);
      });
    }); // click();

    // メニューの空白部分にボタンを設定
    $(kintone.app.getHeaderMenuSpaceElement()).append($getConfigButon);

  }); // kintone.events.on()

});
