"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var local_client_1 = require("./prisma/generated/local-client");
var prismaLocal = new local_client_1.PrismaClient({ datasources: { db: { url: 'file:./local.db' } } });
var getChartData = function (tipo, params) { return __awaiter(void 0, void 0, void 0, function () {
    var baseWhere, idImovel, today, sixMonthsAgo, rows, meses, map, i, d, key, _i, rows_1, row, d, key, result, i, prev, curr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                baseWhere = { tipo: tipo };
                if (params.condominio) {
                    idImovel = parseInt(params.condominio, 10);
                    if (!isNaN(idImovel))
                        baseWhere.idImovel = idImovel;
                }
                today = new Date();
                today.setHours(23, 59, 59, 999);
                sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(today.getMonth() - 5); // This month + 5 previous
                sixMonthsAgo.setDate(1);
                sixMonthsAgo.setHours(0, 0, 0, 0);
                return [4 /*yield*/, prismaLocal.dashboardAggregates.findMany({
                        where: __assign(__assign({}, baseWhere), { data: { gte: sixMonthsAgo, lte: today } }),
                        select: { data: true, total: true }
                    })];
            case 1:
                rows = _a.sent();
                meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
                map = new Map();
                // Initialize last 6 months in map to guarantee order
                for (i = 5; i >= 0; i--) {
                    d = new Date();
                    d.setMonth(d.getMonth() - i);
                    key = "".concat(meses[d.getMonth()], "/").concat(String(d.getFullYear()).slice(-2));
                    map.set(key, 0);
                }
                for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                    row = rows_1[_i];
                    if (!row.data)
                        continue;
                    d = new Date(row.data);
                    key = "".concat(meses[d.getMonth()], "/").concat(String(d.getFullYear()).slice(-2));
                    if (map.has(key)) {
                        map.set(key, (map.get(key) || 0) + row.total);
                    }
                }
                result = Array.from(map.entries()).map(function (_a) {
                    var periodo = _a[0], valor = _a[1];
                    return ({
                        data: periodo,
                        periodo: periodo,
                        valor: valor,
                        crescimento: 0
                    });
                });
                // Calculate crescimento for Faturamento
                if (tipo === "FATURAMENTO") {
                    for (i = 1; i < result.length; i++) {
                        prev = result[i - 1].valor;
                        curr = result[i].valor;
                        if (prev > 0) {
                            result[i].crescimento = Number((((curr - prev) / prev) * 100).toFixed(1));
                        }
                        else if (prev === 0 && curr > 0) {
                            result[i].crescimento = 100;
                        }
                    }
                }
                return [2 /*return*/, result];
        }
    });
}); };
function test() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _b = (_a = console).log;
                    _c = ["Recebimento:"];
                    return [4 /*yield*/, getChartData("RECEBIMENTO", {})];
                case 1:
                    _b.apply(_a, _c.concat([_g.sent()]));
                    _e = (_d = console).log;
                    _f = ["Faturamento:"];
                    return [4 /*yield*/, getChartData("FATURAMENTO", {})];
                case 2:
                    _e.apply(_d, _f.concat([_g.sent()]));
                    return [2 /*return*/];
            }
        });
    });
}
test();
