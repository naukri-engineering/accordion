/* jslint curly : false	 */
/* jslint asi : true	 */
/*global pageXOffset */
/*global pageYOffset */

/*Start of lightBox*/
(function($){
 /** Refered : JQuery UI Code */
 /** Detects focusable element */
function focusable(element, isTabIndexNotNaN) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ("area" === nodeName) {
		map = element.parentNode;
		mapName = map.name;
		if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
			return false;
		}
		img = $("img[usemap=#" + mapName + "]")[0];
		return !!img && visible(img);
	}
	return (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled :
		"a" === nodeName ?
		element.href || isTabIndexNotNaN :
		isTabIndexNotNaN) &&
	// the element and all of its ancestors must be visible
	visible(element);
}

function visible(element) {
	return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function () {
		return $.css(this, "visibility") === "hidden";
	}).length;
}

$.expr[":"].focusable = function (element) {
	return focusable(element, !isNaN($.attr(element, "tabindex")));
};	
 /** Refered : JQuery UI Code */
 
/** Some common Utility functions*/
var util = {
	is_options_valid : function(options){
		if(!options || !options.ltBox || (options.ltBox.prop('nodeType') !== 1)){
			return false;
		}
		return true;
	},
	is_animtion_support : function(){
		/** Need to be relooked */
		return window.navigator.userAgent.match(/MSIE (7|8|9)/)=== null;	
	},
	switchClass:function(a,b){
		this.removeClass(a).addClass(b);
	}	
};

/** Singleton Pattern */
/**
	If options are given each time a new object will be returned otherwise last configure object will be returend
 */
$.fn.lightBox = function (options) {
    var obj = null;		
	if (util.is_options_valid(options)) {
		$.each(this,function(a,b){
			var _this = $(b);
			obj = new constructor(options,_this);
			_this.data('lt_Box', obj);
		});
	}	
    return this.data('lt_Box') || obj;
};

var constructor = function (options,trigger) {
	/** Cleaning registered events for same trigger-lightBox*/
	var obj = trigger.data('lt_Box');
	if(obj && obj.options.ltBox[0]===options.ltBox[0]){
			obj.reInit();
	}
	options.trigger = trigger;
    this.init(options);
};

