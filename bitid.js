
/*!
 * Bitid
 * Copyright(c) 2014 Aaron Caswell <aaron@captureplay.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var BtcMessage = require('bitcoinjs-message')
  , url = require('url')
  , SCHEME = 'bitid:'
  , PARAM_NONCE = 'x'
  , PARAM_UNSECURE = 'u';
var bitcoin = require("bitcoinjs-lib");


/**
 * Expose `Bitid`.
 */

module.exports = Bitid;

/**
 * Initialize a new `Bitid` with the given `params`
 *
 * @param {JSON} params
 * @api public
 */

function Bitid(params) {
  params = params || {};
  var self = this;

  this._nonce = params.nonce;
  this.callback = url.parse(params.callback, true);
  this.signature = params.signature;
  this.address = params.address;
  this.unsecure = params.unsecure;
  this._uri = !params.uri ? buildURI() : url.parse(params.uri, true);

  function buildURI() {
    var uri = self.callback;
    uri.protocol = SCHEME;
    var params = {};
    params[PARAM_NONCE] = self._nonce;
    if(self.unsecure) params[PARAM_UNSECURE] = 1;
    uri.query = params;
    uri.href = url.format(uri);

    return uri;
  }
}

/**
 * Library version.
 */

Bitid.version = require('./package').version;

Bitid.prototype.uriValid = function() {
  var uri = this._uri;
  var callback = this.callback;
  return !!uri && uri.protocol === SCHEME && uri.hostname === callback.hostname && uri.pathname === callback.pathname && !!uri.query[PARAM_NONCE];
};

Bitid.prototype.signatureValid = function() {
  try {
    var network = "bitcoin";
    try {
      bitcoin.address.toOutputScript(this.address, bitcoin.networks.testnet);
      network = "testnet";
    } catch (e) {
      network = "bitcoin"
    }
    var isValid = false;
    var messagePrefix = bitcoin.networks[network].messagePrefix;
    try { isValid = BtcMessage.verify(this.uri, this.address, this.signature, messagePrefix); } catch (e) {}
    //This is a fix for https://github.com/bitcoinjs/bitcoinjs-message/issues/20
    if (!isValid)  isValid = BtcMessage.verifyElectrum(this.uri, this.address, this.signature, messagePrefix);
    return isValid;
  }
  catch(e) {
    return false;
  }
};

Bitid.prototype.__defineGetter__('qrcode', function() {
  return 'http://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=' + escape(this.uri);
});

Bitid.prototype.__defineGetter__('uri', function() {
  return url.format(this._uri);
});

Bitid.prototype.__defineGetter__('nonce', function() {
  return this._uri.query[PARAM_NONCE];
});
