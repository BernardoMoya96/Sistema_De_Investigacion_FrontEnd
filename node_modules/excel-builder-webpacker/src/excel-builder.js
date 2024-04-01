"use strict";
var _ = require('lodash');
var Workbook = require('./Excel/Workbook');
var JSZip = require('jszip');
//var WorkbookWorker = require('./Worker');

/**
 * @name Excel
 * @public
 * @author Stephen Liberty
 * @requires underscore
 * @requires Excel/Workbook
 * @requires JSZIP
 * @exports excel-builder
 */
var Factory = {
    /**
     * Creates a new workbook.
     */
    createWorkbook: function () {
        return new Workbook();
    },

    config: {
        forceUIThread: false
    },

    /**
     * Turns a workbook into a downloadable file.
     * @param {Excel/Workbook} workbook The workbook that is being converted
     * @param {Object} options - options to modify how the zip is created. See http://stuk.github.io/jszip/#doc_generate_options
     * @returns {Promise}
     */
    createFile: function (workbook, options) {
        var zip = new JSZip();
        return workbook.generateFiles().then(function (files) {
            _.each(files, function (content, path) {
                path = path.substr(1);
                if(path.indexOf('.xml') !== -1 || path.indexOf('.rel') !== -1) {
                    zip.file(path, content, {base64: false});
                } else {
                    zip.file(path, content, {base64: true, binary: true});
                }
            });
            return zip.generateAsync(_.defaults(options || {}, {
                type: "base64"
            }));
        });
    }
};


module.exports = Factory;
