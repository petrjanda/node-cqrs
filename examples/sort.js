var array = [];

for(var i = 0; i < 10000000; i++) {
  array.push(Math.floor(Math.random() * 100000));
}

var start = new Date().getTime();

array.sort(function(a,b) {
  return a - b;
});

var time = new Date().getTime() - start;
console.log(time + " ms");


// http://en.literateprograms.org/Merge_sort_%28JavaScript%29