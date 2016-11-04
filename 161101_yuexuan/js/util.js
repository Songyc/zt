var util = {
	// 方法extend将参数defaults和参数opt合并，并且支持多个参数合并。如果最后一个参数为布尔true，支持深度拷贝。参数defaults为默认对象, 参数opt是被合并对象。
	extend: function (target, src) {
		var args = Array.prototype.slice.call(arguments),
			len = args.length,
			deep, applyParam = [target];

		if(len === 1) {
			return target;
		}
		// 如果最后的参数是布尔值，则从参数数组args中删除。设置为数组applyParam的第三个元素
		if(typeof (deep = args[len - 1]) === 'boolean') {
			args.pop();
			applyParam[2] = deep;			
		}
		// 参数数组args删除目标对象，此时args中剩下只有源对象(被合并的对象)，获取源对象的个数
		args.shift();
		len = args.length;

		if(len > 1) {		// 如果源对象个数大于1, 遍历args，将源对象设置为数组applyParam的第二个元素，再次调用this.extend(target, src, deep);
			for(var i = 0; i < len; i++) { 		 	
				applyParam[1] = args[i];
				this.extend.apply(null, applyParam); 
			}
		}else {
			for(var key in src) { 			// 遍历源对象src, 检测它的自定义属性key。如果deep为true，表示支持拷贝对象最底层的属性值，并且key值为对象，调用this.extend(target, src, deep)方法。否则将源对象属性/值深度拷贝到目标对象上。
				if(src.hasOwnProperty(key)) {
					if(deep === true && Object.prototype.toString.call(src[key]) === '[object Object]') {
						this.extend(target, src[key], true);
					}else {
						target[key] = src[key];
					}
				}
			}
		}
		return target;
	},

	createIntervalAnimationObject: function () {
        var intervalAnimation = window.__intervalAnimation;

        if(!intervalAnimation) {
            intervalAnimation = window.__intervalAnimation = {
                uuid: 0,
                cache: {}
            };
        }

        return intervalAnimation;
    },

    intervalAnimation: function (selector, speed) {
        var intervalAnimation = this.createIntervalAnimationObject(),
            cache = intervalAnimation.cache, uuid, selectorCache,
            elems = selector;

        if(selector === undefined) {
            selector = '.interval-animation';
        }

        if(typeof selector === 'string') {
            elems = $(selector);
        }

        if(selector.nodeType === 1) {
            elems = [selector];
        }

        for(var i = 0, l = elems.length; i < l; i++) {

            uuid = elems[i].__intervalAnimationUuid;

            if(!uuid) {
                elems[i].__intervalAnimationUuid = uuid = ++intervalAnimation.uuid;
            }

            selectorCache = cache[uuid];

            if(!selectorCache) {
                cache[uuid] = selectorCache = {};
            }

            selectorCache.elem = elems[i];
            
            (function (i) {

                var children = elems[i].children,
                    firstChild = children.item(0);

                if(children.length == 1) {
                    var div = document.createElement('div');
                    elems[i].appendChild(div);
                }

                children = elems[i].children;

                if(!~firstChild.className.indexOf('cur')) {
                    firstChild.className += ' cur';
                }

                var index = 0,
                    timer, cur, item,
                    timerList;

                selectorCache.index = i;

                timerList = selectorCache.timer;

                if(!timerList) {
                    selectorCache.timerList = timerList = [];
                }

                timer = setInterval(function() {
                    cur = $(elems[i]).find('.cur');
                    item = $(children.item(++index) || children.item(index = 0));

                    cur.removeClass('cur');
                    item.addClass('cur');
                }, speed || 500);

                timerList.push(timer);

            })(i);
        }
    },

    cleanIntervalAnimation: function (selector) {
        var intervalAnimation = this.createIntervalAnimationObject(),
            cache = intervalAnimation.cache, uuid, selectorCache,
            elems;

        function cleanSelectorInterval(selectorCache) {
            if(!selectorCache) {
                return;
            }

            var timerList = selectorCache.timerList,
                timer;

            timer = timerList[timerList.length - 1];
            clearInterval(timer);

            var parent = selectorCache.elem,
                children = parent.children,
                firstChild = children.item(0);

            for(var j = 0, m = children.length; j < m; j++) {
                $(children[j]).removeClass('cur');
            }

            $(firstChild).addClass('cur');
        }

        if(selector === undefined) {
            for(var key in cache) {
                selectorCache = cache[key];

                cleanSelectorInterval(selectorCache);
            }
            return;
        }

        elems = selector;

        if(typeof selector === 'string') {
            elems = $(selector);
        }

        if(selector.nodeType === 1) {
            elems = [selector];
        }

        for(var i = 0, l = elems.length; i < l; i++) {
            uuid = elems[i].__intervalAnimationUuid;

            selectorCache = cache[uuid];

            cleanSelectorInterval(selectorCache);
        }
    },

    cacheIndex: 1,

    route: function (index) {
        if(typeof index === 'string') {
            index = parseInt(index, 10);
        }

        var page = document.querySelector(".page" + index),
            cachePage = document.querySelector(".page" + this.cacheIndex);

        page.classList.add('cur');
        cachePage.classList.remove('cur');

        this.cacheIndex = index;
    },

    nextPage: function () {
        this.route(this.cacheIndex + 1);
    },

    openMasker: function () {
        var masker = document.querySelector(".masker"),
            self = this;

        masker.classList.add("cur");
        this.intervalAnimation(".masker .interval-animation", 500);

        var index = this.count(null, null, true);
        console.log(index);

        setTimeout(function () {
            self.closeMasker();
            self.nextPage();
            self.showResult(index);
        }, 4000);
    },

    closeMasker: function () {
        var masker = document.querySelector(".masker");
        masker.classList.remove("cur");
        this.cleanIntervalAnimation(".masker .interval-animation");
    },
    
    age: function (self) {
        $(self).parents("li").siblings(".cur").removeClass("cur");
        $(self).parents("li").addClass("cur");
    },

    count: (function () {
        var arr = [];
        return function (index, prop, isCount) {
            var map = {
                a: 0,
                b: 1, 
                c: 2
            },
            res = {};

            if(prop != null) {
                arr[index] = prop;
            }

            if(isCount && arr.length === 6) {
                arr = arr.sort();
                console.log(arr);
                for (var i = 0, l = arr.length; i < l; i++) {
                    if (!res[arr[i]]) {
                        res[arr[i]] = 1;
                    }else {
                        res[arr[i]]++;
                    }
                }

                for(var key in res) {
                    if(res[key] >= 3) {
                        return map[key];
                    }
                }

                return map['a'];
            }
        }
    })(),

    showResult: function (index) {
        var result = document.querySelector(".page12 .result"),
            resultLi = result.querySelectorAll(".result li"),
            curLi = resultLi.item(index),
            btn = curLi.querySelector(".btn");

        result.classList.add("cur");
        curLi.classList.add("cur");

        $(btn).click(function () {
            $(this).parents(".result").removeClass("cur");
            util.showFashion(index);
        });
    },

    showFashion: function (index) {
        var fashion = document.querySelector(".page12 .fashion"),
            fashionLi = fashion.querySelectorAll(".fashion li"),
            curLi = fashionLi.item(index),
            btn = curLi.querySelector(".btn");

        $(btn).click(function () {
            $(this).parents(".fashion").removeClass("cur");
            util.nextPage();
        });
    }
}