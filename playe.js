var playe = (function() {
	var o = {};
	var playes = document.querySelectorAll("script[type='text/playe']");

	o.new = function (settings) {};

	/************************************ CONVERT ************************************
		converts all the '<script type="text/playe">' into html
	**********************************************************************************/
	var cPlaye = null;
	o.convert = function () {
		for (var i = 0; i < playes.length; i++) {
			var p = playes[i];
			var raw = p.innerHTML;
			var datas = getData(p);
			var playe = document.createElement("div");
			cPlaye = playe;
			var style = 'display:inline-flex; flex-wrap:wrap;';
			if (p.getAttribute('playe-width') != undefined)
				style += 'width:' + p.getAttribute('playe-width') + ';';
			if (p.getAttribute('playe-height') != undefined)
				style += 'height:' + p.getAttribute('playe-height') + ';';
			playe.style = style;
			playe.className = 'playe' + (p.className != "" ? " " + p.className : "");

			var parse = o.playeParse(raw);
			//console.log(parse);
			addAudio(playe);
			
			playe.bloc = document.createElement("div");
			playe.bloc.style = "position:fixed;top:0;left:0;bottom:0;right:0;z-index:100;";
			// playe.appendChild(playe.bloc);
			// playe.bloc.parentNode.removeChild(playe.bloc);
			
			playe.tracks = parse.tracks;
			playe.audio.src = playe.tracks[0].src[0].value;
			playe.duration = 0;//function(){return playe.audio.duration;};
			playe.audio.oncanplaythrough = function(){playe.duration = playe.audio.duration;}
			playe.playingTrack = 0;
			playe.settings = parse.settings;
			if(playe.settings.preload){playe.audio.preload = true;}
			playe.isPlaying = playe.settings.autoplay;
			playe.randomList = [];

			playe.play = function () {
				playe.audio.play();
				playe.isPlaying = true;
				playe.className = 'playe playing';
			};
			playe.pause = function () {
				playe.audio.pause();
				playe.isPlaying = false;
				playe.className = 'playe stopped';
			};
			playe.next = goTrack.bind(playe, 'next');
			playe.previous = goTrack.bind(playe, 'previous');
			playe.test = function (v) {
				if (playe.audio.canPlayType(v) != '') {
					return true;
				}
				return false;
			};
			playe.loadTrack = loadTrack;

			playe.audio.onended = goTrack.bind(playe, 'next');
			
			playe.audio.onloadstart = function(){playe.dataset.loading = "true"}
			playe.audio.oncanplaythrough = function(){playe.dataset.loading = "false"}

			if (playe.isPlaying)
				playe.play();

			o.populate(playe, parse.layout);

			playe.setTitle = function (v) {
				if (this.parts.title) {
					this.parts.title.setValue(v);
				}
			};
			playe.setTitle(playe.tracks[0].title);

			p.parentNode.insertBefore(playe, p);
			p.parentNode.removeChild(p);
		}
	}
	
	//==================================================================================
	////////////////////////////////// UTILITY FUNCTIONS ///////////////////////////////
	//==================================================================================
	function loadTrack(id) {
		if (id == null)
			return;
		var src = supported(this, this.tracks[id].src);
		if (src == null) {
			this.playingTrack = id;
			return this.next();
		}
		this.audio.src = src;
		this.setTitle(this.tracks[id].title);
		this.playingTrack = id;
	}
	function supported(playe, arr) {
		for (var i = 0; i < arr.length; i++) {
			if (playe.test(arr[i].type))
				return arr[i].value;
		}
		return null;
	}
	function goTrack(to) {
		if (this.settings.random == true) {
			to = 'random';
		}
		var next = getTrack(this, to);
		this.loadTrack(next);
		if (this.isPlaying == true)
			this.play();
		
	}
	function getTrack(p, to) {
		switch (to) {
		case 'next':
			if (p.settings.loop == true) {
				return p.playingTrack < p.tracks.length - 1 ? p.playingTrack + 1 : 0;
			} else {
				return p.playingTrack < p.tracks.length - 1 ? p.playingTrack + 1 : null;
			}
		case 'previous':
			if (p.settings.loop == true) {
				return p.playingTrack > 0 ? p.playingTrack - 1 : p.tracks.length - 1;
			} else {
				return p.playingTrack > 0 ? p.playingTrack - 1 : null;
			}
		case 'random':

		default:

		}
	}
	function addAudio(playe) {
		playe.audio = document.createElement('audio');
		playe.audio.className = 'playe-audio';
		playe.appendChild(playe.audio);
	}
	function setAttr(p, div) {};
	function getData(p) {
		var d = {};
		d.controls = p.getAttribute('playe-controls') != undefined ? true : false;
		d.loop = p.getAttribute('playe-loop') != undefined ? true : false;
		return d;
	};
	//----------------------------------------------------------------------------------
	
	
	//==================================================================================
	////////////////////////////// CONSTRUCTORS FUNCTIONS //////////////////////////////
	//==================================================================================
	function Button(playe, text, fn) {
		var div = document.createElement('div');
		div.className = 'playe-button';
		var inner,
		style = '';
		if (text[0] == '"') {
			inner = document.createElement("img");
			inner.src = text.substr(1,text.length-2);
			style = 'max-height:100%;';
		} else {
			inner = document.createElement("span");
			inner.innerHTML = text;
		}
		inner.style = style + 'display:inline-block;position:relative;top:50%;transform:translate(0,-50%);';
		div.appendChild(inner);
		if(fn)div.addEventListener('click', fn);
		return div
	}
	function Play(playe,text){
		var el = Button(playe,text,playe.play);
		el.className += ' playe-play';
		return el;
	}
	function Pause(playe,text){
		var el = Button(playe,text,playe.pause);
		el.className += ' playe-pause';
		return el;
	}
	function Next(playe,text){
		var el = Button(playe,text,playe.next);
		el.className += ' playe-next';
		return el;
	}
	function Previous(playe,text){
		var el = Button(playe,text,playe.previous);
		el.className += ' playe-previous';
		return el;
	}
	function Image(playe, text) {
		var div = document.createElement('div');
		div.className = 'playe-image';
		var inner, style = '';
		inner = document.createElement("img");
		inner.src = text.substr(1,text.length-2);
		inner.style = style + 'max-height:100%;display:inline-block;position:relative;top:50%;transform:translate(0,-50%);';
		div.appendChild(inner);
		return div
	}
	function Text(playe, text) {
		var div = document.createElement('div');
		div.className = 'playe-text';
		var inner = document.createElement("span");
		inner.innerHTML = text;
		inner.style = 'display:inline-block;position:relative;top:50%;transform:translate(0,-50%);';
		div.appendChild(inner);
		return div
	}
	function Html(playe, value) {
		var div = document.createElement('div');
		div.innerHTML = value;
		return div
	}
	function List(playe, h) {
		var arr = playe.tracks;
		var div = document.createElement('div');
		div.className = 'playe-list';
		
		var ol = document.createElement('ol');
		for(var i = 0;i<arr.length;i++){
			var li = document.createElement('li');
			li.className = 'playe-list-item';
			li.innerHTML = arr[i].title;
			li.onclick = playe.loadTrack.bind(playe,arr[i].id-1);
			ol.appendChild(li);
		}
		
		ol.style = 'display:block;overflow-y:auto;list-style-position:inside;padding-left:0;'
		
		div.appendChild(ol);
		return div
	}
	function Title(playe, text) {
		var div = document.createElement('div');
		div.className = 'playe-title';
		var inner = document.createElement("h3");
		inner.innerHTML = text;
		inner.style = 'display:inline-block;margin:0 auto;position:relative;top:50%;transform:translate(0,-50%);';
		div.appendChild(inner);
		div.setValue = function (v) {
			inner.innerHTML = v;
		};
		return div
	}
	function Time(playe, sep) {
		var div = document.createElement('div');
		div.className = 'playe-time';
		var inner = document.createElement("span");
		inner.style = 'display:inline-block;position:relative;top:50%;transform:translate(0,-50%);';
		playe.audio.addEventListener("durationchange", function(){
			var t = formatTime(Math.round(this.duration,2));
			if(sep){t = formatTime(Math.round(this.currentTime,2))+sep+t;}
			inner.innerHTML = t;
		})
		playe.audio.addEventListener("timeupdate", function(){
			if(isNaN(this.duration))return;
			var t = formatTime(Math.round(this.duration,2));
			if(sep){t = formatTime(Math.round(this.currentTime,2))+sep+t;}
			inner.innerHTML = t;
		})
		div.appendChild(inner);
		return div;
	}
	function Trigger(text, state, fn) {
		var div = document.createElement('div');
		div.className = 'playe-trigger-' + state;
		var inner;
		if (text[0] == '"') {
			inner = document.createElement("img");
			inner.src = text;
		} else {
			inner = document.createElement("span");
			inner.innerHTML = text;
		}
		div.appendChild(inner);
		div.addEventListener('click', function () {
			this.className = this.className.indexOF('on') > 0 ? 'playe-trigger-off' : 'playe-trigger-on';
		});
		div.addEventListener('click', fn);
		return div
	}
	function formatTime(dur){
		var min = String(Math.floor(dur/60)%60); var hour = String(Math.floor(dur/3600)); var sec = String(dur%60);
		return (hour>"0"?hour+":":"")+(min.length==1?"0"+min:min)+":"+(sec.length==1?"0"+sec:sec);
	}
	var Slider = (function(){
		var ps = "playe-slider";
		var div = function(c){var d=document.createElement("div");d.className=c;return d;};
		function sliderBack(){
			var d = div(ps+"-back");
			d.style = "position:relative;top:50%;transform:translate(0,-50%);width:100%;";
			return d;
		}
		function sliderLoaded(){
			var d = div(ps+"-loaded");
			d.style = "position:absolute; pointer-events:none; top:0; left:0; bottom:0; right:0;";
			d.setLenght = function(px){
				this.style.right = px + "px";
			}
			d.style.right = "100%";
			return d;
		}
		function sliderPlayed(){
			var d = div(ps+"-played");
			d.style = "position:absolute; pointer-events:none; top:0; left:0; bottom:0; right:0;";
			d.setLenght = function(px){
				this.style.right = px + "px";
			}
			d.style.right = "100%";
			return d;
		}
		function sliderCursor(){
			var d = div(ps+"-cursor");
			d.style = "position:absolute; cursor: pointer;";
			d.dataset.playeSliderValue = "00:00";
			return d;
		}
		
		function formatTime(per){
			var dur = Math.round(cPlaye.audio.duration * per,2)+""; var min = String(Math.floor(dur/60)%60); var hour = String(Math.floor(dur/3600)); var sec = String(dur%60);
			return (hour>"0"?hour+":":"")+(min.length==1?"0"+min:min)+":"+(sec.length==1?"0"+sec:sec);
		}
		function backWidth(){ return this.back.offsetWidth - (this.curs?this.curs.offsetWidth:5); };
		function getPosition(el) { return el.getBoundingClientRect().left; }
		function clickPercent(event) { return (event.clientX-offset.call(this) - getPosition(this.back)) / this.backWidth(); }
		function offset(){return this.curs?this.curs.offsetWidth/2:0}
		
		function mouseDown(event) {
			this.dragging = true;
			window.addEventListener('mouseup', this.mouseUp, false);
			window.addEventListener('mousemove', this.moveCursor, false);
			this.moveCursor(event);
			if(this.curs)this.curs.dataset.playeActive = true;
			cPlaye.appendChild(cPlaye.bloc);
		}
		function mouseUp(event) {
			if (this.dragging == true) {
				this.moveCursor(event);
				window.removeEventListener('mousemove', this.moveCursor, false);
				window.removeEventListener('mouseup', this.mouseUp, false);
			}
			this.dragging = false;
			cPlaye.bloc.parentNode.removeChild(cPlaye.bloc);
		}
		function mouseUpTimeline(event) {
			if (this.dragging == true) {
				this.moveCursor(event);
				window.removeEventListener('mousemove', this.moveCursor, false);
				window.removeEventListener('mouseup', this.mouseUp, false);
				this.value = this.clickPercent(event);
				this.valueChange();
			}
			this.dragging = false;
			this.curs.dataset.playeActive = false;
			cPlaye.bloc.parentNode.removeChild(cPlaye.bloc);
		}
		function moveCursorTimeline(event) {
			var newMargLeft = event.clientX-offset.call(this) - getPosition(this.back);
			var newleft = Math.max(0,Math.min(newMargLeft,this.backWidth()));
			this.played.setLenght(this.backWidth()-newleft);
			this.curs.style.marginLeft = newleft + "px";
			var per = Math.max(0,Math.min(this.clickPercent(event),1));
			this.curs.dataset.playeSliderValue = formatTime(per);
		}
		function moveCursorVolume(event) {
			var newMargLeft = event.clientX-offset.call(this) - getPosition(this.back);
			var newleft = Math.max(0,Math.min(newMargLeft,this.backWidth()));
			this.played.setLenght(this.backWidth()-newleft);
			var per = Math.max(0,Math.min(this.clickPercent(event),1));
			this.value = per;
			this.valueChange();
		}
		
		function Timeline(playe,value){
			var obj = document.createElement("div");
			obj.className = "playe-timeline";
			obj.back = sliderBack();
			obj.loaded = sliderLoaded();
			obj.played = sliderPlayed();
			obj.curs = sliderCursor();
			obj.back.appendChild(obj.loaded);
			obj.back.appendChild(obj.played);
			obj.back.appendChild(obj.curs);
			obj.appendChild(obj.back);
			
			obj.dragging = false;
			obj.value = 0.0;
			obj.valueChange = function(){
				playe.audio.currentTime = playe.audio.duration * this.value;
			}
			
			obj.backWidth = backWidth;
			obj.clickPercent = clickPercent;
			
			obj.mouseDown = mouseDown.bind(obj);
			obj.mouseUp = mouseUpTimeline.bind(obj);
			obj.moveCursor = moveCursorTimeline.bind(obj);

			obj.back.addEventListener('mousedown', obj.mouseDown, false);

			function timeUpdate() {
				if(this.dragging||!playe.isPlaying)return;
				var percent = (playe.audio.currentTime / playe.audio.duration);
				var px = this.backWidth() * percent;
				this.curs.style.marginLeft = 1+px + "px";
				this.played.setLenght(this.backWidth()-px);
			}
			setInterval(timeUpdate.bind(obj),40)
			
			playe.audio.onprogress = function(ev) {
				var px;
				try {px = (this.buffered.end(this.buffered.length-1)/this.duration)*obj.backWidth();}
				catch(e){}
				obj.loaded.setLenght(obj.backWidth()-px);
			};
			playe.audio.addEventListener("durationchange", function(){
				var t = formatTime(1);
				obj.dataset.playeDuration = t;
			})
			
			return obj;
		}
		function Volume(playe,value){
			var obj = document.createElement("div");
			obj.className = "playe-volume";
			obj.back = sliderBack();
			obj.played = sliderPlayed();
			obj.back.appendChild(obj.played);
			obj.appendChild(obj.back);
			
			obj.dragging = false;
			
			obj.value = value;
			obj.played.setLenght(1-value);
			
			obj.valueChange = function(){
				playe.audio.volume = this.value;
				//console.log("new value: "+obj.value);
			}
			obj.valueChange();
			
			obj.backWidth = backWidth;
			obj.clickPercent = clickPercent;
			
			obj.mouseDown = mouseDown.bind(obj);
			obj.mouseUp = mouseUp.bind(obj);
			obj.moveCursor = moveCursorVolume.bind(obj);

			obj.back.addEventListener('mousedown', obj.mouseDown, false);

			return obj;
		}
		return {
			Timeline: Timeline,
			Volume:	Volume,
			fTime: formatTime
		}

	})();
	//----------------------------------------------------------------------------------
	
	//==================================================================================
	///////////////////////////////// PARSER FUNCTIONS /////////////////////////////////
	//==================================================================================
	var defaultValue = {
		play: '►',
		pause: '▍▍',
		next: '→',
		previous: '←',
		slider: '',
		volume: '1',
		title: '',
		playlist: '4',
		time: false
	};
	function parseElement(raw) {
		var m,w = 0;
		if (m = /([+-]+)?\s*(.+)/.exec(raw)) {
			raw = m[2];
			if(m[1]) w = m[1][0] == "-" ? m[1].length*-1 : m[1].length;
		}
		var a = { element: raw, value: defaultValue[raw],weight: w };
		if (m = /\s*(.+?)\s*(::)\s*(.*)/.exec(raw)) {
			a.element = m[2];
			a.value = m[4];
		}
		return a;
	}
	function typef(typ, def) {
		switch (typ) {
		case 'mp3':
			return 'audio/mpeg';
		case 'ogg':
			return 'audio/ogg';
		case 'wav':
			return 'audio/wav';
		default:
			return def;
		}
	}
	o.playeParse = function (raw) {
		raw = raw.replace(/\n\s*(:\w{0,3}:)/g, " $1");
		raw = raw.replace(/\s\/\/(.*)\n/g, "\n");
		//console.log(raw);
		var tree = {
			settings: {},
			layout: [],
			tracks: []
		};
		var lines = raw.split(/\r\n|\r|\n/);
		for (var i = 0; i < lines.length; i++) {
			var input = lines[i].trim(), m, sm;
			// Search for Playlist entry pattern /0. Title :: "url"/
			if (m = /(\d)\.\s?(.*?)\s*:(\w{3})?:\s*"([^"]+?)"(.*)/.exec(input)) {
				var t = {
					id: m[1]
				};
				t.title = m[2] ? m[2] : "Track " + m[1];
				t.src = [{
						type: typef(m[3], tree.settings.type),
						value: m[4]
					}
				];
				var search = function (str) {
					if (sm = /\s*:(\w{3})?:\s*"([^"]+)"(.*)/.exec(str)) {
						t.src.push({
							type: typef(sm[1], tree.settings.type),
							value: sm[2]
						});
						if (sm[3])
							search(sm[3]);
					}
				}
				search(m[5]);
				tree.tracks.push(t);
				
			// Search for Settings pattern /(loop,preload,:def:,autoplay)/
			} else if (m = /\((.+)\)/.exec(input)) {
				var s = {
					loop: false,
					random: false,
					autoplay: false,
					type: 'audio/ogg'
				};
				var search = function (str) {
					if (sm = /.*?([^, ]+)(.*)/.exec(str)) {
						if (sm[1][0] == ':') {
							s.type = typef(sm[1].replace(/:/g, ''), 'audio/ogg');
						} else
							s[sm[1]] = true;
						if (sm[2])
							search(sm[2]);
					}
				};
				search(m[1]);
				tree.settings = s;
			// Search for Layout element pattern /[element :: parameter]/
			} else if (m = /\[([^\]]+)\](.*)/.exec(input)) {
				var row = [];
				row.push(parseElement(m[1]));
				var search = function (str) {
					if (sm = /\s*\[([^\]]+)\](.*)/.exec(str)) {
						row.push(parseElement(sm[1]));
						if (sm[2]) search(sm[2]);
					}
				}
				if (m[2]) search(m[2]);
				tree.layout.push(row);
			}
		}
		//console.log(tree);
		return tree;
	};
	function createElement(playe, e) {
		switch (e.element) {
		case 'play':
			return Play(playe, e.value);
		case 'pause':
			return Pause(playe, e.value);
		case 'next':
			return Next(playe, e.value);
		case 'previous':
			return Previous(playe, e.value);
		case 'button':
			return Button(playe, e.value);
		case 'img':
			return Image(playe, e.value);
		case 'html':
			return Html(playe, e.value.substr(1,e.value.length-2));
		case 'text':
			return Text(playe, e.value);
		case 'volume':
			return Slider.Volume(playe, e.value);
		case 'timeline':
			return Slider.Timeline(playe, e.value);
		case 'time':
			return Time(playe, e.value);
		case 'title':
			return Title(playe, e.value);
		case 'playlist':
			return List(playe, e.value);
		default:
			return Text(playe, e.value);
		}
	};
	o.populate = function (playe, lay) {
		var parts = {};
		var div = document.createElement('div');
		for (var i = 0; i < lay.length; i++) {
			var r = lay[i];
			var l = r.length;
			var perc = 100/l
			for (var e = 0; e < l; e++) {
				parts[r[e].element] = createElement(playe, r[e]);
				parts[r[e].element].style = 'flex: 1 1 ' + ((perc+(10*r[e].weight))-5) + '%';
				playe.appendChild(parts[r[e].element]);
			}
		}
		playe.parts = parts;
	};
	//o.volume = Slider.Volume;
	return o;
})();
playe.convert();
