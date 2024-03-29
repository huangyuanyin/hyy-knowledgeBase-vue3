!(function (l) {
  'use strict'
  var e,
    r,
    t,
    n,
    o,
    m,
    i,
    d,
    a,
    u,
    c,
    v,
    s,
    g = function (e) {
      var r = e,
        t = function () {
          return r
        }
      return {
        get: t,
        set: function (e) {
          r = e
        },
        clone: function () {
          return g(t())
        }
      }
    },
    f = function (e) {
      return parseInt(e, 10)
    },
    p = function (e, r, t) {
      return {
        major: e,
        minor: r,
        patch: t
      }
    },
    h = function (e) {
      var r = /([0-9]+)\.([0-9]+)\.([0-9]+)(?:(\-.+)?)/.exec(e)
      return r ? p(f(r[1]), f(r[2]), f(r[3])) : p(0, 0, 0)
    },
    b = function (e, r) {
      var t = e - r
      return 0 === t ? 0 : 0 < t ? 1 : -1
    },
    y = function (e, r) {
      return (
        !!e &&
        -1 ===
          (function (e, r) {
            var t = b(e.major, r.major)
            if (0 !== t) return t
            var n = b(e.minor, r.minor)
            if (0 !== n) return n
            var o = b(e.patch, r.patch)
            return 0 !== o ? o : 0
          })(h([(t = e).majorVersion, t.minorVersion].join('.').split('.').slice(0, 3).join('.')), h(r))
      )
      var t
    },
    S = function () {},
    O = function (e) {
      return function () {
        return e
      }
    },
    N = O(!1),
    w = O(!0),
    T = function () {
      return x(0, 0)
    },
    x = function (e, r) {
      return {
        major: e,
        minor: r
      }
    },
    E = {
      nu: x,
      detect: function (e, r) {
        var t = String(r).toLowerCase()
        return 0 === e.length
          ? T()
          : (function (e, r) {
              var t = (function (e, r) {
                for (var t = 0; t < e.length; t++) {
                  var n = e[t]
                  if (n.test(r)) return n
                }
              })(e, r)
              if (!t)
                return {
                  major: 0,
                  minor: 0
                }
              var n = function (e) {
                return Number(r.replace(t, '$' + e))
              }
              return x(n(1), n(2))
            })(e, t)
      },
      unknown: T
    },
    k = 'Edge',
    A = 'Chrome',
    _ = 'Opera',
    D = 'Firefox',
    C = 'Safari',
    L = function (e, r) {
      return function () {
        return r === e
      }
    },
    P = function (e) {
      var r = e.current
      return {
        current: r,
        version: e.version,
        isEdge: L(k, r),
        isChrome: L(A, r),
        isIE: L('IE', r),
        isOpera: L(_, r),
        isFirefox: L(D, r),
        isSafari: L(C, r)
      }
    },
    R = {
      unknown: function () {
        return P({
          current: void 0,
          version: E.unknown()
        })
      },
      nu: P,
      edge: O(k),
      chrome: O(A),
      ie: O('IE'),
      opera: O(_),
      firefox: O(D),
      safari: O(C)
    },
    I = 'Windows',
    F = 'Android',
    M = 'Linux',
    B = 'Solaris',
    j = 'FreeBSD',
    U = function (e, r) {
      return function () {
        return r === e
      }
    },
    V = function (e) {
      var r = e.current
      return {
        current: r,
        version: e.version,
        isWindows: U(I, r),
        isiOS: U('iOS', r),
        isAndroid: U(F, r),
        isOSX: U('OSX', r),
        isLinux: U(M, r),
        isSolaris: U(B, r),
        isFreeBSD: U(j, r)
      }
    },
    q = {
      unknown: function () {
        return V({
          current: void 0,
          version: E.unknown()
        })
      },
      nu: V,
      windows: O(I),
      ios: O('iOS'),
      android: O(F),
      linux: O(M),
      osx: O('OSX'),
      solaris: O(B),
      freebsd: O(j)
    },
    z = function () {
      return X
    },
    X =
      ((e = function (e) {
        return e.isNone()
      }),
      (n = {
        fold: function (e, r) {
          return e()
        },
        is: N,
        isSome: N,
        isNone: w,
        getOr: (t = function (e) {
          return e
        }),
        getOrThunk: (r = function (e) {
          return e()
        }),
        getOrDie: function (e) {
          throw new Error(e || 'error: getOrDie called on none.')
        },
        getOrNull: O(null),
        getOrUndefined: O(void 0),
        or: t,
        orThunk: r,
        map: z,
        each: S,
        bind: z,
        exists: N,
        forall: w,
        filter: z,
        equals: e,
        equals_: e,
        toArray: function () {
          return []
        },
        toString: O('none()')
      }),
      Object.freeze && Object.freeze(n),
      n),
    H = function (t) {
      var e = O(t),
        r = function () {
          return o
        },
        n = function (e) {
          return e(t)
        },
        o = {
          fold: function (e, r) {
            return r(t)
          },
          is: function (e) {
            return t === e
          },
          isSome: w,
          isNone: N,
          getOr: e,
          getOrThunk: e,
          getOrDie: e,
          getOrNull: e,
          getOrUndefined: e,
          or: r,
          orThunk: r,
          map: function (e) {
            return H(e(t))
          },
          each: function (e) {
            e(t)
          },
          bind: n,
          exists: n,
          forall: n,
          filter: function (e) {
            return e(t) ? o : X
          },
          toArray: function () {
            return [t]
          },
          toString: function () {
            return 'some(' + t + ')'
          },
          equals: function (e) {
            return e.is(t)
          },
          equals_: function (e, r) {
            return e.fold(N, function (e) {
              return r(t, e)
            })
          }
        }
      return o
    },
    W = {
      some: H,
      none: z,
      from: function (e) {
        return null == e ? X : H(e)
      }
    },
    Y = function (r) {
      return function (e) {
        return (
          (function (e) {
            if (null === e) return 'null'
            var r = typeof e
            return 'object' === r && (Array.prototype.isPrototypeOf(e) || (e.constructor && 'Array' === e.constructor.name))
              ? 'array'
              : 'object' === r && (String.prototype.isPrototypeOf(e) || (e.constructor && 'String' === e.constructor.name))
              ? 'string'
              : r
          })(e) === r
        )
      }
    },
    G = Y('string'),
    $ = Y('array'),
    K = Y('boolean'),
    Z = Y('function'),
    J = Y('number'),
    Q = Array.prototype.slice,
    ee = Array.prototype.indexOf,
    re = Array.prototype.push,
    te = function (e, r) {
      return (t = e), (n = r), -1 < ee.call(t, n)
      var t, n
    },
    ne = function (e, r) {
      for (var t = 0, n = e.length; t < n; t++) {
        if (r(e[t], t)) return !0
      }
      return !1
    },
    oe = function (e, r) {
      for (var t = e.length, n = new Array(t), o = 0; o < t; o++) {
        var i = e[o]
        n[o] = r(i, o)
      }
      return n
    },
    ie = function (e, r) {
      for (var t = [], n = 0, o = e.length; n < o; n++) {
        var i = e[n]
        r(i, n) && t.push(i)
      }
      return t
    },
    ae = function (e, r) {
      for (var t = 0, n = e.length; t < n; t++) {
        var o = e[t]
        if (r(o, t)) return W.some(o)
      }
      return W.none()
    },
    ue = function (e, r) {
      return (function (e) {
        for (var r = [], t = 0, n = e.length; t < n; ++t) {
          if (!$(e[t])) throw new Error('Arr.flatten item ' + t + ' was not an array, input: ' + e)
          re.apply(r, e[t])
        }
        return r
      })(oe(e, r))
    },
    ce =
      (Z(Array.from) && Array.from,
      function (e, r) {
        var t = String(r).toLowerCase()
        return ae(e, function (e) {
          return e.search(t)
        })
      }),
    se = function (e, t) {
      return ce(e, t).map(function (e) {
        var r = E.detect(e.versionRegexes, t)
        return {
          current: e.name,
          version: r
        }
      })
    },
    fe = function (e, t) {
      return ce(e, t).map(function (e) {
        var r = E.detect(e.versionRegexes, t)
        return {
          current: e.name,
          version: r
        }
      })
    },
    le = function (e, r) {
      return -1 !== e.indexOf(r)
    },
    me = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/,
    de = function (r) {
      return function (e) {
        return le(e, r)
      }
    },
    ve = [
      {
        name: 'Edge',
        versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
        search: function (e) {
          return le(e, 'edge/') && le(e, 'chrome') && le(e, 'safari') && le(e, 'applewebkit')
        }
      },
      {
        name: 'Chrome',
        versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/, me],
        search: function (e) {
          return le(e, 'chrome') && !le(e, 'chromeframe')
        }
      },
      {
        name: 'IE',
        versionRegexes: [/.*?msie\ ?([0-9]+)\.([0-9]+).*/, /.*?rv:([0-9]+)\.([0-9]+).*/],
        search: function (e) {
          return le(e, 'msie') || le(e, 'trident')
        }
      },
      {
        name: 'Opera',
        versionRegexes: [me, /.*?opera\/([0-9]+)\.([0-9]+).*/],
        search: de('opera')
      },
      {
        name: 'Firefox',
        versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
        search: de('firefox')
      },
      {
        name: 'Safari',
        versionRegexes: [me, /.*?cpu os ([0-9]+)_([0-9]+).*/],
        search: function (e) {
          return (le(e, 'safari') || le(e, 'mobile/')) && le(e, 'applewebkit')
        }
      }
    ],
    ge = [
      {
        name: 'Windows',
        search: de('win'),
        versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
      },
      {
        name: 'iOS',
        search: function (e) {
          return le(e, 'iphone') || le(e, 'ipad')
        },
        versionRegexes: [/.*?version\/\ ?([0-9]+)\.([0-9]+).*/, /.*cpu os ([0-9]+)_([0-9]+).*/, /.*cpu iphone os ([0-9]+)_([0-9]+).*/]
      },
      {
        name: 'Android',
        search: de('android'),
        versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/]
      },
      {
        name: 'OSX',
        search: de('os x'),
        versionRegexes: [/.*?os\ x\ ?([0-9]+)_([0-9]+).*/]
      },
      {
        name: 'Linux',
        search: de('linux'),
        versionRegexes: []
      },
      {
        name: 'Solaris',
        search: de('sunos'),
        versionRegexes: []
      },
      {
        name: 'FreeBSD',
        search: de('freebsd'),
        versionRegexes: []
      }
    ],
    pe = {
      browsers: O(ve),
      oses: O(ge)
    },
    he = g(
      (function (e, r) {
        var t,
          n,
          o,
          i,
          a,
          u,
          c,
          s,
          f,
          l,
          m,
          d,
          v = pe.browsers(),
          g = pe.oses(),
          p = se(v, e).fold(R.unknown, R.nu),
          h = fe(g, e).fold(q.unknown, q.nu)
        return {
          browser: p,
          os: h,
          deviceType:
            ((n = p),
            (o = e),
            (i = r),
            (a = (t = h).isiOS() && !0 === /ipad/i.test(o)),
            (u = t.isiOS() && !a),
            (c = t.isiOS() || t.isAndroid()),
            (s = c || i('(pointer:coarse)')),
            (f = a || (!u && c && i('(min-device-width:768px)'))),
            (l = u || (c && !f)),
            (m = n.isSafari() && t.isiOS() && !1 === /safari/i.test(o)),
            (d = !l && !f && !m),
            {
              isiPad: O(a),
              isiPhone: O(u),
              isTablet: O(f),
              isPhone: O(l),
              isTouch: O(s),
              isAndroid: t.isAndroid,
              isiOS: t.isiOS,
              isWebView: O(m),
              isDesktop: O(d)
            })
        }
      })(l.navigator.userAgent, function (e) {
        return l.window.matchMedia(e).matches
      })
    ),
    be = function () {
      return he.get()
    },
    ye = Object.keys,
    Se = Object.hasOwnProperty,
    Oe = function (e, r) {
      for (var t = ye(e), n = 0, o = t.length; n < o; n++) {
        var i = t[n]
        r(e[i], i)
      }
    },
    Ne = function (e, n) {
      var o = {}
      return (
        Oe(e, function (e, r) {
          var t = n(e, r)
          o[t.k] = t.v
        }),
        o
      )
    },
    we = function (e) {
      return (
        (t = function (e) {
          return e
        }),
        (n = []),
        Oe(e, function (e, r) {
          n.push(t(e, r))
        }),
        n
      )
      var t, n
    },
    Te = function (e, r) {
      return xe(e, r) ? W.from(e[r]) : W.none()
    },
    xe = function (e, r) {
      return Se.call(e, r)
    },
    Ee =
      (l.Node.ATTRIBUTE_NODE, l.Node.CDATA_SECTION_NODE, l.Node.COMMENT_NODE, l.Node.DOCUMENT_NODE, l.Node.DOCUMENT_TYPE_NODE, l.Node.DOCUMENT_FRAGMENT_NODE, l.Node.ELEMENT_NODE),
    ke = l.Node.TEXT_NODE,
    Ae =
      (l.Node.PROCESSING_INSTRUCTION_NODE,
      l.Node.ENTITY_REFERENCE_NODE,
      l.Node.ENTITY_NODE,
      l.Node.NOTATION_NODE,
      void 0 !== l.window ? l.window : Function('return this;')(),
      (o = ke),
      function (e) {
        return e.dom().nodeType === o
      }),
    _e = function (e, r, t) {
      !(function (e, r, t) {
        if (!(G(t) || K(t) || J(t))) throw (l.console.error('Invalid call to Attr.set. Key ', r, ':: Value ', t, ':: Element ', e), new Error('Attribute value was not simple'))
        e.setAttribute(r, t + '')
      })(e.dom(), r, t)
    },
    De = function (e, r) {
      var t = e.dom().getAttribute(r)
      return null === t ? void 0 : t
    },
    Ce = function (e, r) {
      e.dom().removeAttribute(r)
    },
    Le = function (e, r) {
      var t = De(e, r)
      return void 0 === t || '' === t ? [] : t.split(' ')
    },
    Pe = function (e) {
      return void 0 !== e.dom().classList
    },
    Re = function (e) {
      return Le(e, 'class')
    },
    Ie = function (e, r) {
      return (o = r), (i = Le((t = e), (n = 'class')).concat([o])), _e(t, n, i.join(' ')), !0
      var t, n, o, i
    },
    Fe = function (e, r) {
      return (
        (o = r),
        0 <
        (i = ie(Le((t = e), (n = 'class')), function (e) {
          return e !== o
        })).length
          ? _e(t, n, i.join(' '))
          : Ce(t, n),
        !1
      )
      var t, n, o, i
    },
    Me = function (e, r) {
      var t
      Pe(e) ? e.dom().classList.remove(r) : Fe(e, r)
      0 === (Pe((t = e)) ? t.dom().classList : Re(t)).length && Ce(t, 'class')
    },
    Be = function (e) {
      if (null == e) throw new Error('Node cannot be null or undefined')
      return {
        dom: O(e)
      }
    },
    je = {
      fromHtml: function (e, r) {
        var t = (r || l.document).createElement('div')
        if (((t.innerHTML = e), !t.hasChildNodes() || 1 < t.childNodes.length))
          throw (l.console.error('HTML does not have a single root node', e), new Error('HTML must have a single root node'))
        return Be(t.childNodes[0])
      },
      fromTag: function (e, r) {
        var t = (r || l.document).createElement(e)
        return Be(t)
      },
      fromText: function (e, r) {
        var t = (r || l.document).createTextNode(e)
        return Be(t)
      },
      fromDom: Be,
      fromPoint: function (e, r, t) {
        var n = e.dom()
        return W.from(n.elementFromPoint(r, t)).map(Be)
      }
    },
    Ue = function (e, r) {
      e.fire('FormatPainterToggle', {
        state: r
      })
    }
  ;((i = m || (m = {})).Retrival = 'Retrieval'),
    (i.Application = 'Application'),
    ((a = d || (d = {})).ListSchema = 'ListSchema'),
    (a.SubstitutionSchema = 'SubstitionSchema'),
    ((c = u || (u = {})).InsertUnorderedList = 'InsertUnorderedList'),
    (c.InsertOrderedList = 'InsertOrderedList'),
    (c.InsertDefinitionList = 'InsertDefinitionList'),
    ((s = v || (v = {})).Table = 'Table'),
    (s.Unspecified = 'Unspecified')
  var Ve = function (e) {
      var r, t
      ;(r = je.fromDom(e.getBody())), (t = 'tox-cursor-format-painter'), Pe(r) ? r.dom().classList.add(t) : Ie(r, t)
    },
    qe = function (e, r) {
      var t
      ;(t = e), Me(je.fromDom(t.getBody()), 'tox-cursor-format-painter'), r.set(m.Retrival), Ue(e, !1)
    },
    ze = function (e, r) {
      r.get() === m.Application
        ? qe(e, r)
        : (function (r, t) {
            var n = be(),
              o = g(!1)
            Ve(r), t.set(m.Application), Ue(r, !0), r.execCommand('mceRetrieveFormats')
            var i = function () {
                r.execCommand('mcePaintFormats'), qe(r, t)
              },
              e = function () {
                t.get() === m.Application && i(), s()
              },
              a = function (e) {
                t.get() === m.Application && ('touchcancel' === e.type && n.os.isAndroid() ? r.once('contextmenu', i) : o.get() ? i() : r.once('selectionchange', i)), s()
              },
              u = function (e) {
                27 === e.keyCode && (qe(r, t), s())
              },
              c = function (e) {
                o.set('touchmove' === e.type)
              }
            r.on('click', e), r.on('touchstart touchmove', c), r.on('touchend touchcancel', a), r.on('keydown', u)
            var s = function () {
              r.off('click', e), r.off('touchstart touchmove', c), r.off('touchend touchcancel', a), r.off('keydown', u)
            }
          })(e, r)
    },
    Xe = function (e, r, t) {
      return 0 != (e.compareDocumentPosition(r) & t)
    },
    He = function (e, r) {
      return Xe(e, r, l.Node.DOCUMENT_POSITION_CONTAINED_BY)
    },
    We = Ee,
    Ye = function (e, r) {
      return e.dom() === r.dom()
    },
    Ge =
      (be().browser.isIE(),
      function (e, r) {
        var t = e.dom()
        if (t.nodeType !== We) return !1
        var n = t
        if (void 0 !== n.matches) return n.matches(r)
        if (void 0 !== n.msMatchesSelector) return n.msMatchesSelector(r)
        if (void 0 !== n.webkitMatchesSelector) return n.webkitMatchesSelector(r)
        if (void 0 !== n.mozMatchesSelector) return n.mozMatchesSelector(r)
        throw new Error('Browser lacks native selectors')
      })
  var $e = function (e, r, t) {
      for (var n = e.dom(), o = Z(t) ? t : O(!1); n.parentNode; ) {
        n = n.parentNode
        var i = je.fromDom(n)
        if (r(i)) return W.some(i)
        if (o(i)) break
      }
      return W.none()
    },
    Ke = function (e, r, t) {
      var n, o, i, a
      return (
        (n = $e),
        (a = t),
        (function (e, r) {
          return r(e)
        })((o = e), (i = r))
          ? W.some(o)
          : Z(a) && a(o)
          ? W.none()
          : n(o, i, a)
      )
    },
    Ze = {
      formatpainter_checklist: {
        selector: 'ul',
        classes: 'tox-checklist'
      },
      formatpainter_liststyletype: {
        selector: 'ul,ol',
        styles: {
          listStyleType: '%value'
        }
      },
      formatpainter_borderstyle: {
        selector: 'td,th',
        styles: {
          borderTopStyle: '%valueTop',
          borderRightStyle: '%valueRight',
          borderBottomStyle: '%valueBottom',
          borderLeftStyle: '%valueLeft'
        },
        remove_similar: !0
      },
      formatpainter_bordercolor: {
        selector: 'td,th',
        styles: {
          borderTopColor: '%valueTop',
          borderRightColor: '%valueRight',
          borderBottomColor: '%valueBottom',
          borderLeftColor: '%valueLeft'
        },
        remove_similar: !0
      },
      formatpainter_backgroundcolor: {
        selector: 'td,th',
        styles: {
          backgroundColor: '%value'
        },
        remove_similar: !0
      },
      formatpainter_removeformat: [
        {
          selector: 'b,strong,em,i,font,u,strike,sub,sup,dfn,code,samp,kbd,var,cite,mark,q,del,ins',
          remove: 'all',
          split: !0,
          expand: !1,
          block_expand: !0,
          deep: !0
        },
        {
          selector: 'span',
          attributes: ['style', 'class'],
          remove: 'empty',
          split: !0,
          expand: !1,
          deep: !0
        },
        {
          selector: '*:not(tr,td,th,table)',
          attributes: ['style', 'class'],
          split: !1,
          expand: !1,
          deep: !0
        }
      ],
      formatpainter_legacy_font: {
        inline: 'font',
        attributes: {
          size: '%value'
        }
      }
    },
    Je = function () {
      for (var e = 0, r = 0, t = arguments.length; r < t; r++) e += arguments[r].length
      var n = Array(e),
        o = 0
      for (r = 0; r < t; r++) for (var i = arguments[r], a = 0, u = i.length; a < u; a++, o++) n[o] = i[a]
      return n
    },
    Qe = function (i, e) {
      return Te(e, 'selector').exists(function (e) {
        var r = i.getBody(),
          t = i.selection.getStart(),
          n = i.dom.getParents(t, O(!0), r),
          o = i.selection.getSelectedBlocks()
        return i.dom.is(Je(n, o), e)
      })
    },
    er = function (n, e) {
      return ne(n.formatter.get(e), function (e) {
        return (r = n), xe((t = e), 'inline') && !Qe(r, t)
        var r, t
      })
    },
    rr = function (n, e, r) {
      return ne(e.get(r), function (e) {
        return (r = n), xe((t = e), 'block') || Qe(r, t)
        var r, t
      })
    },
    tr = function (e) {
      return 1 < e.length && '%' === e.charAt(0)
    },
    nr = function (e, r) {
      return ne(e.formatter.get(r), function (e) {
        return (
          (t = Te((r = e), 'styles').exists(function (e) {
            return ne(we(e), tr)
          })),
          (n = Te(r, 'attributes').exists(function (e) {
            return ne(we(e), tr)
          })),
          t || n
        )
        var r, t, n
      })
    },
    or = function (e) {
      return Ge(e, 'OL,UL,DL')
    },
    ir = function (e) {
      return Ge(e, 'LI,DT,DD')
    },
    ar = function (e, r, t) {
      var n,
        o = e.formatter,
        i = er(e, t.formatName),
        a = rr(e, o, t.formatName),
        u = ((n = t.formatName), te(['formatpainter_borderstyle', 'formatpainter_bordercolor', 'formatpainter_backgroundcolor'], n))
      ;((r.table && u) || (r.inline && i) || (r.block && a && !u)) && o.apply(t.formatName, t.substitutedVariables)
    },
    ur = function (e, r) {
      var t,
        n,
        o,
        i = function (e) {
          return Ye(e, r)
        }
      return ((t = Ke(je.fromDom(e.getStart()), or, i)),
      (n = Ke(je.fromDom(e.getEnd()), or, i)),
      (o = function (e, r) {
        return Ye(e, r)
      }),
      t.isSome() && n.isSome() ? W.some(o(t.getOrDie(), n.getOrDie())) : W.none()).getOr(!1)
    },
    cr = function (e) {
      var r = e.selection,
        t = r.getRng(),
        n = je.fromDom(e.getBody()),
        o = ie(e.selection.getSelectedBlocks().map(je.fromDom), ir),
        i = t.collapsed && o.length,
        a = o.length && !ur(r, n)
      return 1 < o.length || i || a
    },
    sr = function (n, e) {
      var r, t
      ;(r = n),
        (t = e.context),
        r.formatter.remove('formatpainter_removeformat'),
        t === v.Table &&
          (function (e, r) {
            for (var t = 0, n = e.length; t < n; t++) r(e[t], t)
          })(['formatpainter_borderstyle', 'formatpainter_bordercolor', 'formatpainter_backgroundcolor'], function (e) {
            r.formatter.remove(e)
          }),
        cr(r) && r.execCommand('RemoveList')
      var o,
        i,
        a,
        u,
        c,
        s,
        f =
          ((a = (o = n).selection.getStart()),
          (u = o.selection.getRng().collapsed),
          (c = 0 < o.dom.select('td[data-mce-selected]').length),
          (s = !!o.dom.getParent(a, 'TABLE')),
          {
            inline: !0,
            table: (u && s) || c,
            block: u || ((i = o.selection), 1 < i.getSelectedBlocks().length) || c
          })
      e.schemas.forEach(function (e) {
        switch (e.kind) {
          case d.ListSchema:
            ;(r = n), (t = e), f.block && r.execCommand(t.command)
            break
          case d.SubstitutionSchema:
            ar(n, f, e)
        }
        var r, t
      })
    },
    fr = function (e) {
      return Pe(e)
        ? (function (e) {
            for (var r = e.dom().classList, t = new Array(r.length), n = 0; n < r.length; n++) t[n] = r.item(n)
            return t
          })(e)
        : Re(e)
    },
    lr = function (e, r) {
      var t,
        n,
        o = e.dom(),
        i = l.window.getComputedStyle(o).getPropertyValue(r),
        a = '' !== i || (null != (n = Ae((t = e)) ? t.dom().parentNode : t.dom()) && n.ownerDocument.body.contains(n)) ? i : mr(o, r)
      return null === a ? void 0 : a
    },
    mr = function (e, r) {
      return void 0 !== (t = e).style && Z(t.style.getPropertyValue) ? e.style.getPropertyValue(r) : ''
      var t
    },
    dr = function () {
      return (dr =
        Object.assign ||
        function (e) {
          for (var r, t = 1, n = arguments.length; t < n; t++) for (var o in (r = arguments[t])) Object.prototype.hasOwnProperty.call(r, o) && (e[o] = r[o])
          return e
        }).apply(this, arguments)
    },
    vr = function () {
      for (var e = 0, r = 0, t = arguments.length; r < t; r++) e += arguments[r].length
      var n = Array(e),
        o = 0
      for (r = 0; r < t; r++) for (var i = arguments[r], a = 0, u = i.length; a < u; a++, o++) n[o] = i[a]
      return n
    },
    gr = function (o, e) {
      return Ne(e, function (e, r) {
        return {
          k: e.slice(1, e.length),
          v:
            ((t = o),
            (n = r),
            'class' === n
              ? fr(t)
                  .filter(function (e) {
                    return !/^(mce-.*)/.test(e)
                  })
                  .join(' ')
              : De(t, n))
        }
        var t, n
      })
    },
    pr = function (e) {
      return ((r = e),
      (t = function (e) {
        return 1 < (r = e).length && '%' === r.charAt(0)
        var r
      }),
      (n = {}),
      (o = {}),
      Oe(r, function (e, r) {
        ;(t(e, r) ? n : o)[r] = e
      }),
      {
        t: n,
        f: o
      }).t
      var r, t, n, o
    },
    hr = function (e, t) {
      var r = Te(e, 'styles').map(function (e) {
          return (
            (n = t),
            (r = pr(e)),
            Ne(r, function (e, r) {
              return {
                k: e.slice(1, e.length),
                v: lr(
                  n,
                  ((t = r),
                  t.replace(/([A-Z])/g, function (e) {
                    return '-' + e[0].toLowerCase()
                  }))
                )
              }
              var t
            })
          )
          var n, r
        }),
        n = Te(e, 'attributes').map(function (e) {
          return gr(t, pr(e))
        }),
        o = dr(dr({}, r.getOr({})), n.getOr({}))
      return we(o).every(function (e) {
        return '' !== e
      })
        ? W.some(o)
        : W.none()
    },
    br = function (e, r, t) {
      return ((n = e.get(r)), 0 === n.length ? W.none() : W.some(n[0]))
        .bind(function (e) {
          return hr(e, t)
        })
        .map(function (e) {
          return {
            kind: d.SubstitutionSchema,
            formatName: r,
            substitutedVariables: e
          }
        })
      var n
    },
    yr = function (t, n) {
      return ((e = t),
      (r = e.getParam('formatpainter_blacklisted_formats', 'link,address,removeformat,formatpainter_removeformat', 'string').split(/[ ,]/)),
      ye(e.formatter.get()).filter(function (e) {
        return !te(r, e)
      })).filter(function (e) {
        var r = nr(t, e)
        return t.formatter.matchNode(n.dom(), e, {}, r)
      })
      var e, r
    },
    Sr = function (e) {
      return ((r = e),
      ae(we(u), function (e) {
        return r.queryCommandState(e)
      })).map(function (e) {
        return {
          kind: d.ListSchema,
          command: e
        }
      })
      var r
    },
    Or = function (e) {
      var r,
        t,
        n,
        o,
        i,
        a = e.dom,
        u = e.selection.getStart()
      return {
        schemas: vr(
          Sr(e).toArray(),
          ((n = e),
          (o = u),
          (i = n.dom.getParents(o, O(!0))),
          ue(oe(i, je.fromDom), function (r) {
            return ue(yr(n, r), function (e) {
              return br(n.formatter, e, r).toArray()
            })
          }))
        ),
        context: ((r = a), (t = u), r.getParent(t, 'TABLE') ? v.Table : v.Unspecified)
      }
    },
    Nr = function (e) {
      if (y(tinymce, '4.9.0')) return l.window.console.error('The format painter plugin requires at least version 4.9.0 of TinyMCE.'), {}
      var t,
        r,
        n,
        o,
        i,
        a,
        u,
        c,
        s = g(m.Retrival),
        f = g({
          schemas: [],
          context: v.Unspecified
        })
      return (
        (t = e).on('PreInit', function () {
          Oe(Ze, function (e, r) {
            t.formatter.get(r) || t.formatter.register(r, e)
          })
        }),
        (n = s),
        (o = f),
        (r = e).addCommand('mceToggleFormatPainter', function () {
          ze(r, n)
        }),
        r.addCommand('mcePaintFormats', function () {
          r.undoManager.transact(function () {
            sr(r, o.get())
          })
        }),
        r.addCommand('mceRetrieveFormats', function () {
          o.set(Or(r))
        }),
        (i = e).ui
          ? (u = i).ui.registry.addToggleButton('formatpainter', {
              active: !1,
              icon: 'format-painter',
              tooltip: '格式刷',
              onAction: function () {
                return u.execCommand('mceToggleFormatPainter')
              },
              onSetup: function (r) {
                var e = function (e) {
                  r.setActive(e.state)
                }
                return (
                  u.on('FormatPainterToggle', e),
                  function () {
                    return u.off('FormatPainterToggle', e)
                  }
                )
              }
            })
          : (a = i).addButton('formatpainter', {
              active: !1,
              icon: 'format-painter',
              tooltip: 'Format Painter',
              cmd: 'mceToggleFormatPainter',
              onPostRender: function (r) {
                a.on('FormatPainterToggle', function (e) {
                  r.control.active(e.state)
                })
              }
            }),
        (c = e).addShortcut('Meta+alt+C', '', function () {
          c.execCommand('mceRetrieveFormats')
        }),
        c.addShortcut('Meta+alt+V', '', function () {
          c.execCommand('mcePaintFormats')
        }),
        {}
      )
    }
  tinymce.PluginManager.add('formatpainter', Nr)
})(window)
