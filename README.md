# FaBoChart
Faust and Bolander chart
![Charts](https://raw.githubusercontent.com/Bolandish/FaBoChart/master/Capture.JPG)
```
<div id="chart"></div>
```

```
$(document).ready(function () {
    data = {
      '2010' : 500, 
      '2011' : 400,
      '2012' : 240,
      '2013' : 300,
      '2014' : 320,
      '2015' : 567
    };

    $("#chart").faBoChart({
      time: 500,
      animate: true,
      instantAnimate: true,
      straight: false,
      data: data
    });
});
```
