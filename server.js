var formidable = require('formidable'),
    http = require('http'),
    util = require('util');

var PORT = 8002,
    ADDRESS = '127.0.0.1',
    STRIPE_SECRET_KEY = '',
    STRIPE_PUBLIC_KEY = '';


http.createServer(function(req, res) {

  if (req.url == '/paid' && req.method.toLowerCase() == 'post') {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
  	  console.log('post fields', fields)
      // Set your secret key: remember to change this to your live secret key in production
      // See your keys here https://dashboard.stripe.com/account/apikeys
      var stripe = require("stripe")(STRIPE_SECRET_KEY);

      var stripeToken = fields.stripeToken;;

      var charge = stripe.charges.create({
        amount: 999, // amount in cents, again
        currency: "dkk",
        source: stripeToken,
        description: "Strip Spacebook charge"
      })
      .then(function(charge) {
        // New charge created on a new customer
        console.log('charge', charge);

        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received from stripe:\n\n');
        res.end(util.inspect(charge));

      }).catch(function(err) {

        // Deal with an error
        console.log('StripeCardError', err);
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('error');
        res.end(util.inspect(err));
        res.end(util.inspect(charge));
      });


    });

    return;
  }

  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end( `
<form action="paid" method="POST">
  <script
    src="https://checkout.stripe.com/checkout.js" class="stripe-button"
    data-key= ${STRIPE_PUBLIC_KEY}
    data-amount="999"
    data-name="Demo Site"
    data-description="Widget"
    data-locale="auto"
    data-zip-code="false"
    data-currency="dkk">
  </script>
</form>
`);
}).listen(PORT, ADDRESS);
console.log('lisening on ', ADDRESS, PORT )
