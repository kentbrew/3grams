(function (w, d, a) {
  var $ = w[a.k] = {
    'a': a,
    'd': d,
    'w': w,
    's': {},
    'f': (function () {
      return {
        hazClass: function (el, text) {
          var c = el.className.split(' '), i, n = c.length, found = false;
          for (i = 0; i < n; i = i + 1) {
            if (text === c[i]) {
              found = true;
            }
          }
          return found;
        },
        addClass: function (el, text) {
          var found = $.f.hazClass(el, text);
          if (!found) {
            if (el.className) {
              text = ' ' + text;
            }
            el.className = el.className + text;
          }
          return found;
        },
        removeClass: function (el, text) {
          var c = el.className.split(' '), i, n = c.length, newClassName = '', sep = '', found = true;
          for (i = 0; i < n; i = i + 1) {
            if (c[i] !== text) {
              newClassName = newClassName  + sep + c[i];
              sep = ' ';  
              found = false; 
            }
          }
          el.className = newClassName;
          return found;
        },
        // get a DOM property or text attribute
        get: function (el, att) {
          var v = null;
          if (typeof el[att] === 'string') {
            v = el[att];
          } else {
            v = el.getAttribute(att);
          }
          return v;
        },
        // set a DOM property or text attribute
        set: function (el, att, string) {
          if (typeof el[att] === 'string') {
            el[att] = string;
          } else {
            el.setAttribute(att, string);
          }
        },
        // create a DOM element
        make: function (obj) {
          var el = false, tag, att;
          for (tag in obj) {
            if (obj[tag].hasOwnProperty) {
              el = $.d.createElement(tag);
              for (att in obj[tag]) {
                if (obj[tag][att].hasOwnProperty) {
                  if (typeof obj[tag][att] === 'string') {
                    $.f.set(el, att, obj[tag][att]);
                  }
                }
              }
              break;
            }
          }
          return el;
        },
        // remove a DOM element
        kill: function (obj) {
          if (typeof obj === 'string') {
            obj = $.d.getElementById(obj);
          }
          if (obj && obj.parentNode) {
            obj.parentNode.removeChild(obj);
          }
        },
        listen : function (el, ev, fn) {
          if (typeof $.w.addEventListener !== 'undefined') {
            el.addEventListener(ev, fn, false);
          } else if (typeof $.w.attachEvent !== 'undefined') {
            el.attachEvent('on' + ev, fn);
          }
        },
        // find an event's target element
        getEl: function (e) {
          var el = null;
          if (e.target) {
            el = (e.target.nodeType === 3) ? e.target.parentNode : e.target;
          } else {
            el = e.srcElement;
          }
          return el;
        },
        hazMove: function (el, set) {
          var hazMove = false;

          var moveRow = parseInt($.f.get(el, 'data-row'));
          var moveCol = parseInt($.f.get(el, 'data-col'));
          var moveState = parseInt($.f.get(el, 'data-state'));

          // don't try to move black pieces
          if (moveState) {
            for (var i = 0; i < 8; i = i + 1) {
              var addRow = moveRow + $.a.mod.r[i] * 2;
              var addCol = moveCol + $.a.mod.c[i] * 2;
              if (addRow > -1 && addRow < $.a.rows && addCol > -1 && addCol < $.a.cols) {
                var addPiece = $.d.getElementById('t' + (addRow * $.a.cols + addCol));
                // addPiece may be off the board
                if (addPiece) {
                  var addState = parseInt($.f.get(addPiece, 'data-state'));
                  
                  // the piece in between this one and the selected piece
                  var subRow = moveRow + $.a.mod.r[i];
                  var subCol = moveCol + $.a.mod.c[i];
                  
                  // if we have an addPiece, subPiece cannot be off the board
                  var subPiece = $.d.getElementById('t' + (subRow * $.a.cols + subCol));
                  var subState = parseInt($.f.get(subPiece, 'data-state'));
  
                  // these will be -1 (bad) or a number from 0 to 7
                  var subResult = $.a.sub[moveState][subState];
                  var addResult = $.a.add[moveState][addState];
  
                  // got valid move?
                  if (addResult !== -1 && subResult !== -1) {
                    if (set) {
                      $.f.addClass(addPiece, 'valid');
                      $.f.set(addPiece, 'data-add-result', addResult);
                      $.f.set(addPiece, 'data-sub-result', subResult);
                      $.f.set(addPiece, 'data-sub-id', subPiece.id);
                      // store for removal of attributes we just added
                      $.v.validMove.push(addPiece);
                    }
                    hazMove = true;
                  }
                }
              }
            }
          }
          return hazMove;
        },
        
        undo: function () {
          $.s.score.innerHTML = '';
          if ($.v.history.length) {
            var p = $.v.history.pop();
            for (var i = 0; i < p.length; i = i + 1) {
              var el = $.d.getElementById(p[i].id);
              var state = parseInt(p[i].state);
              $.f.set(el, 'data-state', state);
              el.innerHTML = $.a.symbol[state];
              el.className = 'c' + state;
            }
            $.f.moveCount = $.v.moveCount + 1;
            $.f.score();
          }
          if (!$.v.history.length) {
            $.s.undo.className = 'hidden';
          }
        },
        
        score: function () {
          var hazMove = false;
          var remaining = 0;
          for (var i = 0; i < $.a.rows * $.a.cols; i = i + 1) {
            var t = $.d.getElementById('t' + i);

            // clear all moves previously marked as valid
            t.removeAttribute('data-add-result');
            t.removeAttribute('data-sub-result');
            t.removeAttribute('data-sub-id');
            
            if ($.f.hazMove(t)) {
              hazMove = true;
            }
            remaining = remaining + $.a.score[parseInt($.f.get(t, 'data-state'))];
          }

          $.v.moveCount = $.v.moveCount + 1;

          if ($.v.practice) {
            $.s.status.innerHTML = 'Practice: ';
          } else {
            $.s.status.innerHTML = '';
          }
          
          if ($.v.moveCount) {
          
            $.s.status.innerHTML = $.s.status.innerHTML + $.v.moveCount + ' move';
            if ($.v.moveCount !== 1) {
              $.s.status.innerHTML = $.s.status.innerHTML + 's';
            }
            $.s.status.innerHTML = $.s.status.innerHTML + ', ';
          }
          
          $.s.status.innerHTML = $.s.status.innerHTML + remaining + ' to go.';
          
          if (!hazMove) {
            $.s.status.innerHTML = $.s.status.innerHTML + ' Score: ' + remaining * $.v.moveCount;
          }

        },
        
        // a click!
        click: function (v) {
          v = v || $.w.event;
          var el, log;
          el = $.f.getEl(v);
          
          if (el === $.s.undo) {
            $.f.undo();
          }

          if (el === $.s.practice) {
            $.f.start(true);
          }
                    
          if (el === $.s.instructions) {
            if ($.f.hazClass($.s.help, 'hidden')) {
              $.s.instructions.innerHTML = 'Back to Game';
              $.f.addClass($.s.undo, 'hidden');
              $.f.removeClass($.s.help, 'hidden');
              $.f.removeClass($.s.practice, 'hidden');
            } else {
              if ($.v.history.length) {
                $.f.removeClass($.s.undo, 'hidden');
              }
              $.s.instructions.innerHTML = 'Help';
              $.f.addClass($.s.help, 'hidden');
              $.f.addClass($.s.practice, 'hidden');
            }
          }
          
          // is this a piece on the board?
          if (el.tagName === 'A' && el.parentNode === $.s.board) {
            // is there a selected tile?
            if ($.v.selectedTile) {
              // this might be a valid move
              if (el !== $.v.selectedTile) {
              
                 var add = parseInt($.f.get(el, 'data-add-result'));
                 var sub = parseInt($.f.get(el, 'data-sub-result'));
                 var sel = $.f.get(el, 'data-sub-id');
                 var subEl = $.d.getElementById(sel);
                 
                 if (subEl) {
                 
                   $.v.history.push([{
                       'id': $.v.selectedTile.id,
                       'state': $.f.get($.v.selectedTile, 'data-state')
                     }, {
                       'id': sel,
                       'state': $.f.get(subEl, 'data-state')
                     }, {
                       'id': el.id,
                       'state': $.f.get(el, 'data-state')
                     }]);
                   
                   $.s.undo.className = '';
                   $.s.score.innerHTML = '';
                 
                   // remove
                   $.v.selectedTile.className = 'c0';
                   $.v.selectedTile.innerHTML = $.a.symbol[0];
                   $.f.set($.v.selectedTile, 'data-state', 0);
                   // subtract
                   subEl.className = 'c' + sub;
                   subEl.innerHTML = $.a.symbol[sub];
                   $.f.set(subEl, 'data-state', sub);
                   // add
                   el.className = 'c' + add;
                   el.innerHTML = $.a.symbol[add];
                   $.f.set(el, 'data-state', add);
                   
                   $.f.score();
                   
                }
              }
              // always deselect 
              $.f.removeClass($.v.selectedTile, 'selected');
              $.v.selectedTile.style.fontSize = $.a.size * .75 + 'px';

              for (var i = 0; i < $.a.rows * $.a.cols; i = i + 1) {
                var t = $.d.getElementById('t' + i);
                $.f.removeClass(t, 'valid');
              }
    
              $.v.selectedTile = null;
              
            } else {
              var state = parseInt($.f.get(el, 'data-state'));
              // don't try to move black pieces
              if (state) {
                if ($.f.hazMove(el, true)) {
                  $.f.addClass(el, 'selected');
                  el.style.fontSize = $.a.size * .90 + 'px';
                  $.v.selectedTile = el;
                }
              }
            }
          }
        },
        // this is from Numerical Recipes in FORTRAN 77
        // http://books.google.com/books?id=gn_4mpdN9WkC&pg=PA275&lpg=PA275
        repeatablyRandom: function (limit) {
          $.v.repeatablyRandom = ($.v.repeatablyRandom * 9301 + 49297) % 233280;
			    return Math.floor($.v.repeatablyRandom / 233280.0 * limit);
        },
        // pseudo-random shuffle, so replays are possible
        shuffle: function () {

          var arr = [], c = 0, i, t = $.a.rows * $.a.cols;

          for (i = 0; i < t; i = i + 1) {
            arr.push(c + 1);
            c = (c + 1) % 6;
          }

          // http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
          for (var j, x, i = arr.length; i; j = $.f.repeatablyRandom(i), x = arr[--i], arr[i] = arr[j], arr[j] = x);  
          
          return arr;            
        },
        start: function (practice) {
          
          $.v = {
            'validMove': [], 
            'moveCount': -1, 
            'history': [],
            'practice': practice
          };
          if (practice) {
            $.v.repeatablyRandom = ~~(Math.random() * 86400000);
          } else {
            $.v.repeatablyRandom = ~~(new Date().getTime() / 86400000);
          }
          $.v.state = $.f.shuffle();
          $.s.status.innerHTML = '';
          // $.s.board.innerHTML = '';
          for (var i = 0; i < $.v.state.length; i = i + 1) {
            var r = ~~(i / $.a.cols);
            var c = i % $.a.cols;
            var a = $.f.make({'A':{'id': 't' + i, 'innerHTML': $.a.symbol[$.v.state[i]], 'className': 'tile'}});
            $.f.set(a, 'data-row', r);
            $.f.set(a, 'data-col', c);
            $.f.set(a, 'data-state', $.v.state[i]);
            a.style.top = r * $.a.size + 'px';
            a.style.left = c * $.a.size + 'px';
            a.style.height = $.a.size - 2 + 'px';
            a.style.width = $.a.size - 2 + 'px';
            a.style.fontSize = ~~($.a.size * .75) + 'px';
            a.style.lineHeight = $.a.size - 2 + 'px';
            a.className = 'c' + $.v.state[i];
            $.s.board.appendChild(a);
          }
          $.s.instructions.innerHTML = 'Help';
          $.f.addClass($.s.help, 'hidden');
          $.f.addClass($.s.practice, 'hidden');          
          $.f.score();
        },
        init: function () {
          $.d.b = $.d.getElementsByTagName('BODY')[0];
          var w = $.w.innerWidth;
          if (w > 600) {
            w = 480;
          }
          $.a.size = w / 6;
          $.f.listen($.d.b, 'click', $.f.click);
          $.f.listen($.d.b, 'touchstart', $.f.click);
          $.s.help = $.d.getElementById('help');
          $.s.instructions = $.d.getElementById('instructions');
          $.s.practice = $.d.getElementById('practice');
          $.s.board = $.d.getElementById('board');
          $.s.score = $.d.getElementById('score');
          $.s.undo = $.d.getElementById('undo');
          $.s.status = $.d.getElementById('status');
          $.s.board.style.height = $.a.rows * $.a.size + 'px';
          $.s.board.style.width = $.a.cols * $.a.size + 'px';
          $.f.start();
        }
      };
    }())
  };
  $.f.init();
}(window, document, {
  'k': 'TESS',
  'rows': 6,
  'cols': 6,
  'size': 80,
  'mod': {
    'r': [-1, -1, 0, 1, 1, 1, 0, -1],
    'c': [0, 1, 1, 1, 0, -1, -1, -1]
  },
  'score': [0, 1, 1, 2, 1, 2, 2, 3],
  'add': [
    [ -1, -1, -1, -1, -1, -1, -1, -1],
    [  1,  1,  3, -1,  5, -1,  7, -1],
    [  2,  3,  2, -1,  6,  7, -1, -1],
    [  3, -1, -1,  3,  7, -1, -1, -1],
    [  4,  5,  6,  7,  4, -1, -1, -1],
    [  5, -1,  7, -1, -1,  5, -1, -1],
    [  6,  7, -1, -1, -1, -1,  6, -1],
    [  7, -1, -1, -1, -1, -1, -1,  7]
  ],
  'sub': [
    [ -1, -1, -1, -1, -1, -1, -1, -1],
    [ -1,  0,  0,  2,  0,  4, -1,  6],
    [ -1,  0,  0,  1,  0, -1,  4,  5],
    [ -1, -1, -1,  0, -1, -1, -1,  4],
    [ -1,  0,  0, -1,  0,  1,  2,  3],
    [ -1, -1, -1, -1, -1,  0, -1,  2],
    [ -1, -1, -1, -1, -1, -1,  0,  1],
    [ -1, -1, -1, -1, -1, -1, -1,  0]
  ],
  'symbol': [
    '&#x2637;',
    '&#x2636;',
    '&#x2635;',
    '&#x2634;',
    '&#x2633;',
    '&#x2632;',
    '&#x2631;',
    '&#x2630;'
  ]
}));