var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var axios = require('axios');

var Web3Api = function () {
  function Web3Api() {
    (0, _classCallCheck2.default)(this, Web3Api);
  }

  (0, _createClass2.default)(Web3Api, null, [{
    key: "initialize",
    value: function (_ref) {
      var apiKey = _ref.apiKey,
          serverUrl = _ref.serverUrl,
          _ref$Moralis = _ref.Moralis,
          Moralis = _ref$Moralis === void 0 ? null : _ref$Moralis;

      if (!serverUrl && !apiKey) {
        throw new Error('Web3Api.initialize failed: initialize with apiKey or serverUrl');
      }

      if (apiKey) this.apiKey = apiKey;
      if (serverUrl) this.serverUrl = serverUrl;
      this.Moralis = Moralis;
    }
  }, {
    key: "getBody",
    value: function (params, bodyParams) {
      var _this = this;

      if (!params || !bodyParams || !bodyParams.length) {
        return undefined;
      }

      var body = {};
      bodyParams.forEach(function (_ref2) {
        var key = _ref2.key,
            type = _ref2.type,
            required = _ref2.required;

        if (params[key] === undefined) {
          if (required) throw new Error("param " + key + " is required!");
        } else if (type === _this.BodyParamTypes.setBody) {
          body = params[key];
        } else {
          body[key] = params[key];
        }

        delete params[key];
      });
      return body;
    }
  }, {
    key: "getParameterizedUrl",
    value: function (url, params) {
      if (!Object.keys(params).length) return url;
      var requiredParams = url.split('/').filter(function (s) {
        return s && s.includes(':');
      });
      if (!requiredParams.length) return url;
      var parameterizedUrl = url;
      requiredParams.forEach(function (p) {
        var key = p.substr(1);
        var value = params[key];

        if (!value) {
          throw new Error("required param " + key + " not provided");
        }

        parameterizedUrl = parameterizedUrl.replace(p, value);
        delete params[key];
      });
      return parameterizedUrl;
    }
  }, {
    key: "getErrorMessage",
    value: function (error, url) {
      var _error$response, _error$response$data;

      return (error == null ? void 0 : (_error$response = error.response) == null ? void 0 : (_error$response$data = _error$response.data) == null ? void 0 : _error$response$data.message) || (error == null ? void 0 : error.message) || (error == null ? void 0 : error.toString()) || "Web3 API error while calling " + url;
    }
  }, {
    key: "fetch",
    value: function (_ref3) {
      var endpoint, providedParams, params, _endpoint$method, method, url, bodyParams, _this$Moralis, User, account, user, parameterizedUrl, body, response, msg;

      return _regenerator.default.async(function (_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              endpoint = _ref3.endpoint, providedParams = _ref3.params;
              params = (0, _extends2.default)({}, providedParams);
              _endpoint$method = endpoint.method, method = _endpoint$method === void 0 ? 'GET' : _endpoint$method, url = endpoint.url, bodyParams = endpoint.bodyParams;

              if (this.Moralis) {
                _this$Moralis = this.Moralis, User = _this$Moralis.User, account = _this$Moralis.account;
                user = User.current();

                if (!params.address) {
                  if (user) {
                    params.address = user.get('ethAddress');
                  } else if (account) {
                    params.address = account;
                  }
                }
              }

              if (this.apiKey) {
                _context.next = 6;
                break;
              }

              return _context.abrupt("return", this.apiCall(endpoint.name, params));

            case 6:
              _context.prev = 6;
              parameterizedUrl = this.getParameterizedUrl(url, params);
              body = this.getBody(params, bodyParams);
              _context.next = 11;
              return _regenerator.default.awrap(axios(this.baseURL + parameterizedUrl, {
                params: params,
                method: method,
                body: body,
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'x-api-key': this.apiKey
                }
              }));

            case 11:
              response = _context.sent;
              return _context.abrupt("return", response.data);

            case 15:
              _context.prev = 15;
              _context.t0 = _context["catch"](6);
              msg = this.getErrorMessage(_context.t0, url);
              throw new Error(msg);

            case 19:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[6, 15]], Promise);
    }
  }, {
    key: "apiCall",
    value: function (name, options) {
      var http, response, _error$response2, _error$response2$data;

      return _regenerator.default.async(function (_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (this.serverUrl) {
                _context2.next = 2;
                break;
              }

              throw new Error('Web3Api not initialized, run Moralis.start() first');

            case 2:
              _context2.prev = 2;
              http = axios.create({
                baseURL: this.serverUrl
              });
              if (!options.chain) options.chain = 'eth';
              _context2.next = 7;
              return _regenerator.default.awrap(http.post("/functions/" + name, options, {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                }
              }));

            case 7:
              response = _context2.sent;
              return _context2.abrupt("return", response.data.result);

            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2["catch"](2);

              if (!((_error$response2 = _context2.t0.response) != null && (_error$response2$data = _error$response2.data) != null && _error$response2$data.error)) {
                _context2.next = 15;
                break;
              }

              throw new Error(_context2.t0.response.data.error);

            case 15:
              throw _context2.t0;

            case 16:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[2, 11]], Promise);
    }
  }]);
  return Web3Api;
}();

