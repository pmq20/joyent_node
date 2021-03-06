// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var common = require('../common');
var assert = require('assert');
var spawn = require('child_process').spawn;
var N = 4 << 20;  // 4 MB

for (var big = '*'; big.length < N; big += big);

if (process.argv[2] === 'child') {
  process.stdout.write(big);
  process.exit(42);
}

var stdio = ['inherit', 'pipe', 'inherit'];
var proc = spawn(process.execPath, [__filename, 'child'], { stdio: stdio });

var chunks = [];
proc.stdout.setEncoding('utf8');
proc.stdout.on('data', chunks.push.bind(chunks));

proc.on('exit', common.mustCall(function(exitCode) {
  assert.equal(exitCode, 42);
  assert.equal(chunks.join(''), big);
}));
