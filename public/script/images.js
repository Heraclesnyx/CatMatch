$(document).ready(function() {

    resizeElements = function () {
        $('.container').height($(window).height() - 60);
        $('.bloc').height($(window).height() - 60);

        $(".root img").each(function() {
            var width = $(this).width();
            var height = $(this).height();

            if(width > height) {
                $(this).css("width", "auto");
                $(this).css("height", "100%");
            }
        });

    };
    $(window).resize(function () {
        resizeElements();
    });
    resizeElements();

});