/** Prototype of lightbox */
var proto_lightbox = (function () {
	var pluginName = 'lightBox';
	
    var default_opt = {
        ltBox: null,
        dimens: {
            height: 'auto',
            width: 'auto'
        },
        resetForm: false,
        fixed: false,
		open:{
				success : function(){},
				event : 'click',
				anim : {className:''}				
		},
        close: {
            esc: true,
            layer: true,
			nodes : {target:'',event:'click',selector:''},
			success : function(){},
	        returnFocus: true,
			anim : {className:'',duration:0}
        }
    };
	
	/** Runs once */
    var lt = (function () {
        var cont = $('<div class="ltCont close"></div>').attr('tabIndex', 0);
        var layer = $('<div class="ltLayer close"></div>');
        cont.append(layer);
		
		
		//Reset lightBox on resize
		$(window).bind('resize', function () {
			try{
				if (lt.stack.length){
					var top = lt.stack[0];
					resizeLtBox.call(top);
				}
			}
			catch(e){}
    	});
		
		//Close lightBox on close
		$('html').keydown(function(event){
			if(event.keyCode===27 && lt.stack.length && lt.stack[0].options.close.esc){				
				lt.stack[0].close();					
			}
		});
		
		//Close lightBox on layer click
		layer.click(function(){
			if(lt.stack.length && lt.stack[0].options.close.layer){
				lt.stack[0].close();					
			}	
		});

        return {
            //Top most visible lightbox is lt.stack[0]
            stack: [],
            cont: cont,
            layer: layer
        };
    }());
	

	//Document Ready
	$(function () {
		$('body').append(lt.cont);
	});
	
	/** option = {
			index:0,
			all:false,
			allPrevious:false,
			noAnim:false
		}
	*/
	$.fn.lightBox.close = function(option){
		
		var start,end;

		start = 0;
		end = 0;		
		option = option || {};
		
		if(option.all){
			start = (lt.stack.length-1);			
		}
		if(option.allPrevious){
			start = (lt.stack.length-1);			
			end = 1;
		}
		else if(option.index)
		{
			end = start = option.index;
		}
		
		for(var i=start;i>=end;i--){
			(i in lt.stack)?lt.stack[i].close(i,option.noAnim):'';
		}	
	};
	$.fn.lightBox.closeAll = function(option){
		$.fn.lightBox.close(option||{all:true});
	};
	
	

    var manage_focus = (function () {      
		
        /** If tab is pressend on or in lightbox */
        lt.cont.keydown(function (event) {
            if (!lt.stack.length || event.keyCode !== 9){
                return;
			}
            var list = lt.stack[0].options.ltBox.find(':focusable');
            var first = list.first();
            var last = list.last();

            if ((event.target === last[0] || event.target === event.currentTarget) && !event.shiftKey) {
                first ? first.focus() : '';			
                return false;
            } else if ((event.target === first[0] || event.target === event.currentTarget) && event.shiftKey) {
                last ? last.focus() : '';
                return false;
            }
            event.stopPropagation();
        });

        /** If tab is pressed on first or last focusable element and lightbox is open */
        $('html').keydown(function (event) {
            if (event.keyCode !== 9){ return;}
            /** If lightbox is open */
            if (lt.stack.length) {
                lt.cont.focus();
                return false;
            }
        });
    }());
	
    //for findOut max ZIndex on page
	// * is replaced with .ltLayer as multiple ltCont are created when lightBox.js is included more than once. 
    function getMaxZIndex() {
        var zIndexMax = 999;
		$('.ltCont .ltLayer').each(function () {
            var z = parseInt($(this).css('z-index'));
            if (z > zIndexMax) zIndexMax = z;
        });
        return zIndexMax;
    }	
	
    var resizeLtBox = function () {

		//Reseting dimensions of container to make sure it resizes according to requirement
		$('.ltCont').css({width:'auto',height:'auto'})

        var _doc = document.documentElement || document.body,
            innerH = $(window).height(),
            totalH = $(document).height(),			
            innerW = $(window).width(),
            totalW = $(document).width(),
            scrollT = window.pageYOffset ? pageYOffset : _doc.scrollTop,
            scrollL = window.pageXOffset ? pageXOffset : _doc.scrollLeft			
        var availH = innerH - this.options.ltBox.height(),
            tpPos = 0;
        var availW = innerW - this.options.ltBox.width(),
            lpPos = 0;
        if (availH > 0) {			
            tpPos = (!this.options.fixed?scrollT:0) + (availH / 2);
	    } else {			
            /*scrollT = totalH > innerH ? scrollT - 20 : scrollT;
            tpPos = scrollT + availH;*/
			tpPos = 0;
            window.scrollTo(0, tpPos);
        }
        lpPos = availW > 0 ? availW / 2 : 0
       
		lt.cont.css({
			width: totalW + 'px',
			height: totalH + 'px'			
		});
		this.options.ltBox.css({
			top: tpPos + 'px',
			left: lpPos + 'px'		            
		});
		return true;		
    }

    var init_Dimensions = function () {
        this.options.ltBox.css({
            position: (this.options.fixed ? 'fixed' : 'absolute'),
            width: this.options.dimens.width,
            height: this.options.dimens.height
        });
    }

    var init_options = function (param) {
        this.options = $.extend(true,{},default_opt, param);
    }

    var init_structre = function () {
        var parent = this.options.ltBox.parent();
        /** Check if lightBox alerady present in ltCont */
        if (!parent.hasClass('ltCont')) {
            lt.cont.append(this.options.ltBox);			
        }
    }
	
	
	var animate = {
		open:function(){			
			var arr = [this.options.close.anim.className,this.options.open.anim.className];
			util.switchClass.call(this.options.ltBox,arr[0],arr[1]);
		},
		close : function(obj){
			var arr = [this.options.close.anim.className,this.options.open.anim.className];
			util.switchClass.call(this.options.ltBox,arr[1],arr[0]);
			var delay = 0;
			if(util.is_animtion_support())
				delay = this.options.close.anim.duration;
			setTimeout(function(){obj.cb()},delay)
		}	
	}
	
	

    var open = function () {

		if(!lt.stack.length){
			lt.cont.removeClass('close')
			util.switchClass.call(lt.layer,'close','open')
		}
		
		resetForm.call(this);
		/** Setting zIndex of lightBox and black layer */
		var maxZIndElm = getMaxZIndex()
 		lt.layer.css('zIndex',  maxZIndElm + 3);
		lt.cont.css('zIndex', maxZIndElm + 1);
		this.options.ltBox.css('zIndex', maxZIndElm + 3)		
		/** Visible */
		//util.switchClass.call(this.options.ltBox,'lightbox','lightbox_open')
		this.options.ltBox.addClass('lightbox_open');
		/** Center align LightBox */
		resizeLtBox.call(this);	
		/** Animation Code */	
		animate.open.call(this);		
		/** Focus Element */
		open_firstFocus.call(this);						
		/** Stack Update */
		if($.inArray(this,lt.stack)===-1)
			lt.stack.unshift(this);				
		/** Success callback */
		(this.options.open.success)()		
	
        
    }
	
	var open_firstFocus = function () {
		/** IE specific fix, for scroll move on focus*/
		var scrollTop = document.documentElement.scrollTop;
        var ff = this.options.open.firstFocus;
        if (ff)
            ff.focus();
        else
            lt.cont.focus();
		/** IE specific fix, for scroll move on focus*/			
		document.documentElement.scrollTop=scrollTop;			
    }
	var resetForm = function(){
		if(!this.options.resetForm)
			return;
		var forms = this.options.ltBox.find('form');
		for(var key=0;key<forms.length;key++){
			forms[key].reset();	
		}
		
	}
	
	
    var close = function (index,noAnim) {
		var _this = this;
		var p = lt.stack;
		index = index || $(lt.stack).index(this);
		if(!lt.stack.length || index<0)
			return;

		lt.stack.splice(index,1);
		
		/** Close callback Obj */	
		var callBackObj = {
			cb:function(){	
				_this.options.ltBox.removeClass('lightbox_open');
				if(lt.stack.length){				
					var top = lt.stack[0];	
					lt.layer.css('zIndex',top.options.ltBox.css('zIndex'));		
					resizeLtBox.call(top);
				}else{
					lt.cont.addClass('close')
				}
				close_returnFocus.call(_this);
				resetForm.call(_this);
				(_this.options.close.success)();
	
			}
		}
		
		noAnim?callBackObj.cb():animate.close.call(this,callBackObj);	

		if(!lt.stack.length)
			util.switchClass.call(lt.layer,'open','close')
    }
	
	var close_returnFocus = function(){
		if(!lt.stack.length){
			var rf = this.options.close.returnFocus;
			rf===true?this.options.trigger.focus():$(rf).focus();		
		}
	}
	
	
	
	var init_openclose_Properties = function(){
		 var _this = this;		
		/** Adding event on trigger */
		this.options.trigger.on(this.options.open.event+'.'+pluginName,function(){_this.open();})

		/**Adding events Closing nodes */
		init_closeNodes.call(this,this.options.close.nodes)
	}
	
	var init_closeNodes = function(nodes){
		var _this = this;		
		
		if($.type(nodes) === 'array'){//Recursive
			$.each(nodes,function(a,b){init_closeNodes.call(_this,b)})		
			return;
		}
		
		var config = null;		
		if(nodes.constructor === jQuery){
			config = $.extend({},default_opt.close.nodes);
			config.target = nodes;
		}
		else
		{
			config = {
				target : $(nodes.target),
				event : nodes.event,
				selector : nodes.selector
			} 
		}
		config.target.on(config.event,config.selector,function(){_this.close();})							
	}
	
	/** Run every time a new lightbox is created */
    var init = function (param) {	

        init_options.call(this, param)
        init_structre.call(this);		
        init_Dimensions.call(this);
		init_openclose_Properties.call(this);
		
		this.options.ltBox.addClass(this.options.close.anim.className);
		
    }
	var reInit = function(){
		this.options.trigger.off(this.options.open.event+'.'+pluginName);
	}
	
	var resize = function(){
		resizeLtBox.call(this);
	}
	   

    /** Add modules to be accessable from outside */
    return {
        init: init,
		reInit:reInit,
		resize:resizeLtBox,
        open: open,
        close: close
    };
	
}())
constructor.prototype = proto_lightbox;
}(jQuery));
/*End of lightBox*/