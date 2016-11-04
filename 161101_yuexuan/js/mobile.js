(function(window, undefined) {

	var doc = window.document;

	"Width Height".split(" ").forEach(function (item ,i) {
		doc.body.style[item.toLowerCase()] = doc.documentElement["client" + item] + "px";
	});

	var config = {
		wraperImgs: document.querySelectorAll(".m-item1, .m-item2"),
		stayHere: false,
		lastTime: 0,
		process: function (options) { 				// ���ѡ��û��process, ��Ĭ��Ϊÿ������һ��ͼ��������صİٷֱȣ�����ʾ���� 	
			var length = options.srcs.length,
				percent = Math.ceil((options.loadingCount / length) * 100),
				loadingData = doc.querySelector(".loading-data"),
				loadingProcess = doc.querySelector(".loading-process");

			if(loadingData) {
				loadingData.innerHTML = percent + "%";
			}

			if(loadingProcess) {
				loadingProcess.style.width = percent + "%";
			}
		},
		
		src: "music.mp3",
		autoplay: true,

		useReset: true,
		usePreload: true,
		useMusic: true,
		useWeixin: true,
		useMasker: true,
		useSwiper: true,
		useCountScore: true,

		open: ".open",
		close: ".close",
		masker: ".masker",
		countScore: ".score",
		swiperSlide: ".m-item",

		make: false,
		console: true,
		page: {}
	}

	function empty() {}

	var fn = {
		// ����extend������defaults�Ͳ���opt�ϲ�������֧�ֶ�������ϲ���������һ������Ϊ����true��֧����ȿ���������defaultsΪĬ�϶���, ����opt�Ǳ��ϲ�����
		extend: function (target, src) {
			var args = Array.prototype.slice.call(arguments),
				len = args.length,
				deep, applyParam = [target];

			if(len === 1) {
				return target;
			}
			// ������Ĳ����ǲ���ֵ����Ӳ�������args��ɾ��������Ϊ����applyParam�ĵ�����Ԫ��
			if(typeof (deep = args[len - 1]) === 'boolean') {
				args.pop();
				applyParam[2] = deep;			
			}
			// ��������argsɾ��Ŀ����󣬴�ʱargs��ʣ��ֻ��Դ����(���ϲ��Ķ���)����ȡԴ����ĸ���
			args.shift();
			len = args.length;

			if(len > 1) {		// ���Դ�����������1, ����args����Դ��������Ϊ����applyParam�ĵڶ���Ԫ�أ��ٴε���this.extend(target, src, deep);
				for(var i = 0; i < len; i++) { 		 	
					applyParam[1] = args[i];
					this.extend.apply(null, applyParam); 
				}
			}else {
				for(var key in src) { 			// ����Դ����src, ��������Զ�������key�����deepΪtrue����ʾ֧�ֿ���������ײ������ֵ������keyֵΪ���󣬵���this.extend(target, src, deep)����������Դ��������/ֵ��ȿ�����Ŀ������ϡ�
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

		cacheActiveIndex: -1,

		getPage: function (selelctor) {
			return  doc.querySelector(selelctor);
		},

		mapPage: function (options) {
			var index,
	            resetIndex = this.cacheActiveIndex,
	            page = body.config.page,
	           	value, resetValue;

	        if(!options.useSwiper) {
	        	index = 0;
	        }else {
	        	index = swiper.activeIndex
	        }

	        this.cacheActiveIndex = index;

		    for(var key in page) {
		    	if(parseFloat(page[key].key) === index) {
		    		value = page[key];
		    	}
		    }

	        if(value && value.init) {
	 			value.init();

	 			if(body.config.console) {
		        	console.log('init page' + index);
	 			}
	        }

	        if(!body.config.useReset) {
	        	return;
	        }

	        for(var key in page) {
		    	if(parseFloat(page[key].key) === resetIndex) {
		    		resetValue = page[key];
		    	}
		    }

		    if(resetValue && resetValue.reset) {
		    	resetValue.reset();

		    	if(body.config.console) {
	        		console.log('reset page' + resetIndex);
		    	}
	        }
		},

	    countWidth: function (disScore, i) {
	        if(disScore >= 2) {
	            disScore -= 2;
	            i.pop().style.width = "0%";
	            fn.countWidth(disScore, i);
	        }else {
	            var percent =  ( (2 - disScore) / 2) * 100 + '%';
	            i[i.length - 1].style.width = percent;
	        }
	    },

	    countScore: function () {
	        var score = this.target.querySelectorAll('.score');

	        if(!score.length) {
	        	return;
	        }

	        for(var i = 0, l = score.length; i < l; i++) {
	            var scoreText = score[i].querySelector('.count').textContent,
	                scoreNumber = parseFloat(scoreText),
	                percent, ii = Array.prototype.slice.call(score[i].querySelectorAll('i')), disScore = 0;

	            disScore = 10 - scoreNumber;
	            fn.countWidth(disScore, ii);
	        }
	    },

	    close: function () {
	        var self = this,
	        	masker = this.target.querySelector(body.config.masker);
	        if(!masker) {
	        	return;
	        }

	        var close = masker.querySelectorAll(body.config.close);

	        if(!close) {
	        	return;
	        }

	        for(var i = 0, l = close.length; i < l; i++) {
	        	this.bind(close[i], "onclick", function (e) {
	                masker.classList.remove("cur");
	                var cur = masker.querySelector(".cur");
	                cur && cur.classList.remove("cur");
	            });
	        }
	    },

	    open: function () {
	        var self = this,
	        	masker = this.target.querySelector(body.config.masker);

	        if(!masker) {
	        	return;
	        }

	        var li = masker.querySelectorAll("li"),
	            open = this.target.querySelectorAll(body.config.open);

	        if(!open || !open.length) {
	        	return;
	        }

	        for(var i = 0, l = open.length; i < l; i++) {
	            open[i].index = i;
	            this.bind(open[i], "onclick", function (e) {    
	            	self.addClass(masker, "cur");
	            	self.addClass(li[this.index], "cur");
	            });
	        }
	    },

	    reset: function () {
	    	var cache = this.cache,
	    		type;

	    	for(var key in cache) {
	    		type = cache[key].type.split(".")[0];

    			if(type in hooks) {
    				hooks[type].call(this, cache[key]);
    			}

    			this.removeData(key);
	    	}
	    }
	}

	var Expand = function () {}

	Expand.prototype = {
		constructor: Expand,

		bind: function (el, type, fn) {

	        this.data(el, type, fn, "event." + type);

	        if(~type.indexOf('on')) {
	            el[type] = fn;
	        }else {
	            el.addEventListener(type, fn, false);
	        }

	    },

	    unbind: function (el, type, fn) {

	        if(~type.indexOf('on')) {
	            el[type] = null;
	        }else {
	            el.removeEventListener(type, fn, false);
	        }
	    },

	    data: function (el, name, data, type) {
	    	var cache = this.cache,
				ec, key, initValue;

			if(!cache) {
				this.cache = cache = {};
			}

			ec = cache[this.uuid++] = {};

			ec.type = type;
			ec[name] = data;

			if(el) {
				ec.target = el;
				initValue = el[name];

				if(initValue === undefined) {
					ec.initValue = getComputedStyle(el, null)[name];
				}

				ec.initValue = el[name];
			}else {
				ec[name] = data;
			}
	    },

	    removeData: function (id) {
	    	var cache = this.cache,
	    		ec;

	    	if(!id) {
	    		return;
	    	}

	    	ec = cache[id];

	    	if(!ec) {
	    		return;
	    	}

	    	delete cache[id];
	    },

	    addClass: function (el, cla) {
	    	this.data(el, "className", cla, "className." + cla);
	    	el.classList.add(cla);
	    },

	    removeClass: function (el, cla) {
	    	this.data(el, "className", cla, "className." + cla);
	    	el.classList.remove(cla);
	    },

	    setInterval: function (fn, looper) {
	    	var timer = setInterval(function () {
	    		fn();
	    	}, looper);

	    	this.data(null, "timer", timer, "setInterval.timer");
	    },

	    init: empty,

	    reset: empty
	}

	var hooks = {
		event: function (cache) {
			var el = cache.target,
				type = cache.type.split(".")[1],
				fn = cache[type];

			this.unbind(el ,type, fn);
		},

		className: function (cache) {
			cache.target.className = cache.initValue;
		},

		setInterval: function (cache) {
			clearInterval(cache.timer);
		}
	}

	var body = {
		init: function (options) {
			this.config = fn.extend({}, this.config, options);

			if(this.config.usePreload) {
				this.preload.init(this.config);
			}else {
				this.wraper.init(this.config);
			}
			if(this.config.useMusic) {
				this.wraper.music.init(this.config);
			}
		},

		target: doc.body,

		config: config,	

		preload: {
			target: document.querySelector("#Jpreload"),

			init: function (options) {
				this.config = options;
				this.target.classList.remove("hide");
				this.loadPreLoadImgs(options);
			},

			loadImgs: function (options, status) {
				var wrapers, imgs = [], 
					srcImgs,
					status = status === "preload" ? true : false,
					dataSrcImgs, 
					dataBackgroundImgs,
					process,
					success;

				wrapers = status ? this.target : options.wraperImgs;

				if(!wrapers.length) {
					wrapers = [wrapers];
				}

				for(var i = 0, l = wrapers.length; i < l; i++) {
					if(wrapers[i].nodeType === 1 && wrapers[i].nodeName.toLowerCase !== "img") {

						srcImgs = wrapers[i].querySelectorAll("[src]"),
						dataSrcImgs = wrapers[i].querySelectorAll("[data-src]"),
						dataBackgroundImgs = wrapers[i].querySelectorAll("[data-background]");

						if(srcImgs && srcImgs.length) {
							Array.prototype.push.apply(imgs, srcImgs);
						}

						if(dataSrcImgs && dataSrcImgs.length) {
							Array.prototype.push.apply(imgs, dataSrcImgs);
						}

						if(dataBackgroundImgs && dataBackgroundImgs.length) {
							Array.prototype.push.apply(imgs, dataBackgroundImgs);
						}
					}
				}

				options.srcs = imgs;

				success = status ? this.loadWraperImgs : this.success;

				if(status) {
					options.startTime = new Date().getTime();
				}

				if(imgs.length) {
					process = status ? null : this.process;
					this.loadSrc(options, process, success);
				}else {
					success(options);
				}
			},

			loadPreLoadImgs: function (options) {
				this.loadImgs(options, "preload");
			},

			loadWraperImgs: function (options) {
				this.loadImgs(options, "wraper");
			},
			
			success: function (options) {
				var self = this,
					endTime = options.endTime = new Date().getTime(),
					startTime = options.startTime,
					disTime = endTime - startTime,
					timer = null, lastTime;

				if(options.stayHere) {
					return;
				}

				lastTime = Math.max(disTime, options.lastTime || 0);

				clearTimeout(timer);
				timer = setTimeout(function () { 							
					body.wraper.init(options);		

					clearTimeout(timer);
					timer = null;		
				}, lastTime);
			},

			process: function (options) {
				options.process.call(this, options);
			},

			loadSrc: function (options, process, success) {
				var imgs = options.srcs;

				if(!imgs.length) {
					return;
				}

				var self = this,
					img, src, nImg, count = 0;

				for(var i = 0, l = imgs.length; i < l; i++) {
					img = imgs[i];
					src = img.src || img.getAttribute("data-src") || img.getAttribute("data-background");

					if(img.nodeName.toLowerCase() === "img") {
						if(!img.src) {
							img.src = src;
						}
					}else {
						if(!img.backgroundImage || !img.background) {
							img.backgroundImage = src;
						}
					}

					nImg = new Image();

					nImg.src = src;

					nImg.onload = function () {
						options.loadingCount = ++count;

						if(process) {
							process.call(self, options);
						}
						if(count == l) {
							success.call(self, options);
						}
					}
				}
			}
		},

		wraper: {
			target: document.querySelector(".wraper"),

			init: function (options) {
				var self = this,
					value, initCurrying, resetCurring;

				this.target.classList.remove("hide");
				this.config = options;
				this.page = options.page;
				body.preload.target.classList.add("hide");

				this.swiper.init(options);
				// ѡ��makeΪtrue��ˢ��ҳ��ʱ�Ử�������һ��
				if(options.make) {
					setTimeout(function () {
						swiper.unlockSwipes();
						swiper.slideTo(doc.querySelectorAll(options.swiperSlide).length - 1);
					}, 1000);
				}

				// ����ÿһ����ҳ��������
				var sliders = document.querySelectorAll(this.config.swiperSlide),
					classList, selector, value, target,
					rswiperslide = new RegExp("\\" + this.config.swiperSlide + "\\d");

				for(var i = 0, l = sliders.length; i < l; i++) {
					if(!this.page) {
						this.page = {};
					}

					classList = sliders[i].classList;

					for(var j = 0, k = classList.length; j < k; j++) {
						selector = "." + classList[j];

						if(rswiperslide.test(selector)) {
							value = this.page[selector];

							// ׷�����Զ���ҳ�����Ķ���
							if(!value) {
								value = this.page[selector] = {};
							}else {
								value.tracked = true;
							}

							value.selector = selector;
							value.key = i;
						}
					}
				}

				for(var key in this.page) {

					value = this.page[key];
					target = fn.getPage(value.selector);

					if(!target) {
						continue;
					}

					// ׷���е�����ҳ��Ӧ�����Ķ���
					if(options.useMasker && target.querySelector(this.config.masker)) {
						if(!value.tracked) {
							value.tracked = true;
						}
						value.useMasker = true;

						if(options.useCountScore && target.querySelector(this.config.countScore)) {
							if(!value.useCountScore) {
								value.useCountScore = true;
							}
						}
					}

					// ��׷�ٵ�ҳ��������̳���Expand
					if(value.tracked) {
						value.target = target;
						value.uuid = 0;

						var F = function (value){
							return fn.extend(this, value);
						}

						fn.extend(F.prototype, Expand.prototype);

						value = new F(value);

						// ����е�����ҳ�棬��ҳ����������ӷ���.masker�����Ҫ�����������ӷ���.countScore
						if(value.useMasker) {
							fn.extend(F.prototype, {
								masker: function () {
									fn.close.call(this);
									fn.open.call(this);
								}
							});

							if(value.useCountScore) {
								F.prototype.countScore = fn.countScore;
							}
						}
					}

					initCurrying = function (func, key) {

						return function () {
							if(this.useMasker) {
								this.masker();
							}

							if(this.useCountScore && !this.countScoreInited) {
								this.countScore();
								this.countScoreInited = true;
							}

							func.call(this);
						}
					}

					resetCurring = function (func, key) {
						return function () {
							fn.reset.call(this);
							func.call(this);
						}
					}

					// ���ҳ�����Ǳ�׷�ٵģ���Ѽ̳з���.init, .resetת�ɿ��ﻯ����initCurrying, resetCurring����Ϊ����Ҫ��ʼ���ڲ��ĵ�������(�����򿪵����͹رյ���)�ͼ���������������ڲ������÷���(��ʽ��ԭ������������Լ�������¼�)����ִ���Զ���ĳ�ʼ�����������Զ�������÷�����
					if(value.tracked) {
						value.init = initCurrying(value.init, key);
						value.reset = resetCurring(value.reset, key);
					}

					this.page[key] = value;
				}

				// ��ʼ����һ��
				fn.mapPage(options);

				if(options.useWeixin) {
					setTimeout(function () {
						self.weixin.init(options);
					}, 0);
				}

				if(typeof options.next === "function") {
					setTimeout(options.next, 0);
				}
			},

			music: {
				init: function (options) {
					this.config = options;

					var audio = this.target.querySelector("audio");

					audio.src = this.config.src;
					if(options.autoplay) {
						this.autoplay();
					}
				},

				target: document.querySelector(".play_music"),

				autoplay: function () {
					var self = this,
						playAudio = this.target.querySelector(".play_audio"),
						evt = ~navigator.userAgent.indexOf('MicroMessenger') ? 
							'WeixinJSBridgeReady' :
							'touchstart';

					// �����΢�����������'WeixinJSBridgeReady'�¼�����΢�����������'touchstart'�¼�
					document.addEventListener(evt, function(e) {

						if(e.type === 'WeixinJSBridgeReady') {
							self.click();
						}

						if(e.type === 'touchstart' && e.target !== playAudio) {
							self.click();
						}

						playAudio.onclick = function() {
							self.click();
						}

						document.removeEventListener(
							evt, 
							arguments.callee, 
							false
						);
					}, false);
				},

				click: function () {
					var target = this.target,
						audio = target.querySelector("audio"),
						playAudio = target.querySelector(".play_audio");

					if(audio.paused) {
						audio.play();
						audio.autoplay = "autoplay";
						playAudio.classList.add("playMusic");
					}else {
						audio.pause();
						audio.removeAttribute("autoplay");
						playAudio.classList.remove("playMusic");
					}
				}
			},

			swiper: {
				init: function (options) {
					if(options.useSwiper) {
						this.swiper();
					}
				},

				swiper: function () {
					var swiper = new Swiper('.swiper-container', {
			            // pagination: '.swiper-pagination',
			            paginationClickable: true,
			            direction: 'vertical',
			            noSwipingClass : 'stop-swiping',    // ������
			            lazyLoading : true,                 // ������
			            lazyLoadingInPrevNext: true,        // ����������
			            onSlideChangeEnd: function () {
			                var index = swiper.activeIndex;
							fn.mapPage();
			            }
			        });

			        window.swiper = swiper;
				}
			},

			weixin: {
				init: function (options) {
					this.weixin(options);
				},

				weixin: function (options) {
					options.weixin && options.weixin();
				}
			},

			masker: {
				init: function () {
					this.open();
				},

				open: function () {
					var page = body.config.page;
					console.log(page);
				}
			}
		}
	}

	var Wap = function (options) {
		this.init(options)
	}

	Wap.prototype = {
		init: function (options) {
			body.init(options);
		},
		lock: function () {
	        swiper.lockSwipes();
	    },

	    unlock: function () {
	        swiper.unlockSwipes();
	    },

	    slideTo: function (index, duration) {
	    	swiper.slideTo(index, duration);
	    },

	    slideNext: function () {
	    	swiper.slideNext();
	    },

	    slidePrev: function () {
	    	swiper.slidePrev();
	    }
	}

	window.Wap = Wap;

})(this);