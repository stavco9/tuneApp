"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var python_shell_1 = require("python-shell");
var PyMachine = /** @class */ (function () {
    function PyMachine(scriptPath, anacondaPath) {
        if (anacondaPath === void 0) { anacondaPath = process.env.PYMACHINE_ANACONDA_PATH; }
        this.queue = [];
        this.shell = new python_shell_1.PythonShell(scriptPath, { mode: 'json', pythonPath: __dirname + "/conda-python.cmd", pythonOptions: [anacondaPath] });
        var self = this;
        this.shell.on('message', function (result) {
            var resolve = self.queue.shift();
            if (resolve) {
                resolve(result);
            }
        });
    }
    PyMachine.prototype.run = function (data) {
        var _this = this;
        var p = new Promise(function (resolve) {
            _this.queue.push(resolve);
        });
        this.shell.send(data);
        return p;
    };
    return PyMachine;
}());
exports.PyMachine = PyMachine;
//                              
//     `7MMF'      `7MMF' .g8""8q. `7MM"""Mq.  
//       MM          MM .dP'    `YM. MM   `MM. 
//       MM          MM dM'      `MM MM   ,M9  
//       MM          MM MM        MM MMmmdM9   
//       MM      ,   MM MM.      ,MP MM  YM.   
//       MM     ,M   MM `Mb.    ,dP' MM   `Mb. 
//     .JMMmmmmMMM .JMML. `"bmmd"' .JMML. .JMM.
//
//                 lior21 @ Github
//        https://github.com/lior21/PyMachine
//
//# sourceMappingURL=pymachine.js.map