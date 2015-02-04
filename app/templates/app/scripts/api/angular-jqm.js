/*! angular-jqm - v0.0.1-SNAPSHOT - 2014-01-20
 * https://github.com/angular-widgets/angular-jqm
 * Copyright (c) 2014 OPITZ CONSULTING GmbH; Licensed MIT */
(function (window, angular) {
    "use strict";
    /**
     * @ngdoc overview
     * @name jqm
     * @description
     *
     * 'jqm' is the one module that contains all jqm code.
     */

    //Save bytes and make code more readable - these vars will be minifed. Angularjs does this
    var jqmModule = angular.module("jqm", ["ngTouch", "ngRoute", "ngAnimate", "ajoslin.scrolly", "ui.bootstrap.position"]),
        equals = angular.equals,
        extend = angular.extend,
        forEach = angular.forEach,
        isArray = angular.isArray,
        isDefined = angular.isDefined,
        isObject = angular.isObject,
        isString = angular.isString,
        jqLite = angular.element,
        noop = angular.noop,
        isFunction = angular.isFunction;

    var JQM_ANIMATIONS = [
  'slide',
  'fade',
  'pop',
  'slidefade',
  'slidedown',
  'slideup',
  'flip',
  'turn',
  'flow',
  'modal'
];


    registerJqmAnimations(JQM_ANIMATIONS);

    function registerJqmAnimations(animations) {
        for (var i = 0; i < animations.length; i++) {
            registerJqmAnimation(animations[i]);
        }
    }

    function registerJqmAnimation(animationName) {
        jqmModule.animation('.' + animationName, ['$timeout', '$animationComplete',
            function ($timeout, $animationComplete) {
                function makeAnimationFn(className) {
                    return function (element, done) {
                        var unbind, finished;
                        element.css('z-index', -10);
                        animate();
                        element.css('z-index', '');

                        function animate() {
                            if (!finished) {
                                element.addClass(className);
                                unbind = $animationComplete(element, done, true);
                            }
                        }

                        return function cleanup() {
                            finished = true;
                            (unbind || noop)();
                            element.removeClass(className);
                        };
                    };
                }
                var inAnimation = makeAnimationFn('in');
                var outAnimation = makeAnimationFn('out');
                return {
                    enter: inAnimation,
                    leave: outAnimation,
                    move: inAnimation,
                    addClass: function (element, className, done) {
                        if (className === 'ng-hide') {
                            return outAnimation(element, done);
                        } else {
                            return inAnimation(element, done);
                        }
                    },
                    removeClass: function (element, className, done) {
                        if (className === 'ng-hide') {
                            return inAnimation(element, done);
                        } else {
                            return outAnimation(element, done);
                        }
                    }
                };
  }]);
    }


    registerJqmPageAnimations(JQM_ANIMATIONS);

    function registerJqmPageAnimations(animations) {
        for (var i = 0; i < animations.length; i++) {
            registerAnimation(animations[i], 'page-' + animations[i]);
        }
    }

    function registerAnimation(animationName, ngAnimationName) {

        jqmModule.animation('.' + ngAnimationName, ['$animationComplete', '$timeout',
            function ($animationComplete, $timeout) {

                return {
                    enter: animateIn,
                    leave: animateOut,
                    move: animateIn,
                    addClass: function (element, className, done) {
                        if (className === "in") {
                            animateIn(element, done);
                        } else {
                            animateOut(element, done);
                        }
                    },
                    removeClass: function (element, className, done) {
                        if (className === "out") {
                            animateIn(element, done);
                        } else {
                            animateOut(element, done);
                        }
                    },
                };

                function animateIn(element, done) {
                    var unbind, finished;
                    // Set the new page to display:block but don't show it yet.
                    // This code is from jquery mobile 1.3.1, function "createHandler".
                    // Prevent flickering in phonegap container: see comments at #4024 regarding iOS
                    element.addClass('ui-page-pre-in ui-page-active ' + animationName);
                    element.css('z-index', -10);

                    $timeout(function () {
                        if (!finished) {
                            animate();
                        }
                    }, 1, false);

                    function animate() {
                        element.removeClass('ui-page-pre-in');
                        element.css('z-index', '');
                        element.addClass('in');
                        unbind = $animationComplete(element, function (e) {
                            //Make sure child-element animation events don't cause page animation end to fire
                            if (!e.target || e.target === element[0]) {
                                done();
                            }
                        });
                    }

                    function cleanup(cancelled) {
                        finished = true;
                        (unbind || noop)();
                        element.removeClass('ui-page-pre-in in ' + animationName);
                        element.css('z-index', '');
                    }

                    return cleanup;
                }

                function animateOut(element, done) {
                    var unbind, finished;
                    element.addClass(animationName);

                    $timeout(function () {
                        if (!finished) {
                            animate();
                        }
                    }, 1, false);

                    function animate() {
                        element.addClass('out');
                        unbind = $animationComplete(element, function (e) {
                            //Make sure child-element animation events don't cause page animation end to fire
                            if (!e.target || e.target === element[0]) {
                                done();
                            }
                        });
                    }

                    function cleanup(cancelled) {
                        finished = true;
                        (unbind || noop)();
                        element.removeClass('ui-page-active out ' + animationName);
                    }

                    return cleanup;
                }

  }]);
    }

    jqmModule.directive({
        h1: hxDirective,
        h2: hxDirective,
        h3: hxDirective,
        h4: hxDirective,
        h5: hxDirective,
        h6: hxDirective
    });

    function hxDirective() {
        return {
            restrict: 'E',
            require: ['?^jqmHeader', '?^jqmFooter'],
            link: function (scope, element, attr, ctrls) {
                if (ctrls[0] || ctrls[1]) {
                    element.addClass("ui-title");
                }
            }
        };
    }

    /**
 * @ngdoc directive
 * @name jqm.directive:jqmButton
 * @restrict A
 *
 * @description
 * Creates a jquery mobile button on the given element.
 *
 * If created on an anchor `<a>` tag, the button will be treated as a link button.
 *
 * @param {submit|reset=} jqmButton The button type - if specified, the button will be treated as an input with the given value as its type. Otherwise, the button will just be a normal button.
 * @param {string=} icon Defines an icon for the button
 * @param {left|right|top|bottom=} iconpos Defines the Position of the icon, default is 'left'
 * @param {boolean=} mini Whether or not to use the mini layout
 * @param {boolean=} inline Whether or not to make the button inline (smaller)
 * @param {boolean=} shadow Whether or not to give the button shadows (default true)
 * @param {boolean=} corners Whether or not to give the button shadows (default true)
 *
 * @example
<example module="jqm">
  <file name="index.html">
  <div>
    <div jqm-button icon="ui-icon-search" ng-click>Do some search</div>
    <a jqm-button icon="ui-icon-home" data-mini="true" href="#/api" ng-click>Go home, mini!</a>
    <hr />
    <h3>Form With Vertical Group</h3>
    <form action="http://foobar3000.com/echo" method="GET">
      <div jqm-textinput ng-model="$root.value" ng-init="$root.value='banana'" name="stuff"></div>
      <div jqm-controlgroup>
      <div jqm-button="submit" ng-click icon="ui-icon-check" iconpos="right">Submit to foobar3030.com</div>
      <div jqm-button="reset" ng-click icon="ui-icon-minus" iconpos="right">"reset" it away!</div>
      </div>
    </form>
    <hr />
    <h3>Horizontal Group</h3>
    <div jqm-controlgroup type="horizontal">
      <div jqm-button ng-click>One</div>
      <div jqm-button ng-click>Two</div>
      <div jqm-button ng-click>Three</div>
    </div>
  </div>
  </file>
</example>
 */
    jqmModule.directive('jqmButton', ['jqmClassDirective',
        function (jqmClassDirectives, jqmOnceClassDirectives) {
            return {
                restrict: 'A',
                transclude: true,
                template: '<span class="ui-btn-inner">  <span class="ui-btn-text" ng-transclude></span>  <span ng-if="icon" class="{{shadow ? \'ui-icon-shadow\' : \'\'}} ui-icon {{icon}}">&nbsp;</span></span>',
                scope: {
                    iconpos: '@',
                    icon: '@',
                    mini: '@',
                    shadow: '@',
                    corners: '@',
                    inline: '@'
                },
                require: '^?jqmControlGroup',
                compile: function (elm, attr) {
                    attr.shadow = isDefined(attr.shadow) ? attr.shadow === 'true' : 'true';
                    attr.corners = isDefined(attr.corners) ? attr.corners === 'true' : 'true';

                    elm[0].className += ' ui-btn';
                    attr.$set('jqmClass',
                        "{'ui-first-child': $position.first," +
                        "'ui-submit': type," +
                        "'ui-last-child': $position.last," +
                        "'ui-shadow': shadow," +
                        "'ui-btn-corner-all': corners," +
                        "'ui-mini': isMini()," +
                        "'ui-btn-inline': isInline()}"
                    );

                    if (elm[0].tagName.toLowerCase() === 'input') {
                        //Inputs can't have templates inside of them so throw an error
                        throw new Error("Cannot have jqm-button <input> - use <button> instead!");
                    }

                    //Eg <div jqm-button="submit"> --> we put a <input type="submit"> inside
                    var buttonEl;
                    if (attr.jqmButton) {
                        buttonEl = jqLite('<button>');
                        buttonEl.addClass('ui-btn-hidden');
                        buttonEl.attr("type", attr.jqmButton);
                        if (attr.name) {
                            buttonEl.attr("name", attr.name);
                        }
                        if (attr.ngDisabled) {
                            buttonEl.attr('ngDisabled', attr.ngDisabled);
                        } else if (attr.disabled) {
                            buttonEl.attr('disabled', attr.disabled);
                        }
                        elm.append(buttonEl);
                    }

                    return function (scope, elm, attr, controlGroup) {
                        //These are here instead of as data-bound template attributes because we are out of
                        //directives to bind these classes with.  We already use jqmClass above for key-value
                        //type bindings, which doesn't support classNames with variables in them. And we
                        //can't use ngClass directive, because the end-user will want to use that.
                        elm.addClass('ui-btn-up-' + scope.$theme + ' ' +
                            (getIconPos() ? 'ui-btn-icon-' + getIconPos() : ''));

                        scope.isMini = isMini;
                        scope.getIconPos = getIconPos;
                        scope.isInline = isInline;
                        scope.type = attr.jqmButton;

                        forEach(jqmClassDirectives, function (directive) {
                            directive.link(scope, elm, attr);
                        });

                        function isMini() {
                            return scope.mini || (controlGroup && controlGroup.$scope.mini);
                        }

                        function getIconPos() {
                            return scope.iconpos || (controlGroup && controlGroup.$scope.iconpos) || (scope.icon ? 'left' : '');
                        }

                        function isInline() {
                            return (controlGroup && controlGroup.$scope.type === "horizontal") || scope.inline;
                        }

                    };
                }
            };
}]);

    /**
 * @ngdoc directive
 * @name jqm.directive:jqmCachingView
 * @restrict ECA
 *
 * @description
 * # Overview
 * `jqmCachingView` extends `jqmView` in the following way:
 *
 * - views are only compiled once and then stored in the `jqmViewCache`. By this, changes between views are very fast.
 * - controllers are still instantiated on every route change. Their changes to the scope get cleared
 *   when the view is left.
 *
 * Side effects:
 * - For animations between multiple routes that use the same template add the attribute `allow-same-view-animation`
 *   to the root of your view. Background: The DOM nodes and scope of the compiled template are reused for every view.
 *   With this attribute `jqmCachingView` will create two instances of the template internally.
 *   Example: Click on Moby and directly after this on Gatsby. Both routes use the same template and therefore
 *   the template has to contain `allow-same-view-animation`.
 *
 * @requires jqmViewCache
 *
 * @param {expression=} jqmCachingView angular expression evaluating to a route (optional). See `jqmView` for details.
 * @scope
 * @example
  <example module="jqmView">
    <file name="index.html">
      Choose:
      <a href="#/Book/Moby">Moby</a> |
      <a href="#/Book/Moby/ch/1">Moby: Ch1</a> |
      <a href="#/Book/Gatsby">Gatsby</a> |
      <a href="#/Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
      <a href="#/Book/Scarlet">Scarlet Letter</a><br/>

      <div jqm-caching-view style="height:300px"></div>
    </file>

    <file name="book.html">
    <div jqm-page allow-same-view-animation>
      <div jqm-header><h1>Book {{book.params.bookId}}</h1></div>
      The book contains ...
    </div>
    </file>

    <file name="chapter.html">
    <div jqm-page allow-same-view-animation>
      <div jqm-header><h1>Chapter {{chapter.params.chapterId}} of {{chapter.params.bookId}}</h1></div>
      This chapter contains ...
    </div>
    </file>

    <file name="script.js">
    angular.module('jqmView', ['jqm'], function($routeProvider) {
      $routeProvider.when('/Book/:bookId', {
      templateUrl: 'book.html',
      controller: BookCntl,
      controllerAs: 'book',
      animation: 'page-slide'
      });
      $routeProvider.when('/Book/:bookId/ch/:chapterId', {
      templateUrl: 'chapter.html',
      controller: ChapterCntl,
      controllerAs: 'chapter',
      animation: 'page-slide'
      });
    });

    function BookCntl($routeParams) {
      this.params = $routeParams;
    }

    function ChapterCntl($routeParams) {
      this.params = $routeParams;
    }
    </file>
  </example>
*/
    jqmModule.directive('jqmCachingView', ['jqmViewDirective', 'jqmViewCache', '$injector', '$q',
function (jqmViewDirectives, jqmViewCache, $injector, $q) {
            return {
                restrict: 'A',
                template: '<div class="ui-mobile-viewport" jqm-class="\'ui-overlay-\'+$theme" jqm-transclude></div>',
                replace: true,
                transclude: true,
                controller: ['$scope', '$element', JqmCachingViewCtrl],
                link: function (scope, element, attr, ctrl) {
                    forEach(jqmViewDirectives, function (directive) {
                        directive.link(scope, element, attr, ctrl);
                    });
                }
            };

            function JqmCachingViewCtrl($scope, $element) {
                var self = this;
                forEach(jqmViewDirectives, function (directive) {
                    $injector.invoke(directive.controller, self, {
                        $scope: $scope,
                        $element: $element
                    });
                });
                //let other directives require this like a jqmView
                $element.data('$jqmViewController', this);

                var loadViewNoCache = this.loadView;

                this.viewWatchAttr = 'jqmCachingView';
                this.loadView = loadViewCached;

                function loadViewCached(templateUrl, template, lastView) {
                    var cachedView = jqmViewCache.get(templateUrl);
                    if (!templateUrl && template) {
                        return loadViewNoCache('', template);
                    }
                    if (cachedView) {
                        //If we're trying to load a view that's already loaded, just create a new instance for now
                        if (cachedView === lastView) {
                            return loadViewNoCache(templateUrl, template);
                        }
                        return $q.when(cachedView);
                    } else {
                        return self.fetchView(templateUrl).then(function (view) {
                            view.clear = cachingViewClear;
                            view.scope.$destroy = scopeClearAndDisconnect;
                            view.element.remove = detachNodes;
                            return jqmViewCache.put(templateUrl, view);
                        });
                    }
                }
            }

            function cachingViewClear() {
                /*jshint -W040:true*/
                this.element.remove(); //detachNodes()
                this.scope.$destroy(); //disconnectAndClear()
                if (this.element.hasClass('ng-animate')) {
                    this.element.triggerHandler('animationend');
                }
                this.element.removeClass('ui-page-active');
            }

            // Note: element.remove() would
            // destroy all data associated to those nodes,
            // e.g. widgets, ...
            function detachNodes() {
                /*jshint -W040:true*/
                var i, node, parent;
                for (i = 0; i < this.length; i++) {
                    node = this[i];
                    parent = node.parentNode;
                    if (parent) {
                        parent.removeChild(node);
                    }
                }
            }

            function scopeClearAndDisconnect() {
                /*jshint -W040:true*/
                var prop;
                // clear all watchers, listeners and all non angular properties,
                // so we have a fresh scope!
                this.$$watchers = [];
                this.$$listeners = [];
                for (prop in this) {
                    if (this.hasOwnProperty(prop) && prop.charAt(0) !== '$') {
                        delete this[prop];
                    }
                }
                this.$disconnect();
            }
}]);

    /**
 * @ngdoc directive
 * @name jqm.directive:jqmCheckbox
 * @restrict A
 *
 * @description
 * Creates a jquery mobile checkbox on the given element.
 *
 * Anything inside the `jqm-checkbox` tag will be a label.
 *
 * @param {string=} ngModel Assignable angular expression to data-bind to.
 * @param {string=} disabled Whether this checkbox is disabled.
 * @param {string=} mini Whether this checkbox is mini.
 * @param {string=} iconpos The position of the icon for this element. "left" or "right".
 * @param {string=} ngTrueValue The value to which the expression should be set when selected.
 * @param {string=} ngFalseValue The value to which the expression should be set when not selected.
 *
 * @example
<example module="jqm">
  <file name="index.html">
  <div jqm-checkbox ng-model="checky">
    My value is: {{checky}}
  </div>
  <div jqm-checkbox mini="true" iconpos="right" ng-model="isDisabled">
    I've got some options. Toggle me to disable the guy below.
  </div>
  <div jqm-checkbox disabled="{{isDisabled ? 'disabled' : ''}}"
    ng-model="disably" ng-true-value="YES" ng-false-value="NO">
    I can be disabled! My value is: {{disably}}
  </div>
  </file>
</example>
 */
    jqmModule.directive('jqmCheckbox', [

        function () {
            return {
                restrict: 'A',
                transclude: true,
                replace: true,
                template: '<div class="ui-checkbox" jqm-class="{\'ui-disabled\': disabled}">  <label jqm-class="{\'ui-checkbox-on\': checked, \'ui-checkbox-off\': !checked,       \'ui-first-child\': $position.first, \'ui-last-child\': $position.last,       \'ui-mini\':isMini(), \'ui-fullsize\':!isMini(),       \'ui-btn-active\':isActive(),       \'ui-btn-icon-left\': getIconPos()!=\'right\', \'ui-btn-icon-right\': getIconPos()==\'right\'}"       ng-click="toggleChecked()"       jqm-once-class="ui-btn-up-{{$theme}}"       class="ui-btn ui-btn-corner-all">    <span class="ui-btn-inner">      <span class="ui-btn-text" ng-transclude></span>      <span jqm-class="{\'ui-icon-checkbox-on\': checked, \'ui-icon-checkbox-off\': !checked}"          class="ui-icon ui-icon-shadow"></span>    </span>  </label>  <input type="checkbox" ng-model="checked"></div>',
                scope: {
                    disabled: '@',
                    mini: '@',
                    iconpos: '@'
                },
                require: ['?ngModel', '^?jqmControlgroup'],
                link: function (scope, element, attr, ctrls) {
                    var ngModelCtrl = ctrls[0],
                        jqmControlGroupCtrl = ctrls[1];
                    scope.toggleChecked = toggleChecked;
                    scope.isMini = isMini;
                    scope.getIconPos = getIconPos;
                    scope.isActive = isActive;

                    if (ngModelCtrl) {
                        enableNgModelCollaboration();
                    }

                    function isMini() {
                        return scope.mini || (jqmControlGroupCtrl && jqmControlGroupCtrl.$scope.mini);
                    }

                    function getIconPos() {
                        return scope.iconpos || (jqmControlGroupCtrl && jqmControlGroupCtrl.$scope.iconpos);
                    }

                    function isActive() {
                        return (jqmControlGroupCtrl && jqmControlGroupCtrl.$scope.type === "horizontal") && scope.checked;
                    }

                    function toggleChecked() {
                        if (scope.disabled) {
                            return;
                        }
                        scope.checked = !scope.checked;
                        if (ngModelCtrl) {
                            ngModelCtrl.$setViewValue(scope.checked);
                        }
                    }

                    function enableNgModelCollaboration() {
                        // For the following code, see checkboxInputType in angular's sources
                        var trueValue = attr.ngTrueValue,
                            falseValue = attr.ngFalseValue;

                        if (!isString(trueValue)) {
                            trueValue = true;
                        }
                        if (!isString(falseValue)) {
                            falseValue = false;
                        }

                        ngModelCtrl.$render = function () {
                            scope.checked = ngModelCtrl.$viewValue;
                        };

                        ngModelCtrl.$formatters.push(function (value) {
                            return value === trueValue;
                        });

                        ngModelCtrl.$parsers.push(function (value) {
                            return value ? trueValue : falseValue;
                        });
                    }

                }
            };
}]);

    jqmModule.directive('jqmClass', [

        function () {
            return {
                link: function (scope, element, attr) {
                    var oldVal;

                    scope.$watch(attr.jqmClass, jqmClassWatchAction, true);

                    attr.$observe('class', function (value) {
                        var jqmClass = scope.$eval(attr.jqmClass);
                        jqmClassWatchAction(jqmClass);
                    });

                    function jqmClassWatchAction(newVal) {
                        if (!equals(newVal, oldVal)) {
                            element.removeClass(getClassString(oldVal));
                            element.addClass(getClassString(newVal));
                            oldVal = newVal;
                        }
                    }

                    function getClassString(classVal) {
                        if (isObject(classVal) && !isArray(classVal)) {
                            var classes = [];
                            forEach(classVal, function (v, k) {
                                if (v) {
                                    classes.push(k);
                                }
                            });
                            classVal = classes;
                        }
                        return isArray(classVal) ? classVal.join(' ') : classVal;
                    }
                }
            };
}]);

    jqmModule.directive('jqmControlgroup', function () {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            template: '<fieldset class="ui-controlgroup"   jqm-class="{\'ui-mini\': mini,      \'ui-shadow\': shadow,     \'ui-corner-all\': corners!=\'false\',     \'ui-controlgroup-vertical\': type!=\'horizontal\',      \'ui-controlgroup-horizontal\': type==\'horizontal\'}">  <div ng-if="legend" class="ui-controlgroup-label">    <legend>{{legend}}</legend>  </div>  <div class="ui-controlgroup-controls" ng-transclude jqm-position-anchor></div></fieldset>',
            scope: {
                mini: '@',
                iconpos: '@',
                type: '@',
                shadow: '@',
                corners: '@',
                legend: '@'
            },
            controller: ['$scope', JqmControlGroupCtrl]
        };

        function JqmControlGroupCtrl($scope) {
            this.$scope = $scope;
        }
    });

    /**
 * @ngdoc directive
 * @name jqm.directive:jqmFieldcontain
 * @restrict A
 *
 * @description
 * Used to wrap a label/form element pair.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
  <div jqm-fieldcontain>
    <label for="name">Your Name:</label>
    <div jqm-textinput ng-model="name" />
  </div>
 </file>
 </example>
 */
    jqmModule.directive('jqmFieldcontain', function () {
        return {
            restrict: 'A',
            compile: function (elm, attr) {
                elm[0].className += ' ui-field-contain ui-body ui-br';
            }
        };
    });

    /**
 * @ngdoc directive
 * @name jqm.directive:jqmFlip
 * @restrict A
 *
 * @description
 * Creates a jquery mobile flip switch on the given element.
 *
 * Anything inside the `jqm-flip` tag will be a label.
 *
 * Labels for the on and off state can be omitted.
 * If no values for the on and off state are specified on will be bound to true and off to false.
 *
 * A theme can be set with the jqm-theme directive and specific styles can be set with the ng-style parameter.
 * This is necessary to extend the width of the flip for long labels.
 *
 * @param {expression=} ngModel Assignable angular expression to data-bind to.
 * @param {string=} disabled Whether this flip switch is disabled.
 * @param {string=} mini Whether this flip should be displayed minified.
 * @param {string=} ngOnLabel The label which should be shown when fliped on (optional).
 * @param {string=} ngOnValue The value to which the expression should be set when fliped on (optional, default: true).
 * @param {string=} ngOffLabel The label which should be shown when fliped off (optional).
 * @param {string=} ngOffValue The value to which the expression should be set when fliped off (optional, default:false).
 *
 * @example
<example module="jqm">
  <file name="index.html">
   <p>Selected value is: {{flip}}</p>
   <div jqm-flip ng-model="flip">
   Default values true/false
   </div>
   <div jqm-flip ng-model="flip" jqm-theme="e">
   With theme
   </div>
   <div jqm-flip ng-model="flip2" on-label="On" on-value="On" off-label="Off" off-value="Off">
   My value is {{flip2}}
   </div>
  </file>
</example>
 */
    jqmModule.directive('jqmFlip', [

        function () {
            return {
                restrict: 'A',
                transclude: true,
                replace: true,
                template: '<div jqm-scope-as="jqmFlip">    <label class="ui-slider" ng-transclude></label>    <div class="ui-slider ui-slider-switch ui-btn-down-{{$theme}} ui-btn-corner-all"       jqm-class="{\'ui-disabled\': disabled,            \'ui-mini\': isMini()}"       ng-click="toggle()">       <span class="ui-slider-label ui-slider-label-a ui-btn-active ui-btn-corner-all" ng-style="{width: onStyle + \'%\'}">{{onLabel}}</span>       <span class="ui-slider-label ui-slider-label-b ui-btn-down-{{theme}} ui-btn-corner-all" ng-style="{width: offStyle + \'%\'}">{{offLabel}}</span>        <div class="ui-slider-inneroffset">          <a class="ui-slider-handle ui-slider-handle-snapping ui-btn ui-btn-corner-all ui-btn-up-{{theme}} ui-shadow"           title="{{toggleLabel}}"           ng-style="{left: onStyle + \'%\'}">          <span class="ui-btn-inner"><span class="ui-btn-text"></span></span>          </a>        </div>    </div></div>',
                scope: {
                    onLabel: '@',
                    onValue: '@',
                    offLabel: '@',
                    offValue: '@',
                    mini: '@',
                    disabled: '@'
                },
                require: ['?ngModel', '^?jqmControlgroup'],
                link: function (scope, element, attr, ctrls) {
                    var ngModelCtrl = ctrls[0];
                    var jqmControlGroupCtrl = ctrls[1];
                    var parsedOn;
                    var parsedOff;

                    scope.theme = scope.$theme || 'c';
                    scope.isMini = isMini;
                    scope.onValue = isDefined(attr.onValue) ? scope.onValue : true;
                    scope.offValue = isDefined(attr.offValue) ? scope.offValue : false;

                    initToggleState();
                    bindClick();

                    function initToggleState() {
                        ngModelCtrl.$parsers.push(parseBoolean);
                        parsedOn = parseBoolean(scope.onValue);
                        parsedOff = parseBoolean(scope.offValue);
                        ngModelCtrl.$render = updateToggleStyle;
                        ngModelCtrl.$viewChangeListeners.push(updateToggleStyle);
                    }

                    function updateToggleStyle() {
                        updateNaNAsOffValue();
                        var toggled = isToggled();
                        scope.toggleLabel = toggled ? scope.onLabel : scope.offLabel;
                        scope.onStyle = toggled ? 100 : 0;
                        scope.offStyle = toggled ? 0 : 100;
                    }

                    // this has to be done in the change listener,
                    // otherwise the potential scope value would be overwritten with the off value
                    function updateNaNAsOffValue() {
                        if (!ngModelCtrl.$viewValue) {
                            ngModelCtrl.$setViewValue(parsedOff);
                        }
                    }

                    function bindClick() {
                        scope.toggle = function () {
                            ngModelCtrl.$setViewValue(isToggled() ? parsedOff : parsedOn);
                        };
                    }

                    function isToggled() {
                        return ngModelCtrl.$viewValue === parsedOn;
                    }

                    function isMini() {
                        return scope.mini || (jqmControlGroupCtrl && jqmControlGroupCtrl.$scope.mini);
                    }

                    function parseBoolean(value) {
                        if (value === 'true') {
                            return true;
                        } else if (value === 'false') {
                            return false;
                        }
                        return value;
                    }
                }
            };
}]);

    /**
 * @ngdoc directive
 * @name jqm.directive:jqmHeader
 * @restrict A
 *
 * @description
 * Defines the header of a `jqm-page`. For a persistent header, put the header directly below `jqmView` / `jqmCachingView`.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div jqm-page class="jqm-standalone-page" style="height: 100px;">
   <div jqm-header>
   <h1>Header of Page1</h1>
   </div>
   Hello world!
 </div>
 </file>
 </example>
 */
    /**
 * @ngdoc directive
 * @name jqm.directive:jqmFooter
 * @restrict A
 *
 * @description
 * Defines the footer of a `jqm-page`. For a persistent footer, put the footer directly below `jqmView` / `jqmCachingView`.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div jqm-page class="jqm-standalone-page" style="height: 100px;">
   Hello world!
   <div jqm-footer>
   <h1>Footer of Page1</h1>
   </div>
 </div>
 </file>
 </example>
 */
    jqmModule.directive({
        jqmHeader: jqmHeaderFooterDirective('$header', 'ui-header'),
        jqmFooter: jqmHeaderFooterDirective('$footer', 'ui-footer')
    });

    function jqmHeaderFooterDirective(scopeName, className) {
        return ['jqmConfig', function (jqmConfig) {
            return {
                restrict: 'A',
                // Own scope as we have a different default theme
                // than the page.
                scope: true,
                require: ['^?jqmPage', '^?jqmView'],
                controller: noop,
                link: function (scope, element, attr, ctrls) {
                    var hasExplicitTheme = scope.hasOwnProperty('$theme');
                    var parentCtrl = ctrls[0] || ctrls[1];

                    if (!hasExplicitTheme) {
                        scope.$theme = jqmConfig.secondaryTheme;
                    }
                    element.addClass(className + ' ui-bar-' + scope.$theme);

                    //Store header/footer existance on parent - this is so
                    //headers can be added or removed with ng-if and
                    //the jqm-content-with-* classes will adjust accordingly.
                    //See jqmPage.js and jqmPage.html
                    if (parentCtrl) {
                        //Move headers outside of ui-content in jqmPages
                        parentCtrl.$element.prepend(element);
                        parentCtrl.$scope[scopeName] = true;

                        element.bind('$destroy', function () {
                            parentCtrl.$scope[scopeName] = false;
                        });
                    }
                }
            };
        }];
    }


    jqmModule.directive('jqmInputText', ['$compile', '$timeout',
        function ($compile, $timeout) {
            var clearButtonTemplate = '<a jqm-button ng-show="showClearButton()" class="ui-input-clear ui-fullsize" iconpos="notext" icon="ui-icon-delete" ng-click="clearButtonAction()">clear text</a>';
            return {
                restrict: 'A',
                require: ['?ngModel', '^?jqmInputWrapper'],
                scope: {
                    type: '@',
                    mini: '@',
                    clearBtn: '&',
                },
                link: function (scope, element, attr, ctrls) {
                    var tagName = element[0].tagName.toLowerCase();
                    if (tagName != 'input') {
                        throw new Error('jqmInputText must be an <input>. Instead, is ' +
                            ' <' + tagName + '>!');
                    }

                    var ngModelCtrl = ctrls[0];
                    var wrapperCtrl = ctrls[1];
                    var hasClearButton = isDefined(attr.clearBtn);

                    if (hasClearButton) {
                        element.after($compile(clearButtonTemplate)(scope));
                    }
                    if (wrapperCtrl) {
                        wrapperCtrl.$scope.input = scope;
                    }
                    setClasses();

                    element.on('focus', function () {
                        $timeout(onFocus);
                    });
                    element.on('blur', function () {
                        $timeout(onBlur);
                    });

                    attr.$observe('disabled', disabledWatchAction);
                    attr.$observe('class', setClasses);

                    scope.showClearButton = showClearButton;
                    scope.clearButtonAction = clearButtonAction;

                    function onFocus() {
                        scope.isFocused = true;
                        setClasses();
                    }

                    function onBlur() {
                        scope.isFocused = false;
                        setClasses();
                    }

                    function disabledWatchAction(newValue) {
                        scope.disabled = !! newValue;
                        setClasses();
                    }

                    function setClasses() {
                        element.toggleClass('ui-input-text ui-body-' + scope.$theme, !! (scope.type != 'checkbox' && scope.type != 'radio'));
                        //If we're under a wrapper, we apply focus classes to that. else, we apply them here
                        if (!wrapperCtrl) {
                            element.toggleClass('mobile-textinput-disabled ui-state-disabled', !! scope.disabled);
                            element.toggleClass('ui-focus', !! scope.isFocused);
                            element.addClass('ui-corner-all ui-shadow-inset');
                        }
                    }

                    function isSearch() {
                        return scope.type === 'search';
                    }

                    function isText() {
                        return scope.type !== 'search' && scope.type !== 'checkbox' && scope.type !== 'radio';
                    }

                    function showClearButton() {
                        return hasClearButton && element.val();
                    }

                    function clearButtonAction() {
                        if (ngModelCtrl) {
                            ngModelCtrl.$setViewValue('');
                        }
                        element.val('');
                        (scope.clearBtn || noop)();
                        //focus input again after user clicks the btn
                        element[0].focus();
                    }

                }
            };
}]);

    /**
     * @ngdoc jqmInputWrapper
     */
    jqmModule.directive('jqmInputWrapper', ['jqmClassDirective', 'jqmPositionAnchorDirective',
                    function (jqmClassDirectives, jqmPositionAnchorDirectives) {
            //We can't use template with replace & transclude because we want the inner
            //elements to stay the same order as placed beforehand
            return {
                restrict: 'A',
                controller: ['$scope', JqmInputWrapperCtrl],
                scope: {},
                replace: true,
                transclude: true,
                template: '<div jqm-class="{\'ui-disabled\': input.disabled,  \'ui-mini\': input.mini,  \'ui-input-search ui-btn-corner-all ui-icon-searchfield\': isSearch(),  \'ui-input-text ui-corner-all\': isText(),  \'ui-checkbox\': isCheckbox(),  \'ui-focus\': input.isFocused}"  jqm-once-class="ui-body-{{input.$theme || $theme}}"  class="ui-shadow-inset ui-btn-shadow" jqm-transclude></div>'
            };

            function JqmInputWrapperCtrl($scope) {
                this.$scope = $scope;

                $scope.isSearch = isSearch;
                $scope.isText = isText;
                $scope.isCheckbox = isCheckbox;
                $scope.isRadio = isRadio;

                function isSearch() {
                    return $scope.input && $scope.input.type === 'search';
                }

                function isText() {
                    return !isCheckbox() && !isRadio() && !isSearch();
                }

                function isCheckbox() {
                    return $scope.input && $scope.input.type === 'checkbox';
                }

                function isRadio() {
                    return $scope.input && $scope.input.type === 'radio';
                }
            }
}]);


    jqmModule.directive('jqmLiCount', [

        function () {
            return {
                restrict: 'A',
                require: '^jqmLiLink',
                compile: function (elm, attr) {
                    attr.$set('class', (attr.class || '') + ' ui-li-count ui-btn-corner-all');
                    return function (scope, elm, attr, jqmLiLinkCtrl) {
                        jqmLiLinkCtrl.$scope.hasCount = true;
                    };
                }
            };
}]);


    /**
     * @ngdoc directive
     * @name jqm.directive:jqmLiEntry
     * @restrict A
     *
     * @description
     * Creates a jQuery mobile entry list item. This is just a plain entry, instead of a
     * {@link jqm.directive:jqmLiLink jqmLiLink}.
     *
     * Must be inside of a {@link jqm.direcitve:jqmListview jqmListview}.
     */

    /**
     * @ngdoc directive
     * @name jqm.directive:jqmLiDivider
     * @restrict A
     *
     * @description
     * Creates a jQuery mobile list divider.
     *
     * Must be inside of a {@link jqm.direcitve:jqmListview jqmListview}
     */
    jqmModule.directive({
        jqmLiEntry: jqmLiEntryDirective(false),
        jqmLiDivider: jqmLiEntryDirective(true)
    });

    function jqmLiEntryDirective(isDivider) {
        return function () {
            return {
                restrict: 'A',
                replace: true,
                transclude: true,
                scope: {},
                template: isDivider ?
                    '<li jqm-scope-as="jqmLi"  class="ui-li ui-li-divider ui-bar-{{$theme}}"  jqm-class="{\'ui-first-child\': $position.first, \'ui-last-child\': $position.last}"  ng-transclude></li>' : '<li jqm-scope-as="jqmLi"  class="ui-li ui-li-static ui-btn-up-{{$theme}}"  jqm-class="{\'ui-first-child\': $position.first, \'ui-last-child\': $position.last}"  ng-transclude></li>'
            };
        };
    }

    /**
     * @ngdoc directive
     * @name jqm.directive:jqmLiLink
     * @restrict A
     *
     * @description
     * Creates a jquery mobile list item link entry.
     *
     * Must be inside of a {@link jqm.directive:jqmListview jqmListview}
     *
     * - Add a `<img jqm-li-thumb>` inside for a thumbnail.
     * - Add a `<span jqm-li-count>` inside for a count.
     *
     * @param {string=} jqmLiLInk The link, or href, that this listitem should go to when clicked.
     * @param {string=} icon What icon to use for the link.  Default 'ui-icon-arrow-r'.
     * @param {string=} iconpos Where to put the icon. Default 'right'.
     * @param {string=} iconShadow Whether the icon should have a shadow or not. Default true.
     *
     */
    jqmModule.directive('jqmLiLink', [

        function () {
            return {
                restrict: 'A',
                transclude: true,
                replace: true,
                template: '<li class="ui-li ui-btn" jqm-scope-as="jqmLiLink"jqm-once-class="{{icon ? \'ui-li-has-arrow ui-btn-icon-\'+iconpos : \'\'}} ui-btn-up-{{$theme}}"  jqm-class="{\'ui-first-child\': $position.first,   \'ui-last-child\': $position.last,   \'ui-li-has-thumb\': hasThumb,   \'ui-li-has-count\': hasCount}">  <div class="ui-btn-inner ui-li">    <div class="ui-btn-text">      <a ng-href="{{link}}" class="ui-link-inherit" ng-transclude>      </a>    </div>  <span ng-show="icon"     class="ui-icon {{icon}}"     jqm-class="{\'ui-icon-shadow\': iconShadow}">    &nbsp;  </span>  </div></li>',
                controller: ['$scope', JqmLiController],
                scope: {
                    icon: '@',
                    iconpos: '@',
                    iconShadow: '@',
                    link: '@jqmLiLink',
                    //hasThumb and hasCount set by jqmLiCount and jqmLiThumb
                },
                compile: function (element, attr) {
                    attr.icon = isDefined(attr.icon) ? attr.icon : 'ui-icon-arrow-r';
                    attr.iconpos = isDefined(attr.iconpos) ? attr.iconpos : 'right';
                    attr.iconShadow = isDefined(attr.iconShadow) ? attr.iconShadow : true;
                }
            };

            function JqmLiController($scope) {
                this.$scope = $scope;
            }
}]);


    jqmModule.directive('jqmLiThumb', [

        function () {
            return {
                restrict: 'A',
                require: '^jqmLiLink',
                compile: function (elm, attr) {
                    attr.$set('class', (attr.class || '') + ' ui-li-thumb');
                    return function (scope, elm, attr, jqmLiLinkCtrl) {
                        jqmLiLinkCtrl.$scope.hasThumb = true;
                    };
                }
            };
}]);

    /**
 * @ngdoc directive
 * @name jqm.directive:jqmListview
 * @restrict A
 *
 * @description
 * Creates a jQuery mobile listview.  Add jqmLiDivider, jqmLiEntry, and/or jqmLiLinks inside.
 *
 * @param {string=} inset Whether this listview should be inset or not. Default false.
 * @param {string=} shadow Whether this listview should have a shadow or not (only applies if inset). Default false.
 * @param {string=} corners Whether this listview should have corners or not (only applies if inset). Default false.
 *
 * @example
<example module="jqm">
  <file name="index.html">
  <div ng-init="list=[1,2,3,4,5,6]"></div>
  <h3>Entries</h3>
  <ul jqm-listview>
    <li jqm-li-entry>Hello, entry!</li>
    <li jqm-li-entry>Another entry!</li>
    <li jqm-li-entry>More!! entry!</li>
    <li jqm-li-divider jqm-theme="b">Divider</li>
    <li jqm-li-entry>Hello, entry!</li>
    <li jqm-li-entry>Another entry!</li>
    <li jqm-li-entry>More!! entry!</li>
  </ul>
  <h3>Links</h3>
  <ul jqm-listview>
    <li ng-repeat="i in list" jqm-li-link="#/{{i}}">{{i}}</li>
    <li jqm-li-divider jqm-theme="b">Here's a thumbnail with a count</li>
    <li jqm-li-link icon="ui-icon-home">
    <img jqm-li-thumb src="http://placekitten.com/80/80">
    <h2 class="ui-li-heading">Kitten!</h2>
    <p class="ui-li-desc">Subtext here. Yeah.</p>
    <span jqm-li-count>44</span>
    </li>
  </ul>
  </file>
</example>
 */
    jqmModule.directive('jqmListview', [

        function () {
            return {
                restrict: 'A',
                replace: true,
                transclude: true,
                template: '<ul class="ui-listview"  jqm-class="{\'ui-listview-inset\': inset,  \'ui-corner-all\': useDefaultCorners ? inset==\'true\' : corners==\'true\',  \'ui-shadow\': useDefaultShadow ? inset : shadow==\'true\'}"  ng-transclude jqm-position-anchor></ul>',
                scope: {
                    inset: '@',
                    corners: '@',
                    shadow: '@'
                },
                link: function (scope, elm, attr) {
                    scope.useDefaultShadow = !isDefined(attr.shadow);
                    scope.useDefaultCorners = !isDefined(attr.corners);
                }
            };
}]);

    /**
 * @ngdoc directive
 * @name jqm.directive:jqmLoadDialog
 * @restrict A
 *
 * @description
 * Creates a jquery mobile load dialog within the given element, which is shown based on the expression provided to the jqmLoadDialog attribute.
 *
 * Put text inside the jqmLoadDialog to have that text display inside the dialog.
 *
 * Works with animations, the same way as ngShow does.
 *
 * For a global load dialog, place it as a child of the body.
 *
 * If you would like to have loading spinners which track different http requests or promises, we recommend [angular-promise-tracker](http://github.com/ajoslin/angular-promise-tracker).
 *
 * @param {expression} jqmLoadDialog If the expression is truthy then the element is shown or hidden respectively.
 * @param {string} icon The icon to display in the loading dialog. Default: 'ui-icon-loading'.
 *
 * @example
 * <example module="jqm">
    <file name="index.html">
      <div jqm-load-dialog="showBasic"></div>
      <div jqm-button ng-click="showBasic = !showBasic">Toggle Basic Load Dialog</div>

      <div jqm-load-dialog="showAdvanced" icon="ui-icon-home" class="slidedown">
        Fancy, eh?
      </div>
      <div jqm-button ng-click="showAdvanced = !showAdvanced">Toggle Animated Load Dialog</div>
    </file>
  </example>
 */
    jqmModule.directive('jqmLoadDialog', ['$animate', '$rootElement',
        function ($animate, $rootElement) {
            return {
                restrict: 'A',
                transclude: true,
                replace: true,
                template: '<div jqm-class="\'ui-loader ui-corner-all ui-body-\' + $theme + \' \' +    (hasContent ? \'ui-loader-verbose\' : \'ui-loader-default\')">  <span class="ui-icon {{icon}}"></span>  <h1></h1></div>',
                scope: {
                    icon: '@'
                },
                compile: function (element, attr, transclude) {
                    attr.icon = isDefined(attr.icon) ? attr.icon : 'ui-icon-loading';
                    return function postLink(scope, element, attr) {
                        var h1 = element.children().eq(1);
                        scope.$parent.$watch(attr.jqmLoadDialog, function (shown) {
                            if (shown) {
                                $rootElement.addClass('ui-loading');
                                $animate.removeClass(element, 'ng-hide');
                            } else {
                                $animate.addClass(element, 'ng-hide', function () {
                                    $rootElement.removeClass('ui-loading');
                                });
                            }
                        });

                        //If we transclude some content that actually exists, hasContent = true
                        transclude(scope, function (clone) {
                            if (clone.length) {
                                h1.append(clone);
                                scope.hasContent = true;
                            }
                        });
                    };
                }
            };
}]);

    /*
     * This is intentionally not documented; internal use only
     */
    jqmModule.directive('jqmOnceClass', ['$interpolate',
        function ($interpolate) {
            return {
                compile: function (cElm, cAttr) {
                    //catch the attr with $interpolate before $compile catches it and changes it
                    var interpolated = $interpolate(cAttr.jqmOnceClass);
                    return function (scope, elm, attr) {
                        elm.addClass(interpolated(scope));
                    };
                }
            };
}]);

    /**
 * @ngdoc directive
 * @name jqm.directive:jqmPage
 * @restrict A
 *
 * @description
 * Creates a jquery mobile page. Also adds automatic overflow scrolling for it's content.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div jqm-page style="height: 100px;">
 <p>Hello world!</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 </div>
 </file>
 </example>
 */
    jqmModule.directive('jqmPage', ['$rootScope', '$controller', '$scroller',
        function ($rootScope, $controller, $scroller) {
            return {
                restrict: 'A',
                template: '<div class="ui-page" jqm-class="\'ui-body-\'+$theme">  <div class="ui-content"    jqm-class="{\'jqm-content-with-header\': $header, \'jqm-content-with-footer\': $footer}"    jqm-transclude>  </div></div>',
                replace: true,
                transclude: true,
                require: '^?jqmView',
                controller: ['$scope', '$element', JqmPageController],
                link: function (scope, element, attr, jqmViewCtrl) {
                    if (!jqmViewCtrl) {
                        element.addClass('ui-page-active jqm-standalone-page');
                    }
                }
            };

            function JqmPageController($scope, $element) {
                this.$scope = $scope;
                this.$element = $element;

                var content = jqLite($element[0].querySelector('.ui-content'));
                var scroller = $scroller(content);

                this.scroll = function (newPos, easeTime) {
                    if (arguments.length) {
                        if (arguments.length === 2) {
                            scroller.transformer.easeTo({
                                x: 0,
                                y: newPos
                            }, easeTime);
                        } else {
                            scroller.transformer.setTo({
                                x: 0,
                                y: newPos
                            });
                        }
                    }
                    return scroller.transformer.pos;
                };
                this.scrollHeight = function () {
                    scroller.calculateHeight();
                    return scroller.scrollHeight;
                };
                this.outOfBounds = function (pos) {
                    return scroller.outOfBounds(pos);
                };
            }
}]);

    /**
     * @ngdoc directive
     * @name jqm.directive:jqmPanel
     * @restrict A
     *
     * @description
     * Creates a jquery mobile panel.  Must be placed inside of a jqm-panel-container.
     *
     * @param {expression=} opened Assignable angular expression to data-bind the panel's open state to.
     * @param {string=} display Default 'reveal'.  What display type the panel has. Available: 'reveal', 'overlay', 'push'.
     * @param {string=} position Default 'left'. What position the panel is in. Available: 'left', 'right'.
     *
     * @require jqmPanelContainer.
     */
    jqmModule.directive('jqmPanel', function () {
        return {
            restrict: 'A',
            require: '^jqmPanelContainer',
            replace: true,
            transclude: true,
            template: '<div class="ui-panel ui-panel-closed"  ng-class="\'ui-panel-position-\'+position+\' ui-panel-display-\'+display+\' ui-body-\'+$theme+\' ui-panel-animate\'">  <div class="ui-panel-inner" ng-transclude></div></div>',
            // marker controller.
            controller: noop,
            scope: {
                display: '@',
                position: '@'
            },
            compile: function (element, attr) {
                attr.display = isDefined(attr.display) ? attr.display : 'reveal';
                attr.position = isDefined(attr.position) ? attr.position : 'left';

                return function (scope, element, attr, jqmPanelContainerCtrl) {
                    if (scope.position !== 'left' && scope.position !== 'right') {
                        throw new Error("jqm-panel position is invalid. Expected 'left' or 'right', got '" + scope.position + "'");
                    }
                    jqmPanelContainerCtrl.addPanel({
                        scope: scope,
                        element: element
                    });
                };
            }
        };
    });

    /**
 * @ngdoc directive
 * @name jqm.directive:jqmPanelContainer
 * @restrict A
 *
 * @description
 * A container for jquery mobile panels.
 *
 * If you wish to use this with a view, you want the jqm-panel-container as the
 * parent of your view and your panels. For example:
 * <pre>
 * <div jqm-panel-container="myPanel">
 *   <div jqm-panel>My Panel!</div>
 *   <div jqm-view></div>
 * </div>
 * </pre>
 *
 * @param {expression=} jqmPanelContainer Assignable angular expression to data-bind the panel's open state to.
 *            This is either `left` (show left panel), `right` (show right panel) or null.
 *
 * @example
<example module="jqm">
  <file name="index.html">
   <div ng-init="state={}"></div>
   <div jqm-panel-container="state.openPanel" style="height:300px;overflow:hidden">
    <div jqm-panel position="left">
      Hello, left panel!
    </div>
    <div jqm-panel position="right" display="overlay">
     Hello, right panel!
    </div>
    <div style="background: white">
       Opened panel: {{state.openPanel}}
       <button ng-click="state.openPanel='left'">Open left</button>
       <button ng-click="state.openPanel='right'">Open right</button>
    </div>
   </div>
  </file>
</example>
 */

    jqmModule.directive('jqmPanelContainer', ['$timeout', '$transitionComplete', '$sniffer',
        function ($timeout, $transitionComplete, $sniffer) {
            return {
                restrict: 'A',
                transclude: true,
                replace: true,
                template: '<div jqm-transclude class="jqm-panel-container">  <div class="ui-panel-dismiss"    ng-click="openPanelName = null"     ng-class="openPanelName ? \'ui-panel-dismiss-open ui-panel-dismiss-\'+openPanelName : \'\'">  </div></div>',
                scope: {
                    openPanelName: '=jqmPanelContainer'
                },
                controller: ['$scope', '$element', JqmPanelContainerCtrl]
            };

            function JqmPanelContainerCtrl($scope, $element) {
                var panels = {},
                    panelContent;

                this.addPanel = function (panel) {
                    panels[panel.scope.position] = panel;
                };
                this.getPanel = function (position) {
                    return panels[position];
                };

                $scope.$watch('openPanelName', openPanelChanged);
                if (!$sniffer.animations) {
                    $scope.$watch('openPanelName', transitionComplete);
                } else {
                    $transitionComplete($element, transitionComplete);
                }

                function openPanelChanged() {
                    updatePanelContent();
                    forEach(panels, function (panel) {
                        var opened = panel.scope.position === $scope.openPanelName;
                        if (opened) {
                            panel.element.removeClass('ui-panel-closed');
                            $timeout(function () {
                                $element.addClass('jqm-panel-container-open');
                                panel.element.addClass('ui-panel-open');
                            }, 1, false);
                        } else {
                            panel.element.removeClass('ui-panel-open ui-panel-opened');
                            $element.removeClass('jqm-panel-container-open');
                        }
                    });

                }

                //Doing transition stuff in jqmPanelContainer, as
                //we need to listen for transition complete event on either the panel
                //element or the panel content wrapper element. Some panel display
                //types (overlay) only animate the panel, and some (reveal) only
                //animate the content wrapper.
                function transitionComplete() {
                    forEach(panels, function (panel) {
                        var opened = panel.scope.position === $scope.openPanelName;
                        if (opened) {
                            panel.element.addClass('ui-panel-opened');
                        } else {
                            panel.element.addClass('ui-panel-closed');
                        }
                    });
                }

                function updatePanelContent() {
                    var content = findPanelContent();
                    var openPanel = panels[$scope.openPanelName],
                        openPanelScope = openPanel && openPanel.scope;

                    content.addClass('ui-panel-content-wrap ui-panel-animate');

                    content.toggleClass('ui-panel-content-wrap-open', !! openPanelScope);

                    content.toggleClass('ui-panel-content-wrap-position-left', !! (openPanelScope && openPanelScope.position === 'left'));

                    content.toggleClass('ui-panel-content-wrap-position-right', !! (openPanelScope && openPanelScope.position === 'right'));
                    content.toggleClass('ui-panel-content-wrap-display-reveal', !! (openPanelScope && openPanelScope.display === 'reveal'));
                    content.toggleClass('ui-panel-content-wrap-display-push', !! (openPanelScope && openPanelScope.display === 'push'));
                    content.toggleClass('ui-panel-content-wrap-display-overlay', !! (openPanelScope && openPanelScope.display === 'overlay'));
                }

                function findPanelContent() {
                    if (!panelContent) {
                        panelContent = jqLite();
                        forEach($element.children(), function (node) {
                            var el = jqLite(node);
                            // ignore panels and the generated ui-panel-dismiss div.
                            if (!el.data('$jqmPanelController') && !el.hasClass('ui-panel-dismiss')) {
                                panelContent.push(node);
                            }
                        });
                    }
                    return panelContent;
                }

                /*
    $scope.$evalAsync(function() {
      setupPull();
    });
    function setupPull() {
      var panelWidth = 17 * 16; //17em
      var content = findPanelContent();
      var dragger = $dragger(content, { mouse: true });
      var contentsTransformer = $transformer(content);
      var width;

      dragger.addListener($dragger.DIRECTION_HORIZONTAL, onPullView);

      var panel, panelTransformer;
      function onPullView(eventType, data) {
        var newPos;
        if (eventType === 'start') {
          width = content.prop('offsetWidth');
        } else if (eventType === 'move') {
          if (!panel && (data.origin.x < 50 || data.origin.x > width - 50)) {
            if (data.delta.x > 0) {
              panel = panels.left && panels.left.scope.pullable && panels.left;
            } else if (data.delta.x < 0) {
              panel = panels.right && panels.right.scope.pullable && panels.right;
            }
            if (panel) {
              panelTransformer = $transformer(panel.element);
              panelTransformer.updatePosition();
            }
          }
          if (panel) {
            if (panel.scope.display === 'overlay' || panel.scope.display === 'push') {
              newPos = panel.scope.position === 'left' ?
                clamp(-panelWidth, -panelWidth + data.distance.x, 0) :
                clamp(0, panelWidth + data.distance.x, panelWidth);
              panelTransformer.setTo({x: newPos}, true);
            }
            if (panel.scope.display === 'push' || panel.scope.display === 'reveal') {
              newPos = panel.scope.position === 'left' ?
                clamp(0, contentsTransformer.pos.x + data.delta.x, panelWidth) :
                clamp(-panelWidth, contentsTransformer.pos.x + data.delta.x, 0);
              contentsTransformer.setTo({x: newPos}, true);
            }
            if ($scope.openPanelName !== panel.scope.position) {
              applyOpenPanelName(panel.scope.position);
            }
          }
        } else if (eventType === 'end') {
          if (panel) {
            var percentOpen = clamp(0, Math.abs(data.distance.x) / panelWidth, 1);

            //If we're already there, no need to animate to open/closed spot
            if (percentOpen === 1 || percentOpen === 0) {
              done();
            } else if (percentOpen > 0.25) {
              if (panel.scope.display === 'overlay' || panel.scope.display === 'push') {
                panelTransformer.easeTo({x: 0}, 150, done);
              }
              if (panel.scope.display === 'push' || panel.scope.display === 'reveal') {
                newPos = panel.scope.position === 'left' ? panelWidth : -panelWidth;
                contentsTransformer.easeTo({x: newPos}, 150, done);
              }
            } else {
              if (panel.scope.display === 'overlay' || panel.scope.display === 'push') {
                newPos = panel.scope.position === 'left' ? -panelWidth : panelWidth;
                panelTransformer.easeTo({x: newPos}, 150, doneAndClear);
              }
              if (panel.scope.display === 'push' || panel.scope.display === 'reveal') {
                contentsTransformer.easeTo({x: 0}, 150, doneAndClear);
              }
            }
          }
        }
      }
      function done() {
        if (panel) {
          panel = null;
          panelTransformer.clear();
          contentsTransformer.clear();
        }
      }
      function doneAndClear() {
        if (panel) {
          applyOpenPanelName(null);
          done();
        }
      }
      function clamp(a,b,c) {
        return Math.max(a, Math.min(b, c));
      }
      function applyOpenPanelName(name) {
        $scope.$apply(function() {
          $scope.openPanelName = name;
        });
      }
    }
    */
            }
}]);

    /**
 * @ngdoc directive
 * @name jqm.directive:jqmPopup
 * @restrict A
 *
 * @description
 * Creates a popup with the given content.  The popup can be opened and closed on an element using {@link jqm.directive:jqmPopupTarget jqmPopupTarget}.
 *
 * Tip: put a {@link jqm.directive:jqmView jqmView} inside a popup to have full scrollable pages inside.
 * <pre>
 * <div jqm-popup="myPopup" class="fade">
 *   <div jqm-view="{
 *   templateUrl: 'views/my-popup-content-page.html',
 *   controller: 'MyPopupController'
 *   }"></div>
 * </div>
 * </pre>
 *
 * @param {expression} jqmPopup Assignable angular expression to bind this popup to.  jqmPopupTargets will point to this model.
 * @param {expression=} placement Where to put the popup relative to its target.  Available: 'left', 'right', 'top', 'bottom', 'inside'. Default: 'inside'.
 * @param {expression=} overlay-theme The theme to use for the overlay behind the popup. Defaults to the popup's theme.
 * @param {expression=} corners Whether the popup has corners. Default true.
 * @param {expression=} shadow Whether the popup has shadows. Default true.
 *
 * @example
<example module="jqm">
  <file name="index.html">
    <div jqm-popup="myPopup">
    Hey guys, here's a popup!
    </div>
    <div style="padding: 50px;"
     jqm-popup-target="myPopup"
     jqm-popup-model="pageCenterPop">

     <div jqm-button ng-click="pageCenterPop = true">
      Open Page Center Popup
     </div>
     <div jqm-button
       jqm-popup-target="myPopup"
       jqm-popup-model="buttonPop"
       jqm-popup-placement="left"
       ng-click="buttonPop = true">
       Open popup left of this button!
     </div>
    </div>
  </file>
</example>
 */
    jqmModule.directive('jqmPopup', ['$position', '$parse', '$compile', '$rootScope', '$animate', '$timeout',
function ($position, $parse, $compile, $rootScope, $animate, $timeout) {
            var popupOverlayTemplate = '<div jqm-popup-overlay></div>';

            return {
                restrict: 'A',
                replace: true,
                transclude: true,
                template: '<div class="ui-popup-container ng-hide"  jqm-class="{\'ui-popup-open\': opened}">  <div class="ui-popup ui-body-{{$theme}}"    jqm-class="{\'ui-overlay-shadow\': corners}"    ng-transclude>  </div></div>',
                require: '^?jqmPage',
                scope: {
                    corners: '@',
                    shadow: '@',
                    placement: '@',
                    overlayTheme: '@'
                },
                compile: function (element, attr) {
                    attr.corners = isDefined(attr.corners) ? attr.corners === 'true' : true;
                    attr.shadow = isDefined(attr.shadow) ? attr.shadow === 'true' : true;

                    return postLink;
                }
            };

            function postLink(scope, element, attr, pageCtrl) {
                var popupModel = $parse(attr.jqmPopup);
                if (!popupModel.assign) {
                    throw new Error("jqm-popup expected assignable expression for jqm-popup attribute, got '" + attr.jqmPopup + "'");
                }
                popupModel.assign(scope.$parent, scope);

                element.parent().prepend($compile(popupOverlayTemplate)(scope));

                //Publicly expose show, hide methods
                scope.show = show;
                scope.hideForElement = hideForElement;
                scope.hide = hide;
                scope.target = null;
                scope.opened = false;

                function show(target, placement) {
                    scope.target = target;
                    scope.opened = true;
                    placement = placement || scope.placement;

                    scope.$root.$broadcast('$popupStateChanged', scope);

                    element.removeClass('ui-popup-hidden');
                    $animate.removeClass(element, 'ng-hide');

                    //Make sure display: block applies before trying to detect width of popup
                    $timeout(function () {
                        element.css(getPosition(element, target, placement));
                    }, 0, false);
                }

                function hideForElement(target) {
                    if (scope.target && target && scope.target[0] === target[0]) {
                        scope.hide();
                    }
                }

                function hide() {
                    scope.target = null;
                    scope.opened = false;

                    scope.$root.$broadcast('$popupStateChanged', scope);

                    $animate.addClass(element, 'ng-hide', function () {
                        element.addClass('ui-popup-hidden');
                        element.css('left', '');
                        element.css('top', '');
                    });
                }

                function getPosition(element, target, placement) {
                    var popWidth = element.prop('offsetWidth');
                    var popHeight = element.prop('offsetHeight');
                    var pos = $position.position(target);

                    var newPosition = {};
                    switch (placement) {
                    case 'right':
                        newPosition = {
                            top: pos.top + pos.height / 2 - popHeight / 2,
                            left: pos.left + pos.width
                        };
                        break;
                    case 'bottom':
                        newPosition = {
                            top: pos.top + pos.height,
                            left: pos.left + pos.width / 2 - popWidth / 2
                        };
                        break;
                    case 'left':
                        newPosition = {
                            top: pos.top + pos.height / 2 - popHeight / 2,
                            left: pos.left - popWidth
                        };
                        break;
                    case 'top':
                        newPosition = {
                            top: pos.top - popHeight,
                            left: pos.left + pos.width / 2 - popWidth / 2
                        };
                        break;
                    default:
                        newPosition = {
                            top: pos.top + pos.height / 2 - popHeight / 2,
                            left: pos.left + pos.width / 2 - popWidth / 2
                        };
                        break;
                    }

                    newPosition.top = Math.max(newPosition.top, 0);
                    newPosition.left = Math.max(newPosition.left, 0);

                    newPosition.top += 'px';
                    newPosition.left += 'px';

                    return newPosition;
                }
            }
}]);

    jqmModule.directive('jqmPopupOverlay', function () {
        return {
            restrict: 'A',
            replace: true,
            template: '<div class="ui-popup-screen ui-overlay-{{overlayTheme || $theme}}"   jqm-class="{\'ui-screen-hidden\': !opened, \'in\': opened}"  ng-click="hide()"></div>'
        };
    });


    /**
     * @ngdoc directive
     * @name jqm.directive:jqmPopupTarget
     * @restrict A
     *
     * @description
     * Marks an element as a target for a {@link jqm.directive:jqmPopup jqmPopup}, and assigns a model to toggle to show or hide that popup on the element.
     *
     * See {@link jqm.directive:jqmPopup jqmPopup} for an example.
     *
     * @param {expression} jqmPopupTarget Model of a jqmPopup that this element will be linked to.
     * @param {expression=} jqm-popup-model Assignable angular boolean expression that will say whether the popup from jqmPopupTarget is opened on this element. Default '$popup'.
     * @param {string=} jqm-popup-placement The placement for the popup to pop over this element.  Overrides jqmPopup's placement attribute.  See {@link jqm.directive:jqmPopup jqmPopup} for the available values.
     *
     * @require jqmPopup
     */
    jqmModule.directive('jqmPopupTarget', ['$parse',
        function ($parse) {
            return {
                restrict: 'A',
                link: function (scope, elm, attr) {
                    var jqmPopup;
                    var popupModel = $parse(attr.jqmPopupModel || '$popup');

                    var placement;
                    attr.$observe('jqmPopupPlacement', function (p) {
                        placement = p;
                    });

                    scope.$watch(attr.jqmPopupTarget, setPopup);
                    scope.$watch(popupModel, popupModelWatch);
                    scope.$on('$popupStateChanged', popupStateChanged);

                    function setPopup(newPopup) {
                        jqmPopup = newPopup;
                        popupModelWatch(popupModel(scope));
                    }

                    function popupModelWatch(isOpen) {
                        if (jqmPopup) {
                            if (isOpen) {
                                jqmPopup.show(elm, placement);
                            } else if (jqmPopup.opened) {
                                jqmPopup.hideForElement(elm);
                            }
                        }
                    }

                    function popupStateChanged($e, popup) {
                        //We only care if we're getting change from our popupTarget
                        if (popup === jqmPopup) {
                            popupModel.assign(
                                scope,
                                popup.opened && popup.target && popup.target[0] === elm[0]
                            );
                        }
                    }

                }
            };
}]);

    /**
 * @ngdoc directive
 * @name jqm.directive:jqmPositionAnchor
 * @restrict A
 *
 * @description
 * For every child element that has an own scope this will set the property $position in the child's scope
 * and keep that value updated whenever elements are added, moved or removed from the element.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div jqm-position-anchor>
   <div ng-controller="angular.noop">First child: {{$position}}</div>
   <div ng-controller="angular.noop">Middle child: {{$position}}</div>
   <div ng-controller="angular.noop">Last child: {{$position}}</div>
 </div>
 </file>
 </example>
 */
    jqmModule.directive('jqmPositionAnchor', ['$rootScope',
        function ($rootScope) {
            return {
                restrict: 'A',
                link: function (scope, element) {
                    var elementNode = element[0];
                    afterFn(elementNode, 'appendChild', enqueueUpdate);
                    afterFn(elementNode, 'insertBefore', enqueueUpdate);
                    afterFn(elementNode, 'removeChild', enqueueUpdate);

                    enqueueUpdate();

                    function afterFn(context, fnName, afterCb) {
                        var fn = context[fnName];
                        context[fnName] = function (arg1, arg2) {
                            fn.call(context, arg1, arg2);
                            afterCb(arg1, arg2);
                        };
                    }

                    function enqueueUpdate() {
                        if (!enqueueUpdate.started) {
                            enqueueUpdate.started = true;
                            $rootScope.$evalAsync(function () {
                                updateChildren();
                                enqueueUpdate.started = false;
                            });
                        }
                    }

                    function updateChildren() {
                        var children = element.children(),
                            length = children.length,
                            i, child, newPos, childScope;
                        for (i = 0; i < length; i++) {
                            child = children.eq(i);
                            childScope = child.isolateScope() || child.scope();
                            if (childScope !== scope) {
                                childScope.$position = getPosition(i, length);
                            }
                        }
                    }

                    function getPosition(index, length) {
                        return {
                            first: index === 0,
                            last: index === length - 1,
                            middle: index > 0 && index < length - 1
                        };
                    }
                }
            };
}]);

    jqmModule.directive({
        jqmPullLeftPanel: jqmPullPanelDirective('left'),
        jqmPullRightPanel: jqmPullPanelDirective('right')
    });

    function jqmPullPanelDirective(panelPosition) {
        return function () {
            return {
                restrict: 'A',
                link: postLink,
                require: ['jqmPage', '^?jqmPanelContainer']
            };
        };

        function postLink(scope, elm, attr, ctrls) {
            var panelContainerCtrl = ctrls[1],
                panel = panelContainerCtrl && panelContainerCtrl.getPanel(panelPosition);

            if (panel) {
                panel.scope.pullable = true;
                scope.$on('$destroy', function () {
                    panel.scope.pullable = false;
                });
                scope.$on('$disconnect', function () {
                    panel.scope.pullable = false;
                });
            }
        }
    }

    /**
 * @ngdoc directive
 * @name jqm.directive:jqmSlider
 * @restrict A
 *
 * @description
 * Creates a jquery mobile slider on the given element.
 *
 * @param {string=} ngModel Assignable angular expression to data-bind to.
 * @param {string=} disabled Whether this checkbox is disabled.
 * @param {string=} mini Whether this checkbox is mini.
 *
 * @example
<example module="jqm">
  <file name="index.html">
  <div jqm-slider min="-5" max="5" ng-model="slider.Value" ></div>
  My slider value is: {{slider.Value}}
  <div jqm-slider mini="true"  min="-5" max="5" ng-model="slider.Value2" ></div>
  My slider value is: {{slider.Value2}}
  </file>
</example>
 */
    jqmModule.directive('jqmSlider', [

        function () {
            return {
                restrict: 'A',
                transclude: true,
                replace: true,
                priority: 1,
                template: '<div jqm-scope-as="jqmSlider" class="ui-slider" jqm-class="{\'ui-disabled\': $scopeAs.jqmSlider.disabled}">    <input type="number" data-ng-model="$scopeAs.jqmSlider.sliderValue" data-type="range" class="ui-input-text ui-corner-all ui-shadow-inset ui-slider-input"        min="$scopeAs.jqmSlider.min" max="$scopeAs.jqmSlider.max" ng-change="$scopeAs.jqmSlider.inputChange()"         jqm-class="{\'ui-disabled\': disabled, \'ui-state-disabled\': disabled, \'mobile-textinput-disabled\': disabled,\'mobile-slider-disabled\': disabled}"        jqm-once-class="ui-body-{{$theme}}" />    <div jqm-class="{\'ui-mini\':$scopeAs.jqmSlider.isMini(),\'ui-disabled\': disabled}" class="ui-slider-track ui-btn-down-c ui-btn-corner-all">        <a href="#" class="ui-slider-handle ui-btn ui-shadow ui-btn-corner-all" data-role="slider" aria-valuenow="$scopeAs.jqmSlider.sliderValue"           jqm-once-class="ui-btn-up-{{$theme}}"            aria-valuemax="$scopeAs.jqmSlider.max" aria-valuemin="$scopeAs.jqmSlider.min" aria-valuetext="0" style="left:50%;" jqm-slider-handle ng-transclude>            <span class="ui-btn-inner">                <span class="ui-btn-text"></span>            </span>        </a>    </div></div>',
                require: ['^?ngModel'],
                scope: {
                    disabled: '@',
                    mini: '@',
                    min: '@',
                    max: '@',
                    step: '@'
                },
                controller: function ($scope) {
                    if ($scope.disabled && $scope.disabled.length > 0) {
                        $scope.disabled = true;
                    }
                    $scope.sliderValue = {};
                    this.$scope = $scope;
                },
                link: function (scope, element, attr, ctrls) {
                    var ngModelCtrl = ctrls[0];

                    if (ngModelCtrl) {
                        ngModelCtrl.$formatters.push(function (value) {
                            if (value === undefined || isNaN(value)) {
                                ngModelCtrl.$setViewValue(scope.sliderValue);
                            } else {
                                scope.sliderValue = value;
                            }
                            return scope.sliderValue;
                        });

                        ngModelCtrl.$parsers.push(function (value) {
                            //this condition is to correct phantom model reset
                            if (value === undefined && scope.sliderValue !== undefined) {
                                return scope.sliderValue;
                            }
                            return value;
                        });
                    }
                }
            };
}]);

    /**
     * @ngdoc directive
     * @name jqm.directive:jqmSliderHandle
     * @restrict A
     *
     * @description
     * Creates a draggable handle on the jqm-slider.  Used internally by jqm-slider. Not intended to be used directly.
     *
     */
    jqmModule.directive('jqmSliderHandle', ['$window', '$document', '$dragger', '$transformer',
        function ($window, $document, $dragger, $transformer) {
            return {
                restrict: 'A',
                transclude: true,
                priority: 0,
                scope: false,
                require: ['^?ngModel', '^jqmSlider'],
                link: function (scope, element, attr, ctrls) {
                    var ngModelCtrl = ctrls[0];
                    var jqmSliderCtrl = ctrls[1];
                    var parsedMax;
                    var parsedMin;
                    var parsedStep;
                    var elm = element;
                    var dragger;
                    var transformer;
                    var dragOn = false;
                    var bounceBackMinTime = 200;
                    var bounceBackDistanceMulti = 1.5;

                    function isMini() {
                        return scope.mini || (jqmSliderCtrl && jqmSliderCtrl.$scope.mini);
                    }

                    element.bind('touchmove', function (e) {
                        e.preventDefault();
                    });
                    element.bind('mousemove', function (e) {
                        e.preventDefault();
                    });
                    element.bind('click', function (e) {
                        e.preventDefault();
                    });

                    scope.theme = scope.$theme || 'c';
                    scope.isMini = isMini;

                    initSliderState();

                    function initSliderState() {
                        //calculate parameters of slide
                        parsedMax = parseInteger(scope.max || 100);
                        parsedMin = parseInteger(scope.min || 0);
                        parsedStep = parseInteger(scope.step || 1);
                        calculateWidth();

                        //create $dragger and $transformer
                        dragger = $dragger(element);
                        dragger.addListener($dragger.DIRECTION_ANY, dragListener);
                        transformer = $transformer(element);

                        //calculate data parameters
                        scope.midData = (parsedMin + parsedMax) / 2;
                        scope.pixelsPerDataUnit = scope.axis.width / (parsedMax - parsedMin);
                        scope.midPos = transformer.pos.x;
                        scope.minBounds = scope.midPos - (scope.axis.width / 2);
                        scope.maxBounds = scope.midPos + (scope.axis.width / 2);

                        //get slider initial value
                        var initData;
                        if (ngModelCtrl) {
                            if (isNaN(ngModelCtrl.$viewValue)) {
                                initData = scope.midData;
                            } else {
                                initData = ngModelCtrl.$viewValue;
                            }
                        } else {
                            initData = scope.midData;
                        }
                        scope.sliderValue = initData;

                        //set slider to initial value
                        var initDelta = parseInt((initData - scope.midData) * scope.pixelsPerDataUnit);
                        var newPos = {
                            x: scope.midPos + initDelta,
                            y: 0
                        };
                        if (outOfBounds(newPos.x)) {
                            newPos.x = scope.midPos + floor(initDelta * 0.5);
                        }
                        transformer.setTo(newPos);

                        if (ngModelCtrl) {
                            ngModelCtrl.$formatters.push(function (value) {
                                if (value !== undefined && !isNaN(value)) {
                                    if (ngModelCtrl.$modelValue !== ngModelCtrl.$viewValue) {
                                        scope.sliderValue = ngModelCtrl.$modelValue;
                                    } else {
                                        scope.sliderValue = value;
                                    }
                                    return modelMove(scope.sliderValue);
                                }

                                return value;
                            });
                        }
                    }


                    scope.inputChange = function () {
                        if (scope.sliderValue === undefined || isNaN(scope.sliderValue)) {
                            return;
                        }
                        setViewValue(modelMove(parseInt(scope.sliderValue)));
                        return;
                    };

                    function sliderSlid(moveData) {
                        if (scope.disabled) {
                            return;
                        }

                        if (!ngModelCtrl) {
                            return;
                        } else {
                            scope.sliderValue = parsedStep * (Math.round(moveData / parsedStep));
                            setViewValue(scope.sliderValue);
                            scope.$apply();
                        }
                    }

                    function modelMove(value) {
                        if (value === undefined || isNaN(value)) {
                            return value;
                        }

                        //set slider to new model value
                        var moveDelta = parseInt((value - scope.midData) * scope.pixelsPerDataUnit);
                        var newPos = {
                            x: scope.midPos + moveDelta,
                            y: 0
                        };
                        if (outOfBounds(newPos.x)) {
                            newPos.x = scope.midPos + floor(moveDelta * 0.5);
                        }
                        transformer.setTo(newPos);

                        return value;
                    }

                    function setViewValue(value) {
                        if (ngModelCtrl) {
                            if (value && value != ngModelCtrl.$viewValue) {
                                ngModelCtrl.$setViewValue(value);
                            }
                        }
                    }

                    //Returns any parent element that has the specified class, or null
                    //Taken from snap.js http://github.com/jakiestfu/snap.js
                    function parentWithClass(el, className) {
                        while (el.parentNode) {
                            if (el.classList.contains(className)) {
                                return el;
                            }
                            el = el.parentNode;
                        }

                        return null;
                    }

                    function getSlideAxis(raw) {
                        //determine left, right and width of slider
                        var style = window.getComputedStyle(raw);
                        var offLeft = parseInt(style.getPropertyValue('margin-left'), 10) +
                            parseInt(style.getPropertyValue('padding-left'), 10);

                        var left = parseInt(style.getPropertyValue('left'), 10);

                        var width = parseInt(style.getPropertyValue('width'), 10);
                        return {
                            left: offLeft + (isNaN(left) ? 0 : left),
                            right: offLeft + (isNaN(left) ? 0 : left) + width, //offRight + (isNaN(right) ? 0 : right),
                            width: width
                        };
                    }

                    function calculateWidth() {
                        if (!scope.axis) {
                            scope.axis = getSlideAxis(parentWithClass(elm[0], 'ui-slider-track'));
                        }
                        scope.slideWidth = scope.axis.width;
                        return;
                    }

                    function outOfBounds(pos) {
                        if (pos < scope.minBounds) {
                            return pos + scope.minBounds;
                        }
                        if (pos > scope.maxBounds) {
                            return pos - scope.maxBounds;
                        }
                        return false;
                    }

                    //Quicker than Math.floor
                    //http://jsperf.com/math-floor-vs-math-round-vs-parseint/69
                    function floor(n) {
                        return n | 0;
                    }

                    function parseInteger(value) {
                        var intValue = parseInt(value);
                        if (intValue == Number.NaN) {
                            return 0;
                        }

                        return intValue;
                    }

                    function checkBoundaries() {
                        calculateWidth();

                        var howMuchOut = outOfBounds(transformer.pos.x);
                        if (howMuchOut) {
                            var newPosition = howMuchOut < 0 ? scope.minBounds : scope.maxBounds;
                            transformer.easeTo(newPosition, bounceTime(howMuchOut));
                        }
                    }

                    function bounceTime(howMuchOut) {
                        return Math.abs(howMuchOut) + bounceBackDistanceMulti + bounceBackMinTime;
                    }

                    function dragListener(dragType, dragData) {
                        switch (dragType) {
                        case 'start':
                            if (transformer.changing) {
                                transformer.stop();
                            }
                            calculateWidth();
                            $window.onmouseup = function () {
                                dragListener('end', null);
                            };
                            dragOn = true;
                            break;
                        case 'move':
                            if (dragOn) {
                                var newPos = {
                                    x: transformer.pos.x + dragData.delta.x,
                                    y: 0
                                };
                                if (outOfBounds(newPos.x)) {
                                    var reduceDragX = 0;
                                    newPos = {
                                        x: transformer.pos.x + reduceDragX,
                                        y: 0
                                    };
                                }
                                transformer.setTo(newPos);
                                var moveDelta = newPos.x - scope.midPos;
                                var moveData = Math.round(scope.midData + (moveDelta / scope.pixelsPerDataUnit));
                                //if (moveData > scope.maxValue || moveData < scope.minValue) {
                                //  var obData = moveData;
                                //}
                                sliderSlid(moveData);
                            }
                            break;
                        case 'end':
                            if (outOfBounds(transformer.pos.x) || dragData == null || !dragData.active) {
                                checkBoundaries();
                            }

                            $window.onclick = null;
                            dragOn = false;
                            break;
                        }
                    }

                    if (dragger !== null) {
                        elm.bind('$destroy', function () {
                            dragger.removeListener(dragListener);
                        });
                    }
                }
            };
}]);
    /**
 * @ngdoc directive
 * @name jqm.directive:jqmTextarea
 * @restrict A
 *
 * @description
 * Creates an jquery mobile textarea on the given elemen.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} disabled Whether this input is disabled.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 Textarea with ng-model:
 <div ng-model="model" jqm-textarea></div>

 Value: {{model}}
 <p/>
 Textarea disabled:
 <div data-disabled="disabled" jqm-textarea>Hello World</div>
 <p/>
 </file>
 </example>
 */
    jqmModule.directive('jqmTextarea', ['textareaDirective',
        function (textareaDirective) {
            return {
                template: '<textarea    ng-class="{\'ui-disabled mobile-textinput-disabled ui-state-disabled\' : disabled}"    class="ui-input-text ui-corner-all ui-shadow-inset ui-body-{{$theme}}"></textarea>',
                replace: true,
                restrict: 'A',
                require: '?ngModel',
                scope: {
                    disabled: '@'
                },
                link: function (scope, element, attr, ngModelCtrl) {
                    var textarea = jqLite(element[0]);

                    linkInput();

                    function linkInput() {
                        textarea.bind('focus', function () {
                            element.addClass('ui-focus');
                        });
                        textarea.bind('blur', function () {
                            element.removeClass('ui-focus');
                        });

                        forEach(textareaDirective, function (directive) {
                            directive.link(scope, textarea, attr, ngModelCtrl);
                        });
                        return textarea;
                    }
                }
            };
}]);

    /**
 * @ngdoc directive
 * @name jqm.directive:jqmTheme
 * @restrict A
 *
 * @description
 * Sets the jqm theme for this element and it's children by adding a `$theme` property to the scope.
 * Other directives like `jqmCheckbox` evaluate that property.
 *
 * jqmTheme will modify the scope of whichever element you give it, adding `$theme`.
 * That means if you apply jqmTheme to an element that shares its scope with its parent,
 * it will set the theme for that element and its parent.
 * If you explicitly want jqmTheme to set a theme for only itself and its children,
 * share it with a directive that creates its own scope.
 *
 * (think this is bad?  come discuss it at [the issue](https://github.com/angular-widgets/angular-jqm/issues/177))
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div>
   <div jqm-checkbox jqm-theme="a">Theme a</div>
   <div jqm-checkbox jqm-theme="b">Theme b</div>
 </div>
 </file>
 </example>
 */
    jqmModule.directive('jqmTheme', [

        function () {
            return {
                restrict: 'A',
                compile: function () {
                    return {
                        pre: function preLink(scope, iElement, iAttrs) {
                            var themeScope = iElement.isolateScope() || iElement.scope();
                            // Set the theme before all other link functions of children
                            var theme = iAttrs.jqmTheme;
                            if (theme) {
                                themeScope.$theme = theme;
                            }
                        }
                    };
                }
            };
}]);


    //In angularJS 1.2, they made ng-transclude erase all content
    //inside a directive before inserting transcluded content.
    //We just act like 1.1.x transclude, appending transclusion.
    jqmModule.directive('jqmTransclude', function () {
        return {
            controller: ['$transclude',
                function ($transclude) {
                    this.$transclude = $transclude;
    }],
            link: function (scope, elm, attr, controller) {
                controller.$transclude(function (clone) {
                    elm.append(clone);
                });
            }
        };
    });

    /**
 * @ngdoc directive
 * @name jqm.directive:jqmView
 * @restrict ECA
 *
 * @description
 * # Overview
 * `jqmView` extends `ngView` in the following way:
 *
 * - animations can also be specified on routes using the `animation` property (see below).
 * - animations can also be specified in the template using the `view-animation` attribute on a root element.
 * - when the user hits the back button, the last animation is executed with the `-reverse` suffix.
 * - instead of using `$route` an expression can be specified as value of the directive. Whenever
 *   the value of this expression changes `jqmView` updates accordingly.
 * - content that has been declared inside of `ngView` stays there, so you can mix dynamically loaded content with
 *   fixed content.
 *
 * @param {expression=} jqmView angular expression evaluating to a route.
 *
 *   * `{string}`: This will be interpreted as the url of a template.
 *   * `{object}`: A route object with the same properties as `$route.current`:
 *   - `templateUrl` - `{string=}` - the url for the template
 *   - `controller` - `{string=|function()=}` - the controller
 *   - `controllerAs` - `{string=}` - the name of the controller in the scope
 *   - `locals` - `{object=}` - locals to be used when instantiating the controller
 *   - `back` - `{boolean=}` - whether the animation should be executed in reverse
 *   - `animation` - `{string=|function()=}` - the animation to use. If `animation` is a function it will
 *    be called using the `$injector` with the extra locals `$routeParams` (`route.params`) and `$scope` (the scope of `jqm-view`).
 *
 * @param {boolean=} viewDeepWatch If you have a route expression in `jqmView`, this will tell the
 *        $watch to use 'value-watch' to see if the view has changed instead of 'reference-watch'.
 *
 * @scope
 * @example
 <example module="jqmView">
 <file name="index.html">
 Choose:
 <a href="#/Book/Moby">Moby</a> |
 <a href="#/Book/Moby/ch/1">Moby: Ch1</a> |
 <a href="#/Book/Gatsby">Gatsby</a> |
 <a href="#/Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
 <a href="#/Book/Scarlet">Scarlet Letter</a><br/>

 <div jqm-view style="height:300px"></div>
 </file>

 <file name="book.html">
 <div jqm-page>
 <div jqm-header><h1>Book {{book.params.bookId}}</h1></div>
 The book contains ...
 </div>
 </file>

 <file name="chapter.html">
 <div jqm-page>
 <div jqm-header><h1>Chapter {{chapter.params.chapterId}} of {{chapter.params.bookId}}</h1></div>
 This chapter contains ...
 </div>
 </file>

 <file name="script.js">
 angular.module('jqmView', ['jqm'], function($routeProvider) {
      $routeProvider.when('/Book/:bookId', {
      templateUrl: 'book.html',
      controller: BookCntl,
      controllerAs: 'book',
      animation: 'page-slide'
      });
      $routeProvider.when('/Book/:bookId/ch/:chapterId', {
      templateUrl: 'chapter.html',
      controller: ChapterCntl,
      controllerAs: 'chapter',
      animation: 'page-slide'
      });
    });

 function BookCntl($routeParams) {
      this.params = $routeParams;
    }

 function ChapterCntl($routeParams) {
      this.params = $routeParams;
    }
 </file>
 </example>
 */
    jqmModule.directive('jqmView', ['$compile', '$templateCache', '$http', '$q', '$route', '$controller', '$injector', '$nextFrame', '$sniffer', '$animate', '$rootScope',
function ($compile, $templateCache, $http, $q, $route, $controller, $injector, $nextFrame, $sniffer, $animate, $rootScope) {

            var SEQUENTIAL_ANIMATIONS = {
                fade: true,
                pop: true,
                slidefade: true,
                slidedown: true,
                slideup: true,
                flip: true,
                turn: true,
                flow: true
            };

            return {
                restrict: 'A',
                template: '<div class="ui-mobile-viewport" jqm-class="\'ui-overlay-\'+$theme" jqm-transclude></div>',
                replace: true,
                transclude: true,
                controller: ['$scope', '$element', JqmViewCtrl],
                link: link
            };

            function link(scope, element, attr, jqmViewCtrl) {
                var lastView,
                    leavingView, //store this so we can cancel the leaving view early if need
                    onloadExp = attr.onload || '',
                    viewAttrGetter,
                    changeCounter = 0;

                if (attr[jqmViewCtrl.viewWatchAttr]) {
                    watchRouteAttr();
                } else {
                    watchRoute();
                }

                //For some reason, a scope.$watch(attr[watchAttr], onChange, true) doesn't work - it always gives infinite digest error.
                //And we do need to check value, so people can do '<div jqm-view="{templateUrl: 'myTemplate.html', controller: 'MyCtrl'}"> etc
                var oldRoute, next = 0;

                function watchRouteAttr() {
                    scope.$watch(attr[jqmViewCtrl.viewWatchAttr], routeChanged, ( !! attr.viewDeepWatch));
                }

                function watchRoute() {
                    scope.$on('$routeChangeSuccess', update);
                    update();

                    function update() {
                        routeChanged($route.current);
                    }
                }

                function routeChanged(route) {
                    route = route || {};

                    var thisChangeId = ++changeCounter;

                    var template = route.locals ? route.locals.$template : route.template;
                    var templateUrl = isString(route) && route || route.loadedTemplateUrl || route.templateUrl;
                    if (templateUrl || template) {
                        jqmViewCtrl.loadView(templateUrl, template, lastView).then(function (view) {
                            if (thisChangeId !== changeCounter) {
                                return;
                            }
                            viewLoaded(route, view);
                        });
                    } else {
                        changeView(null, lastView);
                        lastView = null;
                    }
                }

                function viewLoaded(route, view) {
                    var locals = route.locals || {};
                    var controller;

                    var animationName = figureOutAnimation(route, view);
                    var animationExists = JQM_ANIMATIONS.indexOf(animationName.replace(/^page-/, '')) > -1;
                    if (!animationExists) {
                        changeView(view, lastView);
                    } else {
                        performViewAnimation(animationName, route.back, view, lastView);
                    }
                    view.scope.$reconnect();

                    locals.$scope = view.scope;
                    if (route.controller) {
                        controller = $controller(route.controller, locals);
                        if (route.controllerAs) {
                            view.scope[route.controllerAs] = controller;
                        }
                        view.element.data('$ngControllerController', controller);
                    }

                    $rootScope.$broadcast('$viewContentLoaded', view.element);
                    view.scope.$eval(onloadExp);
                    //no $anchorScroll because we don't use browser scrolling anymore

                    scope.$theme = view.element.scope().$theme;
                    lastView = view;
                }

                function changeView(view, lastView) {
                    if (lastView) {
                        lastView.clear();
                    }
                    if (view) {
                        element.append(view.element);
                        view.element.addClass('ui-page-active');
                    }
                }

                function performViewAnimation(animationName, reverse, view, lastView) {
                    var isSequential = SEQUENTIAL_ANIMATIONS[animationName.replace(/^page-/, '')];
                    var viewportClass = 'ui-mobile-viewport-transitioning viewport-' + animationName.replace('page-', '');
                    var animationClassName = animationName + (reverse ? ' reverse' : '');

                    view.element.addClass(animationClassName);
                    view.animationName = animationName;
                    if (lastView) {
                        lastView.element.addClass(animationClassName);
                    }
                    if (leavingView) {
                        leavingView.element.triggerHandler('animationend');
                    }
                    leavingView = lastView;
                    element.addClass(viewportClass);

                    if (isSequential && lastView) {
                        element.append(view.element);
                        $animate.leave(lastView.element, function () {
                            //animations only fire after digest
                            scope.$apply(function () {
                                $animate.enter(view.element, element, null, onDone);
                            });
                        });
                    } else {
                        $animate.enter(view.element, element, null, onDone);
                        if (lastView) {
                            $animate.leave(lastView.element);
                        }
                    }

                    function onDone() {
                        leavingView = null;
                        if (lastView) {
                            lastView.element.removeClass(animationClassName);
                            lastView.clear();
                        }
                        view.element.removeClass(animationClassName);
                        view.element.addClass('ui-page-active');

                        element.removeClass(viewportClass);
                    }
                }

                function figureOutAnimation(route, view) {
                    var reverse = route.back,
                        animationName = '';

                    if (reverse) {
                        animationName = lastView && lastView.animationName || animationName;
                    }
                    if (!animationName) {
                        if (route.animation) {
                            if (isFunction(route.animation) || isArray(route.animation)) {
                                animationName = $injector.invoke(route.animation, null, {
                                    $scope: scope,
                                    $routeParams: route.params
                                });
                            } else {
                                animationName = route.animation;
                            }
                        } else {
                            //Find animation in the new page's className
                            forEach((view.element[0].className || '').split(' '), function (klass) {
                                //Eg if view element has 'page-fade' on it we know to fade
                                if (klass.substring(0, 5) === 'page-' && $injector.has('.' + klass + '-animation')) {
                                    animationName = animationName || klass;
                                }
                            });
                        }
                    }
                    return maybeDegradeAnimation(animationName);
                }


                function maybeDegradeAnimation(animationName) {
                    if (!animationName || !$sniffer.animations) {
                        return '';
                    } else if (!$sniffer.cssTransform3d) {
                        return 'page-fade';
                    }
                    return animationName;
                }
            }

            function JqmViewCtrl($scope, $element) {
                this.$scope = $scope;
                this.$element = $element;

                this.loadView = loadView;
                this.fetchView = fetchView;
                this.viewWatchAttr = 'jqmView';

                function loadView(templateUrl, template) {
                    if (template) {
                        return $q.when(compile(template));
                    } else {
                        return fetchView(templateUrl);
                    }
                }

                function fetchView(templateUrl) {
                    return $http.get(templateUrl, {
                        cache: $templateCache
                    }).then(function (response) {
                        return compile(response.data);
                    });
                }

                function compile(template) {
                    //We compile the element as a child of our view, so that everything 'links together' correctly
                    var scope = $scope.$new();

                    var element = jqLite('<div></div>').html(template).children();
                    $element.append(element);

                    var view = {
                        scope: scope,
                        element: $compile(element)(scope),
                        clear: viewClear
                    };

                    scope.$disconnect();

                    //Disconnect this from the parent before finishing
                    forEach(element, function (node) {
                        node.parentNode.removeChild(node);
                    });

                    return view;
                }
            }

            function viewClear() {
                /*jshint -W040:true*/
                this.element.remove();
                this.element = null;
                this.scope.$destroy();
                this.scope = null;
            }
}]);


    jqmModule.directive('label', [

        function () {
            return {
                restrict: 'E',
                require: '^?jqmInputWrapper',
                link: function (scope, element, attr, wrapperCtrl) {
                    if (wrapperCtrl) {
                        element.addClass('ui-input-text');
                    }
                }
            };
}]);

    /**
     * @ngdoc function
     * @name jqm.$anchorScroll
     * @requires $hideAddressBar
     *
     * @description
     * This overrides the default `$anchorScroll` of angular and calls `$hideAddressBar` instead.
     * By this, the address bar is hidden on every view change, orientation change, ...
     */
    jqmModule.factory('$anchorScroll', ['$hideAddressBar',
        function ($hideAddressBar) {
            return deferredHideAddressBar;

            // We almost always want to allow the browser to settle after
            // showing a page, orientation change, ... before we hide the address bar.
            function deferredHideAddressBar() {
                window.setTimeout($hideAddressBar, 50);
            }
}]);
    jqmModule.run(['$anchorScroll', '$rootScope',
        function ($anchorScroll, $rootScope) {
            $rootScope.$on('$orientationChanged', function (event) {
                $anchorScroll();
            });
}]);

    jqmModule.factory('$animationComplete', ['$sniffer',
        function ($sniffer) {
            return function (el, callback, once) {
                var eventNames = 'animationend';
                if (!$sniffer.animations) {
                    throw new Error("Browser does not support css animations.");
                }
                if ($sniffer.vendorPrefix) {
                    eventNames += " " + $sniffer.vendorPrefix.toLowerCase() + "AnimationEnd";
                }
                var _callback = callback;
                if (once) {
                    callback = function () {
                        unbind();
                        _callback();
                    };
                }
                el.on(eventNames, callback);

                return unbind;

                function unbind() {
                    el.off(eventNames, callback);
                }
            };
}]);

    jqmModule.config(['$provide',
        function ($provide) {
            $provide.decorator('$browser', ['$delegate', browserHashReplaceDecorator]);
            return;

            // ---------------
            // implementation functions
            function browserHashReplaceDecorator($browser) {
                // On android and non html5mode, the hash in a location
                // is returned as %23.
                var _url = $browser.url;
                $browser.url = function () {
                    var res = _url.apply(this, arguments);
                    if (arguments.length === 0) {
                        res = res.replace(/%23/g, '#');
                        res = res.replace(/ /g, '%20');
                    }
                    return res;
                };
                return $browser;
            }
}]);

    /**
     * @ngdoc function
     * @name jqm.$hideAddressBar
     * @requires $window
     * @requires $rootElement
     * @requires $orientation
     *
     * @description
     * When called, this will hide the address bar on mobile devices that support it.
     */
    jqmModule.factory('$hideAddressBar', ['$window', '$rootElement', '$orientation',
        function ($window, $rootElement, $orientation) {
            var MIN_SCREEN_HEIGHT_WIDTH_OPT_OUT = 500,
                MAX_SCREEN_HEIGHT = 800,
                scrollToHideAddressBar,
                cachedHeights = {};
            if (!$window.addEventListener || addressBarHidingOptOut()) {
                return noopCallback;
            } else {
                return hideAddressBar;
            }

            function noopCallback(done) {
                if (done) {
                    done();
                }
            }

            // -----------------
            function hideAddressBar(done) {
                var orientation = $orientation(),
                    docHeight = cachedHeights[orientation];
                if (!docHeight) {
                    // if we don't know the exact height of the document without the address bar,
                    // start with one that is always higher than the screen to be
                    // sure the address bar can be hidden.
                    docHeight = MAX_SCREEN_HEIGHT;
                }
                setDocumentHeight(docHeight);
                if (!isDefined(scrollToHideAddressBar)) {
                    // iOS needs a scrollTo(0,0) and android a scrollTo(0,1).
                    // We always do a scrollTo(0,1) at first and check the scroll position
                    // afterwards for future scrolls.
                    $window.scrollTo(0, 1);
                } else {
                    $window.scrollTo(0, scrollToHideAddressBar);
                }
                // Wait for a scroll event or a timeout, whichever is first.
                $window.addEventListener('scroll', afterScrollOrTimeout, false);
                var timeoutHandle = $window.setTimeout(afterScrollOrTimeout, 400);

                function afterScrollOrTimeout() {
                    $window.removeEventListener('scroll', afterScrollOrTimeout, false);
                    $window.clearTimeout(timeoutHandle);
                    if (!cachedHeights[orientation]) {
                        cachedHeights[orientation] = getViewportHeight();
                        setDocumentHeight(cachedHeights[orientation]);
                    }
                    if (!isDefined(scrollToHideAddressBar)) {
                        if ($window.pageYOffset === 1) {
                            // iOS
                            scrollToHideAddressBar = 0;
                            $window.scrollTo(0, 0);
                        } else {
                            // Android
                            scrollToHideAddressBar = 1;
                        }
                    }
                    if (done) {
                        done();
                    }
                }
            }

            function addressBarHidingOptOut() {
                return Math.max(getViewportHeight(), getViewportWidth()) > MIN_SCREEN_HEIGHT_WIDTH_OPT_OUT;
            }

            function getViewportWidth() {
                return $window.innerWidth;
            }

            function getViewportHeight() {
                return $window.innerHeight;
            }

            function setDocumentHeight(height) {
                $rootElement.css('height', height + 'px');
            }
}]);

    jqmModule.config(['$provide',
        function ($provide) {
            var lastLocationChangeByProgram = false;
            $provide.decorator('$location', ['$delegate', '$browser', '$history', '$rootScope',
                function ($location, $browser, $history, $rootScope) {
                    instrumentBrowser();

                    $rootScope.$on('$locationChangeSuccess', function () {
                        if (!lastLocationChangeByProgram) {
                            $history.onUrlChangeBrowser($location.url());
                        }
                    });

                    $history.onUrlChangeProgrammatically($location.url() || '/', false);

                    return $location;

                    function instrumentBrowser() {
                        var _url = $browser.url;
                        $browser.url = function (url, replace) {
                            if (url) {
                                // setter
                                $history.onUrlChangeProgrammatically($location.url(), replace);
                                lastLocationChangeByProgram = true;
                                $rootScope.$evalAsync(function () {
                                    lastLocationChangeByProgram = false;
                                });
                            }
                            return _url.apply(this, arguments);
                        };
                    }
  }]);
}]);

    jqmModule.factory('$history', ['$window', '$timeout',
        function $historyFactory($window, $timeout) {
            var $history = {
                go: go,
                urlStack: [],
                indexOf: indexOf,
                activeIndex: -1,
                previousIndex: -1,
                onUrlChangeBrowser: onUrlChangeBrowser,
                onUrlChangeProgrammatically: onUrlChangeProgrammatically
            };

            return $history;

            function go(relativeIndex) {
                // Always execute history.go asynchronously.
                // This is required as firefox and IE10 trigger the popstate event
                // in sync. By using a setTimeout we have the same behaviour everywhere.
                // Don't use $defer here as we don't want to trigger another digest cycle.
                // Note that we need at least 20ms to ensure that
                // the hashchange/popstate event for the current page
                // as been delivered (in IE this can take some time...).
                $timeout(function () {
                    $window.history.go(relativeIndex);
                }, 20, false);
            }

            function indexOf(url) {
                var i,
                    urlStack = $history.urlStack;
                for (i = 0; i < urlStack.length; i++) {
                    if (urlStack[i].url === url) {
                        return i;
                    }
                }
                return -1;
            }

            function onUrlChangeBrowser(url) {
                var oldIndex = $history.activeIndex;
                $history.activeIndex = indexOf(url);
                if ($history.activeIndex === -1) {
                    onUrlChangeProgrammatically(url, false);
                } else {
                    $history.previousIndex = oldIndex;
                }
            }

            function onUrlChangeProgrammatically(url, replace) {
                var currentEntry = $history.urlStack[$history.activeIndex];
                if (!currentEntry || currentEntry.url !== url) {
                    $history.previousIndex = $history.activeIndex;
                    if (!replace) {
                        $history.activeIndex++;
                    }
                    $history.urlStack.splice($history.activeIndex, $history.urlStack.length - $history.activeIndex);
                    $history.urlStack.push({
                        url: url
                    });
                }
            }
}]);

    jqmModule.run(['jqmButtonToggler', '$rootElement',
        function (jqmButtonToggler, $rootElement) {
            jqmButtonToggler($rootElement);
}]);
    jqmModule.factory('jqmButtonToggler', function () {

        return function (element) {
            var self = {};

            //Exposed for testing
            self.$mousedown = function (e) {
                var offEventNames = e.type === 'mousedown' ?
                    'mouseup mousemove' :
                    'touchmove touchend touchcancel';
                var target = jqLite(e.target);
                var btnElement = parentWithClass(target, 'ui-btn-up-' + target.scope().$theme);
                if (btnElement) {
                    toggleBtnDown(btnElement, true);
                    target.on(offEventNames, onBtnUp);
                }

                function onBtnUp() {
                    toggleBtnDown(btnElement, false);
                    target.off(offEventNames, onBtnUp);
                }
            };

            //Exposed for testing
            self.$mouseover = function (e) {
                var target = jqLite(e.target);
                var btnElement = parentWithClass(target, 'ui-btn');
                if (btnElement && !btnElement.hasClass('ui-btn-down-' + target.scope().$theme)) {
                    toggleBtnHover(btnElement, true);
                    target.on('mouseout', onBtnMouseout);
                }

                function onBtnMouseout() {
                    toggleBtnHover(btnElement, false);
                    target.off('mouseout', onBtnMouseout);
                }
            };

            element[0].addEventListener('touchstart', self.$mousedown, true);
            element[0].addEventListener('mousedown', self.$mousedown, true);
            element[0].addEventListener('mouseover', self.$mouseover, true);

            return self;

            function toggleBtnDown(el, isDown) {
                var theme = (el.isolateScope() || el.scope()).$theme;
                el.toggleClass('ui-btn-down-' + theme, isDown);
                el.toggleClass('ui-btn-up-' + theme, !isDown);
            }

            function toggleBtnHover(el, isHover) {
                var theme = (el.isolateScope() || el.scope()).$theme;
                el.toggleClass('ui-btn-hover-' + theme, isHover);
            }

            function parentWithClass(el, className) {
                var maxDepth = 5;
                var current = el;
                while (current.length && maxDepth--) {
                    if (current.hasClass(className)) {
                        return current;
                    }
                    current = current.parent();
                }
                return null;
            }

        };
    });

    /**
     * @ngdoc object
     * @name jqm.jqmConfigProvider
     *
     * @description Used to configure the default theme.
     */

    jqmModule.provider('jqmConfig', function () {
        /**
         * @ngdoc method
         * @name jqm.jqmConfigProvider#primaryTheme
         * @methodOf jqm.jqmConfigProvider
         *
         * @description Sets/gets the default primary theme (used if jqm-theme is
         * not set on the element). Default: 'c'
         *
         * @param {string=} newTheme The new primary theme to set.
         * @returns {string} The current primary theme.
         */
        /**
         * @ngdoc method
         * @name jqm.jqmConfigProvider#secondaryTheme
         * @methodOf jqm.jqmConfigProvider
         *
         * @description Sets/gets the secondary theme (used on footers, headers, etc
         * if not theme is set on the element). Default: 'a'
         *
         * @param {string=} newTheme The new secondary theme to set.
         * @returns {string} The current secondary theme.
         */

        var _primaryTheme = 'c';
        var _secondaryTheme = 'a';
        return {
            primaryTheme: primaryTheme,
            secondaryTheme: secondaryTheme,
            $get: serviceFactory
        };

        function primaryTheme(value) {
            if (value) {
                _primaryTheme = value;
            }
            return _primaryTheme;
        }

        function secondaryTheme(value) {
            if (value) {
                _secondaryTheme = value;
            }
            return _secondaryTheme;
        }

        /**
         * @ngdoc object
         * @name jqm.jqmConfig
         * @description
         * A service used to tell the default primary and secondary theme.
         */
        /**
         * @ngdoc property
         * @name jqm.jqmConfig#primaryTheme
         * @propertyOf jqm.jqmConfig
         *
         * @description {string} The current primary theme.  See {@link jqm.jqmConfigProvider#primaryTheme}.
         */
        /**
         * @ngdoc property
         * @name jqm.jqmConfig#secondaryTheme
         * @propertyOf jqm.jqmConfig
         *
         * @description {string} The current secondary theme.  See {@link jqm.jqmConfigProvider#secondaryTheme}.
         */
        function serviceFactory() {
            return {
                primaryTheme: _primaryTheme,
                secondaryTheme: _secondaryTheme
            };
        }

    });

    jqmModule.factory('jqmViewCache', ['$cacheFactory',
        function ($cacheFactory) {
            return $cacheFactory('jqmCachingView');
}]);

    /**
     * @ngdoc function
     * @name jqm.$orientation
     * @requires $window
     * @requires $rootScope
     *
     * @description
     * Provides access to the orientation of the browser. This will also
     * broadcast a `$orientationChanged` event on the root scope and do a digest whenever the orientation changes.
     */
    jqmModule.factory('$orientation', ['$window', '$rootScope',
        function ($window, $rootScope) {
            if (!$window.addEventListener) {
                // For tests
                return noop;
            }
            var lastOrientation = getOrientation();
            var VERTICAL = "vertical";
            var HORIZONTAL = "horizontal";

            initOrientationChangeListening();

            return getOrientation;

            // ------------------

            function initOrientationChangeListening() {
                // Start listening for orientation changes
                $window.addEventListener('resize', resizeListener, false);

                function resizeListener() {
                    if (!orientationChanged()) {
                        return;
                    }
                    $rootScope.$apply(function () {
                        $rootScope.$broadcast('$orientationChanged', getOrientation());
                    });
                }
            }

            function getOrientation() {
                var w;
                var h;

                if ($window.orientation !== undefined && $window.orientation !== null) {
                    if ($window.orientation === 0 || $window.orientation === 180) {
                        return VERTICAL;
                    } else {
                        return HORIZONTAL;
                    }
                }

                w = $window.innerWidth;
                h = $window.innerHeight;

                if (h < 200) {
                    // In case of the Android screen size bug we assume
                    // vertical, as the keyboard takes the whole screen
                    // when horizontal.
                    // See http://stackoverflow.com/questions/7958527/jquery-mobile-footer-or-viewport-size-wrong-after-android-keyboard-show
                    // and http://android-developers.blogspot.mx/2009/04/updating-applications-for-on-screen.html
                    return VERTICAL;
                }
                if (w > h) {
                    return HORIZONTAL;
                } else {
                    return VERTICAL;
                }
            }

            function orientationChanged() {
                var newOrientation = getOrientation();
                if (lastOrientation === newOrientation) {
                    return false;
                }
                lastOrientation = newOrientation;
                return true;
            }
}]);

    // Note: We don't create a directive for the html element,
    // as sometimes people add the ng-app to the body element.
    jqmModule.run(['$window',
        function ($window) {
            jqLite($window.document.documentElement).addClass("ui-mobile");
}]);

    jqmModule.config(['$provide',
        function ($provide) {
            $provide.decorator('$route', ['$delegate', '$rootScope', '$history',
                function ($route, $rootScope, $history) {
                    $rootScope.$on('$routeChangeStart', function (event, newRoute) {
                        if (newRoute) {
                            newRoute.back = $history.activeIndex < $history.previousIndex;
                        }
                    });
                    return $route;
  }]);
}]);

    /**
     * In the docs, an embedded angular app is used. However, due to a bug,
     * the docs don't disconnect the embedded $rootScope from the real $rootScope.
     * By this, our embedded app will never get freed and it's watchers will still fire.
     */
    jqmModule.run(['$rootElement', '$rootScope',
        function clearRootScopeOnRootElementDestroy($rootElement, $rootScope) {
            $rootElement.bind('$destroy', function () {
                $rootScope.$destroy();
                $rootScope.$$watchers = [];
                $rootScope.$$listeners = [];
            });
}]);

    jqmModule.config(['$provide',
        function ($provide) {
            $provide.decorator('$rootScope', ['$delegate', scopeReconnectDecorator]);
            $provide.decorator('$rootScope', ['$delegate', 'jqmConfig', inheritThemeDecorator]);

            function scopeReconnectDecorator($rootScope) {
                $rootScope.$disconnect = function () {
                    if (this.$root === this) {
                        return; // we can't disconnect the root node;
                    }
                    var parent = this.$parent;
                    this.$$disconnected = true;
                    // See Scope.$destroy
                    if (parent.$$childHead === this) {
                        parent.$$childHead = this.$$nextSibling;
                    }
                    if (parent.$$childTail === this) {
                        parent.$$childTail = this.$$prevSibling;
                    }
                    if (this.$$prevSibling) {
                        this.$$prevSibling.$$nextSibling = this.$$nextSibling;
                    }
                    if (this.$$nextSibling) {
                        this.$$nextSibling.$$prevSibling = this.$$prevSibling;
                    }
                    this.$$nextSibling = this.$$prevSibling = null;
                };
                $rootScope.$reconnect = function () {
                    if (this.$root === this) {
                        return; // we can't disconnect the root node;
                    }
                    var child = this;
                    if (!child.$$disconnected) {
                        return;
                    }
                    var parent = child.$parent;
                    child.$$disconnected = false;
                    // See Scope.$new for this logic...
                    child.$$prevSibling = parent.$$childTail;
                    if (parent.$$childHead) {
                        parent.$$childTail.$$nextSibling = child;
                        parent.$$childTail = child;
                    } else {
                        parent.$$childHead = parent.$$childTail = child;
                    }

                };
                return $rootScope;
            }

            function inheritThemeDecorator($rootScope, jqmConfig) {
                instrumentScope($rootScope, jqmConfig.primaryTheme);
                return $rootScope;

                function instrumentScope(scope, theme) {
                    scope.$theme = theme;
                    var _new = scope.$new;
                    scope.$new = function (isolate) {
                        var res = _new.apply(this, arguments);
                        if (isolate) {
                            instrumentScope(res, this.$theme);
                        }
                        return res;

                    };
                }
            }
}]);

    (function () {
        /*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
        window.matchMedia = window.matchMedia || (function (doc) {
            var bool,
                docElem = doc.documentElement,
                refNode = docElem.firstElementChild || docElem.firstChild,
                // fakeBody required for <FF4 when executed in <head>
                fakeBody = doc.createElement("body"),
                div = doc.createElement("div");

            div.id = "mq-test-1";
            div.style.cssText = "position:absolute;top:-100em";
            fakeBody.style.background = "none";
            fakeBody.appendChild(div);

            return function (q) {

                div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

                docElem.insertBefore(fakeBody, refNode);
                bool = div.offsetWidth === 42;
                docElem.removeChild(fakeBody);

                return {
                    matches: bool,
                    media: q
                };

            };

        }(window.document));
    })();

    jqmModule.config(['$provide',
        function ($provide) {
            $provide.decorator('$sniffer', ['$delegate', '$window', '$document',
                function ($sniffer, $window, $document) {
                    var fakeBody = jqLite("<body>");
                    jqLite($window.document.body).prepend(fakeBody);

                    $sniffer.cssTransform3d = transform3dTest();

                    android2Transitions();

                    fakeBody.remove();

                    return $sniffer;

                    function media(q) {
                        return window.matchMedia(q).matches;
                    }

                    // This is a copy of jquery mobile 1.3.1 detection for transform3dTest
                    function transform3dTest() {
                        var mqProp = "transform-3d",
                            vendors = ["Webkit", "Moz", "O"],
                            // Because the `translate3d` test below throws false positives in Android:
                            ret = media("(-" + vendors.join("-" + mqProp + "),(-") + "-" + mqProp + "),(" + mqProp + ")");

                        if (ret) {
                            return !!ret;
                        }

                        var el = $window.document.createElement("div"),
                            transforms = {
                                // We’re omitting Opera for the time being; MS uses unprefixed.
                                'MozTransform': '-moz-transform',
                                'transform': 'transform'
                            };

                        fakeBody.append(el);

                        for (var t in transforms) {
                            if (el.style[t] !== undefined) {
                                el.style[t] = 'translate3d( 100px, 1px, 1px )';
                                ret = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                            }
                        }
                        return ( !! ret && ret !== "none");
                    }

                    //Fix android 2 not reading transitions correct.
                    //https://github.com/angular/angular.js/pull/3086
                    //https://github.com/angular-widgets/angular-jqm/issues/89
                    function android2Transitions() {
                        if (!$sniffer.transitions || !$sniffer.animations) {
                            $sniffer.transitions = isString($document[0].body.style.webkitTransition);
                            $sniffer.animations = isString($document[0].body.style.webkitAnimation);
                            if ($sniffer.animations || $sniffer.transitions) {
                                $sniffer.vendorPrefix = 'webkit';
                                $sniffer.cssTransform3d = true;
                            }
                        }
                    }

  }]);
}]);

    jqmModule.factory('$transitionComplete', ['$sniffer',
        function ($sniffer) {
            return function (el, callback, once) {
                var eventNames = 'transitionend';
                if (!$sniffer.transitions) {
                    throw new Error("Browser does not support css transitions.");
                }
                if ($sniffer.vendorPrefix) {
                    eventNames += " " + $sniffer.vendorPrefix.toLowerCase() + "TransitionEnd";
                }
                var _callback = callback;
                if (once) {
                    callback = function () {
                        unbind();
                        _callback();
                    };
                }
                //We have to split because unbind doesn't support multiple event names in one string
                //This will be fixed in 1.2, PR opened https://github.com/angular/angular.js/pull/3256
                el.on(eventNames, callback);

                return unbind;

                function unbind() {
                    el.off(eventNames, callback);
                }
            };
}]);
})(window, angular);
/*
 * angular-scrolly - v0.0.8 - 2013-10-22
 * http://github.com/ajoslin/angular-scrolly
 * Created by Andy Joslin; Licensed under Public Domain
 */
(function () {

    /*
     * @ngdoc module
     * @name ajoslin.scrolly
     * @description
     *
     * 'ajoslin.scrolly' Is the one module that includes all of the others.
     */
    angular.module('ajoslin.scrolly', [
  'ajoslin.scrolly.scroller',
  'ajoslin.scrolly.directives'
]);

    var jqLite = angular.element,
        noop = angular.noop,
        isDefined = angular.isDefined,
        copy = angular.copy,
        forEach = angular.forEach,
        isString = angular.isString,
        extend = angular.extend;


    /**
     * @ngdoc directive
     * @name ajoslin.scrolly.directive:scrollyScroll
     * @restrict A
     *
     * @description
     * Attaches a {@link #/ajoslin.scrolly.$scroller $scroller} to the given element.
     *
     * ## Example
     * <pre>
     * <ul scrolly-scroll>
     *   <li ng-repeat="i in items">Scroll me! {{i}}</li>
     * </ul>
     * </pre>
     */

    angular.module('ajoslin.scrolly.directives', ['ajoslin.scrolly.scroller'])
        .directive('scrollyScroll', ['$scroller', '$document',
            function ($scroller, $document) {
                jqLite(document.body).bind('touchmove', function (e) {
                    e.preventDefault();
                });
                return {
                    restrict: 'A',
                    link: function (scope, elm, attrs) {
                        var scroller = new $scroller(elm);
                    }
                };
}]);

    /**
     * @ngdoc directive
     * @name ajoslin.scrolly.directive:scrollyDraggerIgnore
     * @restrict A
     *
     * @description
     * Makes it so this element and all of its children ignore any $dragger behavior. In other words, this element and children will behave like normal when dragged.
     */
    angular.module('ajoslin.scrolly.directives')
        .directive('scrollyDraggerIgnore', [

            function () {
                return {
                    restrict: 'A',
                    controller: noop // just so we can see if it exists, add a controller
                };
}]);


    angular.module('ajoslin.scrolly.desktop', [])

    .provider('$desktopScroller', [

        function () {

            var KEYS = {
                38: 150, //up arrow -> up
                40: -150, //down arrow -> down
                32: -600 //spacebar -> down
            };
            this.key = function (keyCode, delta) {
                if (arguments.length > 1) {
                    KEYS[keyCode] = delta;
                }
                return KEYS[keyCode];
            };

            var _mouseWheelDistanceMulti = 0.5;
            this.mouseWheelDistanceMulti = function (newMulti) {
                arguments.length && (_mouseWheelDistanceMulti = newMulti);
                return _mouseWheelDistanceMulti;
            };

            this.$get = ['$document',
                function ($document) {

                    $desktopScroller.mouseWheelDistanceMulti = _mouseWheelDistanceMulti;
                    $desktopScroller.easeTimeMulti = 0.66;

                    function $desktopScroller(elm, scroller) {
                        var self = {};

                        elm.bind('$destroy', function () {
                            $document.unbind('mousewheel', onMousewheel);
                            $document.unbind('keydown', onKey);
                        });
                        $document.bind('mousewheel', onMousewheel);
                        $document.bind('keydown', onKey);

                        function onMousewheel(e) {
                            var delta = e.wheelDeltaY * $desktopScroller.mouseWheelDistanceMulti;

                            if (!delta) {
                                return;
                            }

                            //Only go if the scroll is targeting this element
                            //We are on desktop when this is called, so we are less worried about performance
                            var target = jqLite(e.target);
                            while (target.length) {
                                if (target[0] === elm.parent()[0]) {
                                    scroll(delta);
                                    e.preventDefault();
                                    break;
                                }
                                target = target.parent();
                            }
                        }

                        function scroll(delta) {
                            scroller.calculateHeight();
                            var newPos = scroller.transformer.pos.y + delta;
                            scroller.transformer.setTo({
                                y: clamp(-scroller.scrollHeight, newPos, 0)
                            });
                        }

                        var INPUT_REGEX = /INPUT|TEXTAREA|SELECT/i;

                        function onKey(e) {
                            //Don't do key events if typing
                            if (document.activeElement && document.activeElement.tagName &&
                                document.activeElement.tagName.match(INPUT_REGEX)) {
                                return;
                            }

                            var delta = KEYS[e.keyCode || e.which];
                            if (delta) {
                                e.preventDefault();
                                if (scroller.transformer.changing) return;
                                scroller.calculateHeight();

                                var newPos = scroller.transformer.pos.y + delta;
                                newPos = clamp(-scroller.scrollHeight, newPos, 0);

                                if (newPos !== scroller.transformer.pos.y) {
                                    var newDelta = newPos - scroller.transformer.pos.y;
                                    var time = Math.abs(newDelta * $desktopScroller.easeTimeMulti);

                                    scroller.transformer.easeTo({
                                        y: newPos
                                    }, time);
                                }
                            }
                        }
                        return self;
                    }

                    function clamp(a, b, c) {
                        return Math.min(Math.max(a, b), c);
                    }

                    return $desktopScroller;
  }];
}]);


    /**
 * @ngdoc object
 * @name ajoslin.scrolly.$draggerProvider
 *
 * @description
  Used for configuring drag options.
 *
 */

    angular.module('ajoslin.scrolly.dragger', [])
        .provider('$dragger', [

            function () {

                /**
                 * @ngdoc method
                 * @name ajoslin.scrolly.$draggerProvider#shouldBlurOnTouch
                 * @methodOf ajoslin.scrolly.$draggerProvider
                 *
                 * @description
                 * Sets/gets whether any active element should be blurred when the user touches and starts dragging.
                 * If there is an active element and then the user does dragging, some
                 * major visual problems with the position of the cursor occur.
                 *
                 * Defaults to true.
                 *
                 * @param {boolean=} newShouldBlur Sets whether the active element should blur on touch.
                 * @returns {boolean} shouldBlurOnDrag Current should blur value.
                 */
                var _shouldBlurOnDrag = true;
                this.shouldBlurOnDrag = function (shouldBlur) {
                    arguments.length && (_shouldBlurOnDrag = !! shouldBlur);
                    return _shouldBlurOnDrag;
                };

                /**
                 * @ngdoc method
                 * @name ajoslin.scrolly.$draggerProvider#allowedDragAngle
                 * @methodOf ajoslin.scrolly.$draggerProvider
                 *
                 * @description
                 * Sets/gets the maximum allowed angle a user can drag from the vertical or horizontal axis
                 * for a drag to be counted as a vertical or horizontal drag.
                 *
                 * @param {number=} newAllowedDragAngle Sets the new allowed drag angle.
                 * @returns {number} allowedDragAngle Current allowed drag angle.
                 */
                var _allowedDragAngle = 40;
                this.allowedDragAngle = function (newDragAngle) {
                    arguments.length && (_allowedDragAngle = newDragAngle);
                    return _allowedDragAngle;
                };

                /**
                 * @ngdoc method
                 * @name ajoslin.scrolly.$draggerProvider#maxTimeMotionless
                 * @methodOf ajoslin.scrolly.$draggerProvider
                 *
                 * @description
                 * Sets/gets the maximum time a user can be motionless, in milliseconds, before
                 * the user is counted as 'not actively dragging' anymore.
                 *
                 * @param {number=} newTime Sets the maximum time, milliseconds.
                 * @returns {number} maxTimeMotionless The current maximum time motionless value.
                 */
                var _maxTimeMotionless = 300;
                this.maxTimeMotionless = function (newMaxTimeMotionless) {
                    arguments.length && (_maxTimeMotionless = newMaxTimeMotionless);
                    return _maxTimeMotionless;
                };


                this.$get = ['$window', '$document',
                    function ($window, $document) {

                        /**
                         * @ngdoc property
                         * @name ajoslin.scrolly.$dragger#DIRECTION_VERTICAL
                         * @propertyOf ajoslin.scrolly.$dragger
                         *
                         * @description A constant used to denote vertical (up and down) direction. Usually used when constructing a dragger and in dragger event data.
                         */
                        /**
                         * @ngdoc property
                         * @name ajoslin.scrolly.$dragger#DIRECTION_HORIZONTAL
                         * @propertyOf ajoslin.scrolly.$dragger
                         *
                         * @description A constant used to denote horizontal (left and right) direction. Usually used when constructing a dragger and in dragger event data.
                         */
                        /**
                         * @ngdoc property
                         * @name ajoslin.scrolly.$dragger#DIRECTION_ANY
                         * @propertyOf ajoslin.scrolly.$dragger
                         *
                         * @description A constant used to denote any direction. Usually used when constructing a dragger and in dragger event data.
                         */
                        var DIRECTION_VERTICAL = $dragger.DIRECTION_VERTICAL = 1;
                        var DIRECTION_HORIZONTAL = $dragger.DIRECTION_HORIZONTAL = 2;
                        var DIRECTION_ANY = $dragger.DIRECTION_ANY = 3;

                        /**
                         * @ngdoc object
                         * @name ajoslin.scrolly.$dragger
                         *
                         * @description
                         * A factory for creating drag-listeners on elements.
                         *
                         * @param {element} element Element to attach drag listeners to.
                         * @param {object=} options Options object. Able to have the following properties:
                         *  - **`mouse`** - {boolean=} - Whether to bind mouse events for this dragger. Default `true`.
                         *  - **`touch`** - {boolean=} - Whether to bind touch events for this dragger. Default `true`.
                         *  - **`stopPropagation**` - {boolean=} Whether to stop propagation of drag events. Default `false`.
                         *
                         * @returns {object} Newly created dragger object with the following properties:
                         *
                         *   - `{void}` `addListener({constant=} dragDirection, {function} callback)` - Adds a new drag listener with the specified callback. Default direction: DIRECTION_ANY.
                         *   - `{void}` `removeListener({constant=} dragDirection, {function} callback)` Removes the given callback from the list of listeners. Default direction: DIRECTION_ANY.
                         *   - Allowed directions are constants on $dragger: `$dragger.DIRECTION_HORIZONTAL`, `$dragger.DIRECTION_VERTICAL`, `$dragger.DIRECTION_ANY`.
                         *
                         * The `callback` given to addListener is called whenever a `start`,
                         * `move`, or `end` drag event happens.  An event will only be dispatched if the `dragDirection` given matches the direction of the drag, or if the `dragDirection` given is `DIRECTION_ANY`.
                         *
                         * The callback given to `addListener` takes the following parameters:
                         *
                         *   - **`dragType`** - {string} - 'start', 'move', or 'end'.
                         *   - **`dragData`** - {object} - Data pertaining to the drag event. Has the following properties:
                         *
                         *    * `{object}` `origin` - Where the drag started. Is a point, with number fields `x` and `y`.
                         *    * `{object}` `pos` - The current position of the drag.  Is a point, with number fields `x` and `y`.
                         *    * `{object}` `delta` - The change in position since the last event was fired.  Is a vector, with number fields `x`, `y`, and `magnitude`.
                         *    * `{object}` `distance` - The change in position since the start of the drag. Is a vector, with number fields `x`, `y`, and `magitude`.
                         *    * `{number}` `startedAt` - The timestamp of when the drag started.
                         *    * `{number}` `updatedAt` - The timestamp of when the drag was last updated.
                         *    * `{number}` `direction` - The direction of the drag. Could be any of the constants on $dragger: `DIRECTION_VERTICAL`, `DIRECTION_HORIZONTAL`, or `DIRECTION_ANY`. Not applicable for `start` events.
                         *    * `{boolean}` `stopped` - True if the user's pointer was motionless for awhile during the drag for greater time than maxTimeMotionless, and never started moving again.  Only applicable for 'end' events.
                         *
                         * ### Ignoring Drag
                         *
                         * To make an element and all its children ignore dragging, check out the {@link ajoslin.scrolly.directive:scrollyDraggerIgnore scrollyDraggerIgnore} directive.
                         *
                         * ## Example
                         *  <pre>
                         *  var dragger = new $dragger(element, $dragger.DIRECTION_VERTICAL);
                         *
                         *  dragger.addListener(function(dragType, dragData) {
                         *    switch(dragType) {
                         *      case 'start':
                         *        alert("We just started a drag at " + dragData.origin.x + ", " + dragData.origin.y + "!");
                         *        break;
                         *      case 'move':
                         *        alert("We have moved " + dragData.delta.magnitude + " since the last move.");
                         *        break;
                         *      case 'end':
                         *        alert("We just finished a drag, moving a total of " + dragData.distance.magnitude + "px");
                         *    }
                         *  });
                         *  </pre>
                         */

                        //Creates a dragger for an element
                        function $dragger(elm, options) {
                            options = extend({
                                mouse: true,
                                touch: true,
                                stopPropagation: false
                            }, options);

                            var self = {};
                            var raw = elm[0];
                            var listeners = {};
                            listeners[DIRECTION_VERTICAL] = [];
                            listeners[DIRECTION_HORIZONTAL] = [];
                            listeners[DIRECTION_ANY] = [];

                            var currentDragger = elm.data('$scrolly.dragger');
                            if (currentDragger) {
                                return currentDragger;
                            } else {
                                elm.data('$scrolly.dragger', self);
                            }

                            self.state = {};

                            self.addListener = function (direction, callback) {
                                if (arguments.length === 1) {
                                    callback = direction;
                                    direction = DIRECTION_ANY;
                                }
                                listeners[direction].push(callback || noop);
                            };

                            self.removeListener = function (direction, callback) {
                                if (arguments.length === 1) {
                                    callback = direction;
                                    direction = DIRECTION_ANY;
                                }
                                var callbacks = listeners[direction];
                                var index = callbacks && callbacks.indexOf(callback);
                                if (callbacks && index > -1) {
                                    callbacks.splice(index, 1);
                                }
                            };

                            if (options.touch) {
                                elm.bind('touchstart', dragStart);
                                elm.bind('touchmove', dragMove);
                                elm.bind('touchend touchcancel', dragEnd);
                            }
                            if (options.mouse) {
                                elm.bind('mousedown', dragStart);
                                elm.bind('mousemove', dragMove);
                                elm.bind('mouseup mouseout', dragEnd);
                            }

                            elm.bind('$destroy', function () {
                                delete listeners[DIRECTION_VERTICAL];
                                delete listeners[DIRECTION_HORIZONTAL];
                                delete listeners[DIRECTION_ANY];
                            });

                            function dragStart(e) {
                                e = e.originalEvent || e; //for jquery

                                var target = jqLite(e.target || e.srcElement);
                                //Ignore element or parents with scrolly-drag-ignore
                                if (target.controller('scrollyDraggerIgnore')) {
                                    return;
                                }

                                options.stopPropagation && e.stopPropagation();

                                var point = e.touches ? e.touches[0] : e;

                                //No drag on ignored elements
                                //This way of doing it is taken straight from snap.js
                                //Ignore this element if it's within a 'dragger-ignore' element

                                //Blur stuff on scroll if the option says we should
                                if (_shouldBlurOnDrag && isInput(target)) {
                                    document.activeElement && document.activeElement.blur();
                                }

                                self.state = startDragState({
                                    x: point.pageX,
                                    y: point.pageY
                                });

                                dispatchEvent('start', true);
                            }

                            function dragMove(e) {
                                e = e.originalEvent || e; //for jquery

                                if (self.state.active) {
                                    e.preventDefault();
                                    options.stopPropagation && e.stopPropagation();

                                    var point = e.touches ? e.touches[0] : e;
                                    point = {
                                        x: point.pageX,
                                        y: point.pageY
                                    };
                                    var timeSinceLastMove = Date.now() - self.state.updatedAt;

                                    //If the user moves and then stays motionless for enough time,
                                    //the user 'stopped'.  If he starts dragging again after stopping,
                                    //we pseudo-restart his drag.
                                    if (timeSinceLastMove > _maxTimeMotionless) {
                                        self.state = startDragState(point);
                                    }
                                    moveDragState(self.state, point);

                                    var deg = findDragDegrees(point, self.state.origin) % 180;
                                    if (deg < 90 + _allowedDragAngle && deg > 90 - _allowedDragAngle) {
                                        self.state.direction = DIRECTION_VERTICAL;
                                    } else if (deg < _allowedDragAngle && deg > -_allowedDragAngle) {
                                        self.state.direction = DIRECTION_HORIZONTAL;
                                    } else {
                                        self.state.direction = DIRECTION_ANY;
                                    }

                                    dispatchEvent('move');
                                }
                            }

                            function dragEnd(e) {

                                if (self.state.active) {
                                    e = e.originalEvent || e; // for jquery
                                    options.stopPropagation && e.stopPropagation();

                                    self.state.updatedAt = Date.now();
                                    self.state.stopped = (self.state.updatedAt - self.state.startedAt) > _maxTimeMotionless;

                                    dispatchEvent('end', true);
                                    self.state = {};
                                }
                            }

                            function dispatchEvent(eventType, force) {
                                var data = copy(self.state); // don't want to give them exact same data
                                forEach(listeners, function (callbacks, listenerDirection) {
                                    /* jshint eqeqeq: false */
                                    if (force || !data.direction || data.direction == listenerDirection ||
                                        listenerDirection == DIRECTION_ANY) {
                                        forEach(callbacks, function (cb) {
                                            cb(eventType, data);
                                        });
                                    }
                                });
                            }

                            function findDragDegrees(point2, point1) {
                                var theta = Math.atan2(-(point1.y - point2.y), point1.x - point2.x);
                                if (theta < 0) {
                                    theta += 2 * Math.PI;
                                }
                                var degrees = Math.floor(theta * (180 / Math.PI) - 180);
                                if (degrees < 0 && degrees > -180) {
                                    degrees = 360 - Math.abs(degrees);
                                }
                                return Math.abs(degrees);
                            }

                            //Restarts the drag at the given position
                            function startDragState(point) {
                                return {
                                    origin: {
                                        x: point.x,
                                        y: point.y
                                    },
                                    pos: {
                                        x: point.x,
                                        y: point.y
                                    },
                                    distance: {
                                        x: 0,
                                        y: 0,
                                        magnitude: 0
                                    },
                                    delta: {
                                        x: 0,
                                        y: 0,
                                        magnitude: 0
                                    },

                                    startedAt: Date.now(),
                                    updatedAt: Date.now(),

                                    stopped: false,
                                    active: true
                                };
                            }

                            function moveDragState(state, point) {
                                state.delta = distanceBetween(point, state.pos);
                                state.distance = distanceBetween(point, state.origin);
                                state.pos = {
                                    x: point.x,
                                    y: point.y
                                };
                                state.updatedAt = Date.now();
                            }

                            function distanceBetween(p2, p1) {
                                var dist = {
                                    x: p2.x - p1.x,
                                    y: p2.y - p1.y
                                };
                                dist.magnitude = Math.sqrt(dist.x * dist.x + dist.y * dist.y);
                                return dist;
                            }

                            function isInput(raw) {
                                return raw && (raw.tagName === "INPUT" ||
                                    raw.tagName === "SELECT" ||
                                    raw.tagName === "TEXTAREA");
                            }

                            return self;
                        }

                        return $dragger;

  }];
}]);


    /**
     * @ngdoc object
     * @name ajoslin.scrolly.$scrollerProvider
     *
     * @description
     * Used for configuring scroll options.
     */

    angular.module('ajoslin.scrolly.scroller', [
  'ajoslin.scrolly.dragger',
  'ajoslin.scrolly.transformer',
  'ajoslin.scrolly.desktop'
])
        .provider('$scroller', [

            function () {

                var _decelerationRate = 0.001;
                this.decelerationRate = function (newDecelerationRate) {
                    arguments.length && (_decelerationRate = newDecelerationRate);
                    return _decelerationRate;
                };

                /**
                 * @ngdoc method
                 * @name ajoslin.scrolly.$scrollerProvider#supportDesktop
                 * @methodOf ajoslin.scrolly.$scrollerProvider
                 *
                 * @description
                 * Sets/gets whether the scroller should support desktop events (mousewheel,
                 * arrow keys, etc).  Default true.
                 *
                 * @param {boolean=} newSupport New value to set for desktop support.
                 * @returns {boolean} support Current desktop support.
                 */
                var _supportDesktop = true;
                this.supportDesktop = function (newSupport) {
                    _supportDesktop = !! newSupport;
                    return _supportDesktop;
                };

                /**
                 * @ngdoc method
                 * @name ajoslin.scrolly.$scrollerProvider#pastBoundaryScrollRate
                 * @methodOf ajoslin.scrolly.$scrollerProvider
                 *
                 * @description
                 * Sets/gets the rate scrolling should go when the user goes past the boundary.
                 * In other words, if the user is at the top of the list and tries to scroll up
                 * some more, he will only be able to scroll at half the rate by default.  This option changes
                 * that rate.
                 *
                 * @param {number=} newRate The new pastBoundaryScrollRate to set.
                 * @returns {number} pastBoundaryScrollRate The current scroll rate.
                 */
                var _pastBoundaryScrollRate = 0.5;
                this.pastBoundaryScrollRate = function (newRate) {
                    arguments.length && (_pastBoundaryScrollRate = newRate);
                    return _pastBoundaryScrollRate;
                };

                /**
                 * @ngdoc method
                 * @name ajoslin.scrolly.$scrollerProvider#minDistanceForAcceleration
                 * @methodOf ajoslin.scrolly.$scrollerProvider
                 *
                 * @description
                 * Sets/gets the minimum distance the user needs to scroll for acceleration to happen when
                 * he/she lifts his/her finger.
                 *
                 * @param {number=} newRate The new minDistanceForAcceleration to set.
                 * @returns {number} minDistanceForAcceleration The current minimum scroll distance.
                 */
                var _minDistanceForAcceleration = 10;
                this.minDistanceForAcceleration = function (newMinScrollDistance) {
                    arguments.length && (_minDistanceForAcceleration = newMinScrollDistance);
                    return _minDistanceForAcceleration;
                };

                /**
                 * @ngdoc method
                 * @name ajoslin.scrolly.$scrollerProvider#bounceBuffer
                 * @methodOf ajoslin.scrolly.$scrollerProvider
                 *
                 * @description
                 * Sets/gets the buffer allowed for the scroll to 'bounce' past the actual
                 * content area.  Set this to 0 to effectively disable bouncing.
                 *
                 * @param {number=} newBounceBuffer The new bounce buffer to set.
                 * @returns {number} bounceBuffer The current bounce buffer.
                 */
                var _bounceBuffer = 40;
                this.bounceBuffer = function (newBounceBuffer) {
                    arguments.length && (_bounceBuffer = newBounceBuffer);
                    return _bounceBuffer;
                };


                /**
                 * @ngdoc method
                 * @name ajoslin.scrolly.$scrollerProvider#bounceBackMinTime
                 * @methodOf ajoslin.scrolly.$scrollerProvider
                 *
                 * @description
                 * See {@link ajoslin.scrolly.$scrollerProvider#bounceBackDistanceMulti bounceBackDistanceMulti}.
                 *
                 * @param {number=} newTime The new bounce back minimum time to set.
                 * @returns {number} bounceBackMinTime The current bounce back minimum time.
                 */

                /**
                 * @ngdoc method
                 * @name ajoslin.scrolly.$scrollerProvider#bounceBackDistanceMulti
                 * @methodOf ajoslin.scrolly.$scrollerProvider
                 *
                 * @description
                 * When the user scrolls past the content area into the bounce buffer,
                 * we need to bounce back.  To decide how long the bounce back animation will
                 * take, there are two factors: a minimum time, in milliseconds, and a
                 * distance multiplier.
                 *
                 * The equation for deciding how much time the animation to bounce back to
                 * the main content area should take, we do the following:
                 *
                 * <pre>
                 * function getBounceTime(distancePastContent) {
                 *   return bounceBackMinTime + distancePastContent * bounceBackDistanceMulti;
                 * }
                 * </pre>
                 *
                 * This makes it so the farther away the user has scrolled from the content
                 * area, the longer the animation to bring the content back into view will
                 * take. The minimum time exists so even short distances still take a little
                 * bit of time.
                 *
                 * @param {number=} newDistanceMulti The new bounce back distance multiplier.
                 * @returns {number} bounceBackDistanceMulti The current bounce back distance multiplier.
                 */

                var _bounceBackMinTime = 200;
                var _bounceBackDistanceMulti = 1.5;

                this.bounceBackMinTime = function (newBounceBackMinTime) {
                    arguments.length && (_bounceBackMinTime = newBounceBackMinTime);
                    return _bounceBackMinTime;
                };
                this.bounceBackDistanceMulti = function (newBounceBackDistanceMult) {
                    arguments.length && (_bounceBackDistanceMulti = newBounceBackDistanceMult);
                    return _bounceBackDistanceMulti;
                };

                //Quicker than Math.floor
                //http://jsperf.com/math-floor-vs-math-round-vs-parseint/69
                function floor(n) {
                    return n | 0;
                }

                this.$get = ['$dragger', '$transformer', '$window', '$document', '$desktopScroller',
                    function ($dragger, $transformer, $window, $document, $desktopScroller) {

                        $scroller.getContentRect = function (raw) {
                            var style = window.getComputedStyle(raw);
                            var offTop = parseInt(style.getPropertyValue('margin-top'), 10) +
                                parseInt(style.getPropertyValue('padding-top'), 10);
                            var offBottom = parseInt(style.getPropertyValue('margin-bottom'), 10) +
                                parseInt(style.getPropertyValue('padding-bottom'), 10);

                            var top = parseInt(style.getPropertyValue('top'), 10);
                            var bottom = parseInt(style.getPropertyValue('bottom'), 10);

                            var height = parseInt(style.getPropertyValue('height'), 10);
                            return {
                                top: offTop + (isNaN(top) ? 0 : top),
                                bottom: offBottom + (isNaN(bottom) ? 0 : bottom),
                                height: height
                            };
                        };


                        function bounceTime(howMuchOut) {
                            return Math.abs(howMuchOut) * _bounceBackDistanceMulti +
                                _bounceBackMinTime;
                        }

                        /**
                         * @ngdoc object
                         * @name ajoslin.scrolly.$scroller
                         *
                         * @description
                         * A factory for creating a scroll-manipulator on an element. Once called
                         * on an element, it will listen to drag events and use those to change
                         * the element's transform appropriately to simulate scrolling.
                         * Intended to look as close as possible to native iOS scrolling.
                         *
                         * @param {element} element Element to attach scroller to.
                         * @returns {object} Newly created scroller object.
                         *
                         */

                        function $scroller(elm) {
                            var self = {};
                            var currentScroller = elm.data('$scrolly.scroller');
                            if (currentScroller) {
                                return currentScroller;
                            } else {
                                elm.data('$scrolly.scroller', self);
                            }

                            var raw = elm[0];
                            var transformer = self.transformer = new $transformer(elm);
                            var dragger = self.dragger = new $dragger(elm, {
                                touch: true,
                                mouse: false
                            });
                            if (_supportDesktop) {
                                var desktopScroller = new $desktopScroller(elm, self);
                            }
                            dragger.addListener($dragger.DIRECTION_VERTICAL, dragListener);
                            elm.bind('$destroy', function () {
                                dragger.removeListener($dragger.DIRECTION_VERTICAL, dragListener);
                            });

                            self.calculateHeight = function () {
                                var rect = $scroller.getContentRect(raw);
                                //TODO find a better way to get the height of the wrapper/screen
                                var screenHeight = $window.innerHeight;
                                //If our content doesn't fill the whole area, just act like it's
                                //exactly one screen tall for scrolling purposes
                                if (rect.height < screenHeight) {
                                    self.scrollHeight = 0;
                                } else {
                                    self.scrollHeight = rect.height - screenHeight + rect.top + rect.bottom;
                                }
                                return self.scrollHeight;
                            };
                            self.calculateHeight();

                            self.outOfBounds = function (pos) {
                                if (pos > 0) return pos;
                                if (pos < -self.scrollHeight) return pos + self.scrollHeight;
                                return false;
                            };

                            function dragListener(eventType, data) {
                                switch (eventType) {
                                case 'start':
                                    if (transformer.changing) {
                                        transformer.stop();
                                    }
                                    self.calculateHeight();
                                    break;

                                case 'move':
                                    var newPos = transformer.pos.y + data.delta.y;
                                    //If going past boundaries, scroll at half speed
                                    //TODO make the 0.5 a provider option
                                    if (self.outOfBounds(newPos)) {
                                        newPos = transformer.pos.y + floor(data.delta.y * 0.5);
                                    }
                                    transformer.setTo({
                                        y: newPos
                                    });
                                    break;

                                case 'end':
                                    //If we're out of bounds, or held on to our spot for too long,
                                    //no momentum.  Just check that we're in bounds.
                                    if (self.outOfBounds(transformer.pos.y) || data.stopped) {
                                        self.checkBoundaries();
                                    } else if (Math.abs(data.distance.y) >= _minDistanceForAcceleration) {
                                        var momentum = self.momentum(data);
                                        if (momentum.position !== transformer.pos.y) {
                                            transformer.easeTo({
                                                    y: momentum.position
                                                },
                                                momentum.time,
                                                self.checkBoundaries
                                            );
                                        }
                                    }
                                    break;
                                }
                            }
                            self.checkBoundaries = function () {
                                self.calculateHeight();

                                var howMuchOut = self.outOfBounds(transformer.pos.y);
                                if (howMuchOut) {
                                    var newPosition = howMuchOut > 0 ? 0 : -self.scrollHeight;
                                    transformer.easeTo({
                                        y: newPosition
                                    }, bounceTime(howMuchOut));
                                }
                            };
                            self.momentum = function (dragData) {
                                self.calculateHeight();

                                var speed = Math.abs(dragData.distance.y) / (dragData.updatedAt - dragData.startedAt);
                                var newPos = transformer.pos.y + (speed * speed) /
                                    (2 * _decelerationRate) *
                                    (dragData.distance.y < 0 ? -1 : 1);
                                var time = speed / _decelerationRate;

                                var howMuchOver = self.outOfBounds(newPos);
                                var distance;
                                if (howMuchOver) {
                                    if (howMuchOver > 0) {
                                        newPos = Math.min(howMuchOver, _bounceBuffer);
                                    } else if (howMuchOver < 0) {
                                        newPos = Math.max(newPos, -(self.scrollHeight + _bounceBuffer));
                                    }
                                    distance = Math.abs(newPos - transformer.pos.y);
                                    time = distance / speed;
                                }
                                return {
                                    position: newPos,
                                    time: floor(time)
                                };
                            };

                            return self;
                        }

                        return $scroller;
  }];

}]);


    /**
     * @ngdoc object
     * @name ajoslin.scrolly.$transformerProvider
     *
     * @description
     * Used for configuring transformer options.
     */
    angular.module('ajoslin.scrolly.transformer', [])

    /**
     * @ngdoc object
     * @name ajoslin.scrolly.$nextFrame
     *
     * @description
     * A service to wrap {@link https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame window.requestAnimationFrame}, or a fallback if it is not available.
     *
     * The main reason this is in a service is for ease of mocking it during tests.
     *
     * @param {function} callback Callback to call when the DOM has redrawn - when the next frame is ready.
     * @returns {number} `requestId` Unique id identifying this request, to be passed to {@link https://developer.mozilla.org/en-US/docs/Web/API/window.cancelAnimationFrame window.cancelAnimationFrame}.
     */

    .factory('$nextFrame', ['$window',
        function ($window) {
            //Polyfill for requestAnimationFrame
            return $window.requestAnimationFrame ||
                $window.webkitRequestAnimationFrame ||
                $window.mozRequestAnimationFrame ||
                function fallback(cb) {
                    return $window.setTimeout(cb, 17);
            };
}])

    .provider('$transformer', [

        function () {

            /**
             * @ngdoc method
             * @name ajoslin.scrolly.$transformerProvider#timingFunction
             * @methodOf ajoslin.scrolly.$transformerProvider
             *
             * @description
             * Sets/gets the CSS timing function used for transform-transitions. For example "ease-in-out".
             *
             * @param {string=} newTimingFunction The CSS timing function to be used.
             * @returns {string} timingFunction The current CSS timing function.
             */
            var timingFunction = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            this.timingFunction = function (newTimingFunction) {
                arguments.length && (timingFunction = newTimingFunction);
                return timingFunction;
            };

            this.$get = ['$window', '$nextFrame', '$sniffer', '$document',
                function ($window, $nextFrame, $sniffer, $document) {
                    //TODO remove this fix when angular-1.2 comes out
                    //Fixes a known bug with android $sniffer in angular-1.1.x
                    if (!$sniffer.vendorPrefix) {
                        if (isString($document[0].body.style.webkitTransition)) {
                            $sniffer.vendorPrefix = 'webkit';
                        }
                    }

                    var prefix = $sniffer.vendorPrefix;
                    //ie10, older webkit - expects lowercase. firefox, opera - uppercase
                    if (prefix && prefix !== 'Moz' && prefix !== 'O') {
                        prefix = prefix.substring(0, 1).toLowerCase() + prefix.substring(1);
                    }
                    var transformProp = prefix ? (prefix + 'Transform') : 'transform';
                    var transformPropDash = prefix ? ('-' + prefix.toLowerCase() + '-transform') : 'transform';
                    var transitionProp = prefix ? (prefix + 'Transition') : 'transition';
                    var transitionEndProp = prefix ? (prefix + 'TransitionEnd') : 'transitionend';

                    /**
                     * @ngdoc object
                     * @name ajoslin.scrolly.$transformer
                     *
                     * @description
                     * A factory for creating a transformation-manipulator on an element.  It manipulates the transform of an element vertically, allowing you to set, get, and animate the given element's transform.
                     *
                     * @param {element} element Element to manipulate the transformation of.
                     * @returns {object} Newly created transformer object with the following properties:
                     *
                     *   - `{object}` `pos` - A point giving the current x and y transform of the element.  Is an object with number fields `x` and `y`.
                     *   - `{void}` `setTo({object} point)` - Sets the current transform to the given x and y position. Expects point object with fields `x` and/or `y`. If only `x` or `y` is given, it will only set that field. For example, `transformer.setTo({x: 33})` will only change the current x-position.
                     *   - `{void}` `easeTo({object} point, {number} time, {function=} done)` - Eases to the given position in `time` milliseconds. If given, the `done` callback will be called when the transition ends. Expects point object with fields `x` and `y`.
                     *   - `{void}` `stop({function=} done)` - Stops any current animation. If given, the `done` function will be called when the stop is done (after the next frame).
                     *   - `{void}` `clear()` - Clears out any transform or transition styles currently set on the element by this transformer.
                     *
                     */

                    function transitionString(transitionTime) {
                        return transformPropDash + ' ' + transitionTime + 'ms ' + timingFunction;
                    }

                    function transformString(x, y) {
                        return 'translate3d(' + (x || 0) + 'px,' + (y || 0) + 'px,0)';
                    }

                    //Creates a transformer for an element
                    function $transformer(elm) {
                        var self = {};
                        var raw = elm[0];
                        var currentTransformer = elm.data('$scrolly.transformer');
                        if (currentTransformer) {
                            return currentTransformer;
                        } else {
                            elm.data('$scrolly.transformer', self);
                        }

                        elm.bind('$destroy', function () {
                            self.pos = null;
                            changingDoneCallback = null;
                        });

                        self.pos = {
                            x: 0,
                            y: 0
                        };

                        //Gets the current x and y transform of the element
                        self.updatePosition = function () {
                            var style = $window.getComputedStyle(elm[0]);
                            var matrix = (style[transformProp] || '')
                                .replace(/[^0-9-.,]/g, '')
                                .split(',');
                            if (matrix.length > 1) {
                                self.pos.x = parseInt(matrix[4], 10);
                                self.pos.y = parseInt(matrix[5], 10);
                            }
                            return self.pos;
                        };
                        self.updatePosition();

                        var changingDoneCallback;
                        elm.bind(transitionEndProp, onTransitionEnd);

                        function onTransitionEnd() {
                            if (self.changing) {
                                self.stop(changingDoneCallback);
                            }
                        }

                        self.stop = function (done) {
                            //Stop transitions, and set self.pos to wherever we were.
                            raw.style[transitionProp] = '';
                            self.updatePosition();
                            self.changing = false;

                            //On next frame, set our element's position - this wait is so the
                            //transition style on the element has time to 'remove' itself
                            $nextFrame(function () {
                                self.setTo(self.pos);
                                (done || noop)();
                            });
                        };

                        self.easeTo = function (pos, transitionTime, done) {
                            if (!angular.isNumber(transitionTime) || transitionTime < 0) {
                                throw new Error("Expected a positive number for time, got '" +
                                    transitionTime + "'.");
                            }
                            //If we're currently animating, we need to stop before we try to
                            //animate differently.
                            if (self.changing) {
                                self.stop(doTransition);
                            } else {
                                doTransition();
                            }

                            function doTransition() {
                                elm.css(transitionProp, transitionString(transitionTime));

                                self.changing = true;
                                changingDoneCallback = done;

                                //On next frame, start transition - this wait is so the transition
                                //style on the element has time to 'apply' itself before the elm's
                                //position is set
                                $nextFrame(function () {
                                    self.setTo(pos);
                                });
                            }
                        };

                        //Allow setting with setTo(x,y) or setTo({x:x, y:y})
                        self.setTo = function (pos) {
                            isDefined(pos.x) && (self.pos.x = pos.x);
                            isDefined(pos.y) && (self.pos.y = pos.y);
                            elm.css(transformProp, transformString(self.pos.x, self.pos.y));
                        };

                        self.clear = function () {
                            elm.css(transformProp, '');
                            elm.css(transitionProp, '');
                        };

                        return self;
                    }

                    /**
                     * @ngdoc property
                     * @name ajoslin.scrolly.$transformer#transformProp
                     * @propertyOf ajoslin.scrolly.$transformer
                     *
                     * @description {string} The property used for element transformations.  For example "webkitTransform".
                     */
                    $transformer.transformProp = transformProp;

                    /**
                     * @ngdoc property
                     * @name ajoslin.scrolly.$transformer#transformPropDash
                     * @propertyOf ajoslin.scrolly.$transformer
                     *
                     * @description {string} The property used for element transformations, "dashed version". For example "-webkit-transform".
                     */

                    $transformer.transformPropDash = transformPropDash;
                    /**
                     * @ngdoc property
                     * @name ajoslin.scrolly.$transformer#transitionProp
                     * @propertyOf ajoslin.scrolly.$transformer
                     *
                     * @description {string} The property used for element transitions.  For example "webkitTransition".
                     */
                    $transformer.transitionProp = transitionProp;

                    /**
                     * @ngdoc property
                     * @name ajoslin.scrolly.$transformer#transitionEndProp
                     * @propertyOf ajoslin.scrolly.$transformer
                     *
                     * @description {string} The property used for binding element transitionEnd. For example "webkitTransitionEnd".
                     */
                    $transformer.transitionEndProp = transitionEndProp;

                    return $transformer;

  }];
}]);

}());
angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
.factory('$position', ['$document', '$window',
    function ($document, $window) {

        function getStyle(el, cssprop) {
            if (el.currentStyle) { //IE
                return el.currentStyle[cssprop];
            } else if ($window.getComputedStyle) {
                return $window.getComputedStyle(el)[cssprop];
            }
            // finally try and get inline style
            return el.style[cssprop];
        }

        /**
         * Checks if a given element is statically positioned
         * @param element - raw DOM element
         */
        function isStaticPositioned(element) {
            return (getStyle(element, "position") || 'static') === 'static';
        }

        /**
         * returns the closest, non-statically positioned parentOffset of a given element
         * @param element
         */
        var parentOffsetEl = function (element) {
            var docDomEl = $document[0];
            var offsetParent = element.offsetParent || docDomEl;
            while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
                offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || docDomEl;
        };

        return {
            /**
             * Provides read-only equivalent of jQuery's position function:
             * http://api.jquery.com/position/
             */
            position: function (element) {
                var elBCR = this.offset(element);
                var offsetParentBCR = {
                    top: 0,
                    left: 0
                };
                var offsetParentEl = parentOffsetEl(element[0]);
                if (offsetParentEl != $document[0]) {
                    offsetParentBCR = this.offset(angular.element(offsetParentEl));
                    offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
                    offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
                }

                var boundingClientRect = element[0].getBoundingClientRect();
                return {
                    width: boundingClientRect.width || element.prop('offsetWidth'),
                    height: boundingClientRect.height || element.prop('offsetHeight'),
                    top: elBCR.top - offsetParentBCR.top,
                    left: elBCR.left - offsetParentBCR.left
                };
            },

            /**
             * Provides read-only equivalent of jQuery's offset function:
             * http://api.jquery.com/offset/
             */
            offset: function (element) {
                var boundingClientRect = element[0].getBoundingClientRect();
                return {
                    width: boundingClientRect.width || element.prop('offsetWidth'),
                    height: boundingClientRect.height || element.prop('offsetHeight'),
                    top: boundingClientRect.top + ($window.pageYOffset || $document[0].body.scrollTop || $document[0].documentElement.scrollTop),
                    left: boundingClientRect.left + ($window.pageXOffset || $document[0].body.scrollLeft || $document[0].documentElement.scrollLeft)
                };
            }
        };
  }]);
