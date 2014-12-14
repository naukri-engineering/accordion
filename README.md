jQuery Accordion (version : v1.0.0)
=========
-------------------------------------------------------

##### A lightweight jQuery Accordion plugin helps to display collapsible content panels for presenting information when the amount of space is limited. Easy to manage show/hide animation speed. It's use jQuery animation method to support for older browsers.

##### It's also provide many configurable parametes and built in functions. (refer: parameters and method sections.)

-------------------------------------------------------

## Demo
[Try out the demo: ](http://naukri-engineering.github.io/accordion/)

-------------------------------------------------------


## Browser Support
* Internet Explorer 7+
* Chrome 14+
* Firefox 3.5+
* Safari 4+
* Opera 10.6+

-------------------------------------------------------

## Size
* Production (minified): 2.4 KB
* Production (minified) with gziped: 853 Bytes
* Development (non-minified) : 6.3 KB


-------------------------------------------------------

## Getting Started

* Add required HTML 

```HTML
<div id="acord1" class="acord">
    <h3 class="acord_head">Section 1</h3>
    <div class="acord_cont">
        Section1
    </div>
    <h3 class="acord_head">Section 2</h3>
    <div class="acord_cont">
        Section2
    </div>
    <h3 class="acord_head">Section 3</h3>
    <div class="acord_cont">
        Section3
    </div>
</div>

(Note : Each content panel (having class "acord_cont") must always be the next sibling after its associated header (having class "acord_head")
```
* Add Plugin Call

```javascript
    $('#acord1').accordion();
```

* Include the Style Sheet(accordion.css)
* Include the suggestor javascript library(accordion.js) & updated jQuery liberary

-------------------------------------------------------


## Parameters (Options)

Name  | Default Value | Discription
----|-----|-----
active  | 0 | Which panel is currently open. (Setting active to false will active zero-based index of the panel and true will active first index of the panel. The zero-based index of the panel that is active (open). A negative value selects panels going backward from the last panel.)
openEvent | 'click' | Any event (e.g. 'keypress','mouseover') 
collapsible | false | Whether all the sections can be closed at once. Allows collapsing the active section.
previousOpen | false | if true then previous section remain open while active to other section.
showHideSpeed | 'slow' | 'slow' or  'medium' or 'fast' or an interger value (in miliseconds) e.g. 2000
allOpen | false | Whether to show all section open(active) at once. Allows collapsing to each section.
icons | { "header": "acordUp", "activeHeader": "acordDown" } | icons to use for headers. Set to false to have no icons displayed.
onClick or callBack | null |Triggered after a panel has been activated. 


## Methods

Name  |  Discription
----|-----
enabled | If call with no arguments then enabled all sections of accordion, if pass a single argument as an interger/string then enabled the given index section , if argument pass as an array of intergers then enabled only matched indexes sections.
disabled | If call with no arguments then disabled all sections of accordion, if pass a single argument as an interger/string then disabled the given index section , if argument pass as an array of intergers then disabled only matched indexes sections.
collapse | If call with no arguments then collapse all sections of accordion, if pass a single argument as an interger/string then collapse the given index section , if argument pass as an array of intergers then collapse only matched indexes sections.
expand | If call with no arguments then expend all sections of accordion, if pass a single argument as an interger/string then expend the given index section , if argument pass as an array of intergers then expand only matched indexes sections.


-------------------------------------------------------

## Usage

### active
```javascript
$( ".selector" ).accordion({ active: 1 });
```
### disabled
```javascript
$( ".selector" ).accordion({ disabled: true });
```
### openEvent
```javascript
$( ".selector" ).accordion({ openEvent: "mouseover" });
```
### collapsible
```javascript
$( ".selector" ).accordion({ collapsible: true });
```
### previousOpen
```javascript
$( ".selector" ).accordion({ previousOpen: true });
```
### openAll
```javascript
$( ".selector" ).accordion({ collapsible: true, openAll: true });
```
### icons
```javascript
$( ".selector" ).accordion({ icons: { "header": "acordUp", "activeHeader": "acordDown" } });
```
### onClick
```javascript
$( ".selector" ).accordion({
  onClick: function( ) {}
});
```

### expand()
```javascript
var accord = $( ".selector" ).accordion();
accord.expand();  // expand all sections
or
accord.expand(1);  // expand only first index.
or
accord.expand([1,3]); // espand first and third index sections.

Note : index starts from zero.
```

### collapse()
```javascript
var accord = $( ".selector" ).accordion();
accord.collapse();  // collapse all sections
or
accord.collapse(1);  // collapse only first index.
or
accord.collapse([1,3]); // espand first and third index sections.

Note : index starts from zero.
```
### disabled()
```javascript
var accord = $( ".selector" ).accordion();
accord.disabled();  // disabled all sections
or
accord.disabled(1);  // disabled only first index.
or
accord.disabled([1,3]); // espand first and third index sections.

Note : index starts from zero.
```
### enabled()
```javascript
var accord = $( ".selector" ).accordion();
accord.enabled();  // enabled all sections
or
accord.enabled(1);  // enabled only first index.
or
accord.enabled([1,3]); // espand first and third index sections.

Note : index starts from zero.
```