Web3Api.baseURL = 'https://deep-index.moralis.io/api/v2';
Web3Api.BodyParamTypes = {
  setBody: 'set body',
  property: 'property'
};
Web3Api.native = {
  getBlock: function () {
    var options,
        _args3 = arguments;
    return _regenerator.default.async(function (_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            options = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
            return _context3.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "native",
                "name": "getBlock",
                "url": "/block/:block_number_or_hash"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getDateToBlock: function () {
    var options,
        _args4 = arguments;
    return _regenerator.default.async(function (_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            options = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {};
            return _context4.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "native",
                "name": "getDateToBlock",
                "url": "/dateToBlock"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getLogsByAddress: function () {
    var options,
        _args5 = arguments;
    return _regenerator.default.async(function (_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            options = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : {};
            return _context5.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "native",
                "name": "getLogsByAddress",
                "url": "/:address/logs"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getNFTTransfersByBlock: function () {
    var options,
        _args6 = arguments;
    return _regenerator.default.async(function (_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            options = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : {};
            return _context6.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "native",
                "name": "getNFTTransfersByBlock",
                "url": "/block/:block_number_or_hash/nft/transfers"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context6.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getTransaction: function () {
    var options,
        _args7 = arguments;
    return _regenerator.default.async(function (_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            options = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : {};
            return _context7.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "native",
                "name": "getTransaction",
                "url": "/transaction/:transaction_hash"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context7.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getContractEvents: function () {
    var options,
        _args8 = arguments;
    return _regenerator.default.async(function (_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            options = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : {};
            return _context8.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "POST",
                "group": "native",
                "name": "getContractEvents",
                "url": "/:address/events",
                "bodyParams": [{
                  "key": "data",
                  "type": "set body",
                  "required": false
                }]
              },
              params: options
            }));

          case 2:
          case "end":
            return _context8.stop();
        }
      }
    }, null, null, null, Promise);
  },
  runContractFunction: function () {
    var options,
        _args9 = arguments;
    return _regenerator.default.async(function (_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            options = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : {};
            return _context9.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "POST",
                "group": "native",
                "name": "runContractFunction",
                "url": "/:address/function",
                "bodyParams": [{
                  "key": "abi",
                  "type": "property",
                  "required": true
                }, {
                  "key": "params",
                  "type": "property",
                  "required": false
                }]
              },
              params: options
            }));

          case 2:
          case "end":
            return _context9.stop();
        }
      }
    }, null, null, null, Promise);
  }
};
Web3Api.account = {
  getTransactions: function () {
    var options,
        _args10 = arguments;
    return _regenerator.default.async(function (_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            options = _args10.length > 0 && _args10[0] !== undefined ? _args10[0] : {};
            return _context10.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "account",
                "name": "getTransactions",
                "url": "/:address"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context10.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getNativeBalance: function () {
    var options,
        _args11 = arguments;
    return _regenerator.default.async(function (_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            options = _args11.length > 0 && _args11[0] !== undefined ? _args11[0] : {};
            return _context11.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "account",
                "name": "getNativeBalance",
                "url": "/:address/balance"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context11.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getTokenBalances: function () {
    var options,
        _args12 = arguments;
    return _regenerator.default.async(function (_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            options = _args12.length > 0 && _args12[0] !== undefined ? _args12[0] : {};
            return _context12.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "account",
                "name": "getTokenBalances",
                "url": "/:address/erc20"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context12.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getTokenTransfers: function () {
    var options,
        _args13 = arguments;
    return _regenerator.default.async(function (_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            options = _args13.length > 0 && _args13[0] !== undefined ? _args13[0] : {};
            return _context13.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "account",
                "name": "getTokenTransfers",
                "url": "/:address/erc20/transfers"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context13.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getNFTs: function () {
    var options,
        _args14 = arguments;
    return _regenerator.default.async(function (_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            options = _args14.length > 0 && _args14[0] !== undefined ? _args14[0] : {};
            return _context14.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "account",
                "name": "getNFTs",
                "url": "/:address/nft"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context14.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getNFTTransfers: function () {
    var options,
        _args15 = arguments;
    return _regenerator.default.async(function (_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            options = _args15.length > 0 && _args15[0] !== undefined ? _args15[0] : {};
            return _context15.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "account",
                "name": "getNFTTransfers",
                "url": "/:address/nft/transfers"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context15.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getNFTsForContract: function () {
    var options,
        _args16 = arguments;
    return _regenerator.default.async(function (_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            options = _args16.length > 0 && _args16[0] !== undefined ? _args16[0] : {};
            return _context16.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "account",
                "name": "getNFTsForContract",
                "url": "/:address/nft/:token_address"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context16.stop();
        }
      }
    }, null, null, null, Promise);
  }
};
Web3Api.token = {
  getTokenMetadata: function () {
    var options,
        _args17 = arguments;
    return _regenerator.default.async(function (_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            options = _args17.length > 0 && _args17[0] !== undefined ? _args17[0] : {};
            return _context17.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "token",
                "name": "getTokenMetadata",
                "url": "/erc20/metadata"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context17.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getNFTTrades: function () {
    var options,
        _args18 = arguments;
    return _regenerator.default.async(function (_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            options = _args18.length > 0 && _args18[0] !== undefined ? _args18[0] : {};
            return _context18.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "token",
                "name": "getNFTTrades",
                "url": "/nft/:address/trades"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context18.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getNFTLowestPrice: function () {
    var options,
        _args19 = arguments;
    return _regenerator.default.async(function (_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            options = _args19.length > 0 && _args19[0] !== undefined ? _args19[0] : {};
            return _context19.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "token",
                "name": "getNFTLowestPrice",
                "url": "/nft/:address/lowestprice"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context19.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getTokenMetadataBySymbol: function () {
    var options,
        _args20 = arguments;
    return _regenerator.default.async(function (_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            options = _args20.length > 0 && _args20[0] !== undefined ? _args20[0] : {};
            return _context20.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "token",
                "name": "getTokenMetadataBySymbol",
                "url": "/erc20/metadata/symbols"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context20.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getTokenPrice: function () {
    var options,
        _args21 = arguments;
    return _regenerator.default.async(function (_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            options = _args21.length > 0 && _args21[0] !== undefined ? _args21[0] : {};
            return _context21.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "token",
                "name": "getTokenPrice",
                "url": "/erc20/:address/price"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context21.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getTokenAddressTransfers: function () {
    var options,
        _args22 = arguments;
    return _regenerator.default.async(function (_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            options = _args22.length > 0 && _args22[0] !== undefined ? _args22[0] : {};
            return _context22.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "token",
                "name": "getTokenAddressTransfers",
                "url": "/erc20/:address/transfers"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context22.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getTokenAllowance: function () {
    var options,
        _args23 = arguments;
    return _regenerator.default.async(function (_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            options = _args23.length > 0 && _args23[0] !== undefined ? _args23[0] : {};
            return _context23.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "token",
                "name": "getTokenAllowance",
                "url": "/erc20/:address/allowance"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context23.stop();
        }
      }
    }, null, null, null, Promise);
  },
  searchNFTs: function () {
    var options,
        _args24 = arguments;
    return _regenerator.default.async(function (_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            options = _args24.length > 0 && _args24[0] !== undefined ? _args24[0] : {};
            return _context24.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "token",
                "name": "searchNFTs",
                "url": "/nft/search"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context24.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getNftTransfersFromToBlock: function () {
    var options,
        _args25 = arguments;
    return _regenerator.default.async(function (_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            options = _args25.length > 0 && _args25[0] !== undefined ? _args25[0] : {};
            return _context25.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "token",
                "name": "getNftTransfersFromToBlock",
                "url": "/nft/transfers"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context25.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getAllTokenIds: function () {
    var options,
        _args26 = arguments;
    return _regenerator.default.async(function (_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            options = _args26.length > 0 && _args26[0] !== undefined ? _args26[0] : {};
            return _context26.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "token",
                "name": "getAllTokenIds",
                "url": "/nft/:address"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context26.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getContractNFTTransfers: function () {
    var options,
        _args27 = arguments;
    return _regenerator.default.async(function (_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            options = _args27.length > 0 && _args27[0] !== undefined ? _args27[0] : {};
            return _context27.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "token",
                "name": "getContractNFTTransfers",
                "url": "/nft/:address/transfers"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context27.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getNFTOwners: function () {
    var options,
        _args28 = arguments;
    return _regenerator.default.async(function (_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
            options = _args28.length > 0 && _args28[0] !== undefined ? _args28[0] : {};
            return _context28.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "token",
                "name": "getNFTOwners",
                "url": "/nft/:address/owners"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context28.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getNFTMetadata: function () {
    var options,
        _args29 = arguments;
    return _regenerator.default.async(function (_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            options = _args29.length > 0 && _args29[0] !== undefined ? _args29[0] : {};
            return _context29.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "token",
                "name": "getNFTMetadata",
                "url": "/nft/:address/metadata"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context29.stop();
        }
      }
    }, null, null, null, Promise);
  },
  reSyncMetadata: function () {
    var options,
        _args30 = arguments;
    return _regenerator.default.async(function (_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            options = _args30.length > 0 && _args30[0] !== undefined ? _args30[0] : {};
            return _context30.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "token",
                "name": "reSyncMetadata",
                "url": "/nft/:address/:token_id/metadata/resync"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context30.stop();
        }
      }
    }, null, null, null, Promise);
  },
  syncNFTContract: function () {
    var options,
        _args31 = arguments;
    return _regenerator.default.async(function (_context31) {
      while (1) {
        switch (_context31.prev = _context31.next) {
          case 0:
            options = _args31.length > 0 && _args31[0] !== undefined ? _args31[0] : {};
            return _context31.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "PUT",
                "group": "token",
                "name": "syncNFTContract",
                "url": "/nft/:address/sync"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context31.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getTokenIdMetadata: function () {
    var options,
        _args32 = arguments;
    return _regenerator.default.async(function (_context32) {
      while (1) {
        switch (_context32.prev = _context32.next) {
          case 0:
            options = _args32.length > 0 && _args32[0] !== undefined ? _args32[0] : {};
            return _context32.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "token",
                "name": "getTokenIdMetadata",
                "url": "/nft/:address/:token_id"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context32.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getTokenIdOwners: function () {
    var options,
        _args33 = arguments;
    return _regenerator.default.async(function (_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            options = _args33.length > 0 && _args33[0] !== undefined ? _args33[0] : {};
            return _context33.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "token",
                "name": "getTokenIdOwners",
                "url": "/nft/:address/:token_id/owners"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context33.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getWalletTokenIdTransfers: function () {
    var options,
        _args34 = arguments;
    return _regenerator.default.async(function (_context34) {
      while (1) {
        switch (_context34.prev = _context34.next) {
          case 0:
            options = _args34.length > 0 && _args34[0] !== undefined ? _args34[0] : {};
            return _context34.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "token",
                "name": "getWalletTokenIdTransfers",
                "url": "/nft/:address/:token_id/transfers"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context34.stop();
        }
      }
    }, null, null, null, Promise);
  }
};
Web3Api.resolve = {
  resolveDomain: function () {
    var options,
        _args35 = arguments;
    return _regenerator.default.async(function (_context35) {
      while (1) {
        switch (_context35.prev = _context35.next) {
          case 0:
            options = _args35.length > 0 && _args35[0] !== undefined ? _args35[0] : {};
            return _context35.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "resolve",
                "name": "resolveDomain",
                "url": "/resolve/:domain"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context35.stop();
        }
      }
    }, null, null, null, Promise);
  },
  resolveAddress: function () {
    var options,
        _args36 = arguments;
    return _regenerator.default.async(function (_context36) {
      while (1) {
        switch (_context36.prev = _context36.next) {
          case 0:
            options = _args36.length > 0 && _args36[0] !== undefined ? _args36[0] : {};
            return _context36.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "resolve",
                "name": "resolveAddress",
                "url": "/resolve/:address/reverse"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context36.stop();
        }
      }
    }, null, null, null, Promise);
  }
};
Web3Api.defi = {
  getPairReserves: function () {
    var options,
        _args37 = arguments;
    return _regenerator.default.async(function (_context37) {
      while (1) {
        switch (_context37.prev = _context37.next) {
          case 0:
            options = _args37.length > 0 && _args37[0] !== undefined ? _args37[0] : {};
            return _context37.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "defi",
                "name": "getPairReserves",
                "url": "/:pair_address/reserves"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context37.stop();
        }
      }
    }, null, null, null, Promise);
  },
  getPairAddress: function () {
    var options,
        _args38 = arguments;
    return _regenerator.default.async(function (_context38) {
      while (1) {
        switch (_context38.prev = _context38.next) {
          case 0:
            options = _args38.length > 0 && _args38[0] !== undefined ? _args38[0] : {};
            return _context38.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "defi",
                "name": "getPairAddress",
                "url": "/:token0_address/:token1_address/pairAddress"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context38.stop();
        }
      }
    }, null, null, null, Promise);
  }
};
Web3Api.storage = {
  uploadFolder: function () {
    var options,
        _args39 = arguments;
    return _regenerator.default.async(function (_context39) {
      while (1) {
        switch (_context39.prev = _context39.next) {
          case 0:
            options = _args39.length > 0 && _args39[0] !== undefined ? _args39[0] : {};
            return _context39.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "POST",
                "group": "storage",
                "name": "uploadFolder",
                "url": "/ipfs/uploadFolder",
                "bodyParams": [{
                  "key": "data",
                  "type": "set body",
                  "required": false
                }]
              },
              params: options
            }));

          case 2:
          case "end":
            return _context39.stop();
        }
      }
    }, null, null, null, Promise);
  }
};
Web3Api.info = {
  web3ApiVersion: function () {
    var options,
        _args40 = arguments;
    return _regenerator.default.async(function (_context40) {
      while (1) {
        switch (_context40.prev = _context40.next) {
          case 0:
            options = _args40.length > 0 && _args40[0] !== undefined ? _args40[0] : {};
            return _context40.abrupt("return", Web3Api.fetch({
              endpoint: {
                "method": "GET",
                "group": "info",
                "name": "web3ApiVersion",
                "url": "/web3/version"
              },
              params: options
            }));

          case 2:
          case "end":
            return _context40.stop();
        }
      }
    }, null, null, null, Promise);
  }
};
var _default = Web3Api;
exports.default = _default;