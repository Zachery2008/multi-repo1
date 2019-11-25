var generator = require('generate-password');
 
var password = generator.generate({
    length: 20,
    uppercase: true,
    numbers: true,
    symbols: true,
    strict: true
});
 

console.log(password);