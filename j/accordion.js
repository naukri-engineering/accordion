//jslint sub:true

//Accordion js
//version v3.0.3

(function($) {
    $.fn.accordion = function(opts) {
        var defaults = {
            active: 0,

            showHideSpeed: 'fast',
            openEvent: 'click',
            icons: {
                "header": "acordUp",
                "activeHeader": "acordDown"
            }
        }

        if (opts.active === false) {
            opts.active = 'false';
        } else if (opts.active && !opts.active.length) {
            opts.active = 0;
        }

        if(opts.disabled === true){
            opts.disabled = [];
        }

        var opts = $.fn.extend({}, defaults, opts), prevAct;

        
        function expendFn(elm) {
            elm.removeClass(opts.icons['header']).addClass(opts.icons['activeHeader']).next().slideDown(opts.showHideSpeed).data('openState', 1).removeClass('close').addClass('open');
            opts.onClick ? opts.onClick() : opts.callBack ? opts.callBack(elm,'expand') : ''; // to give support of older version
        }

        function collapseFn(elm) {
            elm.removeClass(opts.icons['activeHeader']).addClass(opts.icons['header']).next().slideUp(opts.showHideSpeed).data('openState', 0).removeClass('open').addClass('close');
            opts.onClick ? opts.onClick() : opts.callBack ? opts.callBack(elm,'collapse') : ''; // to give support of older version
        }

        function traverseIndexes(elm, Indexes, type) {
            elm.each(function(key, value) {
                if ($.inArray(key, Indexes) !== -1 || !Indexes.length) {
                    if (type == "collapse") {
                        collapseFn($(this));
                    } else {
                        prevAct = $(this).next();
                        expendFn($(this));
                    }
                }
            });
        }
        
        function expend_collapse(elm, arrAy, type) {
            if (arrAy || arrAy === 0) {
                if (typeof (arrAy) == 'object') {
                    traverseIndexes(elm.children('.acord_head'), arrAy, type);
                } else {
                    traverseIndexes(elm.children('.acord_head'), [arrAy], type);
                }
            } else {
                traverseIndexes(elm.children('.acord_head'), [], type);
            }
        }

        
        function initAccord(elm){
            var this_child = elm.children('span'),
                this_next = elm.next();
            

            if (opts.collapsible && !opts.previousOpen) {

                if (!this_next.data('openState')) {
                    if (prevAct.length && prevAct.data('openState')) {
                        collapseFn(prevAct.prev());
                    }
                    prevAct = this_next;
                    expendFn(this_next.prev());
                } else {
                    collapseFn(this_next.prev());
                }
            } else if (opts.collapsible && opts.previousOpen) {
                if (this_next.data('openState')) {
                    collapseFn(this_next.prev());
                } else {
                    expendFn(this_next.prev());
                }
            } else {
                if (!this_next.data('openState')) {
                    if (prevAct) {
                        collapseFn(prevAct.prev());
                    }
                    prevAct = this_next;
                    expendFn(this_next.prev());
                }
            }            
        }

        function disable_enable_type(elm,type){
            if(type=="disable"){
                elm.addClass('disable').off(opts.openEvent);
            }else if(type=="enable"){
                elm.removeClass('disable').on(opts.openEvent,function(){
                    initAccord($(this)); 
                });
            }   
        }

        function enable_disable(elm, arrAy, type) {
            if(arrAy || arrAy === 0){
                if(Object.prototype.toString.call(arrAy)=="[object Array]"){
                    if(arrAy.length){
                        elm.each(function(key,value){
                            if($.inArray(key,arrAy) != -1){
                                disable_enable_type($(this),type);
                            }
                        });
                    }else{
                        disable_enable_type(elm,type);
                    }
                }else{
                    disable_enable_type(elm.eq(arrAy),type);
                }      
            }else{
                disable_enable_type(elm,type);
            }
        }


        this.each(function() {
            var elm = $(this).children('.acord_head');

            if(opts.disabled){
                enable_disable(elm,opts.disabled,'disable');    
            }else{
                disable_enable_type(elm,'enable');                
            }
            
            elm.each(function() {
                $(this).addClass(opts.icons['header']).prepend('<span></span>').next().addClass('close');
            });

            if (opts.openAll) {
                traverseIndexes(elm, [], 'expand');

            }else{
                if (opts.active != 'false') {
                    if (typeof (opts.active) == 'object') {
                        traverseIndexes(elm, opts.active, 'expand');
                    } else {
                        traverseIndexes(elm, [opts.active], 'expand');
                    }
                }
            }
        });


        this.expand = function(expArr) {
            expend_collapse($(this), expArr, 'expand');
        }

        this.collapse = function(colArr) {
            expend_collapse($(this), colArr, 'collapse');
        }

        this.disabled = function(disbArr) {
            enable_disable($(this).children('.acord_head'),disbArr,'disable');
        }             

        this.enabled = function(enabArr) {
            enable_disable($(this).children('.acord_head'),enabArr,'enable');
        }

        return this;
    }
})(jQuery)
/*Accordion call*/

//parameters
/*
active
collapsible
previousOpen
showHideSpeed
allOpen 
openEvent
icons
onClick
callBack
enabled
disabled
expand
collapse
*/