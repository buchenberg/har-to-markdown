const test = require('tape');

test('conversion test', function (t) {
  t.plan(1);

  t.equal(typeof Date.now, 'function');

  let start = Date.now();

  setTimeout(function () {
    t.equal(Date.now() - start, 100);
  }, 100);
  
});
