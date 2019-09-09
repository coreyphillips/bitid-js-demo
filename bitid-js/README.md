# BitID

This is the javascript implementation of the BitID authentication protocol.
Checkout the original Ruby version at https://github.com/bitid/bitid-ruby

Basically, what the module does is build a message challenge and verifying the signature.

## Installation

Add this line to your application's package.json dependencies:

    'bitid': 'latest'

Or install it yourself as:

    $ npm install bitid

## Usage

### Challenge

To build a challenge, you need to initialize a `Bitid` object with a `nonce` and a `callback`.

```
var bitid = new Bitid({nonce:nonce, callback:callback});
```

`nonce` is a random string associated with the user's session id.
`callback` is the url without the scheme where the wallet will post the challenge's signature.

One example of callback could be `www.site.com/callback`. A callback cannot have parameters. By
default the POST call will be done using `https`. If you need to tell the wallet to POST on
`http` then you need to add `unsecure:true`.

```
var bitid = new Bitid({nonce:nonce, callback:callback, unsecure:true});
```

Once the `Bitid` object is initialized, you have access to the following methods :

```
bitid.uri
```

This is the uri which will trigger the wallet when clicked (or scanned as QRcode). For instance :

```
bitid://bitid-demo.herokuapp.com/callback?x=987f20277c015ce7
```

If you added `unsecure:true` when initializing the object then uri will be like :

```
bitid://bitid-demo.herokuapp.com/callback?x=987f20277c015ce7&u=1
```

To get the uri as QRcode :

```
bitid.qrcode
```

This is actualy an URL pointing to the QRcode image.

### Verification

When getting the callback from the wallet, you must initialize a `Bitid` object with the received 
parameters `address`, `uri`, `signature` as well as the excpected `callback` :

```
var bitid = new Bitid(address:address, uri:uri, signature:signature, callback:callback);
```

You can after call the following methods :

```
bitid.nonce
```

Return the `nonce`, which would get you the user's session.

```
bitid.uriValid()
```

Returns `true` if the submitted URI is valid and corresponds to the correct `callback` url.

```
bitid.signatureValid()
```

If returns `true`, then you can authenticate the user's session with `address` (public Bitcoin
address used to sign the challenge).


## Integration example

JavaScript application using the bitid lib: https://github.com/porkchop/bitid-js-demo

Live demonstration: http://bitid-js-demo.herokuapp.com/

## In the Wild

The following projects use bitid-js.

If you are using bitid-js in a project, app, or module, get on the list below
by getting in touch or submitting a pull request with changes to the README.

### Startups & Apps

- [Decryptocoin](http://decryptocoin.com/)

## Author
Aaron Caswell
aaron@captureplay.com

## Credits
Eric Larchevêque (The creator of the Bitid protocol and the original Ruby gem this code is based on)
elarch@gmail.com

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
