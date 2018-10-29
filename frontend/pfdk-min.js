// Source H5P resizer: https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js
// H5P iframe Resizer
(function () {
  if (!window.postMessage || !window.addEventListener || window.h5pResizerInitialized) {
    return; // Not supported
  }
  window.h5pResizerInitialized = true;

  // Map actions to handlers
  var actionHandlers = {};

  /**
   * Prepare iframe resize.
   *
   * @private
   * @param {Object} iframe Element
   * @param {Object} data Payload
   * @param {Function} respond Send a response to the iframe
   */
  actionHandlers.hello = function (iframe, data, respond) {
    // Make iframe responsive
    iframe.style.width = '100%';

    // Tell iframe that it needs to resize when our window resizes
    var resize = function (event) {
      if (iframe.contentWindow) {
        // Limit resize calls to avoid flickering
        respond('resize');
      }
      else {
        // Frame is gone, unregister.
        window.removeEventListener('resize', resize);
      }
    };
    window.addEventListener('resize', resize, false);

    // Respond to let the iframe know we can resize it
    respond('hello');
  };

  /**
   * Prepare iframe resize.
   *
   * @private
   * @param {Object} iframe Element
   * @param {Object} data Payload
   * @param {Function} respond Send a response to the iframe
   */
  actionHandlers.prepareResize = function (iframe, data, respond) {
    // Do not resize unless page and scrolling differs
    if (iframe.clientHeight !== data.scrollHeight ||
        data.scrollHeight !== data.clientHeight) {

      // Reset iframe height, in case content has shrinked.
      iframe.style.height = data.clientHeight + 'px';
      respond('resizePrepared');
    }
  };

  /**
   * Resize parent and iframe to desired height.
   *
   * @private
   * @param {Object} iframe Element
   * @param {Object} data Payload
   * @param {Function} respond Send a response to the iframe
   */
  actionHandlers.resize = function (iframe, data, respond) {
    // Resize iframe so all content is visible. Use scrollHeight to make sure we get everything
    iframe.style.height = data.scrollHeight + 'px';
  };

  /**
   * Keyup event handler. Exits full screen on escape.
   *
   * @param {Event} event
   */
  var escape = function (event) {
    if (event.keyCode === 27) {
      exitFullScreen();
    }
  };

  // Listen for messages from iframes
  window.addEventListener('message', function receiveMessage(event) {
    if (event.data.context !== 'h5p') {
      return; // Only handle h5p requests.
    }

    // Find out who sent the message
    var iframe, iframes = document.getElementsByTagName('iframe');
    for (var i = 0; i < iframes.length; i++) {
      if (iframes[i].contentWindow === event.source) {
        iframe = iframes[i];
        break;
      }
    }

    if (!iframe) {
      return; // Cannot find sender
    }

    // Find action handler handler
    if (actionHandlers[event.data.action]) {
      actionHandlers[event.data.action](iframe, event.data, function respond(action, data) {
        if (data === undefined) {
          data = {};
        }
        data.action = action;
        data.context = 'h5p';
        event.source.postMessage(data, event.origin);
      });
    }
  }, false);

function resizeIFrameToFitContent( iFrame ) {

    iFrame.width  = iFrame.contentWindow.document.body.scrollWidth;
    iFrame.height = iFrame.contentWindow.document.body.scrollHeight;
}

  // Let h5p iframes know we're ready!
  var iframes = document.getElementsByTagName('iframe');
  var ready = {
    context: 'h5p',
    action: 'ready'
  };
  for (var i = 0; i < iframes.length; i++) {
    if (iframes[i].src.indexOf('h5p') !== -1) {
      iframes[i].contentWindow.postMessage(ready, '*');
    } 
  }

})();
/*!

 handlebars v1.3.0

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/
/* exported Handlebars */
var Handlebars = (function() {
// handlebars/safe-string.js
var __module4__ = (function() {
  "use strict";
  var __exports__;
  // Build out our basic SafeString type
  function SafeString(string) {
    this.string = string;
  }

  SafeString.prototype.toString = function() {
    return "" + this.string;
  };

  __exports__ = SafeString;
  return __exports__;
})();

// handlebars/utils.js
var __module3__ = (function(__dependency1__) {
  "use strict";
  var __exports__ = {};
  /*jshint -W004 */
  var SafeString = __dependency1__;

  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  function escapeChar(chr) {
    return escape[chr] || "&amp;";
  }

  function extend(obj, value) {
    for(var key in value) {
      if(Object.prototype.hasOwnProperty.call(value, key)) {
        obj[key] = value[key];
      }
    }
  }

  __exports__.extend = extend;var toString = Object.prototype.toString;
  __exports__.toString = toString;
  // Sourced from lodash
  // https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
  var isFunction = function(value) {
    return typeof value === 'function';
  };
  // fallback for older versions of Chrome and Safari
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return typeof value === 'function' && toString.call(value) === '[object Function]';
    };
  }
  var isFunction;
  __exports__.isFunction = isFunction;
  var isArray = Array.isArray || function(value) {
    return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
  };
  __exports__.isArray = isArray;

  function escapeExpression(string) {
    // don't escape SafeStrings, since they're already safe
    if (string instanceof SafeString) {
      return string.toString();
    } else if (!string && string !== 0) {
      return "";
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = "" + string;

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  }

  __exports__.escapeExpression = escapeExpression;function isEmpty(value) {
    if (!value && value !== 0) {
      return true;
    } else if (isArray(value) && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  __exports__.isEmpty = isEmpty;
  return __exports__;
})(__module4__);

// handlebars/exception.js
var __module5__ = (function() {
  "use strict";
  var __exports__;

  var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

  function Exception(message, node) {
    var line;
    if (node && node.firstLine) {
      line = node.firstLine;

      message += ' - ' + line + ':' + node.firstColumn;
    }

    var tmp = Error.prototype.constructor.call(this, message);

    // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
    for (var idx = 0; idx < errorProps.length; idx++) {
      this[errorProps[idx]] = tmp[errorProps[idx]];
    }

    if (line) {
      this.lineNumber = line;
      this.column = node.firstColumn;
    }
  }

  Exception.prototype = new Error();

  __exports__ = Exception;
  return __exports__;
})();

// handlebars/base.js
var __module2__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;

  var VERSION = "1.3.0";
  __exports__.VERSION = VERSION;var COMPILER_REVISION = 4;
  __exports__.COMPILER_REVISION = COMPILER_REVISION;
  var REVISION_CHANGES = {
    1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
    2: '== 1.0.0-rc.3',
    3: '== 1.0.0-rc.4',
    4: '>= 1.0.0'
  };
  __exports__.REVISION_CHANGES = REVISION_CHANGES;
  var isArray = Utils.isArray,
      isFunction = Utils.isFunction,
      toString = Utils.toString,
      objectType = '[object Object]';

  function HandlebarsEnvironment(helpers, partials) {
    this.helpers = helpers || {};
    this.partials = partials || {};

    registerDefaultHelpers(this);
  }

  __exports__.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
    constructor: HandlebarsEnvironment,

    logger: logger,
    log: log,

    registerHelper: function(name, fn, inverse) {
      if (toString.call(name) === objectType) {
        if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
        Utils.extend(this.helpers, name);
      } else {
        if (inverse) { fn.not = inverse; }
        this.helpers[name] = fn;
      }
    },

    registerPartial: function(name, str) {
      if (toString.call(name) === objectType) {
        Utils.extend(this.partials,  name);
      } else {
        this.partials[name] = str;
      }
    }
  };

  function registerDefaultHelpers(instance) {
    instance.registerHelper('helperMissing', function(arg) {
      if(arguments.length === 2) {
        return undefined;
      } else {
        throw new Exception("Missing helper: '" + arg + "'");
      }
    });

    instance.registerHelper('blockHelperMissing', function(context, options) {
      var inverse = options.inverse || function() {}, fn = options.fn;

      if (isFunction(context)) { context = context.call(this); }

      if(context === true) {
        return fn(this);
      } else if(context === false || context == null) {
        return inverse(this);
      } else if (isArray(context)) {
        if(context.length > 0) {
          return instance.helpers.each(context, options);
        } else {
          return inverse(this);
        }
      } else {
        return fn(context);
      }
    });

    instance.registerHelper('each', function(context, options) {
      var fn = options.fn, inverse = options.inverse;
      var i = 0, ret = "", data;

      if (isFunction(context)) { context = context.call(this); }

      if (options.data) {
        data = createFrame(options.data);
      }

      if(context && typeof context === 'object') {
        if (isArray(context)) {
          for(var j = context.length; i<j; i++) {
            if (data) {
              data.index = i;
              data.first = (i === 0);
              data.last  = (i === (context.length-1));
            }
            ret = ret + fn(context[i], { data: data });
          }
        } else {
          for(var key in context) {
            if(context.hasOwnProperty(key)) {
              if(data) { 
                data.key = key; 
                data.index = i;
                data.first = (i === 0);
              }
              ret = ret + fn(context[key], {data: data});
              i++;
            }
          }
        }
      }

      if(i === 0){
        ret = inverse(this);
      }

      return ret;
    });

    instance.registerHelper('if', function(conditional, options) {
      if (isFunction(conditional)) { conditional = conditional.call(this); }

      // Default behavior is to render the positive path if the value is truthy and not empty.
      // The `includeZero` option may be set to treat the condtional as purely not empty based on the
      // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
      if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    });

    instance.registerHelper('unless', function(conditional, options) {
      return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
    });

    instance.registerHelper('with', function(context, options) {
      if (isFunction(context)) { context = context.call(this); }

      if (!Utils.isEmpty(context)) return options.fn(context);
    });

    instance.registerHelper('log', function(context, options) {
      var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
      instance.log(level, context);
    });
  }

  var logger = {
    methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

    // State enum
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    level: 3,

    // can be overridden in the host environment
    log: function(level, obj) {
      if (logger.level <= level) {
        var method = logger.methodMap[level];
        if (typeof console !== 'undefined' && console[method]) {
          console[method].call(console, obj);
        }
      }
    }
  };
  __exports__.logger = logger;
  function log(level, obj) { logger.log(level, obj); }

  __exports__.log = log;var createFrame = function(object) {
    var obj = {};
    Utils.extend(obj, object);
    return obj;
  };
  __exports__.createFrame = createFrame;
  return __exports__;
})(__module3__, __module5__);

// handlebars/runtime.js
var __module6__ = (function(__dependency1__, __dependency2__, __dependency3__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;
  var COMPILER_REVISION = __dependency3__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency3__.REVISION_CHANGES;

  function checkRevision(compilerInfo) {
    var compilerRevision = compilerInfo && compilerInfo[0] || 1,
        currentRevision = COMPILER_REVISION;

    if (compilerRevision !== currentRevision) {
      if (compilerRevision < currentRevision) {
        var runtimeVersions = REVISION_CHANGES[currentRevision],
            compilerVersions = REVISION_CHANGES[compilerRevision];
        throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
              "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
      } else {
        // Use the embedded version info since the runtime doesn't know about this revision yet
        throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
              "Please update your runtime to a newer version ("+compilerInfo[1]+").");
      }
    }
  }

  __exports__.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

  function template(templateSpec, env) {
    if (!env) {
      throw new Exception("No environment passed to template");
    }

    // Note: Using env.VM references rather than local var references throughout this section to allow
    // for external users to override these as psuedo-supported APIs.
    var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
      var result = env.VM.invokePartial.apply(this, arguments);
      if (result != null) { return result; }

      if (env.compile) {
        var options = { helpers: helpers, partials: partials, data: data };
        partials[name] = env.compile(partial, { data: data !== undefined }, env);
        return partials[name](context, options);
      } else {
        throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
      }
    };

    // Just add water
    var container = {
      escapeExpression: Utils.escapeExpression,
      invokePartial: invokePartialWrapper,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          programWrapper = program(i, fn, data);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = program(i, fn);
        }
        return programWrapper;
      },
      merge: function(param, common) {
        var ret = param || common;

        if (param && common && (param !== common)) {
          ret = {};
          Utils.extend(ret, common);
          Utils.extend(ret, param);
        }
        return ret;
      },
      programWithDepth: env.VM.programWithDepth,
      noop: env.VM.noop,
      compilerInfo: null
    };

    return function(context, options) {
      options = options || {};
      var namespace = options.partial ? options : env,
          helpers,
          partials;

      if (!options.partial) {
        helpers = options.helpers;
        partials = options.partials;
      }
      var result = templateSpec.call(
            container,
            namespace, context,
            helpers,
            partials,
            options.data);

      if (!options.partial) {
        env.VM.checkRevision(container.compilerInfo);
      }

      return result;
    };
  }

  __exports__.template = template;function programWithDepth(i, fn, data /*, $depth */) {
    var args = Array.prototype.slice.call(arguments, 3);

    var prog = function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
    prog.program = i;
    prog.depth = args.length;
    return prog;
  }

  __exports__.programWithDepth = programWithDepth;function program(i, fn, data) {
    var prog = function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
    prog.program = i;
    prog.depth = 0;
    return prog;
  }

  __exports__.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
    var options = { partial: true, helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    }
  }

  __exports__.invokePartial = invokePartial;function noop() { return ""; }

  __exports__.noop = noop;
  return __exports__;
})(__module3__, __module5__, __module2__);

// handlebars.runtime.js
var __module1__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__;
  /*globals Handlebars: true */
  var base = __dependency1__;

  // Each of these augment the Handlebars object. No need to setup here.
  // (This is done to easily share code between commonjs and browse envs)
  var SafeString = __dependency2__;
  var Exception = __dependency3__;
  var Utils = __dependency4__;
  var runtime = __dependency5__;

  // For compatibility and usage outside of module systems, make the Handlebars object a namespace
  var create = function() {
    var hb = new base.HandlebarsEnvironment();

    Utils.extend(hb, base);
    hb.SafeString = SafeString;
    hb.Exception = Exception;
    hb.Utils = Utils;

    hb.VM = runtime;
    hb.template = function(spec) {
      return runtime.template(spec, hb);
    };

    return hb;
  };

  var Handlebars = create();
  Handlebars.create = create;

  __exports__ = Handlebars;
  return __exports__;
})(__module2__, __module4__, __module5__, __module3__, __module6__);

// handlebars/compiler/ast.js
var __module7__ = (function(__dependency1__) {
  "use strict";
  var __exports__;
  var Exception = __dependency1__;

  function LocationInfo(locInfo){
    locInfo = locInfo || {};
    this.firstLine   = locInfo.first_line;
    this.firstColumn = locInfo.first_column;
    this.lastColumn  = locInfo.last_column;
    this.lastLine    = locInfo.last_line;
  }

  var AST = {
    ProgramNode: function(statements, inverseStrip, inverse, locInfo) {
      var inverseLocationInfo, firstInverseNode;
      if (arguments.length === 3) {
        locInfo = inverse;
        inverse = null;
      } else if (arguments.length === 2) {
        locInfo = inverseStrip;
        inverseStrip = null;
      }

      LocationInfo.call(this, locInfo);
      this.type = "program";
      this.statements = statements;
      this.strip = {};

      if(inverse) {
        firstInverseNode = inverse[0];
        if (firstInverseNode) {
          inverseLocationInfo = {
            first_line: firstInverseNode.firstLine,
            last_line: firstInverseNode.lastLine,
            last_column: firstInverseNode.lastColumn,
            first_column: firstInverseNode.firstColumn
          };
          this.inverse = new AST.ProgramNode(inverse, inverseStrip, inverseLocationInfo);
        } else {
          this.inverse = new AST.ProgramNode(inverse, inverseStrip);
        }
        this.strip.right = inverseStrip.left;
      } else if (inverseStrip) {
        this.strip.left = inverseStrip.right;
      }
    },

    MustacheNode: function(rawParams, hash, open, strip, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "mustache";
      this.strip = strip;

      // Open may be a string parsed from the parser or a passed boolean flag
      if (open != null && open.charAt) {
        // Must use charAt to support IE pre-10
        var escapeFlag = open.charAt(3) || open.charAt(2);
        this.escaped = escapeFlag !== '{' && escapeFlag !== '&';
      } else {
        this.escaped = !!open;
      }

      if (rawParams instanceof AST.SexprNode) {
        this.sexpr = rawParams;
      } else {
        // Support old AST API
        this.sexpr = new AST.SexprNode(rawParams, hash);
      }

      this.sexpr.isRoot = true;

      // Support old AST API that stored this info in MustacheNode
      this.id = this.sexpr.id;
      this.params = this.sexpr.params;
      this.hash = this.sexpr.hash;
      this.eligibleHelper = this.sexpr.eligibleHelper;
      this.isHelper = this.sexpr.isHelper;
    },

    SexprNode: function(rawParams, hash, locInfo) {
      LocationInfo.call(this, locInfo);

      this.type = "sexpr";
      this.hash = hash;

      var id = this.id = rawParams[0];
      var params = this.params = rawParams.slice(1);

      // a mustache is an eligible helper if:
      // * its id is simple (a single part, not `this` or `..`)
      var eligibleHelper = this.eligibleHelper = id.isSimple;

      // a mustache is definitely a helper if:
      // * it is an eligible helper, and
      // * it has at least one parameter or hash segment
      this.isHelper = eligibleHelper && (params.length || hash);

      // if a mustache is an eligible helper but not a definite
      // helper, it is ambiguous, and will be resolved in a later
      // pass or at runtime.
    },

    PartialNode: function(partialName, context, strip, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type         = "partial";
      this.partialName  = partialName;
      this.context      = context;
      this.strip = strip;
    },

    BlockNode: function(mustache, program, inverse, close, locInfo) {
      LocationInfo.call(this, locInfo);

      if(mustache.sexpr.id.original !== close.path.original) {
        throw new Exception(mustache.sexpr.id.original + " doesn't match " + close.path.original, this);
      }

      this.type = 'block';
      this.mustache = mustache;
      this.program  = program;
      this.inverse  = inverse;

      this.strip = {
        left: mustache.strip.left,
        right: close.strip.right
      };

      (program || inverse).strip.left = mustache.strip.right;
      (inverse || program).strip.right = close.strip.left;

      if (inverse && !program) {
        this.isInverse = true;
      }
    },

    ContentNode: function(string, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "content";
      this.string = string;
    },

    HashNode: function(pairs, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "hash";
      this.pairs = pairs;
    },

    IdNode: function(parts, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "ID";

      var original = "",
          dig = [],
          depth = 0;

      for(var i=0,l=parts.length; i<l; i++) {
        var part = parts[i].part;
        original += (parts[i].separator || '') + part;

        if (part === ".." || part === "." || part === "this") {
          if (dig.length > 0) {
            throw new Exception("Invalid path: " + original, this);
          } else if (part === "..") {
            depth++;
          } else {
            this.isScoped = true;
          }
        } else {
          dig.push(part);
        }
      }

      this.original = original;
      this.parts    = dig;
      this.string   = dig.join('.');
      this.depth    = depth;

      // an ID is simple if it only has one part, and that part is not
      // `..` or `this`.
      this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;

      this.stringModeValue = this.string;
    },

    PartialNameNode: function(name, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "PARTIAL_NAME";
      this.name = name.original;
    },

    DataNode: function(id, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "DATA";
      this.id = id;
    },

    StringNode: function(string, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "STRING";
      this.original =
        this.string =
        this.stringModeValue = string;
    },

    IntegerNode: function(integer, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "INTEGER";
      this.original =
        this.integer = integer;
      this.stringModeValue = Number(integer);
    },

    BooleanNode: function(bool, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "BOOLEAN";
      this.bool = bool;
      this.stringModeValue = bool === "true";
    },

    CommentNode: function(comment, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "comment";
      this.comment = comment;
    }
  };

  // Must be exported as an object rather than the root of the module as the jison lexer
  // most modify the object to operate properly.
  __exports__ = AST;
  return __exports__;
})(__module5__);

// handlebars/compiler/parser.js
var __module9__ = (function() {
  "use strict";
  var __exports__;
  /* jshint ignore:start */
  /* Jison generated parser */
  var handlebars = (function(){
  var parser = {trace: function trace() { },
  yy: {},
  symbols_: {"error":2,"root":3,"statements":4,"EOF":5,"program":6,"simpleInverse":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"sexpr":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"CLOSE_UNESCAPED":24,"OPEN_PARTIAL":25,"partialName":26,"partial_option0":27,"sexpr_repetition0":28,"sexpr_option0":29,"dataName":30,"param":31,"STRING":32,"INTEGER":33,"BOOLEAN":34,"OPEN_SEXPR":35,"CLOSE_SEXPR":36,"hash":37,"hash_repetition_plus0":38,"hashSegment":39,"ID":40,"EQUALS":41,"DATA":42,"pathSegments":43,"SEP":44,"$accept":0,"$end":1},
  terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"CLOSE_UNESCAPED",25:"OPEN_PARTIAL",32:"STRING",33:"INTEGER",34:"BOOLEAN",35:"OPEN_SEXPR",36:"CLOSE_SEXPR",40:"ID",41:"EQUALS",42:"DATA",44:"SEP"},
  productions_: [0,[3,2],[3,1],[6,2],[6,3],[6,2],[6,1],[6,1],[6,0],[4,1],[4,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,4],[7,2],[17,3],[17,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,3],[37,1],[39,3],[26,1],[26,1],[26,1],[30,2],[21,1],[43,3],[43,1],[27,0],[27,1],[28,0],[28,2],[29,0],[29,1],[38,1],[38,2]],
  performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

  var $0 = $$.length - 1;
  switch (yystate) {
  case 1: return new yy.ProgramNode($$[$0-1], this._$); 
  break;
  case 2: return new yy.ProgramNode([], this._$); 
  break;
  case 3:this.$ = new yy.ProgramNode([], $$[$0-1], $$[$0], this._$);
  break;
  case 4:this.$ = new yy.ProgramNode($$[$0-2], $$[$0-1], $$[$0], this._$);
  break;
  case 5:this.$ = new yy.ProgramNode($$[$0-1], $$[$0], [], this._$);
  break;
  case 6:this.$ = new yy.ProgramNode($$[$0], this._$);
  break;
  case 7:this.$ = new yy.ProgramNode([], this._$);
  break;
  case 8:this.$ = new yy.ProgramNode([], this._$);
  break;
  case 9:this.$ = [$$[$0]];
  break;
  case 10: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
  break;
  case 11:this.$ = new yy.BlockNode($$[$0-2], $$[$0-1].inverse, $$[$0-1], $$[$0], this._$);
  break;
  case 12:this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0-1].inverse, $$[$0], this._$);
  break;
  case 13:this.$ = $$[$0];
  break;
  case 14:this.$ = $$[$0];
  break;
  case 15:this.$ = new yy.ContentNode($$[$0], this._$);
  break;
  case 16:this.$ = new yy.CommentNode($$[$0], this._$);
  break;
  case 17:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 18:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 19:this.$ = {path: $$[$0-1], strip: stripFlags($$[$0-2], $$[$0])};
  break;
  case 20:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 21:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 22:this.$ = new yy.PartialNode($$[$0-2], $$[$0-1], stripFlags($$[$0-3], $$[$0]), this._$);
  break;
  case 23:this.$ = stripFlags($$[$0-1], $$[$0]);
  break;
  case 24:this.$ = new yy.SexprNode([$$[$0-2]].concat($$[$0-1]), $$[$0], this._$);
  break;
  case 25:this.$ = new yy.SexprNode([$$[$0]], null, this._$);
  break;
  case 26:this.$ = $$[$0];
  break;
  case 27:this.$ = new yy.StringNode($$[$0], this._$);
  break;
  case 28:this.$ = new yy.IntegerNode($$[$0], this._$);
  break;
  case 29:this.$ = new yy.BooleanNode($$[$0], this._$);
  break;
  case 30:this.$ = $$[$0];
  break;
  case 31:$$[$0-1].isHelper = true; this.$ = $$[$0-1];
  break;
  case 32:this.$ = new yy.HashNode($$[$0], this._$);
  break;
  case 33:this.$ = [$$[$0-2], $$[$0]];
  break;
  case 34:this.$ = new yy.PartialNameNode($$[$0], this._$);
  break;
  case 35:this.$ = new yy.PartialNameNode(new yy.StringNode($$[$0], this._$), this._$);
  break;
  case 36:this.$ = new yy.PartialNameNode(new yy.IntegerNode($$[$0], this._$));
  break;
  case 37:this.$ = new yy.DataNode($$[$0], this._$);
  break;
  case 38:this.$ = new yy.IdNode($$[$0], this._$);
  break;
  case 39: $$[$0-2].push({part: $$[$0], separator: $$[$0-1]}); this.$ = $$[$0-2]; 
  break;
  case 40:this.$ = [{part: $$[$0]}];
  break;
  case 43:this.$ = [];
  break;
  case 44:$$[$0-1].push($$[$0]);
  break;
  case 47:this.$ = [$$[$0]];
  break;
  case 48:$$[$0-1].push($$[$0]);
  break;
  }
  },
  table: [{3:1,4:2,5:[1,3],8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],25:[1,15]},{1:[3]},{5:[1,16],8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],25:[1,15]},{1:[2,2]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],25:[2,9]},{4:20,6:18,7:19,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,21],20:[2,8],22:[1,13],23:[1,14],25:[1,15]},{4:20,6:22,7:19,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,21],20:[2,8],22:[1,13],23:[1,14],25:[1,15]},{5:[2,13],14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],25:[2,13]},{5:[2,14],14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],25:[2,14]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],25:[2,15]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],25:[2,16]},{17:23,21:24,30:25,40:[1,28],42:[1,27],43:26},{17:29,21:24,30:25,40:[1,28],42:[1,27],43:26},{17:30,21:24,30:25,40:[1,28],42:[1,27],43:26},{17:31,21:24,30:25,40:[1,28],42:[1,27],43:26},{21:33,26:32,32:[1,34],33:[1,35],40:[1,28],43:26},{1:[2,1]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],25:[2,10]},{10:36,20:[1,37]},{4:38,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,7],22:[1,13],23:[1,14],25:[1,15]},{7:39,8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,21],20:[2,6],22:[1,13],23:[1,14],25:[1,15]},{17:23,18:[1,40],21:24,30:25,40:[1,28],42:[1,27],43:26},{10:41,20:[1,37]},{18:[1,42]},{18:[2,43],24:[2,43],28:43,32:[2,43],33:[2,43],34:[2,43],35:[2,43],36:[2,43],40:[2,43],42:[2,43]},{18:[2,25],24:[2,25],36:[2,25]},{18:[2,38],24:[2,38],32:[2,38],33:[2,38],34:[2,38],35:[2,38],36:[2,38],40:[2,38],42:[2,38],44:[1,44]},{21:45,40:[1,28],43:26},{18:[2,40],24:[2,40],32:[2,40],33:[2,40],34:[2,40],35:[2,40],36:[2,40],40:[2,40],42:[2,40],44:[2,40]},{18:[1,46]},{18:[1,47]},{24:[1,48]},{18:[2,41],21:50,27:49,40:[1,28],43:26},{18:[2,34],40:[2,34]},{18:[2,35],40:[2,35]},{18:[2,36],40:[2,36]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],25:[2,11]},{21:51,40:[1,28],43:26},{8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,3],22:[1,13],23:[1,14],25:[1,15]},{4:52,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,5],22:[1,13],23:[1,14],25:[1,15]},{14:[2,23],15:[2,23],16:[2,23],19:[2,23],20:[2,23],22:[2,23],23:[2,23],25:[2,23]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],25:[2,12]},{14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],25:[2,18]},{18:[2,45],21:56,24:[2,45],29:53,30:60,31:54,32:[1,57],33:[1,58],34:[1,59],35:[1,61],36:[2,45],37:55,38:62,39:63,40:[1,64],42:[1,27],43:26},{40:[1,65]},{18:[2,37],24:[2,37],32:[2,37],33:[2,37],34:[2,37],35:[2,37],36:[2,37],40:[2,37],42:[2,37]},{14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],25:[2,17]},{5:[2,20],14:[2,20],15:[2,20],16:[2,20],19:[2,20],20:[2,20],22:[2,20],23:[2,20],25:[2,20]},{5:[2,21],14:[2,21],15:[2,21],16:[2,21],19:[2,21],20:[2,21],22:[2,21],23:[2,21],25:[2,21]},{18:[1,66]},{18:[2,42]},{18:[1,67]},{8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],25:[1,15]},{18:[2,24],24:[2,24],36:[2,24]},{18:[2,44],24:[2,44],32:[2,44],33:[2,44],34:[2,44],35:[2,44],36:[2,44],40:[2,44],42:[2,44]},{18:[2,46],24:[2,46],36:[2,46]},{18:[2,26],24:[2,26],32:[2,26],33:[2,26],34:[2,26],35:[2,26],36:[2,26],40:[2,26],42:[2,26]},{18:[2,27],24:[2,27],32:[2,27],33:[2,27],34:[2,27],35:[2,27],36:[2,27],40:[2,27],42:[2,27]},{18:[2,28],24:[2,28],32:[2,28],33:[2,28],34:[2,28],35:[2,28],36:[2,28],40:[2,28],42:[2,28]},{18:[2,29],24:[2,29],32:[2,29],33:[2,29],34:[2,29],35:[2,29],36:[2,29],40:[2,29],42:[2,29]},{18:[2,30],24:[2,30],32:[2,30],33:[2,30],34:[2,30],35:[2,30],36:[2,30],40:[2,30],42:[2,30]},{17:68,21:24,30:25,40:[1,28],42:[1,27],43:26},{18:[2,32],24:[2,32],36:[2,32],39:69,40:[1,70]},{18:[2,47],24:[2,47],36:[2,47],40:[2,47]},{18:[2,40],24:[2,40],32:[2,40],33:[2,40],34:[2,40],35:[2,40],36:[2,40],40:[2,40],41:[1,71],42:[2,40],44:[2,40]},{18:[2,39],24:[2,39],32:[2,39],33:[2,39],34:[2,39],35:[2,39],36:[2,39],40:[2,39],42:[2,39],44:[2,39]},{5:[2,22],14:[2,22],15:[2,22],16:[2,22],19:[2,22],20:[2,22],22:[2,22],23:[2,22],25:[2,22]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],25:[2,19]},{36:[1,72]},{18:[2,48],24:[2,48],36:[2,48],40:[2,48]},{41:[1,71]},{21:56,30:60,31:73,32:[1,57],33:[1,58],34:[1,59],35:[1,61],40:[1,28],42:[1,27],43:26},{18:[2,31],24:[2,31],32:[2,31],33:[2,31],34:[2,31],35:[2,31],36:[2,31],40:[2,31],42:[2,31]},{18:[2,33],24:[2,33],36:[2,33],40:[2,33]}],
  defaultActions: {3:[2,2],16:[2,1],50:[2,42]},
  parseError: function parseError(str, hash) {
      throw new Error(str);
  },
  parse: function parse(input) {
      var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
      this.lexer.setInput(input);
      this.lexer.yy = this.yy;
      this.yy.lexer = this.lexer;
      this.yy.parser = this;
      if (typeof this.lexer.yylloc == "undefined")
          this.lexer.yylloc = {};
      var yyloc = this.lexer.yylloc;
      lstack.push(yyloc);
      var ranges = this.lexer.options && this.lexer.options.ranges;
      if (typeof this.yy.parseError === "function")
          this.parseError = this.yy.parseError;
      function popStack(n) {
          stack.length = stack.length - 2 * n;
          vstack.length = vstack.length - n;
          lstack.length = lstack.length - n;
      }
      function lex() {
          var token;
          token = self.lexer.lex() || 1;
          if (typeof token !== "number") {
              token = self.symbols_[token] || token;
          }
          return token;
      }
      var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
      while (true) {
          state = stack[stack.length - 1];
          if (this.defaultActions[state]) {
              action = this.defaultActions[state];
          } else {
              if (symbol === null || typeof symbol == "undefined") {
                  symbol = lex();
              }
              action = table[state] && table[state][symbol];
          }
          if (typeof action === "undefined" || !action.length || !action[0]) {
              var errStr = "";
              if (!recovering) {
                  expected = [];
                  for (p in table[state])
                      if (this.terminals_[p] && p > 2) {
                          expected.push("'" + this.terminals_[p] + "'");
                      }
                  if (this.lexer.showPosition) {
                      errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                  } else {
                      errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                  }
                  this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
              }
          }
          if (action[0] instanceof Array && action.length > 1) {
              throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
          }
          switch (action[0]) {
          case 1:
              stack.push(symbol);
              vstack.push(this.lexer.yytext);
              lstack.push(this.lexer.yylloc);
              stack.push(action[1]);
              symbol = null;
              if (!preErrorSymbol) {
                  yyleng = this.lexer.yyleng;
                  yytext = this.lexer.yytext;
                  yylineno = this.lexer.yylineno;
                  yyloc = this.lexer.yylloc;
                  if (recovering > 0)
                      recovering--;
              } else {
                  symbol = preErrorSymbol;
                  preErrorSymbol = null;
              }
              break;
          case 2:
              len = this.productions_[action[1]][1];
              yyval.$ = vstack[vstack.length - len];
              yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
              if (ranges) {
                  yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
              }
              r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
              if (typeof r !== "undefined") {
                  return r;
              }
              if (len) {
                  stack = stack.slice(0, -1 * len * 2);
                  vstack = vstack.slice(0, -1 * len);
                  lstack = lstack.slice(0, -1 * len);
              }
              stack.push(this.productions_[action[1]][0]);
              vstack.push(yyval.$);
              lstack.push(yyval._$);
              newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
              stack.push(newState);
              break;
          case 3:
              return true;
          }
      }
      return true;
  }
  };


  function stripFlags(open, close) {
    return {
      left: open.charAt(2) === '~',
      right: close.charAt(0) === '~' || close.charAt(1) === '~'
    };
  }

  /* Jison generated lexer */
  var lexer = (function(){
  var lexer = ({EOF:1,
  parseError:function parseError(str, hash) {
          if (this.yy.parser) {
              this.yy.parser.parseError(str, hash);
          } else {
              throw new Error(str);
          }
      },
  setInput:function (input) {
          this._input = input;
          this._more = this._less = this.done = false;
          this.yylineno = this.yyleng = 0;
          this.yytext = this.matched = this.match = '';
          this.conditionStack = ['INITIAL'];
          this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
          if (this.options.ranges) this.yylloc.range = [0,0];
          this.offset = 0;
          return this;
      },
  input:function () {
          var ch = this._input[0];
          this.yytext += ch;
          this.yyleng++;
          this.offset++;
          this.match += ch;
          this.matched += ch;
          var lines = ch.match(/(?:\r\n?|\n).*/g);
          if (lines) {
              this.yylineno++;
              this.yylloc.last_line++;
          } else {
              this.yylloc.last_column++;
          }
          if (this.options.ranges) this.yylloc.range[1]++;

          this._input = this._input.slice(1);
          return ch;
      },
  unput:function (ch) {
          var len = ch.length;
          var lines = ch.split(/(?:\r\n?|\n)/g);

          this._input = ch + this._input;
          this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
          //this.yyleng -= len;
          this.offset -= len;
          var oldLines = this.match.split(/(?:\r\n?|\n)/g);
          this.match = this.match.substr(0, this.match.length-1);
          this.matched = this.matched.substr(0, this.matched.length-1);

          if (lines.length-1) this.yylineno -= lines.length-1;
          var r = this.yylloc.range;

          this.yylloc = {first_line: this.yylloc.first_line,
            last_line: this.yylineno+1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
                this.yylloc.first_column - len
            };

          if (this.options.ranges) {
              this.yylloc.range = [r[0], r[0] + this.yyleng - len];
          }
          return this;
      },
  more:function () {
          this._more = true;
          return this;
      },
  less:function (n) {
          this.unput(this.match.slice(n));
      },
  pastInput:function () {
          var past = this.matched.substr(0, this.matched.length - this.match.length);
          return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
      },
  upcomingInput:function () {
          var next = this.match;
          if (next.length < 20) {
              next += this._input.substr(0, 20-next.length);
          }
          return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
      },
  showPosition:function () {
          var pre = this.pastInput();
          var c = new Array(pre.length + 1).join("-");
          return pre + this.upcomingInput() + "\n" + c+"^";
      },
  next:function () {
          if (this.done) {
              return this.EOF;
          }
          if (!this._input) this.done = true;

          var token,
              match,
              tempMatch,
              index,
              col,
              lines;
          if (!this._more) {
              this.yytext = '';
              this.match = '';
          }
          var rules = this._currentRules();
          for (var i=0;i < rules.length; i++) {
              tempMatch = this._input.match(this.rules[rules[i]]);
              if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                  match = tempMatch;
                  index = i;
                  if (!this.options.flex) break;
              }
          }
          if (match) {
              lines = match[0].match(/(?:\r\n?|\n).*/g);
              if (lines) this.yylineno += lines.length;
              this.yylloc = {first_line: this.yylloc.last_line,
                             last_line: this.yylineno+1,
                             first_column: this.yylloc.last_column,
                             last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
              this.yytext += match[0];
              this.match += match[0];
              this.matches = match;
              this.yyleng = this.yytext.length;
              if (this.options.ranges) {
                  this.yylloc.range = [this.offset, this.offset += this.yyleng];
              }
              this._more = false;
              this._input = this._input.slice(match[0].length);
              this.matched += match[0];
              token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
              if (this.done && this._input) this.done = false;
              if (token) return token;
              else return;
          }
          if (this._input === "") {
              return this.EOF;
          } else {
              return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                      {text: "", token: null, line: this.yylineno});
          }
      },
  lex:function lex() {
          var r = this.next();
          if (typeof r !== 'undefined') {
              return r;
          } else {
              return this.lex();
          }
      },
  begin:function begin(condition) {
          this.conditionStack.push(condition);
      },
  popState:function popState() {
          return this.conditionStack.pop();
      },
  _currentRules:function _currentRules() {
          return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
      },
  topState:function () {
          return this.conditionStack[this.conditionStack.length-2];
      },
  pushState:function begin(condition) {
          this.begin(condition);
      }});
  lexer.options = {};
  lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {


  function strip(start, end) {
    return yy_.yytext = yy_.yytext.substr(start, yy_.yyleng-end);
  }


  var YYSTATE=YY_START
  switch($avoiding_name_collisions) {
  case 0:
                                     if(yy_.yytext.slice(-2) === "\\\\") {
                                       strip(0,1);
                                       this.begin("mu");
                                     } else if(yy_.yytext.slice(-1) === "\\") {
                                       strip(0,1);
                                       this.begin("emu");
                                     } else {
                                       this.begin("mu");
                                     }
                                     if(yy_.yytext) return 14;
                                   
  break;
  case 1:return 14;
  break;
  case 2:
                                     this.popState();
                                     return 14;
                                   
  break;
  case 3:strip(0,4); this.popState(); return 15;
  break;
  case 4:return 35;
  break;
  case 5:return 36;
  break;
  case 6:return 25;
  break;
  case 7:return 16;
  break;
  case 8:return 20;
  break;
  case 9:return 19;
  break;
  case 10:return 19;
  break;
  case 11:return 23;
  break;
  case 12:return 22;
  break;
  case 13:this.popState(); this.begin('com');
  break;
  case 14:strip(3,5); this.popState(); return 15;
  break;
  case 15:return 22;
  break;
  case 16:return 41;
  break;
  case 17:return 40;
  break;
  case 18:return 40;
  break;
  case 19:return 44;
  break;
  case 20:// ignore whitespace
  break;
  case 21:this.popState(); return 24;
  break;
  case 22:this.popState(); return 18;
  break;
  case 23:yy_.yytext = strip(1,2).replace(/\\"/g,'"'); return 32;
  break;
  case 24:yy_.yytext = strip(1,2).replace(/\\'/g,"'"); return 32;
  break;
  case 25:return 42;
  break;
  case 26:return 34;
  break;
  case 27:return 34;
  break;
  case 28:return 33;
  break;
  case 29:return 40;
  break;
  case 30:yy_.yytext = strip(1,2); return 40;
  break;
  case 31:return 'INVALID';
  break;
  case 32:return 5;
  break;
  }
  };
  lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,/^(?:[\s\S]*?--\}\})/,/^(?:\()/,/^(?:\))/,/^(?:\{\{(~)?>)/,/^(?:\{\{(~)?#)/,/^(?:\{\{(~)?\/)/,/^(?:\{\{(~)?\^)/,/^(?:\{\{(~)?\s*else\b)/,/^(?:\{\{(~)?\{)/,/^(?:\{\{(~)?&)/,/^(?:\{\{!--)/,/^(?:\{\{![\s\S]*?\}\})/,/^(?:\{\{(~)?)/,/^(?:=)/,/^(?:\.\.)/,/^(?:\.(?=([=~}\s\/.)])))/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}(~)?\}\})/,/^(?:(~)?\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=([~}\s)])))/,/^(?:false(?=([~}\s)])))/,/^(?:-?[0-9]+(?=([~}\s)])))/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)]))))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/];
  lexer.conditions = {"mu":{"rules":[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"com":{"rules":[3],"inclusive":false},"INITIAL":{"rules":[0,1,32],"inclusive":true}};
  return lexer;})()
  parser.lexer = lexer;
  function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
  return new Parser;
  })();__exports__ = handlebars;
  /* jshint ignore:end */
  return __exports__;
})();

// handlebars/compiler/base.js
var __module8__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__ = {};
  var parser = __dependency1__;
  var AST = __dependency2__;

  __exports__.parser = parser;

  function parse(input) {
    // Just return if an already-compile AST was passed in.
    if(input.constructor === AST.ProgramNode) { return input; }

    parser.yy = AST;
    return parser.parse(input);
  }

  __exports__.parse = parse;
  return __exports__;
})(__module9__, __module7__);

// handlebars/compiler/compiler.js
var __module10__ = (function(__dependency1__) {
  "use strict";
  var __exports__ = {};
  var Exception = __dependency1__;

  function Compiler() {}

  __exports__.Compiler = Compiler;// the foundHelper register will disambiguate helper lookup from finding a
  // function in a context. This is necessary for mustache compatibility, which
  // requires that context functions in blocks are evaluated by blockHelperMissing,
  // and then proceed as if the resulting value was provided to blockHelperMissing.

  Compiler.prototype = {
    compiler: Compiler,

    disassemble: function() {
      var opcodes = this.opcodes, opcode, out = [], params, param;

      for (var i=0, l=opcodes.length; i<l; i++) {
        opcode = opcodes[i];

        if (opcode.opcode === 'DECLARE') {
          out.push("DECLARE " + opcode.name + "=" + opcode.value);
        } else {
          params = [];
          for (var j=0; j<opcode.args.length; j++) {
            param = opcode.args[j];
            if (typeof param === "string") {
              param = "\"" + param.replace("\n", "\\n") + "\"";
            }
            params.push(param);
          }
          out.push(opcode.opcode + " " + params.join(" "));
        }
      }

      return out.join("\n");
    },

    equals: function(other) {
      var len = this.opcodes.length;
      if (other.opcodes.length !== len) {
        return false;
      }

      for (var i = 0; i < len; i++) {
        var opcode = this.opcodes[i],
            otherOpcode = other.opcodes[i];
        if (opcode.opcode !== otherOpcode.opcode || opcode.args.length !== otherOpcode.args.length) {
          return false;
        }
        for (var j = 0; j < opcode.args.length; j++) {
          if (opcode.args[j] !== otherOpcode.args[j]) {
            return false;
          }
        }
      }

      len = this.children.length;
      if (other.children.length !== len) {
        return false;
      }
      for (i = 0; i < len; i++) {
        if (!this.children[i].equals(other.children[i])) {
          return false;
        }
      }

      return true;
    },

    guid: 0,

    compile: function(program, options) {
      this.opcodes = [];
      this.children = [];
      this.depths = {list: []};
      this.options = options;

      // These changes will propagate to the other compiler components
      var knownHelpers = this.options.knownHelpers;
      this.options.knownHelpers = {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true
      };
      if (knownHelpers) {
        for (var name in knownHelpers) {
          this.options.knownHelpers[name] = knownHelpers[name];
        }
      }

      return this.accept(program);
    },

    accept: function(node) {
      var strip = node.strip || {},
          ret;
      if (strip.left) {
        this.opcode('strip');
      }

      ret = this[node.type](node);

      if (strip.right) {
        this.opcode('strip');
      }

      return ret;
    },

    program: function(program) {
      var statements = program.statements;

      for(var i=0, l=statements.length; i<l; i++) {
        this.accept(statements[i]);
      }
      this.isSimple = l === 1;

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
      });

      return this;
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++, depth;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; }
        else { this.addDepth(depth - 1); }
      }

      return guid;
    },

    block: function(block) {
      var mustache = block.mustache,
          program = block.program,
          inverse = block.inverse;

      if (program) {
        program = this.compileProgram(program);
      }

      if (inverse) {
        inverse = this.compileProgram(inverse);
      }

      var sexpr = mustache.sexpr;
      var type = this.classifySexpr(sexpr);

      if (type === "helper") {
        this.helperSexpr(sexpr, program, inverse);
      } else if (type === "simple") {
        this.simpleSexpr(sexpr);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('blockValue');
      } else {
        this.ambiguousSexpr(sexpr, program, inverse);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('ambiguousBlockValue');
      }

      this.opcode('append');
    },

    hash: function(hash) {
      var pairs = hash.pairs, pair, val;

      this.opcode('pushHash');

      for(var i=0, l=pairs.length; i<l; i++) {
        pair = pairs[i];
        val  = pair[1];

        if (this.options.stringParams) {
          if(val.depth) {
            this.addDepth(val.depth);
          }
          this.opcode('getContext', val.depth || 0);
          this.opcode('pushStringParam', val.stringModeValue, val.type);

          if (val.type === 'sexpr') {
            // Subexpressions get evaluated and passed in
            // in string params mode.
            this.sexpr(val);
          }
        } else {
          this.accept(val);
        }

        this.opcode('assignToHash', pair[0]);
      }
      this.opcode('popHash');
    },

    partial: function(partial) {
      var partialName = partial.partialName;
      this.usePartial = true;

      if(partial.context) {
        this.ID(partial.context);
      } else {
        this.opcode('push', 'depth0');
      }

      this.opcode('invokePartial', partialName.name);
      this.opcode('append');
    },

    content: function(content) {
      this.opcode('appendContent', content.string);
    },

    mustache: function(mustache) {
      this.sexpr(mustache.sexpr);

      if(mustache.escaped && !this.options.noEscape) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ambiguousSexpr: function(sexpr, program, inverse) {
      var id = sexpr.id,
          name = id.parts[0],
          isBlock = program != null || inverse != null;

      this.opcode('getContext', id.depth);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      this.opcode('invokeAmbiguous', name, isBlock);
    },

    simpleSexpr: function(sexpr) {
      var id = sexpr.id;

      if (id.type === 'DATA') {
        this.DATA(id);
      } else if (id.parts.length) {
        this.ID(id);
      } else {
        // Simplified ID for `this`
        this.addDepth(id.depth);
        this.opcode('getContext', id.depth);
        this.opcode('pushContext');
      }

      this.opcode('resolvePossibleLambda');
    },

    helperSexpr: function(sexpr, program, inverse) {
      var params = this.setupFullMustacheParams(sexpr, program, inverse),
          name = sexpr.id.parts[0];

      if (this.options.knownHelpers[name]) {
        this.opcode('invokeKnownHelper', params.length, name);
      } else if (this.options.knownHelpersOnly) {
        throw new Exception("You specified knownHelpersOnly, but used the unknown helper " + name, sexpr);
      } else {
        this.opcode('invokeHelper', params.length, name, sexpr.isRoot);
      }
    },

    sexpr: function(sexpr) {
      var type = this.classifySexpr(sexpr);

      if (type === "simple") {
        this.simpleSexpr(sexpr);
      } else if (type === "helper") {
        this.helperSexpr(sexpr);
      } else {
        this.ambiguousSexpr(sexpr);
      }
    },

    ID: function(id) {
      this.addDepth(id.depth);
      this.opcode('getContext', id.depth);

      var name = id.parts[0];
      if (!name) {
        this.opcode('pushContext');
      } else {
        this.opcode('lookupOnContext', id.parts[0]);
      }

      for(var i=1, l=id.parts.length; i<l; i++) {
        this.opcode('lookup', id.parts[i]);
      }
    },

    DATA: function(data) {
      this.options.data = true;
      if (data.id.isScoped || data.id.depth) {
        throw new Exception('Scoped data references are not supported: ' + data.original, data);
      }

      this.opcode('lookupData');
      var parts = data.id.parts;
      for(var i=0, l=parts.length; i<l; i++) {
        this.opcode('lookup', parts[i]);
      }
    },

    STRING: function(string) {
      this.opcode('pushString', string.string);
    },

    INTEGER: function(integer) {
      this.opcode('pushLiteral', integer.integer);
    },

    BOOLEAN: function(bool) {
      this.opcode('pushLiteral', bool.bool);
    },

    comment: function() {},

    // HELPERS
    opcode: function(name) {
      this.opcodes.push({ opcode: name, args: [].slice.call(arguments, 1) });
    },

    declare: function(name, value) {
      this.opcodes.push({ opcode: 'DECLARE', name: name, value: value });
    },

    addDepth: function(depth) {
      if(depth === 0) { return; }

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
      }
    },

    classifySexpr: function(sexpr) {
      var isHelper   = sexpr.isHelper;
      var isEligible = sexpr.eligibleHelper;
      var options    = this.options;

      // if ambiguous, we can possibly resolve the ambiguity now
      if (isEligible && !isHelper) {
        var name = sexpr.id.parts[0];

        if (options.knownHelpers[name]) {
          isHelper = true;
        } else if (options.knownHelpersOnly) {
          isEligible = false;
        }
      }

      if (isHelper) { return "helper"; }
      else if (isEligible) { return "ambiguous"; }
      else { return "simple"; }
    },

    pushParams: function(params) {
      var i = params.length, param;

      while(i--) {
        param = params[i];

        if(this.options.stringParams) {
          if(param.depth) {
            this.addDepth(param.depth);
          }

          this.opcode('getContext', param.depth || 0);
          this.opcode('pushStringParam', param.stringModeValue, param.type);

          if (param.type === 'sexpr') {
            // Subexpressions get evaluated and passed in
            // in string params mode.
            this.sexpr(param);
          }
        } else {
          this[param.type](param);
        }
      }
    },

    setupFullMustacheParams: function(sexpr, program, inverse) {
      var params = sexpr.params;
      this.pushParams(params);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      if (sexpr.hash) {
        this.hash(sexpr.hash);
      } else {
        this.opcode('emptyHash');
      }

      return params;
    }
  };

  function precompile(input, options, env) {
    if (input == null || (typeof input !== 'string' && input.constructor !== env.AST.ProgramNode)) {
      throw new Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + input);
    }

    options = options || {};
    if (!('data' in options)) {
      options.data = true;
    }

    var ast = env.parse(input);
    var environment = new env.Compiler().compile(ast, options);
    return new env.JavaScriptCompiler().compile(environment, options);
  }

  __exports__.precompile = precompile;function compile(input, options, env) {
    if (input == null || (typeof input !== 'string' && input.constructor !== env.AST.ProgramNode)) {
      throw new Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
    }

    options = options || {};

    if (!('data' in options)) {
      options.data = true;
    }

    var compiled;

    function compileInput() {
      var ast = env.parse(input);
      var environment = new env.Compiler().compile(ast, options);
      var templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
      return env.template(templateSpec);
    }

    // Template is only compiled on first use and cached after that point.
    return function(context, options) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled.call(this, context, options);
    };
  }

  __exports__.compile = compile;
  return __exports__;
})(__module5__);

// handlebars/compiler/javascript-compiler.js
var __module11__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__;
  var COMPILER_REVISION = __dependency1__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency1__.REVISION_CHANGES;
  var log = __dependency1__.log;
  var Exception = __dependency2__;

  function Literal(value) {
    this.value = value;
  }

  function JavaScriptCompiler() {}

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name /* , type*/) {
      var wrap,
          ret;
      if (parent.indexOf('depth') === 0) {
        wrap = true;
      }

      if (/^[0-9]+$/.test(name)) {
        ret = parent + "[" + name + "]";
      } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
        ret = parent + "." + name;
      }
      else {
        ret = parent + "['" + name + "']";
      }

      if (wrap) {
        return '(' + parent + ' && ' + ret + ')';
      } else {
        return ret;
      }
    },

    compilerInfo: function() {
      var revision = COMPILER_REVISION,
          versions = REVISION_CHANGES[revision];
      return "this.compilerInfo = ["+revision+",'"+versions+"'];\n";
    },

    appendToBuffer: function(string) {
      if (this.environment.isSimple) {
        return "return " + string + ";";
      } else {
        return {
          appendToBuffer: true,
          content: string,
          toString: function() { return "buffer += " + string + ";"; }
        };
      }
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },

    namespace: "Handlebars",
    // END PUBLIC API

    compile: function(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options || {};

      log('debug', this.environment.disassemble() + "\n\n");

      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        programs: [],
        environments: [],
        aliases: { }
      };

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];
      this.registers = { list: [] };
      this.hashes = [];
      this.compileStack = [];
      this.inlineStack = [];

      this.compileChildren(environment, options);

      var opcodes = environment.opcodes, opcode;

      this.i = 0;

      for(var l=opcodes.length; this.i<l; this.i++) {
        opcode = opcodes[this.i];

        if(opcode.opcode === 'DECLARE') {
          this[opcode.name] = opcode.value;
        } else {
          this[opcode.opcode].apply(this, opcode.args);
        }

        // Reset the stripNext flag if it was not set by this operation.
        if (opcode.opcode !== this.stripNext) {
          this.stripNext = false;
        }
      }

      // Flush any trailing content that might be pending.
      this.pushSource('');

      if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
        throw new Exception('Compile completed with content left on stack');
      }

      return this.createFunctionContext(asObject);
    },

    preamble: function() {
      var out = [];

      if (!this.isChild) {
        var namespace = this.namespace;

        var copies = "helpers = this.merge(helpers, " + namespace + ".helpers);";
        if (this.environment.usePartial) { copies = copies + " partials = this.merge(partials, " + namespace + ".partials);"; }
        if (this.options.data) { copies = copies + " data = data || {};"; }
        out.push(copies);
      } else {
        out.push('');
      }

      if (!this.environment.isSimple) {
        out.push(", buffer = " + this.initializeBuffer());
      } else {
        out.push("");
      }

      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = out;
    },

    createFunctionContext: function(asObject) {
      var locals = this.stackVars.concat(this.registers.list);

      if(locals.length > 0) {
        this.source[1] = this.source[1] + ", " + locals.join(", ");
      }

      // Generate minimizer alias mappings
      if (!this.isChild) {
        for (var alias in this.context.aliases) {
          if (this.context.aliases.hasOwnProperty(alias)) {
            this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
          }
        }
      }

      if (this.source[1]) {
        this.source[1] = "var " + this.source[1].substring(2) + ";";
      }

      // Merge children
      if (!this.isChild) {
        this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
      }

      if (!this.environment.isSimple) {
        this.pushSource("return buffer;");
      }

      var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];

      for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
        params.push("depth" + this.environment.depths.list[i]);
      }

      // Perform a second pass over the output to merge content when possible
      var source = this.mergeSource();

      if (!this.isChild) {
        source = this.compilerInfo()+source;
      }

      if (asObject) {
        params.push(source);

        return Function.apply(this, params);
      } else {
        var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + source + '}';
        log('debug', functionSource + "\n\n");
        return functionSource;
      }
    },
    mergeSource: function() {
      // WARN: We are not handling the case where buffer is still populated as the source should
      // not have buffer append operations as their final action.
      var source = '',
          buffer;
      for (var i = 0, len = this.source.length; i < len; i++) {
        var line = this.source[i];
        if (line.appendToBuffer) {
          if (buffer) {
            buffer = buffer + '\n    + ' + line.content;
          } else {
            buffer = line.content;
          }
        } else {
          if (buffer) {
            source += 'buffer += ' + buffer + ';\n  ';
            buffer = undefined;
          }
          source += line + '\n  ';
        }
      }
      return source;
    },

    // [blockValue]
    //
    // On stack, before: hash, inverse, program, value
    // On stack, after: return value of blockHelperMissing
    //
    // The purpose of this opcode is to take a block of the form
    // `{{#foo}}...{{/foo}}`, resolve the value of `foo`, and
    // replace it on the stack with the result of properly
    // invoking blockHelperMissing.
    blockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      this.replaceStack(function(current) {
        params.splice(1, 0, current);
        return "blockHelperMissing.call(" + params.join(", ") + ")";
      });
    },

    // [ambiguousBlockValue]
    //
    // On stack, before: hash, inverse, program, value
    // Compiler value, before: lastHelper=value of last found helper, if any
    // On stack, after, if no lastHelper: same as [blockValue]
    // On stack, after, if lastHelper: value
    ambiguousBlockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      var current = this.topStack();
      params.splice(1, 0, current);

      this.pushSource("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
    },

    // [appendContent]
    //
    // On stack, before: ...
    // On stack, after: ...
    //
    // Appends the string value of `content` to the current buffer
    appendContent: function(content) {
      if (this.pendingContent) {
        content = this.pendingContent + content;
      }
      if (this.stripNext) {
        content = content.replace(/^\s+/, '');
      }

      this.pendingContent = content;
    },

    // [strip]
    //
    // On stack, before: ...
    // On stack, after: ...
    //
    // Removes any trailing whitespace from the prior content node and flags
    // the next operation for stripping if it is a content node.
    strip: function() {
      if (this.pendingContent) {
        this.pendingContent = this.pendingContent.replace(/\s+$/, '');
      }
      this.stripNext = 'strip';
    },

    // [append]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Coerces `value` to a String and appends it to the current buffer.
    //
    // If `value` is truthy, or 0, it is coerced into a string and appended
    // Otherwise, the empty string is appended
    append: function() {
      // Force anything that is inlined onto the stack so we don't have duplication
      // when we examine local
      this.flushInline();
      var local = this.popStack();
      this.pushSource("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
      if (this.environment.isSimple) {
        this.pushSource("else { " + this.appendToBuffer("''") + " }");
      }
    },

    // [appendEscaped]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Escape `value` and append it to the buffer
    appendEscaped: function() {
      this.context.aliases.escapeExpression = 'this.escapeExpression';

      this.pushSource(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"));
    },

    // [getContext]
    //
    // On stack, before: ...
    // On stack, after: ...
    // Compiler value, after: lastContext=depth
    //
    // Set the value of the `lastContext` compiler value to the depth
    getContext: function(depth) {
      if(this.lastContext !== depth) {
        this.lastContext = depth;
      }
    },

    // [lookupOnContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext[name], ...
    //
    // Looks up the value of `name` on the current context and pushes
    // it onto the stack.
    lookupOnContext: function(name) {
      this.push(this.nameLookup('depth' + this.lastContext, name, 'context'));
    },

    // [pushContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext, ...
    //
    // Pushes the value of the current context onto the stack.
    pushContext: function() {
      this.pushStackLiteral('depth' + this.lastContext);
    },

    // [resolvePossibleLambda]
    //
    // On stack, before: value, ...
    // On stack, after: resolved value, ...
    //
    // If the `value` is a lambda, replace it on the stack by
    // the return value of the lambda
    resolvePossibleLambda: function() {
      this.context.aliases.functionType = '"function"';

      this.replaceStack(function(current) {
        return "typeof " + current + " === functionType ? " + current + ".apply(depth0) : " + current;
      });
    },

    // [lookup]
    //
    // On stack, before: value, ...
    // On stack, after: value[name], ...
    //
    // Replace the value on the stack with the result of looking
    // up `name` on `value`
    lookup: function(name) {
      this.replaceStack(function(current) {
        return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, 'context');
      });
    },

    // [lookupData]
    //
    // On stack, before: ...
    // On stack, after: data, ...
    //
    // Push the data lookup operator
    lookupData: function() {
      this.pushStackLiteral('data');
    },

    // [pushStringParam]
    //
    // On stack, before: ...
    // On stack, after: string, currentContext, ...
    //
    // This opcode is designed for use in string mode, which
    // provides the string value of a parameter along with its
    // depth rather than resolving it immediately.
    pushStringParam: function(string, type) {
      this.pushStackLiteral('depth' + this.lastContext);

      this.pushString(type);

      // If it's a subexpression, the string result
      // will be pushed after this opcode.
      if (type !== 'sexpr') {
        if (typeof string === 'string') {
          this.pushString(string);
        } else {
          this.pushStackLiteral(string);
        }
      }
    },

    emptyHash: function() {
      this.pushStackLiteral('{}');

      if (this.options.stringParams) {
        this.push('{}'); // hashContexts
        this.push('{}'); // hashTypes
      }
    },
    pushHash: function() {
      if (this.hash) {
        this.hashes.push(this.hash);
      }
      this.hash = {values: [], types: [], contexts: []};
    },
    popHash: function() {
      var hash = this.hash;
      this.hash = this.hashes.pop();

      if (this.options.stringParams) {
        this.push('{' + hash.contexts.join(',') + '}');
        this.push('{' + hash.types.join(',') + '}');
      }

      this.push('{\n    ' + hash.values.join(',\n    ') + '\n  }');
    },

    // [pushString]
    //
    // On stack, before: ...
    // On stack, after: quotedString(string), ...
    //
    // Push a quoted version of `string` onto the stack
    pushString: function(string) {
      this.pushStackLiteral(this.quotedString(string));
    },

    // [push]
    //
    // On stack, before: ...
    // On stack, after: expr, ...
    //
    // Push an expression onto the stack
    push: function(expr) {
      this.inlineStack.push(expr);
      return expr;
    },

    // [pushLiteral]
    //
    // On stack, before: ...
    // On stack, after: value, ...
    //
    // Pushes a value onto the stack. This operation prevents
    // the compiler from creating a temporary variable to hold
    // it.
    pushLiteral: function(value) {
      this.pushStackLiteral(value);
    },

    // [pushProgram]
    //
    // On stack, before: ...
    // On stack, after: program(guid), ...
    //
    // Push a program expression onto the stack. This takes
    // a compile-time guid and converts it into a runtime-accessible
    // expression.
    pushProgram: function(guid) {
      if (guid != null) {
        this.pushStackLiteral(this.programExpression(guid));
      } else {
        this.pushStackLiteral(null);
      }
    },

    // [invokeHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // Pops off the helper's parameters, invokes the helper,
    // and pushes the helper's return value onto the stack.
    //
    // If the helper is not found, `helperMissing` is called.
    invokeHelper: function(paramSize, name, isRoot) {
      this.context.aliases.helperMissing = 'helpers.helperMissing';
      this.useRegister('helper');

      var helper = this.lastHelper = this.setupHelper(paramSize, name, true);
      var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');

      var lookup = 'helper = ' + helper.name + ' || ' + nonHelper;
      if (helper.paramsInit) {
        lookup += ',' + helper.paramsInit;
      }

      this.push(
        '('
          + lookup
          + ',helper '
            + '? helper.call(' + helper.callParams + ') '
            + ': helperMissing.call(' + helper.helperMissingParams + '))');

      // Always flush subexpressions. This is both to prevent the compounding size issue that
      // occurs when the code has to be duplicated for inlining and also to prevent errors
      // due to the incorrect options object being passed due to the shared register.
      if (!isRoot) {
        this.flushInline();
      }
    },

    // [invokeKnownHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // This operation is used when the helper is known to exist,
    // so a `helperMissing` fallback is not required.
    invokeKnownHelper: function(paramSize, name) {
      var helper = this.setupHelper(paramSize, name);
      this.push(helper.name + ".call(" + helper.callParams + ")");
    },

    // [invokeAmbiguous]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of disambiguation
    //
    // This operation is used when an expression like `{{foo}}`
    // is provided, but we don't know at compile-time whether it
    // is a helper or a path.
    //
    // This operation emits more code than the other options,
    // and can be avoided by passing the `knownHelpers` and
    // `knownHelpersOnly` flags at compile-time.
    invokeAmbiguous: function(name, helperCall) {
      this.context.aliases.functionType = '"function"';
      this.useRegister('helper');

      this.emptyHash();
      var helper = this.setupHelper(0, name, helperCall);

      var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

      var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');
      var nextStack = this.nextStack();

      if (helper.paramsInit) {
        this.pushSource(helper.paramsInit);
      }
      this.pushSource('if (helper = ' + helperName + ') { ' + nextStack + ' = helper.call(' + helper.callParams + '); }');
      this.pushSource('else { helper = ' + nonHelper + '; ' + nextStack + ' = typeof helper === functionType ? helper.call(' + helper.callParams + ') : helper; }');
    },

    // [invokePartial]
    //
    // On stack, before: context, ...
    // On stack after: result of partial invocation
    //
    // This operation pops off a context, invokes a partial with that context,
    // and pushes the result of the invocation back.
    invokePartial: function(name) {
      var params = [this.nameLookup('partials', name, 'partial'), "'" + name + "'", this.popStack(), "helpers", "partials"];

      if (this.options.data) {
        params.push("data");
      }

      this.context.aliases.self = "this";
      this.push("self.invokePartial(" + params.join(", ") + ")");
    },

    // [assignToHash]
    //
    // On stack, before: value, hash, ...
    // On stack, after: hash, ...
    //
    // Pops a value and hash off the stack, assigns `hash[key] = value`
    // and pushes the hash back onto the stack.
    assignToHash: function(key) {
      var value = this.popStack(),
          context,
          type;

      if (this.options.stringParams) {
        type = this.popStack();
        context = this.popStack();
      }

      var hash = this.hash;
      if (context) {
        hash.contexts.push("'" + key + "': " + context);
      }
      if (type) {
        hash.types.push("'" + key + "': " + type);
      }
      hash.values.push("'" + key + "': (" + value + ")");
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        var index = this.matchExistingProgram(child);

        if (index == null) {
          this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
          index = this.context.programs.length;
          child.index = index;
          child.name = 'program' + index;
          this.context.programs[index] = compiler.compile(child, options, this.context);
          this.context.environments[index] = child;
        } else {
          child.index = index;
          child.name = 'program' + index;
        }
      }
    },
    matchExistingProgram: function(child) {
      for (var i = 0, len = this.context.environments.length; i < len; i++) {
        var environment = this.context.environments[i];
        if (environment && environment.equals(child)) {
          return i;
        }
      }
    },

    programExpression: function(guid) {
      this.context.aliases.self = "this";

      if(guid == null) {
        return "self.noop";
      }

      var child = this.environment.children[guid],
          depths = child.depths.list, depth;

      var programParams = [child.index, child.name, "data"];

      for(var i=0, l = depths.length; i<l; i++) {
        depth = depths[i];

        if(depth === 1) { programParams.push("depth0"); }
        else { programParams.push("depth" + (depth - 1)); }
      }

      return (depths.length === 0 ? "self.program(" : "self.programWithDepth(") + programParams.join(", ") + ")";
    },

    register: function(name, val) {
      this.useRegister(name);
      this.pushSource(name + " = " + val + ";");
    },

    useRegister: function(name) {
      if(!this.registers[name]) {
        this.registers[name] = true;
        this.registers.list.push(name);
      }
    },

    pushStackLiteral: function(item) {
      return this.push(new Literal(item));
    },

    pushSource: function(source) {
      if (this.pendingContent) {
        this.source.push(this.appendToBuffer(this.quotedString(this.pendingContent)));
        this.pendingContent = undefined;
      }

      if (source) {
        this.source.push(source);
      }
    },

    pushStack: function(item) {
      this.flushInline();

      var stack = this.incrStack();
      if (item) {
        this.pushSource(stack + " = " + item + ";");
      }
      this.compileStack.push(stack);
      return stack;
    },

    replaceStack: function(callback) {
      var prefix = '',
          inline = this.isInline(),
          stack,
          createdStack,
          usedLiteral;

      // If we are currently inline then we want to merge the inline statement into the
      // replacement statement via ','
      if (inline) {
        var top = this.popStack(true);

        if (top instanceof Literal) {
          // Literals do not need to be inlined
          stack = top.value;
          usedLiteral = true;
        } else {
          // Get or create the current stack name for use by the inline
          createdStack = !this.stackSlot;
          var name = !createdStack ? this.topStackName() : this.incrStack();

          prefix = '(' + this.push(name) + ' = ' + top + '),';
          stack = this.topStack();
        }
      } else {
        stack = this.topStack();
      }

      var item = callback.call(this, stack);

      if (inline) {
        if (!usedLiteral) {
          this.popStack();
        }
        if (createdStack) {
          this.stackSlot--;
        }
        this.push('(' + prefix + item + ')');
      } else {
        // Prevent modification of the context depth variable. Through replaceStack
        if (!/^stack/.test(stack)) {
          stack = this.nextStack();
        }

        this.pushSource(stack + " = (" + prefix + item + ");");
      }
      return stack;
    },

    nextStack: function() {
      return this.pushStack();
    },

    incrStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return this.topStackName();
    },
    topStackName: function() {
      return "stack" + this.stackSlot;
    },
    flushInline: function() {
      var inlineStack = this.inlineStack;
      if (inlineStack.length) {
        this.inlineStack = [];
        for (var i = 0, len = inlineStack.length; i < len; i++) {
          var entry = inlineStack[i];
          if (entry instanceof Literal) {
            this.compileStack.push(entry);
          } else {
            this.pushStack(entry);
          }
        }
      }
    },
    isInline: function() {
      return this.inlineStack.length;
    },

    popStack: function(wrapped) {
      var inline = this.isInline(),
          item = (inline ? this.inlineStack : this.compileStack).pop();

      if (!wrapped && (item instanceof Literal)) {
        return item.value;
      } else {
        if (!inline) {
          if (!this.stackSlot) {
            throw new Exception('Invalid stack pop');
          }
          this.stackSlot--;
        }
        return item;
      }
    },

    topStack: function(wrapped) {
      var stack = (this.isInline() ? this.inlineStack : this.compileStack),
          item = stack[stack.length - 1];

      if (!wrapped && (item instanceof Literal)) {
        return item.value;
      } else {
        return item;
      }
    },

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\u2028/g, '\\u2028')   // Per Ecma-262 7.3 + 7.8.4
        .replace(/\u2029/g, '\\u2029') + '"';
    },

    setupHelper: function(paramSize, name, missingParams) {
      var params = [],
          paramsInit = this.setupParams(paramSize, params, missingParams);
      var foundHelper = this.nameLookup('helpers', name, 'helper');

      return {
        params: params,
        paramsInit: paramsInit,
        name: foundHelper,
        callParams: ["depth0"].concat(params).join(", "),
        helperMissingParams: missingParams && ["depth0", this.quotedString(name)].concat(params).join(", ")
      };
    },

    setupOptions: function(paramSize, params) {
      var options = [], contexts = [], types = [], param, inverse, program;

      options.push("hash:" + this.popStack());

      if (this.options.stringParams) {
        options.push("hashTypes:" + this.popStack());
        options.push("hashContexts:" + this.popStack());
      }

      inverse = this.popStack();
      program = this.popStack();

      // Avoid setting fn and inverse if neither are set. This allows
      // helpers to do a check for `if (options.fn)`
      if (program || inverse) {
        if (!program) {
          this.context.aliases.self = "this";
          program = "self.noop";
        }

        if (!inverse) {
          this.context.aliases.self = "this";
          inverse = "self.noop";
        }

        options.push("inverse:" + inverse);
        options.push("fn:" + program);
      }

      for(var i=0; i<paramSize; i++) {
        param = this.popStack();
        params.push(param);

        if(this.options.stringParams) {
          types.push(this.popStack());
          contexts.push(this.popStack());
        }
      }

      if (this.options.stringParams) {
        options.push("contexts:[" + contexts.join(",") + "]");
        options.push("types:[" + types.join(",") + "]");
      }

      if(this.options.data) {
        options.push("data:data");
      }

      return options;
    },

    // the params and contexts arguments are passed in arrays
    // to fill in
    setupParams: function(paramSize, params, useRegister) {
      var options = '{' + this.setupOptions(paramSize, params).join(',') + '}';

      if (useRegister) {
        this.useRegister('options');
        params.push('options');
        return 'options=' + options;
      } else {
        params.push(options);
        return '';
      }
    }
  };

  var reservedWords = (
    "break else new var" +
    " case finally return void" +
    " catch for switch while" +
    " continue function this with" +
    " default if throw" +
    " delete in try" +
    " do instanceof typeof" +
    " abstract enum int short" +
    " boolean export interface static" +
    " byte extends long super" +
    " char final native synchronized" +
    " class float package throws" +
    " const goto private transient" +
    " debugger implements protected volatile" +
    " double import public let yield"
  ).split(" ");

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

  JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
    if(!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name)) {
      return true;
    }
    return false;
  };

  __exports__ = JavaScriptCompiler;
  return __exports__;
})(__module2__, __module5__);

// handlebars.js
var __module0__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__;
  /*globals Handlebars: true */
  var Handlebars = __dependency1__;

  // Compiler imports
  var AST = __dependency2__;
  var Parser = __dependency3__.parser;
  var parse = __dependency3__.parse;
  var Compiler = __dependency4__.Compiler;
  var compile = __dependency4__.compile;
  var precompile = __dependency4__.precompile;
  var JavaScriptCompiler = __dependency5__;

  var _create = Handlebars.create;
  var create = function() {
    var hb = _create();

    hb.compile = function(input, options) {
      return compile(input, options, hb);
    };
    hb.precompile = function (input, options) {
      return precompile(input, options, hb);
    };

    hb.AST = AST;
    hb.Compiler = Compiler;
    hb.JavaScriptCompiler = JavaScriptCompiler;
    hb.Parser = Parser;
    hb.parse = parse;

    return hb;
  };

  Handlebars = create();
  Handlebars.create = create;

  __exports__ = Handlebars;
  return __exports__;
})(__module1__, __module7__, __module8__, __module10__, __module11__);

  return __module0__;
})();


RegExp.escape=function(s){return s.replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&');};(function($){'use strict'
$.csv={defaults:{separator:',',delimiter:'"',headers:true},hooks:{castToScalar:function(value,state){var hasDot=/\./;if(isNaN(value)){return value;}else{if(hasDot.test(value)){return parseFloat(value);}else{var integer=parseInt(value);if(isNaN(integer)){return null;}else{return integer;}}}}},parsers:{parse:function(csv,options){var separator=options.separator;var delimiter=options.delimiter;if(!options.state.rowNum){options.state.rowNum=1;}
if(!options.state.colNum){options.state.colNum=1;}
var data=[];var entry=[];var state=0;var value=''
var exit=false;function endOfEntry(){state=0;value='';if(options.start&&options.state.rowNum<options.start){entry=[];options.state.rowNum++;options.state.colNum=1;return;}
if(options.onParseEntry===undefined){data.push(entry);}else{var hookVal=options.onParseEntry(entry,options.state);if(hookVal!==false){data.push(hookVal);}}
entry=[];if(options.end&&options.state.rowNum>=options.end){exit=true;}
options.state.rowNum++;options.state.colNum=1;}
function endOfValue(){if(options.onParseValue===undefined){entry.push(value);}else{var hook=options.onParseValue(value,options.state);if(hook!==false){entry.push(hook);}}
value='';state=0;options.state.colNum++;}
var escSeparator=RegExp.escape(separator);var escDelimiter=RegExp.escape(delimiter);var match=/(D|S|\n|\r|[^DS\r\n]+)/;var matchSrc=match.source;matchSrc=matchSrc.replace(/S/g,escSeparator);matchSrc=matchSrc.replace(/D/g,escDelimiter);match=RegExp(matchSrc,'gm');csv.replace(match,function(m0){if(exit){return;}
switch(state){case 0:if(m0===separator){value+='';endOfValue();break;}
if(m0===delimiter){state=1;break;}
if(m0==='\n'){endOfValue();endOfEntry();break;}
if(/^\r$/.test(m0)){break;}
value+=m0;state=3;break;case 1:if(m0===delimiter){state=2;break;}
value+=m0;state=1;break;case 2:if(m0===delimiter){value+=m0;state=1;break;}
if(m0===separator){endOfValue();break;}
if(m0==='\n'){endOfValue();endOfEntry();break;}
if(/^\r$/.test(m0)){break;}
throw new Error('CSVDataError: Illegal State [Row:'+options.state.rowNum+'][Col:'+options.state.colNum+']');case 3:if(m0===separator){endOfValue();break;}
if(m0==='\n'){endOfValue();endOfEntry();break;}
if(/^\r$/.test(m0)){break;}
if(m0===delimiter){throw new Error('CSVDataError: Illegal Quote [Row:'+options.state.rowNum+'][Col:'+options.state.colNum+']');}
throw new Error('CSVDataError: Illegal Data [Row:'+options.state.rowNum+'][Col:'+options.state.colNum+']');default:throw new Error('CSVDataError: Unknown State [Row:'+options.state.rowNum+'][Col:'+options.state.colNum+']');}});if(entry.length!==0){endOfValue();endOfEntry();}
return data;},splitLines:function(csv,options){var separator=options.separator;var delimiter=options.delimiter;if(!options.state.rowNum){options.state.rowNum=1;}
var entries=[];var state=0;var entry='';var exit=false;function endOfLine(){state=0;if(options.start&&options.state.rowNum<options.start){entry='';options.state.rowNum++;return;}
if(options.onParseEntry===undefined){entries.push(entry);}else{var hookVal=options.onParseEntry(entry,options.state);if(hookVal!==false){entries.push(hookVal);}}
entry='';if(options.end&&options.state.rowNum>=options.end){exit=true;}
options.state.rowNum++;}
var escSeparator=RegExp.escape(separator);var escDelimiter=RegExp.escape(delimiter);var match=/(D|S|\n|\r|[^DS\r\n]+)/;var matchSrc=match.source;matchSrc=matchSrc.replace(/S/g,escSeparator);matchSrc=matchSrc.replace(/D/g,escDelimiter);match=RegExp(matchSrc,'gm');csv.replace(match,function(m0){if(exit){return;}
switch(state){case 0:if(m0===separator){entry+=m0;state=0;break;}
if(m0===delimiter){entry+=m0;state=1;break;}
if(m0==='\n'){endOfLine();break;}
if(/^\r$/.test(m0)){break;}
entry+=m0;state=3;break;case 1:if(m0===delimiter){entry+=m0;state=2;break;}
entry+=m0;state=1;break;case 2:var prevChar=entry.substr(entry.length-1);if(m0===delimiter&&prevChar===delimiter){entry+=m0;state=1;break;}
if(m0===separator){entry+=m0;state=0;break;}
if(m0==='\n'){endOfLine();break;}
if(m0==='\r'){break;}
throw new Error('CSVDataError: Illegal state [Row:'+options.state.rowNum+']');case 3:if(m0===separator){entry+=m0;state=0;break;}
if(m0==='\n'){endOfLine();break;}
if(m0==='\r'){break;}
if(m0===delimiter){throw new Error('CSVDataError: Illegal quote [Row:'+options.state.rowNum+']');}
throw new Error('CSVDataError: Illegal state [Row:'+options.state.rowNum+']');default:throw new Error('CSVDataError: Unknown state [Row:'+options.state.rowNum+']');}});if(entry!==''){endOfLine();}
return entries;},parseEntry:function(csv,options){var separator=options.separator;var delimiter=options.delimiter;if(!options.state.rowNum){options.state.rowNum=1;}
if(!options.state.colNum){options.state.colNum=1;}
var entry=[];var state=0;var value='';function endOfValue(){if(options.onParseValue===undefined){entry.push(value);}else{var hook=options.onParseValue(value,options.state);if(hook!==false){entry.push(hook);}}
value='';state=0;options.state.colNum++;}
if(!options.match){var escSeparator=RegExp.escape(separator);var escDelimiter=RegExp.escape(delimiter);var match=/(D|S|\n|\r|[^DS\r\n]+)/;var matchSrc=match.source;matchSrc=matchSrc.replace(/S/g,escSeparator);matchSrc=matchSrc.replace(/D/g,escDelimiter);options.match=RegExp(matchSrc,'gm');}
csv.replace(options.match,function(m0){switch(state){case 0:if(m0===separator){value+='';endOfValue();break;}
if(m0===delimiter){state=1;break;}
if(m0==='\n'||m0==='\r'){break;}
value+=m0;state=3;break;case 1:if(m0===delimiter){state=2;break;}
value+=m0;state=1;break;case 2:if(m0===delimiter){value+=m0;state=1;break;}
if(m0===separator){endOfValue();break;}
if(m0==='\n'||m0==='\r'){break;}
throw new Error('CSVDataError: Illegal State [Row:'+options.state.rowNum+'][Col:'+options.state.colNum+']');case 3:if(m0===separator){endOfValue();break;}
if(m0==='\n'||m0==='\r'){break;}
if(m0===delimiter){throw new Error('CSVDataError: Illegal Quote [Row:'+options.state.rowNum+'][Col:'+options.state.colNum+']');}
throw new Error('CSVDataError: Illegal Data [Row:'+options.state.rowNum+'][Col:'+options.state.colNum+']');default:throw new Error('CSVDataError: Unknown State [Row:'+options.state.rowNum+'][Col:'+options.state.colNum+']');}});endOfValue();return entry;}},toArray:function(csv,options,callback){var options=(options!==undefined?options:{});var config={};config.callback=((callback!==undefined&&typeof(callback)==='function')?callback:false);config.separator='separator'in options?options.separator:$.csv.defaults.separator;config.delimiter='delimiter'in options?options.delimiter:$.csv.defaults.delimiter;var state=(options.state!==undefined?options.state:{});var options={delimiter:config.delimiter,separator:config.separator,onParseEntry:options.onParseEntry,onParseValue:options.onParseValue,state:state}
var entry=$.csv.parsers.parseEntry(csv,options);if(!config.callback){return entry;}else{config.callback('',entry);}},toArrays:function(csv,options,callback){var options=(options!==undefined?options:{});var config={};config.callback=((callback!==undefined&&typeof(callback)==='function')?callback:false);config.separator='separator'in options?options.separator:$.csv.defaults.separator;config.delimiter='delimiter'in options?options.delimiter:$.csv.defaults.delimiter;var data=[];var options={delimiter:config.delimiter,separator:config.separator,onParseEntry:options.onParseEntry,onParseValue:options.onParseValue,start:options.start,end:options.end,state:{rowNum:1,colNum:1}};data=$.csv.parsers.parse(csv,options);if(!config.callback){return data;}else{config.callback('',data);}},toObjects:function(csv,options,callback){var options=(options!==undefined?options:{});var config={};config.callback=((callback!==undefined&&typeof(callback)==='function')?callback:false);config.separator='separator'in options?options.separator:$.csv.defaults.separator;config.delimiter='delimiter'in options?options.delimiter:$.csv.defaults.delimiter;config.headers='headers'in options?options.headers:$.csv.defaults.headers;options.start='start'in options?options.start:1;if(config.headers){options.start++;}
if(options.end&&config.headers){options.end++;}
var lines=[];var data=[];var options={delimiter:config.delimiter,separator:config.separator,onParseEntry:options.onParseEntry,onParseValue:options.onParseValue,start:options.start,end:options.end,state:{rowNum:1,colNum:1},match:false};var headerOptions={delimiter:config.delimiter,separator:config.separator,start:1,end:1,state:{rowNum:1,colNum:1}}
var headerLine=$.csv.parsers.splitLines(csv,headerOptions);var headers=$.csv.toArray(headerLine[0],options);var lines=$.csv.parsers.splitLines(csv,options);options.state.colNum=1;if(headers){options.state.rowNum=2;}else{options.state.rowNum=1;}
for(var i=0,len=lines.length;i<len;i++){var entry=$.csv.toArray(lines[i],options);var object={};for(var j in headers){object[headers[j]]=entry[j];}
data.push(object);options.state.rowNum++;}
if(!config.callback){return data;}else{config.callback('',data);}},fromArrays:function(arrays,options,callback){var options=(options!==undefined?options:{});var config={};config.callback=((callback!==undefined&&typeof(callback)==='function')?callback:false);config.separator='separator'in options?options.separator:$.csv.defaults.separator;config.delimiter='delimiter'in options?options.delimiter:$.csv.defaults.delimiter;config.escaper='escaper'in options?options.escaper:$.csv.defaults.escaper;config.experimental='experimental'in options?options.experimental:false;if(!config.experimental){throw new Error('not implemented');}
var output=[];for(i in arrays){output.push(arrays[i]);}
if(!config.callback){return output;}else{config.callback('',output);}},fromObjects2CSV:function(objects,options,callback){var options=(options!==undefined?options:{});var config={};config.callback=((callback!==undefined&&typeof(callback)==='function')?callback:false);config.separator='separator'in options?options.separator:$.csv.defaults.separator;config.delimiter='delimiter'in options?options.delimiter:$.csv.defaults.delimiter;config.experimental='experimental'in options?options.experimental:false;if(!config.experimental){throw new Error('not implemented');}
var output=[];for(i in objects){output.push(arrays[i]);}
if(!config.callback){return output;}else{config.callback('',output);}}};$.csvEntry2Array=$.csv.toArray;$.csv2Array=$.csv.toArrays;$.csv2Dictionary=$.csv.toObjects;})(jQuery);
this.mmooc = this.mmooc || {};

this.mmooc.nrk = function() {
	return {
		init : function ()
		{
		    mmooc.util.mmoocLoadScript("https://www.nrk.no/serum/latest/js/video_embed.js");
		}
	}
}();


window.addEventListener('message', receiveMessage, false);

function receiveMessage(evt)
{
	obj = JSON.parse(evt.data);
	if(obj.Sender != "pfdkautoresize")
	{
		return;
	}
    var PfDKiframes = document.getElementsByTagName('iframe');
    for( var i = 0; i < PfDKiframes.length; i++) {
    	var iFrame = PfDKiframes[i];
		if (iFrame.contentWindow === evt.source) {
	    	iFrame.height = obj.Height;
	    }
    }
}

// ==========================================================================================
// This code was copied and adapted on January 27th 2015 from:
// https://s3.amazonaws.com/SSL_Assets/bham/uob/uob7.js 
// The functionality in the file is documented here:
// https://birmingham.instructure.com/courses/3915/pages/faq-jquery-in-canvas
// ==========================================================================================
// UOB7.JS
//
// Generic top-level script for University of Birmingham's Canvas implementation. This
// script, which requires jQuery and the jQuery.UI, carries out the following tasks:
//
// 		Adds FindIt@Bham link to Help Corner
// 		Hides "Report a Problem" Zendesk option from all but sub-account admins
// 		Enables accordions
// 		Enables tabs
// 		Enables reveal buttons
// 		Enables regexp reveals
//		Enables boxes
//		Hides forgot-password link on login page
//		Adds Google viewer previews to compatible file links
//		Add strap line for Canvas Gallery
//
// Most code is implemented within a $(document).load() to ensure that jQuery and the
// jQuery UI are both available, especially in Internet Explorer.
// 
//
// ==========================================================================================

$(document).ready(function() {
    // -----------------------------------------------------------------------------------
    // Declare veriables that are used for multiple tasks.
    // -----------------------------------------------------------------------------------
    var i;
    var strSetNum = 0;

    // -----------------------------------------------------------------------------------
    // Add UoB enhancements to rich content displayed in courses.
    // -----------------------------------------------------------------------------------
    onPage(/\/(courses|groups)\/\d+/, function() {
        uobAddComponents();
    });
})



// --------------------------------------------------------------------------------
// uobAddComponents
//
// This function will enable the following UoB components:
// 		accordions
// 		tabs
// 		reveal buttons
// 		regexp reveals
//		boxes (header, box, tip, info, warning, question)
//		previews
// --------------------------------------------------------------------------------

function uobAddComponents() {
	onElementRendered("#content .user_content.enhanced,#content .show-content.enhanced", function($content) {

        // Tooltip
        var re = /\[(.*?)\]\((.*?)\)/g;

        //20180828ETH Bare bytt ut innholdet i første user content. I diskusjoner er det 
        //en user content for hvert innlegg, og mange av innleggene blir lastet inn etter
        //at koden vår har kjørt. Dersom vi skal støtte dette må vi ha en måte å vite når
        //alle innleggene er lastet inn på. Da kan man kjøre $content.each iterasjon.
        $content.first().html($content.first().html().replace(re, '<span class="tooltip tooltip-underline">$1<span class="tooltiptext">$2</span></span>'));


		// ================================================================================
		// Show non-uob-component tables
		//
		// Show standard tables that are not UoB controls i.e. tables that do not include
		// the string "[uob-" in the first cell.
		// --------------------------------------------------------------------------------

		var $tables = $content.find("table:hidden").not("td:first(:contains('[uob-'))");
		$tables.show();


		// ================================================================================
		// Accordian (Part 1/2)
		//
		// Convert up to 10 uob-accordion tables to format required for accordions.
		// --------------------------------------------------------------------------------

		for (i = 0; i < 10; i++) {
			// Locate the next uob-accordion table.
			$table = $content.find("table").has("table > tbody > tr > td:contains([uob-accordion])").last();

			// Break loop if no more accordions are to be displayed.
			if ($table.length != 1) break;

			// Convert table into HTML for an accordian.
			$table.before("<div class='uob-accordion'></div>");

			$table.find("tbody:first > tr:gt(0) > td").each(function(_idx, _item) {
				if ((_idx + 1) % 2) {
					// Add heading 4 for accordion bar.
					$table.prev().append("<h4></h4>");
					$table.prev().children().last().append($(_item).text().trim());
				}

				if (_idx % 2) {
					// Add div for accordion content.
					$table.prev().append("<div></div>");
					$table.prev().children().last().append($(_item).contents());
				}
			});

			// Remove original table from the DOM
			$table.remove();
		}


		// ================================================================================
		// Tabs (Part 1/2)
		//
		// Convert up to 10 uob-tabs tables to format required for tabs.
		// --------------------------------------------------------------------------------

		strSetNum = 0;

		for (i = 0; i < 10; i++) {
			// Locate the next uob-tabs table.
			$table = $content.find("table").has("table > tbody > tr > td:contains([uob-tabs])").last();

			// Break loop if no more tabs are to be displayed.
			if ($table.length != 1) break;

			// Convert table into a set of tabs.
			$table.before("<div class='uob-tabs'><ul></ul></div>");
			strSetNum++;

			$table.find("tbody:first > tr:gt(0) > td").each(function(_idx, _item) {
				var strAnchor = "set" + strSetNum + "tab" + ((_idx - (_idx % 2)) / 2);

				if ((_idx + 1) % 2) {
					// Add list item for the tab label.
					var strHTML = "<li><a href=\"#" + strAnchor + "\">" + $(_item).text().trim() + "</a></li>";
					$table.prev().find("ul").first().append(strHTML);
				}

				if (_idx % 2) {
					// Add div for the tab content.
					$table.prev().append("<div id=\"" + strAnchor + "\"></div>");
					$("#" + strAnchor).append($(_item).contents());
				}
			});

			// Remove original table from the DOM
			$table.remove();
		}


		// ================================================================================
		// Reveal (Part 1/2)
		//
		// Convert up to 10 uob-reveal tables to format required for reveals.
		// ................................................................................

		strSetNum = 0;

		for (i = 0; i < 10; i++) {
			// Locate the next uob-reveal table
			var $table = $content.find("table").has("table > tbody > tr > td:contains([uob-reveal])").last();

			// Break loop if no more reveal tables are to be converted.
			if ($table.length != 1) break;

			// Convert table into a reveal
			strSetNum++;

			$table.find("tbody:first > tr:gt(0) > td").each(function(_idx, _item) {
				var strAnchor = "set" + strSetNum + "reveal" + ((_idx - (_idx % 2)) / 2);

				if ((_idx + 1) % 2) {
					// Add new reveal button immediately before table
					$table.before("<p><a href=\"#" + strAnchor + "\" class=\"uob-reveal-button\"></a></p>");
					$table.prev().children().append($(_item).text().trim());
				}

				if (_idx % 2) {
					// Add new reveal content immediately before table
					$table.before("<div id=\"" + strAnchor + "\" class=\"uob-reveal-content\"></div>");
					$table.prev().append($(_item).contents());
				}
			});

			// Remove original table
			$table.remove();
		}


		// ================================================================================
		// RegExp (Part 1/1)
		//
		// Convert up to 10 uob-regexp tables to format required for regexps.
		// --------------------------------------------------------------------------------

		strSetNum = 0;

		for (i = 0; i < 10; i++) {
			// Locate the next uob-regexp table
			var $table = $content.find("table").has("table > tbody > tr > td:contains([uob-regexp])").last();

			// Break loop if no more regexp tables are to be converted.
			if ($table.length != 1) break;

			// Convert table into a regexps
			strSetNum++;

			// Generate HTML for input and button/anchor controls, and add to the DOM.
			var strAnchor = "RE" + strSetNum;

			var strHTML = "<p><input id=\"input" + strAnchor + "\" class=\"uob-regexp-input\" type=\"text\" size=\"40\" />&nbsp;<a href=\"#" + strAnchor + "\" id=\"button" + strAnchor + "\" class=\"uob-regexp-button\">Check Answer</a></p>";
			strHTML += "<div id='content" + strAnchor + "'></div>";
			$table.before(strHTML);

			// Store regular expressions in button and create DIVs to store the contents.
			$table.find("tbody:first > tr:gt(0) > td").each(function(_idx, _item) {
				var strValue = $(_item).html();
				var strIndex = ((_idx - (_idx % 2)) / 2);

				if ((_idx + 1) % 2) {		// set RegExp
					strValue = $(_item).text().trim();
					$("#button" + strAnchor).attr("regexp" + strIndex, strValue);
				}

				if (_idx % 2) {			// set Content
					//$("#data" + strAnchor).attr("content" + strIndex, strValue);
					strHTML = "<div id=\"data" + strAnchor + "ID" + strIndex + "\" class=\"uob-regexp-content\"></div>";
					$("#content" + strAnchor).append(strHTML);
					$("#data" + strAnchor + "ID" + strIndex).append($(_item).contents());
				}
			});

			// Store IDs of input and button to button and input respectively.
			$("#button" + strAnchor).attr("regexpInput", "input" + strAnchor);
			$("#input" + strAnchor).attr("regexpButton", "button" + strAnchor);

			// Store default selection in button.
			$("#button" + strAnchor).attr("regexpData", "data" + strAnchor + "ID0");
			$("#button" + strAnchor).attr("regexpDataRoot", "data" + strAnchor + "ID");

			// Remove original table
			$table.remove();
		}


		// ================================================================================
		// Accordian (Part 2/2)
		//
		// Accordions will be contained within elements with a uob-accordion class and
		// headings will be restricted to h4 tags.
		// --------------------------------------------------------------------------------

		// Initialise accordions
		var $accordion = $content.find(".uob-accordion");

		if ($accordion.length) {
			$accordion.accordion({
				heightStyle: "content",
				header: "> h4",
				collapsible: true,
				active: false,
				beforeActivate: function( event, ui ) {
					ui.oldPanel.find(".hide_youtube_embed_link").click();
				}
			});
		}


		// ================================================================================
		// Tabs (Part 2/2)
		//
		// Tabs will be contained within elements with a uob-tabs class.
		// --------------------------------------------------------------------------------

		// Initialise tabs
		var $tabs = $content.find(".uob-tabs");

		if ($tabs.length > 0) {
			$tabs.tabs({
				active: 0,
				collapsible: false,
				heightStyle: "content",
				beforeActivate: function( event, ui ) {
					ui.oldPanel.find(".hide_youtube_embed_link").click();
				}
			});
		}


		// ================================================================================
		// Reveal (Part 2/2)
		//
		// The uob-reveal-button and uob-reveal-content classes are required for reveals.
		// ................................................................................

		// Initialise reveal contents.
		var $revealBody = $content.find(".uob-reveal");

		if ($revealBody.length) {
			for (i = 0; i < $revealBody.length; i++) {
				var strSelector = $revealBody[i].href;
				var iHashPos = strSelector.lastIndexOf("#");

				if (iHashPos >= 0) {
					$(strSelector.slice(iHashPos + 1)).css("display", "none");
				}
			};
		}

		// Initialise reveal buttons.
		var $revealButton = $content.find(".uob-reveal-button");

		if ($revealButton.length) {
			$revealButton.button({ icons: { secondary: "ui-icon-triangle-1-e" } })
				.click(function(event) {
					var $button = $(this);
					var body = $button.attr("href");
					var options;

					if ($(body).css("display") != "none") {
						$(body).slideUp(400);
						$(body).find(".hide_youtube_embed_link").click();
						options = { icons: { secondary: "ui-icon-triangle-1-e" } };
					} else {
						$(body).slideDown(400);
						options = {	icons: { secondary: "ui-icon-triangle-1-s" } };
					}

					$button.button("option", options);
					return(false);
				});
		}


		// ================================================================================
		// RegExp (Part 2/2)
		//
		// The uob-regexp-input, uob-regexp-button, uob-regexp-content classes are required
		// for regexp.
		// --------------------------------------------------------------------------------

		// Initialise regexp inputs.
		var $regexpInput = $content.find(".uob-regexp-input");

		if ($regexpInput.length) {
			$regexpInput.focus(function(event) {
				var $input = $(this);
				var $button = $("#" + $input.attr("regexpButton"));

				var strData = $button.attr("regexpData");
				var strDataRoot = $button.attr("regexpDataRoot");

				if (strData != "") {
					var $data = $("#" + strData);
					var options;

					// Hide current display if visible
					if ($data.css("display") != "none") {
						$data.slideUp(400);
						$data.find(".hide_youtube_embed_link").click();
						options = { icons: { secondary: "ui-icon-triangle-1-e" } };
						$button.button("option", options);
						$button.attr("regexpData", "");
					}
				}
			});
		}

		// Initialise regexp buttons.
		var $regexpButton = $content.find(".uob-regexp-button");

		if ($regexpButton.length) {
			$regexpButton.button({ icons: { secondary: "ui-icon-triangle-1-e" } })
				.click(function(event) {
					var $button = $(this);
					var $input = $("#" + $button.attr("regexpInput"));

					var strData = $button.attr("regexpData");
					var strDataRoot = $button.attr("regexpDataRoot");
					if (strData == "") strData = strDataRoot + "0";
					var $data = $("#" + strData);
					var options;

					// Hide current display if visible
					if ($data.css("display") != "none") {
						$data.slideUp(400);
						options = { icons: { secondary: "ui-icon-triangle-1-e" } };
						$button.button("option", options);
						$button.attr("regexpData", "");
					} else {
						// Locate content to be displayed
						var strInput = $input.val();

						// Loop through regexp looking for a match and identify content.
						for (i = 0; i < 100; i++) {
							var strRegExp = $button.attr("regexp" + i);

							if (strRegExp == undefined || strRegExp.length == 0)
								break;

							var re = new RegExp("^" + strRegExp.trim() + "$");

							if (strRegExp == "default" || re.test(strInput)) {
								$button.attr("regexpData", "" + strDataRoot + i);
								$data = $("#" + strDataRoot + i);
								break;
							}
						}

						$data.slideDown(400);
						options = {	icons: { secondary: "ui-icon-triangle-1-s" } };
						$button.button("option", options);
						return(false);
					}
				});
		}


		// ================================================================================
		// Rating
		//
		// A rating will be constructed using radio buttons.
		// See http://www.fyneworks.com/jquery/star-rating/
		// --------------------------------------------------------------------------------

		// Convert uob-rating table to format required for ratings.
		var $ratingTable = $content.find("table").has("table > tbody > tr > td:contains([uob-rating])");

		if ($ratingTable.length) {
			// Cut table from the DOM
			$ratingTable.remove();

			// Determine is user is more than a student.
			var isTeacher = false;

			hasAnyRole("teacher", "admin", function() {
				isTeacher = true;
			});

			// Add rating control to DOM
			var strParams = "?page_loc=" + encodeURIComponent(location.pathname);
			strParams += "&page_title=" + encodeURIComponent(document.title);
			strParams += "&user_id=" + ENV.current_user_id;
			strParams += "&user_name=" + encodeURIComponent(ENV.current_user.display_name);
			var strRating = "<iframe src=\"https://www.vampire.bham.ac.uk/canvas/rating.aspx" + strParams + "\" width=\"100%\" height=\"32\"></iframe>";
			strRating = "<div id='uob-rating-container-x'>" + strRating + "</div>";
			$content.append(strRating);
		}


		// ================================================================================
		// Boxes
		//
		// Create boxes
		// --------------------------------------------------------------------------------

		aBoxTags = [
		"uob-tip", "pfdk-tips", 
		"uob-read", "pfdk-les",
		"uob-info", "pfdk-info",
		"uob-warning", "pfdk-advarsel",
		"uob-header", 
		"uob-question", "pfdk-spsm", 
		"uob-quote", "pfdk-sitat",
		"uob-box", "pfdk-boks",
		"pfdk-info", "pfdk-maal", 
		"pfdk-important", "pfdk-viktig",
		"pfdk-tid", 
		"pfdk-verktoy"];

		for (var i = 0; i < aBoxTags.length; i++) {
			var strTag = aBoxTags[i];
			var $boxTable = $content.find("table").has("table > tbody > tr > td:contains([" + strTag + "])");

			if ($boxTable.length) {
				$boxTable.each(function(_idx, _item) {
					// Add new container immediately before table
					$table = $(_item);

					if (strTag == "uob-header")
						$table.before("<h2 class=\"" + strTag + "\"></h2>");
					else if (strTag == "uob-quote")
						$table.before("<div class=\"" + strTag + "\"><div class=\"uob-quote99\" /></div>");
					else
						$table.before("<div class=\"" + strTag + "\"></div>");

					// Move content from table to container
					$table.prev().append($table.find("tr:eq(1) > td:eq(0)").contents());

					// Remove original table
					$table.remove();
				});
			}
		}

		// ================================================================================
		// Previews
		//
		// This code will append preview buttons immediately after each file link in the
		// content of a page. File links are identified by the instructure_file_link class.
		// When clicked the first time, the preview button will call a function to complete
		// the DOM changes, which are not possible before the DOM manipulation carried out
		// within Canvas is complete. The new HTML for the preview button will be similar
		// to the following:
		//
		// <a href="javascript:uobShowPreviewDocument(0)" title="Preview example.pdf" id="uobPreview0">
		//     <img src="/images/preview.png" alt="Preview example.pdf">
		// </a>
		// --------------------------------------------------------------------------------

		$content.find(".instructure_file_link_holder.link_holder").has("a").each(function(_idx, _item) {
			// Initialise varibles
			var $item = $(_item);
			var $anchor = $(_item).find('a').filter(':first');
			var strHref = $anchor.attr('href') || "";	// if href is not found, set strHref to an empty string.
			var iScribd = $(_item).find('.instructure_scribd_file_holder').length || 0;

			if (iScribd > 0) {
				strHref = "";
			}

			if (strHref.length > 0) {
				// Obtain ID of the file (index is 4 or 6 respectivelly for non-draft and draft modes)
				var file_id = strHref.split('/')[strHref.indexOf("/courses") == 0 ? 4 : 6];

				// Use Canvas API to obtain information about the file being linked.
				$.get('/api/v1/files/' + file_id, function(_d) {

					// Check that the file type is compatible with the Google viewer.
					if ($.isPreviewable(_d['content-type'], 'google') === 1) {

						// Initialise variables
						var displayName = _d['display_name'];

						// Create anchor element for the link. Note, _idx is used to make each
						// link unique. The file_id cannot be used in case when the same file
						// link appears more than once on a page.
						var $a = $(document.createElement('a'))
							.attr('href', 'javascript:uobShowPreviewDocument(' + _idx + ')')
							.attr('title', 'Preview ' + displayName)
							.attr('id', 'uobPreview' + _idx)
							.data('href2', strHref);

						// Create preview icon for the link
						var $img = $(document.createElement('img'))
							.attr('src', '/images/preview.png')
							.attr('alt', 'Preview ' + displayName);

						// Combine the preview icon with the anchor and add them to the DOM.
						$a.append($img);
						$anchor.after($a);
						//$(_item).append($a);
					}
				});
			}
		});


		// ================================================================================
		// Refresh after publish/unpublish
		//
		// Add dummy callback function to detect when the page is published or unpublished.
		// The callback function will constantly check for the div and refresh the UoB
		// components if the div is missing.
		// --------------------------------------------------------------------------------

		// Create dummy div and add it to the DOM
		var $div = $(document.createElement('div')).attr('id', 'uob-components-loaded');
		$content.append($div);

		// Set callback to test for missing div, as occurs when pages are published/unpublished.
		onElementMissing("#uob-components-loaded", function($identity) {
			uobAddComponents();
		});


		// ================================================================================
		// --------------------------------------------------------------------------------

	});
}


// --------------------------------------------------------------------------------
// uobShowPreviewDocument
//
// This function will amend a preview link so that when it is clicked, it will
// display documents using the Google viewer. This function will only be called
// once for each preview link, the first time it is clicked. When amended, the link
// is moved into the SPAN element with a "link_holder" class which should
// immediately precede the link. The preview link is given a new href attribute,
// the "scribd_file_preview_link" class and the click event will be triggered.
// --------------------------------------------------------------------------------

function uobShowPreviewDocument(iFileID) {
	// Initialise object variables to simplify the code. $target is the preview link
	// and $holder is the preceding or parent SPAN element (if it exists).
	var $target = $('#uobPreview' + iFileID);
	var $holder = $target.prev('span.link_holder');

	if ($holder.length == 0) {
		$holder = $target.parent('span.link_holder');
	}

	// Check that preceding element is a SPAN with the "link_holder" class.
	if ($holder.length) {

		// Move the anchor element into the preceeding span element
		$holder.append($target);

		// Replace href value, add the "scribd_file_preview_link" class and click.
		$target
			.attr('href', $target.data('href2'))
			.addClass('scribd_file_preview_link')
			.click();
	}
}


// --------------------------------------------------------------------------------
// Instructure/rpflorence functions
//
// (see http://youtu.be/ag6mxnBMTnQ and https://gist.github.com/rpflorence/5817898)
// Functions slightly amended and onElementMissing function added.
// --------------------------------------------------------------------------------

function onPage(regex, fn) {
  if (location.pathname.match(regex)) fn();
}


function hasAnyRole(/* role1, role2..., cb */) {
	var roles = [].slice.call(arguments, 0);
	var cb = roles.pop();

	if (typeof ENV != "object") return cb(false);
	if (typeof ENV.current_user_roles != "object") return cb(false);
	if (ENV.current_user_roles == null) return cb(false);

	for (var i = 0; i < roles.length; i++) {
		if (ENV.current_user_roles.indexOf(roles[i]) !== -1) return cb(true);
	}

	return cb(false);
}


function isUser(id, cb) {
	cb(ENV.current_user_id == id);
}


function onElementRendered(selector, cb, _attempts) {
	var el = $(selector);
	_attempts = ++_attempts || 1;
	if (el.length) return cb(el);
	if (_attempts >= 60) return;

	setTimeout(function() {
		onElementRendered(selector, cb, _attempts);
	}, 200);
}


function onElementMissing(selector, cb) {
	var el = $(selector);
	if (!el.length) return cb(el);

	setTimeout(function() {
		onElementMissing(selector, cb);
	}, 700);
}


function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");

	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}

	return(false);
}

this.mmooc=this.mmooc||{};

//https://medium.com/@pointbmusic/youtube-api-checklist-c195e9abaff1
this.mmooc.youtube = function() {
	var hrefPrefix = "https://video.google.com/timedtext?v=";
	var transcriptIdPrefix = "videoTranscript";
	var transcriptArr = [];
	var initialized = false;

	function transcript(transcriptId, language, name)
	{
		var transcriptId = transcriptId;
		var videoId = transcriptId.split(transcriptIdPrefix)[1];

		var href = hrefPrefix + videoId;
		if(language != "")
		{
		   href = href + "&lang=" + language;
		}
		if(name != "")
		{
		  href = href + "&name=" + name;
		}

			//Array of captions in video
		var captionsLoaded = false;

		//Timeout for next caption
		var captionTimeout = null;
		
		var captions = null;

		//Keep track of which captions we are showing
		var currentCaptionIndex = 0;
		var nextCaptionIndex = 0;

		this.player = new YT.Player(videoId, {
		  videoId: videoId,
		  events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		  }
  	    });	
		
		var findCaptionIndexFromTimestamp = function(timeStamp)
		{
			var start = 0;
			var duration = 0;
			for (var i = 0, il = captions.length; i < il; i++) {
				start = Number(getStartTimeFromCaption(i));
				duration = Number(getDurationFromCaption(i));
	
				//Return the first caption if the timeStamp is smaller than the first caption start time.
				if(timeStamp < start)
				{
					break;
				}
	
				//Check if the timestamp is in the interval of this caption.
				if((timeStamp >= start) && (timeStamp < (start + duration)))
				{
					break;
				}        
			}
			return i;
		}


		var clearCurrentHighlighting = function()
		{
			var timeStampId = getTimeIdFromTimestampIndex(currentCaptionIndex);
			$("#"+timeStampId).css('background-color', '');
		}

		var highlightNextCaption = function ()
		{
			var timestampId = getTimeIdFromTimestampIndex(nextCaptionIndex);
			$("#"+timestampId).css('background-color', 'yellow');
		}

		var calculateTimeout = function (currentTime)
		{
			var startTime = Number(getStartTimeFromCaption(currentCaptionIndex));
			var duration = Number(getDurationFromCaption(currentCaptionIndex));
			var timeoutValue = startTime - currentTime + duration;
			return timeoutValue;
		}

		this.setCaptionTimeout = function (timeoutValue)
		{
			if(timeoutValue < 0)
			{
				return;
			}
			
			clearTimeout(captionTimeout);
			
			var transcript = this;
			
			captionTimeout = setTimeout(function() {
				transcript.highlightCaptionAndPrepareForNext();
			}, timeoutValue*1000)
		}

		var getStartTimeFromCaption = function(i)
		{
			if(i >= captions.length)
			{
				return -1;
			}
			return captions[i].getAttribute('start');
		}
		var getDurationFromCaption = function(i) 
		{
			if(i >= captions.length)
			{
				return -1;
			}
			return captions[i].getAttribute('dur');
		}
		var getTimeIdFromTimestampIndex = function(i)
		{
			var strTimestamp = "" + i;
			return "t" + strTimestamp;
		}


		//////////////////
		//Public functions
		/////////////////

		//This function highlights the next caption in the list and
		//sets a timeout for the next one after that.
		//It must be public as it is called from a timer.
		this.highlightCaptionAndPrepareForNext = function ()
		{
			clearCurrentHighlighting();
			highlightNextCaption();
			currentCaptionIndex = nextCaptionIndex;
			nextCaptionIndex++;

			var currentTime = this.player.getCurrentTime();
			var timeoutValue = calculateTimeout(currentTime);
		
			if(nextCaptionIndex <= captions.length)			
			{
				this.setCaptionTimeout(timeoutValue);
			}
		}
		
		//Called if the user has dragged the slider to somewhere in the video.
		this.highlightCaptionFromTimestamp = function(timeStamp)
		{
			clearCurrentHighlighting();
			nextCaptionIndex = findCaptionIndexFromTimestamp(timeStamp);
			currentCaptionIndex = nextCaptionIndex;

			var startTime = Number(getStartTimeFromCaption(currentCaptionIndex));

			var timeoutValue = -1;		
			if(timeStamp < startTime)
			{
				timeoutValue = startTime - currentTime;
			}
			else
			{
				highlightNextCaption();
				timeoutValue = calculateTimeout(currentTime);
			}
			this.setCaptionTimeout(timeoutValue);
		}   

		this.transcriptLoaded = function(transcript) {
			var start = 0;
			captions = transcript.getElementsByTagName('text');
			var srt_output = "<div class='btnSeek' id='btnSeek' data-seek='0'>0:00</div>";

			for (var i = 0, il = captions.length; i < il; i++) {
				start =+ getStartTimeFromCaption(i);

				captionText = captions[i].textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;');
				var timestampId = getTimeIdFromTimestampIndex(i);
				srt_output += "<span class='btnSeek' data-seek='" + start + "' id='" + timestampId + "'>" + captionText + "</span> ";
			};

			$("#videoTranscript" + videoId).append(srt_output);
			captionsLoaded = true;
		}
		
		this.getTranscriptId = function()
		{
			return transcriptId;
		}
		this.getVideoId = function()
		{
			return videoId;
		}
		
		this.getTranscript = function()
		{
			var oTranscript = this;
			$.ajax({
				url: href,
				type: 'GET',
				data: {},
				success: function(response) {
					oTranscript.transcriptLoaded(response);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("Error during GET");
				}
			});           
		}
		
		this.playerPlaying = function()
		{
			if(!captionsLoaded)
			{
				return;
			}	
			
		    currentTime = this.player.getCurrentTime();
		    this.highlightCaptionFromTimestamp(currentTime);
		}
		this.playerNotPlaying = function (transcript)
		{
			if(!captionsLoaded)
			{
				return;
			}	
			clearTimeout(captionTimeout);
		}
	}

	//Called when user clicks somewhere in the transcript.
	$(function() {
		$(document).on('click', '.btnSeek', function() {
			var seekToTime = $(this).data('seek');
			var transcript = mmooc.youtube.getTranscriptFromTranscriptId($(this).parent().attr("id"));
			transcript.player.seekTo(seekToTime, true);
			transcript.player.playVideo();
		});
	});

	//These functions must be global as YouTube API will call them. 
	var previousOnYouTubePlayerAPIReady = window.onYouTubePlayerAPIReady; 
	window.onYouTubePlayerAPIReady = function() {
		if(previousOnYouTubePlayerAPIReady)
		{
			previousOnYouTubePlayerAPIReady();
		}
		mmooc.youtube.APIReady();
	};

	// The API will call this function when the video player is ready.
	// It can be used to auto start the video f.ex.
	window.onPlayerReady = function(event) {
	}

	// The API calls this function when the player's state changes.
	//    The function indicates that when playing a video (state=1),
	//    the player should play for six seconds and then stop.
	window.onPlayerStateChange = function(event) {
		console.log("onPlayerStateChange " + event.data);
		var transcript = this.mmooc.youtube.getTranscriptFromVideoId(event.target.getIframe().id);
		if (event.data == YT.PlayerState.PLAYING) {
			transcript.playerPlaying();
		}
		else
		{
			transcript.playerNotPlaying();
		}
	}

	return {
		getTranscriptFromTranscriptId : function(transcriptId)
		{
			for (index = 0; index < transcriptArr.length; ++index) {
				if(transcriptArr[index].getTranscriptId() == transcriptId)
				{
					return transcriptArr[index];
				}
			}
			return null;
		},
	    getTranscriptFromVideoId : function(videoId)
	    {
			for (index = 0; index < transcriptArr.length; ++index) {
				if(transcriptArr[index].getVideoId() == videoId)
				{
					return transcriptArr[index];
				}
			}
			return null;
	    },
	    
		APIReady : function ()
		{
			if(!initialized)
			{
				$(".mmocVideoTranscript" ).each(function( i ) {
					var language = $(this).data('language');
					var name = $(this).data('name');
					var oTranscript = new transcript(this.id, language, name);
					oTranscript.getTranscript();
					transcriptArr.push(oTranscript);
				});
				initialized = true;
			}
		},
		init : function ()
		{
			this.APIReady();
		}		
	}

}();
//Everything is ready, load the youtube iframe_api
$.getScript("https://www.youtube.com/iframe_api");



this["mmooc"] = this["mmooc"] || {};
this["mmooc"]["templates"] = this["mmooc"]["templates"] || {};

this["mmooc"]["templates"]["actionbutton"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"mmooc-action-button\">\n    <a href=\"#\" id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"btn btn-done\">";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n</div>\n";
  return buffer;
  });

this["mmooc"]["templates"]["activitystream"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n    <li class=\""
    + escapeExpression((helper = helpers.checkReadStateFor || (depth0 && depth0.checkReadStateFor),options={hash:{},data:data},helper ? helper.call(depth0, depth0, options) : helperMissing.call(depth0, "checkReadStateFor", depth0, options)))
    + "\"><a href=\""
    + escapeExpression((helper = helpers.findRightUrlFor || (depth0 && depth0.findRightUrlFor),options={hash:{},data:data},helper ? helper.call(depth0, depth0, options) : helperMissing.call(depth0, "findRightUrlFor", depth0, options)))
    + "\">";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "<br><span class=\"mmooc-notification-type\">"
    + escapeExpression((helper = helpers.localize || (depth0 && depth0.localize),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.type), options) : helperMissing.call(depth0, "localize", (depth0 && depth0.type), options)))
    + "</span><br><span class=\"notification-pubdate\">";
  if (helper = helpers.created_at) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.created_at); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></a></li>\n    ";
  stack1 = helpers['if'].call(depth0, (data == null || data === false ? data : data.last), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return " \n        <a href=\"#\" id=\"mmooc-notifications-showall\">Vis alle</a>\n    ";
  }

function program4(depth0,data) {
  
  
  return "\n    <li>Ingen varsler</li>\n";
  }

  buffer += "<ul id=\"mmooc-notifications\">\n";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.activities), {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n</ul>\n\n";
  return buffer;
  });

this["mmooc"]["templates"]["allcoursescontainer"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"mmooc-all-courses\">\n    <h1>Alle tilgjengelige ";
  if (helper = helpers.courseLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.courseLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\n    <a class=\"btn\" href=\"/courses\">Til mine ";
  if (helper = helpers.courseLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.courseLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n<!--If the amount of courses is large, the filter select box and corresponding javascript code in enroll.js should be enabled\n    <select id='filter'></select>\n-->\n    <div class=\"mmooc-all-courses-list\"></div>\n</div>\n";
  return buffer;
  });

this["mmooc"]["templates"]["allcourseslist"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <li class=\"";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.enrolled), {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n            ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.enrolled), {hash:{},inverse:self.program(8, program8, data),fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " \n            ";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n            </a></li>\n        ";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.enrolled), {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "enrolled";
  }

function program4(depth0,data) {
  
  
  return "notenrolled";
  }

function program6(depth0,data) {
  
  var buffer = "", helper, options;
  buffer += "\n                <a href=\""
    + escapeExpression((helper = helpers.urlForCourseId || (depth0 && depth0.urlForCourseId),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.id), options) : helperMissing.call(depth0, "urlForCourseId", (depth0 && depth0.id), options)))
    + "\">\n            ";
  return buffer;
  }

function program8(depth0,data) {
  
  
  return "\n                <a class=\"all-courses-show-modal\" href=\"#\">\n            ";
  }

function program10(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n          <div class=\"all-courses-modal modal-course-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n              <div class=\"modal-content\">\n                  <div class=\"modal-header\">\n                      <div class=\"modal-close modal-back\"></div>\n                  </div>\n                  <div class=\"modal-description\">\n                      <h3>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h3>\n                      <div>";
  if (helper = helpers.public_description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.public_description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n                  </div>\n                  <div class=\"modal-footer\">\n                      <a class=\"modal-back\" href=\"#\">Tilbake til ";
  if (helper = helpers.courseLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.courseLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "oversikten</a>\n                      ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.self_enrollment_code), {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                  </div>\n              </div>\n          </div>\n        ";
  return buffer;
  }
function program11(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "<a class=\"btn modal-enroll\" href=\"/enroll/";
  if (helper = helpers.self_enrollment_code) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.self_enrollment_code); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">Meld deg på</a>";
  return buffer;
  }

  buffer += "<div class=\"mmooc-enroll-category\">\n<h2 class=\"mmooc-enroll-category-title\">";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n<ul>\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.courses), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n</div>\n";
  return buffer;
  });

this["mmooc"]["templates"]["assignmentPageWithPeerReviewRightSide"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return " late";
  }

function program3(depth0,data) {
  
  
  return " (for sen)";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n				<ul class=\"mmooc-assignment-files\">\n					";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.attachments), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				</ul>\n            ";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                        <li>\n							<a href=\"";
  if (helper = helpers.url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"file-big\">";
  if (helper = helpers.display_name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.display_name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n						</li>\n                    ";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n			<a href=\""
    + escapeExpression((helper = helpers.getPathFromUrl || (depth0 && depth0.getPathFromUrl),options={hash:{},data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.preview_url), options) : helperMissing.call(depth0, "getPathFromUrl", ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.preview_url), options)))
    + "\">Vis detaljer om innlevering &raquo;</a>\n			";
  return buffer;
  }

function program10(depth0,data) {
  
  
  return "\n    		<p>Du må gjøre hverandre-vurderingen(e) nedenfor før du kan se detaljer om din oppgave.</p>\n			";
  }

function program12(depth0,data) {
  
  
  return "\n				<li>Ingen innleveringer tildelt</li>\n			";
  }

function program14(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n				<li>\n					<a class=\""
    + escapeExpression((helper = helpers.getPeerReviewWorkflowIconClass || (depth0 && depth0.getPeerReviewWorkflowIconClass),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.workflow_state), options) : helperMissing.call(depth0, "getPeerReviewWorkflowIconClass", (depth0 && depth0.workflow_state), options)))
    + "\" href=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.assessor)),stack1 == null || stack1 === false ? stack1 : stack1.mmooc_url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.assessor)),stack1 == null || stack1 === false ? stack1 : stack1.display_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\n				</li>	\n			";
  return buffer;
  }

  buffer += "<div class=\"mmooc-assignment-rightside\">\n	<div class=\"mmooc-assignment-responses\">\n		<h3>Besvarelser</h3>\n		<div class=\"mmooc-assignment-responses-contents\">\n			<p class=\"mmooc-assignment-delivery-date";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.late), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">Levert "
    + escapeExpression((helper = helpers.norwegianDateAndTime || (depth0 && depth0.norwegianDateAndTime),options={hash:{},data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.submitted_at), options) : helperMissing.call(depth0, "norwegianDateAndTime", ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.submitted_at), options)));
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.late), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>\n			";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.attachments), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</div>\n		<div class=\"mmooc-assignment-details\">\n			";
  stack1 = (helper = helpers.ifAllPeerReviewsAreComplete || (depth0 && depth0.ifAllPeerReviewsAreComplete),options={hash:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.peerReview), options) : helperMissing.call(depth0, "ifAllPeerReviewsAreComplete", (depth0 && depth0.peerReview), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</div>\n	</div>\n	<div class=\"mmooc-peer-reviews\">\n		<h3>Hverandrevurdering tildelt deg</h3>\n		<ul class=\"unstyled_list\">\n			";
  stack1 = helpers.unless.call(depth0, ((stack1 = (depth0 && depth0.peerReview)),stack1 == null || stack1 === false ? stack1 : stack1.length), {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.peerReview), {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</ul>\n	</div>\n</div>\n";
  return buffer;
  });

this["mmooc"]["templates"]["assignmentPageWithPeerReviewSaveRubricButton"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<button type=\"button\" id=\"mmooc_save_rubric_button\" class=\"save_rubric_button btn btn-small\">Lagre kommentar</button>";
  });

this["mmooc"]["templates"]["assignmentPageWithPeerReviewWarning"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"mmooc-peer-review-warning\">\n	<p class=\"mmooc-warning\">\n		Denne oppgaven er ikke ferdig før du har fylt ut vurderingsskjemaet til hver tildelte hverandrevurdering\n	</p>\n</div>";
  });

this["mmooc"]["templates"]["assignmentSubmission"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return " late";
  }

function program3(depth0,data) {
  
  
  return " (for sen)";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n							<span class=\"mmooc-assignment-delivered-by\"> av "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.user)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n						";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isPeerReviewFinished), {hash:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  return buffer;
  }
function program8(depth0,data) {
  
  
  return "\n                <div class=\"mmooc-peer-review-success\">\n                    <p class=\"mmooc-success singleLine\">\n                        Du har fullført hverandrevurderingen.\n                    </p>\n                </div>\n            ";
  }

function program10(depth0,data) {
  
  
  return "\n                <div class=\"mmooc-peer-review-warning\">\n                    <p class=\"mmooc-warning singleLine\">\n                        Denne oppgaven er ikke ferdig før du har fylt ut vurderingsskjemaet.\n                    </p>\n                </div>\n            ";
  }

function program12(depth0,data) {
  
  
  return "\n					<h3>Din vurdering</h3>\n				";
  }

function program14(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n					";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isTeacherViewingStudentsSubmission), {hash:{},inverse:self.program(17, program17, data),fn:self.program(15, program15, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					\n				";
  return buffer;
  }
function program15(depth0,data) {
  
  
  return "\n						<h3>Vurdering av besvarelse</h3>\n					";
  }

function program17(depth0,data) {
  
  
  return "\n						<h3>Vurdering av din besvarelse</h3>	\n					";
  }

function program19(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n				<p class=\"assessment\">Karakter: "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.grade)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.assignment)),stack1 == null || stack1 === false ? stack1 : stack1.points_possible)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\n				";
  return buffer;
  }

function program21(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n					";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.isPeerReviewFinished), {hash:{},inverse:self.noop,fn:self.program(22, program22, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					<a href=\"#\" class=\"open-assessment-dialog-button\">Vurderingsskjema</a>\n				";
  return buffer;
  }
function program22(depth0,data) {
  
  
  return "\n						<p class=\"assessment-warning\">Du har ikke vurdert denne oppgaven.</p>\n					";
  }

function program24(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n					<p class=\"assessment-text\">"
    + escapeExpression((helper = helpers.getSubmissionAssessmentText || (depth0 && depth0.getSubmissionAssessmentText),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.peerReview), options) : helperMissing.call(depth0, "getSubmissionAssessmentText", (depth0 && depth0.peerReview), options)))
    + "</p>\n					";
  stack1 = (helper = helpers.ifAtLeastOnePeerReviewIsComplete || (depth0 && depth0.ifAtLeastOnePeerReviewIsComplete),options={hash:{},inverse:self.program(27, program27, data),fn:self.program(25, program25, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.peerReview), options) : helperMissing.call(depth0, "ifAtLeastOnePeerReviewIsComplete", (depth0 && depth0.peerReview), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				";
  return buffer;
  }
function program25(depth0,data) {
  
  
  return "\n    					<a href=\"#\" class=\"open-assessment-dialog-button\">Vis vurdering</a>\n    				";
  }

function program27(depth0,data) {
  
  
  return "\n    				<br/>\n    				";
  }

function program29(depth0,data) {
  
  
  return " isPeerReviewPage";
  }

function program31(depth0,data) {
  
  
  return " isSubmissionDetaisPage";
  }

function program33(depth0,data) {
  
  
  return " withGradesText";
  }

function program35(depth0,data) {
  
  
  return " withNoGradesText";
  }

  buffer += "<div class=\"mmooc-assignment-submission\">\n	<div class=\"mmooc-assignment-submission-leftside\">\n		<div class=\"mmooc-assignment-submission-metadata\">\n			<h2 class=\"mmooc-assignment-submission-header\">";
  if (helper = helpers.submissionTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.submissionTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n			<ul class=\"mmooc-assignment-submission-metadata-list\">\n				<li>\n					<span class=\"title\">Oppgave:</span>\n					<span class=\"value\"><a href=\"/courses/"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.course)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/assignments/"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.assignment_id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.assignment)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a></span>\n				</li>\n				<li>\n					<span class=\"title\">Innlevert:</span>\n					<span class=\"value\">\n						<span class=\"mmooc-assignment-delivery-date";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.late), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">"
    + escapeExpression((helper = helpers.norwegianDateAndTime || (depth0 && depth0.norwegianDateAndTime),options={hash:{},data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.submitted_at), options) : helperMissing.call(depth0, "norwegianDateAndTime", ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.submitted_at), options)));
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.late), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n						";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isPeerReview), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n						";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isTeacherViewingStudentsSubmission), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					</span>\n				</li>\n			</ul>\n		</div>\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isPeerReview), {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "		\n	</div>\n	<div class=\"mmooc-assignment-submission-rightside\">\n		<div class=\"mmooc-assignment-submission-assessment\">\n			<div class=\"mmooc-assignment-submission-assessment-header\">\n				";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isPeerReview), {hash:{},inverse:self.program(14, program14, data),fn:self.program(12, program12, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</div>\n			<div class=\"mmooc-assignment-submission-assessment-contents\">\n				";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.grade), {hash:{},inverse:self.noop,fn:self.program(19, program19, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isPeerReview), {hash:{},inverse:self.program(24, program24, data),fn:self.program(21, program21, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</div>\n		</div>\n	</div>\n</div>\n\n<div class=\"mmooc-assignment-submission-answers";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isPeerReview), {hash:{},inverse:self.program(31, program31, data),fn:self.program(29, program29, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.submission)),stack1 == null || stack1 === false ? stack1 : stack1.grade), {hash:{},inverse:self.program(35, program35, data),fn:self.program(33, program33, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n	<h3>Besvarelser</h3>\n</div>";
  return buffer;
  });

this["mmooc"]["templates"]["backbutton"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"mmooc-back-button\">\n    <a href=\"";
  if (helper = helpers.url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n</div>\n";
  return buffer;
  });

this["mmooc"]["templates"]["courselist"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n            <div id=\"course_";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"mmooc-size-1of3\">\n                <div class=\"mmooc-course-list-item\">\n                    <div class=\"mmooc-course-list-heading\">\n                        <h2\n                            ";
  stack1 = (helper = helpers.ifHasRole || (depth0 && depth0.ifHasRole),options={hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.enrollments), "ObserverEnrollment", options) : helperMissing.call(depth0, "ifHasRole", (depth0 && depth0.enrollments), "ObserverEnrollment", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                            ><a href=\""
    + escapeExpression((helper = helpers.urlForCourseId || (depth0 && depth0.urlForCourseId),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.id), options) : helperMissing.call(depth0, "urlForCourseId", (depth0 && depth0.id), options)))
    + "\">\n                                ";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n                                ";
  stack1 = (helper = helpers.ifHasRole || (depth0 && depth0.ifHasRole),options={hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.enrollments), "ObserverEnrollment", options) : helperMissing.call(depth0, "ifHasRole", (depth0 && depth0.enrollments), "ObserverEnrollment", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                            </a>					\n                        </h2>\n                    </div>\n\n                    <div class=\"mmooc-course-list-description\">\n						";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.syllabus_body), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                    </div>\n					";
  if (helper = helpers.debug) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.debug); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n                    \n                    <div class=\"mmooc-course-list-progress\">\n					";
  stack1 = (helper = helpers.ifHasRole || (depth0 && depth0.ifHasRole),options={hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.enrollments), "StudentEnrollment", options) : helperMissing.call(depth0, "ifHasRole", (depth0 && depth0.enrollments), "StudentEnrollment", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                    </div>\n                </div>\n            </div>\n		";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "\n                                class=\"tooltip\"\n        					";
  }

function program4(depth0,data) {
  
  
  return "\n                                     - Observatør\n                                    <div class=\"tooltiptext\">\n                                    Som observatør kan du se innholdet i emner der du ikke er registrert som student.\n                                    </div>\n                                ";
  }

function program6(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n\n							";
  if (helper = helpers.syllabus_body) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.syllabus_body); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n						";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n							";
  stack1 = helpers['with'].call(depth0, (depth0 && depth0.course_progress), {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					";
  return buffer;
  }
function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n								";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.requirement_count), {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n							";
  return buffer;
  }
function program10(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n									<div class=\"mmooc-progress-bar";
  stack1 = (helper = helpers.ifEquals || (depth0 && depth0.ifEquals),options={hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.requirement_completed_count), (depth0 && depth0.requirement_count), options) : helperMissing.call(depth0, "ifEquals", (depth0 && depth0.requirement_completed_count), (depth0 && depth0.requirement_count), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n										<div class=\"mmooc-progress-bar-inner\" style=\"width:"
    + escapeExpression((helper = helpers.percentage || (depth0 && depth0.percentage),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.requirement_completed_count), (depth0 && depth0.requirement_count), options) : helperMissing.call(depth0, "percentage", (depth0 && depth0.requirement_completed_count), (depth0 && depth0.requirement_count), options)))
    + "%\">\n										</div>\n									</div>\n								";
  return buffer;
  }
function program11(depth0,data) {
  
  
  return " mmooc-progress-bar-done";
  }

  buffer += "<div class=\"mmooc-course-list\">\n<h2 class=\"mmooc-course-category-title\">";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n<!--If the amount of courses is large, the filter select box and corresponding javascript code in courselist.js should be enabled\n    <select id=\"filter\"></select>\n-->    \n    <div class=\"mmooc-row\">\n		";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.courses), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n</div>";
  return buffer;
  });

this["mmooc"]["templates"]["courselistcontainer"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"mmooc-course-list-container\">\r\n<h1>Mine ";
  if (helper = helpers.courseLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.courseLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\r\n<a class='btn btn-more-courses' href='/search/all_courses'>Se alle tilgjengelige ";
  if (helper = helpers.courseLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.courseLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\r\n</div>";
  return buffer;
  });

this["mmooc"]["templates"]["coursemenu"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += " class=\"no-tabs\"";
  if (helper = helpers.subtitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.subtitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1);
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "<span class=\"h1-sub-heading\">";
  if (helper = helpers.subtitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.subtitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <ul class=\"mmooc-course-tabs\">\n            ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.menuItems), {hash:{},inverse:self.noop,fn:self.programWithDepth(6, program6, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </ul>\n        ";
  return buffer;
  }
function program6(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\n                ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.toolList)),stack1 == null || stack1 === false ? stack1 : stack1.length), {hash:{},inverse:self.programWithDepth(12, program12, data, depth1),fn:self.programWithDepth(7, program7, data, depth1),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            ";
  return buffer;
  }
function program7(depth0,data,depth2) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n                    <li class=\"mmooc-course-tab ";
  stack1 = (helper = helpers.ifEquals || (depth0 && depth0.ifEquals),options={hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.url), (depth2 && depth2.selectedMenuItem), options) : helperMissing.call(depth0, "ifEquals", (depth0 && depth0.url), (depth2 && depth2.selectedMenuItem), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" id=\"mmooc-menu-item-verktoy\">\n                            <a href=\"#\">";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n                                <i class=\"icon-mini-arrow-down\"></i>\n                            </a>\n                            <div class=\"mmooc-course-tab-menu-item-drop\" id=\"mmooc-verktoy-list\">\n                                <ul class=\"mmooc-course-tab-menu-item-list\">\n                                ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.toolList), {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                                </ul>\n                            </div>\n                    </li>\n                ";
  return buffer;
  }
function program8(depth0,data) {
  
  
  return "selected";
  }

function program10(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                                       <li class=\"mmooc-course-tab-menu-item-list-item\"><a href=\"";
  if (helper = helpers.href) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.href); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a></li>\n                                ";
  return buffer;
  }

function program12(depth0,data,depth2) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n                    <li class=\"mmooc-course-tab ";
  stack1 = (helper = helpers.ifEquals || (depth0 && depth0.ifEquals),options={hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.title), (depth2 && depth2.selectedMenuItem), options) : helperMissing.call(depth0, "ifEquals", (depth0 && depth0.title), (depth2 && depth2.selectedMenuItem), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n                        <a href=\"";
  if (helper = helpers.url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n                    </li>\n                ";
  return buffer;
  }

  buffer += "<div id=\"mmooc-course-tabs-container\"";
  stack1 = helpers.unless.call(depth0, ((stack1 = (depth0 && depth0.menuItems)),stack1 == null || stack1 === false ? stack1 : stack1.length), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n    <div id=\"mmooc-course-tabs-container-inner\">\n\n        <h1>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.subtitle), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        \n        ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.menuItems)),stack1 == null || stack1 === false ? stack1 : stack1.length), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n</div>";
  return buffer;
  });

this["mmooc"]["templates"]["courseprogress"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return " mmooc-progress-bar-done";
  }

  buffer += "<div class=\"mmooc-course-progress\">\n    <div>\n        <div class=\"mmooc-course-progress-label\">";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n        <div class=\"mmooc-course-progress-bar\">\n            <div class=\"mmooc-progress-bar";
  stack1 = (helper = helpers.ifAllModulesCompleted || (depth0 && depth0.ifAllModulesCompleted),options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.modules), options) : helperMissing.call(depth0, "ifAllModulesCompleted", (depth0 && depth0.modules), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n                <div class=\"mmooc-progress-bar-inner\" style=\"width:"
    + escapeExpression((helper = helpers.percentageForModules || (depth0 && depth0.percentageForModules),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.modules), options) : helperMissing.call(depth0, "percentageForModules", (depth0 && depth0.modules), options)))
    + "%\">\n                </div>\n            </div>\n        </div>\n\n    </div>\n</div>";
  return buffer;
  });

this["mmooc"]["templates"]["enrollprivacypolicy"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "Jeg godtar <a target=\"_blank\" href=\"";
  if (helper = helpers.privacypolicylink) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.privacypolicylink); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"external\" rel=\"noreferrer\">\n<span>personvernvilkårene</span>\n<span class=\"ui-icon ui-icon-extlink ui-icon-inline\" title=\"Lenker til en ekstern side.\"></span></a> \n";
  return buffer;
  });

this["mmooc"]["templates"]["footer-license"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<footer role=\"contentinfo\" id=\"mmooc-footer\" class=\"ic-app-footer\">\n    <div class=\"mmooc-license\">\n        <p class=\"public-license-text\">Lisensnivå: Illustrasjoner og filmer utviklet i regi av prosjektet: <a href=\"http://creativecommons.org/licenses/by-nc-nd/4.0/\" class=\"external\" target=\"_blank\" rel=\"license\"><span>CC BY-NC-ND 4.0</span></a><br>\n        Annet innhold utviklet i regi av prosjektet: <a href=\"http://creativecommons.org/licenses/by-nc-sa/4.0\" class=\"external\" target=\"_blank\" rel=\"license\"><span>CC BY-NC-SA 4.0</span></a>\n        </p>\n    </div>\n</footer>";
  });

this["mmooc"]["templates"]["groupdiscussionGetHelpFromTeacher"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"getTeachersHelpContainer\">\n    <div class=\"tooltip_below\">\n        <button type=\"button\" id=\"mmooc-get-teachers-help\" class=\"btn btn-primary getTeachersHelp\">Tilkall veileder</button>\n        <div class=\"tooltiptext\">\n        ";
  if (helper = helpers.hoverOverText) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.hoverOverText); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n        </div>\n    </div>\n</div>    \n    ";
  return buffer;
  });

this["mmooc"]["templates"]["groupdiscussionheader"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"mmooc-group-header\">\n    <div id=\"mmooc-group-members\">\n        <div class=\"mmooc-back-button\">\n            <a href=\"/groups/"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.group)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/discussion_topics\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.group)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\n        </div>\n    </div>\n    <div id=\"mmooc-group-links\">\n    </div>\n\n</div>\n";
  return buffer;
  });

this["mmooc"]["templates"]["groupheader"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                <div class=\"mmooc-group-member\">\n                    <div class=\"mmooc-group-member-avatar\" style=\"background-image: url('";
  if (helper = helpers.avatar_url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.avatar_url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "')\"></div>\n                    <div class=\"mmooc-group-member-link\">\n                        <a href=\"/about/";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n                    </div>\n                </div>\n            ";
  return buffer;
  }

  buffer += "<div class=\"mmooc-back-button\">\n    <a href=\""
    + escapeExpression((helper = helpers.urlForCourseId || (depth0 && depth0.urlForCourseId),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.courseId), options) : helperMissing.call(depth0, "urlForCourseId", (depth0 && depth0.courseId), options)))
    + "/groups\">Tilbake til gruppeliste</a>\n</div>\n<div id=\"mmooc-group-header\">\n    <div id=\"mmooc-group-members\">\n        <p><b>Gruppemedlemmer</b></p>\n\n        <div class=\"mmooc-group-members-list\">\n            ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.members), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </div>\n    </div>\n    <div id=\"mmooc-group-links\">\n        <p>\n            <a target=\"_new\" href=\"https://connect.uninett.no/uit-videorom-matematikkmooc-";
  if (helper = helpers.groupId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.groupId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"external\"><b>Videorom for gruppa</b> <span class=\"ui-icon ui-icon-extlink ui-icon-inline\" title=\"Lenker til en ekstern side.\"></span></a>\n        </p>\n    </div>\n\n</div>\n";
  return buffer;
  });

this["mmooc"]["templates"]["moduleitems"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, self=this, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <div class=\"header\">\n            ";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n        </div>\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.items), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <nav aria-label=\"content\" role=\"navigation\">\n            <ul class=\"mmooc-module-items\">\n                ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.items), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </ul>\n            </nav>\n        ";
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n                    ";
  stack1 = (helper = helpers.ifEquals || (depth0 && depth0.ifEquals),options={hash:{},inverse:self.program(22, program22, data),fn:self.program(4, program4, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.type), "SubHeader", options) : helperMissing.call(depth0, "ifEquals", (depth0 && depth0.type), "SubHeader", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                ";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                        </ul>\n                        <ul class=\"mmooc-module-items \n                        ";
  stack1 = helpers['if'].call(depth0, (data == null || data === false ? data : data.first), {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                        \"/>\n                            <li class=\"mmooc-module-item-reveal\">\n                                <a class=\"mmooc-reveal-trigger\"\n                                    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isCurrentHeader), {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "  \n                                    href=\"#mmooc-reveal-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n                                    <span class=\"mmooc-module-items-icons-page ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.done), {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n                                    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isCurrentHeader), {hash:{},inverse:self.program(18, program18, data),fn:self.program(16, program16, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                                        </i>\n                                    </span>\n                                    <span class=\"mmooc-module-item-title mmooc-module-item-header-title\">";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n                                </a>\n                            </li>\n                        </ul>\n                        <ul ";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.isCurrentHeader), {hash:{},inverse:self.noop,fn:self.program(20, program20, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " id=\"mmooc-reveal-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"mmooc-module-items\">\n                    ";
  return buffer;
  }
function program5(depth0,data) {
  
  
  return " mmooc-module-items-header-first\n                        ";
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  stack1 = helpers['if'].call(depth0, (data == null || data === false ? data : data.last), {hash:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                        ";
  return buffer;
  }
function program8(depth0,data) {
  
  
  return " mmooc-module-items-header-last\n                          ";
  }

function program10(depth0,data) {
  
  
  return " mmooc-module-items-header\n                            ";
  }

function program12(depth0,data) {
  
  
  return "\n                                        id=\"mmooc-module-item-active-header\"\n                                    ";
  }

function program14(depth0,data) {
  
  
  return "done";
  }

function program16(depth0,data) {
  
  
  return "\n                                        <i class=\"icon-mini-arrow-down\">\n                                    ";
  }

function program18(depth0,data) {
  
  
  return "\n                                        <i class=\"icon-mini-arrow-right\">\n                                    ";
  }

function program20(depth0,data) {
  
  
  return "style=\"display:none\"";
  }

function program22(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n                        <li class=\"mmooc-module-item mmooc-module-item-icon\">\n                            <a class=\"";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isCurrent), {hash:{},inverse:self.noop,fn:self.program(23, program23, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" href=\"";
  if (helper = helpers.html_url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.html_url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n                                <span class=\"mmooc-module-item-title\">";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n                                <span class=\"mmooc-module-items-icons-";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1);
  stack1 = (helper = helpers.ifItemIsCompleted || (depth0 && depth0.ifItemIsCompleted),options={hash:{},inverse:self.noop,fn:self.program(25, program25, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.completion_requirement), options) : helperMissing.call(depth0, "ifItemIsCompleted", (depth0 && depth0.completion_requirement), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\"\n                                   href=\"";
  if (helper = helpers.html_url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.html_url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n                                    <i class=\"icon-"
    + escapeExpression((helper = helpers.lowercase || (depth0 && depth0.lowercase),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.type), options) : helperMissing.call(depth0, "lowercase", (depth0 && depth0.type), options)))
    + escapeExpression((helper = helpers.overrideIconClassByTitle || (depth0 && depth0.overrideIconClassByTitle),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.title), options) : helperMissing.call(depth0, "overrideIconClassByTitle", (depth0 && depth0.title), options)))
    + "\"></i>\n                                </span>\n                            </a>\n                        </li>\n                    ";
  return buffer;
  }
function program23(depth0,data) {
  
  
  return "active";
  }

function program25(depth0,data) {
  
  
  return " done";
  }

  buffer += "\n    <div class=\"mmooc-module-items-back-to-course-button mmooc-back-button\">\n        <a href=\""
    + escapeExpression((helper = helpers.urlForCourseId || (depth0 && depth0.urlForCourseId),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.courseId), options) : helperMissing.call(depth0, "urlForCourseId", (depth0 && depth0.courseId), options)))
    + "\">";
  if (helper = helpers.backToCoursePage) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.backToCoursePage); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n    </div>\n\n    ";
  stack1 = helpers['with'].call(depth0, (depth0 && depth0.module), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });

this["mmooc"]["templates"]["modules"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, self=this, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n        <div class=\"mmooc-module\">\n                <h2 class=\"light\"><a href=\""
    + escapeExpression((helper = helpers.urlForFirstNoneCompleteItem || (depth0 && depth0.urlForFirstNoneCompleteItem),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.items), options) : helperMissing.call(depth0, "urlForFirstNoneCompleteItem", (depth0 && depth0.items), options)))
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n                </h2>\n            ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.items), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </div>\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                <ul class=\"mmooc-module-items-icons\">\n                    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.items), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                </ul>\n            ";
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n                      ";
  stack1 = (helper = helpers.ifEquals || (depth0 && depth0.ifEquals),options={hash:{},inverse:self.program(7, program7, data),fn:self.program(4, program4, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.type), "SubHeader", options) : helperMissing.call(depth0, "ifEquals", (depth0 && depth0.type), "SubHeader", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                    ";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                          ";
  stack1 = helpers.unless.call(depth0, (data == null || data === false ? data : data.first), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "                            \n                      ";
  return buffer;
  }
function program5(depth0,data) {
  
  
  return "\n                          ";
  }

function program7(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n                             <li class=\"mmooc-module-item-icon\">\n                             <div class=\"tooltip\">\n                             <a class=\"mmooc-module-items-icons-";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " \n                                 ";
  stack1 = (helper = helpers.ifItemIsCompleted || (depth0 && depth0.ifItemIsCompleted),options={hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.completion_requirement), options) : helperMissing.call(depth0, "ifItemIsCompleted", (depth0 && depth0.completion_requirement), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" \n                                 href=\"";
  if (helper = helpers.html_url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.html_url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n                                 <i class=\"icon-"
    + escapeExpression((helper = helpers.lowercase || (depth0 && depth0.lowercase),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.type), options) : helperMissing.call(depth0, "lowercase", (depth0 && depth0.type), options)))
    + escapeExpression((helper = helpers.overrideIconClassByTitle || (depth0 && depth0.overrideIconClassByTitle),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.title), options) : helperMissing.call(depth0, "overrideIconClassByTitle", (depth0 && depth0.title), options)))
    + "\"></i>\n                                 ";
  stack1 = (helper = helpers.ifItemTypeDiscussion || (depth0 && depth0.ifItemTypeDiscussion),options={hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.type), options) : helperMissing.call(depth0, "ifItemTypeDiscussion", (depth0 && depth0.type), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                            </a>\n                             <div class=\"tooltiptext\">";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n                             </div>\n                            </li>\n                      ";
  return buffer;
  }
function program8(depth0,data) {
  
  
  return "done";
  }

function program10(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                                    <div class=\"discussion-unread-tag discussion-id-"
    + escapeExpression(((stack1 = (depth0 && depth0.content_id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></div>\n                                 ";
  return buffer;
  }

  buffer += "<div class=\"mmooc-modules\">\n    <h2 class=\"h3\">";
  if (helper = helpers.coursemodules) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.coursemodules); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.modules), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div> \n";
  return buffer;
  });

this["mmooc"]["templates"]["navigateToPreviousPage"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<nav class=\"mmooc-module-items-back-to-course-button mmooc-back-button\">\n    <span href=\"#\" onclick=\"mmooc.util.goBack()\">\n        ";
  if (helper = helpers.linkText) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.linkText); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n    </span>\n</nav>";
  return buffer;
  });

this["mmooc"]["templates"]["notifications"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<a href=\"/profile/communication\" class=\"edit_settings_link btn button-sidebar-wide\"><i class=\"icon-edit\"></i> Rediger varslingsinnstillinger</a>\n";
  });

this["mmooc"]["templates"]["observer"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"fixed_bottom\">\n    <div id=\"masquerade_bar\" class=\"ic-alert-masquerade-student-view\">\n      <div class=\"ic-alert-masquerade-student-view-module ic-alert-masquerade-student-view-module--header\">\n        <div class=\"ic-image-text-combo\">\n          <i class=\"icon-student-view\"></i>\n          <div class=\"ic-image-text-combo__text\">Du er inne i dette emnet som observatør</div>\n        </div>\n      </div>\n      <div class=\"button-explanation ic-alert-masquerade-student-view-module ic-alert-masquerade-student-view-module--description\">\n        Du vil ikke kunne levere inn oppgaver, bidra i diskusjoner eller se hva andre har bidratt med.\n      </div>\n    </div>\n</div>";
  });

this["mmooc"]["templates"]["powerfunctions/account-picker"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n      <option value=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n      ";
  return buffer;
  }

  buffer += "<div>\n  <form>\n    <select name=\"account\">\n      <option value=\"\">Choose the account...</option>\n      ";
  options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}
  if (helper = helpers.accounts) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.accounts); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.accounts) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </select>\n  </form>\n</div>\n";
  return buffer;
  });

this["mmooc"]["templates"]["powerfunctions/assign-process"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n    <tr id=\"mmpf-assign-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n      <td>";
  if (helper = helpers.group_id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.group_id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n      <td>";
  if (helper = helpers.user_id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.user_id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n      <td class=\"status waiting\">Waiting</td>\n    ";
  return buffer;
  }

  buffer += "<table>\n  <thead>\n    <tr>\n      <th>Group ID</th>\n      <th>Student ID</th>\n      <th>Status</th>\n    </tr>\n  </thead>\n  <tbody>\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.assigns), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </tbody>\n<table>\n\n";
  return buffer;
  });

this["mmooc"]["templates"]["powerfunctions/assign"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<form>\n  <dl>\n    <dt><label for=\"csv\">Upload CSV file</label></dt>\n    <dd><input type=\"file\" name=\"csv\"></dd>\n  </dl>\n  <input type=\"submit\"/>\n</form>\n\n<div class=\"side-information\">\n  <h3>Decription of CSV format</h3>\n  <p>First line of the file must be the name of the columns. Column separators are commas. Fields optionally encloused by double quotes (\").\n  <dl>\n    <dt>group_id [Integer]\n    <dd>The group ID\n    <dt>user_id [String]\n    <dd>The FEIDE user ID\n  </dl>\n</div>\n\n";
  });

this["mmooc"]["templates"]["powerfunctions/course-groups"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n          <option value=\"\">No courses defined for account</option>\n        ";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <option value=\"\">Choose a course</option>\n          ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.courses), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            <option value=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          ";
  return buffer;
  }

  buffer += "<form>\n  <ol>\n    <li class=\"step-1\">\n      <select id=\"mmpf-course-select\">\n        ";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.courses), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </select>\n    <li class=\"step-2\">\n      <select name=\"category\"  onchange=\"$('.step-3').css('display', 'list-item')\">\n          <option value=\"\">No group sets defined for course</option>\n      </select>\n    <li class=\"step-3\"><input type=\"file\" name=\"csv\"  onchange=\"$('.step-4').css('display', 'list-item')\">\n    <li class=\"step-4\"><input type=\"submit\"/>\n  </ol>\n</form>\n\n<div class=\"side-information\">\n  <h3>Decription of CSV format</h3>\n  <p>First line of the file must be the name of the columns. Column separators are commas. Fields optionally encloused by double quotes (\").\n  <dl>\n    <dt>name [String]\n    <dd>The name of the group\n    <dt>description [String]\n    <dd>A description of the group\n  </dl>\n</div>\n";
  return buffer;
  });

this["mmooc"]["templates"]["powerfunctions/group-category"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n          <option value=\"\">No group sets defined for account</option>\n        ";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <option value=\"\">Choose a group set</option>\n          ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.categories), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            <option value=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          ";
  return buffer;
  }

  buffer += "<form>\n  <ol>\n    <li class=\"step-1\">\n      <select name=\"category\"  onchange=\"$('.step-2').css('display', 'list-item')\">\n        ";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.categories), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </select>\n    <li class=\"step-2\"><input type=\"file\" name=\"csv\"  onchange=\"$('.step-3').css('display', 'list-item')\">\n    <li class=\"step-3\"><input type=\"submit\"/>\n  </ol>\n</form>\n\n<div class=\"side-information\">\n  <h3>Decription of CSV format</h3>\n  <p>First line of the file must be the name of the columns. Column separators are commas. Fields optionally encloused by double quotes (\").\n  <dl>\n    <dt>name [String]\n    <dd>The name of the group\n    <dt>description [String]\n    <dd>A description of the group\n  </dl>\n</div>\n";
  return buffer;
  });

this["mmooc"]["templates"]["powerfunctions/groups-process"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n    <tr id=\"mmpf-group-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n      <td>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n      <td>";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n      <td class=\"status waiting\">Waiting</td>\n    ";
  return buffer;
  }

  buffer += "<table>\n  <thead>\n    <tr>\n      <th>Name</th>\n      <th>Description</th>\n      <th>Status</th>\n    </tr>\n  </thead>\n  <tbody>\n    ";
  options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}
  if (helper = helpers.groups) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.groups); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.groups) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </tbody>\n<table>\n\n";
  return buffer;
  });

this["mmooc"]["templates"]["powerfunctions/head"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"mmooc-power-functions\">\n  <h1 class=\"xl\">Power Functions</h1>\n  <h2>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n  <p><a href=\"/?mmpf\">Back</a></p>\n\n";
  return buffer;
  });

this["mmooc"]["templates"]["powerfunctions/headteacher"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"mmooc-power-functions\">\r\n  <h1 class=\"xl\">Power Functions</h1>\r\n  <h2>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\r\n\r\n";
  return buffer;
  });

this["mmooc"]["templates"]["powerfunctions/list-groups"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n  <p>No groups found for account</p>\n";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <table>\n    <tr><th>ID</th><th>Name</th><th>Description</th></tr>\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.groups), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </table>\n";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n      <tr>\n        <td class=\"right\">";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td>";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n      </tr>\n    ";
  return buffer;
  }

  stack1 = helpers.unless.call(depth0, (depth0 && depth0.groups), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });

this["mmooc"]["templates"]["powerfunctions/logins-process"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n    <tr id=\"mmpf-logins-"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n      <td>";
  if (helper = helpers.user_id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.user_id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n      <td>";
  if (helper = helpers.login_id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.login_id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n      <td class=\"status waiting\">Waiting</td>\n    ";
  return buffer;
  }

  buffer += "<table>\n  <thead>\n    <tr>\n      <th>User ID</th>\n      <th>Login ID</th>\n      <th>Status</th>\n    </tr>\n  </thead>\n  <tbody>\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.logins), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </tbody>\n<table>\n";
  return buffer;
  });

this["mmooc"]["templates"]["powerfunctions/logins"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<form>\n  <dl>\n    <dt><label for=\"csv\">Upload CSV file</label></dt>\n    <dd><input type=\"file\" name=\"csv\"></dd>\n  </dl>\n  <input type=\"submit\"/>\n</form>\n\n<div class=\"side-information\">\n  <h3>Decription of CSV format</h3>\n  <p>First line of the file must be the name of the columns. Column separators are commas. Fields optionally encloused by double quotes (\").\n  <dl>\n    <dt>current_id [String]\n    <dd>The current FEIDE user ID \n    <dt>new_id [String]\n    <dd>The new  FEIDE user ID\n  </dl>\n</div>\n\n";
  });

this["mmooc"]["templates"]["powerfunctions/main"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"mmooc-pf-main\">\n	<h3>Teacher functions</h3>\n	<div class=\"mmooc-pf-list\">\n	  <div id=\"mmooc-pf-peer-review-btn\" class=\"item\">Peer review</div>\n	  <div id=\"mmooc-pf-student-progress-btn\" class=\"item\">Student progress</div>\n	</div>\n	<h3>Administrator functions</h3>\n	<div class=\"mmooc-pf-list\">\n	  <div id=\"mmooc-pf-list-group-btn\" class=\"item\">List groups</div>\n	  <div id=\"mmooc-pf-group-btn\" class=\"item\">Create account groups</div>\n	  <div id=\"mmooc-pf-course-group-btn\" class=\"item\">Create course groups</div>\n	  <div id=\"mmooc-pf-assign-btn\" class=\"item\">Assign students to groups</div>\n	  <div id=\"mmooc-pf-logins-btn\" class=\"item\">Add new logins</div>\n	</div>\n</div>\n";
  });

this["mmooc"]["templates"]["powerfunctions/mainteacher"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"mmooc-pf-main\">\r\n	<h3>Teacher functions</h3>\r\n	<div class=\"mmooc-pf-list\">\r\n	  <div id=\"mmooc-pf-peer-review-btn\" class=\"item\">Peer review</div>\r\n	  <div id=\"mmooc-pf-student-progress-btn\" class=\"item\">Student progress</div>\r\n	</div>\r\n</div>\r\n";
  });

this["mmooc"]["templates"]["powerfunctions/peer-review"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n          <option value=\"\" disabled>No courses defined for account</option>\n        ";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <option value=\"\">Choose a course</option>\n          ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.courses), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            <option value=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          ";
  return buffer;
  }

  buffer += "<form>\n  <ol>\n    <li class=\"step-1\">\n      <select id=\"mmpf-course-select\">\n        ";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.courses), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </select>\n    <li class=\"step-2\">\n      <select id=\"mmpf-category-select\" name=\"category\">\n          <option value=\"\" disabled>No group sets defined for course</option>\n      </select>\n    <li class=\"step-3\">\n      <select id=\"mmpf-group-select\" name=\"group\" multiple>\n          <option value=\"\" disabled>No groups defined for course</option>\n      </select>\n    <li class=\"step-4\">\n      <select id=\"mmpf-assignment-select\" name=\"assignment\">\n          <option value=\"\" disabled>No assignments defined for course</option>\n      </select>\n  </ol>\n  <div class=\"assignment-info\"></div>\n  <div class=\"progress-info\"></div>\n  <div id=\"progress\">\n  	<div id=\"bar\"></div>\n  </div>\n  <div class=\"peer-review-list\"></div>\n  <div class=\"peer-review-create\"></div>\n</form>\n";
  return buffer;
  });

this["mmooc"]["templates"]["powerfunctions/student-progress"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n          <option value=\"\">No courses defined for account</option>\n        ";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <option value=\"\">Choose a course</option>\n          ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.courses), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            <option value=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          ";
  return buffer;
  }

  buffer += "<form>\n  <ol>\n    <li class=\"step-1\">\n      <select id=\"mmpf-course-select\">\n        ";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.courses), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </select>\n    <li class=\"step-2\">\n      <select id=\"mmpf-section-select\" name=\"section\">\n          <option value=\"\">No sections defined for course</option>\n      </select>\n    <li class=\"step-3\">\n      <select id=\"mmpf-module-select\" name=\"module\">\n          <option value=\"\">No modules defined for course</option>\n      </select>\n  </ol>\n  <div id=\"progress\">\n  	<div id=\"bar\"></div>\n  </div>\n  <div class=\"student-progress-table\"></div>\n</form>\n";
  return buffer;
  });

this["mmooc"]["templates"]["powerfunctions/tail"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "</div>\n";
  });

this["mmooc"]["templates"]["usermenu"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<ul id=\"user-menu\">\n    <li class=\"mmooc-menu-item\" id=\"mmooc-menu-item-varsler\">\n        <a href=\"#\" class=\"mmooc-menu-item-title\" >Varsler <i class=\"icon-mini-arrow-down\"></i><span id=\"mmooc-notification-count\"></span></a>\n        <div class=\"mmooc-menu-item-drop\" id=\"mmooc-activity-stream\">\n        </div>\n    </li>\n    <li class=\"mmooc-menu-item\">\n        <a href=\"/conversations\" class=\"mmooc-menu-item-title\">Innboks <span id=\"mmooc-unread-messages-count\"></span></a>\n    </li>\n    <li class=\"mmooc-menu-item profile-settings\" id=\"mmooc-menu-item-profile-settings\">\n        <a href=\"#\" class=\"mmooc-menu-item-title\">\n            <div class=\"ic-avatar\" aria-hidden=\"true\">\n                <img src=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.avatar_image_url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.display_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\n            </div>\n            <i class=\"icon-mini-arrow-down\"></i>\n        </a>\n        <div class=\"mmooc-menu-item-drop\" id=\"mmooc-profile-settings\">\n            <ul>\n                <li><a href=\"/profile/settings\">Innstillinger</a></li>\n                <li><a href=\"/logout\">Logg ut</a></li>\n            </ul>\n        </div>\n    </li>\n</ul>\n";
  return buffer;
  });

this["mmooc"]["templates"]["waitIcon"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"fountainG\">\n    <div id=\"fountainG_1\" class=\"fountainG\">\n    </div>\n    <div id=\"fountainG_2\" class=\"fountainG\">\n    </div>\n    <div id=\"fountainG_3\" class=\"fountainG\">\n    </div>\n    <div id=\"fountainG_4\" class=\"fountainG\">\n    </div>\n    <div id=\"fountainG_5\" class=\"fountainG\">\n    </div>\n    <div id=\"fountainG_6\" class=\"fountainG\">\n    </div>\n    <div id=\"fountainG_7\" class=\"fountainG\">\n    </div>\n    <div id=\"fountainG_8\" class=\"fountainG\">\n    </div>\n</div>";
  });
this.mmooc=this.mmooc||{};

this.mmooc.api = function() {
    var _urlToTypeMapping = [];

    _urlToTypeMapping['quizzes'] = 'Quiz';
    _urlToTypeMapping['assignments'] = 'Assignment';
    _urlToTypeMapping['discussion_topics'] = 'Discussion';


    return {
        _ajax: typeof $   !== "undefined" ? $   : {},

        _env:  typeof ENV !== "undefined" ? ENV : {},

        _location: typeof document !== "undefined" ? document.location : {search:"", href:""},

        _uriPrefix: "/api/v1",

        _defaultError: function (event, jqxhr, settings, thrownError) {
            console.log(event, jqxhr, settings, thrownError);
        },

        _sendRequest: function(method, options) {
            var error    = options.error || this._defaultError;
            var uri      = this._uriPrefix + options.uri;
            var params   = options.params || {};
            var callback = options.callback;
            method(uri, params, callback).fail(error);
        },

        _get: function(options) {
            //this._sendRequest(this._ajax.get, options);
            
            /*  Fix for returning student_id in response. 
            *   Needed for powerfunction _printStudentProgressForSection to list progress for correct student.
            */
            
            var uri      = this._uriPrefix + options.uri;
            var params   = options.params || {};
            var callback = options.callback;
 
            $.ajax({
                url: uri,
                type: 'GET',
                data: params,
                success: function(response) {
                    if("student_id" in params) {
                        response = response.map(function(el){el.student_id = params.student_id; return el});
                    }
                    if(uri.indexOf("/groups/") !== -1 && uri.indexOf("/users") !== -1) {
                      var groupId = uri.split("/groups/");
                      groupId = groupId[1].split("/users");
                      groupId = parseInt(groupId[0]);
                      response = response.map(function(el){el.group_id = groupId; return el});
                    }
                    callback(response);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Error during GET");
                }
            });           
                
        },

        _post: function(options) {
            this._sendRequest(this._ajax.post, options);
        },

        _put: function(options) {
            var uri      = this._uriPrefix + options.uri;
            var params   = options.params || {};
            var callback = options.callback;

            $.ajax({
                url: uri,
                type: 'PUT',
                data: params,
                success: function(response) {
                    callback(response);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Error during PUT");
                }
            });
        },

        /*  FIXME for listModulesForCourse()
         *  This function loads data in a blocking manner no matter how many items and modules are present.
         *  This could potentially pose problems in the future, as page load time increases rapidly when
         *  the number of requests are numerous. This function should be updated to use non-blocking loading
         *  if Canvas is not updated to allow for better data loading through their API.
         */
        listModulesForCourse: function(callback, error, cid)
        {
            var href= "/api/v1/courses/" + cid + "/modules?per_page=100";
            $.getJSON(href, function(modules) {
                    var noOfModules = modules.length;
                    var asyncsDone = 0;
                    for (var i = 0; i < noOfModules; i++) {
                        var m = modules[i];
                        var href= "/api/v1/courses/" + cid + "/modules/" + m.id + "/items?per_page=100";
                        $.getJSON(
                            href,
                            (function(j) {
                                return function(items) {
                                    modules[j].items = items;
                                    asyncsDone++;

                                    if(asyncsDone === noOfModules) {
                                        callback(modules);
                                    }
                                };
                            }(i)) // calling the function with the current value
                        );
                    };
                }
            );
        },

        getCurrentModuleItemId : function() {
            var moduleId;
            var relativeUrl = location.pathname;
            var patt = /\/courses\/\d+\/modules\/items\/\d+$/;
            var isRelativeUrlMatching = patt.test(relativeUrl);
            if (isRelativeUrlMatching) {
                var n = relativeUrl.lastIndexOf('/');
                moduleId = relativeUrl.substring(n + 1);
            } else {
                var paramName = "module_item_id";
                var q = "" + this._location.search;
                if (typeof q === "undefined" || q.indexOf(paramName) == -1) {
                    return null;
                }

                moduleId = q.substring(q.indexOf(paramName) + paramName.length + 1, q.length);
                if (moduleId.indexOf("&") != -1) {
                    moduleId = moduleId.substring(0, moduleId.indexOf("&"));
                }
            }

            return parseInt(moduleId, 10);
        },

        getCurrentTypeAndContentId: function() {
            var regexp = /\/courses\/\d+\/\w+\/\d+/;

            if (regexp.test("" + this._location.pathname)) {
                var tmp = this._location.pathname.split("/");
                if (tmp.length >= 5) {
                    var type = _urlToTypeMapping[tmp[3]];
                    var contentId = parseInt(tmp[4], 10);
                    return { contentId: contentId, type: type};
                }
            }
            return null;
        },

        getSelfRegisterCourse: function(callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/search/all_courses",
                "params":   { "search": "SELFREGISTER" }
            });
        },        


        getAllCourses: function(callback, error) {
            this._get({
                "callback": function(courses) {
                    var filteredCourses = courses.filter(mmooc.util.filterSearchAllCourse);
                    callback(filteredCourses);
                },
                "error":    error,
                "uri":      "/search/all_courses",
                "params":   { per_page: 999 }
            });
        },        
        
        getEnrolledCourses: function(callback, error) {
            this._get({
                "callback": function(courses) {
                    var filteredCourses = courses.filter(mmooc.util.filterCourse);
                    callback(filteredCourses);
                },
                "error":    error,
                "uri":      "/courses",
                "params":   { "include": ["syllabus_body", "course_progress"], "per_page": "100" }
            });
        },
        
/* 12032018 Erlend Thune: Refactor this out by adding course progress parameter to getEnrolledCourses.
        getEnrolledCoursesProgress: function(callback, error) {
            this._get({
                "callback": function(courses) {
                    var filteredCourses = courses.filter(mmooc.util.filterCourse);
                    callback(filteredCourses);
                },
                "error":    error,
                "uri":      "/courses",
                "params":   { "include": ["course_progress"], "per_page": "100" }
            });
        },
*/
        /* FIXME Regarding include items: This parameter suggests that
         * Canvas return module items directly in the Module object
         * JSON, to avoid having to make separate API requests for
         * each module when enumerating modules and items. Canvas is
         * free to omit 'items' for any particular module if it deems
         * them too numerous to return inline. Callers must be
         * prepared to use the List Module Items API if items are not
         * returned.
         */
        getModulesForCurrentCourse: function(callback, error) {
            var courseId = this.getCurrentCourseId();
            this.listModulesForCourse(callback, error, courseId);
        },

        getModulesForCourseId: function(callback, error, courseId) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/courses/" + courseId + "/modules",
                "params":   { per_page: 999 }
            });
        },

        getItemsForModuleId: function(callback, error, courseId, moduleId, params) {
            this._get({
                "callback": callback,
                "error": error,
                "uri": "/courses/" + courseId + "/modules/" + moduleId + "/items",
                "params": params
            });
        },

        getCurrentCourseId: function() {
            var currentUrl = "" + this._location.pathname;
            var matches = currentUrl.match(/\/courses\/(\d+)/);
            if (matches != null) {
                return parseInt(matches[1], 10);
            } else if (this._env.group) {
                // Group pages does not contain course id in URL, but is available via JavaScript variable
                return this._env.group.context_id;
            } else if ($("#discussion_container").size() > 0) {
                // Group subpages contains course id only in a link
                //#discussion_topic > div.entry-content > header > div > div.pull-left > span > a
                //20180904ETH Student self created group discussion does not have this element.
                //            Add checking to avoid exception.
                var tmp = $("#discussion_topic div.entry-content header div div.pull-left span a");
                if(tmp.length) {
                    var tmpHref = tmp.attr("href");
                    if(tmpHref.length) {
                        var tmpHrefArr = tmpHref.split("/");
                        if (tmpHrefArr.length == 3) {
                            return parseInt(tmpHrefArr[2], 10);
                        }
                    }
                }
            } 

            return null;
        },


        getCourse: function(courseId, callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/courses/" + courseId,
                "params":   {  }
            });
        },

        getCurrentGroupId: function() {
            var currentUrl = "" + this._location.pathname;
            var matches = currentUrl.match(/\/groups\/(\d+)/);
            if (matches != null) {
                return parseInt(matches[1], 10);
            }
            return null;
        },

        getGroup: function(groupId, callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/groups/" + groupId,
                "params":   {}
            });
        },

        getGroupMembers: function(groupId, callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/groups/" + groupId + "/users",
                "params":   {"include": ["avatar_url"], "per_page": 999 }
            });
        },


		//////
        getCurrentModuleForItemOrTypeAndContentId: function(moduleItemId, typeAndContentId, callback, error) {
            this.getModulesForCurrentCourse(function(modules) {
                var bCurrentItemFound = false;
                var currentHeaderItem = null;
                for (var i = 0; i < modules.length; i++) {
                    var module = modules[i];
                    var items = module.items;
                    var noOfItemsBelongingToThisHeaderDone = 0;
                    var noOfItemsBelongingToThisHeader = 0;
                    for (var j = 0; j < items.length; j++) {
                        var item = items[j];
                        
                        //Need to check type and id for quiz and assignment items
                        var isCurrentModuleItem = item.id == moduleItemId || (typeAndContentId != null && typeAndContentId.contentId == item.content_id && typeAndContentId.type == item.type);
                        if (isCurrentModuleItem) {
                            item.isCurrent = true;
                            bCurrentItemFound = true;
                            if(currentHeaderItem)
                            {
                                currentHeaderItem.isCurrentHeader = true;
                            }
                        }
                        //Need to check for subheaders to support collapsible elements in the menu.
                        if (item.type == "SubHeader")
                        {
                            //Need to know if headeritem icon should be green.
                            if(currentHeaderItem && (noOfItemsBelongingToThisHeader == noOfItemsBelongingToThisHeaderDone))
                            {
                                currentHeaderItem.done = true;
                            }
                            currentHeaderItem = item;
                            noOfItemsBelongingToThisHeaderDone = 0;
                            noOfItemsBelongingToThisHeader = 0;
                        }
                        else
                        {
                            noOfItemsBelongingToThisHeader++;
                        }


                        //Keep track of number of items passed.
                        if(item.completion_requirement) 
                        {
                            if(item.completion_requirement.completed) 
                            {
                                noOfItemsBelongingToThisHeaderDone++;
                            }
                        }
                    }
                    //Have to check if the last header item is passed.
                    if(currentHeaderItem && (noOfItemsBelongingToThisHeader == noOfItemsBelongingToThisHeaderDone))
                    {
                        currentHeaderItem.passed = true;
                    }
                    
                    //Callback and return when we've found the current item.
                    if(bCurrentItemFound)
                    {
                        callback(module);
                        return;
                    }
                }

            }, error);
        },

		//To find which module a group discussion belongs to, we need to
		//1. Get the group discussion
		//2. Get the group category
		//3. Get the root discussion
		//4. Get the module
	    //A group discussion has a location like this:
	    //https://beta.matematikk.mooc.no/groups/361/discussion_topics/79006
		getCurrentModuleItemForGroupDiscussion: function(callback, error) {
            var regexp = /\/groups\/\d+\/discussion_topics\/\d+/;
			var tmp;
		    var groupId;
		    var groupTopicId;

			//Extract groupId and groupTopicId			
            if (regexp.test("" + this._location.pathname)) {
                tmp = this._location.pathname.split("/");
                if (tmp.length >= 5) {
                    groupTopicId = tmp[4];
		            groupId = tmp[2];
                }
            }
            
            if(groupTopicId == null)
            {
            	return;
            }
            
            //https://beta.matematikk.mooc.no/api/v1/groups/361/discussion_topics/79006
		    //Need to keep track of this to access it inside the inline functions below.
			var _this = this;
			this.getSpecificGroupDiscussionTopic(groupId, groupTopicId, function(groupDiscussion) {
				_this.getUserGroups(function(groups) {
					for (var i = 0; i < groups.length; i++) {
						if(groups[i].id == groupId)
						{
							var moduleItemId = null;
		        			var currentTypeAndContentId = { contentId: groupDiscussion.root_topic_id, type: "Discussion"};
		        			_this.getCurrentModuleForItemOrTypeAndContentId(moduleItemId, currentTypeAndContentId, callback, error);
			        		break; //We found the correct group, no need to check the rest.
			        	}
		        	} //end for all the groups
                }); //getUserGroups
            }); //getSpecificGroupDiscussionTopic
		}, 

        getCurrentModule: function(callback, error) {
            var currentModuleItemId = this.getCurrentModuleItemId();
            var currentTypeAndContentId = null;
            var bFound = true;
            //Quizzes and assignments does not have module item id in URL
            if (currentModuleItemId == null) {
                currentTypeAndContentId = this.getCurrentTypeAndContentId();
                
                //If we haven't found what we want by now, it must be a group discussion
                if (currentTypeAndContentId == null) {
					bFound = false;                	
					this.getCurrentModuleItemForGroupDiscussion(callback, error);
                }
            }
            
            if(bFound)
            {
				this.getCurrentModuleForItemOrTypeAndContentId(currentModuleItemId, currentTypeAndContentId, callback, error)
            }
        },

        getLocale : function() {
            return this._env.LOCALE;
        },
        
        usesFrontPage : function() {
            return this._env.COURSE.default_view == "wiki";
        }, 
        
        getRoles : function() {
            return this._env.current_user_roles;
        },

        getUser : function() {
            return this._env.current_user;
        },

        getUserProfile : function(callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/users/self/profile",
                "params":   { }
            });
        },
        getActivityStreamForUser: function(callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/users/self/activity_stream",
                "params":   { }
            });
        },

        currentPageIsAnnouncement: function() {
            return ($("#section-tabs").find("a.announcements.active").size() == 1);
        },

        currentPageIsModuleItem: function() {
            if (this.getCurrentModuleItemId() != null || this.getCurrentTypeAndContentId() != null) {
                return true;
            } else {
                return false;
            }
        },

        //20180914ETH Inbox unread count used the DOM, but Canvas updates the DOM asynchronously, causing
        //            the value to be 0 if our code ran to early. Use the API instead.
        getUnreadMessageSize: function(callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/conversations/unread_count",
                "params":   { }
            });
        },
//api/v1/search/recipients?search=&per_page=20&permissions[]=send_messages_all&messageable_only=true&synthetic_contexts=true&context=course_1_sections
//[{"id":"section_4","name":"Test 1","avatar_url":"http://localhost/images/messages/avatar-group-50.png","type":"context","user_count":2,"permissions":{"send_messages_all":true,"send_messages":true}}]
        getSectionRecipients: function(courseId, callback, error) {
            var recipientsContext = "course_" + courseId + "_sections";
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/search/recipients",
                "params":   {
                    permissions: ["send_messages_all"],
                    messageable_only: true,
                    synthetic_contexts: true,
                    context: recipientsContext,
                    per_page: 999
                 }
            });
        },

        /*
        from_conversation_id: 
mode: async
scope: 
filter: 
group_conversation: true
course: course_1
context_code: course_1
recipients[]: section_6
subject: Test
bulk_message: 0
user_note: 0
media_comment_id: 
media_comment_type: 
body: test
*/


        postMessageToConversation: function(courseId, recipient, subject, body, callback, error) {
            var courseContext = "course_" + courseId;
            this._post({
                "callback": callback,
                "error":    error,
                "uri":      "/conversations",
                "params":   {
                    course: courseContext,
                    recipients: [recipient],
                    subject: subject,
                    body: body
                }
            });
        },


        getAccounts: function(callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/accounts",
                "params":   { }
            });

        },

        getUsersForAccount: function(account, callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/accounts/" + account + "/users",
                "params":   { }
            });
        },
        getCoursesForAccount: function(account, callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/accounts/" + account + "/courses",
                "params":   { per_page: 999 }
            });
        },

        getCoursesForUser: function(callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/courses",
                "params":   { per_page: 999 }
            });
        },
        
        getGroupCategoriesForAccount: function(account, callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/accounts/" + account + "/group_categories",
                "params":   { }
            });
        },

        getGroupCategoriesForCourse: function(course, callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/courses/" + course + "/group_categories",
                "params":   { per_page: 999 }
            });
        },

        // Recursively fetch all groups by following the next links
        // found in the Links response header:
        // https://canvas.instructure.com/doc/api/file.pagination.html
        _getGroupsForAccountHelper: function(accumulatedGroups, callback, error) {
            var that = this;
            return function(groups, status, xhr) {
                Array.prototype.push.apply(accumulatedGroups, groups);
                var next = xhr.getResponseHeader('Link').split(',').find(function (e) {
                    return e.match("rel=\"next\"");
                });
                if (next === undefined) {
                    callback(accumulatedGroups);
                }
                else {
                    var fullURI = next.match("<([^>]+)>")[1];
                    that._get({
                        "callback": that._getGroupsForAccountHelper(accumulatedGroups, callback, error),
                        "error":    error,
                        "uri":      fullURI.split("api/v1")[1],
                        "params":   { }
                    });
                }
            };
        },

        getGroupsForAccount: function(account, callback, error) {
            this._get({
                "callback": this._getGroupsForAccountHelper([], callback, error),
                "error":    error,
                "uri":      "/accounts/" + account + "/groups",
                "params":   { per_page: 999 }
            });
        },

		// /api/v1/group_categories/:group_category_id
        getGroupCategory: function(categoryID, callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/group_categories/" + categoryID,
                "params":   { }
            });
        },
		        
        // /api/v1/group_categories/:group_category_id/groups
        getGroupsInCategory: function(categoryID, callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/group_categories/" + categoryID + "/groups",
                "params":   { per_page: 999 }
            });
        },
        
        // /api/v1/courses/:course_id/groups
        getGroupsInCourse: function(courseID, callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/courses/" + courseID + "/groups",
                "params":   { per_page: 999 }
            });
        },
        
        getUserGroups: function(callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/users/self/groups",
                "params":   { per_page: 999 }
            });
        },        
        getUserGroupsForCourse: function(courseId, callback, error) {
            this.getUserGroups(function(courseId) {
                return function(groups) {
                    var usersGroups = [];
                    for (var i = 0; i < groups.length; i++) {
                        var group = groups[i];
                        if(group.course_id == courseId)
                        {
                            usersGroups.push(group);
                        }
                    }
                    callback(usersGroups);
                }
            }(courseId));
        },        
        
        // /api/v1/courses/:course_id/sections
        getSectionsForCourse: function(courseID, params, callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/courses/" + courseID + "/sections",
                "params":   params
            });
        },
        
        // /api/v1/sections/:section_id
        getSingleSection: function(sectionID, callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/sections/" + sectionID,
                "params":   {}
            });
        },     
                
        // /api/v1/courses/54/assignments/369
        getSingleAssignment : function(courseId, assignmentId, callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/courses/" + courseId + "/assignments/" + assignmentId,
                // "params":   {"include": ["submission", "assignment_visibility", "overrides", "observed_users"]}
                "params":   {}
            });
        },
        
        // /api/v1/courses/:course_id/assignments
        getAssignmentsForCourse : function(courseId, callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/courses/" + courseId + "/assignments",
                "params":   { per_page: 999 }
            });
        },       
        getPagesForCourse: function(courseId, callback) {
            this._get({
                "callback": callback,
                "uri":      "/courses/" + courseId + "/pages",
                "params":   { per_page: 999 }
            });
        },

        getDiscussionTopicsForCourse: function(courseId, callback) {
            this._get({
                "callback": callback,
                "uri":      "/courses/" + courseId + "/discussion_topics",
                "params":   { per_page: 999 }
            });
        },
        getQuizzesForCourse: function(courseId, callback) {
            this._get({
                "callback": callback,
                "uri":      "/courses/" + courseId + "/quizzes",
                "params":   { per_page: 999 }
            });
        },
        
        // /api/v1/courses/54/assignments/369/submissions/1725
        getSingleSubmissionForUser : function(courseId, assignmentId, user_id, callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/courses/" + courseId + "/assignments/" + assignmentId + "/submissions/" + user_id,
                "params":   {"include": ["submission_history", "submission_comments", "rubric_assessment", "visibility", "course", "user"]}
                // "params":   {"include": ["rubric_assessment", "visibility"]}
            });
        },
        
        // /api/v1/courses/7/assignments/11/submissions/4/peer_reviews
        // This API displays info about who has the peer review for a specific submissionID which is the id property on the submission object (different from user id)
        getPeerReviewsForSubmissionId : function(courseId, assignmentId, submission_id, callback, error) {
            // Returns only the student's peer reviews if you are a student. Returns all peer reviews if you are a teacher or admin
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/courses/" + courseId + "/assignments/" + assignmentId + "/submissions/" + submission_id + "/peer_reviews",
                // "params":   {"include": ["submission_comments", "user"]}
                "params":   {"include": ["user"]}
            });
        },
        
        // /api/v1/courses/:course_id/assignments/:assignment_id/peer_reviews
        getPeerReviewsForAssignment : function(courseId, assignmentId, callback, error) {
            this._get({
                "callback": callback,
                "error":    error,
                "uri":      "/courses/" + courseId + "/assignments/" + assignmentId + "/peer_reviews",
                "params":   {"include": ["user"]}
            });
        },
        
 
        createPeerReview: function(courseID, assignmentID, submissionID, userID, callback, error) {
            this._post({
                "callback": callback,
                "error":    error,
                "uri":      "/courses/" + courseID + "/assignments/" + assignmentID + "/submissions/" + submissionID + "/peer_reviews",
                "params":   { user_id: userID }
            });
        },
        
        //https://kurs.iktsenteret.no/api/v1/courses/41/enrollments?enrollment%5Bself_enrollment_code%5D=WJTLML&enrollment%5Buser_id%5D=self
        enrollUser: function(enrollAction, callback) {
            var jqxhr = $.post( enrollAction, function(data) {
                callback(data)
            });
        },
/*
uri = sprintf("/api/v1/courses/%d/enrollments", cid)
dbg(uri)
$canvas.post(uri, {'enrollment[user_id]' => user_id, 'enrollment[type]' => etype,
	'enrollment[enrollment_state]' => "active"})
*/        
        enrollUserIdInSection: function(userId, sectionId, etype, callback, error) {
            this._post({
                "callback": callback,
                "error":    error,
                "uri":      "/sections/" + sectionId + "/enrollments/",
                "params":   {
                    'enrollment[user_id]': userId,
                    'enrollment[type]': etype,
                    'enrollment[enrollment_state]': 'active',
                    'enrollment[limit_privileges_to_course_section]': true
                }
            });
            return true;
        },
        createGroup: function(categoryId, groupName, callback, error) {
            this._post({
                "callback": callback,
                "error":    error,
                "uri":      "/group_categories/" + categoryId + "/groups",
                "params":   {
                    name: groupName
                }
            });
        },
        createSection: function(courseId, sectionName, callback, error) {
            this._post({
                "callback": callback,
                "error":    error,
                "uri":      "/courses/" + courseId + "/sections",
                "params":   {
                    'course_section[name]': sectionName
                }
            });
        },

        createGroupMembership: function(gid, uid, callback, error) {
            this._post({
                "callback": callback,
                "error":    error,
                "uri":      "/groups/" + gid + "/memberships",
                "params":   { user_id: uid }
            });

        },


        createUserLogin: function(params, callback, error) {
            var account_id = params.account_id;
            delete params.account_id;
            this._post({
                "callback": callback,
                "error": error,
                "uri": "/accounts/" + account_id + "/logins",
                "params": params
            });
        },

        getDiscussionTopic: function(courseId, contentId, callback) {
            this._get({
                "callback": callback,
                "uri":      "/courses/" + courseId + "/discussion_topics/" + contentId,
                "params":   { per_page: 999 }
            });
        },
 
        getQuiz: function(courseId, contentId, callback) {
            this._get({
                "callback": callback,
                "uri":      "/courses/" + courseId + "/quizzes/" + contentId,
                "params":   { per_page: 999 }
            });
        },

        getSpecificGroupDiscussionTopic: function(groupId, contentId, callback) {
            this._get({
                "callback": callback,
                "uri":      "/groups/" + groupId + "/discussion_topics/" +contentId,
                "params":   { per_page: 999 }
            });
        },
        
        getGroupDiscussionTopics: function(contentId, callback) {
            this._get({
                "callback": callback,
                "uri":      "/groups/" + contentId + "/discussion_topics/",
                "params":   { per_page: 999 }
            });
        },
        
        getAnnouncementsForCourse: function(courseId, callback) {
            this._get({
                "callback": callback,
                "uri":      "/courses/" + courseId + "/discussion_topics",
                "params":   { only_announcements: true, per_page: 999 }
            });
        },

        getEnrollmentsForCourse: function(courseId, params, callback) {
            this._get({
                "callback": callback,
                "uri":      "/courses/" + courseId + "/enrollments",
                "params":   params
            });
        },
        getEnrollmentsForSection: function(sectionId, params, callback) {
            this._get({
                "callback": callback,
                "uri":      "/sections/" + sectionId + "/enrollments",
                "params":   params
            });
        },
        
        getCaledarEvents: function(params, callback) {
            this._get({
                "callback": callback,
                "uri":      "/calendar_events/",
                "params":   params
            });
        },
        
        //To be used later when displaying info about unread discussion comments.
        // getDiscussionTopics: function(courseId, callback) {
        //     this._get({
        //         "callback": callback,
        //         "uri":      "/courses/" + courseId + "/discussion_topics",
        //         "params":   { per_page: 999 }
        //     });
        // },

        markDiscussionTopicAsRead: function(courseId, contentId, callback) {
            this._put({
                "callback": callback,
                "uri":      "/courses/" + courseId + "/discussion_topics/" + contentId + "/read_all",
                "params":   { forced_read_state: 'false' }
            });
        }
    };
}();

if (typeof module !== "undefined" && module !== null) {
    module.exports = this.mmooc.api;
}

this.mmooc = this.mmooc || {};


this.mmooc.announcements = function () {
    function hideMarkAsReadButton() {
        $('#markAllAsReadButton').hide();
        mmooc.menu.updateNotificationsForUser();
    }


    return {
        addMarkAsReadButton: function() {
            var contentId = mmooc.api.getCurrentTypeAndContentId().contentId;
            var courseId = mmooc.api.getCurrentCourseId();

            mmooc.api.getDiscussionTopic(courseId, contentId, function(discussionTopic) {
                if (discussionTopic.read_state !== "read") {
                    var buttonHTML = mmooc.util.renderTemplateWithData("actionbutton", {id: "markAllAsReadButton", title: "Marker som lest"});
                    document.getElementById('content-wrapper').insertAdjacentHTML('afterbegin', buttonHTML);

                    $('#markAllAsReadButton').click(function() {
                        mmooc.api.markDiscussionTopicAsRead(courseId, contentId, hideMarkAsReadButton);
                    });
                }
            });

        },
        printAnnouncementsUnreadCount: function() {
            var courseId = mmooc.api.getCurrentCourseId();
            mmooc.api.getAnnouncementsForCourse(courseId, function(announcements) {
                var totalUnread = 0;
                for (var i = 0; i < announcements.length; i++) {
                    if (announcements[i].read_state == "unread" || announcements[i].unread_count > 0) {
                        totalUnread++;
                    }
                }
                if (totalUnread > 0) {
                    mmooc.announcements.printUnreadCountInTab(totalUnread);
                }
            });

        },
        printUnreadCountInTab: function(totalUnread) {
            $(".mmooc-course-tab a").each(function() {
                if ($(this).text() == "Kunngjøringer") {
                    $(this).parent().append("<span class='discussion-unread-value discussion-unread-tab'>" + totalUnread + "</span>")
                }
            });           
        },
        setAnnouncementsListUnreadClass: function() {
          var checkExist = setInterval(function() {
            if ($("body.announcements .discussionTopicIndexList .discussion-topic").length) {
              clearInterval(checkExist);
              $("body.announcements .discussionTopicIndexList .discussion-topic").each(function() {
                var unread = $(this).find('.new-items').attr("title");
                if(unread.indexOf('Ingen uleste svar.') == -1) {
                  $(this).addClass('unread');
                  $(this).removeClass('read');
                }
              });
            }
          }, 100); 
        }
    };
}();


this.mmooc=this.mmooc||{};


this.mmooc.badges = function() {

    function resizeIframe() {
        mmooc.util.adaptHeightToIframeContentForId('tool_content_wrapper', 'tool_content');
    };
    return {
        initPage: function() {
            resizeIframe();

            var resizeTimer;
            $(window).resize(function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(resizeIframe, 42);
            });

        },

        claimBadge: function(OpenBadges, urls, callBack) {
            OpenBadges.issue_no_modal(urls, callBack);
        }
    }
}();

this.mmooc=this.mmooc||{};


this.mmooc.courseList = function() {
    return {
        listCourses: function(parentId, callback) {
	        if (document.getElementsByClassName('reaccept_terms').length === 0) {
            	mmooc.api.getEnrolledCourses(function (courses) {
					
					var $oldContent = $('#' + parentId).children(); //After an update the 'Add course button' is in #content including a popupform. So we need to move this to another place in the DOM so we don't overwrite it.
					$oldContent.appendTo("#right-side-wrapper #right-side");
					
					$('#' + parentId).html("<div>Laster " + mmooc.i18n.CoursePlural.toLowerCase() + "....</div>"); //overwrite the contents in parentID and display: 'Laster kurs....'
					
					var html = "";
					
                    if (courses.length == 0) {
                      html = "<h1>Mine " + 
                                  mmooc.i18n.CoursePlural.toLowerCase() +
                                  "</h1>" +
                                  "<p>" + mmooc.i18n.NoEnrollments + "</p>" +
                                  "<a class='btn' href='/search/all_courses'>Se tilgjengelige " +
                                  mmooc.i18n.CoursePlural.toLowerCase() +
                                  "</a>";
                      $('#' + parentId).html(html);            
                    }
                    else {
                      html =  mmooc.util.renderTemplateWithData("courselistcontainer", {courseLabel: mmooc.i18n.CoursePlural.toLowerCase()});
                      $('#' + parentId).html(html); 
                      
                      var sortedCourses = mmooc.util.arraySorted(courses, "course_code");
                      
                      var categorys = mmooc.util.getCourseCategories(sortedCourses);
                      
                      var coursesCategorized = mmooc.util.getCoursesCategorized(sortedCourses, categorys);

                      for (var i = 0; i < coursesCategorized.length; i++) {
                          html = mmooc.util.renderTemplateWithData("courselist", {title: coursesCategorized[i].title, courses: coursesCategorized[i].courses, courseLabel: mmooc.i18n.Course.toLowerCase()});
                           $('.mmooc-course-list-container').append(html);
                      }

                    }
                    document.title = mmooc.i18n.CoursePlural;

					if ($.isFunction(callback)) {
	                    callback();
	                }
            	});
            }
        },
        showAddCourseButton : function() {
            // Move canvas Start new course button, since we hide its original location
            var $button = $('#start_new_course');
            if ($button.length) {
                $('#content').append($button);
                $button.html(mmooc.i18n.AddACourse);
            }
        },
        showFilter : function(sortedCourses) {
	        // Show filter options based on first part of course code            
            var filterOptions = ["Alle"];           
            $(sortedCourses).each(function(index) {
	            var values = sortedCourses[index].course_code.split('::');    
	            if(values.length > 1) {
		            if(filterOptions.indexOf(values[0]) == -1) {
			            filterOptions.push(values[0]);
		            }		 
	        	}	        
        	});
        	filterOptions.push("Andre");
        	var options = '';
    			for(var i=0; i<filterOptions.length; i++) {
    				options += '<option value="' + filterOptions[i] + '">' + filterOptions[i] + '</option>';
    			}
    			$('#filter').append(options);                       
            },
            applyFilter : function(sortedCourses) {
    			if($("#filter").val() == 'Alle') {
    				$(sortedCourses).each(function() {
    					$("#course_" + this.id).show();
    				});
    			}				
    			else if($("#filter").val() == 'Andre') {
    				$(sortedCourses).each(function() {
    					if(this.course_code.indexOf("::") >= 0) {
    						$("#course_" + this.id).hide();
    					}
    					else {
    						$("#course_" + this.id).show();
    					}						
    				});
    			}				
			else {			
				$(sortedCourses).each(function() {
					var courseCode = this.course_code.split('::')[0];
					if($("#filter").val() == courseCode) {
						$("#course_" + this.id).show();
					}
					else {
						$("#course_" + this.id).hide();
					}						
				});				
			}
        },        
        isCourseCompleted: function(modules) {
            for (var i = 0; i < modules.length; i++) {
                var module = modules[i];
                for (var j = 0; j < module.items.length; j++) {
                    var item = module.items[j];
                    if (item.completion_requirement && !item.completion_requirement.completed) {
                        return false;
                    }
                }
            }
            return true;
        }
    };
}();

this.mmooc=this.mmooc||{};


this.mmooc.coursePage = function() {

    return {

        listModulesAndShowProgressBar: function() {
            mmooc.api.getModulesForCurrentCourse(function(modules) {
                var progressHTML = mmooc.util.renderTemplateWithData("courseprogress", {title: mmooc.i18n.CourseProgressionTitle, modules: modules});
                document.getElementById('course_home_content').insertAdjacentHTML('beforebegin', progressHTML);

                var modulesHTML = mmooc.util.renderTemplateWithData("modules", {navname: mmooc.i18n.GoToModule, coursemodules: mmooc.i18n.ModulePlural, modules: modules});
                document.getElementById('course_home_content').insertAdjacentHTML('beforebegin', modulesHTML);
                
                mmooc.discussionTopics.printDiscussionUnreadCount(modules, "coursepage");
            });
        },
        hideCourseInvitationsForAllUsers: function() {
            
            var acceptanceTextToSearchFor = 'invitert til å delta';
            //If .ic-notification__message contains 'Invitert til å delta' så skjul nærmeste parent .ic-notification  
            $(".ic-notification__message.notification_message:contains('" + acceptanceTextToSearchFor + "')")
                .closest('.ic-notification.ic-notification--success')
                .hide();
            
            var acceptanceFlashTextToSearchFor = 'delta i dette kurset';
            
             $("ul#flash_message_holder li:contains('" + acceptanceFlashTextToSearchFor + "')")
                .hide();
        },
        
        //Until Canvas has corrected the translation of drop course to something else than "slipp emnet", we override the functionality.
        overrideUnregisterDialog : function() {
            var selfUnenrollmentButton = $(".self_unenrollment_link");
            var selfUnenrollmentDialog = $("#self_unenrollment_dialog");
            if(selfUnenrollmentButton.length)
            {
                selfUnenrollmentButton.text(selfUnenrollmentButton.text().replace("Slipp dette emnet", mmooc.i18n.DropCourse));
//                selfUnenrollmentButton.off(); //Prevent default presentation of the dialog with incorrect translation.
                selfUnenrollmentButton.on("click",function(e) {
                	setTimeout(function() {
                        $("#ui-id-1").html(mmooc.i18n.DropCourse); 
                	}, 200);
                });
            }
            if(selfUnenrollmentDialog.length)
            {
                selfUnenrollmentDialog.find("h2").hide();
                selfUnenrollmentDialog.find(".button-container a span").text("OK");
                selfUnenrollmentDialog.find(".button-container a i").hide(); //Hide x at beginning of OK button
                
                //Hide default dialog text
                $('#self_unenrollment_dialog').contents().filter(function() {
                     return this.nodeType == 3
                }).each(function(){
                    this.textContent = "";
                });
                //Add our dialog text
                $('#self_unenrollment_dialog').prepend("<div/><p/><p>" + mmooc.i18n.DropCourseDialogText + "<span class='unenroll_dialog_sad'></span><p>" + 
                mmooc.i18n.JoinCourseDialogText + "<span class='unenroll_dialog_happy'></span></p>");
            }
        },

        replaceUpcomingInSidebar: function() {
            $("body.home .coming_up").replaceWith(
                "<div class='deadlines-container'>" +
                "<h2>" + mmooc.i18n.eventsAndDeadlinesTitle + "</h2>" +
                "<div class='deadlines-scroll-up'></div>" +
                "<div class='deadlines-list'></div>" +
                "<div class='deadlines-scroll-down'></div>" +
                "</div>"
            );
        },
        _displayDeadlines: function(allDeadlines) {
            allDeadlines.sort(function(a,b){
                return a.date - b.date;
            });
            var weekday = [];
            var month = [];
            var html = "<table>";
            for (var i = 0; i < allDeadlines.length; i++) {
                var monthName = mmooc.util.getMonthShortName(allDeadlines[i].date);
                if ("url" in allDeadlines[i]) {
                    html += "<tr id='deadline-" + i + "'><div></div><td class='deadline-date'>" + allDeadlines[i].date.getDate() + ". " + monthName + "</td><td class='deadline-title'><a href='" + allDeadlines[i].url + "' title='" + allDeadlines[i].title + "'>" + allDeadlines[i].title + "</a></td></tr>";
                }
                else {
                    html += "<tr id='deadline-" + i + "'><td class='deadline-date'>" + allDeadlines[i].date.getDate() + ". " + monthName + "</td><td class='deadline-title'>" + allDeadlines[i].title + "</td></tr>";
                }
            }
            html += "</table>";
            $("body.home .deadlines-list").html(html);
            var upcoming = mmooc.coursePage.findUpcomingDate(allDeadlines);
            $("#deadline-" + upcoming).addClass("upcoming");
            var parent = $("body.home .deadlines-list");
            var row = $("#deadline-" + upcoming);
            parent.scrollTop(parent.scrollTop() + row.position().top  - (parent.height()/2) + (row.height()/2));
            $(".deadlines-scroll-up").click(function() {
                var scroll = parent.scrollTop() - 50;
                $(parent).animate({
                    scrollTop: scroll
                }, 200);
            });
            $(".deadlines-scroll-down").click(function() {
                var scroll = parent.scrollTop() + 50;
                $(parent).animate({
                    scrollTop: scroll
                }, 200);
            });
        },
        printDeadlinesForCourse: function() {
            var courseId = mmooc.api.getCurrentCourseId();
            var allDeadlines = [];
            var params = { all_events: 1, type: "event", "context_codes": ["course_" + courseId] };
            mmooc.api.getCaledarEvents(params, function(events) {
                for (var i = 0; i < events.length; i++) {
                    if (events[i].end_at) {
                        var date = new Date(events[i].end_at);
                        var deadlineObj = {
                            date: date,
                            title: events[i].title
                        };
                        allDeadlines.push(deadlineObj);
                    }
                }
                var params = { all_events: 1, type: "assignment", "context_codes": ["course_" + courseId] };
                mmooc.api.getCaledarEvents(params, function(assignments) {
                    for (var i = 0; i < assignments.length; i++) {
                        if(assignments[i].all_day_date) {
                            var date = new Date(assignments[i].all_day_date);
                            var deadlineObj = {
                                date: date,
                                title: assignments[i].title,
                                url: assignments[i].html_url
                            };
                            allDeadlines.push(deadlineObj);
                        }
                    }
                    if(allDeadlines.length)
                    {
                        mmooc.coursePage._displayDeadlines(allDeadlines);
                    }
                });
            });
        },
        findUpcomingDate: function(dates) {
            var today = Date.now();
            var nearestDate, nearestDiff = Infinity;
            var noMoreDeadlines = true;
            for (var i = 0; i < dates.length; i++) {
                var diff = +dates[i].date - today;
                if (diff > 0  &&  diff < nearestDiff) {
                    nearestDiff = diff;
                    nearestDate = i;
                    noMoreDeadlines = false;
                }
            }
            if (noMoreDeadlines) {
                return dates.length - 1;
            }
            else {
                return nearestDate;
            }            
        }       
    };
}();

this.mmooc=this.mmooc||{};

this.mmooc.coursesettings = function() {

    var DISCUSSIONTYPE = 0;
    var ASSIGNMENTTYPE = 1;
    var QUIZTYPE = 2;
    var PAGETYPE = 3;

    var AllModuleItems = [];
    var error = function(error) {
        console.error("error calling api", error);
    };

    function updateOverallProgress(s)
    {
        $("#mmoocOverallProgress").html(s);
    }
    function getStyle(color, bgcolor)
    {
        return "style='background-color:" + bgcolor + ";color:" + color + "'";
    }
    function getBooleanOutput(result)
    {
        if(result)
        {
            return getStyle("white", "green") + ">JA";
        }
        return getStyle("white", "red") + ">NEI";
    }

    function clearTableWithId(id)
    {
        $("#" + id).html("");
    }

    function printRowInTableId(id, c1, c2)
    {
        var rowHtml = "<tr><td>" + c1 + "</td><td>" + c2 + "</td></tr>";
        $("#" + id).append(rowHtml);
    }
    function printRowWithColorInTableId(id, c1, c2, color, bgcolor)
    {
        var rowHtml = "<tr><td " + getStyle(color, bgcolor) + ">" + c1 + "</td><td "+ getStyle(color, bgcolor) + ">" + c2 + "</td></tr>";
        $("#" + id).append(rowHtml);
    }
    function printRedRowInTableId(id, c1, c2)
    {
        printRowWithColorInTableId(id,c1,c2,"white","red");
    }
    function printGreenRowInTableId(id, c1, c2)
    {
        printRowWithColorInTableId(id,c1,c2,"white","green");
    }


    function printRow(c1,c2)
    {
        return "<tr><td>" + c1 + "</td><td>" + c2 + "</td></tr>";
    }
    function printRowWithColor(c1,c2, color, bgcolor)
    {
        return "<tr><td" + getStyle(color, bgcolor) + ">" + c1 + "</td><td>" + c2 + "</td></tr>";
    }
    function printRedRow(c1,c2)
    {
        return printRowWithColor(c1,c2,"white","red");
    }
    function printGreenRow(c1,c2)
    {
        return printRowWithColor(c1,c2,"white","green");
    }

    function getSanityTableId(courseId, moduleId, contentId)
    {
        return "Sanity" + courseId + moduleId + contentId;
    }

    function getWaitIconRowId(tableId) {
        return "Wait" + tableId;
    }
    function waitIcon(tableId)
    {
        $("#" + tableId).append("<tr id='" + getWaitIconRowId(tableId) + "'>td><img src='https://matematikk-mooc.github.io/frontend/bitmaps/loading.gif'/>");
    }
    function clearWaitIcon(tableId)
    {
        $("#" + getWaitIconRowId(tableId)).remove();
    }

    function printPageTable(courseId, moduleId, item)
    {
        var contentHtml = "";
        return contentHtml;
    }
    function postProcessPageTable(courseId, moduleId, item)
    {
        var tableId = getSanityTableId(courseId, moduleId, item.id);
        var req = item.completion_requirement;
        if(req) {
            var reqtype = req.type;
            if(reqtype != "must_mark_done"){
                printRedRowInTableId(tableId, "Krav:", reqtype + "(Vi anbefaler merk som ferdig for innholdssider.)")
            }
        }
        else
        {
            printRowInTableId(tableId, "Ingen", "");
        }

        clearWaitIcon(tableId);
    }
    function printSubHeaderTable(courseId, moduleId, item)
    {
        var contentHtml = "";
        return contentHtml;
    }
    function postProcessSubHeaderTable(courseId, moduleId, item)
    {
        var tableId = getSanityTableId(courseId, moduleId, item.id);
        printRowInTableId(tableId, "Ingen", "")
        clearWaitIcon(tableId);
    }
    function printFileTable(courseId, moduleId, item) {
        var contentHtml = "";
        var req = item.completion_requirement;
        if (req) {
            var reqtype = req.type;
            if(reqtype != "must_mark_done") {
                contentHtml += printRedRow("Krav:", reqtype);
            }
        }
        return contentHtml;
    }
    function postProcessFileTable(courseId, moduleId, item) {
        var tableId = getSanityTableId(courseId, moduleId, item.id);
        printRowInTableId(tableId, "Ingen", "")
        clearWaitIcon(tableId);
    }
    function printDiscussionTable(courseId, moduleId, item) {
        var contentHtml = "";
        var req = item.completion_requirement;
        if (req) {
            var reqtype = req.type;
            if(reqtype != "must_contribute") {
                contentHtml += printRedRow("Krav:", reqtype);
            }
        }
        return contentHtml;
    }
    function postProcessDiscussionTable(courseId, moduleId, item) {
        var tableId = getSanityTableId(courseId, moduleId, item.id);
        var contentId = item.content_id;
        mmooc.api.getDiscussionTopic(courseId, contentId, (function(tableId) {
            return function(d) {
                clearWaitIcon(tableId);
                if(d.discussion_type != "side_comment") {
                    printRedRowInTableId(tableId, "Trådtype:", d.discussion_type + "(Vi anbefaler side_comment.)");
                }
                var gid = d.group_category_id;
                if(!gid) {
                    printRedRowInTableId(tableId, "Gruppekategori:", "Mangler (Dette blir en diskusjon hvor samtlige studenter deltar. Vi anbefaler gruppediskusjoner dersom det er mange studenter.)");
                }
                else
                {
                    printGreenRowInTableId(tableId, "Gruppekategori:", gid);
                }
            }
        }(tableId)));
    }

    function printAssignmentTable(courseId, moduleId, item)
    {
        var contentHtml = "";
        var req = item.completion_requirement;
        if (req)
        {
            var reqtype = req.type;
            if(reqtype != "must_submit") {
                contentHtml += printRedRow("Krav:", reqtype + " på innleveringsoppgave.");
            }
        }

        return contentHtml;
    }
    function postProcessAssignmentTable(courseId, moduleId, item)
    {
        var contentId = item.content_id;
        var tableId = getSanityTableId(courseId, moduleId, item.id);
        mmooc.api.getSingleAssignment(courseId, contentId, (function(tableId) {
            return function(a) {
                clearWaitIcon(tableId);
                printRowInTableId(tableId, "Type:", a.submission_types);
                console.log("Assignment submission type: " + a.submission_types);
                if(a.submission_types.indexOf("online_upload") > -1)
                {
                    if(a.allowed_extensions)
                    {
                        printRowInTableId(tableId, "Tillatte filendelser:", a.allowed_extensions);
                    }
                    else
                    {
                        printRedRowInTableId(tableId, "Ingen tillatte filendelser spesifisert. Vi anbefaler å sette dette.");
                    }
                }
                if(!a.due_at)
                {
                    printRedRowInTableId(tableId, "Frist:", "Ingen. (Vi anbefaler å ha en frist)");
                }
                else
                {
                    printRowInTableId(tableId, "Frist:", a.due_at);
                }
                printRowInTableId(tableId, "Hverandrevurdering:", a.peer_reviews);
                if(a.peer_reviews) {
                    if(a.automatic_peer_reviews) {
                        var hvvfrist = "ingen";
                        hvvfrist = a.peer_reviews_assign_at;
                        printRedRowInTableId(tableId, "Tildeling av hverandrevurdering:", hvvfrist + " (Vi anbefaler ikke automatisk tildeling.");
                        printRowInTableId(tableId, "Antall vurderinger:", a.peer_review_count);
                    }
                    else
                    {
                        printGreenRowInTableId(tableId, "Tildeling av hverandrevurdering: ", "Manuell. Dette er anbefalt. Husk å legge fristen i kalenderen.");
                    }
                }
            }
        }(tableId)), error);
    }

    function printQuizTable(courseId, moduleId, item) {
        var contentHtml = "";
        var req = item.completion_requirement;
        if (req) {
            var reqtype = req.type;
            if(reqtype != "min_score") {
                contentHtml += printRedRow("Krav:", reqtype + " på quiz.");
            }
        }
        return contentHtml;
    }
    function postProcessQuizTable(courseId, moduleId, item) {
        var contentId = item.content_id;
        var tableId = getSanityTableId(courseId, moduleId, item.id);
        mmooc.api.getQuiz(courseId, contentId, (function(tableId) {
            return function(q) {
                clearWaitIcon(tableId);
                printRowInTableId(tableId, "Frist:", q.due_at);
            }
        }(tableId)));
    }


    function printSanityTableForItem(courseId, moduleId, item) {
        var tableId = getSanityTableId(courseId, moduleId, item.id);
        var contentHtml = "<table id='" + tableId + "'>";
        var type = item.type;
        console.log("Item type:" + type);
        if(type == "Assignment") {
            contentHtml += printAssignmentTable(courseId, moduleId, item);
        } else if (type == "Discussion") {
            contentHtml += printDiscussionTable(courseId, moduleId, item);
        } else if(type == "Page") {
            contentHtml += printPageTable(courseId, moduleId, item)
        } else if(type == "Quiz") {
            contentHtml += printQuizTable(courseId, moduleId, item);
        } else if(type == "File") {
            contentHtml += printFileTable(courseId, moduleId, item);
        } else if(type == "SubHeader") {
            contentHtml += printSubHeaderTable(courseId, moduleId, item);
        }
        waitIcon(tableId);
        contentHtml += "</table>";
        return contentHtml;
    }

    function postProcessSanityTableForItem(courseId, moduleId, item) {
        var type = item.type;
        if(type == "Assignment") {
            postProcessAssignmentTable(courseId, moduleId, item);
        } else if (type == "Discussion") {
            postProcessDiscussionTable(courseId, moduleId, item);
        } else if(type == "Page") {
            postProcessPageTable(courseId, moduleId, item)
        } else if(type == "Quiz") {
            postProcessQuizTable(courseId, moduleId, item);
        } else if(type == "File") {
            postProcessFileTable(courseId, moduleId, item);
        } else if(type == "SubHeader") {
            postProcessSubHeaderTable(courseId, moduleId, item);
        }
    }

    function getCommonUrlKey(url)
    {
        var key = "";
        var urlPrefix = "/courses";

        var start = url.indexOf(urlPrefix);
        if(start > -1)
        {
             key = url.substr(start);
        }
        else
        {
            console.log("getCommonUrlKey: Could not find key for url: " + url);
        }
        return key;
    }

    function storeItem(item)
    {
        if(item.type=="SubHeader")
        {
            return;
        }
        var url = item.url;

        var key = getCommonUrlKey(url);

        AllModuleItems[key] = item;
    }

    function getSanityTableForModule(courseId, module)
    {
        var contentHtml = "<table class='table'><thead><tr><th>Innholdselement</th><th>Publisert</th><th>Krav</th><th>Type</th><th>Detaljer</th></tr></thead><tbody>";
        var moduleItems = module.items;
        var moduleId = module.id;
        for (var i = 0; i < moduleItems.length; i++)
        {
            var item = moduleItems[i];

            storeItem(item);

            contentHtml += "<td>" + item.title + "</td>";

            contentHtml += "<td " + getBooleanOutput(item.published) + "</td>";
            var req = item.completion_requirement;
            if(item.type == "SubHeader")
            {
                contentHtml += "<td>";
            }
            else
            {
                contentHtml += "<td " + getBooleanOutput(req);
            }
            if(req)
            {
                var reqtype = req.type;
                contentHtml += " (" + reqtype + ")";
                contentHtml += " ";
                if(reqtype == "min_score")
                {
                    var min_score = req.min_score;
                    contentHtml += "<br/>Min score: " + min_score;
                }
            }
            contentHtml += "</td><td>";
            contentHtml += item.type;
            contentHtml += "</td><td>";
            contentHtml +=  printSanityTableForItem(courseId, moduleId, item);
            contentHtml += "</td>";
            contentHtml += "</tr>";
        } //End for all module items.
        contentHtml += "</tbody></table>";
        return contentHtml;
    }
    function postProcessSanityTableForModule(courseId, module)
    {
        var moduleItems = module.items;
        var moduleId = module.id;
        for (var i = 0; i < moduleItems.length; i++)
        {
            var item = moduleItems[i];
            postProcessSanityTableForItem(courseId, moduleId, item);
        }
    }

    function processModules(courseId, modules){
        var contentHtml = "";
        for (var i = 0; i < modules.length; i++) {
           var module = modules[i];

           contentHtml += "<p><b>Modulnavn:" + module.name + "</b></p>";
           contentHtml += "<p>Publisert: <span " + getBooleanOutput(module.published) + "</span></p>";

           contentHtml += getSanityTableForModule(courseId, module);
           contentHtml += "<hr/>";
        } //End for all modules
        return contentHtml;
    } //end function

    function postProcessModules(courseId, modules){
        for (var i = 0; i < modules.length; i++) {
           var module = modules[i];
           postProcessSanityTableForModule(courseId, module);
        } //End for all modules
    } //end function


    function getTitle(item, pageType) {
        var title = "";
        if((pageType == DISCUSSIONTYPE) || (pageType == PAGETYPE)) {
            title = item.title;
        }
        else {
            title = item.name;
        }
        return title;
    }
    function getPublishedString(item) {
        var s = "NEI";
        if (item.published)
        {
            s = "<span style='bgcolor=red;color=white'>JA</span>";
        }
        return s
    }

    function getOrphanTableId(pageType) {
        return "pageType" + pageType;
    }
    function createTable(pageType, description)
    {
        var contentHtml = "<h2>" + description + "</h2>" + "<table class='table' id='" + getOrphanTableId(pageType) + "'>";
        contentHtml += "<thead><tr><th>Publisert</th><th>Tittel</th><th>Lenke</th></tr></thead><tbody></tbody></table>";
        return contentHtml;
    }
    function printRowWithColorInOrphanTable(pageType, c1, c2,c3, color, bgcolor)
    {
        var rowHtml = "<tr><td " + getStyle(color, bgcolor) + ">" + c1 + "</td><td "+ getStyle(color, bgcolor) + ">" + c2 + "</td><td "+ getStyle(color, bgcolor) + ">" + c3 + "</td></tr>";
        $("#" + getOrphanTableId(pageType)).append(rowHtml);
    }
    function printRedRowInOrphanTable(pageType, c1, c2, c3) {
        printRowWithColorInOrphanTable(pageType, c1, c2,c3, "white", "red");
    }
    function printGreenRowInOrphanTable(pageType, c1, c2, c3) {
        printRowWithColorInOrphanTable(pageType, c1, c2,c3, "white", "green");
    }


    function getOrphanItemsTable(itemList, pageType) {
        var orphans = false;
        for (var i = 0; i < itemList.length; i++) {
            var item = itemList[i];
            var key = getCommonUrlKey(item.html_url);
            var moduleItem = AllModuleItems[key];
            if(!moduleItem) {
                var title = getTitle(item, pageType);
                var published = getPublishedString(item);
                printRedRowInOrphanTable(pageType, published, title, key);
                orphans = true;
            }
        }
        if(!orphans) {
            printGreenRowInOrphanTable(pageType, "Ingen", "", "");
        }
	}
	
	function getGroupCategoryTableId(id)
	{
	    return "pfdkGroupCategory_" + id;
	}
	function getSectionTableId(id)
	{
	    return "pfdkSection_" + id;
	}

    return {
        addSanityCheckButton: function() {
            $("#right-side table.summary").before("<a id='pfdksanitycheck' class='Button Button--link Button--link--has-divider Button--course-settings' href='#'><i class='icon-student-view' />Sanity check</a>");

            //Når man trykker på knappen så kjører koden nedenfor.
            $('#pfdksanitycheck').on('click', function() {
                bCancel = false;
                var contentarea = $('#content');
                var contentHtml = "";
                contentarea.html('<h1>Sanity check</h1>\
        <div id="mmoocOverallProgress"></div>\
        <div id="resultarea"></div>');

                var courseId = mmooc.api.getCurrentCourseId();
                mmooc.api.getCourse(courseId, function(course) {
                    contentHtml += "<p><b>Kursnavn:</b> " + course.name + "</p>";
                    var coursePublished = (course.workflow_state == "available");
                    contentHtml += "<p>Publisert: <span " + getBooleanOutput(coursePublished) + "</span></p>";

                    contentHtml += createTable(PAGETYPE, "Løsrevne sider");
                    contentHtml += createTable(ASSIGNMENTTYPE, "Løsrevne oppgaver");
                    contentHtml += createTable(DISCUSSIONTYPE, "Løsrevne diskusjoner");
                    contentHtml += createTable(QUIZTYPE, "Løsrevne quizer");

                    mmooc.api.getModulesForCurrentCourse(function(modules) {
                        contentHtml += processModules(courseId, modules);
                        $("#resultarea").html(contentHtml);
                        postProcessModules(courseId, modules);

                        mmooc.api.getPagesForCourse(courseId, function(pages) {
                            getOrphanItemsTable(pages, PAGETYPE);
                        });
                        mmooc.api.getAssignmentsForCourse(courseId, function(assignments) {
                            getOrphanItemsTable(assignments, ASSIGNMENTTYPE);
                        });
                        mmooc.api.getDiscussionTopicsForCourse(courseId, function(discussions) {
                            getOrphanItemsTable(discussions, DISCUSSIONTYPE);
                        });
                        mmooc.api.getQuizzesForCourse(courseId, function(quizzes) {
                            getOrphanItemsTable(quizzes, QUIZTYPE);
                        });

                    }, error);
                }, error);


            });
        },

        addListSectionsButton: function() {
            $("#right-side table.summary").before("<a id='pfdklistsections' class='Button Button--link Button--link--has-divider Button--course-settings' href='#'><i class='icon-student-view' />List sections</a>");

            //Når man trykker på knappen så kjører koden nedenfor.
            $('#pfdklistsections').on('click', function() {
                var contentarea = $('#content');
                contentarea.html('<h1>Seksjoner</h1>\<div id="resultarea"></div>');

                var courseId = mmooc.api.getCurrentCourseId();
                var params = { per_page: 999 };
                mmooc.api.getSectionsForCourse(courseId, params, function(sections) {
                    var resultHtml = "<table class='table'><tr><th>Section name</th><th>Section id</th></tr>"
                    for (var i = 0; i < sections.length; i++) {
                      resultHtml = resultHtml + "<tr><td>" + sections[i].name + "</td><td>" + sections[i].id + "</td></tr>";
                    }
                    resultHtml += "</table>";
                    $("#resultarea").html(resultHtml);                    
                });
            });
        },
        addListUsersButton: function() {
            $("#right-side table.summary").before("<a id='pfdklistusers' class='Button Button--link Button--link--has-divider Button--course-settings' href='#'><i class='icon-student-view' />List users</a>");

            //Når man trykker på knappen så kjører koden nedenfor.
            $('#pfdklistusers').on('click', function() {
                var contentarea = $('#content');
                contentarea.html('<h1>Brukere</h1>\<div id="resultarea"></div>');

                var courseId = mmooc.api.getCurrentCourseId();

                var params = { per_page: 999 };
                mmooc.api.getSectionsForCourse(courseId, params, function(sections) {
                    var tableHtml = "";
                    for (var i = 0; i < sections.length; i++) {
                        var section = sections[i];
                        var tableId =  getSectionTableId(section.id);                   
                        tableHtml = "<h2>" + section.name + "</h2>" +
                        "<table class='table' id='" +
                        tableId +
                        "'>";
                        tableHtml += "<thead><tr><th>User id</th><th>SIS user id</th></tr></thead><tbody></tbody></table>";
                        $("#resultarea").append(tableHtml); 

                        var params = { per_page: 999 };
                        mmooc.api.getEnrollmentsForSection(section.id, params, function(enrollments) {
                            for (var j = 0; j < enrollments.length; j++) {
                                var enrollment = enrollments[j];
                                var tableId = getSectionTableId(enrollment.course_section_id);
                                var rowHtml = "<tr><td>" + enrollment.user_id +
                                "</td><td>" + 
                                enrollment.sis_user_id +
                                "</td></tr>";
                                $("#" + tableId).append(rowHtml);
                            }
                        });
                    } // end for all sections
                }); //end getsectionsforcourse
            }); //end pfdklistuser click button
        },
        addListAssignmentsButton: function() {
            $("#right-side table.summary").before("<a id='pfdklistassignments' class='Button Button--link Button--link--has-divider Button--course-settings' href='#'><i class='icon-student-view' />List assignments</a>");

            //Når man trykker på knappen så kjører koden nedenfor.
            $('#pfdklistassignments').on('click', function() {
                var contentarea = $('#content');
                contentarea.html('<h1>Oppgaver</h1>\<div id="resultarea"></div>');

                var courseId = mmooc.api.getCurrentCourseId();

                var params = { per_page: 999 };
                mmooc.api.getAssignmentsForCourse(courseId, function(assignments) {
                    if(!assignments.length)
                    {
                        $("#resultarea").append("Ingen oppgaver");
                    }
                    else {
                        var tableHtml = "<table class='table' id='pfdkassignmentstable'>";
                        tableHtml += "<thead><tr><th>Oppgave id</th><th>Beskrivelse</th><th>Hverandrevurdering</th></tr></thead><tbody></tbody></table>";
                        $("#resultarea").append(tableHtml); 
                        for (var i = 0; i < assignments.length; i++) {
                            var assignment = assignments[i];
                            var peerReview = "NEI";
                        
                            if(assignment.peer_reviews) {
                                peerReview = "JA";
                            }

                            var rowHtml = "<tr><td>" + assignment.id +
                                    "</td><td><a href='" +
                                    assignment.html_url + "' target='_blank'>"
                                     + 
                                    assignment.name +
                                    "</a></td><td>" + peerReview +
                                    "</td></tr>";
                            $("#pfdkassignmentstable").append(rowHtml);
                        } //end for all assignments
                    } // endif any assignments
                }); //end getAssignmentsForCourse
            }); //end addListAssignmentsButton click button
        },
       
        addListGroupsButton: function() {
            $("#right-side table.summary").before("<a id='pfdklistgroups' class='Button Button--link Button--link--has-divider Button--course-settings' href='#'><i class='icon-student-view' />List groups</a>");

            //Når man trykker på knappen så kjører koden nedenfor.
            $('#pfdklistgroups').on('click', function() {
                var contentarea = $('#content');
                contentarea.html('<h1>Grupper</h1>\<div id="resultarea"></div>');

                var courseId = mmooc.api.getCurrentCourseId();
                mmooc.api.getGroupCategoriesForCourse(courseId, function(categories) {
                    var tableHtml = "";
                    for(var i = 0; i < categories.length; i++) {
                        var category = categories[i];
                        var tableId = getGroupCategoryTableId(category.id);
                        tableHtml = "<h2>" + category.name + 
                        "</h2>" + "<table class='table' id='" 
                        + tableId 
                        + "'>";
                        tableHtml += "<thead><tr><th>Gruppenavn</th><th>Id</th></tr></thead><tbody></tbody></table>";
                        $("#resultarea").append(tableHtml); 
                        
                        mmooc.api.getGroupsInCategory(category.id, function(groups) {
                            for(var j = 0; j < groups.length; j++) {
                                var group = groups[j];
                                var tableId = getGroupCategoryTableId(group.group_category_id);
                                var rowHtml = "<tr><td>" + group.name +
                                "</td><td>" + 
                                group.id +
                                "</td></tr>";
                                $("#" + tableId).append(rowHtml);
                            }
                        });
                    }
                }); //end getGroupCategoriesForCourse
            }); //end pfdklistgroups button pressed
        } //end addListGroupsButton
    }
}();    
this.mmooc = this.mmooc || {};

this.mmooc.discussionTopics = function () {
    return {
        setDiscussionTopicPubDate: function(discussionTopic) {
            if(discussionTopic) {
              var formattedDate = mmooc.util.formattedDate(discussionTopic.posted_at);
              var pubDate = $("<div class='publication-date'>" + formattedDate + "</div>");
              $(pubDate).prependTo('#discussion_topic .discussion-header-right');
            }
        },

        setDiscussionsListUnreadClass: function() {
          var checkExist = setInterval(function() {
            if ($("body.discussions #open-discussions .ig-list .discussion").length) {
              clearInterval(checkExist);
              $("body.discussions #open-discussions .ig-list .discussion").each(function() {
                var unread = $(this).find('.new-items').text();
                if(unread.indexOf('0') == -1) {
                  $(this).addClass('unread');
                }
              });
            }
          }, 100); 
        },
        insertSearchButton: function() {
          $('.index_view_filter_form').append('<button class="btn btn-discussion-search">'); 
        },
        printDiscussionUnreadCount: function(modules, context) {
            var discussionItems = mmooc.discussionTopics.getDiscussionItems(modules);
            var courseId = mmooc.api.getCurrentCourseId();
            var totalUnread = 0;
            var asyncsDone = 0;
            var groupDiscussionTopics = [];
            for (var i = 0; i < discussionItems.length; i++) {
                var contentId = discussionItems[i].content_id;
                mmooc.api.getDiscussionTopic(courseId, contentId, function(discussionTopic) {
                    if (discussionTopic) {
                        if (discussionTopic.group_category_id) {
                            groupDiscussionTopics.push(discussionTopic);
                        }
                        else {
                            if (discussionTopic.unread_count > 0) {
                                if (context == "coursepage") {
                                    mmooc.discussionTopics.printUnreadCountOnIcon(discussionTopic.unread_count, discussionTopic.id);
                                }
                                totalUnread = totalUnread + discussionTopic.unread_count;
                            }
                        }
                    }
                    asyncsDone++;
                    if (asyncsDone == discussionItems.length) {
                        if (totalUnread > 0 && groupDiscussionTopics.length == 0) {
                            mmooc.discussionTopics.printUnreadCountInTab(totalUnread);
                            if (context == "discussionslist") {
                                return;
                            }
                        }
                        else if (groupDiscussionTopics.length > 0) {
                            mmooc.discussionTopics.printGroupDiscussionUnreadCount(courseId, groupDiscussionTopics, totalUnread, context);
                        }
                        else {
                            return;
                        }
                    }
                });
            }
        },
        printGroupDiscussionUnreadCount: function(courseId, groupDiscussionTopics, totalUnread, context) {
            // if teacher or admin
            if (mmooc.util.isTeacherOrAdmin()) {
                var params = { user_id: "self", per_page: 999 };
                var asyncsDone = 0;
                var sectionNames = [];
                // get enrollments and sections for current user
                mmooc.api.getEnrollmentsForCourse(courseId, params, function(enrollments) {
                    for (var i = 0; i < enrollments.length; i++) {
                        var sectionId = enrollments[i].course_section_id;
                        mmooc.api.getSingleSection(sectionId, function(section) {
                            sectionNames.push(section.name);
                            asyncsDone++;
                            if (asyncsDone == enrollments.length) {
                                mmooc.api.getGroupsInCourse(courseId, function(groups) {
                                    var totalAsyncs = 0;
                                    var allUnreadCounts = [];
                                    asyncsDone = 0;
                                    for (var j = 0; j < groups.length; j++) {
                                        for (var k = 0; k < sectionNames.length; k++) {
                                            // check if group name equals section name then get discussion topics
                                            if (groups[j].name == sectionNames[k]) {
                                                var groupId = groups[j].id;
                                                totalAsyncs++;
                                                mmooc.api.getGroupDiscussionTopics(groupId, function(discussions) {
                                                    for (var l = 0; l < discussions.length; l++) {
                                                        for (var m = 0; m < groupDiscussionTopics.length; m++) {
                                                            // check if group discussion is exists current course
                                                            if (discussions[l].root_topic_id == groupDiscussionTopics[m].id) {
                                                                if (discussions[l].unread_count > 0) {
                                                                    var rootTopicUnreadCountsObj = {
                                                                        rootTopicId: discussions[l].root_topic_id,
                                                                        unreadCount: discussions[l].unread_count
                                                                    }
                                                                    allUnreadCounts.push(rootTopicUnreadCountsObj);
                                                                    totalUnread = totalUnread + discussions[l].unread_count;                                                                    
                                                                }
                                                            }
                                                        }
                                                    }
                                                    asyncsDone++;
                                                    if (asyncsDone == totalAsyncs) {
                                                        mmooc.discussionTopics.printUnreadCountInTab(totalUnread);
                                                        if (context == "coursepage" || context == "discussionslist") {
                                                            var unreadCountForRootTopic = 0;
                                                            var totalRootTopicUnreadCounts = [];
                                                            // add together unread counts with same root topic id
                                                            for (var n = 0; n < allUnreadCounts.length; n++) {
                                                                for (var o = 0; o < allUnreadCounts.length; o++) {
                                                                    if (allUnreadCounts[n].rootTopicId == allUnreadCounts[o].rootTopicId) {
                                                                        unreadCountForRootTopic = unreadCountForRootTopic + allUnreadCounts[o].unreadCount;
                                                                    }
                                                                }
                                                                var totalRootTopicUnreadCountsObj = {
                                                                    rootTopicId: allUnreadCounts[n].rootTopicId,
                                                                    unreadCount: unreadCountForRootTopic
                                                                }
                                                                totalRootTopicUnreadCounts.push(totalRootTopicUnreadCountsObj);
                                                                unreadCountForRootTopic = 0;
                                                            }
                                                            // only print unread count for unique topic ids
                                                            var uniqueTotalRootTopicUnreadCounts = [];
                                                            var used = [];
                                                            for (var p = 0; p < totalRootTopicUnreadCounts.length; p++) {
                                                                if (used.indexOf(totalRootTopicUnreadCounts[p].rootTopicId) == -1) {
                                                                    var totalRootTopicUnreadCountsObj = {
                                                                        rootTopicId: totalRootTopicUnreadCounts[p].rootTopicId,
                                                                        unreadCount: totalRootTopicUnreadCounts[p].unreadCount
                                                                    }                                                                    
                                                                    uniqueTotalRootTopicUnreadCounts.push(totalRootTopicUnreadCountsObj);
                                                                    used.push(totalRootTopicUnreadCounts[p].rootTopicId);
                                                                }
                                                            }// end for totalRootTopicUnreadCounts.length
                                                            if (context == "coursepage") {
                                                                for (var q = 0; q < uniqueTotalRootTopicUnreadCounts.length; q++) {
                                                                    mmooc.discussionTopics.printUnreadCountOnIcon(uniqueTotalRootTopicUnreadCounts[q].unreadCount, uniqueTotalRootTopicUnreadCounts[q].rootTopicId);
                                                                }
                                                            }
                                                            if (context == "discussionslist") {
                                                                mmooc.discussionTopics.printUnreadCountInDiscussionsList(uniqueTotalRootTopicUnreadCounts);
                                                            }// end if discussions list
                                                        }// end if coursepage or discussions list
                                                    }// end if asyncsDone 
                                                });// end group discussion topics async call
                                            }// end if group name equals section name
                                        }// end for sectionNames.length
                                    }// end for groups.length
                                });// end for groups in course async call   
                            }// end if asyncsDone
                        });// end section async call
                    }// end for enrollments.length
                });// end enrollments async call
            }// end if teacher or admin
            // if student
            else {
                mmooc.api.getUserGroups(function(groups) {
                    if (groups.length == 0 && totalUnread > 0) {
                        mmooc.discussionTopics.printUnreadCountInTab(totalUnread);
                    }
                    for (var i = 0; i < groups.length; i++) {
                        for (var j = 0; j < groupDiscussionTopics.length; j++) {
                            if (groups[i].course_id == courseId && groups[i].group_category_id == groupDiscussionTopics[j].group_category_id) {
                                groupId = groups[i].id;
                                mmooc.api.getGroupDiscussionTopics(groupId, function(discussions) {
                                    var totalRootTopicUnreadCounts = [];
                                    for (var k = 0; k < discussions.length; k++) {
                                        if (discussions[k].unread_count > 0) {
                                            if (context == "coursepage") {
                                                mmooc.discussionTopics.printUnreadCountOnIcon(discussions[k].unread_count, discussions[k].root_topic_id);
                                            }
                                            if (context == "discussionslist") {
                                                var totalRootTopicUnreadCountsObj = {
                                                    rootTopicId: discussions[k].root_topic_id,
                                                    unreadCount: discussions[k].unread_count
                                                }
                                                totalRootTopicUnreadCounts.push(totalRootTopicUnreadCountsObj);
                                            }
                                            totalUnread += discussions[k].unread_count;
                                        }
                                    }
                                    if (totalUnread > 0) {
                                        mmooc.discussionTopics.printUnreadCountInTab(totalUnread);
                                    }
                                    if (context == "discussionslist") {
                                        mmooc.discussionTopics.printUnreadCountInDiscussionsList(totalRootTopicUnreadCounts);
                                    }
                                }); // end group discussions async call
                                break;
                            }
                        } // end for groupDiscussionTopics.length   
                    } // end for groupDiscussionTopics.length
                }); // end user groups async call
            }                   
        },
        getDiscussionItems: function(modules) {
            var discussionItems = [];
            for (var i = 0; i < modules.length; i++) {
                for (var j = 0; j < modules[i].items.length; j++) {
                    if (modules[i].items[j].type == 'Discussion') {
                        discussionItems.push(modules[i].items[j]);
                    }
                }
            }
            return discussionItems;            
        },
        printUnreadCountOnIcon: function(unread, discussionId) {
            $(".discussion-unread-tag.discussion-id-" + discussionId).html("<div class='discussion-unread-value discussion-unread-item'>" + unread + "</div>");         
        },
        printUnreadCountInTab: function(totalUnread) {
            $(".mmooc-course-tab a").each(function() {
                if ($(this).text() == "Diskusjoner") {
                    $(this).parent().append("<div class='discussion-unread-value discussion-unread-tab'>" + totalUnread + "</div>")
                }
            });           
        },
        printUnreadCountInDiscussionsList: function(groupDiscussionsUnreadCount) {
            var checkExist = setInterval(function() {
                if ($("#open-discussions .ig-list .discussion").length) {
                    clearInterval(checkExist);
                    $("#open-discussions .ig-list .discussion").each(function() {
                        for (var i = 0; i < groupDiscussionsUnreadCount.length; i++) {
                            if($(this).attr("data-id") == groupDiscussionsUnreadCount[i].rootTopicId) {
                                $(this).find('.new-items').text(groupDiscussionsUnreadCount[i].unreadCount);
                                $(this).addClass("unread");
                            }
                        }
                    });
                    mmooc.discussionTopics.showUnreadCountInDiscussionList();
                }
            }, 100);          
        },
        hideUnreadCountInDiscussionList: function() {
            var checkExist = setInterval(function() {
                if ($("#open-discussions .ig-list .discussion").length) {
                    clearInterval(checkExist);
                    $("#open-discussions .ig-list .discussion").each(function() {
                        $(this).find('.new-items').hide();
                        $(this).find('.new-items').parent().prepend("<span class='loading-gif loading-unread'></span>");
                    });
                }
            }, 100);                     
        },
        showUnreadCountInDiscussionList: function() {
            $("#open-discussions .ig-list .discussion .loading-gif").remove();
            $("#open-discussions .ig-list .discussion").each(function() {
                $(this).find('.new-items').show();
            });
        }
    };
}();


this.mmooc=this.mmooc||{};


this.mmooc.enroll = function() {

    return {
        changeEnrollConfirmationButton: function() {
            var enrollForm = $("#enroll_form");
            enrollForm.find(".btn").text("Gå til mine " + mmooc.i18n.CoursePlural.toLowerCase());
            enrollForm.find(".btn").attr("href", "/courses");
            enrollForm.find(".btn-primary").hide();
        },
        changeEnrollTitle: function(s) {
            var headline = $(".ic-Login-confirmation__headline");
            headline.text(s);
        },
        getEnrollInformationElement: function() {
            //There might be several p elements, depending on which self registration screen we are on.
            //Only return the first one.
            return $("#enroll_form > p:first");
        },
        getEnrollAction: function() {
            return $("#enroll_form").attr("action");
        },
        changeEnrollInformation: function(from, to) {
            var confirmEnrollmentElement = this.getEnrollInformationElement();
            confirmEnrollmentElement.text(confirmEnrollmentElement.text().replace(from, to));
        },
        hideEnrollInformationPolicy: function() {
            var informationPolicy = $(".ic-Self-enrollment-footer__Secondary");
            informationPolicy.hide();
        },
        changeEnrollButton: function() {
            var enrollForm = $("#enroll_form");
            var confirmButton = enrollForm.find(".btn");
            confirmButton.text("Ja takk, jeg vil registrere meg!");
        },
        hideEnrollButton: function() {
            var enrollForm = $("#enroll_form");
            var confirmButton = enrollForm.find(".btn");
            confirmButton.hide();
        },
        isAlreadyEnrolled: function() {
            confirmEnrollmentElement = this.getEnrollInformationElement();
            var i = confirmEnrollmentElement.text().indexOf("Du er allerede registrert i");
            if(i == -1) {
                return false;
            }
            return true;   
        },
        selectRegisterUserCheckbox: function () {
            //The checkbox is hidden by canvas-enroll.less, but we need to check it to get the right fields to display.
            setTimeout(function () {
               var createNewUserRadioButton = $("#selfEnrollmentAuthRegCreate");
               createNewUserRadioButton.click();
            }, 1000); // set timeout in ms
        },
        updatePrivacyPolicyLinks: function () {
            html = mmooc.util.renderTemplateWithData("enrollprivacypolicy", {privacypolicylink: mmooc.settings.privacyPolicyLink});
            $("label[for='selfEnrollmentAuthRegLoginAgreeTerms']").html(html);
        },
        isSelfEnrollmentPage: function () {
            var i = this.getEnrollInformationElement().text().indexOf("Du registrerer deg i");
            if(i == -1) {
                return false;
            }
            return true;
        },
        changeEnrollPage: function() {
            this.changeEnrollTitle("Påmelding");
            if(this.isAlreadyEnrolled()) {
                this.changeEnrollConfirmationButton();
            }
            else
            {
                this.hideEnrollInformationPolicy();
                if(this.isSelfEnrollmentPage()) {
                    //When self enrolling, give the user the impression of registering on the platform, and not on the course
                    //we use to make self enrollment possible. See settings.js/selfRegisterCourseCode
                    this.getEnrollInformationElement().text("");
                    $("#enroll_form > p:nth-child(2)").text("Vennligst fyll inn informasjonen nedenfor for å registrere deg på " + mmooc.settings.platformName);
                    this.selectRegisterUserCheckbox();
                    this.updatePrivacyPolicyLinks();
                    this.changeEnrollButton();            
                }
                else
                {
                    this.hideEnrollButton();   
                    this.changeEnrollInformation("Du registrere deg på ", "Vi registrerer deg på " + mmooc.i18n.CourseDefinite.toLowerCase() + " ");
                    var enrollInformationElement = this.getEnrollInformationElement();         
                    enrollInformationElement.html(" <span class='loading-gif'></span>");
                    var enrollAction = this.getEnrollAction();
                    mmooc.api.enrollUser(enrollAction, function(data) {
                        $(".loading-gif").remove();
                        window.location.href = "/search/all_courses";
                    });
                }
            }
        },
        printAllCoursesContainer: function() {
            html = mmooc.util.renderTemplateWithData("allcoursescontainer", {courseLabel: mmooc.i18n.Course.toLowerCase()});
            document.title = "Tilgjengelige " + mmooc.i18n.CoursePlural.toLowerCase();
            document.getElementById("content").innerHTML = html;       
        },
        printAllCourses: function() {
            html = "<span class='loading-gif'></span>";
            $(".mmooc-all-courses-list").append(html);
            mmooc.api.getAllCourses(function(allCourses) {
                mmooc.api.getEnrolledCourses(function(enrolledCourses) {
                    var allCoursesWithStatus = mmooc.enroll.setCourseEnrolledStatus(allCourses, enrolledCourses);

                    var categorys = mmooc.util.getCourseCategories(allCoursesWithStatus);

/* If the amount of courses is large, the filter select box and corresponding javascript code in allcoursescontainer.hbs should be enabled

                    mmooc.enroll.populateFilter(categorys);

  	                $("#filter").change(function() {
  		                  mmooc.enroll.applyFilter();
  	                });
*/                    
                    var coursesCategorized = mmooc.util.getCoursesCategorized(allCoursesWithStatus, categorys);
                    
                    $(".loading-gif").remove();
                    
                    for (var i = 0; i < coursesCategorized.length; i++) {
                        html = mmooc.util.renderTemplateWithData("allcourseslist", {title: coursesCategorized[i].title, courses: coursesCategorized[i].courses, courseLabel: mmooc.i18n.Course.toLowerCase()});
                        $(".mmooc-all-courses-list").append(html);
                    }
                    mmooc.enroll.insertModalAndOverlay(); 
                    mmooc.enroll.setClickHandlers();      
                });
          });           
        },
        setCourseEnrolledStatus: function(allCourses, enrolledCourses) {
            var allCoursesWithStatus = [];
            for (var i = 0; i < allCourses.length; i++) {
                allCourses[i].course.enrolled = false;
                for (var j = 0; j < enrolledCourses.length; j++) {
                    if (allCourses[i].course.id == enrolledCourses[j].id) {
                        allCourses[i].course.enrolled = true;
                    }
                }
                allCoursesWithStatus.push(allCourses[i].course);
            }
            return allCoursesWithStatus;
        },
        insertModalAndOverlay: function() {
            $("body").append("<div class='mmooc-modal-overlay'></div>");
            $("body").append("<div class='mmooc-modal'></div>");
        },
        handleEnrollClick: function(e, html) {
            $(".mmooc-modal").html(html);
            $(".mmooc-modal-overlay").show();
            $(".mmooc-modal").show();
            $(".mmooc-modal .modal-back").click(function(e) {
                e.preventDefault();
                $(".mmooc-modal-overlay").hide();
                $(".mmooc-modal").hide();
            });
        },
        setClickHandlers: function() {
            $(".notenrolled").click(function(e) {
                e.preventDefault();
                var html = $(this).next().html();
                mmooc.enroll.handleEnrollClick(e, html);
            });
            $(".all-courses-show-modal").click(function(e) {
                e.preventDefault();
                var html = $(this).parent().next().html();
                mmooc.enroll.handleEnrollClick(e, html);
            });
            $(".mmooc-modal-overlay").click(function(e) {
                e.preventDefault();
                $(".mmooc-modal-overlay").hide();
                $(".mmooc-modal").hide();
            });
            $(document).on("keydown", function (e) {
                if (e.keyCode === 27) {
                  $(".mmooc-modal-overlay").hide();
                  $(".mmooc-modal").hide();
                }
            }); 
        },
        populateFilter: function(categorys) {
            var options = '<option value="Alle">Alle tilgjengelige ' + mmooc.i18n.CoursePlural.toLowerCase() + '</option>';
            for(var i = 0; i < categorys.length; i++) {
                options += '<option value="' + categorys[i] + '">' + categorys[i] + '</option>';
            }
            $('#filter').append(options);      
        },
        applyFilter: function() {
            var value = $("#filter").val();
            if (value == 'Alle') {
                $(".mmooc-all-courses-list").removeClass("filter-active");
                $(".mmooc-all-courses-list h2").each(function() {
                    $(this).show();
                    $(this).next().show();
                });                
            }
            else {
                $(".mmooc-all-courses-list").addClass("filter-active");
                $(".mmooc-all-courses-list h2").each(function() {
                    if ($(this).text() == value) {
                        $(this).show();
                        $(this).next().show();
                    }
                    else {
                        $(this).hide();
                        $(this).next().hide();                     
                    }
                });
            }
        },
        
    };
}();

this.mmooc=this.mmooc||{};


this.mmooc.footer = function() {

    return {

        addLicenseInFooter: function() {
           
           //Previous existing footer is hidden by css ('footer#footer')and is also removed in New UI after March 2016 because of a bug fix.
           var $customFooter = $('footer#mmooc-footer'); //Appended as new html contents in #wrapper
           var $publicLicense = $('#content .public-license'); //License that is displayed on the course front page
           var $parentElementOfOldFooter = $('#application.ic-app #wrapper'); 
           
           var relativeUrl = window.location.pathname;
           var hideCustomFooterLicence = false; //License should not be displayed on the '/courses' or '/' page or the login or logout page.
                      
           if ((relativeUrl == '/courses') || (relativeUrl == '/courses/') || (relativeUrl == '/') || (relativeUrl == '/login/canvas') ||  (relativeUrl.indexOf("enroll") !== -1) || (relativeUrl == '/logout')) {
               hideCustomFooterLicence = true;
           }
           
           //If there is no existing custom footer and there is public license on th page and it's not the course front page, 
           //then display the custom license in a custom footer element. The html for the license is in src/templates/modules/footer-license.hbs
           if ($customFooter.length == 0 && $publicLicense.length == 0 && !hideCustomFooterLicence) {
                var html = mmooc.util.renderTemplateWithData("footer-license", {});
                $parentElementOfOldFooter.append(html);
           }
           
        }
    };
}();

mmooc = mmooc || {};

mmooc.greeting = function () {

    function redesignPage() {
        $('#wrapper').addClass('diploma-page');
    }

    function fixLinkToModules($content) {
        if ($content.find(".alert li > a").size() <= 0) {
            return;
        }

        redesignPage();
        mmooc.api.getModulesForCurrentCourse(function (modules) {
            var firstItemPerModule = {};
            for (var i in modules) {
                firstItemPerModule[modules[i].id] = modules[i].items[0];
            }

            $('.alert li > a').each(function () {
                var oldPath = $(this).attr('href');
                var moduleNumber = /courses\/\d+\/modules\/(\d+)/.exec(oldPath);
                if (moduleNumber.length > 0) {
                    $(this).attr('href', firstItemPerModule[moduleNumber[1]].html_url);
                }
            });

        });
    }

    return {
        enableGreetingButtonIfNecessary: function () {
            var $content = $("#content");
            var $diplomaButton = $content.find(".sikt-diploma-button");
            var $formIdDiv = $content.find(".sikt-diploma-formId");
            var $nameEntryIdDiv = $content.find(".sikt-diploma-nameEntryId");
            var $emailEntryIdDiv = $content.find(".sikt-diploma-emailEntryId");

            if ($diplomaButton.length && $formIdDiv.length && $nameEntryIdDiv.length && $emailEntryIdDiv.length) {
                $diplomaButton.button().click(function () {
                    if ($diplomaButton.hasClass('btn-done')) {
                        return;
                    }

                    $('#info').html(mmooc.util.renderTemplateWithData("waitIcon", {}));

                    var formId = $formIdDiv.text();
                    var nameEntryId = $nameEntryIdDiv.text();
                    var emailEntryId = $emailEntryIdDiv.text();
                    var str1 = "https://docs.google.com/forms/d/";
                    var str2 = "/formResponse";
                    var googleurl = str1.concat(formId, str2);

                    str1 = "entry.";
                    var nameEntry = str1.concat(nameEntryId);
                    var emailEntry = str1.concat(emailEntryId);

                    mmooc.api.getUserProfile(function (profile) {
                        var values = {};
                        values[nameEntry] = profile.name;
                        values[emailEntry] = profile.primary_email;

                        $.ajax({
                            url: googleurl,
                            data: values,
                            type: "POST",
                            dataType: "xml",
                            complete: function (jqXHR) {
                                switch (jqXHR.status) {
                                    case 0:
                                        str1 = "Diplom ble sendt til denne eposten:";
                                        var s = str1.concat(profile.primary_email);
                                        $('#info').html(s);
                                        $diplomaButton.addClass('btn-done');
                                        break;
                                    default:
                                        $('#info').addClass('error');
                                        $('#info').html("En feil oppstod. Ta kontakt med kursansvarlig for &aring; f&aring; hjelp.");
                                }
                            }
                        }); //End Google callback
                    }); //End Canvas user profile callback
                }); //End diploma button clicked
                redesignPage();
            } //End if valid diploma fields

            fixLinkToModules($content);
        }
    }
}();

this.mmooc=this.mmooc||{};


this.mmooc.groups = function() {
    function interceptLinkToGroupPageForHref(href, event) {
        if (/\/groups\/\d+$/.test(href)) {
            event.preventDefault();
            location.href = href + '/discussion_topics';
        }
    }

    return {
        interceptLinksToGroupPage: function() {
            $("#content").on('click', '.student-group-title a', function(event) {
                var href= $(this).attr("href");
                interceptLinkToGroupPageForHref(href, event);
            });

            $("#right-side").on('click', '.group_list a', function(event) {
                var href= $(this).attr("href");
                interceptLinkToGroupPageForHref(href, event);
            });

            //20180906ETH Vi ønsker diskusjonsvisning som default for lærere også.
            $("#content-wrapper").on('click', '.visit-group', function(event) {
                var href= $(this).attr("href");
                interceptLinkToGroupPageForHref(href, event);
            });            
        },
        interceptLinksToTeacherGroupPage: function() {
            //20180906ETH Vi ønsker diskusjonsvisning som default for lærere også.
            $("#left-side").on('click', '.ui-menu-item a', function(event) {
                var href= $(this).attr("href");
                interceptLinkToGroupPageForHref(href, event);
            });            
        },
        showGroupHeader: function(groupId, courseId) {
            mmooc.api.getGroupMembers(groupId, function(members) {
                var headerHTML = mmooc.util.renderTemplateWithData("groupheader", {groupId: groupId, courseId: courseId, members: members});
                document.getElementById('content-wrapper').insertAdjacentHTML('afterbegin', headerHTML);
                $("body").addClass("group-header");
            });
        },

        changeGroupListURLs: function(href) {
          if (/\/groups(\/)?$/.test(href) || /(\/groups(\??([A-Za-z0-9\=\&]{0,})))$/.test(href)) {
            var list = $('.context_list li a');
            list.each(function(i) {
              this.setAttribute('href', this.getAttribute('href') + '/discussion_topics');
            });
            return true;
          }

          return false;
        },

        moveSequenceLinks: function() {
          var sequenceContainer = $("#module_sequence_footer");
          var discussionContainer = $("#discussion_container");
          sequenceContainer.addClass('module-sequence-top');
          sequenceContainer.insertBefore(discussionContainer);
        }
    };
}();

this.mmooc=this.mmooc||{};


this.mmooc.menu = function() {

    function _renderCourseMenu(course, selectedMenuItem, title, hideTabs) {
        
        function _insertCourseMenuHtml(course, selectedMenuItem, title, menuItems) {
            var subtitle = course.name;
            if (title == null) {
                title = course.name;
                subtitle = "";
            }
            var html = mmooc.util.renderTemplateWithData("coursemenu", {course: course, menuItems: menuItems, selectedMenuItem: selectedMenuItem, title: title, subtitle: subtitle });
            document.getElementById('header').insertAdjacentHTML('afterend', html);
        }
        
        var menuItems = [];

        var courseId = course.id;
        if (!hideTabs) { 
            menuItems[menuItems.length] = {"title": mmooc.i18n.Course + "forside", url: "/courses/" + courseId};
            menuItems[menuItems.length] = {"title": "Kunngjøringer", url: "/courses/" + courseId + "/announcements"};
            menuItems[menuItems.length] = {"title": "Grupper", url: "/courses/" + courseId + "/groups"};
            menuItems[menuItems.length] = {"title": "Diskusjoner", url: "/courses/" + courseId + "/discussion_topics"};
            
            //SelectedMenuItem contains the path if we are called by the external path route.
            var tools = mmooc.util.getToolsInLeftMenu(selectedMenuItem);            
            
            menuItems[menuItems.length] = {"title": tools.activeToolName, toolList: tools.toolList, url: tools.activeToolPath};
            
            if (mmooc.util.isTeacherOrAdmin()) {
                menuItems[menuItems.length] = {"title": "Faglærer", url: "/courses/" + courseId + "/?mmpf"};
            }
            
            var badgeSafe = mmooc.menu.extractBadgesLinkFromPage();
            if (badgeSafe.url) { //If the url of Badges is found then display this as an additional tab
                menuItems[menuItems.length] = badgeSafe;
                _insertCourseMenuHtml(course, selectedMenuItem, title, menuItems);
            } else if (mmooc.settings.useCanvaBadge) {
                mmooc.menu.setCanvaBadgesLink(course, function(canvaBadgeObject) { //Second parameter is a callback function
                    if (canvaBadgeObject.url) {
                        menuItems[menuItems.length] = canvaBadgeObject; //check if canva badges is used for the current domain and if it is and the user has any badges then display this additional tab 
                    }
                    _insertCourseMenuHtml(course, selectedMenuItem, title, menuItems);
                });
            }
            else
            {
                _insertCourseMenuHtml(course, selectedMenuItem, title, menuItems);
            }
            $("#mmooc-menu-item-verktoy").click(function(event) {
                handleMenuClick("#mmooc-menu-item-verktoy", "#mmooc-verktoy-list");
            });
            
        }
    }


    function createStyleSheet () {
        var style = document.createElement("style");

        // WebKit hack :(
        style.appendChild(document.createTextNode(""));

        document.head.appendChild(style);

        return style.sheet;
    }
    
    function insertCustomMenuElementInTopMenu(linkText, link) {
        var menu = document.getElementById('menu');
        if (menu) {
            menu.insertAdjacentHTML('afterbegin', '<li class="menu-item custom-item ic-app-header__menu-list-item"><a href="' + link + '" class="menu-item-no-drop ic-app-header__menu-list-link"><div class="menu-item__text">' + linkText + '</div></a></li>');
        }
    }
    
    function openHelpDialog(event) {
        event.preventDefault();
        $("#global_nav_help_link").click(); //Do the same as when you are clicking on the original help button (which display the help dialog)
    }
    
    function hideHelpMenuElementIfNotActivated() {
        $canvasHelpButton = $("#global_nav_help_link")
        if ($canvasHelpButton.length == 0) {
            $("li.helpMenu").hide();
        }
    }
    function handleMenuClick(menuSelectId, menuId)
    {
        if ($(menuId).css("display") != "none") {
            $(menuId).slideUp(400);
            $(menuSelectId).off("mouseleave");
        } else {
            $(menuId).slideDown(400);
            $(menuSelectId).mouseleave(function() {
                $(menuId).slideUp(400);
            });
        }
    }
     
    var stylesheet = createStyleSheet();

    return {
        listModuleItems: function() {
        
            mmooc.api.getCurrentModule(function(module) {
                var courseId = mmooc.api.getCurrentCourseId();
                var html = mmooc.util.renderTemplateWithData("moduleitems", {backToCoursePage: mmooc.i18n.BackToCoursePage, module: module, courseId: courseId});
                if (document.getElementById("left-side")) {
                    document.getElementById('left-side').insertAdjacentHTML('afterbegin', html);
                }
                $(".mmooc-reveal-trigger").click(function(event) {
					var $trigger = $(this);
					var body = $trigger.attr("href");
                    var i = $trigger.find("i");

                    //Hvis elementet vises så lukker vi det
					if ($(body).css("display") != "none") {
						$(body).slideUp(400);
						//Hvis det inneholder det aktive elementet så må vi vise det.
						if($trigger.attr("id") == "mmooc-module-item-active-header")
						{
						    $trigger.attr("class", "active mmooc-reveal-trigger");
						}
                        i.attr("class", "icon-mini-arrow-right");
						
					} else {
						$(body).slideDown(400);
						if($trigger.attr("id") == "mmooc-module-item-active-header")
						{
						    $trigger.attr("class", "mmooc-reveal-trigger");
						}
                        i.attr("class", "icon-mini-arrow-down");
					}
					return(false);
				});                
            });
        },
        showLeftMenu: function() {
            stylesheet.insertRule("body.with-left-side #main { margin-left: 305px !important }", stylesheet.cssRules.length);
            stylesheet.insertRule(".with-left-side #left-side { display: block !important }", stylesheet.cssRules.length);
            $("body").addClass("useFullWidth"); //Used to solve problems in making the design 100% width in the new UI. This is the simplest way to implement this.
        },

        renderLeftHeaderMenu: function() {
            
            // The entire menu is rebuilt because of unwanted popup in the new ui menu
            insertCustomMenuElementInTopMenu("Kalender", "/calendar");
            if(mmooc.settings.removeGlobalGradesLink == false) {
                insertCustomMenuElementInTopMenu("Karakterer", "/grades");
            }
            if(mmooc.settings.removeGroupsLink == false) {
                insertCustomMenuElementInTopMenu("Grupper", "/groups");
            }
            insertCustomMenuElementInTopMenu(mmooc.i18n.CoursePlural, "/courses"); 
            
            if (mmooc.util.isTeacherOrAdmin()) {
                this.showLeftMenu();

                $("#section-tabs-header").show();
                
                //Canvas changed the aria-label as shown in the two lines below. Keep both lines for backward compatibility.
                $("nav[aria-label='context']").show();
                $("nav[aria-label='Emner-navigasjonsmeny']").show();
                
                //20180821ETH Venstremenyen heter noe annet for grupper.
                //20180906ETH Men vi ønsker ikke vise den.
//                $("nav[aria-label='Navigasjonsmeny for grupper ']").show();
                
                $("#edit_discussions_settings").show();
                $("#availability_options").show();
                $("#group_category_options").show();
                $("#editor_tabs").show();

                // Done via CSS since content is loaded using AJAX
                stylesheet.insertRule("body.pages .header-bar-outer-container { display: block }", stylesheet.cssRules.length);
                stylesheet.insertRule("#discussion-managebar { display: block }", stylesheet.cssRules.length);
            }

            var roles = mmooc.api.getRoles();
            if (roles != null && roles.indexOf('admin') != -1) {
                // Admin needs original canvas Course dropdown to access site admin settings
                //$("#courses_menu_item").show(); //Applies only for Old UI. This is the course menu item with a sub menu.
                insertCustomMenuElementInTopMenu("Admin", "/accounts");
                // Admin needs more profile settings
                $(".add_access_token_link").show();
                $("body.profile_settings").find("#content > table, #content > h2, #content > p").show();
            }
        },

        hideRightMenu: function() {
            $("#right-side").hide();
            $("body").removeClass('with-right-side');
        },

		hideSectionTabsHeader: function () {
			$("#section-tabs-header-subtitle").hide();
		},
		
        showUserMenu: function() {
            var menu = document.getElementById('menu');
            if (menu !=  null) {
                var html = mmooc.util.renderTemplateWithData("usermenu", {user: mmooc.api.getUser()});
                menu.insertAdjacentHTML('afterend', html);

                $("#mmooc-menu-item-varsler").click(function(event) {
                    handleMenuClick("#mmooc-menu-item-varsler", "#mmooc-activity-stream");
                });
                $("#mmooc-menu-item-profile-settings").click(function(event) {
                    handleMenuClick("#mmooc-menu-item-profile-settings", "#mmooc-profile-settings");
                });
                mmooc.api.getUnreadMessageSize(function(conversations) {
                    var msgBadge = $("#mmooc-unread-messages-count");
                    if(conversations.unread_count != "0")
                    {
                      msgBadge.html(conversations.unread_count);
                      msgBadge.show();
                    }
                    else
                    {
                      msgBadge.hide();
                    }
                });
                this.updateNotificationsForUser();
                
                //20180921ETH Vi bruker ikke hjelpemenyen lenger.
//                $(document).on("click", ".helpMenu", openHelpDialog);
//                hideHelpMenuElementIfNotActivated();
            }
        },

        updateNotificationsForUser: function() {
            mmooc.api.getActivityStreamForUser(function(activities) {
                var unreadNotifications = 0;
                for (var i = 0; i < activities.length; i++) {
                    if (mmooc.menu.checkReadStateFor(activities[i])) {
                        unreadNotifications++;
                    }
                    activities[i].created_at = mmooc.util.formattedDate(activities[i].created_at);
                }

                var badge = $("#mmooc-notification-count");
                if (unreadNotifications == 0) {
                    badge.hide();
                } else {
                    badge.html(unreadNotifications);
                    badge.show();
                }

                document.getElementById('mmooc-activity-stream').innerHTML = mmooc.util.renderTemplateWithData("activitystream", {activities: activities});

                var notifications = $("#mmooc-notifications").find("li");
                var showAllItems = $("#mmooc-notifications-showall");
                if (notifications.size() > 10) {
                    notifications.slice(10).addClass("hidden");

                    showAllItems.click(function() {
                        notifications.removeClass("hidden");
                        showAllItems.hide();
                    });
                } else {
                    showAllItems.hide();
                }

            });
        },

        showCourseMenu: function(courseId, selectedMenuItem, title, hideTabs) {
            hideTabs = hideTabs || false; //Do not hide tabs if the parameter
            $("body").addClass("with-course-menu");
            mmooc.api.getCourse(courseId, function(course) {
                _renderCourseMenu(course, selectedMenuItem, title, hideTabs);
            });
        },

        showBackButton: function(url, title) {
            var buttonHTML = mmooc.util.renderTemplateWithData("backbutton", {url: url, title: title});
            document.getElementById('content-wrapper').insertAdjacentHTML('afterbegin', buttonHTML);
        },

        showGroupHeader: function() {
            var groupId = mmooc.api.getCurrentGroupId();
            var groupHeaderHTML = mmooc.util.renderTemplateWithData("backbutton", {groupId: groupId});
            document.getElementById('content-wrapper').insertAdjacentHTML('afterbegin', groupHeaderHTML);
        },

        showDiscussionGroupMenu: function() {

            function strLeft(sourceStr, keyStr){
                return (sourceStr.indexOf(keyStr) == -1 | keyStr=='') ? '' : sourceStr.split(keyStr)[0];
            }

            function _addGetHelpFromteacherButton(group) {
                
                //Match gruppenavn mot seksjon i seksjonsliste.
                function _getSectionRecipientFromGroupName(sectionRecipients, groupName)
                {
                    for(var i = 0; i < sectionRecipients.length; i++) {
                        var r = sectionRecipients[i];
                        if(r.name == groupName)
                        {
                            return r.id;
                        }
                    }
                    return null;
                }

                function _tilkallVeilederFeilet()
                {
                    $("#mmooc-get-teachers-help").addClass("btn-failure");
                    $("#mmooc-get-teachers-help").html("Tilkall veileder feilet");
                }

                function _sendMessageToSectionTeachers() {
                    var courseId = mmooc.api.getCurrentCourseId();
                    mmooc.api.getUserGroupsForCourse(courseId, function(groups) {
                        if((groups.length == 0) || (groups.length > 1) ) {
                            _tilkallVeilederFeilet();
                            alert("Det er noe galt med gruppeoppsettet ditt.\nDu er medlem i " + groups.length + " grupper.");
                        }
                        else
                        {
                            var group = groups[0]; 
                            var groupName = group.name;
                            var groupCourseId = group.course_id;
                            mmooc.api.getSectionRecipients(groupCourseId, (function(courseId) {
                                return function(recipients) {
                                    var sectionRecipient = _getSectionRecipientFromGroupName(recipients, groupName);
                                    if(sectionRecipient == null)
                                    {
                                        _tilkallVeilederFeilet();
                                        alert("Det er noe galt med gruppeoppsettet ditt.\nFant ikke seksjonen til " + groupName);
                                    }
                                    else
                                    {
                                        var sectionRecipientTeachers = sectionRecipient + "_teachers";
                                        var subject = groupName + " " + mmooc.i18n.GroupGetInTouchSubject;
                                        var discussionUrl = window.location.href;
                                        var discussionAndGroupTitle = $(".discussion-title").text();
                                        var discussionTitle = strLeft(discussionAndGroupTitle, " - ");
                                        var newLine = "\n";

                                        var body = mmooc.i18n.WeHaveAQuestionToTeacherInTheDiscussion 
                                            + ' "' + discussionTitle + '":' + newLine + discussionUrl;

                                        $("#mmooc-get-teachers-help").html("Sender melding...");

                                        mmooc.api.postMessageToConversation(courseId, sectionRecipientTeachers, subject, body, function(result) {
                                            console.log(result);
                                            $("#mmooc-get-teachers-help").addClass("btn-done");
                                            $("#mmooc-get-teachers-help").html("Veileder tilkalt");
                                        }, function(error) {
                                            _tilkallVeilederFeilet();
                                            alert("Tilkall veileder feilet. Gruppen har ingen veileder.");
                                            console.log(error);
                                        });
                                    }
                                }
                            }(groupCourseId)));
                        }
                    });
                }

                function _addClickEventOnGetHelpFromTeacherButton() {
                    $("#mmooc-get-teachers-help").click(function() {
                        $("#mmooc-get-teachers-help").off("click");
                        $("#mmooc-get-teachers-help").html("Finner veileder...");
                        _sendMessageToSectionTeachers();
                    });
                }
                
                // Get help from teacher by clicking a button
                var getHelpButtonFromteacherButtonHTML = mmooc.util.renderTemplateWithData("groupdiscussionGetHelpFromTeacher", {hoverOverText: mmooc.i18n.CallForInstructorHoverOverText});
                //document.getElementById('content').insertAdjacentHTML('afterbegin', getHelpButtonFromteacherButtonHTML);
                $("#discussion-managebar > div > div > div.pull-right").append(getHelpButtonFromteacherButtonHTML);
                _addClickEventOnGetHelpFromTeacherButton();
            }

            var groupId = mmooc.api.getCurrentGroupId();
            if (groupId != null) {
                mmooc.api.getGroup(groupId, function(group) {
                    // For discussion pages we only want the title to be "<discussion>" instead of "Discussion: <discussion>"
                    var title = mmooc.util.getPageTitleAfterColon();
                    mmooc.menu.showCourseMenu(group.course_id, "Grupper", title, true); //Group menu in tabs including title - Use optional fourth parameter for hiding tabs
                    _addGetHelpFromteacherButton(group);
                });
            }
        },

        checkReadStateFor: function (activity) {
            return activity.read_state === false;
        },

        extractBadgesLinkFromPage: function () {
            var href = $('li.section:contains("BadgeSafe")').find('a').attr('href');
            return {"title": mmooc.i18n.Badgesafe, url: href};
        },
        setCanvaBadgesLink: function (course, callback) {
            var user_id = mmooc.api.getUser().id;
            
            //This should be refactored to be in an api resource file
            var domain = location.host;
            var urlToCanvaBadgesApi = mmooc.settings.CanvaBadgeProtocolAndHost + "/api/v1/badges/public/" + user_id + "/" + encodeURIComponent(domain) + ".json";
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: urlToCanvaBadgesApi,
                timeout: 5000,
                success: function(data) {
                    if ($.isFunction(callback)) {
                        callback({
                            "title": mmooc.i18n.Badgesafe,
                            url: "/courses/" + course.id + "?allcanvabadges"
                        });
                    }
                    
                    // if(data.objects && data.objects.length > 0) {
                    
                    // }
                },
                error: function(err) {
                    if ($.isFunction(callback)) {
                        callback({
                            "title": mmooc.i18n.Badgesafe, 
                            url: undefined
                        });
                    }
                }
            });
        },

        injectGroupsPage: function() {
          $('#courses_menu_item').after('<li class="menu-item"><a href="/groups" class="menu-item-no-drop">Grupper</a></li>');
        },

        alterHomeLink: function() {
          $('#header-logo').attr('href', '/courses');
          $('a.ic-app-header__logomark').attr('href', '/courses'); //New UI
        },

        alterCourseLink: function() {
        //   if ($('#menu > li:first-child a').hasClass('menu-item-no-drop')) {
        //     $('#menu > li:first-child a').attr('href', '/courses');
        //   }
        }
    };
}();

this.mmooc=this.mmooc||{};


this.mmooc.pages = function() {
    function updateButtonText(container, input, label) {
        if (input.is(":checked")) {
            label.html('Marker som ulest');
            container.addClass("is-done");
        } else {
            label.html('Marker som lest');
            container.removeClass("is-done");
        }
    }
    function getHeaderBarJson()
    {
        var headerBarPosition = "after";

        //Content page
        var headerBar = $("#wiki_page_show > div.header-bar-outer-container > div > div.header-bar.flex-container > div.header-bar-right.header-right-flex");

        //Quiz
        if ( !headerBar.length )
        {
            headerBar = $("#quiz_show > div.header-bar > div");
        }
        //Assignment
        if ( !headerBar.length )
        {
            headerBar = $("#assignment_show > div.assignment-title > div.assignment-buttons");
        }
        //Discussion
        if ( !headerBar.length )
        {
            headerBar = $("#discussion-managebar > div > div > div.pull-right");
        }
        //File
        if ( !headerBar.length )
        {
            headerBar = $("#content");
            headerBarPosition = "before";
        }
        var headerBarJson = { "headerBar":headerBar, "position":headerBarPosition }

        return headerBarJson;
    }

    function addButton(buttonHtml)
    {
        var headerBarJson = getHeaderBarJson();
        if ( headerBarJson.headerBar.length )
        {
            if(headerBarJson.position == "after")
            {
                headerBarJson.headerBar.append(buttonHtml);
            }
            else
            {
                headerBarJson.headerBar.before(buttonHtml);
            }
        }
        else
        {
            setTimeout(function(){
                addButton(buttonHtml);
            }, 500);
        }
    }

    return {
        modifyMarkAsDoneButton: function() {
            $("body").bind("wiki-page-rendered", function() {
                var container = $("#mark-as-done-container");
                container.appendTo("#content .usercontent");

                var input = container.find("input");
                var label = container.find("label");
                input.change(function() {
                    updateButtonText(container, input, label);
                });

                updateButtonText(container, input, label);


                container.show();
            });
        },
        addGotoModuleButton: function() {
            var moduleItemId = mmooc.api.getCurrentModuleItemId();
            var courseId = mmooc.api.getCurrentCourseId();
            var targetHref = "/courses/" + courseId + "/modules#context_module_item_" + moduleItemId;
            var buttonHtml = "<a class='btn' href='" + targetHref + "'>Gå til modul</a>";
            addButton(buttonHtml);
        },
        addStudentViewButton: function() {
            var courseId = mmooc.api.getCurrentCourseId();
            var buttonHtml = '<a class="btn student_view_button" ';
            buttonHtml += 'rel="nofollow" data-method="post" href="/courses/' + ENV.COURSE_ID + '/student_view">';
            buttonHtml += '<i class="icon-student-view"></i>Studentvisning</a>';
            addButton(buttonHtml);
        },


        updateSidebarWhenMarkedAsDone: function() {
          $("body").on("click", "#mark-as-done-checkbox", function() {
            var icon = $("ul.mmooc-module-items .active span:last-child");

            if (icon.hasClass("done")) {
              icon.removeClass("done");
            } else {
              icon.addClass("done");
            }
            
            //Check if header title should/not be marked as done as well.
            var activeHeader = $("#mmooc-module-item-active-header");
            var activeListId = activeHeader.attr("href");
            var activeList = $(activeListId);
            var noOfItemsInActiveList = activeList.find("li").length;
            var noOfItemsDoneInActiveList = activeList.find("li").find(".done").length;
            var headerIcon = activeHeader.find("span:last-child");
            if(noOfItemsDoneInActiveList < noOfItemsInActiveList)
            {
                headerIcon.removeClass("done");
            } else {
                headerIcon.addClass("done");
            }
          })
        },
        
        updateSidebarWhenContributedToDiscussion: function() {
            $("#discussion_container").on("click", ".btn-primary", function() {
                var icon = $("ul.mmooc-module-items .active span:last-child");

                if (!icon.hasClass("done")) {
                  icon.addClass("done");
                } 
            })
        },
        
        replaceCreateAccountLink: function() {
          mmooc.api.getSelfRegisterCourse(function(selfRegisterCourse) {
              var createAccountTitle = "";
              var createAccountSubtitle = "";
              if(selfRegisterCourse[0])
              {
                  var url = "/enroll/" + selfRegisterCourse[0].course.self_enrollment_code;
                  $("#register_link").attr("href", url);
                  createAccountTitle = mmooc.i18n.CreateAccountTitle;
                  createAccountSubtitle = mmooc.i18n.CreateAccountSubtitle;
              }
              $("#register_link div.ic-Login__banner-title").html(createAccountTitle);
              $("#register_link div.ic-Login__banner-subtitle").html(createAccountSubtitle);
          });
        },

        duplicateMarkedAsDoneButton: function() {
            var checkExist = setInterval(function() {
                if($('.module-sequence-footer-content').length) {
                  clearInterval(checkExist);
                  $("#mark-as-done-checkbox").clone().prependTo(".module-sequence-footer-content");
                  $(document).on("click","#mark-as-done-checkbox", function() {
                    var self = $(this);
                    setTimeout(function(){ 
                        if(self.parent().attr("class") == "module-sequence-footer-content") {
                        $(".header-bar-right #mark-as-done-checkbox").remove();
                        self.clone().prependTo(".header-bar-right");
                    }
                    else {
                        $(".module-sequence-footer-content #mark-as-done-checkbox").remove();
                        self.clone().prependTo(".module-sequence-footer-content");
                    }
                    }, 800);
                  });
                }
            }, 100);
        },
        
        showObserverInformationPane : function()
        {
			var paneHTML = mmooc.util.renderTemplateWithData("observer", {});
			document.getElementById('wrapper').insertAdjacentHTML('afterend', paneHTML);
		},
        // changeTranslations : function() {
        //     $("a.submit_assignment_link").text('Lever besvarelse');
        // },

        showBackLinkIfNecessary: function() {
            if ($('#left-side').is(':hidden')) {
                var linkBack = mmooc.util.renderTemplateWithData("navigateToPreviousPage", {linkText: mmooc.i18n.LinkBack});
                $(linkBack).prependTo($('#content'));
            }
        },

        redesignAssignmentPage: function() {

            function _isAssignmentWithPeerReview() {
                var returnValue = false;
                var peerReviewer = mmooc.i18n.PeerReviewer;
                if ($("#right-side .details .content > h4:contains('" + peerReviewer.toLowerCase() + "')").length) {
                    returnValue = true;
                }
                return returnValue;
            }

            function _getPeerReviewArray() {

                // 20062018 Erlend: Canvas har endret designet og jeg måtte endre litt denne testen.
                function _getWorkFlowState(peerReviewLinkClass) {
                    var _workflow_state = ""; // workflow_state either 'assigned' or 'completed'
                    if (peerReviewLinkClass == "icon-warning") {
                        _workflow_state = 'assigned';
                    } else if (peerReviewLinkClass == "icon-check") {
                        _workflow_state = 'completed';
                    }
                    return _workflow_state; 
                }

                // 20062018 Erlend: Canvas har endret designet og jeg måtte endre litt på selector.
                //                  Årsaken til at vi må hente ut informasjon om peer review på denne måten 
                //                  er at studenter ikke får denne informasjonen via api'et.
                var $peerReviewLinks = $("#right-side .details .content > h4 + ul.unstyled_list a");
                var _peerReview = []; //Peer review api is unfortunately not displaying the info we want (only info about the persons beeing peer reviewers for my submission), so we have to do this by using jquery
                var workflow_state;
                var peerReviewLinkClass;

                $peerReviewLinks.each(function(i){
                    peerReviewLinkClass = $(this).find("i").attr('class');
                    workflow_state = _getWorkFlowState(peerReviewLinkClass);
                    _peerReview[_peerReview.length] = {"workflow_state" : workflow_state, "assessor" : { "display_name" : $(this).text(), "mmooc_url": $(this).attr('href')}};
                });

                console.log('Custom peerReview array:');
                console.log(_peerReview);

                return _peerReview;
            }

            function _appendPeerReviewHtmlOnRightSide(submission, peerReview) {
                var peerReviewHtml = mmooc.util.renderTemplateWithData("assignmentPageWithPeerReviewRightSide", { submission : submission, peerReview:peerReview });
                // $("body.assignments #application.ic-app #right-side .details" ).append(peerReviewHtml);
                $(peerReviewHtml).insertBefore("body.assignments #application.ic-app #right-side .details");
            }

            function _appendPeerReviewWarningInContentsColumn(submission, peerReview) {
                var $peerReviewLinksWarnings = $("#right-side .details .content > h4 + ul.unstyled_list a.warning");
                if ($peerReviewLinksWarnings.length) { //If any warnings display peer review warning in the contents column after the assignment meta data
                    var peerReviewWarningHtml = mmooc.util.renderTemplateWithData("assignmentPageWithPeerReviewWarning", { submission : submission, peerReview:peerReview });
                    $("body.assignments #application.ic-app ul.student-assignment-overview" ).after(peerReviewWarningHtml);
                }
            }

            function _displayRightColumnContents() {
                $("#right-side .details").show();
            }

            var courseId = mmooc.api.getCurrentCourseId();
            var assignmentId = mmooc.api.getCurrentTypeAndContentId().contentId;
            var user_id = mmooc.api.getUser().id;

            if (_isAssignmentWithPeerReview()) {
                // console.log('user_id:' + user_id);
                mmooc.api.getSingleSubmissionForUser(courseId, assignmentId, user_id, function(submission) {
                    console.log('submission');
                    console.log(submission);
                    var peerReview = _getPeerReviewArray();
                    _appendPeerReviewHtmlOnRightSide(submission, peerReview);
                    _appendPeerReviewWarningInContentsColumn(submission, peerReview);
                });
            } else {
                _displayRightColumnContents();
                $("#submission_comment.submission_comment_textarea").show();
            }
        },

        redesignPeerReviewAndOwnSubmissionDetailsPage: function() {

            function _isCodeRunningInIframe() {
                var returnValue = true;
                if (ENV.SUBMISSION && ENV.SUBMISSION.user_id) {
                    returnValue = false;
                }
                return returnValue;
            }

            function _getSubmissionTitle() {
                var returnValue;
                var current_user_id = mmooc.api.getUser().id;
                if (isPeerReview) {
                    returnValue = mmooc.i18n.PeerReview;
                } else {
                    returnValue = mmooc.i18n.DetailsAboutYourDelivery;
                    if (current_user_id != submission_user_id) { //Submission opened by admin or teacher. We don't make any changes in the existing design when this is the case.
                        returnValue = mmooc.i18n.DetailsAboutDelivery;
                    }
                }
                return returnValue;
            }

            function _isTeacherViewingStudentsSubmission() {
                var returnValue = false;
                var current_user_id = mmooc.api.getUser().id;
                if (!isPeerReview && current_user_id != submission_user_id) { //Submission opened by admin or teacher. We don't make any changes in the existing design when this is the case.
                    returnValue = true;
                }
                return returnValue;
            }

            function _isPeerReviewFinished() {
                var returnValue = false;
                if ($('.assessment_request_incomplete_message').css('display') == 'none') {
                    returnValue = true;
                }
                return returnValue;
            }

            function _isRubric() {
                var returnValue = false;
                if ($('.assess_submission_link').length) {
                    returnValue = true;
                }
                return returnValue;
            }

            function _addClickEventOnOpenAssessmentButton() {
                $(document).on("click", ".open-assessment-dialog-button", function(event) {
                    event.preventDefault();
                    $('#rubric_holder').show();
                    // $('.assess_submission_link.rubric').click(); //click on the previous hidden button.
                });
            }

            function _updateDomAfterSaveRubricButtonClick(event) {
                console.log('_updateDomAfterSaveRubricButtonClick is running');
                function _appendCompletedPeerReviewHtml(assignment, submission, peerReview) {
                    var submissionTitle = _getSubmissionTitle();
                    var isTeacherViewingStudentsSubmission = _isTeacherViewingStudentsSubmission();
                    var isPeerReviewFinished = true;
                    var submissionObject = {
                            assignment : assignment,
                            submission : submission,
                            peerReview : peerReview,
                            submissionTitle : submissionTitle,
                            isPeerReview : isPeerReview,
                            isPeerReviewFinished : isPeerReviewFinished,
                            isTeacherViewingStudentsSubmission : isTeacherViewingStudentsSubmission
                        };

                    var submissionHtml = mmooc.util.renderTemplateWithData("assignmentSubmission", submissionObject);

                    $(".mmooc-assignment-submission, .mmooc-assignment-submission-answers").remove(); //Remove old Html that was created before
                    $("body.assignments #application.ic-app #content .submission_details" ).after(submissionHtml);
                }
                
                //Functionality for this is as follows:
                // We want the peer review to display that it is finished without a refresh of the page.
                // Unfortunately we don't have any info about the peer review from the API because as a user you don't have access to that data it seems.
                // In order to solve this we check that the user has submitted data by checking the DOM. Then the SubmissionObject used in the template (assignmentSubmission) is changed so the peer review looks completed (which it also is).  

                mmooc.api.getSingleAssignment(courseId, assignmentId, function(assignment) {
                    mmooc.api.getSingleSubmissionForUser(courseId, assignmentId, submission_user_id, function(submission) {
                        var submission_id = submission.id;

                        mmooc.api.getPeerReviewsForSubmissionId(courseId, assignmentId, submission_id, function(peerReview) {
                            _logDataToConsole(assignment, submission, peerReview);
                            _appendCompletedPeerReviewHtml(assignment, submission, peerReview);
                        });
                    });
                });
            }

            function _isPeerReview() {
                var returnValue = false;
                var peerReviewText = mmooc.i18n.PeerReviewer;
                var originalSubmissionHeader = "body.assignments #application.ic-app #content .submission_details h2.submission_header";
                if ($(originalSubmissionHeader + ":contains('" + peerReviewText + "')").length) {
                    returnValue = true;
                }
                return returnValue;
            }

            function _isOwnSubmission() {
                var returnValue = false;
                var deliveryText = mmooc.i18n.Delivery;
                var originalSubmissionHeader = "body.assignments #application.ic-app #content .submission_details h2.submission_header";
                if ($(originalSubmissionHeader + ":contains('" + deliveryText + "')").length) {
                    returnValue = true;
                }
                return returnValue;
            }

            function _logDataToConsole(assignment, submission, peerReview) {
                console.log('submission_user_id:' + submission_user_id);
                console.log('Assignment:');
                console.log(assignment);
                console.log('Submission:');
                console.log(submission);
                console.log('peerReview for submission id');
                console.log(peerReview);
            }

            function _appendSubmissionHtml(assignment, submission, peerReview) {
                var submissionTitle = _getSubmissionTitle();
                var isTeacherViewingStudentsSubmission = _isTeacherViewingStudentsSubmission();
                var isPeerReviewFinished = _isPeerReviewFinished();
                var submissionObject = {
                        assignment : assignment,
                        submission : submission,
                        peerReview : peerReview,
                        submissionTitle : submissionTitle,
                        isPeerReview : isPeerReview,
                        isPeerReviewFinished : isPeerReviewFinished,
                        isTeacherViewingStudentsSubmission : isTeacherViewingStudentsSubmission
                    };

                var submissionHtml = mmooc.util.renderTemplateWithData("assignmentSubmission", submissionObject);
                $("body.assignments #application.ic-app #content .submission_details" ).after(submissionHtml);
            }

            function _addSaveRubricButtonIfItDoesNotExist() {

                function _new_save_rubric_button(event) {
                    console.log('dynamically button (#mmooc_save_rubric_button.save_rubric_button )is clicked');

                    //Start original rubric button on click code in Canvas LMS
                    var showGrade = function(submission) {
                        $(".grading_box").val(submission.grade != undefined && submission.grade !== null ? submission.grade : "");
                        $(".score").text(submission.score != undefined && submission.score !== null ? round(submission.score, round.DEFAULT) : "");
                        $(".published_score").text(submission.published_score != undefined && submission.published_score !== null ? round(submission.published_score, round.DEFAULT) : "");
                    };

                    var toggleRubric = function($rubric) {
                        ariaSetting = $rubric.is(":visible");
                        $("#application").find("[data-hide_from_rubric]").attr("aria-hidden", ariaSetting)
                    };

                    var closeRubric = function() {
                        $("#rubric_holder").fadeOut(function() {
                        toggleRubric($(this));
                        $(".assess_submission_link").focus();
                        });
                    };

                    var $rubric = $(this).parents("#rubric_holder").find(".rubric");
                    var data = rubricAssessment.assessmentData($rubric);
                    var url = $(".update_rubric_assessment_url").attr('href');
                    var method = "POST";
                    $rubric.loadingImage();
                    
                    $.ajaxJSON(url, method, data, function(data) {
                        $rubric.loadingImage('remove');
                        var assessment = data;
                        var found = false;
                        if(assessment.rubric_association) {
                            rubricAssessment.updateRubricAssociation($rubric, data.rubric_association);
                            delete assessment.rubric_association;
                        }
                        for(var idx in rubricAssessments) {
                            var a = rubricAssessments[idx].rubric_assessment;
                            if(a && assessment && assessment.id == a.id) {
                                rubricAssessments[idx].rubric_assessment = assessment;
                                found = true;
                            }
                        }
                        if(!found) {
                            if (!data.rubric_assessment) {
                                data = { rubric_assessment: data };
                            }
                            rubricAssessments.push(data);
                            var $option = $(document.createElement('option'));
                            $option.val(assessment.id).text(assessment.assessor_name).attr('id', 'rubric_assessment_option_' + assessment.id);
                            $("#rubric_assessments_select").prepend($option).val(assessment.id);
                        }
                        $("#rubric_assessment_option_" + assessment.id).text(assessment.assessor_name);
                        $("#new_rubric_assessment_option").remove();
                        $("#rubric_assessments_list").show();
                        rubricAssessment.populateRubric($rubric, assessment);
                        submission = assessment.artifact;
                        if (submission) {
                            showGrade(submission);
                        }
                        closeRubric();
                        //End original rubric button on click code in Canvas LMS
                        console.log('Finished running #mmooc_save_rubric_button.save_rubric_button code');
                        _updateDomAfterSaveRubricButtonClick();
                    });
                }

                if (isPeerReview) {
                    var isAssessingRubric = false;
                    if ($('#rubric_holder .rubric_container.rubric.assessing').length) {
                        isAssessingRubric = true;
                    }

                    if (isAssessingRubric) { //We know that we are in assessing mode
                        //The button should be there
                        var $saveRubricButton = $("#rubric_holder #rubric_criterion_comments_dialog + .button-container > button.save_rubric_button");
                        if ($saveRubricButton.length == 0) {
                            console.log('Adding custom save rubric button');
                            var saveRubricButtonHtml = mmooc.util.renderTemplateWithData("assignmentPageWithPeerReviewSaveRubricButton", {});
                            
                            // $("#rubric_holder #rubric_criterion_comments_dialog + .button-container button.save_rubric_button").remove(); 
                            $("#rubric_holder #rubric_criterion_comments_dialog + .button-container").append(saveRubricButtonHtml);
                            $(document).on("click", "#mmooc_save_rubric_button", _new_save_rubric_button);
                        }
                    }
                }
            }

            if (_isCodeRunningInIframe()) {
                return false; //The code is running in an iframe. Code should not be running.
            }
            var courseId = mmooc.api.getCurrentCourseId();
            var assignmentId = mmooc.api.getCurrentTypeAndContentId().contentId;
            var isRubric = _isRubric();
            var isPeerReview = _isPeerReview();
            var isOwnSubmission = _isOwnSubmission();
            var submission_user_id = ENV.SUBMISSION.user_id;

            if(isRubric) //Spesial design dersom vi bruker vurderingskriterier.
            {
                if (isPeerReview || isOwnSubmission) { 
                    mmooc.api.getSingleAssignment(courseId, assignmentId, function(assignment) {
                        mmooc.api.getSingleSubmissionForUser(courseId, assignmentId, submission_user_id, function(submission) {
                            var submission_id = submission.id;    

                            mmooc.api.getPeerReviewsForSubmissionId(courseId, assignmentId, submission_id, function(peerReview) {
                                _logDataToConsole(assignment, submission, peerReview);
                                _appendSubmissionHtml(assignment, submission, peerReview);
                                _addClickEventOnOpenAssessmentButton();
    //                            _addSaveRubricButtonIfItDoesNotExist(); //Enable this if the button 'Lagre kommentar' in the peer review dialog is not displaying
    //                          Update: This is a bug in Canvas: https://community.canvaslms.com/thread/12681-peer-review-issues
                                $(document).on("click", "button.save_rubric_button", _updateDomAfterSaveRubricButtonClick);
                            }); 
                        });
                    });
                }
            }
            else //Vis standard design.
            {
                $(".submission-details-header.submission_details").show();
                $(".submission-details-comments").show();
                $("#submission_comment.submission_comment_textarea").show();
            }
        }
    };
}();

this.mmooc=this.mmooc||{};

this.mmooc.powerFunctions = function() {
  var rootId = undefined;

  function _render(template, heading, data) {
    var html =
          mmooc.util.renderTemplateWithData('powerfunctions/head', {heading: heading}) +
          mmooc.util.renderTemplateWithData(template, data) +
          mmooc.util.renderTemplateWithData('powerfunctions/tail', {});
      document.getElementById(rootId).innerHTML = html;
    }
  
  function AssignPeerReviewsForGroup() {
    function _renderView() {
      mmooc.api.getCoursesForUser(function(courses) {
        _render("powerfunctions/peer-review",
                "Assign peer reviews by group",
                {courses: courses});
        var peerReviewAssignments = [];
        $('#mmpf-course-select').change(function () {
          var courseID = $('#mmpf-course-select option:selected').val();
          mmooc.api.getGroupCategoriesForCourse(courseID, function(categories) {
            $('.step-2').css('display', 'list-item');
            $('.step-3').css('display', 'none');
            $('.step-4').css('display', 'none');
            var html = html + "<option value=''>Choose a group set</option>";
            for (var i = 0; i < categories.length; i++) {
              html = html + "<option value=" + categories[i].id + ">" + categories[i].name + "</option>";
            }
            $("#mmpf-category-select").html(html);
            $(".peer-review-list").html("");
            $(".assignment-info").html("");
          });
        });
        $('#mmpf-category-select').change(function () {
          var categoryID = $('#mmpf-category-select option:selected').val();
          mmooc.api.getGroupsInCategory(categoryID, function(groups) {
            $('.step-3').css('display', 'list-item');
            $('.step-4').css('display', 'none');
            var html = html + "<option value='' disabled>Choose groups</option>";
            for (var i = 0; i < groups.length; i++) {
              html = html + "<option value=" + groups[i].id + ">" + groups[i].name + "</option>";
            }
            $("#mmpf-group-select").html(html);
            $(".peer-review-list").html("");
            $(".assignment-info").html("");
          });
        });
        $('#mmpf-group-select').change(function () {
          var courseID = $('#mmpf-course-select option:selected').val();
          mmooc.api.getAssignmentsForCourse(courseID, function(assignments) {
            peerReviewAssignments = [];
            for (var i = 0; i < assignments.length; i++) {
              if(assignments[i].peer_reviews) {
                peerReviewAssignments.push(assignments[i])
              }
            }
            var html = "<option value=''>Choose an assignment</option>";
            for (var j = 0; j < peerReviewAssignments.length; j++) {
              html = html + "<option value=" + peerReviewAssignments[j].id + ">" + peerReviewAssignments[j].name + "</option>";
            }
            $("#mmpf-assignment-select").html(html);
            $(".peer-review-list").html("");
            $(".assignment-info").html("");
            $('.step-4').css('display', 'list-item');
          });
        });
		$('#mmpf-assignment-select').change(function () {
  		var assignmentID = $('#mmpf-assignment-select option:selected').val();
  		for (var i = 0; i < peerReviewAssignments.length; i++) {
    		if(peerReviewAssignments[i].id == assignmentID) {
      		var activeAssignment = peerReviewAssignments[i];
    		}
  		}
  		var assignmentDue = new Date(activeAssignment.due_at);
  		if(typeof activeAssignment.peer_reviews_assign_at !== 'undefined') {
    		var peerReviewDue = new Date(activeAssignment.peer_reviews_assign_at);
    		peerReviewDue = ("0" + peerReviewDue.getDate()).slice(-2) + "." + ("0" + peerReviewDue.getMonth()).slice(-2) + "." + peerReviewDue.getFullYear();
  		}
  		else {
    		peerReviewDue = "Ikke satt";
  		}
  		assignmentDue = ("0" + assignmentDue.getDate()).slice(-2) + "." + ("0" + assignmentDue.getMonth()).slice(-2) + "." + assignmentDue.getFullYear();
  		var html = "<h3>" + activeAssignment.name + "</h3>" +
  		"<p><span class='bold'>Innleveringsfrist: </span>" + assignmentDue + 
  		"<br><span class='bold'>Hverandrevurderingsfrist: </span>" + peerReviewDue + "</p>";
  		$(".assignment-info").html(html);
      var selectedGroups = [];
      $("#mmpf-group-select option:selected").each(function(){
          selectedGroups.push(this);
      });
      $(".peer-review-list").html("");
			_listPeerReviewsForGroup(selectedGroups, assignmentID);
			_showInput();
		});

      });
    }

    function _listPeerReviewsForGroup(selectedGroups, assignmentID) {
      $(".peer-review-list").html("");
      $(".progress-info").html("<p>Laster hverandrevurderinger... (Kan ta opptil 1 minutt)</p>");
	    var courseID = $('#mmpf-course-select option:selected').val();
	    var html = "";
	    var peerReviewsInGroup = [];
	    var count = 0;
	    var asyncsDone = 0;
	    var inArray = false;
	    var groupIndex = 0;
	    var groupsMembers = [];
	    var allSubmitted = [];
	    var noOfAssignedPeerReviewsForStudent = [];
	    var noOfPeerReviewersForStudent = [];
      mmooc.api.getPeerReviewsForAssignment(courseID, assignmentID, function(peerReviews) {
		    for (var i = 0; i < selectedGroups.length; i++) {
		      mmooc.api.getGroupMembers(selectedGroups[i].value, function(members) {
    		    groupsMembers.push(members);
    		    asyncsDone++;
  			    $(".progress-info").html("Laster grupper");
  			    $("#progress").show();
  			    var width = (100 / selectedGroups.length) * asyncsDone + "%";
  			    $("#bar").width(width);
  			    if (asyncsDone == selectedGroups.length) {
    			    //Sort groups array based on selected groups array
    			    var groupsMembersSorted = [];
    			    for (var i = 0; i < selectedGroups.length; i++) {
          			    for (var j = 0; j < groupsMembers.length; j++) {
            			    if (selectedGroups[i].value == groupsMembers[j][0].group_id) {
              			        groupsMembersSorted.push(groupsMembers[j]);
                                break;
            			    }
          			    }
    			    }
    			    _findSubmissionsForGroups(groupsMembersSorted);
  			    }			        			    
		      });
		    }
        function _findSubmissionsForGroups(groupsMembers) {
		      var totalMembers = 0;
		      asyncsDone = 0;
		      // Find total members
		      for (var j = 0; j < groupsMembers.length; j++) {
      		      for (var i = 0; i < groupsMembers[j].length; i++) {
        		      totalMembers++;
      		      }
		      }
		      for (var j = 0; j < groupsMembers.length; j++) {
  		      // Get submissions for users in group and push to array if workflow_state is submitted or graded
    				for (var i = 0; i < groupsMembers[j].length; i++) {
    					mmooc.api.getSingleSubmissionForUser(courseID, assignmentID, groupsMembers[j][i].id, function(submission) {
      					$(".progress-info").html("Laster besvarelser");
    						if (submission.workflow_state == "submitted" || submission.workflow_state == "graded") {
    							allSubmitted.push(submission);
    						}
    						asyncsDone++;
    						width = (100 / totalMembers) * asyncsDone + "%";
    						$("#bar").width(width);
    						// Print groups when all requests are done
    						if (asyncsDone == totalMembers) {
      						for (var i = 0; i < groupsMembers.length; i++) {
    							  _printSingleGroup(groupsMembers[i], allSubmitted);
    							}
    						}
    					});
  				    }
				}
            }
  			function _printSingleGroup(members, submitted) {
  				peerReviewsInGroup = [];
  				inArray = false;
  				count = 0;
  				for (var i = 0; i < members.length; i++) {
      				noOfPeerReviewersForStudent[members[i].id] = 0;
  				}
				for (var i = 0; i < selectedGroups.length; i++) {
					if (selectedGroups[i].value == members[0].group_id) {
						var groupName = selectedGroups[i].text;
					}
				} 
  				html = "<h3>" + groupName + "</h3><ul>";
  				// Traverse all peer reviews and group members	  	
  		    	for (var i = 0; i < peerReviews.length; i++) {
  			    	for (var j = 0; j < members.length; j++) {
  				    	// Check if object is already in array			    	
  				    	for (var k = 0; k < peerReviewsInGroup.length; k++) {
  					    	if(peerReviewsInGroup[k] === peerReviews[i]) {
  						    	inArray = true;
  					    	}
  					    }
  					    // Push object to array if assesor is member of group and object not already in array	    	
  			    		if (peerReviews[i].assessor_id == members[j].id && !inArray) {
  				    		peerReviewsInGroup[count] = peerReviews[i];
  				    		count++;
  			    		}
  			    		inArray = false;
  			    	}
  			    }
  			    inArray = false;			    			    			    
  		    	for (var i = 0; i < members.length; i++) {
      		    	var noOfAssignedPeerReviews = 0;
  			    	count = 0;
  			    	// List users and tag users without submissions
  			    	if(submitted) {
  				    	for (j = 0; j < submitted.length; j++) {
  					    	// Check if user has submission
  					    	if (submitted[j].user_id == members[i].id) {
  						    	html = html + "<li><a href='" + "/courses/" + courseID + "/assignments/" + assignmentID + "/submissions/" + members[i].id + "' target='_blank'>" + members[i].name + "</a></li><ul>";
  						    	inArray = true;
  						    	break;
  					    	}
  				    	}
  						if (!inArray) {
  						  	html = html + "<li>" + members[i].name + " <span class='no-submission'>Ikke levert besvarelse</span></li><ul>";
  						}
  			    	}else {
  				    	html = html + "<li>" + members[i].name + "</li><ul>";
  			    	}		    	
  			    	for (var k = 0; k < peerReviewsInGroup.length; k++) {
  				    	if(members[i].id == peerReviewsInGroup[k].assessor_id) {
      				    	noOfAssignedPeerReviews++;
                            noOfPeerReviewersForStudent[peerReviewsInGroup[k].user.id]++;
  					    	// List user name and tag peer review as completed/not completed
  					    	if(peerReviewsInGroup[k].workflow_state == "completed") {
  					    		html = html + "<li><a href='" + "/courses/" + courseID + "/assignments/" + assignmentID + "/submissions/" + peerReviewsInGroup[k].user.id + "' target='_blank'>" + peerReviewsInGroup[k].user.display_name  + " </a><span style='color:green;'>Fullført</span></li>";
  					    	}else {
  						    	html = html + "<li><a href='" + "/courses/" + courseID + "/assignments/" + assignmentID + "/submissions/" + peerReviewsInGroup[k].user.id + "' target='_blank'>" + peerReviewsInGroup[k].user.display_name  + " </a><span style='color:red;'>Ikke fullført</span></li>";
  					    	}
  					    	count++;
  				    	}
  			    	}
  			    	html = html + "</ul>";
  			    	if(count == 0) {
  				    	html = html + "<div>Ingen tildelt</div>";
  			    	}
  			    	inArray = false;
  			    	noOfAssignedPeerReviewsForStudent[members[i].id] = noOfAssignedPeerReviews;	    			    	
  			    }
  			    $("#progress").hide();
  			    $(".peer-review-list").append(html + "</ul>");
  			    $(".progress-info").html("");
  			    $('.input-wrapper').show();
  				$('.btn-create-pr').unbind().click(function () {
  					var numOfReviews = $('.number-of-reviews').val();
  					// Create peer reviews for group after validation
  					if (!_isNormalInteger(numOfReviews) || numOfReviews < 1) {
  						alert("Antall gjennomganger må være et positivt heltall");
  					}
  					else {
  						$('.input-wrapper').hide();
              _createPeerReviewsForGroups(courseID, assignmentID, numOfReviews, allSubmitted, groupsMembers, selectedGroups, peerReviewsInGroup, noOfAssignedPeerReviewsForStudent, noOfPeerReviewersForStudent);
  					}
  				});	
  			}       
		  });
    }
    
	function _createPeerReviewsForGroups(courseID, assignmentID, numOfReviews, allSubmitted, groupsMembers, selectedGroups, peerReviewsInGroup, noOfAssignedPeerReviewsForStudent, noOfPeerReviewersForStudent) {
		$(".peer-review-list").html("");
		$("#progress").show();
		var asyncsDone = 0;
		var assigned = [];
		var assesorIndex = 0;
		var submitted = [];
		var skipped = 0;
		var width = 0;
		for (var m = 0; m < groupsMembers.length; m++) {
      		$("#bar").width('0%');
            submitted = [];
            // Get submissions for group
            $(".progress-info").html("Finner innleveringene for gruppe " + (m + 1) + " av " + groupsMembers.length);
      		for (var k = 0; k < allSubmitted.length; k++) {
        		for (var l = 0; l < groupsMembers[m].length; l++) {
                    width = (100 / (allSubmitted.length)) * k + "%";
                    $("#bar").width(width);
              		if (allSubmitted[k].user_id == groupsMembers[m][l].id) {
                		submitted.push(allSubmitted[k]);
              		}
        		}
      		}
      		// Continue if number of reviews exeeds number of groups members
      		if (numOfReviews > (submitted.length - 1)) {
        		skipped = skipped + submitted.length;   
        		alert("For mange gjennomganger i forhold til antall besvarelser for gruppe " + selectedGroups[m].text);
        		continue;
      		}
      		$(".progress-info").html("Tildeler hverandrevurderinger...");
      		$("#bar").width(0);
      		for (var j = 0; j < numOfReviews; j++) {
      			for (var i = 0; i < submitted.length; i++) {
      				assesorIndex = (i + 1) + j;
      				// Check if index exceeds array length
      				if (assesorIndex >= submitted.length) {
      					assesorIndex = assesorIndex - submitted.length;	
      				}
      				var userID = submitted[assesorIndex].user_id;
      				for (var l = 0; l < numOfReviews; l++) {
          				for (var k = 0; k < peerReviewsInGroup.length; k++) {
              				if (peerReviewsInGroup[k].assessor_id == userID && peerReviewsInGroup[k].user_id == submitted[i].user_id || userID == submitted[i].user_id) {
                  				assesorIndex++;
                  				if (assesorIndex >= submitted.length) {
                  					assesorIndex = assesorIndex - submitted.length;	
                  				}
                  				userID = submitted[assesorIndex].user_id;
              				}
          				}
      				}
      				// Check if student already has enough peer reviews or peer reviewers
      				if(noOfAssignedPeerReviewsForStudent[userID] < numOfReviews && noOfPeerReviewersForStudent[submitted[i].user_id] < numOfReviews) {
          				noOfAssignedPeerReviewsForStudent[userID]++;
                        noOfPeerReviewersForStudent[submitted[i].user_id]++;
          				mmooc.api.createPeerReview(courseID, assignmentID, submitted[i].id, userID, function(result) {				
          					asyncsDone++;
          					width = (100 / (numOfReviews * allSubmitted.length)) * asyncsDone + "%";
          					$("#bar").width(width);
          					if (asyncsDone == (allSubmitted.length * numOfReviews) - skipped) {
              					$("#progress").hide();
            					_listPeerReviewsForGroup(selectedGroups, assignmentID);
            					if (skipped > 0) {
                					alert("Klarte ikke tildele hverandrevurderinger for " + skipped + " studenter. (Studentene har allerede nok hverandrevurderinger eller hverandrevurderere.)");
            					}
          					}
          				}); //end createPeerReview async call
          		    } //end if noOfAssignedPeerReviewsForStudent < numOfReviews && noOfPeerReviewersForStudent[submitted[i].user_id] < numOfReviews
          		    else {
              		    skipped++;
      					if (asyncsDone == (allSubmitted.length * numOfReviews) - skipped) {
          					$("#progress").hide();
        					_listPeerReviewsForGroup(selectedGroups, assignmentID);
        					if (skipped > 0) {
            					alert("Klarte ikke tildele hverandrevurderinger for " + skipped + " studenter. (Studentene har allerede nok hverandrevurderinger eller hverandrevurderere.)");
        					}
      					}
          		    }
      			} //end for submitted.length
      		} //end for numOfReviews (ferdig å tildele hverandrevurderinger for en gruppe)  
		} //end for groupsMembers.length (ferdig å tildele hverandrevurderinger for alle grupper)
	}

    function _isNormalInteger(str) {
    	return /^\+?(0|[1-9]\d*)$/.test(str);
	}
    
    function _showInput() {
	    $(".peer-review-create").html("<div class='input-wrapper'><input type='text' value='" + mmooc.settings.defaultNumberOfReviews + "' style='width:25px;' class='number-of-reviews'> gjennomganger per bruker<br><input type='button' value='Tildel hverandrevurderinger' class='button btn-create-pr'></div>");
    }

    return {
      run: function() {
        _renderView();
      }
    };
  }
  
  function ListStudentProgress() {
    var error = function(error) {
        console.error("error calling api", error);
    };
    	
    function _renderView() {    
      mmooc.api.getCoursesForUser(function(courses) {
        _render("powerfunctions/student-progress",
                "List student progress by section",
                {courses: courses});
        $('#mmpf-course-select').change(function () {
          var courseID = $('#mmpf-course-select option:selected').val();
          var params = { per_page: 999 };
          mmooc.api.getSectionsForCourse(courseID, params, function(sections) {
            $('.step-2').css('display', 'list-item');
            $('.step-3').css('display', 'none');
            var html = html + "<option value=''>Choose a section</option>";
            for (var i = 0; i < sections.length; i++) {
              html = html + "<option value=" + i + ">" + sections[i].name + "</option>";
            }
            $("#mmpf-section-select").html(html);
            $(".student-progress-table").html("");
          });
        });
        $('#mmpf-section-select').change(function () {
	      var courseID = $('#mmpf-course-select option:selected').val();
          mmooc.api.getModulesForCourseId(function(modules) {
            $('.step-3').css('display', 'list-item');
            var html = html + "<option value=''>Choose a module</option>";
            for (var i = 0; i < modules.length; i++) {
              html = html + "<option value=" + modules[i].id + ">" + modules[i].name + "</option>";
            }
            $("#mmpf-module-select").html(html);
            $(".student-progress-table").html("");
          }, error, courseID);
        });
		$('#mmpf-module-select').change(function () {
			_printStudentProgressForSection();
			$(".student-progress-table").html("");
		});

      });
    }
    
    function _printStudentProgressForSection() {
	    $("#progress").hide();
	    var courseID = $('#mmpf-course-select option:selected').val();
	    var moduleID = $('#mmpf-module-select option:selected').val();
	    var sectionIndex = $('#mmpf-section-select option:selected').val();
	    var sectionParams = { per_page: 999, "include": ["students"] };
	    var moduleParams = { per_page: 999 };
	    var html = "<table><tr><th>Navn</th>";
	    var asyncsDone = 0;
	    mmooc.api.getItemsForModuleId(function(items) {
		    for (var i = 0; i < items.length; i++) {
			    html = html + "<th>" + items[i].title + "</th>";
		    }
		    html = html + "</tr>";
		    mmooc.api.getSectionsForCourse(courseID, sectionParams, function(sections) {		
			    if(sections[sectionIndex].students.length < 1) {
				    $(".student-progress-table").html("Ingen studenter funnet i klasse " + sections[sectionIndex].name);
			    }    
			    for (var j = 0; j < sections[sectionIndex].students.length; j++) {				    
				    moduleParams = { student_id: sections[sectionIndex].students[j].id, per_page: 999 };
				    mmooc.api.getItemsForModuleId(function(itemsForStudent) {
    				    for(var l = 0; l < sections[sectionIndex].students.length; l++) {
        				    if (sections[sectionIndex].students[l].id == itemsForStudent[0].student_id) {
            				    html = html + "<tr><td>" + sections[sectionIndex].students[l].name + "</td>";
        				    }
    				    }
					    if(itemsForStudent.length < 1) {
						    html = html + "<td>Ingen krav</td>";
					    }
					    for (var k = 0; k < itemsForStudent.length; k++) {
						    if("completion_requirement" in itemsForStudent[k]) {
							    if(itemsForStudent[k].completion_requirement.completed) {
							    	html = html + "<td class='ok' />";
							    }else {
								    html = html + "<td class='nok' />";
							    }
						    }else {
							    html = html + "<td>Ingen krav</td>";
						    }
					    }
					    asyncsDone++;
					    var width = ((100 / sections[sectionIndex].students.length) * asyncsDone + "%");
					    $("#bar").width(width);
					    $("#progress").show();
					    if(asyncsDone == sections[sectionIndex].students.length) {
						    $("#progress").hide();
						    $(".student-progress-table").html(html + "</table>");
					    }
				    }, error, courseID, moduleID, moduleParams);
				    html = html + "</tr>";
			    }
			    
		    });
	    }, error, courseID, moduleID, moduleParams);
    }
  
    return {
      run: function() {
        _renderView();
      }
    };
  }  

  function Menu() {
    function _setUpClickHandlers() {
      $("#mmooc-pf-peer-review-btn").click(function() {
        new AssignPeerReviewsForGroup().run();
      });
      $("#mmooc-pf-student-progress-btn").click(function() {
        new ListStudentProgress().run();
      });
    }

    return {
      run: function() {
        try {
          _render("powerfunctions/mainteacher", "Choose function");
          _setUpClickHandlers();
        }
        catch (e) {
          alert (e.message);
          console.log(e);
        }
      }
    };
  }

  return {
    show: function(parentId) {
      rootId = parentId;
      new Menu().run();
    }
  };
}();


this.mmooc=this.mmooc||{};


this.mmooc.routes = function() {
    function Route(paths, queryStrings, handler) {
        if (paths != null) {
            this.paths = paths instanceof Array ? paths : [paths];
        } else {
            this.paths = null;
        }

        if (queryStrings != null) {
            this.queryStrings = queryStrings instanceof Array ? queryStrings : [queryStrings];
        } else {
            this.queryStrings = null;
        }

        this.handler = handler;
        this.isAlreadyHandled = false;
    }

    var routes = [];

    return {
        addRouteForPath: function(path, handler) {
            routes.push(new Route(path, null, handler));
        },
        addRouteForQueryString: function(queryString, handler) {
            routes.push(new Route(null, queryString, handler));
        },

        addRouteForPathOrQueryString: function(path, queryString, handler) {
            routes.push(new Route(path, queryString, handler));
        },

        performHandlerForUrl: function(location) {
            var path = location.pathname;
            var queryString = location.search;

            for (var i = 0; i < routes.length; i++) {
                var route = routes[i];
                if (route.paths != null) {
                    for (var j = 0; j < route.paths.length; j++) {
                        if (route.paths[j].test(path) && !route.isAlreadyHandled) {
                            //20180911ETH Need to know if there is a query string to decide how to handle a discussion.
                            route.hasQueryString = queryString.length;
                            route.path = path;
                            route.isAlreadyHandled = true;
                            console.log("Handle route: " + route.paths[j]);
                            route.handler();
                        }
                    }
                }

                if (route.queryStrings != null) {
                    for (var k = 0; k < route.queryStrings.length; k++) {
                        if (route.queryStrings[k].test(queryString) && !route.isAlreadyHandled) {
                            route.isAlreadyHandled = true;
                            console.log("Handle query string: " + route.queryStrings[k]);
                            route.handler();
                            return;
                        }
                    }
                }
            }
        }
    };
}();

if (typeof module !== "undefined" && module !== null) {
    module.exports = this.mmooc.routes;
}

Handlebars.registerHelper('lowercase', function(str) {
    return ("" + str).toLowerCase();
});

Handlebars.registerHelper('uppercase', function(str) {
    return ("" + str).toUpperCase();
});

Handlebars.registerHelper('percentage', function(number1, number2) {
    if (number2 == 0) {
        return 0;
    }
    return Math.round(number1*100/number2);
});

Handlebars.registerHelper('ifEquals', function(var1, var2, options) {
    if (var1 == var2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('ifHasRole', function(enrollments, role, options) {
	for (var i = 0; i < enrollments.length; i++) {
    	if (enrollments[i].role == role) {
	        return options.fn(this);
	    }
    }
});




Handlebars.registerHelper('ifGreaterThan', function(value1, value2, options) {
    if (value1 > value2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('overrideIconClassByTitle', function(title) {
    title = title.toLowerCase();
    if (title.indexOf('utmerkelse:') !=-1) {
        return ' mmooc-icon-badge';
    } else if (title.indexOf('video:') !=-1) {
        return ' mmooc-icon-video';
    } else if (title.indexOf('aktivitet:') !=-1) {
        return ' mmooc-icon-interactive';
    } else {
        return '';
    }
});

Handlebars.registerHelper('getPeerReviewWorkflowIconClass', function(workflow_state) {
    
    if (workflow_state == "assigned") {
        return ' warning';
    } else if (workflow_state == "completed") {
        return ' pass';
    } else {
        return '';
    }
});

Handlebars.registerHelper("norwegianDateAndTime", function(timestamp) {
    var year = new Date(timestamp).toString(' yyyy');
    var day = new Date(timestamp).toString('dd. ');
    var time = new Date(timestamp).toString(' HH:mm');
    var monthNumber = parseInt(new Date(timestamp).toString('M'), 10);
    var months = mmooc.i18n.Months;
    var month = months[monthNumber - 1];
    
    return day + month + year + time; //return new Date(timestamp).toString('dd. MMMM yyyy HH:mm'); // yyyy-MM-dd
});

Handlebars.registerHelper('getSubmissionAssessmentText', function(peerReview) {
    
    var submissionText = '';
    var numberOfReviews = peerReview.length;
    var numberOfReviewsCompleted = 0;
    var submissionAssessmentText = '';

    $.each(peerReview, function( index, singlePeerReview ) {
        if (singlePeerReview.workflow_state == 'completed') {
            numberOfReviewsCompleted = numberOfReviewsCompleted + 1;
        }
    });
    
    if (numberOfReviews === 0) {
        submissionAssessmentText = mmooc.i18n.SubmissionIsNotAssessed;
    } else if (numberOfReviews === numberOfReviewsCompleted) {
        if (numberOfReviewsCompleted == 1) {
            submissionAssessmentText = mmooc.i18n.SubmissionIsAssessedByOne;
        } else {
            submissionAssessmentText = mmooc.i18n.SubmissionIsAssessedByAll;
        }
         
    } else {
        submissionAssessmentText = numberOfReviewsCompleted.toString() + " " + mmooc.i18n.OutOf + " " + numberOfReviews.toString() + " " + mmooc.i18n.SubmissionAssessmentsAreReady; 
    }

    return submissionAssessmentText; 
});

Handlebars.registerHelper('ifAtLeastOnePeerReviewIsComplete', function(peerReview, options) {
    var atLeastOnePeerReviewComplete = false;
    $.each(peerReview, function (index, singlePeerReview) {
        if (singlePeerReview.workflow_state == 'completed') {
            atLeastOnePeerReviewComplete = true;
        }
    });
    if (atLeastOnePeerReviewComplete) { 
        return options.fn(this); 
    }
    else
    {        
        return options.inverse(this);
    }
});


Handlebars.registerHelper('ifAllPeerReviewsAreComplete', function(peerReview, options) {

    var allPeerReviewsAreComplete = true;
    
    $.each(peerReview, function (index, singlePeerReview) {
        if (singlePeerReview.workflow_state != 'completed') {
            allPeerReviewsAreComplete = false;
        }
    });

    if (allPeerReviewsAreComplete) { 
        return options.fn(this); 
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper("getPathFromUrl", function(url) {
  return url.split("?")[0]; //returns an array even if there is no '?' so no need for extra checks
});

Handlebars.registerHelper('urlForCourseId', function(courseId) {
    return "/courses/" + courseId;
});

Handlebars.registerHelper('urlForGroupId', function(groupId) {
    return "/groups/" + groupId + "/discussion_topics";
});

Handlebars.registerHelper('ifItemIsCompleted', function(completion_requirement, options) {

    if (completion_requirement && completion_requirement.completed) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('localize', function(key, options) {
    if (mmooc.i18n[key] != null) {
        return mmooc.i18n[key];
    } else {
        return key;
    }
});


Handlebars.registerHelper('ifAllItemsCompleted', function(items, options) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.completion_requirement && !item.completion_requirement.completed) {
            return options.inverse(this);
        }
    }

    return options.fn(this);
});

Handlebars.registerHelper('ifAllModulesCompleted', function(modules, options) {
    if (mmooc.courseList.isCourseCompleted(modules)) {
        return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper('percentageForModules', function(modules) {
    var total = 0;
    var completed = 0;

    for (var i = 0; i < modules.length; i++) {
        var module = modules[i];
        for (var j = 0; j < module.items.length; j++) {
            var item = module.items[j];
            if (item.completion_requirement) {
                total++;
                if (item.completion_requirement.completed) {
                    completed++;
                }
            }
        }
    }

    return Math.round((completed*100)/total);
});

Handlebars.registerHelper('urlForFirstNoneCompleteItem', function(items) {
    if (items != null && items != undefined && items.length > 0) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.completion_requirement && !item.completion_requirement.completed) {
                return item.html_url;
            }
        }

        return items[0].html_url;
    }

    return null;
});

Handlebars.registerHelper('ifItemTypeDiscussion', function(type, options) {
    if (type == 'Discussion') {
      return options.fn(this);
    }
    else {
      return options.inverse(this);
    }
});

Handlebars.registerHelper('findRightUrlFor', function(activity) {
    return activity.type === 'Submission' ? '/courses/' + activity.course_id + '/grades' : activity.html_url;
});

Handlebars.registerHelper('checkReadStateFor', function(activity) {
    return mmooc.menu.checkReadStateFor(activity) ? "unread" : "";
});


Handlebars.registerHelper("debug", function(optionalValue) {
  console.log("Current Context");
  console.log("====================");
  console.log(this);
 
  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
});
this.mmooc = this.mmooc || {};


this.mmooc.util = function () {
    return {
		mmoocLoadScript : function (mmoocScript)
		{
			var mmoocScriptElement = document.createElement('script');
			mmoocScriptElement.setAttribute('charset', 'UTF-8');
			mmoocScriptElement.setAttribute('src', mmoocScript);
			document.body.appendChild(mmoocScriptElement);
		},

        renderTemplateWithData: function (template, data) {
            var html = "";
            try {
                html = mmooc.templates[template](data);
            } catch (e) {
                console.log(e);
            }

            return html;

        },

        getPageTitleBeforeColon: function () {
            // For discussion pages we only want the title to be "<discussion>" instead of "Discussion: <discussion>"
            var title = document.title;
            if (title.indexOf(":")) {
                title = title.substring(0, title.indexOf(":"));
            }
            return title;
        },

        getPageTitleAfterColon: function () {
            // For discussion pages we only want the title to be "<discussion>" instead of "Discussion: <discussion>"
            var title = document.title;
            if (title.indexOf(":")) {
                title = title.substring(title.indexOf(":") + 1, title.length);
            }
            return title;
        },

        filterCourse: function(course) {
            return course.name != "SELFREGISTER";
        },
        filterSearchAllCourse: function(course) {
            return course.course.name != "SELFREGISTER";
        },
        callWhenElementIsPresent: function(classId, callback) {
            var checkExist = setInterval(function() {
                var checkClassId = classId;
                if($(checkClassId).length) {
                  clearInterval(checkExist);
                  callback();
                }
            }, 100);
        },

        arraySorted: function (array, elementToSort) {
            if (Object.prototype.toString.call(array) === '[object Array]' && elementToSort) {
                return array.sort(function (a, b) {
                    if (a.hasOwnProperty(elementToSort) && b.hasOwnProperty(elementToSort)) {
                        var field1 = a[elementToSort].toLocaleLowerCase();
                        var field2 = b[elementToSort].toLocaleLowerCase();
                        return field1.localeCompare(field2, 'nb', {usage: 'sort'});
                    }
                    return 0;
                });
            }
            return array;
        },

        goBack: function (e) {//http://stackoverflow.com/questions/9756159/using-javascript-how-to-create-a-go-back-link-that-takes-the-user-to-a-link-i
            var defaultLocation = "https://server";
            var oldHash = window.location.hash;

            history.back(); // Try to go back

            var newHash = window.location.hash;

            /* If the previous page hasn't been loaded in a given time (in this case
             * 1000ms) the user is redirected to the default location given above.
             * This enables you to redirect the user to another page.
             *
             * However, you should check whether there was a referrer to the current
             * site. This is a good indicator for a previous entry in the history
             * session.
             *
             * Also you should check whether the old location differs only in the hash,
             * e.g. /index.html#top --> /index.html# shouldn't redirect to the default
             * location.
             */

            if (
                newHash === oldHash &&
                (typeof(document.referrer) !== "string" || document.referrer === "")
            ) {
                window.setTimeout(function () {
                    // redirect to default location
                    window.location.href = defaultLocation;
                }, 1000); // set timeout in ms
            }
            if (e) {
                if (e.preventDefault)
                    e.preventDefault();
                if (e.preventPropagation)
                    e.preventPropagation();
            }
            return false; // stop event propagation and browser default event
        },

        adaptHeightToIframeContentForId: function (containerId, frameId) {

            var scrollHeight = Number(document.getElementById(frameId).contentWindow.document.body.scrollHeight) + 20;
            document.getElementsByClassName(containerId)[0].style.height = scrollHeight + "px";
        },

		isEnrolledAsStudent: function(enrollments) {
            for (var i = 0; i < enrollments.length; i++) {
                if(enrollments[i].role == "StudentEnrollment")
                {
                	return true;
                }
            }
            return false;
		},
		isEnrolledAsObserver: function(enrollments) {
            for (var i = 0; i < enrollments.length; i++) {
                if(enrollments[i].role == "ObserverEnrollment")
                {
                	return true;
                }
            }
            return false;
		},
		
        isTeacherOrAdmin: function() {
            var roles = mmooc.api.getRoles();
            return roles != null
                && (roles.indexOf('teacher') != -1
                    || roles.indexOf('admin') != -1);
        },
        isObserver: function(course) {
            return course.enrollments[0].type == "observer";
        },
        
        setGlobalPeerReviewButtonState: function () {
            if(mmooc.settings.disablePeerReviewButton == true) {
                $(".assignments #right-side :submit").prop("disabled",true);
            }
        },

        formattedDate: function (date) {
            var date = new Date(date);
            var month = mmooc.util.getMonthShortName(date);
            return date.getDate() + ' ' + month + ', ' + date.getFullYear() + ' - ' + date.getHours() + ':'+ (date.getMinutes()<10?'0':'') + date.getMinutes() ;
        },

        getWeekdayShortName: function (date) {
            var weekdays = ["sø", "ma", "ti", "on", "to", "fr", "lø"];
            return weekdays[date.getDay()];
        },

        getMonthShortName: function (date) {
            var months = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];
            return months[date.getMonth()];
        },
        getCourseCategories: function (courses) {
            var categorys = [];
            var hasOther = false;
            for (var i = 0; i < courses.length; i++) {
                var category = mmooc.util.getCourseCategory(courses[i].course_code);
                if (categorys.indexOf(category) == -1) {
                    if (category == "Andre") {
                      hasOther = true;
                    }
                    else { 
                      categorys.push(category);
                    }
                }
            }
            categorys.sort();
            if (hasOther) {
                categorys.push("Andre");
            }
            return categorys;           
        },
        getCoursesCategorized: function(courses, categorys) {
            var coursesCategorized = [];
            for (var i = 0; i < categorys.length; i++) {
                var categoryCourses = [];
                for (var j = 0; j < courses.length; j++) {
                    var category = mmooc.util.getCourseCategory(courses[j].course_code);
                    if (categorys[i] == category) {
                        categoryCourses.push(courses[j]);
                    }
                }
                categoryCourses.sort(function(a,b){
                    return a.course_code > b.course_code;
                });
                var categoryObj = {
                    title: categorys[i],
                    courses: categoryCourses
                }
                coursesCategorized.push(categoryObj);
            }
            return coursesCategorized;
        },
        getCourseCategory: function (courseCode) {
            var category = "Andre";
            if (courseCode && courseCode.indexOf("::") > -1) {
                category = courseCode.substring(0, courseCode.indexOf("::"));
            }
            return category;            
        },
        getToolsInLeftMenu : function(path) {
            var modulesFound = false;
            var toolList = [];
            var activeToolName = "Verktøy";
            var activeToolPath = "";
            
            $("#section-tabs .section > a").each(function() {
                var currentClass = $(this).attr("class");
                if(modulesFound && (currentClass != "settings")) {
                    var href = $(this).attr("href");
                    var title = $(this).attr("title");
                    var activeTool = false;
                    if(href == path)
                    {
                        activeTool = true;
                        activeToolName = title;
                        activeToolPath = href;
                    }
                    toolList.push({
                        activeTool: activeTool,
                        href: href,
                        title: title
                    });
                }
                else if(currentClass == "modules") {
                    modulesFound = true;
                }
            });
            return {
                activeToolName: activeToolName,
                activeToolPath: activeToolPath,
                toolList: toolList
            };
        }
    };
}();


this.mmooc=this.mmooc||{};


this.mmooc.settings = {
    'CanvaBadgeProtocolAndHost' : 'https://canvabadges-beta-iktsenteret.bibsys.no',
    'useCanvaBadge' : false,
    'defaultNumberOfReviews' : 1, // Default number of peer reviews per student in power function
    'disablePeerReviewButton' : true,
    'removeGlobalGradesLink' : true,
    'removeGroupsLink' : true,
    'privacyPolicyLink' : 'http://matematikk-mooc.github.io/privacypolicy.html',
    'platformName' : 'matematikk.mooc.no'
};

this.mmooc=this.mmooc||{};

if (typeof this.mmooc.i18n === 'undefined') {
    if(mmooc.api.getLocale() == "nn")
    {
        this.mmooc.i18n = {
            'DropCourseDialogText' : 'Trykk OK for å melde deg av kurset ', 
            'JoinCourseDialogText' : 'Du kan melde deg på kurset igjen seinare om du vil ', 
            'DropCourse' : 'Meld deg av emnet', 
            'CreateAccountTitle' : 'Har du ikkje konto?', 
            'CreateAccountSubtitle' : 'Klikk her for å lage ein', 
             'Course' : 'Emne', 
             'CourseDefinite' : 'Emnet', 
             'CoursePlural' : 'Emne', 
             'CourseProgressionTitle' : 'Din progresjon i emnet:', 
             'GoToCourse' : 'Gå til kursside', 
             'GoToModule' : 'Gå til modul', 
             'BackToCoursePage' : 'Tilbake til emneforsida', 
             'AddACourse' : 'Legg til eit emne', 
             'Module' : 'Modul', 
             'ModulePlural' : 'Modular', 
             'CourseModules' : 'Kursmodular', 
             'Assignment' : 'Oppgåve', 
             'Discussion' : 'Diskusjon', 
             'Quiz' : 'Prøve', 
             'Page' : 'Innhaldsside', 
             'ExternalUrl' : 'Ekstern lenke', 
             'ExternalTool' : 'Eksternt verktøy', 
             'File' : 'Fil', 
             'Announcement' : 'Kunngjering', 
             'DiscussionTopic': 'Diskusjon', 
             'Conversation': 'Innboksmelding', 
             'Message': 'Oppgåvevarsel', 
             'Submission': 'Innlevering', 
             'AssessmentRequest': 'Vurderingsførespurnad', 
             'Conference': 'Conference', 
             'Collaboration': 'Collaboration', 
             'LinkBack': 'Tilbake til førre side', 
             'Badgesafe': 'Utmerkingar', 
             'PeerReview' : 'Kvarandrevurdering', 
             
             //Teksten nedenfor brukes til å gjenkjenne 
             //om man er på en hverandrevurderingsside.
             //http://localhost/courses/1/assignments/1/submissions/3
             //http://localhost/courses/1/assignments/1
             'PeerReviewer' : 'Fagfellevurdering', 

             //Teksten nedenfor brukes til å undersøke om man viser sin egen innlevering
             'Delivery' : 'Innleveringsdetaljar', 

             'DetailsAboutYourDelivery' : 'Detaljar om innleveringa di', 
             'DetailsAboutDelivery' : 'Detaljar om innlevering', 
             'SubmissionIsNotAssessed' : 'Oppgåva er ikkje vurdert', 
             'SubmissionIsAssessedByOne' : 'Vurderinga er klar', 
             'SubmissionIsAssessedByAll' : 'Alle vurderingar er klare', 
             'SubmissionAssessmentsAreReady' : 'vurderingar er klare', 
             'GroupGetInTouchSubject' : 'ønsker kontakt', 
             'eventsAndDeadlinesTitle' : 'Viktige datoar', 
             'WeHaveAQuestionToTeacherInTheDiscussion' : 'Vi har eit spørsmål til rettleiar i diskusjonen', 
             'CallForInstructorHoverOverText' : 'Sender ei melding til rettleiar om at de treng hjelp i denne konkrete gruppediskusjonen. Treng du personleg rettleiing: send melding til din rettleiar i innboks.',
             'NoTeacherFeedbackLink' : 'No teacher_feedback link. Does the help menu have a link to send feedback to the teacher?', 
             'NoEnrollments' : 'Velkommen til vår emneplattform. Du er ikkje påmeldt nokon emne endå. Klikk på knappen nedanfor for å sjå tilgjengelege emne.', 
             'OutOf' : 'av', 
             'Months' : ["januar", 
             "februar", 
             "mars", 
             "april", 
             "mai", 
             "juni", 
             "juli", 
             "august", 
             "september", 
             "oktober", 
             "november", 
             "desember"] 
            }
    }
    else
    {
        this.mmooc.i18n = {
            'DropCourseDialogText' : 'Trykk OK for å melde deg av kurset ',
            'JoinCourseDialogText' : 'Du kan melde deg på kurset igjen senere om du vil ',
            'DropCourse' : 'Meld deg av kurset',
            'CreateAccountTitle' : 'Har du ikke konto?',
            'CreateAccountSubtitle' : 'Klikk her for å lage en',
            'Course' : 'Emne',
            'CourseDefinite' : 'Emnet',
            'CoursePlural' : 'Emner',
            'CourseProgressionTitle' : 'Din progresjon i emnet:',
            'GoToCourse' : 'Gå til emneside',
            'GoToModule' : 'Gå til modul',
            'BackToCoursePage' : 'Tilbake til emneforsiden',
            'AddACourse' : 'Legg til et emne',
            'Module' : 'Modul',
            'ModulePlural' : 'Moduler',
            'CourseModules' : 'Emnemoduler',
            'Assignment' : 'Oppgave',
            'Discussion' : 'Diskusjon',
            'Quiz' : 'Prøve',
            'Page' : 'Innholdsside',
            'ExternalUrl' : 'Ekstern lenke',
            'ExternalTool' : 'Eksternt verktøy',
            'File' : 'Fil',
            'Announcement' : 'Kunngjøring',
            'DiscussionTopic': 'Diskusjon',
            'Conversation': 'Innboksmelding',
            'Message': 'Oppgavevarsel',
            'Submission': 'Innlevering',
            'AssessmentRequest': 'Vurderingsforespørsel',
            'Conference': 'Conference',
            'Collaboration': 'Collaboration',
            'LinkBack': 'Tilbake til forrige side',
            'Badgesafe': 'Utmerkelser',
            'PeerReview' : 'Hverandrevurdering',

             //Teksten nedenfor brukes til å gjenkjenne om man er på en hverandrevurderingsside.
            'PeerReviewer' : 'Hverandrevurdering',

             //Teksten nedenfor brukes til å undersøke om man viser sin egen innlevering
            'Delivery' : 'innlevering',

            'DetailsAboutYourDelivery' : 'Detaljer om din innlevering',
            'DetailsAboutDelivery' : 'Detaljer om innlevering',
            'SubmissionIsNotAssessed' : 'Oppgaven er ikke vurdert',
            'SubmissionIsAssessedByOne' : 'Vurderingen er klar',
            'SubmissionIsAssessedByAll' : 'Alle vurderinger er klare',
            'SubmissionAssessmentsAreReady' : 'vurderinger er klare',
            'GroupGetInTouchSubject' : 'ønsker kontakt',
            'eventsAndDeadlinesTitle' : 'Viktige datoer',
            'WeHaveAQuestionToTeacherInTheDiscussion' : 'Vi har et spørsmål til veileder i diskusjonen',
            'CallForInstructorHoverOverText' : 'Sender en melding til veileder om at dere trenger hjelp i denne konkrete gruppediskusjonen. Trenger du personlig veiledning: send melding til din veileder i innboks.',
            'NoTeacherFeedbackLink' : 'No teacher_feedback link. Does the help menu have a link to send feedback to the teacher?',
            'NoEnrollments' : 'Velkommen til vår emneplattform. Du er ikke påmeldt noen emner enda. Klikk på knappen nedenfor for å se tilgjengelige emner.',
            'OutOf' : 'av',
            'Months' : ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"]
        };
    }
}

jQuery(function($) {
//    $('.header-bar').show(); //To avoid displaying the old contents while the javascript is loading. Selectors are set to display:none in CSS.
//    $(".ic-Layout-contentMain").show(); //Same as above.
	
//	$('.header-bar').css("visibility", "visible");
//	$(".ic-Layout-contentMain").css("visibility", "visible");
	
    mmooc.routes.addRouteForPath(/\/$/, function() {
        var parentId = 'wrapper'
        if (document.location.search === "?mmpf") {
            mmooc.powerFunctions.show(parentId);
        } else {
            window.location.href = "/courses";
        }
    });

    mmooc.routes.addRouteForQueryString(/invitation=/, function() {
    });

    mmooc.routes.addRouteForPath(/\/login$/, function() {
        $('#register_link').html("<i>Trenger du en konto?</i><b>Klikk her.</b>");
    });

    mmooc.routes.addRouteForPath(/\/courses$/, function() {
        mmooc.menu.hideRightMenu();
        mmooc.courseList.listCourses('content', mmooc.courseList.showAddCourseButton);
    });

    mmooc.routes.addRouteForPath(/\/courses\/\d+/, function() {
        var courseId = mmooc.api.getCurrentCourseId();
        mmooc.api.getCourse(courseId, function(course) {
            if(mmooc.util.isObserver(course))
            {
                mmooc.pages.showObserverInformationPane();
            }
        },  function(error) {
            console.error("error calling mmooc.api.getCourse(" + courseId + ")", error);
        });
    });
    
    mmooc.routes.addRouteForPath(/\/courses\/\d+$/, function() {
        mmooc.groups.interceptLinksToGroupPage();
//        mmooc.coursePage.hideCourseInvitationsForAllUsers();
        
        var courseId = mmooc.api.getCurrentCourseId();
        var queryString = document.location.search; 
        if (queryString === "?allcanvabadges") { //query string = ?allcanvabadges 
            var courseId = mmooc.api.getCurrentCourseId();
            mmooc.menu.showCourseMenu(courseId, 'Utmerkelser', 'Utmerkelser'); 
            //Should be refactored to use json api instead 
            var canvabadgesForCurrentCourse = '<iframe allowfullscreen="true" height="680" id="tool_content" mozallowfullscreen="true" name="tool_content" src="' + mmooc.settings.CanvaBadgeProtocolAndHost + '/badges/course/' + courseId + '" tabindex="0" webkitallowfullscreen="true" width="100%"></iframe>';
            $("#content").append(canvabadgesForCurrentCourse);
        } 
/*
        else if(!(mmooc.util.isTeacherOrAdmin()) && $(".self_enrollment_link").length) //Route to list of all courses if student and not enrolled in course.
        {
            window.location.href = "/search/all_courses";
        }
*/        
        else {
            mmooc.menu.showCourseMenu(courseId, mmooc.i18n.Course + 'forside', null);
            
            //20180822ETH Dersom man har valgt å bruke en wiki page som forside og man er lærer,
            //            så viser vi wiki page. Hvis ikke 
            if(mmooc.api.usesFrontPage())
            {
                if(!mmooc.util.isTeacherOrAdmin())
                {
                    var frontPage = $("#wiki_page_show");
                    if(frontPage.length)
                    {
                        frontPage.hide();
                    }
                    mmooc.coursePage.listModulesAndShowProgressBar();
                }
            }
            else //Hvis det ikke er wiki som forside så lister vi ut modulene på vanlig måte.
            {
                mmooc.coursePage.listModulesAndShowProgressBar();
            }            
            mmooc.announcements.printAnnouncementsUnreadCount();
            mmooc.coursePage.replaceUpcomingInSidebar();
            mmooc.coursePage.overrideUnregisterDialog();
            mmooc.coursePage.printDeadlinesForCourse();
        }
    });
    
    mmooc.routes.addRouteForPath(/\/search\/all_courses$/, function() {
        mmooc.enroll.printAllCoursesContainer();
        mmooc.enroll.printAllCourses();
    });

    mmooc.routes.addRouteForPath(/\/courses\/\d+\/settings$/, function() {
        mmooc.coursesettings.addSanityCheckButton();
        mmooc.coursesettings.addListSectionsButton();
        mmooc.coursesettings.addListUsersButton();
        mmooc.coursesettings.addListGroupsButton();
        mmooc.coursesettings.addListAssignmentsButton();
    });

    mmooc.routes.addRouteForPath(/\/profile\/settings$/, function() {
		var notificationButtonHTML = mmooc.util.renderTemplateWithData("notifications", {});
        mmooc.menu.showLeftMenu();
		document.getElementById('confirm_email_channel').insertAdjacentHTML('beforebegin', notificationButtonHTML);
    });

    mmooc.routes.addRouteForPath(/\/courses\/\d+\/announcements$/, function() {
        var courseId = mmooc.api.getCurrentCourseId();
        mmooc.menu.showCourseMenu(courseId, 'Kunngjøringer', mmooc.util.getPageTitleBeforeColon());
        mmooc.api.getModulesForCurrentCourse(function(modules) {
            mmooc.discussionTopics.printDiscussionUnreadCount(modules);
        });
        mmooc.announcements.printAnnouncementsUnreadCount();
        mmooc.announcements.setAnnouncementsListUnreadClass();
    });

    mmooc.routes.addRouteForPath(/\/courses\/\d+\/discussion_topics$/, function() {
        var courseId = mmooc.api.getCurrentCourseId();
        mmooc.menu.showCourseMenu(courseId, 'Diskusjoner', mmooc.util.getPageTitleBeforeColon());
        mmooc.discussionTopics.setDiscussionsListUnreadClass();
        mmooc.discussionTopics.insertSearchButton();
        mmooc.discussionTopics.hideUnreadCountInDiscussionList();
        mmooc.api.getModulesForCurrentCourse(function(modules) {
            mmooc.discussionTopics.printDiscussionUnreadCount(modules, "discussionslist");
        });
        mmooc.announcements.printAnnouncementsUnreadCount();        
    });
    mmooc.routes.addRouteForPath(/\/courses\/\d+\/external_tools/, function() {
        var courseId = mmooc.api.getCurrentCourseId();
        mmooc.menu.showCourseMenu(courseId, this.path, "Verktøy");
    });

    mmooc.routes.addRouteForPath(/\/courses\/\d+\/groups$/, function() {
        mmooc.groups.interceptLinksToGroupPage();
        var courseId = mmooc.api.getCurrentCourseId();
        mmooc.menu.showCourseMenu(courseId, 'Grupper', mmooc.util.getPageTitleBeforeColon());
        mmooc.api.getModulesForCurrentCourse(function(modules) {
            mmooc.discussionTopics.printDiscussionUnreadCount(modules);
        });
        mmooc.announcements.printAnnouncementsUnreadCount();
    });
    mmooc.routes.addRouteForPath(/\/courses\/\d+\/users$/, function() {
        var courseId = mmooc.api.getCurrentCourseId();
        mmooc.menu.showCourseMenu(courseId, '', mmooc.util.getPageTitleBeforeColon());
    });

    mmooc.routes.addRouteForPath(/\/groups\/\d+$/, function() {
        var courseId = mmooc.api.getCurrentCourseId();
        mmooc.menu.showCourseMenu(courseId, 'Grupper', mmooc.util.getPageTitleBeforeColon());
    });

    //Path for showing all dicussions, i.e. the discussion tab on the course front page.
    mmooc.routes.addRouteForPath(/\/groups\/\d+\/discussion_topics$/, function() {
        var courseId = mmooc.api.getCurrentCourseId();
        
        if (mmooc.util.isTeacherOrAdmin()) {
            mmooc.groups.interceptLinksToTeacherGroupPage();
        }
        
        if(null == courseId)
        {
            var groupId = mmooc.api.getCurrentGroupId();
            if(null != groupId)
            {
                mmooc.api.getGroup(groupId,function(group) {
                    var courseId = group.course_id;
                    mmooc.menu.showCourseMenu(courseId, 'Grupper', mmooc.util.getPageTitleAfterColon());
                    mmooc.groups.showGroupHeader(group.id, courseId);
                });
            }
        }
        else
        {
            mmooc.menu.showCourseMenu(courseId, 'Grupper', mmooc.util.getPageTitleAfterColon());
            mmooc.groups.showGroupHeader(groupId, courseId);
        }
    });

    //Path for showing a group discussion or creating a new discussion
    //20180821ETH Some functionality moved to new path below and to module_item_id path below
/*
    mmooc.routes.addRouteForPath([/\/groups\/\d+\/discussion_topics\/\d+$/, /\/groups\/\d+\/discussion_topics\/new$/], function() {
        mmooc.menu.showLeftMenu();
        mmooc.menu.listModuleItems();
        mmooc.menu.showDiscussionGroupMenu();
                
        if (!mmooc.util.isTeacherOrAdmin()) {
        	mmooc.menu.hideSectionTabsHeader();
        }
    });
    
    mmooc.routes.addRouteForPath([/\/groups\/\d+\/discussion_topics\/\d+$/], function() {
        mmooc.groups.moveSequenceLinks();
        if (!mmooc.util.isTeacherOrAdmin()) {
            mmooc.menu.hideRightMenu();
        }
    });
*/
    mmooc.routes.addRouteForPath([
    /\/groups\/\d+\/discussion_topics\/\d+$/,
    /\/groups\/\d+\/discussion_topics\/new$/], function() {
        mmooc.menu.showDiscussionGroupMenu();
        
        //20180911ETH Need to know if I got here from the discussion list or from the module
        //            navigation.
        if(!this.hasQueryString) {
            var courseId = mmooc.api.getCurrentCourseId();
        
            //If courseId was found, it is a group discussion created by a teacher.
            if(courseId) {
                mmooc.menu.showBackButton("/courses/" + courseId + "/discussion_topics", "Tilbake til diskusjoner");                
            }
            else {
                var groupId = mmooc.api.getCurrentGroupId();
                if(null != groupId)
                {
                    mmooc.api.getGroup(groupId,function(group) {
                        var courseId = group.course_id;
                        mmooc.menu.showBackButton("/groups/" + group.id + "/discussion_topics", "Tilbake til gruppeside");                
                    });
                }
            }
        }
        
        if (!mmooc.util.isTeacherOrAdmin()) 
        {
            mmooc.menu.hideRightMenu();
        	mmooc.menu.hideSectionTabsHeader();
        }
        else
        {
            mmooc.groups.interceptLinksToTeacherGroupPage();
        }
    });

    //Disse rutene gjelder når man går inn på en diskusjon fra diskusjonslisten eller når lærer har redigert en diskusjon.
    mmooc.routes.addRouteForPath([/\/courses\/\d+\/discussion_topics\/\d+/, /\/courses\/\d+\/discussion_topics\/new/], function() {
        // For discussion pages we only want the title to be "<discussion>" instead of "Discussion: <discussion>"
        var title = mmooc.util.getPageTitleAfterColon();

        var courseId = mmooc.api.getCurrentCourseId();
        if (!mmooc.util.isTeacherOrAdmin()) {
            mmooc.menu.hideRightMenu();
            var contentId = mmooc.api.getCurrentTypeAndContentId().contentId;
            mmooc.api.getDiscussionTopic(courseId, contentId, mmooc.discussionTopics.setDiscussionTopicPubDate);
        }

        // Announcements are some as type of discussions, must use a hack to determine if this is an announcement
        if (mmooc.api.currentPageIsAnnouncement()) {
            mmooc.menu.showCourseMenu(courseId, 'Kunngjøringer', title);
            mmooc.menu.showBackButton("/courses/" + courseId + "/announcements", "Tilbake til kunngjøringer");
            mmooc.announcements.addMarkAsReadButton();
        } else if (mmooc.api.getCurrentModuleItemId() == null) {
            // Only show course menu if this discussion is not a module item
            // Note detection if this is a module item is based on precense of query parameter
//            mmooc.menu.showCourseMenu(courseId, 'Diskusjoner', title);
            mmooc.menu.showBackButton("/courses/" + courseId + "/discussion_topics", "Tilbake til diskusjoner");
        }
    });

    mmooc.routes.addRouteForPathOrQueryString([
        /\/courses\/\d+\/assignments\/\d+/,
        /\/courses\/\d+\/pages\/.*$/, 
        /\/courses\/\d+\/quizzes\/\d+/], 
        /module_item_id=/, function() {
        mmooc.menu.showLeftMenu();
        mmooc.menu.listModuleItems();
        mmooc.pages.modifyMarkAsDoneButton();
        mmooc.pages.duplicateMarkedAsDoneButton();
        mmooc.util.callWhenElementIsPresent(".sikt-diploma-button", mmooc.greeting.enableGreetingButtonIfNecessary);
//20180911ETH showDiscussionGroupMenu is handled by group discussion path above.
//        mmooc.menu.showDiscussionGroupMenu();
        mmooc.groups.moveSequenceLinks();
                
        // mmooc.pages.changeTranslations();

        if(mmooc.util.isTeacherOrAdmin())
        {
            mmooc.pages.addGotoModuleButton();
            mmooc.pages.addStudentViewButton();
        }
    });


    
    // example route: /courses/54/assignments/369 - assignment which may be a peer review (hverandrevurdering)
    mmooc.routes.addRouteForPath(/\/courses\/\d+\/assignments\/\d+/, function() {
        mmooc.pages.redesignAssignmentPage();
        mmooc.util.setGlobalPeerReviewButtonState();
    });

    // Assignment submission which might be your own or someone else's: Peer review (hverandrevurdering)
    mmooc.routes.addRouteForPath(/\/courses\/\d+\/assignments\/\d+\/submissions\/\d+/, function() {
        mmooc.pages.redesignPeerReviewAndOwnSubmissionDetailsPage();
    });
    
    mmooc.routes.addRouteForPath(/\/courses\/\d+\/external_tools\/\d+$/, function() {
        function isBadgesafePage() {
            function extractPluginNumber(input) {
                 return input.substring(input.lastIndexOf('/') + 1);
            }

            var badgesafeUrl = mmooc.menu.extractBadgesLinkFromPage().url;

            return extractPluginNumber(badgesafeUrl) === extractPluginNumber(window.location.pathname);
        };

        if (isBadgesafePage()) {
            var courseId = mmooc.api.getCurrentCourseId();
            mmooc.menu.showCourseMenu(courseId, 'Utmerkelser', 'Utmerkelser');
        }
    });
    
    mmooc.routes.addRouteForPath(/\/courses\/\d+\/modules\/items\/\d+$/, function() { //Canva Badges uses this route for instance
        mmooc.menu.showLeftMenu();
        mmooc.menu.listModuleItems();
    });

    mmooc.routes.addRouteForPath([/\/pages/], function() {
        mmooc.pages.showBackLinkIfNecessary();
        mmooc.util.callWhenElementIsPresent(".sikt-diploma-button", mmooc.greeting.enableGreetingButtonIfNecessary);
    });

    mmooc.routes.addRouteForPath([/\/login\/canvas/], function() {
        mmooc.pages.replaceCreateAccountLink();
    });

    mmooc.routes.addRouteForQueryString(/enrolled=1/, function() {
        window.location.href = "/courses";
    });

/*    mmooc.routes.addRouteForPath(/enroll\/[0-9A-Z]+$/, function() {
        if(document.location.search == "")
        {
            mmooc.enroll.changeEnrollPage();
        }
    });
*/
    try {
        mmooc.menu.renderLeftHeaderMenu();
        mmooc.menu.showUserMenu();
    } catch (e) {
        console.log(e);
    }

    try {
        mmooc.routes.performHandlerForUrl(document.location);
    } catch (e) {
        console.log(e);
    }

    try {
		mmooc.nrk.init();
    } catch (e) {
        console.log(e);
    }

    try {
        mmooc.menu.injectGroupsPage();
        mmooc.groups.changeGroupListURLs(document.location.href);

        mmooc.pages.updateSidebarWhenMarkedAsDone();
        mmooc.pages.updateSidebarWhenContributedToDiscussion();
        mmooc.menu.alterHomeLink();
        mmooc.menu.alterCourseLink();
        
        mmooc.footer.addLicenseInFooter();

    } catch(e) {
      console.log(e);
    }

    

});

$(function () {
    // console.log("CANVABADGES: Loaded!");
    // NOTE: if pasting this code into another script, you'll need to manually change the
    // next line. Instead of assigning the value null, you need to assign the value of
    // the Canvabadges domain, i.e. "https://www.canvabadges.org". If you have a custom
    // domain configured then it'll be something like "https://www.canvabadges.org/_my_site"
    // instead.
    // var protocol_and_host = null; Overridden because of the comment above
    //Some small changes has been made to this script so it is displayed also on the about/<user id> page and /profile/settings page.
    //The original is here: https://www.canvabadges.org/canvas_profile_badges.js
    if (mmooc.settings.useCanvaBadge) { //Only run this code if it is set to be used in the settings
        var protocol_and_host = mmooc.settings.CanvaBadgeProtocolAndHost; //'https://canvabadges-beta-iktsenteret.bibsys.no' - this is where the Canva Badge certificate is stored.;
        var isProfilePage = false;
        var user_id;
        if (!protocol_and_host) {
            var $scripts = $("script");
            $("script").each(function () {
                var src = $(this).attr('src');
                if (src && src.match(/canvas_profile_badges/)) {
                    var splits = src.split(/\//);
                    protocol_and_host = splits[0] + "//" + splits[2];
                }
                var prefix = src && src.match(/\?path_prefix=\/(\w+)/);
                if (prefix && prefix[1]) {
                    protocol_and_host = protocol_and_host + "/" + prefix[1];
                }
            });
        }
        if (!protocol_and_host) {
            console.log("CANVABADGES: Couldn't find a valid protocol and host. Canvabadges will not appear on profile pages until this is fixed.");
        }
        var match = location.href.match(/\/(users|about)\/(\d+)$/);
        if (!match) {
            match = location.href.match(/\/profile\/settings$/);
            isProfilePage = true;
        }
        if (match && protocol_and_host) {
            console.log("CANVABADGES: This page shows badges! Loading...");
            if (isProfilePage) {
                user_id = mmooc.api.getUser().id;
            } else {
                user_id = match[2];
            }

            var domain = location.host;
            var url = protocol_and_host + "/api/v1/badges/public/" + user_id + "/" + encodeURIComponent(domain) + ".json";
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: url,
                success: function (data) {
                    console.log("CANVABADGES: Data retrieved!");
                    if (data.objects && data.objects.length > 0) {
                        console.log("CANVABADGES: Badges found! Adding to the page...");
                        var $box = $("<div/>", { style: 'margin-bottom: 20px;' });
                        $box.append("<h2 class='border border-b'>Badges</h2>");
                        for (idx in data.objects) {
                            var badge = data.objects[idx];
                            var $badge = $("<div/>", { style: 'float: left;' });
                            var link = protocol_and_host + "/badges/criteria/" + badge.config_id + "/" + badge.config_nonce + "?user=" + badge.nonce;
                            var $a = $("<a/>", { href: link });
                            $a.append($("<img/>", { src: badge.image_url, style: 'width: 72px; height: 72px; padding-right: 10px;' }));
                            $badge.append($a);
                            $box.append($badge);
                        }
                        $box.append($("<div/>", { style: 'clear: left' }));
                        $("#edit_profile_form,fieldset#courses,.more_user_information + div, #update_profile_form").after($box);
                    } else {
                        console.log("CANVABADGES: No badges found for the user: " + user_id + " at " + domain);
                    }
                },
                error: function (err) {
                    console.log("CANVABADGES: Badges failed to load, API error response");
                    console.log(err);
                },
                timeout: 5000
            });
        } else {
            console.log("CANVABADGES: This page doesn't show badges");
        }
    }
});