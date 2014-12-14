    $(document).ready(function() {
        $('#nav').onePageNav();
    });

    $('#acord1').accordion({
        active: false
    });

    $('#acord2').accordion({
        collapsible: true,
    });

    $('#acord3').accordion({
        collapsible: true,
        previousOpen: true
    });

    $('#acord4').accordion({
        collapsible: true,
        openAll: true
    });



    var instance = $('#acord5').accordion();

    $('#disable').click(function() {
        instance.disabled([0, 3]);
    });
    $('#enable').click(function() {
        instance.enabled([0, 3]);
    });

    var instance2 = $('#acord6').accordion({active:false});

    $('#collapse').click(function() {
        instance2.collapse([0, 2]);
    });
    $('#expand').click(function() {
        instance2.expand([0, 2]);
    });

    $('#acord7').accordion({
        callBack:function(){
            console.log('callBack fire',arguments);
        }
    });

    $('#acord8').accordion({
        openEvent:'mouseover'
    });

    $('#acord9').accordion({
        showHideSpeed: 'slow'
    });

    $('#acord10').accordion({
        icons: {
            "header": "plus",
            "activeHeader": "minus"
        }
    });

    $('#acord11').accordion({
        active: [0, 2]
    });

    //showCode 
    var lightBoxParamObj = {dimens:{width:'600px'}};
    $('.showCode').on('click', function() {
        $.extend(lightBoxParamObj,{ltBox:$('#codeCont'+$(this).data('id'))});
        if($(this).data('id')){
            $(this).lightBox(lightBoxParamObj).open();
            $(this).data('id',0);
        }
    })

