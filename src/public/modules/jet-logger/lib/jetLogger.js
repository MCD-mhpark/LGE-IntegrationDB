"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jetLogger = exports.Formats = exports.LoggerModes = void 0;
var util_1 = __importDefault(require("util"));
var colors_1 = __importDefault(require("colors"));
var fs_1 = __importDefault(require("fs"));
var LoggerModes;
(function (LoggerModes) {
    LoggerModes["Console"] = "CONSOLE";
    LoggerModes["File"] = "FILE";
    LoggerModes["Custom"] = "CUSTOM";
    LoggerModes["Off"] = "OFF";
})(LoggerModes = exports.LoggerModes || (exports.LoggerModes = {}));
var Formats;
(function (Formats) {
    Formats["Line"] = "LINE";
    Formats["Json"] = "JSON";
})(Formats = exports.Formats || (exports.Formats = {}));
var Levels = {
    Info: {
        Color: 'green',
        Prefix: 'INFO',
    },
    Imp: {
        Color: 'magenta',
        Prefix: 'IMPORTANT',
    },
    Warn: {
        Color: 'yellow',
        Prefix: 'WARNING',
    },
    Err: {
        Color: 'red',
        Prefix: 'ERROR',
    }
};
var Errors = {
    customLogFn: 'Custom logger mode set to true, but no custom logger was ' +
        'provided.',
    Mode: 'The correct logger mode was not specified: Must be "CUSTOM", ' +
        '"FILE", "OFF", or "CONSOLE".'
};
var Defaults = {
    Filepath: 'jet-logger.log',
    Mode: LoggerModes.Console,
    Timestamp: true,
    FilepathDatetime: true,
    Format: Formats.Line,
};
function jetLogger(mode, filepath, filepathDatetime, timestamp, format, customLogFn) {
    var settings = _getSettings(mode, filepath, timestamp, filepathDatetime, format, customLogFn);
    return { settings: settings, info: info, imp: imp, warn: warn, err: err };
}
exports.jetLogger = jetLogger;
function _getSettings(mode, filepath, filepathDatetime, timestamp, format, customLogFn) {
    if (!mode) {
        if (!!process.env.JET_LOGGER_MODE) {
            mode = process.env.JET_LOGGER_MODE.toUpperCase();
        }
        else {
            mode = Defaults.Mode;
        }
    }
    if (!filepath) {
        if (!!process.env.JET_LOGGER_FILEPATH) {
            filepath = process.env.JET_LOGGER_FILEPATH;
        }
        else {
            filepath = Defaults.Filepath;
        }
    }
    if (filepathDatetime === undefined || filepathDatetime === null) {
        var envVar = process.env.JET_LOGGER_FILEPATH_DATETIME;
        if (!!envVar) {
            filepathDatetime = (envVar.toUpperCase() === 'TRUE');
        }
        else {
            filepathDatetime = Defaults.FilepathDatetime;
        }
    }
    if (timestamp === undefined || timestamp === null) {
        if (!!process.env.JET_LOGGER_TIMESTAMP) {
            timestamp = (process.env.JET_LOGGER_TIMESTAMP.toUpperCase() === 'TRUE');
        }
        else {
            timestamp = Defaults.Timestamp;
        }
    }
    if (!format) {
        if (!!process.env.JET_LOGGER_FORMAT) {
            format = process.env.JET_LOGGER_FORMAT.toUpperCase();
        }
        else {
            format = Defaults.Format;
        }
    }
    if (filepathDatetime) {
        filepath = _addDatetimeToFileName(filepath);
    }
    return {
        mode: mode,
        filepath: filepath,
        filepathDatetime: filepathDatetime,
        timestamp: timestamp,
        format: format,
        customLogFn: customLogFn,
    };
}
function _addDatetimeToFileName(filePath) {
    var dateStr = new Date().toISOString()
        .split('-').join('')
        .split(':').join('')
        .slice(0, 8);
    var filePathArr = filePath.split('/'), lastIdx = filePathArr.length - 1, fileName = filePathArr[lastIdx], fileNameNew = (dateStr + '_' + fileName);
    filePathArr[lastIdx] = fileNameNew;
    return filePathArr.join('/');
}
function info(content, printFull) {
    return _printLog(content, printFull !== null && printFull !== void 0 ? printFull : false, Levels.Info, this.settings);
}
function imp(content, printFull) {
    return _printLog(content, printFull !== null && printFull !== void 0 ? printFull : false, Levels.Imp, this.settings);
}
function warn(content, printFull) {
    return _printLog(content, printFull !== null && printFull !== void 0 ? printFull : false, Levels.Warn, this.settings);
}
function err(content, printFull) {
    return _printLog(content, printFull !== null && printFull !== void 0 ? printFull : false, Levels.Err, this.settings);
}
function _printLog(content, printFull, level, settings) {
    var mode = settings.mode, format = settings.format, timestamp = settings.timestamp, filepath = settings.filepath, customLogFn = settings.customLogFn;
    if (mode === LoggerModes.Off) {
        return;
    }
    if (printFull) {
        content = util_1.default.inspect(content);
    }
    if (mode === LoggerModes.Custom) {
        if (!!customLogFn) {
            return customLogFn(new Date(), level.Prefix, content);
        }
        else {
            throw Error(Errors.customLogFn);
        }
    }
    if (format === Formats.Line) {
        content = _setupLineFormat(content, timestamp, level);
    }
    else if (format === Formats.Json) {
        content = _setupJsonFormat(content, timestamp, level);
    }
    if (mode === LoggerModes.Console) {
        var colorFn = colors_1.default[level.Color];
        console.log(colorFn(content));
    }
    else if (mode === LoggerModes.File) {
        var colorFn = colors_1.default[level.Color];
        console.log(colorFn(content));
        _writeToFile(content + '\n', filepath)
            .catch(function (err) { return console.log(err); });
    }
    else {
        throw Error(Errors.Mode);
    }
}
function _setupLineFormat(content, timestamp, level) {
    content = (level.Prefix + ': ' + (typeof content === 'object' ? JSON.stringify(content, null, 2) : content));
    if (timestamp) {
        var time = '[' + new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '') + '] ';
        return (time + content);
    }
    return content;
}
function _setupJsonFormat(content, timestamp, level) {
    var json = {
        level: level.Prefix,
        message: content,
    };
    if (timestamp) {
        json.timestamp = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '')
    }
    return JSON.stringify(json);
}
function _writeToFile(content, filePath) {
    return new Promise(function (res, rej) {
        return fs_1.default.appendFile(filePath, content, (function (err) { return !!err ? rej(err) : res(); }));
    });
}
exports.default = jetLogger();
