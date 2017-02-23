(function () {
  'use strict';

  const _ = require('lodash');
  const fs = require('fs');
  const StringBuilder = require('stringbuilder');
  const mdu = require('markdown-utils');
  const sb = new StringBuilder({ newline: '\n' });
  const internals = {};

  internals.header = function () {
    let sbHeader = new StringBuilder({ newline: '\n' });
    sbHeader.appendLine(mdu.h1('This is the header'))
      .appendLine();
    return sbHeader;
  };

  internals.parseEntry = function (entry) {
    let sbEntry = new StringBuilder({ newline: '\n' });
    sbEntry.appendLine(mdu.h2('Entry'))
        .appendLine()
        .appendLine(entry.startedDateTime)
        .appendLine()
        .append(internals.parseRequest(entry.request))
        .appendLine()
        .append(internals.parseResponse(entry.response));
    return sbEntry;
  };

  internals.parseRequest = function (request) {
    let sbRequest = new StringBuilder({ newline: '\n' });

    sbRequest.appendLine(mdu.h3('Request'))
        .appendLine();

    sbRequest.appendLine(`${request.method} ${request.url}`)
        .appendLine();

    sbRequest.appendLine(`headersSize: ${request.headersSize}`)
        .appendLine();

    return sbRequest;
  };

  internals.parseResponse = function (response) {
    let sbResponse = new StringBuilder({ newline: '\n' });

    sbResponse.appendLine(mdu.h3('Response'))
        .appendLine();

    sbResponse.appendLine(`${response.status} ${response.statusText}`)
        .appendLine();

    sbResponse.appendLine(`httpVersion: ${response.httpVersion}`)
        .appendLine();

    sbResponse.appendLine(mdu.h4('Content'))
        .appendLine(mdu.code(response.content.text))
        .appendLine();

    return sbResponse;
  };

  exports.convert = function (data) {
    let har = JSON.parse(data);
    sb.append(internals.header());
    _.each(har.log.entries, function (entry) {
      sb.append(internals.parseEntry(entry));
    });
    sb.pipe(process.stdout);
    sb.flush();
  };

  if (!module.parent) {
    fs.readFile(process.argv[2], { encoding: 'utf-8' }, function (err, data) {
      if (!err) {
        exports.convert(data);
      } else {
        throw err;
      }
    });
  }
})();

