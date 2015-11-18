(function ($) {


    //Element templates
    var point = $("<div>").addClass("fabo-point");
    var point_inner = $("<div>").addClass("fabo-point-inner");
    var value = $("<div>").addClass("fabo-value").addClass("hide-border").addClass("hide");
    var value_text = $("<div class='fabo-value-text'></div>");
    var label_text = $("<div class='fabo-value-label'></div>");

    $.fn.faBoChart = function (options) {

        // Default settings
        var settings = $.extend({
            data: {

            },
            animate : true,
            time : 2000,
            instantAnimate : true,
            straight : false,
            valueColor : "#7b82ff",
            backgroundColor : "#f4f6f7",
            valueTextColor : "#ffffff",
            labelTextColor : "#95a5b3",
            gutter : "2px"
        }, options);

        //Point background color
        point_inner.css("background-color", settings.backgroundColor);

        //The space between points
        point.css("padding-left", settings.gutter);

        //Color of the points value
        value.css({
            "border-right-color" : settings.valueColor,
            "border-left-color" : settings.valueColor
        });

        //Text colors
        value_text.css("color", settings.valueTextColor);
        label_text.css("color", settings.labelTextColor);

        //Is it curved
        var straight = settings.straight;

        //Animate on init
        var instantAnimate = settings.instantAnimate;

        //All the data to show
        var data = settings.data;

        //Count data-objects
        var count = objSize(data);

        //Should it animate
        var animate = settings.animate;

        //Animation time
        var animation_time = settings.time;

        container = $(this);

        container.addClass("fabo-chart");

        //add the straight to container
        container.data("straight", straight);

        //Set width of each point
        point.css("width", 100 / count + "%");

        var highest = 0;
        var keys = [];

        //Make key array
        $.each(data, function (index, v) {
            keys.push(index);

            if (v > highest)
                highest = v;

        });

        //Foreach keys
        $.each(keys, function (index, v) {
            var pi = point_inner.clone();

           //Clone the point template
            var p = point.clone();

            //Retrieve the current value
            var val = data[v];
            //... and the next
            var next = data[keys[index + 1]];

            //Append the point to point_inner
            pi = $(pi).appendTo(p);
            //Append to container
            p = $(p).appendTo(container);

            //Add value
            addValue(pi, val, next, v, highest, straight);
        });

        $( window ).resize(function(){
            reloadSizes();
        });

        //If animate
        if(animate)
            animateValues(container,animation_time, instantAnimate);
        else
            $(container).find(".fabo-value").removeClass("hide");

        return this;

    };


    function reloadSizes(){

        $(".fabo-chart").each(function(){
            var container = $(this);

            var pi = $(this).find(".fabo-point-inner:first");

            var width = Math.ceil(pi[0].getBoundingClientRect().width);

            //Based on the information on the point, set the border
            if(!container.data("straight")) {
                $(container).find(".fabo-point-inner:not(.bigger-than) .fabo-value").css("border-left-width", width + "px");
                $(container).find(".fabo-point-inner.bigger-than .fabo-value").css("border-right-width", width + "px");
            }
            else{
                //If its straigt, set only the width on right
                $(this).find(".fabo-value").css("border-right-width", width + "px");
            }


        })

    }

    function addValue(pi, val, next, label, highest, straight) {

        var v = value.clone();

         //Get the width
        var width = Math.ceil(pi[0].getBoundingClientRect().width);

        //Clone the label and value templates and put the text in them
        label_text.clone().text(label).appendTo(pi);
        value_text.clone().text(val).appendTo(pi);

        //If curved
        if(!straight) {

            //If the next is undefined, then uss this value
            next = (typeof next == "undefined") ? val : next;

            //If next value is bigger than this
            var biggerThan = (next > val);

            var different = 0;
            if (!biggerThan)
                different = val - next;
            else
                different = next - val;

            //Get the diferent between them
            var different = (different / highest);


            var innerHeight = Math.ceil(pi[0].getBoundingClientRect().height);

            //Set height
            if (biggerThan) {
                //If its bigger than, then put the border on the right side
                v.css("border-right-width", width + "px");
                var height = val * 100 / highest;
                var niveau = innerHeight * different;
                niveau = Math.ceil(niveau);
            }
            else {
                //If its smaller than, then put the border on the left side
                v.css("border-left-width", width + "px");
                var height = next * 100 / highest;
                var niveau = innerHeight * different;
                niveau = Math.ceil(niveau);
            }
            //Save it on the object for later use
            pi.data("biggerThan", biggerThan);
            if(biggerThan)
            pi.addClass("bigger-than");
            //Set the standard height
            v.css("border-top-width", niveau + "px");
        }
        else{
            //If its a straight , then set only the height on the right side
            v.css("border-right-width", width + "px");
            var height = val * 100 / highest;
        }
        v.css("height", height + "%");

        v.appendTo(pi);

        return pi;
    }


    //This function animates the point one after one
    function animateValues(container,time, instantAnimate){
        var elm = $(container).find(".fabo-value");

        var timer = (time / elm.length);
        var origin_time = timer;

        if(!instantAnimate) {
            setTimeout(function () {
                elm.removeClass("hide-border");
            }, time + 200);
        }
        else{
            elm.removeClass("hide-border");
        }

        elm.each(function(){
            var v = $(this);

            setTimeout(function(){
                v.removeClass("hide");
            }, timer);

            timer += origin_time;
        });
    }
}(jQuery));


var objSize = function (obj) {
    var count = 0;

    if (typeof obj == "object") {

        if (Object.keys) {
            count = Object.keys(obj).length;
        } else if (window._) {
            count = _.keys(obj).length;
        } else if (window.$) {
            count = $.map(obj, function () {
                return 1;
            }).length;
        } else {
            for (var key in obj) if (obj.hasOwnProperty(key)) count++;
        }

    }

    return count;
};