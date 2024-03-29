/*!
 *  @plugin @tinymce-plugin/tp-importword
 *  @version 0.0.3-beta.4 (2022-5-28)
 *  @description 导入word文档
 *  @copyright (2022) Li Hailong . All rights reserved. https://github.com/tinymce-plugin/tp-importword
 */

var Wr = Object.defineProperty,
  Hr = Object.defineProperties
var Zr = Object.getOwnPropertyDescriptors
var St = Object.getOwnPropertySymbols
var $r = Object.prototype.hasOwnProperty,
  Vr = Object.prototype.propertyIsEnumerable
var Qe = (ge, ae, ve) => (ae in ge ? Wr(ge, ae, { enumerable: !0, configurable: !0, writable: !0, value: ve }) : (ge[ae] = ve)),
  Ce = (ge, ae) => {
    for (var ve in ae || (ae = {})) $r.call(ae, ve) && Qe(ge, ve, ae[ve])
    if (St) for (var ve of St(ae)) Vr.call(ae, ve) && Qe(ge, ve, ae[ve])
    return ge
  },
  Pe = (ge, ae) => Hr(ge, Zr(ae))
var X = (ge, ae, ve) => (Qe(ge, typeof ae != 'symbol' ? ae + '' : ae, ve), ve)

var tpDocsToHtml = (function (ge) {
  'use strict'
  var ae = ((f) => (
    (f.OfficeDocument = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument'),
    (f.FontTable = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable'),
    (f.Image = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image'),
    (f.Numbering = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering'),
    (f.Styles = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles'),
    (f.StylesWithEffects = 'http://schemas.microsoft.com/office/2007/relationships/stylesWithEffects'),
    (f.Theme = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme'),
    (f.Settings = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings'),
    (f.WebSettings = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings'),
    (f.Hyperlink = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink'),
    (f.Footnotes = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes'),
    (f.Endnotes = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes'),
    (f.Footer = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer'),
    (f.Header = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/header'),
    (f.ExtendedProperties = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties'),
    (f.CoreProperties = 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties'),
    (f.CustomProperties = 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/custom-properties'),
    f
  ))(ae || {})
  function ve(f, t) {
    return t.elements(f).map((e) => ({ id: t.attr(e, 'Id'), type: t.attr(e, 'Type'), target: t.attr(e, 'Target'), targetMode: t.attr(e, 'TargetMode') }))
  }
  const et = {
      wordml: 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      drawingml: 'http://schemas.openxmlformats.org/drawingml/2006/main',
      picture: 'http://schemas.openxmlformats.org/drawingml/2006/picture',
      compatibility: 'http://schemas.openxmlformats.org/markup-compatibility/2006'
    },
    pe = {
      Dxa: { mul: 0.05, unit: 'pt' },
      Emu: { mul: 1 / 12700, unit: 'pt' },
      FontSize: { mul: 0.5, unit: 'pt' },
      Border: { mul: 0.125, unit: 'pt' },
      Point: { mul: 1, unit: 'pt' },
      Percent: { mul: 0.02, unit: '%' },
      LineHeight: { mul: 1 / 240, unit: null }
    }
  function tt(f, t = pe.Dxa) {
    var e
    return f == null || /.+(p[xt]|[%])$/.test(f) ? f : `${(parseInt(f) * t.mul).toFixed(2)}${(e = t.unit) != null ? e : ''}`
  }
  function Ct(f, t = !1) {
    switch (f) {
      case '1':
        return !0
      case '0':
        return !1
      case 'on':
        return !0
      case 'off':
        return !1
      case 'true':
        return !0
      case 'false':
        return !1
      default:
        return t
    }
  }
  function rt(f, t, e) {
    if (f.namespaceURI != et.wordml) return !1
    switch (f.localName) {
      case 'color':
        t.color = e.attr(f, 'val')
        break
      case 'sz':
        t.fontSize = e.lengthAttr(f, 'val', pe.FontSize)
        break
      default:
        return !1
    }
    return !0
  }
  function At(f, t = !1) {
    t && (f = f.replace(/<[?].*[?]>/, ''))
    const e = new DOMParser().parseFromString(f, 'application/xml'),
      r = Pt(e)
    if (r) throw new Error(r)
    return e
  }
  function Pt(f) {
    var t
    return (t = f.getElementsByTagName('parsererror')[0]) == null ? void 0 : t.textContent
  }
  function Et(f) {
    return new XMLSerializer().serializeToString(f)
  }
  class nt {
    elements(t, e = null) {
      const r = []
      for (let a = 0, n = t.childNodes.length; a < n; a++) {
        let u = t.childNodes.item(a)
        u.nodeType == 1 && (e == null || u.localName == e) && r.push(u)
      }
      return r
    }
    element(t, e) {
      for (let r = 0, a = t.childNodes.length; r < a; r++) {
        let n = t.childNodes.item(r)
        if (n.nodeType == 1 && n.localName == e) return n
      }
      return null
    }
    elementAttr(t, e, r) {
      var a = this.element(t, e)
      return a ? this.attr(a, r) : void 0
    }
    attr(t, e) {
      for (let r = 0, a = t.attributes.length; r < a; r++) {
        let n = t.attributes.item(r)
        if (n.localName == e) return n.value
      }
      return null
    }
    intAttr(t, e, r = null) {
      var a = this.attr(t, e)
      return a ? parseInt(a) : r
    }
    hexAttr(t, e, r = null) {
      var a = this.attr(t, e)
      return a ? parseInt(a, 16) : r
    }
    floatAttr(t, e, r = null) {
      var a = this.attr(t, e)
      return a ? parseFloat(a) : r
    }
    boolAttr(t, e, r = null) {
      return Ct(this.attr(t, e), r)
    }
    lengthAttr(t, e, r = pe.Dxa) {
      return tt(this.attr(t, e), r)
    }
  }
  const z = new nt()
  class _e {
    constructor(t, e) {
      X(this, '_xmlDocument')
      X(this, 'rels')
      ;(this._package = t), (this.path = e)
    }
    load() {
      return Promise.all([
        this._package.loadRelationships(this.path).then((t) => {
          this.rels = t
        }),
        this._package.load(this.path).then((t) => {
          const e = this._package.parseXmlDocument(t)
          this._package.options.keepOrigin && (this._xmlDocument = e), this.parseXml(e.firstElementChild)
        })
      ])
    }
    save() {
      this._package.update(this.path, Et(this._xmlDocument))
    }
    parseXml(t) {}
  }
  const xt = { embedRegular: 'regular', embedBold: 'bold', embedItalic: 'italic', embedBoldItalic: 'boldItalic' }
  function Bt(f, t) {
    return t.elements(f).map((e) => zt(e, t))
  }
  function zt(f, t) {
    let e = { name: t.attr(f, 'name'), embedFontRefs: [] }
    for (let r of t.elements(f))
      switch (r.localName) {
        case 'family':
          e.family = t.attr(r, 'val')
          break
        case 'altName':
          e.altName = t.attr(r, 'val')
          break
        case 'embedRegular':
        case 'embedBold':
        case 'embedItalic':
        case 'embedBoldItalic':
          e.embedFontRefs.push(Nt(r, t))
          break
      }
    return e
  }
  function Nt(f, t) {
    return { id: t.attr(f, 'id'), key: t.attr(f, 'fontKey'), type: xt[f.localName] }
  }
  class Tt extends _e {
    constructor() {
      super(...arguments)
      X(this, 'fonts')
    }
    parseXml(t) {
      this.fonts = Bt(t, this._package.xmlParser)
    }
  }
  var at = typeof globalThis != 'undefined' ? globalThis : typeof window != 'undefined' ? window : typeof global != 'undefined' ? global : typeof self != 'undefined' ? self : {}
  function Re(f) {
    throw new Error(
      'Could not dynamically require "' +
        f +
        '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.'
    )
  }
  var st = { exports: {} }
  /*!

    JSZip v3.9.1 - A JavaScript class for generating and reading zip files
    <http://stuartk.com/jszip>

    (c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
    Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

    JSZip uses the library pako released under the MIT license :
    https://github.com/nodeca/pako/blob/master/LICENSE
    */ ;(function (f, t) {
    ;(function (e) {
      f.exports = e()
    })(function () {
      return (function e(r, a, n) {
        function u(d, p) {
          if (!a[d]) {
            if (!r[d]) {
              var m = typeof Re == 'function' && Re
              if (!p && m) return m(d, !0)
              if (l) return l(d, !0)
              var _ = new Error("Cannot find module '" + d + "'")
              throw ((_.code = 'MODULE_NOT_FOUND'), _)
            }
            var c = (a[d] = { exports: {} })
            r[d][0].call(
              c.exports,
              function (y) {
                var w = r[d][1][y]
                return u(w || y)
              },
              c,
              c.exports,
              e,
              r,
              a,
              n
            )
          }
          return a[d].exports
        }
        for (var l = typeof Re == 'function' && Re, i = 0; i < n.length; i++) u(n[i])
        return u
      })(
        {
          1: [
            function (e, r, a) {
              var n = e('./utils'),
                u = e('./support'),
                l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
              ;(a.encode = function (i) {
                for (var d, p, m, _, c, y, w, h = [], g = 0, b = i.length, C = b, N = n.getTypeOf(i) !== 'string'; g < i.length; )
                  (C = b - g),
                    (m = N
                      ? ((d = i[g++]), (p = g < b ? i[g++] : 0), g < b ? i[g++] : 0)
                      : ((d = i.charCodeAt(g++)), (p = g < b ? i.charCodeAt(g++) : 0), g < b ? i.charCodeAt(g++) : 0)),
                    (_ = d >> 2),
                    (c = ((3 & d) << 4) | (p >> 4)),
                    (y = 1 < C ? ((15 & p) << 2) | (m >> 6) : 64),
                    (w = 2 < C ? 63 & m : 64),
                    h.push(l.charAt(_) + l.charAt(c) + l.charAt(y) + l.charAt(w))
                return h.join('')
              }),
                (a.decode = function (i) {
                  var d,
                    p,
                    m,
                    _,
                    c,
                    y,
                    w = 0,
                    h = 0,
                    g = 'data:'
                  if (i.substr(0, g.length) === g) throw new Error('Invalid base64 input, it looks like a data url.')
                  var b,
                    C = (3 * (i = i.replace(/[^A-Za-z0-9\+\/\=]/g, '')).length) / 4
                  if ((i.charAt(i.length - 1) === l.charAt(64) && C--, i.charAt(i.length - 2) === l.charAt(64) && C--, C % 1 != 0))
                    throw new Error('Invalid base64 input, bad content length.')
                  for (b = u.uint8array ? new Uint8Array(0 | C) : new Array(0 | C); w < i.length; )
                    (d = (l.indexOf(i.charAt(w++)) << 2) | ((_ = l.indexOf(i.charAt(w++))) >> 4)),
                      (p = ((15 & _) << 4) | ((c = l.indexOf(i.charAt(w++))) >> 2)),
                      (m = ((3 & c) << 6) | (y = l.indexOf(i.charAt(w++)))),
                      (b[h++] = d),
                      c !== 64 && (b[h++] = p),
                      y !== 64 && (b[h++] = m)
                  return b
                })
            },
            { './support': 30, './utils': 32 }
          ],
          2: [
            function (e, r, a) {
              var n = e('./external'),
                u = e('./stream/DataWorker'),
                l = e('./stream/Crc32Probe'),
                i = e('./stream/DataLengthProbe')
              function d(p, m, _, c, y) {
                ;(this.compressedSize = p), (this.uncompressedSize = m), (this.crc32 = _), (this.compression = c), (this.compressedContent = y)
              }
              ;(d.prototype = {
                getContentWorker: function () {
                  var p = new u(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new i('data_length')),
                    m = this
                  return (
                    p.on('end', function () {
                      if (this.streamInfo.data_length !== m.uncompressedSize) throw new Error('Bug : uncompressed data size mismatch')
                    }),
                    p
                  )
                },
                getCompressedWorker: function () {
                  return new u(n.Promise.resolve(this.compressedContent))
                    .withStreamInfo('compressedSize', this.compressedSize)
                    .withStreamInfo('uncompressedSize', this.uncompressedSize)
                    .withStreamInfo('crc32', this.crc32)
                    .withStreamInfo('compression', this.compression)
                }
              }),
                (d.createWorkerFrom = function (p, m, _) {
                  return p.pipe(new l()).pipe(new i('uncompressedSize')).pipe(m.compressWorker(_)).pipe(new i('compressedSize')).withStreamInfo('compression', m)
                }),
                (r.exports = d)
            },
            { './external': 6, './stream/Crc32Probe': 25, './stream/DataLengthProbe': 26, './stream/DataWorker': 27 }
          ],
          3: [
            function (e, r, a) {
              var n = e('./stream/GenericWorker')
              ;(a.STORE = {
                magic: '\0\0',
                compressWorker: function (u) {
                  return new n('STORE compression')
                },
                uncompressWorker: function () {
                  return new n('STORE decompression')
                }
              }),
                (a.DEFLATE = e('./flate'))
            },
            { './flate': 7, './stream/GenericWorker': 28 }
          ],
          4: [
            function (e, r, a) {
              var n = e('./utils'),
                u = (function () {
                  for (var l, i = [], d = 0; d < 256; d++) {
                    l = d
                    for (var p = 0; p < 8; p++) l = 1 & l ? 3988292384 ^ (l >>> 1) : l >>> 1
                    i[d] = l
                  }
                  return i
                })()
              r.exports = function (l, i) {
                return l !== void 0 && l.length
                  ? n.getTypeOf(l) !== 'string'
                    ? (function (d, p, m, _) {
                        var c = u,
                          y = _ + m
                        d ^= -1
                        for (var w = _; w < y; w++) d = (d >>> 8) ^ c[255 & (d ^ p[w])]
                        return -1 ^ d
                      })(0 | i, l, l.length, 0)
                    : (function (d, p, m, _) {
                        var c = u,
                          y = _ + m
                        d ^= -1
                        for (var w = _; w < y; w++) d = (d >>> 8) ^ c[255 & (d ^ p.charCodeAt(w))]
                        return -1 ^ d
                      })(0 | i, l, l.length, 0)
                  : 0
              }
            },
            { './utils': 32 }
          ],
          5: [
            function (e, r, a) {
              ;(a.base64 = !1),
                (a.binary = !1),
                (a.dir = !1),
                (a.createFolders = !0),
                (a.date = null),
                (a.compression = null),
                (a.compressionOptions = null),
                (a.comment = null),
                (a.unixPermissions = null),
                (a.dosPermissions = null)
            },
            {}
          ],
          6: [
            function (e, r, a) {
              var n = null
              ;(n = typeof Promise != 'undefined' ? Promise : e('lie')), (r.exports = { Promise: n })
            },
            { lie: 37 }
          ],
          7: [
            function (e, r, a) {
              var n = typeof Uint8Array != 'undefined' && typeof Uint16Array != 'undefined' && typeof Uint32Array != 'undefined',
                u = e('pako'),
                l = e('./utils'),
                i = e('./stream/GenericWorker'),
                d = n ? 'uint8array' : 'array'
              function p(m, _) {
                i.call(this, 'FlateWorker/' + m), (this._pako = null), (this._pakoAction = m), (this._pakoOptions = _), (this.meta = {})
              }
              ;(a.magic = '\b\0'),
                l.inherits(p, i),
                (p.prototype.processChunk = function (m) {
                  ;(this.meta = m.meta), this._pako === null && this._createPako(), this._pako.push(l.transformTo(d, m.data), !1)
                }),
                (p.prototype.flush = function () {
                  i.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0)
                }),
                (p.prototype.cleanUp = function () {
                  i.prototype.cleanUp.call(this), (this._pako = null)
                }),
                (p.prototype._createPako = function () {
                  this._pako = new u[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 })
                  var m = this
                  this._pako.onData = function (_) {
                    m.push({ data: _, meta: m.meta })
                  }
                }),
                (a.compressWorker = function (m) {
                  return new p('Deflate', m)
                }),
                (a.uncompressWorker = function () {
                  return new p('Inflate', {})
                })
            },
            { './stream/GenericWorker': 28, './utils': 32, pako: 38 }
          ],
          8: [
            function (e, r, a) {
              function n(c, y) {
                var w,
                  h = ''
                for (w = 0; w < y; w++) (h += String.fromCharCode(255 & c)), (c >>>= 8)
                return h
              }
              function u(c, y, w, h, g, b) {
                var C,
                  N,
                  P = c.file,
                  U = c.compression,
                  I = b !== d.utf8encode,
                  H = l.transformTo('string', b(P.name)),
                  T = l.transformTo('string', d.utf8encode(P.name)),
                  V = P.comment,
                  ee = l.transformTo('string', b(V)),
                  S = l.transformTo('string', d.utf8encode(V)),
                  R = T.length !== P.name.length,
                  o = S.length !== V.length,
                  D = '',
                  re = '',
                  M = '',
                  ne = P.dir,
                  W = P.date,
                  te = { crc32: 0, compressedSize: 0, uncompressedSize: 0 }
                ;(y && !w) || ((te.crc32 = c.crc32), (te.compressedSize = c.compressedSize), (te.uncompressedSize = c.uncompressedSize))
                var B = 0
                y && (B |= 8), I || (!R && !o) || (B |= 2048)
                var x = 0,
                  Q = 0
                ne && (x |= 16),
                  g === 'UNIX'
                    ? ((Q = 798),
                      (x |= (function (G, he) {
                        var be = G
                        return G || (be = he ? 16893 : 33204), (65535 & be) << 16
                      })(P.unixPermissions, ne)))
                    : ((Q = 20),
                      (x |= (function (G) {
                        return 63 & (G || 0)
                      })(P.dosPermissions))),
                  (C = W.getUTCHours()),
                  (C <<= 6),
                  (C |= W.getUTCMinutes()),
                  (C <<= 5),
                  (C |= W.getUTCSeconds() / 2),
                  (N = W.getUTCFullYear() - 1980),
                  (N <<= 4),
                  (N |= W.getUTCMonth() + 1),
                  (N <<= 5),
                  (N |= W.getUTCDate()),
                  R && ((re = n(1, 1) + n(p(H), 4) + T), (D += 'up' + n(re.length, 2) + re)),
                  o && ((M = n(1, 1) + n(p(ee), 4) + S), (D += 'uc' + n(M.length, 2) + M))
                var K = ''
                return (
                  (K += `
\0`),
                  (K += n(B, 2)),
                  (K += U.magic),
                  (K += n(C, 2)),
                  (K += n(N, 2)),
                  (K += n(te.crc32, 4)),
                  (K += n(te.compressedSize, 4)),
                  (K += n(te.uncompressedSize, 4)),
                  (K += n(H.length, 2)),
                  (K += n(D.length, 2)),
                  { fileRecord: m.LOCAL_FILE_HEADER + K + H + D, dirRecord: m.CENTRAL_FILE_HEADER + n(Q, 2) + K + n(ee.length, 2) + '\0\0\0\0' + n(x, 4) + n(h, 4) + H + D + ee }
                )
              }
              var l = e('../utils'),
                i = e('../stream/GenericWorker'),
                d = e('../utf8'),
                p = e('../crc32'),
                m = e('../signature')
              function _(c, y, w, h) {
                i.call(this, 'ZipFileWorker'),
                  (this.bytesWritten = 0),
                  (this.zipComment = y),
                  (this.zipPlatform = w),
                  (this.encodeFileName = h),
                  (this.streamFiles = c),
                  (this.accumulate = !1),
                  (this.contentBuffer = []),
                  (this.dirRecords = []),
                  (this.currentSourceOffset = 0),
                  (this.entriesCount = 0),
                  (this.currentFile = null),
                  (this._sources = [])
              }
              l.inherits(_, i),
                (_.prototype.push = function (c) {
                  var y = c.meta.percent || 0,
                    w = this.entriesCount,
                    h = this._sources.length
                  this.accumulate
                    ? this.contentBuffer.push(c)
                    : ((this.bytesWritten += c.data.length),
                      i.prototype.push.call(this, { data: c.data, meta: { currentFile: this.currentFile, percent: w ? (y + 100 * (w - h - 1)) / w : 100 } }))
                }),
                (_.prototype.openedSource = function (c) {
                  ;(this.currentSourceOffset = this.bytesWritten), (this.currentFile = c.file.name)
                  var y = this.streamFiles && !c.file.dir
                  if (y) {
                    var w = u(c, y, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName)
                    this.push({ data: w.fileRecord, meta: { percent: 0 } })
                  } else this.accumulate = !0
                }),
                (_.prototype.closedSource = function (c) {
                  this.accumulate = !1
                  var y = this.streamFiles && !c.file.dir,
                    w = u(c, y, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName)
                  if ((this.dirRecords.push(w.dirRecord), y))
                    this.push({
                      data: (function (h) {
                        return m.DATA_DESCRIPTOR + n(h.crc32, 4) + n(h.compressedSize, 4) + n(h.uncompressedSize, 4)
                      })(c),
                      meta: { percent: 100 }
                    })
                  else for (this.push({ data: w.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift())
                  this.currentFile = null
                }),
                (_.prototype.flush = function () {
                  for (var c = this.bytesWritten, y = 0; y < this.dirRecords.length; y++) this.push({ data: this.dirRecords[y], meta: { percent: 100 } })
                  var w = this.bytesWritten - c,
                    h = (function (g, b, C, N, P) {
                      var U = l.transformTo('string', P(N))
                      return m.CENTRAL_DIRECTORY_END + '\0\0\0\0' + n(g, 2) + n(g, 2) + n(b, 4) + n(C, 4) + n(U.length, 2) + U
                    })(this.dirRecords.length, w, c, this.zipComment, this.encodeFileName)
                  this.push({ data: h, meta: { percent: 100 } })
                }),
                (_.prototype.prepareNextSource = function () {
                  ;(this.previous = this._sources.shift()), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume()
                }),
                (_.prototype.registerPrevious = function (c) {
                  this._sources.push(c)
                  var y = this
                  return (
                    c.on('data', function (w) {
                      y.processChunk(w)
                    }),
                    c.on('end', function () {
                      y.closedSource(y.previous.streamInfo), y._sources.length ? y.prepareNextSource() : y.end()
                    }),
                    c.on('error', function (w) {
                      y.error(w)
                    }),
                    this
                  )
                }),
                (_.prototype.resume = function () {
                  return (
                    !!i.prototype.resume.call(this) &&
                    (!this.previous && this._sources.length
                      ? (this.prepareNextSource(), !0)
                      : this.previous || this._sources.length || this.generatedError
                      ? void 0
                      : (this.end(), !0))
                  )
                }),
                (_.prototype.error = function (c) {
                  var y = this._sources
                  if (!i.prototype.error.call(this, c)) return !1
                  for (var w = 0; w < y.length; w++)
                    try {
                      y[w].error(c)
                    } catch {}
                  return !0
                }),
                (_.prototype.lock = function () {
                  i.prototype.lock.call(this)
                  for (var c = this._sources, y = 0; y < c.length; y++) c[y].lock()
                }),
                (r.exports = _)
            },
            { '../crc32': 4, '../signature': 23, '../stream/GenericWorker': 28, '../utf8': 31, '../utils': 32 }
          ],
          9: [
            function (e, r, a) {
              var n = e('../compressions'),
                u = e('./ZipFileWorker')
              a.generateWorker = function (l, i, d) {
                var p = new u(i.streamFiles, d, i.platform, i.encodeFileName),
                  m = 0
                try {
                  l.forEach(function (_, c) {
                    m++
                    var y = (function (b, C) {
                        var N = b || C,
                          P = n[N]
                        if (!P) throw new Error(N + ' is not a valid compression method !')
                        return P
                      })(c.options.compression, i.compression),
                      w = c.options.compressionOptions || i.compressionOptions || {},
                      h = c.dir,
                      g = c.date
                    c._compressWorker(y, w)
                      .withStreamInfo('file', { name: _, dir: h, date: g, comment: c.comment || '', unixPermissions: c.unixPermissions, dosPermissions: c.dosPermissions })
                      .pipe(p)
                  }),
                    (p.entriesCount = m)
                } catch (_) {
                  p.error(_)
                }
                return p
              }
            },
            { '../compressions': 3, './ZipFileWorker': 8 }
          ],
          10: [
            function (e, r, a) {
              function n() {
                if (!(this instanceof n)) return new n()
                if (arguments.length) throw new Error('The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.')
                ;(this.files = Object.create(null)),
                  (this.comment = null),
                  (this.root = ''),
                  (this.clone = function () {
                    var u = new n()
                    for (var l in this) typeof this[l] != 'function' && (u[l] = this[l])
                    return u
                  })
              }
              ;((n.prototype = e('./object')).loadAsync = e('./load')),
                (n.support = e('./support')),
                (n.defaults = e('./defaults')),
                (n.version = '3.9.1'),
                (n.loadAsync = function (u, l) {
                  return new n().loadAsync(u, l)
                }),
                (n.external = e('./external')),
                (r.exports = n)
            },
            { './defaults': 5, './external': 6, './load': 11, './object': 15, './support': 30 }
          ],
          11: [
            function (e, r, a) {
              var n = e('./utils'),
                u = e('./external'),
                l = e('./utf8'),
                i = e('./zipEntries'),
                d = e('./stream/Crc32Probe'),
                p = e('./nodejsUtils')
              function m(_) {
                return new u.Promise(function (c, y) {
                  var w = _.decompressed.getContentWorker().pipe(new d())
                  w.on('error', function (h) {
                    y(h)
                  })
                    .on('end', function () {
                      w.streamInfo.crc32 !== _.decompressed.crc32 ? y(new Error('Corrupted zip : CRC32 mismatch')) : c()
                    })
                    .resume()
                })
              }
              r.exports = function (_, c) {
                var y = this
                return (
                  (c = n.extend(c || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: l.utf8decode })),
                  p.isNode && p.isStream(_)
                    ? u.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file."))
                    : n
                        .prepareContent('the loaded zip file', _, !0, c.optimizedBinaryString, c.base64)
                        .then(function (w) {
                          var h = new i(c)
                          return h.load(w), h
                        })
                        .then(function (w) {
                          var h = [u.Promise.resolve(w)],
                            g = w.files
                          if (c.checkCRC32) for (var b = 0; b < g.length; b++) h.push(m(g[b]))
                          return u.Promise.all(h)
                        })
                        .then(function (w) {
                          for (var h = w.shift(), g = h.files, b = 0; b < g.length; b++) {
                            var C = g[b],
                              N = C.fileNameStr,
                              P = n.resolve(C.fileNameStr)
                            y.file(P, C.decompressed, {
                              binary: !0,
                              optimizedBinaryString: !0,
                              date: C.date,
                              dir: C.dir,
                              comment: C.fileCommentStr.length ? C.fileCommentStr : null,
                              unixPermissions: C.unixPermissions,
                              dosPermissions: C.dosPermissions,
                              createFolders: c.createFolders
                            }),
                              C.dir || (y.file(P).unsafeOriginalName = N)
                          }
                          return h.zipComment.length && (y.comment = h.zipComment), y
                        })
                )
              }
            },
            { './external': 6, './nodejsUtils': 14, './stream/Crc32Probe': 25, './utf8': 31, './utils': 32, './zipEntries': 33 }
          ],
          12: [
            function (e, r, a) {
              var n = e('../utils'),
                u = e('../stream/GenericWorker')
              function l(i, d) {
                u.call(this, 'Nodejs stream input adapter for ' + i), (this._upstreamEnded = !1), this._bindStream(d)
              }
              n.inherits(l, u),
                (l.prototype._bindStream = function (i) {
                  var d = this
                  ;(this._stream = i).pause(),
                    i
                      .on('data', function (p) {
                        d.push({ data: p, meta: { percent: 0 } })
                      })
                      .on('error', function (p) {
                        d.isPaused ? (this.generatedError = p) : d.error(p)
                      })
                      .on('end', function () {
                        d.isPaused ? (d._upstreamEnded = !0) : d.end()
                      })
                }),
                (l.prototype.pause = function () {
                  return !!u.prototype.pause.call(this) && (this._stream.pause(), !0)
                }),
                (l.prototype.resume = function () {
                  return !!u.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0)
                }),
                (r.exports = l)
            },
            { '../stream/GenericWorker': 28, '../utils': 32 }
          ],
          13: [
            function (e, r, a) {
              var n = e('readable-stream').Readable
              function u(l, i, d) {
                n.call(this, i), (this._helper = l)
                var p = this
                l.on('data', function (m, _) {
                  p.push(m) || p._helper.pause(), d && d(_)
                })
                  .on('error', function (m) {
                    p.emit('error', m)
                  })
                  .on('end', function () {
                    p.push(null)
                  })
              }
              e('../utils').inherits(u, n),
                (u.prototype._read = function () {
                  this._helper.resume()
                }),
                (r.exports = u)
            },
            { '../utils': 32, 'readable-stream': 16 }
          ],
          14: [
            function (e, r, a) {
              r.exports = {
                isNode: typeof Buffer != 'undefined',
                newBufferFrom: function (n, u) {
                  if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(n, u)
                  if (typeof n == 'number') throw new Error('The "data" argument must not be a number')
                  return new Buffer(n, u)
                },
                allocBuffer: function (n) {
                  if (Buffer.alloc) return Buffer.alloc(n)
                  var u = new Buffer(n)
                  return u.fill(0), u
                },
                isBuffer: function (n) {
                  return Buffer.isBuffer(n)
                },
                isStream: function (n) {
                  return n && typeof n.on == 'function' && typeof n.pause == 'function' && typeof n.resume == 'function'
                }
              }
            },
            {}
          ],
          15: [
            function (e, r, a) {
              function n(P, U, I) {
                var H,
                  T = l.getTypeOf(U),
                  V = l.extend(I || {}, p)
                ;(V.date = V.date || new Date()),
                  V.compression !== null && (V.compression = V.compression.toUpperCase()),
                  typeof V.unixPermissions == 'string' && (V.unixPermissions = parseInt(V.unixPermissions, 8)),
                  V.unixPermissions && 16384 & V.unixPermissions && (V.dir = !0),
                  V.dosPermissions && 16 & V.dosPermissions && (V.dir = !0),
                  V.dir && (P = g(P)),
                  V.createFolders && (H = h(P)) && b.call(this, H, !0)
                var ee = T === 'string' && V.binary === !1 && V.base64 === !1
                ;(I && I.binary !== void 0) || (V.binary = !ee),
                  ((U instanceof m && U.uncompressedSize === 0) || V.dir || !U || U.length === 0) &&
                    ((V.base64 = !1), (V.binary = !0), (U = ''), (V.compression = 'STORE'), (T = 'string'))
                var S = null
                S = U instanceof m || U instanceof i ? U : y.isNode && y.isStream(U) ? new w(P, U) : l.prepareContent(P, U, V.binary, V.optimizedBinaryString, V.base64)
                var R = new _(P, S, V)
                this.files[P] = R
              }
              var u = e('./utf8'),
                l = e('./utils'),
                i = e('./stream/GenericWorker'),
                d = e('./stream/StreamHelper'),
                p = e('./defaults'),
                m = e('./compressedObject'),
                _ = e('./zipObject'),
                c = e('./generate'),
                y = e('./nodejsUtils'),
                w = e('./nodejs/NodejsStreamInputAdapter'),
                h = function (P) {
                  P.slice(-1) === '/' && (P = P.substring(0, P.length - 1))
                  var U = P.lastIndexOf('/')
                  return 0 < U ? P.substring(0, U) : ''
                },
                g = function (P) {
                  return P.slice(-1) !== '/' && (P += '/'), P
                },
                b = function (P, U) {
                  return (U = U !== void 0 ? U : p.createFolders), (P = g(P)), this.files[P] || n.call(this, P, null, { dir: !0, createFolders: U }), this.files[P]
                }
              function C(P) {
                return Object.prototype.toString.call(P) === '[object RegExp]'
              }
              var N = {
                load: function () {
                  throw new Error('This method has been removed in JSZip 3.0, please check the upgrade guide.')
                },
                forEach: function (P) {
                  var U, I, H
                  for (U in this.files) (H = this.files[U]), (I = U.slice(this.root.length, U.length)) && U.slice(0, this.root.length) === this.root && P(I, H)
                },
                filter: function (P) {
                  var U = []
                  return (
                    this.forEach(function (I, H) {
                      P(I, H) && U.push(H)
                    }),
                    U
                  )
                },
                file: function (P, U, I) {
                  if (arguments.length !== 1) return (P = this.root + P), n.call(this, P, U, I), this
                  if (C(P)) {
                    var H = P
                    return this.filter(function (V, ee) {
                      return !ee.dir && H.test(V)
                    })
                  }
                  var T = this.files[this.root + P]
                  return T && !T.dir ? T : null
                },
                folder: function (P) {
                  if (!P) return this
                  if (C(P))
                    return this.filter(function (T, V) {
                      return V.dir && P.test(T)
                    })
                  var U = this.root + P,
                    I = b.call(this, U),
                    H = this.clone()
                  return (H.root = I.name), H
                },
                remove: function (P) {
                  P = this.root + P
                  var U = this.files[P]
                  if ((U || (P.slice(-1) !== '/' && (P += '/'), (U = this.files[P])), U && !U.dir)) delete this.files[P]
                  else
                    for (
                      var I = this.filter(function (T, V) {
                          return V.name.slice(0, P.length) === P
                        }),
                        H = 0;
                      H < I.length;
                      H++
                    )
                      delete this.files[I[H].name]
                  return this
                },
                generate: function (P) {
                  throw new Error('This method has been removed in JSZip 3.0, please check the upgrade guide.')
                },
                generateInternalStream: function (P) {
                  var U,
                    I = {}
                  try {
                    if (
                      (((I = l.extend(P || {}, {
                        streamFiles: !1,
                        compression: 'STORE',
                        compressionOptions: null,
                        type: '',
                        platform: 'DOS',
                        comment: null,
                        mimeType: 'application/zip',
                        encodeFileName: u.utf8encode
                      })).type = I.type.toLowerCase()),
                      (I.compression = I.compression.toUpperCase()),
                      I.type === 'binarystring' && (I.type = 'string'),
                      !I.type)
                    )
                      throw new Error('No output type specified.')
                    l.checkSupport(I.type),
                      (I.platform !== 'darwin' && I.platform !== 'freebsd' && I.platform !== 'linux' && I.platform !== 'sunos') || (I.platform = 'UNIX'),
                      I.platform === 'win32' && (I.platform = 'DOS')
                    var H = I.comment || this.comment || ''
                    U = c.generateWorker(this, I, H)
                  } catch (T) {
                    ;(U = new i('error')).error(T)
                  }
                  return new d(U, I.type || 'string', I.mimeType)
                },
                generateAsync: function (P, U) {
                  return this.generateInternalStream(P).accumulate(U)
                },
                generateNodeStream: function (P, U) {
                  return (P = P || {}).type || (P.type = 'nodebuffer'), this.generateInternalStream(P).toNodejsStream(U)
                }
              }
              r.exports = N
            },
            {
              './compressedObject': 2,
              './defaults': 5,
              './generate': 9,
              './nodejs/NodejsStreamInputAdapter': 12,
              './nodejsUtils': 14,
              './stream/GenericWorker': 28,
              './stream/StreamHelper': 29,
              './utf8': 31,
              './utils': 32,
              './zipObject': 35
            }
          ],
          16: [
            function (e, r, a) {
              r.exports = e('stream')
            },
            { stream: void 0 }
          ],
          17: [
            function (e, r, a) {
              var n = e('./DataReader')
              function u(l) {
                n.call(this, l)
                for (var i = 0; i < this.data.length; i++) l[i] = 255 & l[i]
              }
              e('../utils').inherits(u, n),
                (u.prototype.byteAt = function (l) {
                  return this.data[this.zero + l]
                }),
                (u.prototype.lastIndexOfSignature = function (l) {
                  for (var i = l.charCodeAt(0), d = l.charCodeAt(1), p = l.charCodeAt(2), m = l.charCodeAt(3), _ = this.length - 4; 0 <= _; --_)
                    if (this.data[_] === i && this.data[_ + 1] === d && this.data[_ + 2] === p && this.data[_ + 3] === m) return _ - this.zero
                  return -1
                }),
                (u.prototype.readAndCheckSignature = function (l) {
                  var i = l.charCodeAt(0),
                    d = l.charCodeAt(1),
                    p = l.charCodeAt(2),
                    m = l.charCodeAt(3),
                    _ = this.readData(4)
                  return i === _[0] && d === _[1] && p === _[2] && m === _[3]
                }),
                (u.prototype.readData = function (l) {
                  if ((this.checkOffset(l), l === 0)) return []
                  var i = this.data.slice(this.zero + this.index, this.zero + this.index + l)
                  return (this.index += l), i
                }),
                (r.exports = u)
            },
            { '../utils': 32, './DataReader': 18 }
          ],
          18: [
            function (e, r, a) {
              var n = e('../utils')
              function u(l) {
                ;(this.data = l), (this.length = l.length), (this.index = 0), (this.zero = 0)
              }
              ;(u.prototype = {
                checkOffset: function (l) {
                  this.checkIndex(this.index + l)
                },
                checkIndex: function (l) {
                  if (this.length < this.zero + l || l < 0) throw new Error('End of data reached (data length = ' + this.length + ', asked index = ' + l + '). Corrupted zip ?')
                },
                setIndex: function (l) {
                  this.checkIndex(l), (this.index = l)
                },
                skip: function (l) {
                  this.setIndex(this.index + l)
                },
                byteAt: function (l) {},
                readInt: function (l) {
                  var i,
                    d = 0
                  for (this.checkOffset(l), i = this.index + l - 1; i >= this.index; i--) d = (d << 8) + this.byteAt(i)
                  return (this.index += l), d
                },
                readString: function (l) {
                  return n.transformTo('string', this.readData(l))
                },
                readData: function (l) {},
                lastIndexOfSignature: function (l) {},
                readAndCheckSignature: function (l) {},
                readDate: function () {
                  var l = this.readInt(4)
                  return new Date(Date.UTC(1980 + ((l >> 25) & 127), ((l >> 21) & 15) - 1, (l >> 16) & 31, (l >> 11) & 31, (l >> 5) & 63, (31 & l) << 1))
                }
              }),
                (r.exports = u)
            },
            { '../utils': 32 }
          ],
          19: [
            function (e, r, a) {
              var n = e('./Uint8ArrayReader')
              function u(l) {
                n.call(this, l)
              }
              e('../utils').inherits(u, n),
                (u.prototype.readData = function (l) {
                  this.checkOffset(l)
                  var i = this.data.slice(this.zero + this.index, this.zero + this.index + l)
                  return (this.index += l), i
                }),
                (r.exports = u)
            },
            { '../utils': 32, './Uint8ArrayReader': 21 }
          ],
          20: [
            function (e, r, a) {
              var n = e('./DataReader')
              function u(l) {
                n.call(this, l)
              }
              e('../utils').inherits(u, n),
                (u.prototype.byteAt = function (l) {
                  return this.data.charCodeAt(this.zero + l)
                }),
                (u.prototype.lastIndexOfSignature = function (l) {
                  return this.data.lastIndexOf(l) - this.zero
                }),
                (u.prototype.readAndCheckSignature = function (l) {
                  return l === this.readData(4)
                }),
                (u.prototype.readData = function (l) {
                  this.checkOffset(l)
                  var i = this.data.slice(this.zero + this.index, this.zero + this.index + l)
                  return (this.index += l), i
                }),
                (r.exports = u)
            },
            { '../utils': 32, './DataReader': 18 }
          ],
          21: [
            function (e, r, a) {
              var n = e('./ArrayReader')
              function u(l) {
                n.call(this, l)
              }
              e('../utils').inherits(u, n),
                (u.prototype.readData = function (l) {
                  if ((this.checkOffset(l), l === 0)) return new Uint8Array(0)
                  var i = this.data.subarray(this.zero + this.index, this.zero + this.index + l)
                  return (this.index += l), i
                }),
                (r.exports = u)
            },
            { '../utils': 32, './ArrayReader': 17 }
          ],
          22: [
            function (e, r, a) {
              var n = e('../utils'),
                u = e('../support'),
                l = e('./ArrayReader'),
                i = e('./StringReader'),
                d = e('./NodeBufferReader'),
                p = e('./Uint8ArrayReader')
              r.exports = function (m) {
                var _ = n.getTypeOf(m)
                return (
                  n.checkSupport(_),
                  _ !== 'string' || u.uint8array
                    ? _ === 'nodebuffer'
                      ? new d(m)
                      : u.uint8array
                      ? new p(n.transformTo('uint8array', m))
                      : new l(n.transformTo('array', m))
                    : new i(m)
                )
              }
            },
            { '../support': 30, '../utils': 32, './ArrayReader': 17, './NodeBufferReader': 19, './StringReader': 20, './Uint8ArrayReader': 21 }
          ],
          23: [
            function (e, r, a) {
              ;(a.LOCAL_FILE_HEADER = 'PK'),
                (a.CENTRAL_FILE_HEADER = 'PK'),
                (a.CENTRAL_DIRECTORY_END = 'PK'),
                (a.ZIP64_CENTRAL_DIRECTORY_LOCATOR = 'PK\x07'),
                (a.ZIP64_CENTRAL_DIRECTORY_END = 'PK'),
                (a.DATA_DESCRIPTOR = 'PK\x07\b')
            },
            {}
          ],
          24: [
            function (e, r, a) {
              var n = e('./GenericWorker'),
                u = e('../utils')
              function l(i) {
                n.call(this, 'ConvertWorker to ' + i), (this.destType = i)
              }
              u.inherits(l, n),
                (l.prototype.processChunk = function (i) {
                  this.push({ data: u.transformTo(this.destType, i.data), meta: i.meta })
                }),
                (r.exports = l)
            },
            { '../utils': 32, './GenericWorker': 28 }
          ],
          25: [
            function (e, r, a) {
              var n = e('./GenericWorker'),
                u = e('../crc32')
              function l() {
                n.call(this, 'Crc32Probe'), this.withStreamInfo('crc32', 0)
              }
              e('../utils').inherits(l, n),
                (l.prototype.processChunk = function (i) {
                  ;(this.streamInfo.crc32 = u(i.data, this.streamInfo.crc32 || 0)), this.push(i)
                }),
                (r.exports = l)
            },
            { '../crc32': 4, '../utils': 32, './GenericWorker': 28 }
          ],
          26: [
            function (e, r, a) {
              var n = e('../utils'),
                u = e('./GenericWorker')
              function l(i) {
                u.call(this, 'DataLengthProbe for ' + i), (this.propName = i), this.withStreamInfo(i, 0)
              }
              n.inherits(l, u),
                (l.prototype.processChunk = function (i) {
                  if (i) {
                    var d = this.streamInfo[this.propName] || 0
                    this.streamInfo[this.propName] = d + i.data.length
                  }
                  u.prototype.processChunk.call(this, i)
                }),
                (r.exports = l)
            },
            { '../utils': 32, './GenericWorker': 28 }
          ],
          27: [
            function (e, r, a) {
              var n = e('../utils'),
                u = e('./GenericWorker')
              function l(i) {
                u.call(this, 'DataWorker')
                var d = this
                ;(this.dataIsReady = !1),
                  (this.index = 0),
                  (this.max = 0),
                  (this.data = null),
                  (this.type = ''),
                  (this._tickScheduled = !1),
                  i.then(
                    function (p) {
                      ;(d.dataIsReady = !0), (d.data = p), (d.max = (p && p.length) || 0), (d.type = n.getTypeOf(p)), d.isPaused || d._tickAndRepeat()
                    },
                    function (p) {
                      d.error(p)
                    }
                  )
              }
              n.inherits(l, u),
                (l.prototype.cleanUp = function () {
                  u.prototype.cleanUp.call(this), (this.data = null)
                }),
                (l.prototype.resume = function () {
                  return !!u.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && ((this._tickScheduled = !0), n.delay(this._tickAndRepeat, [], this)), !0)
                }),
                (l.prototype._tickAndRepeat = function () {
                  ;(this._tickScheduled = !1),
                    this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), (this._tickScheduled = !0)))
                }),
                (l.prototype._tick = function () {
                  if (this.isPaused || this.isFinished) return !1
                  var i = null,
                    d = Math.min(this.max, this.index + 16384)
                  if (this.index >= this.max) return this.end()
                  switch (this.type) {
                    case 'string':
                      i = this.data.substring(this.index, d)
                      break
                    case 'uint8array':
                      i = this.data.subarray(this.index, d)
                      break
                    case 'array':
                    case 'nodebuffer':
                      i = this.data.slice(this.index, d)
                  }
                  return (this.index = d), this.push({ data: i, meta: { percent: this.max ? (this.index / this.max) * 100 : 0 } })
                }),
                (r.exports = l)
            },
            { '../utils': 32, './GenericWorker': 28 }
          ],
          28: [
            function (e, r, a) {
              function n(u) {
                ;(this.name = u || 'default'),
                  (this.streamInfo = {}),
                  (this.generatedError = null),
                  (this.extraStreamInfo = {}),
                  (this.isPaused = !0),
                  (this.isFinished = !1),
                  (this.isLocked = !1),
                  (this._listeners = { data: [], end: [], error: [] }),
                  (this.previous = null)
              }
              ;(n.prototype = {
                push: function (u) {
                  this.emit('data', u)
                },
                end: function () {
                  if (this.isFinished) return !1
                  this.flush()
                  try {
                    this.emit('end'), this.cleanUp(), (this.isFinished = !0)
                  } catch (u) {
                    this.emit('error', u)
                  }
                  return !0
                },
                error: function (u) {
                  return (
                    !this.isFinished &&
                    (this.isPaused ? (this.generatedError = u) : ((this.isFinished = !0), this.emit('error', u), this.previous && this.previous.error(u), this.cleanUp()), !0)
                  )
                },
                on: function (u, l) {
                  return this._listeners[u].push(l), this
                },
                cleanUp: function () {
                  ;(this.streamInfo = this.generatedError = this.extraStreamInfo = null), (this._listeners = [])
                },
                emit: function (u, l) {
                  if (this._listeners[u]) for (var i = 0; i < this._listeners[u].length; i++) this._listeners[u][i].call(this, l)
                },
                pipe: function (u) {
                  return u.registerPrevious(this)
                },
                registerPrevious: function (u) {
                  if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.")
                  ;(this.streamInfo = u.streamInfo), this.mergeStreamInfo(), (this.previous = u)
                  var l = this
                  return (
                    u.on('data', function (i) {
                      l.processChunk(i)
                    }),
                    u.on('end', function () {
                      l.end()
                    }),
                    u.on('error', function (i) {
                      l.error(i)
                    }),
                    this
                  )
                },
                pause: function () {
                  return !this.isPaused && !this.isFinished && ((this.isPaused = !0), this.previous && this.previous.pause(), !0)
                },
                resume: function () {
                  if (!this.isPaused || this.isFinished) return !1
                  var u = (this.isPaused = !1)
                  return this.generatedError && (this.error(this.generatedError), (u = !0)), this.previous && this.previous.resume(), !u
                },
                flush: function () {},
                processChunk: function (u) {
                  this.push(u)
                },
                withStreamInfo: function (u, l) {
                  return (this.extraStreamInfo[u] = l), this.mergeStreamInfo(), this
                },
                mergeStreamInfo: function () {
                  for (var u in this.extraStreamInfo) this.extraStreamInfo.hasOwnProperty(u) && (this.streamInfo[u] = this.extraStreamInfo[u])
                },
                lock: function () {
                  if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.")
                  ;(this.isLocked = !0), this.previous && this.previous.lock()
                },
                toString: function () {
                  var u = 'Worker ' + this.name
                  return this.previous ? this.previous + ' -> ' + u : u
                }
              }),
                (r.exports = n)
            },
            {}
          ],
          29: [
            function (e, r, a) {
              var n = e('../utils'),
                u = e('./ConvertWorker'),
                l = e('./GenericWorker'),
                i = e('../base64'),
                d = e('../support'),
                p = e('../external'),
                m = null
              if (d.nodestream)
                try {
                  m = e('../nodejs/NodejsStreamOutputAdapter')
                } catch {}
              function _(y, w) {
                return new p.Promise(function (h, g) {
                  var b = [],
                    C = y._internalType,
                    N = y._outputType,
                    P = y._mimeType
                  y.on('data', function (U, I) {
                    b.push(U), w && w(I)
                  })
                    .on('error', function (U) {
                      ;(b = []), g(U)
                    })
                    .on('end', function () {
                      try {
                        var U = (function (I, H, T) {
                          switch (I) {
                            case 'blob':
                              return n.newBlob(n.transformTo('arraybuffer', H), T)
                            case 'base64':
                              return i.encode(H)
                            default:
                              return n.transformTo(I, H)
                          }
                        })(
                          N,
                          (function (I, H) {
                            var T,
                              V = 0,
                              ee = null,
                              S = 0
                            for (T = 0; T < H.length; T++) S += H[T].length
                            switch (I) {
                              case 'string':
                                return H.join('')
                              case 'array':
                                return Array.prototype.concat.apply([], H)
                              case 'uint8array':
                                for (ee = new Uint8Array(S), T = 0; T < H.length; T++) ee.set(H[T], V), (V += H[T].length)
                                return ee
                              case 'nodebuffer':
                                return Buffer.concat(H)
                              default:
                                throw new Error("concat : unsupported type '" + I + "'")
                            }
                          })(C, b),
                          P
                        )
                        h(U)
                      } catch (I) {
                        g(I)
                      }
                      b = []
                    })
                    .resume()
                })
              }
              function c(y, w, h) {
                var g = w
                switch (w) {
                  case 'blob':
                  case 'arraybuffer':
                    g = 'uint8array'
                    break
                  case 'base64':
                    g = 'string'
                }
                try {
                  ;(this._internalType = g), (this._outputType = w), (this._mimeType = h), n.checkSupport(g), (this._worker = y.pipe(new u(g))), y.lock()
                } catch (b) {
                  ;(this._worker = new l('error')), this._worker.error(b)
                }
              }
              ;(c.prototype = {
                accumulate: function (y) {
                  return _(this, y)
                },
                on: function (y, w) {
                  var h = this
                  return (
                    y === 'data'
                      ? this._worker.on(y, function (g) {
                          w.call(h, g.data, g.meta)
                        })
                      : this._worker.on(y, function () {
                          n.delay(w, arguments, h)
                        }),
                    this
                  )
                },
                resume: function () {
                  return n.delay(this._worker.resume, [], this._worker), this
                },
                pause: function () {
                  return this._worker.pause(), this
                },
                toNodejsStream: function (y) {
                  if ((n.checkSupport('nodestream'), this._outputType !== 'nodebuffer')) throw new Error(this._outputType + ' is not supported by this method')
                  return new m(this, { objectMode: this._outputType !== 'nodebuffer' }, y)
                }
              }),
                (r.exports = c)
            },
            { '../base64': 1, '../external': 6, '../nodejs/NodejsStreamOutputAdapter': 13, '../support': 30, '../utils': 32, './ConvertWorker': 24, './GenericWorker': 28 }
          ],
          30: [
            function (e, r, a) {
              if (
                ((a.base64 = !0),
                (a.array = !0),
                (a.string = !0),
                (a.arraybuffer = typeof ArrayBuffer != 'undefined' && typeof Uint8Array != 'undefined'),
                (a.nodebuffer = typeof Buffer != 'undefined'),
                (a.uint8array = typeof Uint8Array != 'undefined'),
                typeof ArrayBuffer == 'undefined')
              )
                a.blob = !1
              else {
                var n = new ArrayBuffer(0)
                try {
                  a.blob = new Blob([n], { type: 'application/zip' }).size === 0
                } catch {
                  try {
                    var u = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)()
                    u.append(n), (a.blob = u.getBlob('application/zip').size === 0)
                  } catch {
                    a.blob = !1
                  }
                }
              }
              try {
                a.nodestream = !!e('readable-stream').Readable
              } catch {
                a.nodestream = !1
              }
            },
            { 'readable-stream': 16 }
          ],
          31: [
            function (e, r, a) {
              for (var n = e('./utils'), u = e('./support'), l = e('./nodejsUtils'), i = e('./stream/GenericWorker'), d = new Array(256), p = 0; p < 256; p++)
                d[p] = 252 <= p ? 6 : 248 <= p ? 5 : 240 <= p ? 4 : 224 <= p ? 3 : 192 <= p ? 2 : 1
              d[254] = d[254] = 1
              function m() {
                i.call(this, 'utf-8 decode'), (this.leftOver = null)
              }
              function _() {
                i.call(this, 'utf-8 encode')
              }
              ;(a.utf8encode = function (c) {
                return u.nodebuffer
                  ? l.newBufferFrom(c, 'utf-8')
                  : (function (y) {
                      var w,
                        h,
                        g,
                        b,
                        C,
                        N = y.length,
                        P = 0
                      for (b = 0; b < N; b++)
                        (64512 & (h = y.charCodeAt(b))) == 55296 &&
                          b + 1 < N &&
                          (64512 & (g = y.charCodeAt(b + 1))) == 56320 &&
                          ((h = 65536 + ((h - 55296) << 10) + (g - 56320)), b++),
                          (P += h < 128 ? 1 : h < 2048 ? 2 : h < 65536 ? 3 : 4)
                      for (w = u.uint8array ? new Uint8Array(P) : new Array(P), b = C = 0; C < P; b++)
                        (64512 & (h = y.charCodeAt(b))) == 55296 &&
                          b + 1 < N &&
                          (64512 & (g = y.charCodeAt(b + 1))) == 56320 &&
                          ((h = 65536 + ((h - 55296) << 10) + (g - 56320)), b++),
                          h < 128
                            ? (w[C++] = h)
                            : (h < 2048
                                ? (w[C++] = 192 | (h >>> 6))
                                : (h < 65536 ? (w[C++] = 224 | (h >>> 12)) : ((w[C++] = 240 | (h >>> 18)), (w[C++] = 128 | ((h >>> 12) & 63))), (w[C++] = 128 | ((h >>> 6) & 63))),
                              (w[C++] = 128 | (63 & h)))
                      return w
                    })(c)
              }),
                (a.utf8decode = function (c) {
                  return u.nodebuffer
                    ? n.transformTo('nodebuffer', c).toString('utf-8')
                    : (function (y) {
                        var w,
                          h,
                          g,
                          b,
                          C = y.length,
                          N = new Array(2 * C)
                        for (w = h = 0; w < C; )
                          if ((g = y[w++]) < 128) N[h++] = g
                          else if (4 < (b = d[g])) (N[h++] = 65533), (w += b - 1)
                          else {
                            for (g &= b === 2 ? 31 : b === 3 ? 15 : 7; 1 < b && w < C; ) (g = (g << 6) | (63 & y[w++])), b--
                            1 < b ? (N[h++] = 65533) : g < 65536 ? (N[h++] = g) : ((g -= 65536), (N[h++] = 55296 | ((g >> 10) & 1023)), (N[h++] = 56320 | (1023 & g)))
                          }
                        return N.length !== h && (N.subarray ? (N = N.subarray(0, h)) : (N.length = h)), n.applyFromCharCode(N)
                      })((c = n.transformTo(u.uint8array ? 'uint8array' : 'array', c)))
                }),
                n.inherits(m, i),
                (m.prototype.processChunk = function (c) {
                  var y = n.transformTo(u.uint8array ? 'uint8array' : 'array', c.data)
                  if (this.leftOver && this.leftOver.length) {
                    if (u.uint8array) {
                      var w = y
                      ;(y = new Uint8Array(w.length + this.leftOver.length)).set(this.leftOver, 0), y.set(w, this.leftOver.length)
                    } else y = this.leftOver.concat(y)
                    this.leftOver = null
                  }
                  var h = (function (b, C) {
                      var N
                      for ((C = C || b.length) > b.length && (C = b.length), N = C - 1; 0 <= N && (192 & b[N]) == 128; ) N--
                      return N < 0 || N === 0 ? C : N + d[b[N]] > C ? N : C
                    })(y),
                    g = y
                  h !== y.length &&
                    (u.uint8array ? ((g = y.subarray(0, h)), (this.leftOver = y.subarray(h, y.length))) : ((g = y.slice(0, h)), (this.leftOver = y.slice(h, y.length)))),
                    this.push({ data: a.utf8decode(g), meta: c.meta })
                }),
                (m.prototype.flush = function () {
                  this.leftOver && this.leftOver.length && (this.push({ data: a.utf8decode(this.leftOver), meta: {} }), (this.leftOver = null))
                }),
                (a.Utf8DecodeWorker = m),
                n.inherits(_, i),
                (_.prototype.processChunk = function (c) {
                  this.push({ data: a.utf8encode(c.data), meta: c.meta })
                }),
                (a.Utf8EncodeWorker = _)
            },
            { './nodejsUtils': 14, './stream/GenericWorker': 28, './support': 30, './utils': 32 }
          ],
          32: [
            function (e, r, a) {
              var n = e('./support'),
                u = e('./base64'),
                l = e('./nodejsUtils'),
                i = e('set-immediate-shim'),
                d = e('./external')
              function p(h) {
                return h
              }
              function m(h, g) {
                for (var b = 0; b < h.length; ++b) g[b] = 255 & h.charCodeAt(b)
                return g
              }
              a.newBlob = function (h, g) {
                a.checkSupport('blob')
                try {
                  return new Blob([h], { type: g })
                } catch {
                  try {
                    var b = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)()
                    return b.append(h), b.getBlob(g)
                  } catch {
                    throw new Error("Bug : can't construct the Blob.")
                  }
                }
              }
              var _ = {
                stringifyByChunk: function (h, g, b) {
                  var C = [],
                    N = 0,
                    P = h.length
                  if (P <= b) return String.fromCharCode.apply(null, h)
                  for (; N < P; )
                    g === 'array' || g === 'nodebuffer'
                      ? C.push(String.fromCharCode.apply(null, h.slice(N, Math.min(N + b, P))))
                      : C.push(String.fromCharCode.apply(null, h.subarray(N, Math.min(N + b, P)))),
                      (N += b)
                  return C.join('')
                },
                stringifyByChar: function (h) {
                  for (var g = '', b = 0; b < h.length; b++) g += String.fromCharCode(h[b])
                  return g
                },
                applyCanBeUsed: {
                  uint8array: (function () {
                    try {
                      return n.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1
                    } catch {
                      return !1
                    }
                  })(),
                  nodebuffer: (function () {
                    try {
                      return n.nodebuffer && String.fromCharCode.apply(null, l.allocBuffer(1)).length === 1
                    } catch {
                      return !1
                    }
                  })()
                }
              }
              function c(h) {
                var g = 65536,
                  b = a.getTypeOf(h),
                  C = !0
                if ((b === 'uint8array' ? (C = _.applyCanBeUsed.uint8array) : b === 'nodebuffer' && (C = _.applyCanBeUsed.nodebuffer), C))
                  for (; 1 < g; )
                    try {
                      return _.stringifyByChunk(h, b, g)
                    } catch {
                      g = Math.floor(g / 2)
                    }
                return _.stringifyByChar(h)
              }
              function y(h, g) {
                for (var b = 0; b < h.length; b++) g[b] = h[b]
                return g
              }
              a.applyFromCharCode = c
              var w = {}
              ;(w.string = {
                string: p,
                array: function (h) {
                  return m(h, new Array(h.length))
                },
                arraybuffer: function (h) {
                  return w.string.uint8array(h).buffer
                },
                uint8array: function (h) {
                  return m(h, new Uint8Array(h.length))
                },
                nodebuffer: function (h) {
                  return m(h, l.allocBuffer(h.length))
                }
              }),
                (w.array = {
                  string: c,
                  array: p,
                  arraybuffer: function (h) {
                    return new Uint8Array(h).buffer
                  },
                  uint8array: function (h) {
                    return new Uint8Array(h)
                  },
                  nodebuffer: function (h) {
                    return l.newBufferFrom(h)
                  }
                }),
                (w.arraybuffer = {
                  string: function (h) {
                    return c(new Uint8Array(h))
                  },
                  array: function (h) {
                    return y(new Uint8Array(h), new Array(h.byteLength))
                  },
                  arraybuffer: p,
                  uint8array: function (h) {
                    return new Uint8Array(h)
                  },
                  nodebuffer: function (h) {
                    return l.newBufferFrom(new Uint8Array(h))
                  }
                }),
                (w.uint8array = {
                  string: c,
                  array: function (h) {
                    return y(h, new Array(h.length))
                  },
                  arraybuffer: function (h) {
                    return h.buffer
                  },
                  uint8array: p,
                  nodebuffer: function (h) {
                    return l.newBufferFrom(h)
                  }
                }),
                (w.nodebuffer = {
                  string: c,
                  array: function (h) {
                    return y(h, new Array(h.length))
                  },
                  arraybuffer: function (h) {
                    return w.nodebuffer.uint8array(h).buffer
                  },
                  uint8array: function (h) {
                    return y(h, new Uint8Array(h.length))
                  },
                  nodebuffer: p
                }),
                (a.transformTo = function (h, g) {
                  if (((g = g || ''), !h)) return g
                  a.checkSupport(h)
                  var b = a.getTypeOf(g)
                  return w[b][h](g)
                }),
                (a.resolve = function (h) {
                  for (var g = h.split('/'), b = [], C = 0; C < g.length; C++) {
                    var N = g[C]
                    N === '.' || (N === '' && C !== 0 && C !== g.length - 1) || (N === '..' ? b.pop() : b.push(N))
                  }
                  return b.join('/')
                }),
                (a.getTypeOf = function (h) {
                  return typeof h == 'string'
                    ? 'string'
                    : Object.prototype.toString.call(h) === '[object Array]'
                    ? 'array'
                    : n.nodebuffer && l.isBuffer(h)
                    ? 'nodebuffer'
                    : n.uint8array && h instanceof Uint8Array
                    ? 'uint8array'
                    : n.arraybuffer && h instanceof ArrayBuffer
                    ? 'arraybuffer'
                    : void 0
                }),
                (a.checkSupport = function (h) {
                  if (!n[h.toLowerCase()]) throw new Error(h + ' is not supported by this platform')
                }),
                (a.MAX_VALUE_16BITS = 65535),
                (a.MAX_VALUE_32BITS = -1),
                (a.pretty = function (h) {
                  var g,
                    b,
                    C = ''
                  for (b = 0; b < (h || '').length; b++) C += '\\x' + ((g = h.charCodeAt(b)) < 16 ? '0' : '') + g.toString(16).toUpperCase()
                  return C
                }),
                (a.delay = function (h, g, b) {
                  i(function () {
                    h.apply(b || null, g || [])
                  })
                }),
                (a.inherits = function (h, g) {
                  function b() {}
                  ;(b.prototype = g.prototype), (h.prototype = new b())
                }),
                (a.extend = function () {
                  var h,
                    g,
                    b = {}
                  for (h = 0; h < arguments.length; h++) for (g in arguments[h]) arguments[h].hasOwnProperty(g) && b[g] === void 0 && (b[g] = arguments[h][g])
                  return b
                }),
                (a.prepareContent = function (h, g, b, C, N) {
                  return d.Promise.resolve(g)
                    .then(function (P) {
                      return n.blob &&
                        (P instanceof Blob || ['[object File]', '[object Blob]'].indexOf(Object.prototype.toString.call(P)) !== -1) &&
                        typeof FileReader != 'undefined'
                        ? new d.Promise(function (U, I) {
                            var H = new FileReader()
                            ;(H.onload = function (T) {
                              U(T.target.result)
                            }),
                              (H.onerror = function (T) {
                                I(T.target.error)
                              }),
                              H.readAsArrayBuffer(P)
                          })
                        : P
                    })
                    .then(function (P) {
                      var U = a.getTypeOf(P)
                      return U
                        ? (U === 'arraybuffer'
                            ? (P = a.transformTo('uint8array', P))
                            : U === 'string' &&
                              (N
                                ? (P = u.decode(P))
                                : b &&
                                  C !== !0 &&
                                  (P = (function (I) {
                                    return m(I, n.uint8array ? new Uint8Array(I.length) : new Array(I.length))
                                  })(P))),
                          P)
                        : d.Promise.reject(new Error("Can't read the data of '" + h + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))
                    })
                })
            },
            { './base64': 1, './external': 6, './nodejsUtils': 14, './support': 30, 'set-immediate-shim': 54 }
          ],
          33: [
            function (e, r, a) {
              var n = e('./reader/readerFor'),
                u = e('./utils'),
                l = e('./signature'),
                i = e('./zipEntry'),
                d = (e('./utf8'), e('./support'))
              function p(m) {
                ;(this.files = []), (this.loadOptions = m)
              }
              ;(p.prototype = {
                checkSignature: function (m) {
                  if (!this.reader.readAndCheckSignature(m)) {
                    this.reader.index -= 4
                    var _ = this.reader.readString(4)
                    throw new Error('Corrupted zip or bug: unexpected signature (' + u.pretty(_) + ', expected ' + u.pretty(m) + ')')
                  }
                },
                isSignature: function (m, _) {
                  var c = this.reader.index
                  this.reader.setIndex(m)
                  var y = this.reader.readString(4) === _
                  return this.reader.setIndex(c), y
                },
                readBlockEndOfCentral: function () {
                  ;(this.diskNumber = this.reader.readInt(2)),
                    (this.diskWithCentralDirStart = this.reader.readInt(2)),
                    (this.centralDirRecordsOnThisDisk = this.reader.readInt(2)),
                    (this.centralDirRecords = this.reader.readInt(2)),
                    (this.centralDirSize = this.reader.readInt(4)),
                    (this.centralDirOffset = this.reader.readInt(4)),
                    (this.zipCommentLength = this.reader.readInt(2))
                  var m = this.reader.readData(this.zipCommentLength),
                    _ = d.uint8array ? 'uint8array' : 'array',
                    c = u.transformTo(_, m)
                  this.zipComment = this.loadOptions.decodeFileName(c)
                },
                readBlockZip64EndOfCentral: function () {
                  ;(this.zip64EndOfCentralSize = this.reader.readInt(8)),
                    this.reader.skip(4),
                    (this.diskNumber = this.reader.readInt(4)),
                    (this.diskWithCentralDirStart = this.reader.readInt(4)),
                    (this.centralDirRecordsOnThisDisk = this.reader.readInt(8)),
                    (this.centralDirRecords = this.reader.readInt(8)),
                    (this.centralDirSize = this.reader.readInt(8)),
                    (this.centralDirOffset = this.reader.readInt(8)),
                    (this.zip64ExtensibleData = {})
                  for (var m, _, c, y = this.zip64EndOfCentralSize - 44; 0 < y; )
                    (m = this.reader.readInt(2)), (_ = this.reader.readInt(4)), (c = this.reader.readData(_)), (this.zip64ExtensibleData[m] = { id: m, length: _, value: c })
                },
                readBlockZip64EndOfCentralLocator: function () {
                  if (
                    ((this.diskWithZip64CentralDirStart = this.reader.readInt(4)),
                    (this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8)),
                    (this.disksCount = this.reader.readInt(4)),
                    1 < this.disksCount)
                  )
                    throw new Error('Multi-volumes zip are not supported')
                },
                readLocalFiles: function () {
                  var m, _
                  for (m = 0; m < this.files.length; m++)
                    (_ = this.files[m]),
                      this.reader.setIndex(_.localHeaderOffset),
                      this.checkSignature(l.LOCAL_FILE_HEADER),
                      _.readLocalPart(this.reader),
                      _.handleUTF8(),
                      _.processAttributes()
                },
                readCentralDir: function () {
                  var m
                  for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(l.CENTRAL_FILE_HEADER); )
                    (m = new i({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(m)
                  if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0)
                    throw new Error('Corrupted zip or bug: expected ' + this.centralDirRecords + ' records in central dir, got ' + this.files.length)
                },
                readEndOfCentral: function () {
                  var m = this.reader.lastIndexOfSignature(l.CENTRAL_DIRECTORY_END)
                  if (m < 0)
                    throw this.isSignature(0, l.LOCAL_FILE_HEADER)
                      ? new Error("Corrupted zip: can't find end of central directory")
                      : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html")
                  this.reader.setIndex(m)
                  var _ = m
                  if (
                    (this.checkSignature(l.CENTRAL_DIRECTORY_END),
                    this.readBlockEndOfCentral(),
                    this.diskNumber === u.MAX_VALUE_16BITS ||
                      this.diskWithCentralDirStart === u.MAX_VALUE_16BITS ||
                      this.centralDirRecordsOnThisDisk === u.MAX_VALUE_16BITS ||
                      this.centralDirRecords === u.MAX_VALUE_16BITS ||
                      this.centralDirSize === u.MAX_VALUE_32BITS ||
                      this.centralDirOffset === u.MAX_VALUE_32BITS)
                  ) {
                    if (((this.zip64 = !0), (m = this.reader.lastIndexOfSignature(l.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0))
                      throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator")
                    if (
                      (this.reader.setIndex(m),
                      this.checkSignature(l.ZIP64_CENTRAL_DIRECTORY_LOCATOR),
                      this.readBlockZip64EndOfCentralLocator(),
                      !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, l.ZIP64_CENTRAL_DIRECTORY_END) &&
                        ((this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(l.ZIP64_CENTRAL_DIRECTORY_END)), this.relativeOffsetEndOfZip64CentralDir < 0))
                    )
                      throw new Error("Corrupted zip: can't find the ZIP64 end of central directory")
                    this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(l.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral()
                  }
                  var c = this.centralDirOffset + this.centralDirSize
                  this.zip64 && ((c += 20), (c += 12 + this.zip64EndOfCentralSize))
                  var y = _ - c
                  if (0 < y) this.isSignature(_, l.CENTRAL_FILE_HEADER) || (this.reader.zero = y)
                  else if (y < 0) throw new Error('Corrupted zip: missing ' + Math.abs(y) + ' bytes.')
                },
                prepareReader: function (m) {
                  this.reader = n(m)
                },
                load: function (m) {
                  this.prepareReader(m), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles()
                }
              }),
                (r.exports = p)
            },
            { './reader/readerFor': 22, './signature': 23, './support': 30, './utf8': 31, './utils': 32, './zipEntry': 34 }
          ],
          34: [
            function (e, r, a) {
              var n = e('./reader/readerFor'),
                u = e('./utils'),
                l = e('./compressedObject'),
                i = e('./crc32'),
                d = e('./utf8'),
                p = e('./compressions'),
                m = e('./support')
              function _(c, y) {
                ;(this.options = c), (this.loadOptions = y)
              }
              ;(_.prototype = {
                isEncrypted: function () {
                  return (1 & this.bitFlag) == 1
                },
                useUTF8: function () {
                  return (2048 & this.bitFlag) == 2048
                },
                readLocalPart: function (c) {
                  var y, w
                  if (
                    (c.skip(22),
                    (this.fileNameLength = c.readInt(2)),
                    (w = c.readInt(2)),
                    (this.fileName = c.readData(this.fileNameLength)),
                    c.skip(w),
                    this.compressedSize === -1 || this.uncompressedSize === -1)
                  )
                    throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)")
                  if (
                    (y = (function (h) {
                      for (var g in p) if (p.hasOwnProperty(g) && p[g].magic === h) return p[g]
                      return null
                    })(this.compressionMethod)) === null
                  )
                    throw new Error('Corrupted zip : compression ' + u.pretty(this.compressionMethod) + ' unknown (inner file : ' + u.transformTo('string', this.fileName) + ')')
                  this.decompressed = new l(this.compressedSize, this.uncompressedSize, this.crc32, y, c.readData(this.compressedSize))
                },
                readCentralPart: function (c) {
                  ;(this.versionMadeBy = c.readInt(2)),
                    c.skip(2),
                    (this.bitFlag = c.readInt(2)),
                    (this.compressionMethod = c.readString(2)),
                    (this.date = c.readDate()),
                    (this.crc32 = c.readInt(4)),
                    (this.compressedSize = c.readInt(4)),
                    (this.uncompressedSize = c.readInt(4))
                  var y = c.readInt(2)
                  if (
                    ((this.extraFieldsLength = c.readInt(2)),
                    (this.fileCommentLength = c.readInt(2)),
                    (this.diskNumberStart = c.readInt(2)),
                    (this.internalFileAttributes = c.readInt(2)),
                    (this.externalFileAttributes = c.readInt(4)),
                    (this.localHeaderOffset = c.readInt(4)),
                    this.isEncrypted())
                  )
                    throw new Error('Encrypted zip are not supported')
                  c.skip(y), this.readExtraFields(c), this.parseZIP64ExtraField(c), (this.fileComment = c.readData(this.fileCommentLength))
                },
                processAttributes: function () {
                  ;(this.unixPermissions = null), (this.dosPermissions = null)
                  var c = this.versionMadeBy >> 8
                  ;(this.dir = !!(16 & this.externalFileAttributes)),
                    c == 0 && (this.dosPermissions = 63 & this.externalFileAttributes),
                    c == 3 && (this.unixPermissions = (this.externalFileAttributes >> 16) & 65535),
                    this.dir || this.fileNameStr.slice(-1) !== '/' || (this.dir = !0)
                },
                parseZIP64ExtraField: function (c) {
                  if (this.extraFields[1]) {
                    var y = n(this.extraFields[1].value)
                    this.uncompressedSize === u.MAX_VALUE_32BITS && (this.uncompressedSize = y.readInt(8)),
                      this.compressedSize === u.MAX_VALUE_32BITS && (this.compressedSize = y.readInt(8)),
                      this.localHeaderOffset === u.MAX_VALUE_32BITS && (this.localHeaderOffset = y.readInt(8)),
                      this.diskNumberStart === u.MAX_VALUE_32BITS && (this.diskNumberStart = y.readInt(4))
                  }
                },
                readExtraFields: function (c) {
                  var y,
                    w,
                    h,
                    g = c.index + this.extraFieldsLength
                  for (this.extraFields || (this.extraFields = {}); c.index + 4 < g; )
                    (y = c.readInt(2)), (w = c.readInt(2)), (h = c.readData(w)), (this.extraFields[y] = { id: y, length: w, value: h })
                  c.setIndex(g)
                },
                handleUTF8: function () {
                  var c = m.uint8array ? 'uint8array' : 'array'
                  if (this.useUTF8()) (this.fileNameStr = d.utf8decode(this.fileName)), (this.fileCommentStr = d.utf8decode(this.fileComment))
                  else {
                    var y = this.findExtraFieldUnicodePath()
                    if (y !== null) this.fileNameStr = y
                    else {
                      var w = u.transformTo(c, this.fileName)
                      this.fileNameStr = this.loadOptions.decodeFileName(w)
                    }
                    var h = this.findExtraFieldUnicodeComment()
                    if (h !== null) this.fileCommentStr = h
                    else {
                      var g = u.transformTo(c, this.fileComment)
                      this.fileCommentStr = this.loadOptions.decodeFileName(g)
                    }
                  }
                },
                findExtraFieldUnicodePath: function () {
                  var c = this.extraFields[28789]
                  if (c) {
                    var y = n(c.value)
                    return y.readInt(1) !== 1 || i(this.fileName) !== y.readInt(4) ? null : d.utf8decode(y.readData(c.length - 5))
                  }
                  return null
                },
                findExtraFieldUnicodeComment: function () {
                  var c = this.extraFields[25461]
                  if (c) {
                    var y = n(c.value)
                    return y.readInt(1) !== 1 || i(this.fileComment) !== y.readInt(4) ? null : d.utf8decode(y.readData(c.length - 5))
                  }
                  return null
                }
              }),
                (r.exports = _)
            },
            { './compressedObject': 2, './compressions': 3, './crc32': 4, './reader/readerFor': 22, './support': 30, './utf8': 31, './utils': 32 }
          ],
          35: [
            function (e, r, a) {
              function n(y, w, h) {
                ;(this.name = y),
                  (this.dir = h.dir),
                  (this.date = h.date),
                  (this.comment = h.comment),
                  (this.unixPermissions = h.unixPermissions),
                  (this.dosPermissions = h.dosPermissions),
                  (this._data = w),
                  (this._dataBinary = h.binary),
                  (this.options = { compression: h.compression, compressionOptions: h.compressionOptions })
              }
              var u = e('./stream/StreamHelper'),
                l = e('./stream/DataWorker'),
                i = e('./utf8'),
                d = e('./compressedObject'),
                p = e('./stream/GenericWorker')
              n.prototype = {
                internalStream: function (y) {
                  var w = null,
                    h = 'string'
                  try {
                    if (!y) throw new Error('No output type specified.')
                    var g = (h = y.toLowerCase()) === 'string' || h === 'text'
                    ;(h !== 'binarystring' && h !== 'text') || (h = 'string'), (w = this._decompressWorker())
                    var b = !this._dataBinary
                    b && !g && (w = w.pipe(new i.Utf8EncodeWorker())), !b && g && (w = w.pipe(new i.Utf8DecodeWorker()))
                  } catch (C) {
                    ;(w = new p('error')).error(C)
                  }
                  return new u(w, h, '')
                },
                async: function (y, w) {
                  return this.internalStream(y).accumulate(w)
                },
                nodeStream: function (y, w) {
                  return this.internalStream(y || 'nodebuffer').toNodejsStream(w)
                },
                _compressWorker: function (y, w) {
                  if (this._data instanceof d && this._data.compression.magic === y.magic) return this._data.getCompressedWorker()
                  var h = this._decompressWorker()
                  return this._dataBinary || (h = h.pipe(new i.Utf8EncodeWorker())), d.createWorkerFrom(h, y, w)
                },
                _decompressWorker: function () {
                  return this._data instanceof d ? this._data.getContentWorker() : this._data instanceof p ? this._data : new l(this._data)
                }
              }
              for (
                var m = ['asText', 'asBinary', 'asNodeBuffer', 'asUint8Array', 'asArrayBuffer'],
                  _ = function () {
                    throw new Error('This method has been removed in JSZip 3.0, please check the upgrade guide.')
                  },
                  c = 0;
                c < m.length;
                c++
              )
                n.prototype[m[c]] = _
              r.exports = n
            },
            { './compressedObject': 2, './stream/DataWorker': 27, './stream/GenericWorker': 28, './stream/StreamHelper': 29, './utf8': 31 }
          ],
          36: [
            function (e, r, a) {
              ;(function (n) {
                var u,
                  l,
                  i = n.MutationObserver || n.WebKitMutationObserver
                if (i) {
                  var d = 0,
                    p = new i(y),
                    m = n.document.createTextNode('')
                  p.observe(m, { characterData: !0 }),
                    (u = function () {
                      m.data = d = ++d % 2
                    })
                } else if (n.setImmediate || n.MessageChannel === void 0)
                  u =
                    'document' in n && 'onreadystatechange' in n.document.createElement('script')
                      ? function () {
                          var w = n.document.createElement('script')
                          ;(w.onreadystatechange = function () {
                            y(), (w.onreadystatechange = null), w.parentNode.removeChild(w), (w = null)
                          }),
                            n.document.documentElement.appendChild(w)
                        }
                      : function () {
                          setTimeout(y, 0)
                        }
                else {
                  var _ = new n.MessageChannel()
                  ;(_.port1.onmessage = y),
                    (u = function () {
                      _.port2.postMessage(0)
                    })
                }
                var c = []
                function y() {
                  var w, h
                  l = !0
                  for (var g = c.length; g; ) {
                    for (h = c, c = [], w = -1; ++w < g; ) h[w]()
                    g = c.length
                  }
                  l = !1
                }
                r.exports = function (w) {
                  c.push(w) !== 1 || l || u()
                }
              }).call(this, typeof at != 'undefined' ? at : typeof self != 'undefined' ? self : typeof window != 'undefined' ? window : {})
            },
            {}
          ],
          37: [
            function (e, r, a) {
              var n = e('immediate')
              function u() {}
              var l = {},
                i = ['REJECTED'],
                d = ['FULFILLED'],
                p = ['PENDING']
              function m(g) {
                if (typeof g != 'function') throw new TypeError('resolver must be a function')
                ;(this.state = p), (this.queue = []), (this.outcome = void 0), g !== u && w(this, g)
              }
              function _(g, b, C) {
                ;(this.promise = g),
                  typeof b == 'function' && ((this.onFulfilled = b), (this.callFulfilled = this.otherCallFulfilled)),
                  typeof C == 'function' && ((this.onRejected = C), (this.callRejected = this.otherCallRejected))
              }
              function c(g, b, C) {
                n(function () {
                  var N
                  try {
                    N = b(C)
                  } catch (P) {
                    return l.reject(g, P)
                  }
                  N === g ? l.reject(g, new TypeError('Cannot resolve promise with itself')) : l.resolve(g, N)
                })
              }
              function y(g) {
                var b = g && g.then
                if (g && (typeof g == 'object' || typeof g == 'function') && typeof b == 'function')
                  return function () {
                    b.apply(g, arguments)
                  }
              }
              function w(g, b) {
                var C = !1
                function N(I) {
                  C || ((C = !0), l.reject(g, I))
                }
                function P(I) {
                  C || ((C = !0), l.resolve(g, I))
                }
                var U = h(function () {
                  b(P, N)
                })
                U.status === 'error' && N(U.value)
              }
              function h(g, b) {
                var C = {}
                try {
                  ;(C.value = g(b)), (C.status = 'success')
                } catch (N) {
                  ;(C.status = 'error'), (C.value = N)
                }
                return C
              }
              ;((r.exports = m).prototype.finally = function (g) {
                if (typeof g != 'function') return this
                var b = this.constructor
                return this.then(
                  function (C) {
                    return b.resolve(g()).then(function () {
                      return C
                    })
                  },
                  function (C) {
                    return b.resolve(g()).then(function () {
                      throw C
                    })
                  }
                )
              }),
                (m.prototype.catch = function (g) {
                  return this.then(null, g)
                }),
                (m.prototype.then = function (g, b) {
                  if ((typeof g != 'function' && this.state === d) || (typeof b != 'function' && this.state === i)) return this
                  var C = new this.constructor(u)
                  return this.state !== p ? c(C, this.state === d ? g : b, this.outcome) : this.queue.push(new _(C, g, b)), C
                }),
                (_.prototype.callFulfilled = function (g) {
                  l.resolve(this.promise, g)
                }),
                (_.prototype.otherCallFulfilled = function (g) {
                  c(this.promise, this.onFulfilled, g)
                }),
                (_.prototype.callRejected = function (g) {
                  l.reject(this.promise, g)
                }),
                (_.prototype.otherCallRejected = function (g) {
                  c(this.promise, this.onRejected, g)
                }),
                (l.resolve = function (g, b) {
                  var C = h(y, b)
                  if (C.status === 'error') return l.reject(g, C.value)
                  var N = C.value
                  if (N) w(g, N)
                  else {
                    ;(g.state = d), (g.outcome = b)
                    for (var P = -1, U = g.queue.length; ++P < U; ) g.queue[P].callFulfilled(b)
                  }
                  return g
                }),
                (l.reject = function (g, b) {
                  ;(g.state = i), (g.outcome = b)
                  for (var C = -1, N = g.queue.length; ++C < N; ) g.queue[C].callRejected(b)
                  return g
                }),
                (m.resolve = function (g) {
                  return g instanceof this ? g : l.resolve(new this(u), g)
                }),
                (m.reject = function (g) {
                  var b = new this(u)
                  return l.reject(b, g)
                }),
                (m.all = function (g) {
                  var b = this
                  if (Object.prototype.toString.call(g) !== '[object Array]') return this.reject(new TypeError('must be an array'))
                  var C = g.length,
                    N = !1
                  if (!C) return this.resolve([])
                  for (var P = new Array(C), U = 0, I = -1, H = new this(u); ++I < C; ) T(g[I], I)
                  return H
                  function T(V, ee) {
                    b.resolve(V).then(
                      function (S) {
                        ;(P[ee] = S), ++U !== C || N || ((N = !0), l.resolve(H, P))
                      },
                      function (S) {
                        N || ((N = !0), l.reject(H, S))
                      }
                    )
                  }
                }),
                (m.race = function (g) {
                  var b = this
                  if (Object.prototype.toString.call(g) !== '[object Array]') return this.reject(new TypeError('must be an array'))
                  var C = g.length,
                    N = !1
                  if (!C) return this.resolve([])
                  for (var P = -1, U = new this(u); ++P < C; )
                    (I = g[P]),
                      b.resolve(I).then(
                        function (H) {
                          N || ((N = !0), l.resolve(U, H))
                        },
                        function (H) {
                          N || ((N = !0), l.reject(U, H))
                        }
                      )
                  var I
                  return U
                })
            },
            { immediate: 36 }
          ],
          38: [
            function (e, r, a) {
              var n = {}
              ;(0, e('./lib/utils/common').assign)(n, e('./lib/deflate'), e('./lib/inflate'), e('./lib/zlib/constants')), (r.exports = n)
            },
            { './lib/deflate': 39, './lib/inflate': 40, './lib/utils/common': 41, './lib/zlib/constants': 44 }
          ],
          39: [
            function (e, r, a) {
              var n = e('./zlib/deflate'),
                u = e('./utils/common'),
                l = e('./utils/strings'),
                i = e('./zlib/messages'),
                d = e('./zlib/zstream'),
                p = Object.prototype.toString,
                m = 0,
                _ = -1,
                c = 0,
                y = 8
              function w(g) {
                if (!(this instanceof w)) return new w(g)
                this.options = u.assign({ level: _, method: y, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: c, to: '' }, g || {})
                var b = this.options
                b.raw && 0 < b.windowBits ? (b.windowBits = -b.windowBits) : b.gzip && 0 < b.windowBits && b.windowBits < 16 && (b.windowBits += 16),
                  (this.err = 0),
                  (this.msg = ''),
                  (this.ended = !1),
                  (this.chunks = []),
                  (this.strm = new d()),
                  (this.strm.avail_out = 0)
                var C = n.deflateInit2(this.strm, b.level, b.method, b.windowBits, b.memLevel, b.strategy)
                if (C !== m) throw new Error(i[C])
                if ((b.header && n.deflateSetHeader(this.strm, b.header), b.dictionary)) {
                  var N
                  if (
                    ((N =
                      typeof b.dictionary == 'string' ? l.string2buf(b.dictionary) : p.call(b.dictionary) === '[object ArrayBuffer]' ? new Uint8Array(b.dictionary) : b.dictionary),
                    (C = n.deflateSetDictionary(this.strm, N)) !== m)
                  )
                    throw new Error(i[C])
                  this._dict_set = !0
                }
              }
              function h(g, b) {
                var C = new w(b)
                if ((C.push(g, !0), C.err)) throw C.msg || i[C.err]
                return C.result
              }
              ;(w.prototype.push = function (g, b) {
                var C,
                  N,
                  P = this.strm,
                  U = this.options.chunkSize
                if (this.ended) return !1
                ;(N = b === ~~b ? b : b === !0 ? 4 : 0),
                  typeof g == 'string' ? (P.input = l.string2buf(g)) : p.call(g) === '[object ArrayBuffer]' ? (P.input = new Uint8Array(g)) : (P.input = g),
                  (P.next_in = 0),
                  (P.avail_in = P.input.length)
                do {
                  if ((P.avail_out === 0 && ((P.output = new u.Buf8(U)), (P.next_out = 0), (P.avail_out = U)), (C = n.deflate(P, N)) !== 1 && C !== m))
                    return this.onEnd(C), !(this.ended = !0)
                  ;(P.avail_out !== 0 && (P.avail_in !== 0 || (N !== 4 && N !== 2))) ||
                    (this.options.to === 'string' ? this.onData(l.buf2binstring(u.shrinkBuf(P.output, P.next_out))) : this.onData(u.shrinkBuf(P.output, P.next_out)))
                } while ((0 < P.avail_in || P.avail_out === 0) && C !== 1)
                return N === 4 ? ((C = n.deflateEnd(this.strm)), this.onEnd(C), (this.ended = !0), C === m) : N !== 2 || (this.onEnd(m), !(P.avail_out = 0))
              }),
                (w.prototype.onData = function (g) {
                  this.chunks.push(g)
                }),
                (w.prototype.onEnd = function (g) {
                  g === m && (this.options.to === 'string' ? (this.result = this.chunks.join('')) : (this.result = u.flattenChunks(this.chunks))),
                    (this.chunks = []),
                    (this.err = g),
                    (this.msg = this.strm.msg)
                }),
                (a.Deflate = w),
                (a.deflate = h),
                (a.deflateRaw = function (g, b) {
                  return ((b = b || {}).raw = !0), h(g, b)
                }),
                (a.gzip = function (g, b) {
                  return ((b = b || {}).gzip = !0), h(g, b)
                })
            },
            { './utils/common': 41, './utils/strings': 42, './zlib/deflate': 46, './zlib/messages': 51, './zlib/zstream': 53 }
          ],
          40: [
            function (e, r, a) {
              var n = e('./zlib/inflate'),
                u = e('./utils/common'),
                l = e('./utils/strings'),
                i = e('./zlib/constants'),
                d = e('./zlib/messages'),
                p = e('./zlib/zstream'),
                m = e('./zlib/gzheader'),
                _ = Object.prototype.toString
              function c(w) {
                if (!(this instanceof c)) return new c(w)
                this.options = u.assign({ chunkSize: 16384, windowBits: 0, to: '' }, w || {})
                var h = this.options
                h.raw && 0 <= h.windowBits && h.windowBits < 16 && ((h.windowBits = -h.windowBits), h.windowBits === 0 && (h.windowBits = -15)),
                  !(0 <= h.windowBits && h.windowBits < 16) || (w && w.windowBits) || (h.windowBits += 32),
                  15 < h.windowBits && h.windowBits < 48 && (15 & h.windowBits) == 0 && (h.windowBits |= 15),
                  (this.err = 0),
                  (this.msg = ''),
                  (this.ended = !1),
                  (this.chunks = []),
                  (this.strm = new p()),
                  (this.strm.avail_out = 0)
                var g = n.inflateInit2(this.strm, h.windowBits)
                if (g !== i.Z_OK) throw new Error(d[g])
                ;(this.header = new m()), n.inflateGetHeader(this.strm, this.header)
              }
              function y(w, h) {
                var g = new c(h)
                if ((g.push(w, !0), g.err)) throw g.msg || d[g.err]
                return g.result
              }
              ;(c.prototype.push = function (w, h) {
                var g,
                  b,
                  C,
                  N,
                  P,
                  U,
                  I = this.strm,
                  H = this.options.chunkSize,
                  T = this.options.dictionary,
                  V = !1
                if (this.ended) return !1
                ;(b = h === ~~h ? h : h === !0 ? i.Z_FINISH : i.Z_NO_FLUSH),
                  typeof w == 'string' ? (I.input = l.binstring2buf(w)) : _.call(w) === '[object ArrayBuffer]' ? (I.input = new Uint8Array(w)) : (I.input = w),
                  (I.next_in = 0),
                  (I.avail_in = I.input.length)
                do {
                  if (
                    (I.avail_out === 0 && ((I.output = new u.Buf8(H)), (I.next_out = 0), (I.avail_out = H)),
                    (g = n.inflate(I, i.Z_NO_FLUSH)) === i.Z_NEED_DICT &&
                      T &&
                      ((U = typeof T == 'string' ? l.string2buf(T) : _.call(T) === '[object ArrayBuffer]' ? new Uint8Array(T) : T), (g = n.inflateSetDictionary(this.strm, U))),
                    g === i.Z_BUF_ERROR && V === !0 && ((g = i.Z_OK), (V = !1)),
                    g !== i.Z_STREAM_END && g !== i.Z_OK)
                  )
                    return this.onEnd(g), !(this.ended = !0)
                  I.next_out &&
                    ((I.avail_out !== 0 && g !== i.Z_STREAM_END && (I.avail_in !== 0 || (b !== i.Z_FINISH && b !== i.Z_SYNC_FLUSH))) ||
                      (this.options.to === 'string'
                        ? ((C = l.utf8border(I.output, I.next_out)),
                          (N = I.next_out - C),
                          (P = l.buf2string(I.output, C)),
                          (I.next_out = N),
                          (I.avail_out = H - N),
                          N && u.arraySet(I.output, I.output, C, N, 0),
                          this.onData(P))
                        : this.onData(u.shrinkBuf(I.output, I.next_out)))),
                    I.avail_in === 0 && I.avail_out === 0 && (V = !0)
                } while ((0 < I.avail_in || I.avail_out === 0) && g !== i.Z_STREAM_END)
                return (
                  g === i.Z_STREAM_END && (b = i.Z_FINISH),
                  b === i.Z_FINISH
                    ? ((g = n.inflateEnd(this.strm)), this.onEnd(g), (this.ended = !0), g === i.Z_OK)
                    : b !== i.Z_SYNC_FLUSH || (this.onEnd(i.Z_OK), !(I.avail_out = 0))
                )
              }),
                (c.prototype.onData = function (w) {
                  this.chunks.push(w)
                }),
                (c.prototype.onEnd = function (w) {
                  w === i.Z_OK && (this.options.to === 'string' ? (this.result = this.chunks.join('')) : (this.result = u.flattenChunks(this.chunks))),
                    (this.chunks = []),
                    (this.err = w),
                    (this.msg = this.strm.msg)
                }),
                (a.Inflate = c),
                (a.inflate = y),
                (a.inflateRaw = function (w, h) {
                  return ((h = h || {}).raw = !0), y(w, h)
                }),
                (a.ungzip = y)
            },
            { './utils/common': 41, './utils/strings': 42, './zlib/constants': 44, './zlib/gzheader': 47, './zlib/inflate': 49, './zlib/messages': 51, './zlib/zstream': 53 }
          ],
          41: [
            function (e, r, a) {
              var n = typeof Uint8Array != 'undefined' && typeof Uint16Array != 'undefined' && typeof Int32Array != 'undefined'
              ;(a.assign = function (i) {
                for (var d = Array.prototype.slice.call(arguments, 1); d.length; ) {
                  var p = d.shift()
                  if (p) {
                    if (typeof p != 'object') throw new TypeError(p + 'must be non-object')
                    for (var m in p) p.hasOwnProperty(m) && (i[m] = p[m])
                  }
                }
                return i
              }),
                (a.shrinkBuf = function (i, d) {
                  return i.length === d ? i : i.subarray ? i.subarray(0, d) : ((i.length = d), i)
                })
              var u = {
                  arraySet: function (i, d, p, m, _) {
                    if (d.subarray && i.subarray) i.set(d.subarray(p, p + m), _)
                    else for (var c = 0; c < m; c++) i[_ + c] = d[p + c]
                  },
                  flattenChunks: function (i) {
                    var d, p, m, _, c, y
                    for (d = m = 0, p = i.length; d < p; d++) m += i[d].length
                    for (y = new Uint8Array(m), d = _ = 0, p = i.length; d < p; d++) (c = i[d]), y.set(c, _), (_ += c.length)
                    return y
                  }
                },
                l = {
                  arraySet: function (i, d, p, m, _) {
                    for (var c = 0; c < m; c++) i[_ + c] = d[p + c]
                  },
                  flattenChunks: function (i) {
                    return [].concat.apply([], i)
                  }
                }
              ;(a.setTyped = function (i) {
                i
                  ? ((a.Buf8 = Uint8Array), (a.Buf16 = Uint16Array), (a.Buf32 = Int32Array), a.assign(a, u))
                  : ((a.Buf8 = Array), (a.Buf16 = Array), (a.Buf32 = Array), a.assign(a, l))
              }),
                a.setTyped(n)
            },
            {}
          ],
          42: [
            function (e, r, a) {
              var n = e('./common'),
                u = !0,
                l = !0
              try {
                String.fromCharCode.apply(null, [0])
              } catch {
                u = !1
              }
              try {
                String.fromCharCode.apply(null, new Uint8Array(1))
              } catch {
                l = !1
              }
              for (var i = new n.Buf8(256), d = 0; d < 256; d++) i[d] = 252 <= d ? 6 : 248 <= d ? 5 : 240 <= d ? 4 : 224 <= d ? 3 : 192 <= d ? 2 : 1
              function p(m, _) {
                if (_ < 65537 && ((m.subarray && l) || (!m.subarray && u))) return String.fromCharCode.apply(null, n.shrinkBuf(m, _))
                for (var c = '', y = 0; y < _; y++) c += String.fromCharCode(m[y])
                return c
              }
              ;(i[254] = i[254] = 1),
                (a.string2buf = function (m) {
                  var _,
                    c,
                    y,
                    w,
                    h,
                    g = m.length,
                    b = 0
                  for (w = 0; w < g; w++)
                    (64512 & (c = m.charCodeAt(w))) == 55296 && w + 1 < g && (64512 & (y = m.charCodeAt(w + 1))) == 56320 && ((c = 65536 + ((c - 55296) << 10) + (y - 56320)), w++),
                      (b += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4)
                  for (_ = new n.Buf8(b), w = h = 0; h < b; w++)
                    (64512 & (c = m.charCodeAt(w))) == 55296 && w + 1 < g && (64512 & (y = m.charCodeAt(w + 1))) == 56320 && ((c = 65536 + ((c - 55296) << 10) + (y - 56320)), w++),
                      c < 128
                        ? (_[h++] = c)
                        : (c < 2048
                            ? (_[h++] = 192 | (c >>> 6))
                            : (c < 65536 ? (_[h++] = 224 | (c >>> 12)) : ((_[h++] = 240 | (c >>> 18)), (_[h++] = 128 | ((c >>> 12) & 63))), (_[h++] = 128 | ((c >>> 6) & 63))),
                          (_[h++] = 128 | (63 & c)))
                  return _
                }),
                (a.buf2binstring = function (m) {
                  return p(m, m.length)
                }),
                (a.binstring2buf = function (m) {
                  for (var _ = new n.Buf8(m.length), c = 0, y = _.length; c < y; c++) _[c] = m.charCodeAt(c)
                  return _
                }),
                (a.buf2string = function (m, _) {
                  var c,
                    y,
                    w,
                    h,
                    g = _ || m.length,
                    b = new Array(2 * g)
                  for (c = y = 0; c < g; )
                    if ((w = m[c++]) < 128) b[y++] = w
                    else if (4 < (h = i[w])) (b[y++] = 65533), (c += h - 1)
                    else {
                      for (w &= h === 2 ? 31 : h === 3 ? 15 : 7; 1 < h && c < g; ) (w = (w << 6) | (63 & m[c++])), h--
                      1 < h ? (b[y++] = 65533) : w < 65536 ? (b[y++] = w) : ((w -= 65536), (b[y++] = 55296 | ((w >> 10) & 1023)), (b[y++] = 56320 | (1023 & w)))
                    }
                  return p(b, y)
                }),
                (a.utf8border = function (m, _) {
                  var c
                  for ((_ = _ || m.length) > m.length && (_ = m.length), c = _ - 1; 0 <= c && (192 & m[c]) == 128; ) c--
                  return c < 0 || c === 0 ? _ : c + i[m[c]] > _ ? c : _
                })
            },
            { './common': 41 }
          ],
          43: [
            function (e, r, a) {
              r.exports = function (n, u, l, i) {
                for (var d = (65535 & n) | 0, p = ((n >>> 16) & 65535) | 0, m = 0; l !== 0; ) {
                  for (l -= m = 2e3 < l ? 2e3 : l; (p = (p + (d = (d + u[i++]) | 0)) | 0), --m; );
                  ;(d %= 65521), (p %= 65521)
                }
                return d | (p << 16) | 0
              }
            },
            {}
          ],
          44: [
            function (e, r, a) {
              r.exports = {
                Z_NO_FLUSH: 0,
                Z_PARTIAL_FLUSH: 1,
                Z_SYNC_FLUSH: 2,
                Z_FULL_FLUSH: 3,
                Z_FINISH: 4,
                Z_BLOCK: 5,
                Z_TREES: 6,
                Z_OK: 0,
                Z_STREAM_END: 1,
                Z_NEED_DICT: 2,
                Z_ERRNO: -1,
                Z_STREAM_ERROR: -2,
                Z_DATA_ERROR: -3,
                Z_BUF_ERROR: -5,
                Z_NO_COMPRESSION: 0,
                Z_BEST_SPEED: 1,
                Z_BEST_COMPRESSION: 9,
                Z_DEFAULT_COMPRESSION: -1,
                Z_FILTERED: 1,
                Z_HUFFMAN_ONLY: 2,
                Z_RLE: 3,
                Z_FIXED: 4,
                Z_DEFAULT_STRATEGY: 0,
                Z_BINARY: 0,
                Z_TEXT: 1,
                Z_UNKNOWN: 2,
                Z_DEFLATED: 8
              }
            },
            {}
          ],
          45: [
            function (e, r, a) {
              var n = (function () {
                for (var u, l = [], i = 0; i < 256; i++) {
                  u = i
                  for (var d = 0; d < 8; d++) u = 1 & u ? 3988292384 ^ (u >>> 1) : u >>> 1
                  l[i] = u
                }
                return l
              })()
              r.exports = function (u, l, i, d) {
                var p = n,
                  m = d + i
                u ^= -1
                for (var _ = d; _ < m; _++) u = (u >>> 8) ^ p[255 & (u ^ l[_])]
                return -1 ^ u
              }
            },
            {}
          ],
          46: [
            function (e, r, a) {
              var n,
                u = e('../utils/common'),
                l = e('./trees'),
                i = e('./adler32'),
                d = e('./crc32'),
                p = e('./messages'),
                m = 0,
                _ = 4,
                c = 0,
                y = -2,
                w = -1,
                h = 4,
                g = 2,
                b = 8,
                C = 9,
                N = 286,
                P = 30,
                U = 19,
                I = 2 * N + 1,
                H = 15,
                T = 3,
                V = 258,
                ee = V + T + 1,
                S = 42,
                R = 113,
                o = 1,
                D = 2,
                re = 3,
                M = 4
              function ne(s, O) {
                return (s.msg = p[O]), O
              }
              function W(s) {
                return (s << 1) - (4 < s ? 9 : 0)
              }
              function te(s) {
                for (var O = s.length; 0 <= --O; ) s[O] = 0
              }
              function B(s) {
                var O = s.state,
                  F = O.pending
                F > s.avail_out && (F = s.avail_out),
                  F !== 0 &&
                    (u.arraySet(s.output, O.pending_buf, O.pending_out, F, s.next_out),
                    (s.next_out += F),
                    (O.pending_out += F),
                    (s.total_out += F),
                    (s.avail_out -= F),
                    (O.pending -= F),
                    O.pending === 0 && (O.pending_out = 0))
              }
              function x(s, O) {
                l._tr_flush_block(s, 0 <= s.block_start ? s.block_start : -1, s.strstart - s.block_start, O), (s.block_start = s.strstart), B(s.strm)
              }
              function Q(s, O) {
                s.pending_buf[s.pending++] = O
              }
              function K(s, O) {
                ;(s.pending_buf[s.pending++] = (O >>> 8) & 255), (s.pending_buf[s.pending++] = 255 & O)
              }
              function G(s, O) {
                var F,
                  k,
                  v = s.max_chain_length,
                  A = s.strstart,
                  L = s.prev_length,
                  j = s.nice_match,
                  E = s.strstart > s.w_size - ee ? s.strstart - (s.w_size - ee) : 0,
                  Z = s.window,
                  Y = s.w_mask,
                  $ = s.prev,
                  J = s.strstart + V,
                  le = Z[A + L - 1],
                  ie = Z[A + L]
                s.prev_length >= s.good_match && (v >>= 2), j > s.lookahead && (j = s.lookahead)
                do
                  if (Z[(F = O) + L] === ie && Z[F + L - 1] === le && Z[F] === Z[A] && Z[++F] === Z[A + 1]) {
                    ;(A += 2), F++
                    do;
                    while (
                      Z[++A] === Z[++F] &&
                      Z[++A] === Z[++F] &&
                      Z[++A] === Z[++F] &&
                      Z[++A] === Z[++F] &&
                      Z[++A] === Z[++F] &&
                      Z[++A] === Z[++F] &&
                      Z[++A] === Z[++F] &&
                      Z[++A] === Z[++F] &&
                      A < J
                    )
                    if (((k = V - (J - A)), (A = J - V), L < k)) {
                      if (((s.match_start = O), j <= (L = k))) break
                      ;(le = Z[A + L - 1]), (ie = Z[A + L])
                    }
                  }
                while ((O = $[O & Y]) > E && --v != 0)
                return L <= s.lookahead ? L : s.lookahead
              }
              function he(s) {
                var O,
                  F,
                  k,
                  v,
                  A,
                  L,
                  j,
                  E,
                  Z,
                  Y,
                  $ = s.w_size
                do {
                  if (((v = s.window_size - s.lookahead - s.strstart), s.strstart >= $ + ($ - ee))) {
                    for (
                      u.arraySet(s.window, s.window, $, $, 0), s.match_start -= $, s.strstart -= $, s.block_start -= $, O = F = s.hash_size;
                      (k = s.head[--O]), (s.head[O] = $ <= k ? k - $ : 0), --F;

                    );
                    for (O = F = $; (k = s.prev[--O]), (s.prev[O] = $ <= k ? k - $ : 0), --F; );
                    v += $
                  }
                  if (s.strm.avail_in === 0) break
                  if (
                    ((L = s.strm),
                    (j = s.window),
                    (E = s.strstart + s.lookahead),
                    (Z = v),
                    (Y = void 0),
                    (Y = L.avail_in),
                    Z < Y && (Y = Z),
                    (F =
                      Y === 0
                        ? 0
                        : ((L.avail_in -= Y),
                          u.arraySet(j, L.input, L.next_in, Y, E),
                          L.state.wrap === 1 ? (L.adler = i(L.adler, j, Y, E)) : L.state.wrap === 2 && (L.adler = d(L.adler, j, Y, E)),
                          (L.next_in += Y),
                          (L.total_in += Y),
                          Y)),
                    (s.lookahead += F),
                    s.lookahead + s.insert >= T)
                  )
                    for (
                      A = s.strstart - s.insert, s.ins_h = s.window[A], s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[A + 1]) & s.hash_mask;
                      s.insert &&
                      ((s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[A + T - 1]) & s.hash_mask),
                      (s.prev[A & s.w_mask] = s.head[s.ins_h]),
                      (s.head[s.ins_h] = A),
                      A++,
                      s.insert--,
                      !(s.lookahead + s.insert < T));

                    );
                } while (s.lookahead < ee && s.strm.avail_in !== 0)
              }
              function be(s, O) {
                for (var F, k; ; ) {
                  if (s.lookahead < ee) {
                    if ((he(s), s.lookahead < ee && O === m)) return o
                    if (s.lookahead === 0) break
                  }
                  if (
                    ((F = 0),
                    s.lookahead >= T &&
                      ((s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + T - 1]) & s.hash_mask),
                      (F = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h]),
                      (s.head[s.ins_h] = s.strstart)),
                    F !== 0 && s.strstart - F <= s.w_size - ee && (s.match_length = G(s, F)),
                    s.match_length >= T)
                  )
                    if (
                      ((k = l._tr_tally(s, s.strstart - s.match_start, s.match_length - T)),
                      (s.lookahead -= s.match_length),
                      s.match_length <= s.max_lazy_match && s.lookahead >= T)
                    ) {
                      for (
                        s.match_length--;
                        s.strstart++,
                          (s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + T - 1]) & s.hash_mask),
                          (F = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h]),
                          (s.head[s.ins_h] = s.strstart),
                          --s.match_length != 0;

                      );
                      s.strstart++
                    } else
                      (s.strstart += s.match_length),
                        (s.match_length = 0),
                        (s.ins_h = s.window[s.strstart]),
                        (s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask)
                  else (k = l._tr_tally(s, 0, s.window[s.strstart])), s.lookahead--, s.strstart++
                  if (k && (x(s, !1), s.strm.avail_out === 0)) return o
                }
                return (
                  (s.insert = s.strstart < T - 1 ? s.strstart : T - 1),
                  O === _ ? (x(s, !0), s.strm.avail_out === 0 ? re : M) : s.last_lit && (x(s, !1), s.strm.avail_out === 0) ? o : D
                )
              }
              function se(s, O) {
                for (var F, k, v; ; ) {
                  if (s.lookahead < ee) {
                    if ((he(s), s.lookahead < ee && O === m)) return o
                    if (s.lookahead === 0) break
                  }
                  if (
                    ((F = 0),
                    s.lookahead >= T &&
                      ((s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + T - 1]) & s.hash_mask),
                      (F = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h]),
                      (s.head[s.ins_h] = s.strstart)),
                    (s.prev_length = s.match_length),
                    (s.prev_match = s.match_start),
                    (s.match_length = T - 1),
                    F !== 0 &&
                      s.prev_length < s.max_lazy_match &&
                      s.strstart - F <= s.w_size - ee &&
                      ((s.match_length = G(s, F)),
                      s.match_length <= 5 && (s.strategy === 1 || (s.match_length === T && 4096 < s.strstart - s.match_start)) && (s.match_length = T - 1)),
                    s.prev_length >= T && s.match_length <= s.prev_length)
                  ) {
                    for (
                      v = s.strstart + s.lookahead - T, k = l._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - T), s.lookahead -= s.prev_length - 1, s.prev_length -= 2;
                      ++s.strstart <= v &&
                        ((s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + T - 1]) & s.hash_mask),
                        (F = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h]),
                        (s.head[s.ins_h] = s.strstart)),
                        --s.prev_length != 0;

                    );
                    if (((s.match_available = 0), (s.match_length = T - 1), s.strstart++, k && (x(s, !1), s.strm.avail_out === 0))) return o
                  } else if (s.match_available) {
                    if (((k = l._tr_tally(s, 0, s.window[s.strstart - 1])) && x(s, !1), s.strstart++, s.lookahead--, s.strm.avail_out === 0)) return o
                  } else (s.match_available = 1), s.strstart++, s.lookahead--
                }
                return (
                  s.match_available && ((k = l._tr_tally(s, 0, s.window[s.strstart - 1])), (s.match_available = 0)),
                  (s.insert = s.strstart < T - 1 ? s.strstart : T - 1),
                  O === _ ? (x(s, !0), s.strm.avail_out === 0 ? re : M) : s.last_lit && (x(s, !1), s.strm.avail_out === 0) ? o : D
                )
              }
              function oe(s, O, F, k, v) {
                ;(this.good_length = s), (this.max_lazy = O), (this.nice_length = F), (this.max_chain = k), (this.func = v)
              }
              function me() {
                ;(this.strm = null),
                  (this.status = 0),
                  (this.pending_buf = null),
                  (this.pending_buf_size = 0),
                  (this.pending_out = 0),
                  (this.pending = 0),
                  (this.wrap = 0),
                  (this.gzhead = null),
                  (this.gzindex = 0),
                  (this.method = b),
                  (this.last_flush = -1),
                  (this.w_size = 0),
                  (this.w_bits = 0),
                  (this.w_mask = 0),
                  (this.window = null),
                  (this.window_size = 0),
                  (this.prev = null),
                  (this.head = null),
                  (this.ins_h = 0),
                  (this.hash_size = 0),
                  (this.hash_bits = 0),
                  (this.hash_mask = 0),
                  (this.hash_shift = 0),
                  (this.block_start = 0),
                  (this.match_length = 0),
                  (this.prev_match = 0),
                  (this.match_available = 0),
                  (this.strstart = 0),
                  (this.match_start = 0),
                  (this.lookahead = 0),
                  (this.prev_length = 0),
                  (this.max_chain_length = 0),
                  (this.max_lazy_match = 0),
                  (this.level = 0),
                  (this.strategy = 0),
                  (this.good_match = 0),
                  (this.nice_match = 0),
                  (this.dyn_ltree = new u.Buf16(2 * I)),
                  (this.dyn_dtree = new u.Buf16(2 * (2 * P + 1))),
                  (this.bl_tree = new u.Buf16(2 * (2 * U + 1))),
                  te(this.dyn_ltree),
                  te(this.dyn_dtree),
                  te(this.bl_tree),
                  (this.l_desc = null),
                  (this.d_desc = null),
                  (this.bl_desc = null),
                  (this.bl_count = new u.Buf16(H + 1)),
                  (this.heap = new u.Buf16(2 * N + 1)),
                  te(this.heap),
                  (this.heap_len = 0),
                  (this.heap_max = 0),
                  (this.depth = new u.Buf16(2 * N + 1)),
                  te(this.depth),
                  (this.l_buf = 0),
                  (this.lit_bufsize = 0),
                  (this.last_lit = 0),
                  (this.d_buf = 0),
                  (this.opt_len = 0),
                  (this.static_len = 0),
                  (this.matches = 0),
                  (this.insert = 0),
                  (this.bi_buf = 0),
                  (this.bi_valid = 0)
              }
              function fe(s) {
                var O
                return s && s.state
                  ? ((s.total_in = s.total_out = 0),
                    (s.data_type = g),
                    ((O = s.state).pending = 0),
                    (O.pending_out = 0),
                    O.wrap < 0 && (O.wrap = -O.wrap),
                    (O.status = O.wrap ? S : R),
                    (s.adler = O.wrap === 2 ? 0 : 1),
                    (O.last_flush = m),
                    l._tr_init(O),
                    c)
                  : ne(s, y)
              }
              function we(s) {
                var O = fe(s)
                return (
                  O === c &&
                    (function (F) {
                      ;(F.window_size = 2 * F.w_size),
                        te(F.head),
                        (F.max_lazy_match = n[F.level].max_lazy),
                        (F.good_match = n[F.level].good_length),
                        (F.nice_match = n[F.level].nice_length),
                        (F.max_chain_length = n[F.level].max_chain),
                        (F.strstart = 0),
                        (F.block_start = 0),
                        (F.lookahead = 0),
                        (F.insert = 0),
                        (F.match_length = F.prev_length = T - 1),
                        (F.match_available = 0),
                        (F.ins_h = 0)
                    })(s.state),
                  O
                )
              }
              function ke(s, O, F, k, v, A) {
                if (!s) return y
                var L = 1
                if (
                  (O === w && (O = 6),
                  k < 0 ? ((L = 0), (k = -k)) : 15 < k && ((L = 2), (k -= 16)),
                  v < 1 || C < v || F !== b || k < 8 || 15 < k || O < 0 || 9 < O || A < 0 || h < A)
                )
                  return ne(s, y)
                k === 8 && (k = 9)
                var j = new me()
                return (
                  ((s.state = j).strm = s),
                  (j.wrap = L),
                  (j.gzhead = null),
                  (j.w_bits = k),
                  (j.w_size = 1 << j.w_bits),
                  (j.w_mask = j.w_size - 1),
                  (j.hash_bits = v + 7),
                  (j.hash_size = 1 << j.hash_bits),
                  (j.hash_mask = j.hash_size - 1),
                  (j.hash_shift = ~~((j.hash_bits + T - 1) / T)),
                  (j.window = new u.Buf8(2 * j.w_size)),
                  (j.head = new u.Buf16(j.hash_size)),
                  (j.prev = new u.Buf16(j.w_size)),
                  (j.lit_bufsize = 1 << (v + 6)),
                  (j.pending_buf_size = 4 * j.lit_bufsize),
                  (j.pending_buf = new u.Buf8(j.pending_buf_size)),
                  (j.d_buf = 1 * j.lit_bufsize),
                  (j.l_buf = 3 * j.lit_bufsize),
                  (j.level = O),
                  (j.strategy = A),
                  (j.method = F),
                  we(s)
                )
              }
              ;(n = [
                new oe(0, 0, 0, 0, function (s, O) {
                  var F = 65535
                  for (F > s.pending_buf_size - 5 && (F = s.pending_buf_size - 5); ; ) {
                    if (s.lookahead <= 1) {
                      if ((he(s), s.lookahead === 0 && O === m)) return o
                      if (s.lookahead === 0) break
                    }
                    ;(s.strstart += s.lookahead), (s.lookahead = 0)
                    var k = s.block_start + F
                    if (
                      ((s.strstart === 0 || s.strstart >= k) && ((s.lookahead = s.strstart - k), (s.strstart = k), x(s, !1), s.strm.avail_out === 0)) ||
                      (s.strstart - s.block_start >= s.w_size - ee && (x(s, !1), s.strm.avail_out === 0))
                    )
                      return o
                  }
                  return (s.insert = 0), O === _ ? (x(s, !0), s.strm.avail_out === 0 ? re : M) : (s.strstart > s.block_start && (x(s, !1), s.strm.avail_out), o)
                }),
                new oe(4, 4, 8, 4, be),
                new oe(4, 5, 16, 8, be),
                new oe(4, 6, 32, 32, be),
                new oe(4, 4, 16, 16, se),
                new oe(8, 16, 32, 32, se),
                new oe(8, 16, 128, 128, se),
                new oe(8, 32, 128, 256, se),
                new oe(32, 128, 258, 1024, se),
                new oe(32, 258, 258, 4096, se)
              ]),
                (a.deflateInit = function (s, O) {
                  return ke(s, O, b, 15, 8, 0)
                }),
                (a.deflateInit2 = ke),
                (a.deflateReset = we),
                (a.deflateResetKeep = fe),
                (a.deflateSetHeader = function (s, O) {
                  return s && s.state ? (s.state.wrap !== 2 ? y : ((s.state.gzhead = O), c)) : y
                }),
                (a.deflate = function (s, O) {
                  var F, k, v, A
                  if (!s || !s.state || 5 < O || O < 0) return s ? ne(s, y) : y
                  if (((k = s.state), !s.output || (!s.input && s.avail_in !== 0) || (k.status === 666 && O !== _))) return ne(s, s.avail_out === 0 ? -5 : y)
                  if (((k.strm = s), (F = k.last_flush), (k.last_flush = O), k.status === S))
                    if (k.wrap === 2)
                      (s.adler = 0),
                        Q(k, 31),
                        Q(k, 139),
                        Q(k, 8),
                        k.gzhead
                          ? (Q(k, (k.gzhead.text ? 1 : 0) + (k.gzhead.hcrc ? 2 : 0) + (k.gzhead.extra ? 4 : 0) + (k.gzhead.name ? 8 : 0) + (k.gzhead.comment ? 16 : 0)),
                            Q(k, 255 & k.gzhead.time),
                            Q(k, (k.gzhead.time >> 8) & 255),
                            Q(k, (k.gzhead.time >> 16) & 255),
                            Q(k, (k.gzhead.time >> 24) & 255),
                            Q(k, k.level === 9 ? 2 : 2 <= k.strategy || k.level < 2 ? 4 : 0),
                            Q(k, 255 & k.gzhead.os),
                            k.gzhead.extra && k.gzhead.extra.length && (Q(k, 255 & k.gzhead.extra.length), Q(k, (k.gzhead.extra.length >> 8) & 255)),
                            k.gzhead.hcrc && (s.adler = d(s.adler, k.pending_buf, k.pending, 0)),
                            (k.gzindex = 0),
                            (k.status = 69))
                          : (Q(k, 0), Q(k, 0), Q(k, 0), Q(k, 0), Q(k, 0), Q(k, k.level === 9 ? 2 : 2 <= k.strategy || k.level < 2 ? 4 : 0), Q(k, 3), (k.status = R))
                    else {
                      var L = (b + ((k.w_bits - 8) << 4)) << 8
                      ;(L |= (2 <= k.strategy || k.level < 2 ? 0 : k.level < 6 ? 1 : k.level === 6 ? 2 : 3) << 6),
                        k.strstart !== 0 && (L |= 32),
                        (L += 31 - (L % 31)),
                        (k.status = R),
                        K(k, L),
                        k.strstart !== 0 && (K(k, s.adler >>> 16), K(k, 65535 & s.adler)),
                        (s.adler = 1)
                    }
                  if (k.status === 69)
                    if (k.gzhead.extra) {
                      for (
                        v = k.pending;
                        k.gzindex < (65535 & k.gzhead.extra.length) &&
                        (k.pending !== k.pending_buf_size ||
                          (k.gzhead.hcrc && k.pending > v && (s.adler = d(s.adler, k.pending_buf, k.pending - v, v)), B(s), (v = k.pending), k.pending !== k.pending_buf_size));

                      )
                        Q(k, 255 & k.gzhead.extra[k.gzindex]), k.gzindex++
                      k.gzhead.hcrc && k.pending > v && (s.adler = d(s.adler, k.pending_buf, k.pending - v, v)),
                        k.gzindex === k.gzhead.extra.length && ((k.gzindex = 0), (k.status = 73))
                    } else k.status = 73
                  if (k.status === 73)
                    if (k.gzhead.name) {
                      v = k.pending
                      do {
                        if (
                          k.pending === k.pending_buf_size &&
                          (k.gzhead.hcrc && k.pending > v && (s.adler = d(s.adler, k.pending_buf, k.pending - v, v)), B(s), (v = k.pending), k.pending === k.pending_buf_size)
                        ) {
                          A = 1
                          break
                        }
                        ;(A = k.gzindex < k.gzhead.name.length ? 255 & k.gzhead.name.charCodeAt(k.gzindex++) : 0), Q(k, A)
                      } while (A !== 0)
                      k.gzhead.hcrc && k.pending > v && (s.adler = d(s.adler, k.pending_buf, k.pending - v, v)), A === 0 && ((k.gzindex = 0), (k.status = 91))
                    } else k.status = 91
                  if (k.status === 91)
                    if (k.gzhead.comment) {
                      v = k.pending
                      do {
                        if (
                          k.pending === k.pending_buf_size &&
                          (k.gzhead.hcrc && k.pending > v && (s.adler = d(s.adler, k.pending_buf, k.pending - v, v)), B(s), (v = k.pending), k.pending === k.pending_buf_size)
                        ) {
                          A = 1
                          break
                        }
                        ;(A = k.gzindex < k.gzhead.comment.length ? 255 & k.gzhead.comment.charCodeAt(k.gzindex++) : 0), Q(k, A)
                      } while (A !== 0)
                      k.gzhead.hcrc && k.pending > v && (s.adler = d(s.adler, k.pending_buf, k.pending - v, v)), A === 0 && (k.status = 103)
                    } else k.status = 103
                  if (
                    (k.status === 103 &&
                      (k.gzhead.hcrc
                        ? (k.pending + 2 > k.pending_buf_size && B(s),
                          k.pending + 2 <= k.pending_buf_size && (Q(k, 255 & s.adler), Q(k, (s.adler >> 8) & 255), (s.adler = 0), (k.status = R)))
                        : (k.status = R)),
                    k.pending !== 0)
                  ) {
                    if ((B(s), s.avail_out === 0)) return (k.last_flush = -1), c
                  } else if (s.avail_in === 0 && W(O) <= W(F) && O !== _) return ne(s, -5)
                  if (k.status === 666 && s.avail_in !== 0) return ne(s, -5)
                  if (s.avail_in !== 0 || k.lookahead !== 0 || (O !== m && k.status !== 666)) {
                    var j =
                      k.strategy === 2
                        ? (function (E, Z) {
                            for (var Y; ; ) {
                              if (E.lookahead === 0 && (he(E), E.lookahead === 0)) {
                                if (Z === m) return o
                                break
                              }
                              if (((E.match_length = 0), (Y = l._tr_tally(E, 0, E.window[E.strstart])), E.lookahead--, E.strstart++, Y && (x(E, !1), E.strm.avail_out === 0)))
                                return o
                            }
                            return (E.insert = 0), Z === _ ? (x(E, !0), E.strm.avail_out === 0 ? re : M) : E.last_lit && (x(E, !1), E.strm.avail_out === 0) ? o : D
                          })(k, O)
                        : k.strategy === 3
                        ? (function (E, Z) {
                            for (var Y, $, J, le, ie = E.window; ; ) {
                              if (E.lookahead <= V) {
                                if ((he(E), E.lookahead <= V && Z === m)) return o
                                if (E.lookahead === 0) break
                              }
                              if (((E.match_length = 0), E.lookahead >= T && 0 < E.strstart && ($ = ie[(J = E.strstart - 1)]) === ie[++J] && $ === ie[++J] && $ === ie[++J])) {
                                le = E.strstart + V
                                do;
                                while (
                                  $ === ie[++J] &&
                                  $ === ie[++J] &&
                                  $ === ie[++J] &&
                                  $ === ie[++J] &&
                                  $ === ie[++J] &&
                                  $ === ie[++J] &&
                                  $ === ie[++J] &&
                                  $ === ie[++J] &&
                                  J < le
                                )
                                ;(E.match_length = V - (le - J)), E.match_length > E.lookahead && (E.match_length = E.lookahead)
                              }
                              if (
                                (E.match_length >= T
                                  ? ((Y = l._tr_tally(E, 1, E.match_length - T)), (E.lookahead -= E.match_length), (E.strstart += E.match_length), (E.match_length = 0))
                                  : ((Y = l._tr_tally(E, 0, E.window[E.strstart])), E.lookahead--, E.strstart++),
                                Y && (x(E, !1), E.strm.avail_out === 0))
                              )
                                return o
                            }
                            return (E.insert = 0), Z === _ ? (x(E, !0), E.strm.avail_out === 0 ? re : M) : E.last_lit && (x(E, !1), E.strm.avail_out === 0) ? o : D
                          })(k, O)
                        : n[k.level].func(k, O)
                    if (((j !== re && j !== M) || (k.status = 666), j === o || j === re)) return s.avail_out === 0 && (k.last_flush = -1), c
                    if (
                      j === D &&
                      (O === 1
                        ? l._tr_align(k)
                        : O !== 5 && (l._tr_stored_block(k, 0, 0, !1), O === 3 && (te(k.head), k.lookahead === 0 && ((k.strstart = 0), (k.block_start = 0), (k.insert = 0)))),
                      B(s),
                      s.avail_out === 0)
                    )
                      return (k.last_flush = -1), c
                  }
                  return O !== _
                    ? c
                    : k.wrap <= 0
                    ? 1
                    : (k.wrap === 2
                        ? (Q(k, 255 & s.adler),
                          Q(k, (s.adler >> 8) & 255),
                          Q(k, (s.adler >> 16) & 255),
                          Q(k, (s.adler >> 24) & 255),
                          Q(k, 255 & s.total_in),
                          Q(k, (s.total_in >> 8) & 255),
                          Q(k, (s.total_in >> 16) & 255),
                          Q(k, (s.total_in >> 24) & 255))
                        : (K(k, s.adler >>> 16), K(k, 65535 & s.adler)),
                      B(s),
                      0 < k.wrap && (k.wrap = -k.wrap),
                      k.pending !== 0 ? c : 1)
                }),
                (a.deflateEnd = function (s) {
                  var O
                  return s && s.state
                    ? (O = s.state.status) !== S && O !== 69 && O !== 73 && O !== 91 && O !== 103 && O !== R && O !== 666
                      ? ne(s, y)
                      : ((s.state = null), O === R ? ne(s, -3) : c)
                    : y
                }),
                (a.deflateSetDictionary = function (s, O) {
                  var F,
                    k,
                    v,
                    A,
                    L,
                    j,
                    E,
                    Z,
                    Y = O.length
                  if (!s || !s.state || (A = (F = s.state).wrap) === 2 || (A === 1 && F.status !== S) || F.lookahead) return y
                  for (
                    A === 1 && (s.adler = i(s.adler, O, Y, 0)),
                      F.wrap = 0,
                      Y >= F.w_size &&
                        (A === 0 && (te(F.head), (F.strstart = 0), (F.block_start = 0), (F.insert = 0)),
                        (Z = new u.Buf8(F.w_size)),
                        u.arraySet(Z, O, Y - F.w_size, F.w_size, 0),
                        (O = Z),
                        (Y = F.w_size)),
                      L = s.avail_in,
                      j = s.next_in,
                      E = s.input,
                      s.avail_in = Y,
                      s.next_in = 0,
                      s.input = O,
                      he(F);
                    F.lookahead >= T;

                  ) {
                    for (
                      k = F.strstart, v = F.lookahead - (T - 1);
                      (F.ins_h = ((F.ins_h << F.hash_shift) ^ F.window[k + T - 1]) & F.hash_mask), (F.prev[k & F.w_mask] = F.head[F.ins_h]), (F.head[F.ins_h] = k), k++, --v;

                    );
                    ;(F.strstart = k), (F.lookahead = T - 1), he(F)
                  }
                  return (
                    (F.strstart += F.lookahead),
                    (F.block_start = F.strstart),
                    (F.insert = F.lookahead),
                    (F.lookahead = 0),
                    (F.match_length = F.prev_length = T - 1),
                    (F.match_available = 0),
                    (s.next_in = j),
                    (s.input = E),
                    (s.avail_in = L),
                    (F.wrap = A),
                    c
                  )
                }),
                (a.deflateInfo = 'pako deflate (from Nodeca project)')
            },
            { '../utils/common': 41, './adler32': 43, './crc32': 45, './messages': 51, './trees': 52 }
          ],
          47: [
            function (e, r, a) {
              r.exports = function () {
                ;(this.text = 0),
                  (this.time = 0),
                  (this.xflags = 0),
                  (this.os = 0),
                  (this.extra = null),
                  (this.extra_len = 0),
                  (this.name = ''),
                  (this.comment = ''),
                  (this.hcrc = 0),
                  (this.done = !1)
              }
            },
            {}
          ],
          48: [
            function (e, r, a) {
              r.exports = function (n, u) {
                var l, i, d, p, m, _, c, y, w, h, g, b, C, N, P, U, I, H, T, V, ee, S, R, o, D
                ;(l = n.state),
                  (i = n.next_in),
                  (o = n.input),
                  (d = i + (n.avail_in - 5)),
                  (p = n.next_out),
                  (D = n.output),
                  (m = p - (u - n.avail_out)),
                  (_ = p + (n.avail_out - 257)),
                  (c = l.dmax),
                  (y = l.wsize),
                  (w = l.whave),
                  (h = l.wnext),
                  (g = l.window),
                  (b = l.hold),
                  (C = l.bits),
                  (N = l.lencode),
                  (P = l.distcode),
                  (U = (1 << l.lenbits) - 1),
                  (I = (1 << l.distbits) - 1)
                e: do {
                  C < 15 && ((b += o[i++] << C), (C += 8), (b += o[i++] << C), (C += 8)), (H = N[b & U])
                  t: for (;;) {
                    if (((b >>>= T = H >>> 24), (C -= T), (T = (H >>> 16) & 255) === 0)) D[p++] = 65535 & H
                    else {
                      if (!(16 & T)) {
                        if ((64 & T) == 0) {
                          H = N[(65535 & H) + (b & ((1 << T) - 1))]
                          continue t
                        }
                        if (32 & T) {
                          l.mode = 12
                          break e
                        }
                        ;(n.msg = 'invalid literal/length code'), (l.mode = 30)
                        break e
                      }
                      ;(V = 65535 & H),
                        (T &= 15) && (C < T && ((b += o[i++] << C), (C += 8)), (V += b & ((1 << T) - 1)), (b >>>= T), (C -= T)),
                        C < 15 && ((b += o[i++] << C), (C += 8), (b += o[i++] << C), (C += 8)),
                        (H = P[b & I])
                      r: for (;;) {
                        if (((b >>>= T = H >>> 24), (C -= T), !(16 & (T = (H >>> 16) & 255)))) {
                          if ((64 & T) == 0) {
                            H = P[(65535 & H) + (b & ((1 << T) - 1))]
                            continue r
                          }
                          ;(n.msg = 'invalid distance code'), (l.mode = 30)
                          break e
                        }
                        if (((ee = 65535 & H), C < (T &= 15) && ((b += o[i++] << C), (C += 8) < T && ((b += o[i++] << C), (C += 8))), c < (ee += b & ((1 << T) - 1)))) {
                          ;(n.msg = 'invalid distance too far back'), (l.mode = 30)
                          break e
                        }
                        if (((b >>>= T), (C -= T), (T = p - m) < ee)) {
                          if (w < (T = ee - T) && l.sane) {
                            ;(n.msg = 'invalid distance too far back'), (l.mode = 30)
                            break e
                          }
                          if (((R = g), (S = 0) === h)) {
                            if (((S += y - T), T < V)) {
                              for (V -= T; (D[p++] = g[S++]), --T; );
                              ;(S = p - ee), (R = D)
                            }
                          } else if (h < T) {
                            if (((S += y + h - T), (T -= h) < V)) {
                              for (V -= T; (D[p++] = g[S++]), --T; );
                              if (((S = 0), h < V)) {
                                for (V -= T = h; (D[p++] = g[S++]), --T; );
                                ;(S = p - ee), (R = D)
                              }
                            }
                          } else if (((S += h - T), T < V)) {
                            for (V -= T; (D[p++] = g[S++]), --T; );
                            ;(S = p - ee), (R = D)
                          }
                          for (; 2 < V; ) (D[p++] = R[S++]), (D[p++] = R[S++]), (D[p++] = R[S++]), (V -= 3)
                          V && ((D[p++] = R[S++]), 1 < V && (D[p++] = R[S++]))
                        } else {
                          for (S = p - ee; (D[p++] = D[S++]), (D[p++] = D[S++]), (D[p++] = D[S++]), 2 < (V -= 3); );
                          V && ((D[p++] = D[S++]), 1 < V && (D[p++] = D[S++]))
                        }
                        break
                      }
                    }
                    break
                  }
                } while (i < d && p < _)
                ;(i -= V = C >> 3),
                  (b &= (1 << (C -= V << 3)) - 1),
                  (n.next_in = i),
                  (n.next_out = p),
                  (n.avail_in = i < d ? d - i + 5 : 5 - (i - d)),
                  (n.avail_out = p < _ ? _ - p + 257 : 257 - (p - _)),
                  (l.hold = b),
                  (l.bits = C)
              }
            },
            {}
          ],
          49: [
            function (e, r, a) {
              var n = e('../utils/common'),
                u = e('./adler32'),
                l = e('./crc32'),
                i = e('./inffast'),
                d = e('./inftrees'),
                p = 1,
                m = 2,
                _ = 0,
                c = -2,
                y = 1,
                w = 852,
                h = 592
              function g(S) {
                return ((S >>> 24) & 255) + ((S >>> 8) & 65280) + ((65280 & S) << 8) + ((255 & S) << 24)
              }
              function b() {
                ;(this.mode = 0),
                  (this.last = !1),
                  (this.wrap = 0),
                  (this.havedict = !1),
                  (this.flags = 0),
                  (this.dmax = 0),
                  (this.check = 0),
                  (this.total = 0),
                  (this.head = null),
                  (this.wbits = 0),
                  (this.wsize = 0),
                  (this.whave = 0),
                  (this.wnext = 0),
                  (this.window = null),
                  (this.hold = 0),
                  (this.bits = 0),
                  (this.length = 0),
                  (this.offset = 0),
                  (this.extra = 0),
                  (this.lencode = null),
                  (this.distcode = null),
                  (this.lenbits = 0),
                  (this.distbits = 0),
                  (this.ncode = 0),
                  (this.nlen = 0),
                  (this.ndist = 0),
                  (this.have = 0),
                  (this.next = null),
                  (this.lens = new n.Buf16(320)),
                  (this.work = new n.Buf16(288)),
                  (this.lendyn = null),
                  (this.distdyn = null),
                  (this.sane = 0),
                  (this.back = 0),
                  (this.was = 0)
              }
              function C(S) {
                var R
                return S && S.state
                  ? ((R = S.state),
                    (S.total_in = S.total_out = R.total = 0),
                    (S.msg = ''),
                    R.wrap && (S.adler = 1 & R.wrap),
                    (R.mode = y),
                    (R.last = 0),
                    (R.havedict = 0),
                    (R.dmax = 32768),
                    (R.head = null),
                    (R.hold = 0),
                    (R.bits = 0),
                    (R.lencode = R.lendyn = new n.Buf32(w)),
                    (R.distcode = R.distdyn = new n.Buf32(h)),
                    (R.sane = 1),
                    (R.back = -1),
                    _)
                  : c
              }
              function N(S) {
                var R
                return S && S.state ? (((R = S.state).wsize = 0), (R.whave = 0), (R.wnext = 0), C(S)) : c
              }
              function P(S, R) {
                var o, D
                return S && S.state
                  ? ((D = S.state),
                    R < 0 ? ((o = 0), (R = -R)) : ((o = 1 + (R >> 4)), R < 48 && (R &= 15)),
                    R && (R < 8 || 15 < R) ? c : (D.window !== null && D.wbits !== R && (D.window = null), (D.wrap = o), (D.wbits = R), N(S)))
                  : c
              }
              function U(S, R) {
                var o, D
                return S ? ((D = new b()), ((S.state = D).window = null), (o = P(S, R)) !== _ && (S.state = null), o) : c
              }
              var I,
                H,
                T = !0
              function V(S) {
                if (T) {
                  var R
                  for (I = new n.Buf32(512), H = new n.Buf32(32), R = 0; R < 144; ) S.lens[R++] = 8
                  for (; R < 256; ) S.lens[R++] = 9
                  for (; R < 280; ) S.lens[R++] = 7
                  for (; R < 288; ) S.lens[R++] = 8
                  for (d(p, S.lens, 0, 288, I, 0, S.work, { bits: 9 }), R = 0; R < 32; ) S.lens[R++] = 5
                  d(m, S.lens, 0, 32, H, 0, S.work, { bits: 5 }), (T = !1)
                }
                ;(S.lencode = I), (S.lenbits = 9), (S.distcode = H), (S.distbits = 5)
              }
              function ee(S, R, o, D) {
                var re,
                  M = S.state
                return (
                  M.window === null && ((M.wsize = 1 << M.wbits), (M.wnext = 0), (M.whave = 0), (M.window = new n.Buf8(M.wsize))),
                  D >= M.wsize
                    ? (n.arraySet(M.window, R, o - M.wsize, M.wsize, 0), (M.wnext = 0), (M.whave = M.wsize))
                    : (D < (re = M.wsize - M.wnext) && (re = D),
                      n.arraySet(M.window, R, o - D, re, M.wnext),
                      (D -= re)
                        ? (n.arraySet(M.window, R, o - D, D, 0), (M.wnext = D), (M.whave = M.wsize))
                        : ((M.wnext += re), M.wnext === M.wsize && (M.wnext = 0), M.whave < M.wsize && (M.whave += re))),
                  0
                )
              }
              ;(a.inflateReset = N),
                (a.inflateReset2 = P),
                (a.inflateResetKeep = C),
                (a.inflateInit = function (S) {
                  return U(S, 15)
                }),
                (a.inflateInit2 = U),
                (a.inflate = function (S, R) {
                  var o,
                    D,
                    re,
                    M,
                    ne,
                    W,
                    te,
                    B,
                    x,
                    Q,
                    K,
                    G,
                    he,
                    be,
                    se,
                    oe,
                    me,
                    fe,
                    we,
                    ke,
                    s,
                    O,
                    F,
                    k,
                    v = 0,
                    A = new n.Buf8(4),
                    L = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
                  if (!S || !S.state || !S.output || (!S.input && S.avail_in !== 0)) return c
                  ;(o = S.state).mode === 12 && (o.mode = 13),
                    (ne = S.next_out),
                    (re = S.output),
                    (te = S.avail_out),
                    (M = S.next_in),
                    (D = S.input),
                    (W = S.avail_in),
                    (B = o.hold),
                    (x = o.bits),
                    (Q = W),
                    (K = te),
                    (O = _)
                  e: for (;;)
                    switch (o.mode) {
                      case y:
                        if (o.wrap === 0) {
                          o.mode = 13
                          break
                        }
                        for (; x < 16; ) {
                          if (W === 0) break e
                          W--, (B += D[M++] << x), (x += 8)
                        }
                        if (2 & o.wrap && B === 35615) {
                          ;(A[(o.check = 0)] = 255 & B), (A[1] = (B >>> 8) & 255), (o.check = l(o.check, A, 2, 0)), (x = B = 0), (o.mode = 2)
                          break
                        }
                        if (((o.flags = 0), o.head && (o.head.done = !1), !(1 & o.wrap) || (((255 & B) << 8) + (B >> 8)) % 31)) {
                          ;(S.msg = 'incorrect header check'), (o.mode = 30)
                          break
                        }
                        if ((15 & B) != 8) {
                          ;(S.msg = 'unknown compression method'), (o.mode = 30)
                          break
                        }
                        if (((x -= 4), (s = 8 + (15 & (B >>>= 4))), o.wbits === 0)) o.wbits = s
                        else if (s > o.wbits) {
                          ;(S.msg = 'invalid window size'), (o.mode = 30)
                          break
                        }
                        ;(o.dmax = 1 << s), (S.adler = o.check = 1), (o.mode = 512 & B ? 10 : 12), (x = B = 0)
                        break
                      case 2:
                        for (; x < 16; ) {
                          if (W === 0) break e
                          W--, (B += D[M++] << x), (x += 8)
                        }
                        if (((o.flags = B), (255 & o.flags) != 8)) {
                          ;(S.msg = 'unknown compression method'), (o.mode = 30)
                          break
                        }
                        if (57344 & o.flags) {
                          ;(S.msg = 'unknown header flags set'), (o.mode = 30)
                          break
                        }
                        o.head && (o.head.text = (B >> 8) & 1),
                          512 & o.flags && ((A[0] = 255 & B), (A[1] = (B >>> 8) & 255), (o.check = l(o.check, A, 2, 0))),
                          (x = B = 0),
                          (o.mode = 3)
                      case 3:
                        for (; x < 32; ) {
                          if (W === 0) break e
                          W--, (B += D[M++] << x), (x += 8)
                        }
                        o.head && (o.head.time = B),
                          512 & o.flags && ((A[0] = 255 & B), (A[1] = (B >>> 8) & 255), (A[2] = (B >>> 16) & 255), (A[3] = (B >>> 24) & 255), (o.check = l(o.check, A, 4, 0))),
                          (x = B = 0),
                          (o.mode = 4)
                      case 4:
                        for (; x < 16; ) {
                          if (W === 0) break e
                          W--, (B += D[M++] << x), (x += 8)
                        }
                        o.head && ((o.head.xflags = 255 & B), (o.head.os = B >> 8)),
                          512 & o.flags && ((A[0] = 255 & B), (A[1] = (B >>> 8) & 255), (o.check = l(o.check, A, 2, 0))),
                          (x = B = 0),
                          (o.mode = 5)
                      case 5:
                        if (1024 & o.flags) {
                          for (; x < 16; ) {
                            if (W === 0) break e
                            W--, (B += D[M++] << x), (x += 8)
                          }
                          ;(o.length = B),
                            o.head && (o.head.extra_len = B),
                            512 & o.flags && ((A[0] = 255 & B), (A[1] = (B >>> 8) & 255), (o.check = l(o.check, A, 2, 0))),
                            (x = B = 0)
                        } else o.head && (o.head.extra = null)
                        o.mode = 6
                      case 6:
                        if (
                          1024 & o.flags &&
                          (W < (G = o.length) && (G = W),
                          G &&
                            (o.head && ((s = o.head.extra_len - o.length), o.head.extra || (o.head.extra = new Array(o.head.extra_len)), n.arraySet(o.head.extra, D, M, G, s)),
                            512 & o.flags && (o.check = l(o.check, D, G, M)),
                            (W -= G),
                            (M += G),
                            (o.length -= G)),
                          o.length)
                        )
                          break e
                        ;(o.length = 0), (o.mode = 7)
                      case 7:
                        if (2048 & o.flags) {
                          if (W === 0) break e
                          for (G = 0; (s = D[M + G++]), o.head && s && o.length < 65536 && (o.head.name += String.fromCharCode(s)), s && G < W; );
                          if ((512 & o.flags && (o.check = l(o.check, D, G, M)), (W -= G), (M += G), s)) break e
                        } else o.head && (o.head.name = null)
                        ;(o.length = 0), (o.mode = 8)
                      case 8:
                        if (4096 & o.flags) {
                          if (W === 0) break e
                          for (G = 0; (s = D[M + G++]), o.head && s && o.length < 65536 && (o.head.comment += String.fromCharCode(s)), s && G < W; );
                          if ((512 & o.flags && (o.check = l(o.check, D, G, M)), (W -= G), (M += G), s)) break e
                        } else o.head && (o.head.comment = null)
                        o.mode = 9
                      case 9:
                        if (512 & o.flags) {
                          for (; x < 16; ) {
                            if (W === 0) break e
                            W--, (B += D[M++] << x), (x += 8)
                          }
                          if (B !== (65535 & o.check)) {
                            ;(S.msg = 'header crc mismatch'), (o.mode = 30)
                            break
                          }
                          x = B = 0
                        }
                        o.head && ((o.head.hcrc = (o.flags >> 9) & 1), (o.head.done = !0)), (S.adler = o.check = 0), (o.mode = 12)
                        break
                      case 10:
                        for (; x < 32; ) {
                          if (W === 0) break e
                          W--, (B += D[M++] << x), (x += 8)
                        }
                        ;(S.adler = o.check = g(B)), (x = B = 0), (o.mode = 11)
                      case 11:
                        if (o.havedict === 0) return (S.next_out = ne), (S.avail_out = te), (S.next_in = M), (S.avail_in = W), (o.hold = B), (o.bits = x), 2
                        ;(S.adler = o.check = 1), (o.mode = 12)
                      case 12:
                        if (R === 5 || R === 6) break e
                      case 13:
                        if (o.last) {
                          ;(B >>>= 7 & x), (x -= 7 & x), (o.mode = 27)
                          break
                        }
                        for (; x < 3; ) {
                          if (W === 0) break e
                          W--, (B += D[M++] << x), (x += 8)
                        }
                        switch (((o.last = 1 & B), (x -= 1), 3 & (B >>>= 1))) {
                          case 0:
                            o.mode = 14
                            break
                          case 1:
                            if ((V(o), (o.mode = 20), R !== 6)) break
                            ;(B >>>= 2), (x -= 2)
                            break e
                          case 2:
                            o.mode = 17
                            break
                          case 3:
                            ;(S.msg = 'invalid block type'), (o.mode = 30)
                        }
                        ;(B >>>= 2), (x -= 2)
                        break
                      case 14:
                        for (B >>>= 7 & x, x -= 7 & x; x < 32; ) {
                          if (W === 0) break e
                          W--, (B += D[M++] << x), (x += 8)
                        }
                        if ((65535 & B) != ((B >>> 16) ^ 65535)) {
                          ;(S.msg = 'invalid stored block lengths'), (o.mode = 30)
                          break
                        }
                        if (((o.length = 65535 & B), (x = B = 0), (o.mode = 15), R === 6)) break e
                      case 15:
                        o.mode = 16
                      case 16:
                        if ((G = o.length)) {
                          if ((W < G && (G = W), te < G && (G = te), G === 0)) break e
                          n.arraySet(re, D, M, G, ne), (W -= G), (M += G), (te -= G), (ne += G), (o.length -= G)
                          break
                        }
                        o.mode = 12
                        break
                      case 17:
                        for (; x < 14; ) {
                          if (W === 0) break e
                          W--, (B += D[M++] << x), (x += 8)
                        }
                        if (
                          ((o.nlen = 257 + (31 & B)),
                          (B >>>= 5),
                          (x -= 5),
                          (o.ndist = 1 + (31 & B)),
                          (B >>>= 5),
                          (x -= 5),
                          (o.ncode = 4 + (15 & B)),
                          (B >>>= 4),
                          (x -= 4),
                          286 < o.nlen || 30 < o.ndist)
                        ) {
                          ;(S.msg = 'too many length or distance symbols'), (o.mode = 30)
                          break
                        }
                        ;(o.have = 0), (o.mode = 18)
                      case 18:
                        for (; o.have < o.ncode; ) {
                          for (; x < 3; ) {
                            if (W === 0) break e
                            W--, (B += D[M++] << x), (x += 8)
                          }
                          ;(o.lens[L[o.have++]] = 7 & B), (B >>>= 3), (x -= 3)
                        }
                        for (; o.have < 19; ) o.lens[L[o.have++]] = 0
                        if (((o.lencode = o.lendyn), (o.lenbits = 7), (F = { bits: o.lenbits }), (O = d(0, o.lens, 0, 19, o.lencode, 0, o.work, F)), (o.lenbits = F.bits), O)) {
                          ;(S.msg = 'invalid code lengths set'), (o.mode = 30)
                          break
                        }
                        ;(o.have = 0), (o.mode = 19)
                      case 19:
                        for (; o.have < o.nlen + o.ndist; ) {
                          for (; (oe = ((v = o.lencode[B & ((1 << o.lenbits) - 1)]) >>> 16) & 255), (me = 65535 & v), !((se = v >>> 24) <= x); ) {
                            if (W === 0) break e
                            W--, (B += D[M++] << x), (x += 8)
                          }
                          if (me < 16) (B >>>= se), (x -= se), (o.lens[o.have++] = me)
                          else {
                            if (me === 16) {
                              for (k = se + 2; x < k; ) {
                                if (W === 0) break e
                                W--, (B += D[M++] << x), (x += 8)
                              }
                              if (((B >>>= se), (x -= se), o.have === 0)) {
                                ;(S.msg = 'invalid bit length repeat'), (o.mode = 30)
                                break
                              }
                              ;(s = o.lens[o.have - 1]), (G = 3 + (3 & B)), (B >>>= 2), (x -= 2)
                            } else if (me === 17) {
                              for (k = se + 3; x < k; ) {
                                if (W === 0) break e
                                W--, (B += D[M++] << x), (x += 8)
                              }
                              ;(x -= se), (s = 0), (G = 3 + (7 & (B >>>= se))), (B >>>= 3), (x -= 3)
                            } else {
                              for (k = se + 7; x < k; ) {
                                if (W === 0) break e
                                W--, (B += D[M++] << x), (x += 8)
                              }
                              ;(x -= se), (s = 0), (G = 11 + (127 & (B >>>= se))), (B >>>= 7), (x -= 7)
                            }
                            if (o.have + G > o.nlen + o.ndist) {
                              ;(S.msg = 'invalid bit length repeat'), (o.mode = 30)
                              break
                            }
                            for (; G--; ) o.lens[o.have++] = s
                          }
                        }
                        if (o.mode === 30) break
                        if (o.lens[256] === 0) {
                          ;(S.msg = 'invalid code -- missing end-of-block'), (o.mode = 30)
                          break
                        }
                        if (((o.lenbits = 9), (F = { bits: o.lenbits }), (O = d(p, o.lens, 0, o.nlen, o.lencode, 0, o.work, F)), (o.lenbits = F.bits), O)) {
                          ;(S.msg = 'invalid literal/lengths set'), (o.mode = 30)
                          break
                        }
                        if (
                          ((o.distbits = 6),
                          (o.distcode = o.distdyn),
                          (F = { bits: o.distbits }),
                          (O = d(m, o.lens, o.nlen, o.ndist, o.distcode, 0, o.work, F)),
                          (o.distbits = F.bits),
                          O)
                        ) {
                          ;(S.msg = 'invalid distances set'), (o.mode = 30)
                          break
                        }
                        if (((o.mode = 20), R === 6)) break e
                      case 20:
                        o.mode = 21
                      case 21:
                        if (6 <= W && 258 <= te) {
                          ;(S.next_out = ne),
                            (S.avail_out = te),
                            (S.next_in = M),
                            (S.avail_in = W),
                            (o.hold = B),
                            (o.bits = x),
                            i(S, K),
                            (ne = S.next_out),
                            (re = S.output),
                            (te = S.avail_out),
                            (M = S.next_in),
                            (D = S.input),
                            (W = S.avail_in),
                            (B = o.hold),
                            (x = o.bits),
                            o.mode === 12 && (o.back = -1)
                          break
                        }
                        for (o.back = 0; (oe = ((v = o.lencode[B & ((1 << o.lenbits) - 1)]) >>> 16) & 255), (me = 65535 & v), !((se = v >>> 24) <= x); ) {
                          if (W === 0) break e
                          W--, (B += D[M++] << x), (x += 8)
                        }
                        if (oe && (240 & oe) == 0) {
                          for (
                            fe = se, we = oe, ke = me;
                            (oe = ((v = o.lencode[ke + ((B & ((1 << (fe + we)) - 1)) >> fe)]) >>> 16) & 255), (me = 65535 & v), !(fe + (se = v >>> 24) <= x);

                          ) {
                            if (W === 0) break e
                            W--, (B += D[M++] << x), (x += 8)
                          }
                          ;(B >>>= fe), (x -= fe), (o.back += fe)
                        }
                        if (((B >>>= se), (x -= se), (o.back += se), (o.length = me), oe === 0)) {
                          o.mode = 26
                          break
                        }
                        if (32 & oe) {
                          ;(o.back = -1), (o.mode = 12)
                          break
                        }
                        if (64 & oe) {
                          ;(S.msg = 'invalid literal/length code'), (o.mode = 30)
                          break
                        }
                        ;(o.extra = 15 & oe), (o.mode = 22)
                      case 22:
                        if (o.extra) {
                          for (k = o.extra; x < k; ) {
                            if (W === 0) break e
                            W--, (B += D[M++] << x), (x += 8)
                          }
                          ;(o.length += B & ((1 << o.extra) - 1)), (B >>>= o.extra), (x -= o.extra), (o.back += o.extra)
                        }
                        ;(o.was = o.length), (o.mode = 23)
                      case 23:
                        for (; (oe = ((v = o.distcode[B & ((1 << o.distbits) - 1)]) >>> 16) & 255), (me = 65535 & v), !((se = v >>> 24) <= x); ) {
                          if (W === 0) break e
                          W--, (B += D[M++] << x), (x += 8)
                        }
                        if ((240 & oe) == 0) {
                          for (
                            fe = se, we = oe, ke = me;
                            (oe = ((v = o.distcode[ke + ((B & ((1 << (fe + we)) - 1)) >> fe)]) >>> 16) & 255), (me = 65535 & v), !(fe + (se = v >>> 24) <= x);

                          ) {
                            if (W === 0) break e
                            W--, (B += D[M++] << x), (x += 8)
                          }
                          ;(B >>>= fe), (x -= fe), (o.back += fe)
                        }
                        if (((B >>>= se), (x -= se), (o.back += se), 64 & oe)) {
                          ;(S.msg = 'invalid distance code'), (o.mode = 30)
                          break
                        }
                        ;(o.offset = me), (o.extra = 15 & oe), (o.mode = 24)
                      case 24:
                        if (o.extra) {
                          for (k = o.extra; x < k; ) {
                            if (W === 0) break e
                            W--, (B += D[M++] << x), (x += 8)
                          }
                          ;(o.offset += B & ((1 << o.extra) - 1)), (B >>>= o.extra), (x -= o.extra), (o.back += o.extra)
                        }
                        if (o.offset > o.dmax) {
                          ;(S.msg = 'invalid distance too far back'), (o.mode = 30)
                          break
                        }
                        o.mode = 25
                      case 25:
                        if (te === 0) break e
                        if (((G = K - te), o.offset > G)) {
                          if ((G = o.offset - G) > o.whave && o.sane) {
                            ;(S.msg = 'invalid distance too far back'), (o.mode = 30)
                            break
                          }
                          ;(he = G > o.wnext ? ((G -= o.wnext), o.wsize - G) : o.wnext - G), G > o.length && (G = o.length), (be = o.window)
                        } else (be = re), (he = ne - o.offset), (G = o.length)
                        for (te < G && (G = te), te -= G, o.length -= G; (re[ne++] = be[he++]), --G; );
                        o.length === 0 && (o.mode = 21)
                        break
                      case 26:
                        if (te === 0) break e
                        ;(re[ne++] = o.length), te--, (o.mode = 21)
                        break
                      case 27:
                        if (o.wrap) {
                          for (; x < 32; ) {
                            if (W === 0) break e
                            W--, (B |= D[M++] << x), (x += 8)
                          }
                          if (
                            ((K -= te),
                            (S.total_out += K),
                            (o.total += K),
                            K && (S.adler = o.check = o.flags ? l(o.check, re, K, ne - K) : u(o.check, re, K, ne - K)),
                            (K = te),
                            (o.flags ? B : g(B)) !== o.check)
                          ) {
                            ;(S.msg = 'incorrect data check'), (o.mode = 30)
                            break
                          }
                          x = B = 0
                        }
                        o.mode = 28
                      case 28:
                        if (o.wrap && o.flags) {
                          for (; x < 32; ) {
                            if (W === 0) break e
                            W--, (B += D[M++] << x), (x += 8)
                          }
                          if (B !== (4294967295 & o.total)) {
                            ;(S.msg = 'incorrect length check'), (o.mode = 30)
                            break
                          }
                          x = B = 0
                        }
                        o.mode = 29
                      case 29:
                        O = 1
                        break e
                      case 30:
                        O = -3
                        break e
                      case 31:
                        return -4
                      case 32:
                      default:
                        return c
                    }
                  return (
                    (S.next_out = ne),
                    (S.avail_out = te),
                    (S.next_in = M),
                    (S.avail_in = W),
                    (o.hold = B),
                    (o.bits = x),
                    (o.wsize || (K !== S.avail_out && o.mode < 30 && (o.mode < 27 || R !== 4))) && ee(S, S.output, S.next_out, K - S.avail_out)
                      ? ((o.mode = 31), -4)
                      : ((Q -= S.avail_in),
                        (K -= S.avail_out),
                        (S.total_in += Q),
                        (S.total_out += K),
                        (o.total += K),
                        o.wrap && K && (S.adler = o.check = o.flags ? l(o.check, re, K, S.next_out - K) : u(o.check, re, K, S.next_out - K)),
                        (S.data_type = o.bits + (o.last ? 64 : 0) + (o.mode === 12 ? 128 : 0) + (o.mode === 20 || o.mode === 15 ? 256 : 0)),
                        ((Q == 0 && K === 0) || R === 4) && O === _ && (O = -5),
                        O)
                  )
                }),
                (a.inflateEnd = function (S) {
                  if (!S || !S.state) return c
                  var R = S.state
                  return R.window && (R.window = null), (S.state = null), _
                }),
                (a.inflateGetHeader = function (S, R) {
                  var o
                  return S && S.state ? ((2 & (o = S.state).wrap) == 0 ? c : (((o.head = R).done = !1), _)) : c
                }),
                (a.inflateSetDictionary = function (S, R) {
                  var o,
                    D = R.length
                  return S && S.state
                    ? (o = S.state).wrap !== 0 && o.mode !== 11
                      ? c
                      : o.mode === 11 && u(1, R, D, 0) !== o.check
                      ? -3
                      : ee(S, R, D, D)
                      ? ((o.mode = 31), -4)
                      : ((o.havedict = 1), _)
                    : c
                }),
                (a.inflateInfo = 'pako inflate (from Nodeca project)')
            },
            { '../utils/common': 41, './adler32': 43, './crc32': 45, './inffast': 48, './inftrees': 50 }
          ],
          50: [
            function (e, r, a) {
              var n = e('../utils/common'),
                u = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
                l = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
                i = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
                d = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64]
              r.exports = function (p, m, _, c, y, w, h, g) {
                var b,
                  C,
                  N,
                  P,
                  U,
                  I,
                  H,
                  T,
                  V,
                  ee = g.bits,
                  S = 0,
                  R = 0,
                  o = 0,
                  D = 0,
                  re = 0,
                  M = 0,
                  ne = 0,
                  W = 0,
                  te = 0,
                  B = 0,
                  x = null,
                  Q = 0,
                  K = new n.Buf16(16),
                  G = new n.Buf16(16),
                  he = null,
                  be = 0
                for (S = 0; S <= 15; S++) K[S] = 0
                for (R = 0; R < c; R++) K[m[_ + R]]++
                for (re = ee, D = 15; 1 <= D && K[D] === 0; D--);
                if ((D < re && (re = D), D === 0)) return (y[w++] = 20971520), (y[w++] = 20971520), (g.bits = 1), 0
                for (o = 1; o < D && K[o] === 0; o++);
                for (re < o && (re = o), S = W = 1; S <= 15; S++) if (((W <<= 1), (W -= K[S]) < 0)) return -1
                if (0 < W && (p === 0 || D !== 1)) return -1
                for (G[1] = 0, S = 1; S < 15; S++) G[S + 1] = G[S] + K[S]
                for (R = 0; R < c; R++) m[_ + R] !== 0 && (h[G[m[_ + R]]++] = R)
                if (
                  ((I = p === 0 ? ((x = he = h), 19) : p === 1 ? ((x = u), (Q -= 257), (he = l), (be -= 257), 256) : ((x = i), (he = d), -1)),
                  (S = o),
                  (U = w),
                  (ne = R = B = 0),
                  (N = -1),
                  (P = (te = 1 << (M = re)) - 1),
                  (p === 1 && 852 < te) || (p === 2 && 592 < te))
                )
                  return 1
                for (;;) {
                  for (
                    H = S - ne, V = h[R] < I ? ((T = 0), h[R]) : h[R] > I ? ((T = he[be + h[R]]), x[Q + h[R]]) : ((T = 96), 0), b = 1 << (S - ne), o = C = 1 << M;
                    (y[U + (B >> ne) + (C -= b)] = (H << 24) | (T << 16) | V | 0), C !== 0;

                  );
                  for (b = 1 << (S - 1); B & b; ) b >>= 1
                  if ((b !== 0 ? ((B &= b - 1), (B += b)) : (B = 0), R++, --K[S] == 0)) {
                    if (S === D) break
                    S = m[_ + h[R]]
                  }
                  if (re < S && (B & P) !== N) {
                    for (ne === 0 && (ne = re), U += o, W = 1 << (M = S - ne); M + ne < D && !((W -= K[M + ne]) <= 0); ) M++, (W <<= 1)
                    if (((te += 1 << M), (p === 1 && 852 < te) || (p === 2 && 592 < te))) return 1
                    y[(N = B & P)] = (re << 24) | (M << 16) | (U - w) | 0
                  }
                }
                return B !== 0 && (y[U + B] = ((S - ne) << 24) | 4194304 | 0), (g.bits = re), 0
              }
            },
            { '../utils/common': 41 }
          ],
          51: [
            function (e, r, a) {
              r.exports = {
                2: 'need dictionary',
                1: 'stream end',
                0: '',
                '-1': 'file error',
                '-2': 'stream error',
                '-3': 'data error',
                '-4': 'insufficient memory',
                '-5': 'buffer error',
                '-6': 'incompatible version'
              }
            },
            {}
          ],
          52: [
            function (e, r, a) {
              var n = e('../utils/common'),
                u = 0,
                l = 1
              function i(v) {
                for (var A = v.length; 0 <= --A; ) v[A] = 0
              }
              var d = 0,
                p = 29,
                m = 256,
                _ = m + 1 + p,
                c = 30,
                y = 19,
                w = 2 * _ + 1,
                h = 15,
                g = 16,
                b = 7,
                C = 256,
                N = 16,
                P = 17,
                U = 18,
                I = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
                H = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
                T = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
                V = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
                ee = new Array(2 * (_ + 2))
              i(ee)
              var S = new Array(2 * c)
              i(S)
              var R = new Array(512)
              i(R)
              var o = new Array(256)
              i(o)
              var D = new Array(p)
              i(D)
              var re,
                M,
                ne,
                W = new Array(c)
              function te(v, A, L, j, E) {
                ;(this.static_tree = v), (this.extra_bits = A), (this.extra_base = L), (this.elems = j), (this.max_length = E), (this.has_stree = v && v.length)
              }
              function B(v, A) {
                ;(this.dyn_tree = v), (this.max_code = 0), (this.stat_desc = A)
              }
              function x(v) {
                return v < 256 ? R[v] : R[256 + (v >>> 7)]
              }
              function Q(v, A) {
                ;(v.pending_buf[v.pending++] = 255 & A), (v.pending_buf[v.pending++] = (A >>> 8) & 255)
              }
              function K(v, A, L) {
                v.bi_valid > g - L
                  ? ((v.bi_buf |= (A << v.bi_valid) & 65535), Q(v, v.bi_buf), (v.bi_buf = A >> (g - v.bi_valid)), (v.bi_valid += L - g))
                  : ((v.bi_buf |= (A << v.bi_valid) & 65535), (v.bi_valid += L))
              }
              function G(v, A, L) {
                K(v, L[2 * A], L[2 * A + 1])
              }
              function he(v, A) {
                for (var L = 0; (L |= 1 & v), (v >>>= 1), (L <<= 1), 0 < --A; );
                return L >>> 1
              }
              function be(v, A, L) {
                var j,
                  E,
                  Z = new Array(h + 1),
                  Y = 0
                for (j = 1; j <= h; j++) Z[j] = Y = (Y + L[j - 1]) << 1
                for (E = 0; E <= A; E++) {
                  var $ = v[2 * E + 1]
                  $ !== 0 && (v[2 * E] = he(Z[$]++, $))
                }
              }
              function se(v) {
                var A
                for (A = 0; A < _; A++) v.dyn_ltree[2 * A] = 0
                for (A = 0; A < c; A++) v.dyn_dtree[2 * A] = 0
                for (A = 0; A < y; A++) v.bl_tree[2 * A] = 0
                ;(v.dyn_ltree[2 * C] = 1), (v.opt_len = v.static_len = 0), (v.last_lit = v.matches = 0)
              }
              function oe(v) {
                8 < v.bi_valid ? Q(v, v.bi_buf) : 0 < v.bi_valid && (v.pending_buf[v.pending++] = v.bi_buf), (v.bi_buf = 0), (v.bi_valid = 0)
              }
              function me(v, A, L, j) {
                var E = 2 * A,
                  Z = 2 * L
                return v[E] < v[Z] || (v[E] === v[Z] && j[A] <= j[L])
              }
              function fe(v, A, L) {
                for (var j = v.heap[L], E = L << 1; E <= v.heap_len && (E < v.heap_len && me(A, v.heap[E + 1], v.heap[E], v.depth) && E++, !me(A, j, v.heap[E], v.depth)); )
                  (v.heap[L] = v.heap[E]), (L = E), (E <<= 1)
                v.heap[L] = j
              }
              function we(v, A, L) {
                var j,
                  E,
                  Z,
                  Y,
                  $ = 0
                if (v.last_lit !== 0)
                  for (
                    ;
                    (j = (v.pending_buf[v.d_buf + 2 * $] << 8) | v.pending_buf[v.d_buf + 2 * $ + 1]),
                      (E = v.pending_buf[v.l_buf + $]),
                      $++,
                      j === 0
                        ? G(v, E, A)
                        : (G(v, (Z = o[E]) + m + 1, A), (Y = I[Z]) !== 0 && K(v, (E -= D[Z]), Y), G(v, (Z = x(--j)), L), (Y = H[Z]) !== 0 && K(v, (j -= W[Z]), Y)),
                      $ < v.last_lit;

                  );
                G(v, C, A)
              }
              function ke(v, A) {
                var L,
                  j,
                  E,
                  Z = A.dyn_tree,
                  Y = A.stat_desc.static_tree,
                  $ = A.stat_desc.has_stree,
                  J = A.stat_desc.elems,
                  le = -1
                for (v.heap_len = 0, v.heap_max = w, L = 0; L < J; L++) Z[2 * L] !== 0 ? ((v.heap[++v.heap_len] = le = L), (v.depth[L] = 0)) : (Z[2 * L + 1] = 0)
                for (; v.heap_len < 2; ) (Z[2 * (E = v.heap[++v.heap_len] = le < 2 ? ++le : 0)] = 1), (v.depth[E] = 0), v.opt_len--, $ && (v.static_len -= Y[2 * E + 1])
                for (A.max_code = le, L = v.heap_len >> 1; 1 <= L; L--) fe(v, Z, L)
                for (
                  E = J;
                  (L = v.heap[1]),
                    (v.heap[1] = v.heap[v.heap_len--]),
                    fe(v, Z, 1),
                    (j = v.heap[1]),
                    (v.heap[--v.heap_max] = L),
                    (v.heap[--v.heap_max] = j),
                    (Z[2 * E] = Z[2 * L] + Z[2 * j]),
                    (v.depth[E] = (v.depth[L] >= v.depth[j] ? v.depth[L] : v.depth[j]) + 1),
                    (Z[2 * L + 1] = Z[2 * j + 1] = E),
                    (v.heap[1] = E++),
                    fe(v, Z, 1),
                    2 <= v.heap_len;

                );
                ;(v.heap[--v.heap_max] = v.heap[1]),
                  (function (ie, ye) {
                    var Te,
                      Se,
                      Fe,
                      de,
                      Me,
                      Je,
                      Ae = ye.dyn_tree,
                      kt = ye.max_code,
                      Ur = ye.stat_desc.static_tree,
                      jr = ye.stat_desc.has_stree,
                      Mr = ye.stat_desc.extra_bits,
                      wt = ye.stat_desc.extra_base,
                      Ie = ye.stat_desc.max_length,
                      We = 0
                    for (de = 0; de <= h; de++) ie.bl_count[de] = 0
                    for (Ae[2 * ie.heap[ie.heap_max] + 1] = 0, Te = ie.heap_max + 1; Te < w; Te++)
                      Ie < (de = Ae[2 * Ae[2 * (Se = ie.heap[Te]) + 1] + 1] + 1) && ((de = Ie), We++),
                        (Ae[2 * Se + 1] = de),
                        kt < Se ||
                          (ie.bl_count[de]++,
                          (Me = 0),
                          wt <= Se && (Me = Mr[Se - wt]),
                          (Je = Ae[2 * Se]),
                          (ie.opt_len += Je * (de + Me)),
                          jr && (ie.static_len += Je * (Ur[2 * Se + 1] + Me)))
                    if (We !== 0) {
                      do {
                        for (de = Ie - 1; ie.bl_count[de] === 0; ) de--
                        ie.bl_count[de]--, (ie.bl_count[de + 1] += 2), ie.bl_count[Ie]--, (We -= 2)
                      } while (0 < We)
                      for (de = Ie; de !== 0; de--)
                        for (Se = ie.bl_count[de]; Se !== 0; )
                          kt < (Fe = ie.heap[--Te]) || (Ae[2 * Fe + 1] !== de && ((ie.opt_len += (de - Ae[2 * Fe + 1]) * Ae[2 * Fe]), (Ae[2 * Fe + 1] = de)), Se--)
                    }
                  })(v, A),
                  be(Z, le, v.bl_count)
              }
              function s(v, A, L) {
                var j,
                  E,
                  Z = -1,
                  Y = A[1],
                  $ = 0,
                  J = 7,
                  le = 4
                for (Y === 0 && ((J = 138), (le = 3)), A[2 * (L + 1) + 1] = 65535, j = 0; j <= L; j++)
                  (E = Y),
                    (Y = A[2 * (j + 1) + 1]),
                    (++$ < J && E === Y) ||
                      ($ < le ? (v.bl_tree[2 * E] += $) : E !== 0 ? (E !== Z && v.bl_tree[2 * E]++, v.bl_tree[2 * N]++) : $ <= 10 ? v.bl_tree[2 * P]++ : v.bl_tree[2 * U]++,
                      (Z = E),
                      (le = ($ = 0) === Y ? ((J = 138), 3) : E === Y ? ((J = 6), 3) : ((J = 7), 4)))
              }
              function O(v, A, L) {
                var j,
                  E,
                  Z = -1,
                  Y = A[1],
                  $ = 0,
                  J = 7,
                  le = 4
                for (Y === 0 && ((J = 138), (le = 3)), j = 0; j <= L; j++)
                  if (((E = Y), (Y = A[2 * (j + 1) + 1]), !(++$ < J && E === Y))) {
                    if ($ < le) for (; G(v, E, v.bl_tree), --$ != 0; );
                    else
                      E !== 0
                        ? (E !== Z && (G(v, E, v.bl_tree), $--), G(v, N, v.bl_tree), K(v, $ - 3, 2))
                        : $ <= 10
                        ? (G(v, P, v.bl_tree), K(v, $ - 3, 3))
                        : (G(v, U, v.bl_tree), K(v, $ - 11, 7))
                    ;(Z = E), (le = ($ = 0) === Y ? ((J = 138), 3) : E === Y ? ((J = 6), 3) : ((J = 7), 4))
                  }
              }
              i(W)
              var F = !1
              function k(v, A, L, j) {
                K(v, (d << 1) + (j ? 1 : 0), 3),
                  (function (E, Z, Y, $) {
                    oe(E), $ && (Q(E, Y), Q(E, ~Y)), n.arraySet(E.pending_buf, E.window, Z, Y, E.pending), (E.pending += Y)
                  })(v, A, L, !0)
              }
              ;(a._tr_init = function (v) {
                F ||
                  ((function () {
                    var A,
                      L,
                      j,
                      E,
                      Z,
                      Y = new Array(h + 1)
                    for (E = j = 0; E < p - 1; E++) for (D[E] = j, A = 0; A < 1 << I[E]; A++) o[j++] = E
                    for (o[j - 1] = E, E = Z = 0; E < 16; E++) for (W[E] = Z, A = 0; A < 1 << H[E]; A++) R[Z++] = E
                    for (Z >>= 7; E < c; E++) for (W[E] = Z << 7, A = 0; A < 1 << (H[E] - 7); A++) R[256 + Z++] = E
                    for (L = 0; L <= h; L++) Y[L] = 0
                    for (A = 0; A <= 143; ) (ee[2 * A + 1] = 8), A++, Y[8]++
                    for (; A <= 255; ) (ee[2 * A + 1] = 9), A++, Y[9]++
                    for (; A <= 279; ) (ee[2 * A + 1] = 7), A++, Y[7]++
                    for (; A <= 287; ) (ee[2 * A + 1] = 8), A++, Y[8]++
                    for (be(ee, _ + 1, Y), A = 0; A < c; A++) (S[2 * A + 1] = 5), (S[2 * A] = he(A, 5))
                    ;(re = new te(ee, I, m + 1, _, h)), (M = new te(S, H, 0, c, h)), (ne = new te(new Array(0), T, 0, y, b))
                  })(),
                  (F = !0)),
                  (v.l_desc = new B(v.dyn_ltree, re)),
                  (v.d_desc = new B(v.dyn_dtree, M)),
                  (v.bl_desc = new B(v.bl_tree, ne)),
                  (v.bi_buf = 0),
                  (v.bi_valid = 0),
                  se(v)
              }),
                (a._tr_stored_block = k),
                (a._tr_flush_block = function (v, A, L, j) {
                  var E,
                    Z,
                    Y = 0
                  0 < v.level
                    ? (v.strm.data_type === 2 &&
                        (v.strm.data_type = (function ($) {
                          var J,
                            le = 4093624447
                          for (J = 0; J <= 31; J++, le >>>= 1) if (1 & le && $.dyn_ltree[2 * J] !== 0) return u
                          if ($.dyn_ltree[18] !== 0 || $.dyn_ltree[20] !== 0 || $.dyn_ltree[26] !== 0) return l
                          for (J = 32; J < m; J++) if ($.dyn_ltree[2 * J] !== 0) return l
                          return u
                        })(v)),
                      ke(v, v.l_desc),
                      ke(v, v.d_desc),
                      (Y = (function ($) {
                        var J
                        for (s($, $.dyn_ltree, $.l_desc.max_code), s($, $.dyn_dtree, $.d_desc.max_code), ke($, $.bl_desc), J = y - 1; 3 <= J && $.bl_tree[2 * V[J] + 1] === 0; J--);
                        return ($.opt_len += 3 * (J + 1) + 5 + 5 + 4), J
                      })(v)),
                      (E = (v.opt_len + 3 + 7) >>> 3),
                      (Z = (v.static_len + 3 + 7) >>> 3) <= E && (E = Z))
                    : (E = Z = L + 5),
                    L + 4 <= E && A !== -1
                      ? k(v, A, L, j)
                      : v.strategy === 4 || Z === E
                      ? (K(v, 2 + (j ? 1 : 0), 3), we(v, ee, S))
                      : (K(v, 4 + (j ? 1 : 0), 3),
                        (function ($, J, le, ie) {
                          var ye
                          for (K($, J - 257, 5), K($, le - 1, 5), K($, ie - 4, 4), ye = 0; ye < ie; ye++) K($, $.bl_tree[2 * V[ye] + 1], 3)
                          O($, $.dyn_ltree, J - 1), O($, $.dyn_dtree, le - 1)
                        })(v, v.l_desc.max_code + 1, v.d_desc.max_code + 1, Y + 1),
                        we(v, v.dyn_ltree, v.dyn_dtree)),
                    se(v),
                    j && oe(v)
                }),
                (a._tr_tally = function (v, A, L) {
                  return (
                    (v.pending_buf[v.d_buf + 2 * v.last_lit] = (A >>> 8) & 255),
                    (v.pending_buf[v.d_buf + 2 * v.last_lit + 1] = 255 & A),
                    (v.pending_buf[v.l_buf + v.last_lit] = 255 & L),
                    v.last_lit++,
                    A === 0 ? v.dyn_ltree[2 * L]++ : (v.matches++, A--, v.dyn_ltree[2 * (o[L] + m + 1)]++, v.dyn_dtree[2 * x(A)]++),
                    v.last_lit === v.lit_bufsize - 1
                  )
                }),
                (a._tr_align = function (v) {
                  K(v, 2, 3),
                    G(v, C, ee),
                    (function (A) {
                      A.bi_valid === 16
                        ? (Q(A, A.bi_buf), (A.bi_buf = 0), (A.bi_valid = 0))
                        : 8 <= A.bi_valid && ((A.pending_buf[A.pending++] = 255 & A.bi_buf), (A.bi_buf >>= 8), (A.bi_valid -= 8))
                    })(v)
                })
            },
            { '../utils/common': 41 }
          ],
          53: [
            function (e, r, a) {
              r.exports = function () {
                ;(this.input = null),
                  (this.next_in = 0),
                  (this.avail_in = 0),
                  (this.total_in = 0),
                  (this.output = null),
                  (this.next_out = 0),
                  (this.avail_out = 0),
                  (this.total_out = 0),
                  (this.msg = ''),
                  (this.state = null),
                  (this.data_type = 2),
                  (this.adler = 0)
              }
            },
            {}
          ],
          54: [
            function (e, r, a) {
              r.exports =
                typeof setImmediate == 'function'
                  ? setImmediate
                  : function () {
                      var n = [].slice.apply(arguments)
                      n.splice(1, 0, 0), setTimeout.apply(null, n)
                    }
            },
            {}
          ]
        },
        {},
        [10]
      )(10)
    })
  })(st)
  function Ft(f) {
    return f == null ? void 0 : f.replace(/[ .]+/g, '-').replace(/[&]+/g, 'and').toLowerCase()
  }
  function Oe(f) {
    let t = f.lastIndexOf('/') + 1,
      e = t == 0 ? '' : f.substring(0, t),
      r = t == 0 ? f : f.substring(t)
    return [e, r]
  }
  function He(f, t) {
    try {
      const e = 'http://docx/'
      return new URL(f, e + t).toString().substring(e.length)
    } catch {
      return `${t}${f}`
    }
  }
  function It(f, t) {
    return f.reduce((e, r) => ((e[t(r)] = r), e), {})
  }
  function Rt(f) {
    return new Promise((t, e) => {
      const r = new FileReader()
      ;(r.onloadend = () => t(r.result.replace(/application\/octet\-stream;/, 'image/png;'))), r.readAsDataURL(f)
    })
  }
  function Ze(f) {
    return f && typeof f == 'object' && !Array.isArray(f)
  }
  function De(f, ...t) {
    var r
    if (!t.length) return f
    const e = t.shift()
    if (Ze(f) && Ze(e))
      for (const a in e)
        if (Ze(e[a])) {
          const n = (r = f[a]) != null ? r : (f[a] = {})
          De(n, e[a])
        } else f[a] = e[a]
    return De(f, ...t)
  }
  class $e {
    constructor(t, e) {
      X(this, 'xmlParser', new nt())
      ;(this._zip = t), (this.options = e)
    }
    get(t) {
      return this._zip.files[Ot(t)]
    }
    update(t, e) {
      this._zip.file(t, e)
    }
    static load(t, e) {
      return st.exports.loadAsync(t).then((r) => new $e(r, e))
    }
    save(t = 'blob') {
      return this._zip.generateAsync({ type: t })
    }
    load(t, e = 'string') {
      var r, a
      return (a = (r = this.get(t)) == null ? void 0 : r.async(e)) != null ? a : Promise.resolve(null)
    }
    loadRelationships(t = null) {
      let e = '_rels/.rels'
      if (t != null) {
        const [r, a] = Oe(t)
        e = `${r}_rels/${a}.rels`
      }
      return this.load(e).then((r) => (r ? ve(this.parseXmlDocument(r).firstElementChild, this.xmlParser) : null))
    }
    parseXmlDocument(t) {
      return At(t, this.options.trimXmlDeclaration)
    }
  }
  function Ot(f) {
    return f.startsWith('/') ? f.substr(1) : f
  }
  class Dt extends _e {
    constructor(t, e, r) {
      super(t, e)
      X(this, '_documentParser')
      X(this, 'body')
      this._documentParser = r
    }
    parseXml(t) {
      this.body = this._documentParser.parseDocumentFile(t)
    }
  }
  function Le(f, t) {
    return {
      type: t.attr(f, 'val'),
      color: t.attr(f, 'color'),
      size: t.lengthAttr(f, 'sz', pe.Border),
      offset: t.lengthAttr(f, 'space', pe.Point),
      frame: t.boolAttr(f, 'frame'),
      shadow: t.boolAttr(f, 'shadow')
    }
  }
  function Lt(f, t) {
    var e = {}
    for (let r of t.elements(f))
      switch (r.localName) {
        case 'left':
          e.left = Le(r, t)
          break
        case 'top':
          e.top = Le(r, t)
          break
        case 'right':
          e.right = Le(r, t)
          break
        case 'bottom':
          e.bottom = Le(r, t)
          break
      }
    return e
  }
  function it(f, t = z) {
    var r, a
    var e = {}
    for (let n of t.elements(f))
      switch (n.localName) {
        case 'pgSz':
          e.pageSize = { width: t.lengthAttr(n, 'w'), height: t.lengthAttr(n, 'h'), orientation: t.attr(n, 'orient') }
          break
        case 'type':
          e.type = t.attr(n, 'val')
          break
        case 'pgMar':
          e.pageMargins = {
            left: t.lengthAttr(n, 'left'),
            right: t.lengthAttr(n, 'right'),
            top: t.lengthAttr(n, 'top'),
            bottom: t.lengthAttr(n, 'bottom'),
            header: t.lengthAttr(n, 'header'),
            footer: t.lengthAttr(n, 'footer'),
            gutter: t.lengthAttr(n, 'gutter')
          }
          break
        case 'cols':
          e.columns = Ut(n, t)
          break
        case 'headerReference':
          ;((r = e.headerRefs) != null ? r : (e.headerRefs = [])).push(ot(n, t))
          break
        case 'footerReference':
          ;((a = e.footerRefs) != null ? a : (e.footerRefs = [])).push(ot(n, t))
          break
        case 'titlePg':
          e.titlePage = t.boolAttr(n, 'val', !0)
          break
        case 'pgBorders':
          e.pageBorders = Lt(n, t)
          break
        case 'pgNumType':
          e.pageNumber = jt(n, t)
          break
      }
    return e
  }
  function Ut(f, t) {
    return {
      numberOfColumns: t.intAttr(f, 'num'),
      space: t.lengthAttr(f, 'space'),
      separator: t.boolAttr(f, 'sep'),
      equalWidth: t.boolAttr(f, 'equalWidth', !0),
      columns: t.elements(f, 'col').map((e) => ({ width: t.lengthAttr(e, 'w'), space: t.lengthAttr(e, 'space') }))
    }
  }
  function jt(f, t) {
    return { chapSep: t.attr(f, 'chapSep'), chapStyle: t.attr(f, 'chapStyle'), format: t.attr(f, 'fmt'), start: t.intAttr(f, 'start') }
  }
  function ot(f, t) {
    return { id: t.attr(f, 'id'), type: t.attr(f, 'type') }
  }
  function Mt(f, t) {
    return { before: t.lengthAttr(f, 'before'), after: t.lengthAttr(f, 'after'), line: t.intAttr(f, 'line'), lineRule: t.attr(f, 'lineRule') }
  }
  function Ve(f, t) {
    let e = {}
    for (let r of t.elements(f)) Wt(r, e, t)
    return e
  }
  function Wt(f, t, e) {
    return !!rt(f, t, e)
  }
  function lt(f, t) {
    let e = {}
    for (let r of t.elements(f)) ut(r, e, t)
    return e
  }
  function ut(f, t, e) {
    if (f.namespaceURI != et.wordml) return !1
    if (rt(f, t, e)) return !0
    switch (f.localName) {
      case 'tabs':
        t.tabs = Ht(f, e)
        break
      case 'sectPr':
        t.sectionProps = it(f, e)
        break
      case 'numPr':
        t.numbering = Zt(f, e)
        break
      case 'spacing':
        return (t.lineSpacing = Mt(f, e)), !1
      case 'textAlignment':
        return (t.textAlignment = e.attr(f, 'val')), !1
      case 'keepNext':
        t.keepLines = e.boolAttr(f, 'val', !0)
        break
      case 'pageBreakBefore':
        t.pageBreakBefore = e.boolAttr(f, 'val', !0)
        break
      case 'outlineLvl':
        t.outlineLevel = e.intAttr(f, 'val')
        break
      case 'pStyle':
        t.styleName = e.attr(f, 'val')
        break
      case 'rPr':
        t.runProps = Ve(f, e)
        break
      default:
        return !1
    }
    return !0
  }
  function Ht(f, t) {
    return t.elements(f, 'tab').map((e) => ({ position: t.lengthAttr(e, 'pos'), leader: t.attr(e, 'leader'), style: t.attr(e, 'val') }))
  }
  function Zt(f, t) {
    var e = {}
    for (let r of t.elements(f))
      switch (r.localName) {
        case 'numId':
          e.id = t.attr(r, 'val')
          break
        case 'ilvl':
          e.level = t.intAttr(r, 'val')
          break
      }
    return e
  }
  function $t(f, t) {
    let e = { numberings: [], abstractNumberings: [], bulletPictures: [] }
    for (let r of t.elements(f))
      switch (r.localName) {
        case 'num':
          e.numberings.push(Vt(r, t))
          break
        case 'abstractNum':
          e.abstractNumberings.push(Xt(r, t))
          break
        case 'numPicBullet':
          e.bulletPictures.push(Kt(r, t))
          break
      }
    return e
  }
  function Vt(f, t) {
    let e = { id: t.attr(f, 'numId'), overrides: [] }
    for (let r of t.elements(f))
      switch (r.localName) {
        case 'abstractNumId':
          e.abstractId = t.attr(r, 'val')
          break
        case 'lvlOverride':
          e.overrides.push(Gt(r, t))
          break
      }
    return e
  }
  function Xt(f, t) {
    let e = { id: t.attr(f, 'abstractNumId'), levels: [] }
    for (let r of t.elements(f))
      switch (r.localName) {
        case 'name':
          e.name = t.attr(r, 'val')
          break
        case 'multiLevelType':
          e.multiLevelType = t.attr(r, 'val')
          break
        case 'numStyleLink':
          e.numberingStyleLink = t.attr(r, 'val')
          break
        case 'styleLink':
          e.styleLink = t.attr(r, 'val')
          break
        case 'lvl':
          e.levels.push(ct(r, t))
          break
      }
    return e
  }
  function ct(f, t) {
    let e = { level: t.intAttr(f, 'ilvl') }
    for (let r of t.elements(f))
      switch (r.localName) {
        case 'start':
          e.start = t.attr(r, 'val')
          break
        case 'lvlRestart':
          e.restart = t.intAttr(r, 'val')
          break
        case 'numFmt':
          e.format = t.attr(r, 'val')
          break
        case 'lvlText':
          e.text = t.attr(r, 'val')
          break
        case 'lvlJc':
          e.justification = t.attr(r, 'val')
          break
        case 'lvlPicBulletId':
          e.bulletPictureId = t.attr(r, 'val')
          break
        case 'pStyle':
          e.paragraphStyle = t.attr(r, 'val')
          break
        case 'pPr':
          e.paragraphProps = lt(r, t)
          break
        case 'rPr':
          e.runProps = Ve(r, t)
          break
      }
    return e
  }
  function Gt(f, t) {
    let e = { level: t.intAttr(f, 'ilvl') }
    for (let r of t.elements(f))
      switch (r.localName) {
        case 'startOverride':
          e.start = t.intAttr(r, 'val')
          break
        case 'lvl':
          e.numberingLevel = ct(r, t)
          break
      }
    return e
  }
  function Kt(f, t) {
    var e = t.element(f, 'pict'),
      r = e && t.element(e, 'shape'),
      a = r && t.element(r, 'imagedata')
    return a ? { id: t.attr(f, 'numPicBulletId'), referenceId: t.attr(a, 'id'), style: t.attr(r, 'style') } : null
  }
  class Yt extends _e {
    constructor(t, e, r) {
      super(t, e)
      X(this, '_documentParser')
      X(this, 'numberings')
      X(this, 'abstractNumberings')
      X(this, 'bulletPictures')
      X(this, 'domNumberings')
      this._documentParser = r
    }
    parseXml(t) {
      Object.assign(this, $t(t, this._package.xmlParser)), (this.domNumberings = this._documentParser.parseNumberingFile(t))
    }
  }
  class qt extends _e {
    constructor(t, e, r) {
      super(t, e)
      X(this, 'styles')
      X(this, '_documentParser')
      this._documentParser = r
    }
    parseXml(t) {
      this.styles = this._documentParser.parseStylesFile(t)
    }
  }
  var q = ((f) => (
    (f.Document = 'document'),
    (f.Paragraph = 'paragraph'),
    (f.Run = 'run'),
    (f.Break = 'break'),
    (f.NoBreakHyphen = 'noBreakHyphen'),
    (f.Table = 'table'),
    (f.Row = 'row'),
    (f.Cell = 'cell'),
    (f.Hyperlink = 'hyperlink'),
    (f.Drawing = 'drawing'),
    (f.Image = 'image'),
    (f.Text = 'text'),
    (f.Tab = 'tab'),
    (f.Symbol = 'symbol'),
    (f.BookmarkStart = 'bookmarkStart'),
    (f.BookmarkEnd = 'bookmarkEnd'),
    (f.Footer = 'footer'),
    (f.Header = 'header'),
    (f.FootnoteReference = 'footnoteReference'),
    (f.EndnoteReference = 'endnoteReference'),
    (f.Footnote = 'footnote'),
    (f.Endnote = 'endnote'),
    (f.SimpleField = 'simpleField'),
    (f.ComplexField = 'complexField'),
    (f.Instruction = 'instruction'),
    f
  ))(q || {})
  class Jt {
    constructor() {
      X(this, 'type', q.Header)
      X(this, 'children', [])
      X(this, 'cssStyle', {})
      X(this, 'className')
      X(this, 'parent')
    }
  }
  class Qt {
    constructor() {
      X(this, 'type', q.Footer)
      X(this, 'children', [])
      X(this, 'cssStyle', {})
      X(this, 'className')
      X(this, 'parent')
    }
  }
  class ht extends _e {
    constructor(t, e, r) {
      super(t, e)
      X(this, 'rootElement')
      X(this, '_documentParser')
      this._documentParser = r
    }
    parseXml(t) {
      ;(this.rootElement = this.createRootElement()), (this.rootElement.children = this._documentParser.parseBodyElements(t))
    }
  }
  class er extends ht {
    createRootElement() {
      return new Jt()
    }
  }
  class tr extends ht {
    createRootElement() {
      return new Qt()
    }
  }
  function rr(f, t) {
    const e = {}
    for (let r of t.elements(f))
      switch (r.localName) {
        case 'Template':
          e.template = r.textContent
          break
        case 'Pages':
          e.pages = Ee(r.textContent)
          break
        case 'Words':
          e.words = Ee(r.textContent)
          break
        case 'Characters':
          e.characters = Ee(r.textContent)
          break
        case 'Application':
          e.application = r.textContent
          break
        case 'Lines':
          e.lines = Ee(r.textContent)
          break
        case 'Paragraphs':
          e.paragraphs = Ee(r.textContent)
          break
        case 'Company':
          e.company = r.textContent
          break
        case 'AppVersion':
          e.appVersion = r.textContent
          break
      }
    return e
  }
  function Ee(f) {
    if (typeof f != 'undefined') return parseInt(f)
  }
  class nr extends _e {
    constructor() {
      super(...arguments)
      X(this, 'props')
    }
    parseXml(t) {
      this.props = rr(t, this._package.xmlParser)
    }
  }
  function ar(f, t) {
    const e = {}
    for (let r of t.elements(f))
      switch (r.localName) {
        case 'title':
          e.title = r.textContent
          break
        case 'description':
          e.description = r.textContent
          break
        case 'subject':
          e.subject = r.textContent
          break
        case 'creator':
          e.creator = r.textContent
          break
        case 'keywords':
          e.keywords = r.textContent
          break
        case 'language':
          e.language = r.textContent
          break
        case 'lastModifiedBy':
          e.lastModifiedBy = r.textContent
          break
        case 'revision':
          r.textContent && (e.revision = parseInt(r.textContent))
          break
      }
    return e
  }
  class sr extends _e {
    constructor() {
      super(...arguments)
      X(this, 'props')
    }
    parseXml(t) {
      this.props = ar(t, this._package.xmlParser)
    }
  }
  class ir {
    constructor() {
      X(this, 'colorScheme')
      X(this, 'fontScheme')
    }
  }
  function or(f, t) {
    var e = new ir(),
      r = t.element(f, 'themeElements')
    for (let a of t.elements(r))
      switch (a.localName) {
        case 'clrScheme':
          e.colorScheme = lr(a, t)
          break
        case 'fontScheme':
          e.fontScheme = ur(a, t)
          break
      }
    return e
  }
  function lr(f, t) {
    var e = { name: t.attr(f, 'name'), colors: {} }
    for (let n of t.elements(f)) {
      var r = t.element(n, 'srgbClr'),
        a = t.element(n, 'sysClr')
      r ? (e.colors[n.localName] = t.attr(r, 'val')) : a && (e.colors[n.localName] = t.attr(a, 'lastClr'))
    }
    return e
  }
  function ur(f, t) {
    var e = { name: t.attr(f, 'name') }
    for (let r of t.elements(f))
      switch (r.localName) {
        case 'majorFont':
          e.majorFont = ft(r, t)
          break
        case 'minorFont':
          e.minorFont = ft(r, t)
          break
      }
    return e
  }
  function ft(f, t) {
    return { latinTypeface: t.elementAttr(f, 'latin', 'typeface'), eaTypeface: t.elementAttr(f, 'ea', 'typeface'), csTypeface: t.elementAttr(f, 'cs', 'typeface') }
  }
  class cr extends _e {
    constructor(t, e) {
      super(t, e)
      X(this, 'theme')
    }
    parseXml(t) {
      this.theme = or(t, this._package.xmlParser)
    }
  }
  class dt {
    constructor() {
      X(this, 'id')
      X(this, 'type')
      X(this, 'noteType')
      X(this, 'children', [])
      X(this, 'cssStyle', {})
      X(this, 'className')
      X(this, 'parent')
    }
  }
  class hr extends dt {
    constructor() {
      super(...arguments)
      X(this, 'type', q.Footnote)
    }
  }
  class fr extends dt {
    constructor() {
      super(...arguments)
      X(this, 'type', q.Endnote)
    }
  }
  class pt extends _e {
    constructor(t, e, r) {
      super(t, e)
      X(this, '_documentParser')
      X(this, 'notes')
      this._documentParser = r
    }
  }
  class dr extends pt {
    constructor(t, e, r) {
      super(t, e, r)
    }
    parseXml(t) {
      this.notes = this._documentParser.parseNotes(t, 'footnote', hr)
    }
  }
  class pr extends pt {
    constructor(t, e, r) {
      super(t, e, r)
    }
    parseXml(t) {
      this.notes = this._documentParser.parseNotes(t, 'endnote', fr)
    }
  }
  function mr(f, t) {
    var e = {}
    for (let r of t.elements(f))
      switch (r.localName) {
        case 'defaultTabStop':
          e.defaultTabStop = t.lengthAttr(r, 'val')
          break
        case 'footnotePr':
          e.footnoteProps = mt(r, t)
          break
        case 'endnotePr':
          e.endnoteProps = mt(r, t)
          break
        case 'autoHyphenation':
          e.autoHyphenation = t.boolAttr(r, 'val')
          break
      }
    return e
  }
  function mt(f, t) {
    var e = { defaultNoteIds: [] }
    for (let r of t.elements(f))
      switch (r.localName) {
        case 'numFmt':
          e.nummeringFormat = t.attr(r, 'val')
          break
        case 'footnote':
        case 'endnote':
          e.defaultNoteIds.push(t.attr(r, 'id'))
          break
      }
    return e
  }
  class gr extends _e {
    constructor(t, e) {
      super(t, e)
      X(this, 'settings')
    }
    parseXml(t) {
      this.settings = mr(t, this._package.xmlParser)
    }
  }
  function br(f, t) {
    return t.elements(f, 'property').map((e) => {
      const r = e.firstChild
      return { formatId: t.attr(e, 'fmtid'), name: t.attr(e, 'name'), type: r.nodeName, value: r.textContent }
    })
  }
  class vr extends _e {
    constructor() {
      super(...arguments)
      X(this, 'props')
    }
    parseXml(t) {
      this.props = br(t, this._package.xmlParser)
    }
  }
  const yr = [
    { type: ae.OfficeDocument, target: 'word/document.xml' },
    { type: ae.ExtendedProperties, target: 'docProps/app.xml' },
    { type: ae.CoreProperties, target: 'docProps/core.xml' },
    { type: ae.CustomProperties, target: 'docProps/custom.xml' }
  ]
  class Xe {
    constructor() {
      X(this, '_package')
      X(this, '_parser')
      X(this, '_options')
      X(this, 'rels')
      X(this, 'parts', [])
      X(this, 'partsMap', {})
      X(this, 'documentPart')
      X(this, 'fontTablePart')
      X(this, 'numberingPart')
      X(this, 'stylesPart')
      X(this, 'footnotesPart')
      X(this, 'endnotesPart')
      X(this, 'themePart')
      X(this, 'corePropsPart')
      X(this, 'extendedPropsPart')
      X(this, 'settingsPart')
    }
    static load(t, e, r) {
      var a = new Xe()
      return (
        (a._options = r),
        (a._parser = e),
        $e
          .load(t, r)
          .then((n) => ((a._package = n), a._package.loadRelationships()))
          .then((n) => {
            a.rels = n
            const u = yr.map((l) => {
              var d
              const i = (d = n.find((p) => p.type === l.type)) != null ? d : l
              return a.loadRelationshipPart(i.target, i.type)
            })
            return Promise.all(u)
          })
          .then(() => a)
      )
    }
    save(t = 'blob') {
      return this._package.save(t)
    }
    loadRelationshipPart(t, e) {
      if (this.partsMap[t]) return Promise.resolve(this.partsMap[t])
      if (!this._package.get(t)) return Promise.resolve(null)
      let r = null
      switch (e) {
        case ae.OfficeDocument:
          this.documentPart = r = new Dt(this._package, t, this._parser)
          break
        case ae.FontTable:
          this.fontTablePart = r = new Tt(this._package, t)
          break
        case ae.Numbering:
          this.numberingPart = r = new Yt(this._package, t, this._parser)
          break
        case ae.Styles:
          this.stylesPart = r = new qt(this._package, t, this._parser)
          break
        case ae.Theme:
          this.themePart = r = new cr(this._package, t)
          break
        case ae.Footnotes:
          this.footnotesPart = r = new dr(this._package, t, this._parser)
          break
        case ae.Endnotes:
          this.endnotesPart = r = new pr(this._package, t, this._parser)
          break
        case ae.Footer:
          r = new tr(this._package, t, this._parser)
          break
        case ae.Header:
          r = new er(this._package, t, this._parser)
          break
        case ae.CoreProperties:
          this.corePropsPart = r = new sr(this._package, t)
          break
        case ae.ExtendedProperties:
          this.extendedPropsPart = r = new nr(this._package, t)
          break
        case ae.CustomProperties:
          r = new vr(this._package, t)
          break
        case ae.Settings:
          this.settingsPart = r = new gr(this._package, t)
          break
      }
      return r == null
        ? Promise.resolve(null)
        : ((this.partsMap[t] = r),
          this.parts.push(r),
          r.load().then(() => {
            if (r.rels == null || r.rels.length == 0) return r
            const [a] = Oe(r.path),
              n = r.rels.map((u) => this.loadRelationshipPart(He(u.target, a), u.type))
            return Promise.all(n).then(() => r)
          }))
    }
    loadDocumentImage(t, e) {
      return this.loadResource(e != null ? e : this.documentPart, t, 'blob').then((r) => this.blobToURL(r))
    }
    loadNumberingImage(t) {
      return this.loadResource(this.numberingPart, t, 'blob').then((e) => this.blobToURL(e))
    }
    loadFont(t, e) {
      return this.loadResource(this.fontTablePart, t, 'uint8array').then((r) => r && this.blobToURL(new Blob([_r(r, e)])))
    }
    blobToURL(t) {
      return t ? (this._options.useBase64URL ? Rt(t) : URL.createObjectURL(t)) : null
    }
    findPartByRelId(t, e = null) {
      var n
      var r = ((n = e.rels) != null ? n : this.rels).find((u) => u.id == t)
      const a = e ? Oe(e.path)[0] : ''
      return r ? this.partsMap[He(r.target, a)] : null
    }
    getPathById(t, e) {
      const r = t.rels.find((n) => n.id == e),
        [a] = Oe(t.path)
      return r ? He(r.target, a) : null
    }
    loadResource(t, e, r) {
      const a = this.getPathById(t, e)
      return a ? this._package.load(a, r) : Promise.resolve(null)
    }
  }
  function _r(f, t) {
    const r = t.replace(/{|}|-/g, ''),
      a = new Array(16)
    for (let n = 0; n < 16; n++) a[16 - n - 1] = parseInt(r.substr(n * 2, 2), 16)
    for (let n = 0; n < 32; n++) f[n] = f[n] ^ a[n % 16]
    return f
  }
  function kr(f, t) {
    return { type: q.BookmarkStart, id: t.attr(f, 'id'), name: t.attr(f, 'name'), colFirst: t.intAttr(f, 'colFirst'), colLast: t.intAttr(f, 'colLast') }
  }
  function wr(f, t) {
    return { type: q.BookmarkEnd, id: t.attr(f, 'id') }
  }
  var Ue = { shd: 'inherit', color: 'black', borderColor: 'black', highlight: 'transparent' }
  class Sr {
    constructor(t) {
      X(this, 'options')
      this.options = Ce({ ignoreWidth: !1, debug: !1 }, t)
    }
    parseNotes(t, e, r) {
      var a = []
      for (let n of z.elements(t, e)) {
        const u = new r()
        ;(u.id = z.attr(n, 'id')), (u.noteType = z.attr(n, 'type')), (u.children = this.parseBodyElements(n)), a.push(u)
      }
      return a
    }
    parseDocumentFile(t) {
      var e = z.element(t, 'body'),
        r = z.element(t, 'background'),
        a = z.element(e, 'sectPr')
      return { type: q.Document, children: this.parseBodyElements(e), props: a ? it(a, z) : null, cssStyle: r ? this.parseBackground(r) : {} }
    }
    parseBackground(t) {
      var e = {},
        r = ue.colorAttr(t, 'color')
      return r && (e['background-color'] = r), e
    }
    parseBodyElements(t) {
      var e = []
      return (
        ue.foreach(t, (r) => {
          switch (r.localName) {
            case 'p':
              e.push(this.parseParagraph(r))
              break
            case 'tbl':
              e.push(this.parseTable(r))
              break
            case 'sdt':
              this.parseSdt(r).forEach((a) => e.push(a))
              break
          }
        }),
        e
      )
    }
    parseStylesFile(t) {
      var e = []
      return (
        ue.foreach(t, (r) => {
          switch (r.localName) {
            case 'style':
              e.push(this.parseStyle(r))
              break
            case 'docDefaults':
              e.push(this.parseDefaultStyles(r))
              break
          }
        }),
        e
      )
    }
    parseDefaultStyles(t) {
      var e = { id: null, name: null, target: null, basedOn: null, styles: [] }
      return (
        ue.foreach(t, (r) => {
          switch (r.localName) {
            case 'rPrDefault':
              var a = z.element(r, 'rPr')
              a && e.styles.push({ target: 'span', values: this.parseDefaultProperties(a, {}) })
              break
            case 'pPrDefault':
              var n = z.element(r, 'pPr')
              n && e.styles.push({ target: 'p', values: this.parseDefaultProperties(n, {}) })
              break
          }
        }),
        e
      )
    }
    parseStyle(t) {
      var e = { id: z.attr(t, 'styleId'), isDefault: z.boolAttr(t, 'default'), name: null, target: null, basedOn: null, styles: [], linked: null }
      switch (z.attr(t, 'type')) {
        case 'paragraph':
          e.target = 'p'
          break
        case 'table':
          e.target = 'table'
          break
        case 'character':
          e.target = 'span'
          break
      }
      return (
        ue.foreach(t, (r) => {
          switch (r.localName) {
            case 'basedOn':
              e.basedOn = z.attr(r, 'val')
              break
            case 'name':
              e.name = z.attr(r, 'val')
              break
            case 'link':
              e.linked = z.attr(r, 'val')
              break
            case 'next':
              e.next = z.attr(r, 'val')
              break
            case 'aliases':
              e.aliases = z.attr(r, 'val').split(',')
              break
            case 'pPr':
              e.styles.push({ target: 'p', values: this.parseDefaultProperties(r, {}) }), (e.paragraphProps = lt(r, z))
              break
            case 'rPr':
              e.styles.push({ target: 'span', values: this.parseDefaultProperties(r, {}) }), (e.runProps = Ve(r, z))
              break
            case 'tblPr':
            case 'tcPr':
              e.styles.push({ target: 'td', values: this.parseDefaultProperties(r, {}) })
              break
            case 'tblStylePr':
              for (let a of this.parseTableStyle(r)) e.styles.push(a)
              break
            case 'rsid':
            case 'qFormat':
            case 'hidden':
            case 'semiHidden':
            case 'unhideWhenUsed':
            case 'autoRedefine':
            case 'uiPriority':
              break
            default:
              this.options.debug && console.warn(`DOCX: Unknown style element: ${r.localName}`)
          }
        }),
        e
      )
    }
    parseTableStyle(t) {
      var e = [],
        r = z.attr(t, 'type'),
        a = '',
        n = ''
      switch (r) {
        case 'firstRow':
          ;(n = '.first-row'), (a = 'tr.first-row td')
          break
        case 'lastRow':
          ;(n = '.last-row'), (a = 'tr.last-row td')
          break
        case 'firstCol':
          ;(n = '.first-col'), (a = 'td.first-col')
          break
        case 'lastCol':
          ;(n = '.last-col'), (a = 'td.last-col')
          break
        case 'band1Vert':
          ;(n = ':not(.no-vband)'), (a = 'td.odd-col')
          break
        case 'band2Vert':
          ;(n = ':not(.no-vband)'), (a = 'td.even-col')
          break
        case 'band1Horz':
          ;(n = ':not(.no-hband)'), (a = 'tr.odd-row')
          break
        case 'band2Horz':
          ;(n = ':not(.no-hband)'), (a = 'tr.even-row')
          break
        default:
          return []
      }
      return (
        ue.foreach(t, (u) => {
          switch (u.localName) {
            case 'pPr':
              e.push({ target: `${a} p`, mod: n, values: this.parseDefaultProperties(u, {}) })
              break
            case 'rPr':
              e.push({ target: `${a} span`, mod: n, values: this.parseDefaultProperties(u, {}) })
              break
            case 'tblPr':
            case 'tcPr':
              e.push({ target: a, mod: n, values: this.parseDefaultProperties(u, {}) })
              break
          }
        }),
        e
      )
    }
    parseNumberingFile(t) {
      var e = [],
        r = {},
        a = []
      return (
        ue.foreach(t, (n) => {
          switch (n.localName) {
            case 'abstractNum':
              this.parseAbstractNumbering(n, a).forEach((i) => e.push(i))
              break
            case 'numPicBullet':
              a.push(this.parseNumberingPicBullet(n))
              break
            case 'num':
              var u = z.attr(n, 'numId'),
                l = z.elementAttr(n, 'abstractNumId', 'val')
              r[l] = u
              break
          }
        }),
        e.forEach((n) => (n.id = r[n.id])),
        e
      )
    }
    parseNumberingPicBullet(t) {
      var e = z.element(t, 'pict'),
        r = e && z.element(e, 'shape'),
        a = r && z.element(r, 'imagedata')
      return a ? { id: z.intAttr(t, 'numPicBulletId'), src: z.attr(a, 'id'), style: z.attr(r, 'style') } : null
    }
    parseAbstractNumbering(t, e) {
      var r = [],
        a = z.attr(t, 'abstractNumId')
      return (
        ue.foreach(t, (n) => {
          switch (n.localName) {
            case 'lvl':
              r.push(this.parseNumberingLevel(a, n, e))
              break
          }
        }),
        r
      )
    }
    parseNumberingLevel(t, e, r) {
      var a = { id: t, level: z.intAttr(e, 'ilvl'), pStyleName: void 0, pStyle: {}, rStyle: {}, suff: 'tab' }
      return (
        ue.foreach(e, (n) => {
          switch (n.localName) {
            case 'pPr':
              this.parseDefaultProperties(n, a.pStyle)
              break
            case 'rPr':
              this.parseDefaultProperties(n, a.rStyle)
              break
            case 'lvlPicBulletId':
              var u = z.intAttr(n, 'val')
              a.bullet = r.find((l) => l.id == u)
              break
            case 'lvlText':
              a.levelText = z.attr(n, 'val')
              break
            case 'pStyle':
              a.pStyleName = z.attr(n, 'val')
              break
            case 'numFmt':
              a.format = z.attr(n, 'val')
              break
            case 'suff':
              a.suff = z.attr(n, 'val')
              break
          }
        }),
        a
      )
    }
    parseSdt(t) {
      const e = z.element(t, 'sdtContent')
      return e ? this.parseBodyElements(e) : []
    }
    parseParagraph(t) {
      var e = { type: q.Paragraph, children: [] }
      return (
        ue.foreach(t, (r) => {
          switch (r.localName) {
            case 'r':
              e.children.push(this.parseRun(r, e))
              break
            case 'hyperlink':
              e.children.push(this.parseHyperlink(r, e))
              break
            case 'bookmarkStart':
              e.children.push(kr(r, z))
              break
            case 'bookmarkEnd':
              e.children.push(wr(r, z))
              break
            case 'pPr':
              this.parseParagraphProperties(r, e)
              break
          }
        }),
        e
      )
    }
    parseParagraphProperties(t, e) {
      this.parseDefaultProperties(t, (e.cssStyle = {}), null, (r) => {
        if (ut(r, e, z)) return !0
        switch (r.localName) {
          case 'pStyle':
            e.styleName = z.attr(r, 'val')
            break
          case 'cnfStyle':
            e.className = ce.classNameOfCnfStyle(r)
            break
          case 'framePr':
            this.parseFrame(r, e)
            break
          case 'rPr':
            break
          default:
            return !1
        }
        return !0
      })
    }
    parseFrame(t, e) {
      var r = z.attr(t, 'dropCap')
      r == 'drop' && (e.cssStyle.float = 'left')
    }
    parseHyperlink(t, e) {
      var r = { type: q.Hyperlink, parent: e, children: [] },
        a = z.attr(t, 'anchor')
      return (
        a && (r.href = '#' + a),
        ue.foreach(t, (n) => {
          switch (n.localName) {
            case 'r':
              r.children.push(this.parseRun(n, r))
              break
          }
        }),
        r
      )
    }
    parseRun(t, e) {
      var r = { type: q.Run, parent: e, children: [] }
      return (
        ue.foreach(t, (a) => {
          switch (a.localName) {
            case 't':
              r.children.push({ type: q.Text, text: a.textContent })
              break
            case 'fldSimple':
              r.children.push({ type: q.SimpleField, instruction: z.attr(a, 'instr'), lock: z.boolAttr(a, 'lock', !1), dirty: z.boolAttr(a, 'dirty', !1) })
              break
            case 'instrText':
              ;(r.fieldRun = !0), r.children.push({ type: q.Instruction, text: a.textContent })
              break
            case 'fldChar':
              ;(r.fieldRun = !0), r.children.push({ type: q.ComplexField, charType: z.attr(a, 'fldCharType'), lock: z.boolAttr(a, 'lock', !1), dirty: z.boolAttr(a, 'dirty', !1) })
              break
            case 'noBreakHyphen':
              r.children.push({ type: q.NoBreakHyphen })
              break
            case 'br':
              r.children.push({ type: q.Break, break: z.attr(a, 'type') || 'textWrapping' })
              break
            case 'lastRenderedPageBreak':
              r.children.push({ type: q.Break, break: 'lastRenderedPageBreak' })
              break
            case 'sym':
              r.children.push({ type: q.Symbol, font: z.attr(a, 'font'), char: z.attr(a, 'char') })
              break
            case 'tab':
              r.children.push({ type: q.Tab })
              break
            case 'footnoteReference':
              r.children.push({ type: q.FootnoteReference, id: z.attr(a, 'id') })
              break
            case 'endnoteReference':
              r.children.push({ type: q.EndnoteReference, id: z.attr(a, 'id') })
              break
            case 'drawing':
              let n = this.parseDrawing(a)
              n && (r.children = [n])
              break
            case 'rPr':
              this.parseRunProperties(a, r)
              break
          }
        }),
        r
      )
    }
    parseRunProperties(t, e) {
      this.parseDefaultProperties(t, (e.cssStyle = {}), null, (r) => {
        switch (r.localName) {
          case 'rStyle':
            e.styleName = z.attr(r, 'val')
            break
          case 'vertAlign':
            e.verticalAlign = ce.valueOfVertAlign(r, !0)
            break
          default:
            return !1
        }
        return !0
      })
    }
    parseDrawing(t) {
      for (var e of z.elements(t))
        switch (e.localName) {
          case 'inline':
          case 'anchor':
            return this.parseDrawingWrapper(e)
        }
    }
    parseDrawingWrapper(t) {
      var _
      var e = { type: q.Drawing, children: [], cssStyle: {} },
        r = t.localName == 'anchor'
      let a = null,
        n = z.boolAttr(t, 'simplePos'),
        u = { relative: 'page', align: 'left', offset: '0' },
        l = { relative: 'page', align: 'top', offset: '0' }
      for (var i of z.elements(t))
        switch (i.localName) {
          case 'simplePos':
            n && ((u.offset = z.lengthAttr(i, 'x', pe.Emu)), (l.offset = z.lengthAttr(i, 'y', pe.Emu)))
            break
          case 'extent':
            ;(e.cssStyle.width = z.lengthAttr(i, 'cx', pe.Emu)), (e.cssStyle.height = z.lengthAttr(i, 'cy', pe.Emu))
            break
          case 'positionH':
          case 'positionV':
            if (!n) {
              let c = i.localName == 'positionH' ? u : l
              var d = z.element(i, 'align'),
                p = z.element(i, 'posOffset')
              ;(c.relative = (_ = z.attr(i, 'relativeFrom')) != null ? _ : c.relative), d && (c.align = d.textContent), p && (c.offset = ue.sizeValue(p, pe.Emu))
            }
            break
          case 'wrapTopAndBottom':
            a = 'wrapTopAndBottom'
            break
          case 'wrapNone':
            a = 'wrapNone'
            break
          case 'graphic':
            var m = this.parseGraphic(i)
            m && e.children.push(m)
            break
        }
      return (
        a == 'wrapTopAndBottom'
          ? ((e.cssStyle.display = 'block'), u.align && ((e.cssStyle['text-align'] = u.align), (e.cssStyle.width = '100%')))
          : a == 'wrapNone'
          ? ((e.cssStyle.display = 'block'),
            (e.cssStyle.position = 'relative'),
            (e.cssStyle.width = '0px'),
            (e.cssStyle.height = '0px'),
            u.offset && (e.cssStyle.left = u.offset),
            l.offset && (e.cssStyle.top = l.offset))
          : r && (u.align == 'left' || u.align == 'right') && (e.cssStyle.float = u.align),
        e
      )
    }
    parseGraphic(t) {
      var e = z.element(t, 'graphicData')
      for (let r of z.elements(e))
        switch (r.localName) {
          case 'pic':
            return this.parsePicture(r)
        }
      return null
    }
    parsePicture(t) {
      var e = { type: q.Image, src: '', cssStyle: {} },
        r = z.element(t, 'blipFill'),
        a = z.element(r, 'blip')
      e.src = z.attr(a, 'embed')
      var n = z.element(t, 'spPr'),
        u = z.element(n, 'xfrm')
      e.cssStyle.position = 'relative'
      for (var l of z.elements(u))
        switch (l.localName) {
          case 'ext':
            ;(e.cssStyle.width = z.lengthAttr(l, 'cx', pe.Emu)), (e.cssStyle.height = z.lengthAttr(l, 'cy', pe.Emu))
            break
          case 'off':
            ;(e.cssStyle.left = z.lengthAttr(l, 'x', pe.Emu)), (e.cssStyle.top = z.lengthAttr(l, 'y', pe.Emu))
            break
        }
      return e
    }
    parseTable(t) {
      var e = { type: q.Table, children: [] }
      return (
        ue.foreach(t, (r) => {
          switch (r.localName) {
            case 'tr':
              e.children.push(this.parseTableRow(r))
              break
            case 'tblGrid':
              e.columns = this.parseTableColumns(r)
              break
            case 'tblPr':
              this.parseTableProperties(r, e)
              break
          }
        }),
        e
      )
    }
    parseTableColumns(t) {
      var e = []
      return (
        ue.foreach(t, (r) => {
          switch (r.localName) {
            case 'gridCol':
              e.push({ width: z.lengthAttr(r, 'w') })
              break
          }
        }),
        e
      )
    }
    parseTableProperties(t, e) {
      switch (
        ((e.cssStyle = {}),
        (e.cellStyle = {}),
        this.parseDefaultProperties(t, e.cssStyle, e.cellStyle, (r) => {
          switch (r.localName) {
            case 'tblStyle':
              e.styleName = z.attr(r, 'val')
              break
            case 'tblLook':
              e.className = ce.classNameOftblLook(r)
              break
            case 'tblpPr':
              this.parseTablePosition(r, e)
              break
            case 'tblStyleColBandSize':
              e.colBandSize = z.intAttr(r, 'val')
              break
            case 'tblStyleRowBandSize':
              e.rowBandSize = z.intAttr(r, 'val')
              break
            default:
              return !1
          }
          return !0
        }),
        e.cssStyle['text-align'])
      ) {
        case 'center':
          delete e.cssStyle['text-align'], (e.cssStyle['margin-left'] = 'auto'), (e.cssStyle['margin-right'] = 'auto')
          break
        case 'right':
          delete e.cssStyle['text-align'], (e.cssStyle['margin-left'] = 'auto')
          break
      }
    }
    parseTablePosition(t, e) {
      var r = z.lengthAttr(t, 'topFromText'),
        a = z.lengthAttr(t, 'bottomFromText'),
        n = z.lengthAttr(t, 'rightFromText'),
        u = z.lengthAttr(t, 'leftFromText')
      ;(e.cssStyle.float = 'left'),
        (e.cssStyle['margin-bottom'] = ce.addSize(e.cssStyle['margin-bottom'], a)),
        (e.cssStyle['margin-left'] = ce.addSize(e.cssStyle['margin-left'], u)),
        (e.cssStyle['margin-right'] = ce.addSize(e.cssStyle['margin-right'], n)),
        (e.cssStyle['margin-top'] = ce.addSize(e.cssStyle['margin-top'], r))
    }
    parseTableRow(t) {
      var e = { type: q.Row, children: [] }
      return (
        ue.foreach(t, (r) => {
          switch (r.localName) {
            case 'tc':
              e.children.push(this.parseTableCell(r))
              break
            case 'trPr':
              this.parseTableRowProperties(r, e)
              break
          }
        }),
        e
      )
    }
    parseTableRowProperties(t, e) {
      e.cssStyle = this.parseDefaultProperties(t, {}, null, (r) => {
        switch (r.localName) {
          case 'cnfStyle':
            e.className = ce.classNameOfCnfStyle(r)
            break
          case 'tblHeader':
            e.isHeader = z.boolAttr(r, 'val')
            break
          default:
            return !1
        }
        return !0
      })
    }
    parseTableCell(t) {
      var e = { type: q.Cell, children: [] }
      return (
        ue.foreach(t, (r) => {
          switch (r.localName) {
            case 'tbl':
              e.children.push(this.parseTable(r))
              break
            case 'p':
              e.children.push(this.parseParagraph(r))
              break
            case 'tcPr':
              this.parseTableCellProperties(r, e)
              break
          }
        }),
        e
      )
    }
    parseTableCellProperties(t, e) {
      e.cssStyle = this.parseDefaultProperties(t, {}, null, (r) => {
        var a
        switch (r.localName) {
          case 'gridSpan':
            e.span = z.intAttr(r, 'val', null)
            break
          case 'vMerge':
            e.verticalMerge = (a = z.attr(r, 'val')) != null ? a : 'continue'
            break
          case 'cnfStyle':
            e.className = ce.classNameOfCnfStyle(r)
            break
          default:
            return !1
        }
        return !0
      })
    }
    parseDefaultProperties(t, e = null, r = null, a = null) {
      return (
        (e = e || {}),
        ue.foreach(t, (n) => {
          if (!(a != null && a(n)))
            switch (n.localName) {
              case 'jc':
                e['text-align'] = ce.valueOfJc(n)
                break
              case 'textAlignment':
                e['vertical-align'] = ce.valueOfTextAlignment(n)
                break
              case 'color':
                e.color = ue.colorAttr(n, 'val', null, Ue.color)
                break
              case 'sz':
                e['font-size'] = e['min-height'] = z.lengthAttr(n, 'val', pe.FontSize)
                break
              case 'shd':
                e['background-color'] = ue.colorAttr(n, 'fill', null, Ue.shd)
                break
              case 'highlight':
                e['background-color'] = ue.colorAttr(n, 'val', null, Ue.highlight)
                break
              case 'vertAlign':
                break
              case 'position':
                e.verticalAlign = z.lengthAttr(n, 'val', pe.FontSize)
                break
              case 'tcW':
                if (this.options.ignoreWidth) break
              case 'tblW':
                e.width = ce.valueOfSize(n, 'w')
                break
              case 'trHeight':
                this.parseTrHeight(n, e)
                break
              case 'strike':
                e['text-decoration'] = z.boolAttr(n, 'val', !0) ? 'line-through' : 'none'
                break
              case 'b':
                e['font-weight'] = z.boolAttr(n, 'val', !0) ? 'bold' : 'normal'
                break
              case 'i':
                e['font-style'] = z.boolAttr(n, 'val', !0) ? 'italic' : 'normal'
                break
              case 'caps':
                e['text-transform'] = z.boolAttr(n, 'val', !0) ? 'uppercase' : 'none'
                break
              case 'smallCaps':
                e['text-transform'] = z.boolAttr(n, 'val', !0) ? 'lowercase' : 'none'
                break
              case 'u':
                this.parseUnderline(n, e)
                break
              case 'ind':
              case 'tblInd':
                this.parseIndentation(n, e)
                break
              case 'rFonts':
                this.parseFont(n, e)
                break
              case 'tblBorders':
                this.parseBorderProperties(n, r || e)
                break
              case 'tblCellSpacing':
                ;(e['border-spacing'] = ce.valueOfMargin(n)), (e['border-collapse'] = 'separate')
                break
              case 'pBdr':
                this.parseBorderProperties(n, e)
                break
              case 'bdr':
                e.border = ce.valueOfBorder(n)
                break
              case 'tcBorders':
                this.parseBorderProperties(n, e)
                break
              case 'vanish':
                z.boolAttr(n, 'val', !0) && (e.display = 'none')
                break
              case 'kern':
                break
              case 'noWrap':
                break
              case 'tblCellMar':
              case 'tcMar':
                this.parseMarginProperties(n, r || e)
                break
              case 'tblLayout':
                e['table-layout'] = ce.valueOfTblLayout(n)
                break
              case 'vAlign':
                e['vertical-align'] = ce.valueOfTextAlignment(n)
                break
              case 'spacing':
                t.localName == 'pPr' && this.parseSpacing(n, e)
                break
              case 'wordWrap':
                z.boolAttr(n, 'val') && (e['overflow-wrap'] = 'break-word')
                break
              case 'bCs':
              case 'iCs':
              case 'szCs':
              case 'tabs':
              case 'outlineLvl':
              case 'contextualSpacing':
              case 'tblStyleColBandSize':
              case 'tblStyleRowBandSize':
              case 'webHidden':
              case 'pageBreakBefore':
              case 'suppressLineNumbers':
              case 'keepLines':
              case 'keepNext':
              case 'lang':
              case 'widowControl':
              case 'bidi':
              case 'rtl':
              case 'noProof':
                break
              default:
                this.options.debug && console.warn(`DOCX: Unknown document element: ${t.localName}.${n.localName}`)
                break
            }
        }),
        e
      )
    }
    parseUnderline(t, e) {
      var r = z.attr(t, 'val')
      if (r != null) {
        switch (r) {
          case 'dash':
          case 'dashDotDotHeavy':
          case 'dashDotHeavy':
          case 'dashedHeavy':
          case 'dashLong':
          case 'dashLongHeavy':
          case 'dotDash':
          case 'dotDotDash':
            e['text-decoration-style'] = 'dashed'
            break
          case 'dotted':
          case 'dottedHeavy':
            e['text-decoration-style'] = 'dotted'
            break
          case 'double':
            e['text-decoration-style'] = 'double'
            break
          case 'single':
          case 'thick':
            e['text-decoration'] = 'underline'
            break
          case 'wave':
          case 'wavyDouble':
          case 'wavyHeavy':
            e['text-decoration-style'] = 'wavy'
            break
          case 'words':
            e['text-decoration'] = 'underline'
            break
          case 'none':
            e['text-decoration'] = 'none'
            break
        }
        var a = ue.colorAttr(t, 'color')
        a && (e['text-decoration-color'] = a)
      }
    }
    parseFont(t, e) {
      var r = z.attr(t, 'ascii'),
        a = ce.themeValue(t, 'asciiTheme'),
        n = [r, a].filter((u) => u).join(', ')
      n.length > 0 && (e['font-family'] = n)
    }
    parseIndentation(t, e) {
      var r = z.lengthAttr(t, 'firstLine'),
        a = z.lengthAttr(t, 'hanging'),
        n = z.lengthAttr(t, 'left'),
        u = z.lengthAttr(t, 'start'),
        l = z.lengthAttr(t, 'right'),
        i = z.lengthAttr(t, 'end')
      r && (e['text-indent'] = r), a && (e['text-indent'] = `-${a}`), (n || u) && (e['margin-left'] = n || u), (l || i) && (e['margin-right'] = l || i)
    }
    parseSpacing(t, e) {
      var r = z.lengthAttr(t, 'before'),
        a = z.lengthAttr(t, 'after'),
        n = z.intAttr(t, 'line', null),
        u = z.attr(t, 'lineRule')
      if ((r && (e['margin-top'] = r), a && (e['margin-bottom'] = a), n !== null))
        switch (u) {
          case 'auto':
            e['line-height'] = `${(n / 240).toFixed(2)}`
            break
          case 'atLeast':
            e['line-height'] = `calc(100% + ${n / 20}pt)`
            break
          default:
            e['line-height'] = e['min-height'] = `${n / 20}pt`
            break
        }
    }
    parseMarginProperties(t, e) {
      ue.foreach(t, (r) => {
        switch (r.localName) {
          case 'left':
            e['padding-left'] = ce.valueOfMargin(r)
            break
          case 'right':
            e['padding-right'] = ce.valueOfMargin(r)
            break
          case 'top':
            e['padding-top'] = ce.valueOfMargin(r)
            break
          case 'bottom':
            e['padding-bottom'] = ce.valueOfMargin(r)
            break
        }
      })
    }
    parseTrHeight(t, e) {
      switch (z.attr(t, 'hRule')) {
        case 'exact':
          e.height = z.lengthAttr(t, 'val')
          break
        case 'atLeast':
        default:
          e.height = z.lengthAttr(t, 'val')
          break
      }
    }
    parseBorderProperties(t, e) {
      ue.foreach(t, (r) => {
        switch (r.localName) {
          case 'start':
          case 'left':
            e['border-left'] = ce.valueOfBorder(r)
            break
          case 'end':
          case 'right':
            e['border-right'] = ce.valueOfBorder(r)
            break
          case 'top':
            e['border-top'] = ce.valueOfBorder(r)
            break
          case 'bottom':
            e['border-bottom'] = ce.valueOfBorder(r)
            break
        }
      })
    }
  }
  const Cr = [
    'black',
    'blue',
    'cyan',
    'darkBlue',
    'darkCyan',
    'darkGray',
    'darkGreen',
    'darkMagenta',
    'darkRed',
    'darkYellow',
    'green',
    'lightGray',
    'magenta',
    'none',
    'red',
    'white',
    'yellow'
  ]
  class ue {
    static foreach(t, e) {
      for (var r = 0; r < t.childNodes.length; r++) {
        let a = t.childNodes[r]
        a.nodeType == Node.ELEMENT_NODE && e(a)
      }
    }
    static colorAttr(t, e, r = null, a = 'black') {
      var n = z.attr(t, e)
      if (n) return n == 'auto' ? a : Cr.includes(n) ? n : `#${n}`
      var u = z.attr(t, 'themeColor')
      return u ? `var(--docx-${u}-color)` : r
    }
    static sizeValue(t, e = pe.Dxa) {
      return tt(t.textContent, e)
    }
  }
  class ce {
    static themeValue(t, e) {
      var r = z.attr(t, e)
      return r ? `var(--docx-${r}-font)` : null
    }
    static valueOfSize(t, e) {
      var r = pe.Dxa
      switch (z.attr(t, 'type')) {
        case 'dxa':
          break
        case 'pct':
          r = pe.Percent
          break
        case 'auto':
          return 'auto'
      }
      return z.lengthAttr(t, e, r)
    }
    static valueOfMargin(t) {
      return z.lengthAttr(t, 'w')
    }
    static valueOfBorder(t) {
      var e = z.attr(t, 'val')
      if (e == 'nil') return 'none'
      var r = ue.colorAttr(t, 'color'),
        a = z.lengthAttr(t, 'sz', pe.Border)
      return `${a} solid ${r == 'auto' ? Ue.borderColor : r}`
    }
    static valueOfTblLayout(t) {
      var e = z.attr(t, 'val')
      return e == 'fixed' ? 'fixed' : 'auto'
    }
    static classNameOfCnfStyle(t) {
      const e = z.attr(t, 'val')
      return ['first-row', 'last-row', 'first-col', 'last-col', 'odd-col', 'even-col', 'odd-row', 'even-row', 'ne-cell', 'nw-cell', 'se-cell', 'sw-cell']
        .filter((a, n) => e[n] == '1')
        .join(' ')
    }
    static valueOfJc(t) {
      var e = z.attr(t, 'val')
      switch (e) {
        case 'start':
        case 'left':
          return 'left'
        case 'center':
          return 'center'
        case 'end':
        case 'right':
          return 'right'
        case 'both':
          return 'justify'
      }
      return e
    }
    static valueOfVertAlign(t, e = !1) {
      var r = z.attr(t, 'val')
      switch (r) {
        case 'subscript':
          return 'sub'
        case 'superscript':
          return e ? 'sup' : 'super'
      }
      return e ? null : r
    }
    static valueOfTextAlignment(t) {
      var e = z.attr(t, 'val')
      switch (e) {
        case 'auto':
        case 'baseline':
          return 'baseline'
        case 'top':
          return 'top'
        case 'center':
          return 'middle'
        case 'bottom':
          return 'bottom'
      }
      return e
    }
    static addSize(t, e) {
      return t == null ? e : e == null ? t : `calc(${t} + ${e})`
    }
    static classNameOftblLook(t) {
      const e = z.hexAttr(t, 'val', 0)
      let r = ''
      return (
        (z.boolAttr(t, 'firstRow') || e & 32) && (r += ' first-row'),
        (z.boolAttr(t, 'lastRow') || e & 64) && (r += ' last-row'),
        (z.boolAttr(t, 'firstColumn') || e & 128) && (r += ' first-col'),
        (z.boolAttr(t, 'lastColumn') || e & 256) && (r += ' last-col'),
        (z.boolAttr(t, 'noHBand') || e & 512) && (r += ' no-hband'),
        (z.boolAttr(t, 'noVBand') || e & 1024) && (r += ' no-vband'),
        r.trim()
      )
    }
  }
  const gt = { pos: 0, leader: 'none', style: 'left' },
    Ar = 50
  function Pr(f = document.body) {
    const t = document.createElement('div')
    ;(t.style.width = '100pt'), f.appendChild(t)
    const e = 100 / t.offsetWidth
    return f.removeChild(t), e
  }
  function Er(f, t, e, r = 0.75) {
    const a = f.closest('p'),
      n = f.getBoundingClientRect(),
      u = a.getBoundingClientRect(),
      l = getComputedStyle(a),
      i = (t == null ? void 0 : t.length) > 0 ? t.map((b) => ({ pos: bt(b.position), leader: b.leader, style: b.style })).sort((b, C) => b.pos - C.pos) : [gt],
      d = i[i.length - 1],
      p = u.width * r,
      m = bt(e)
    let _ = d.pos + m
    if (_ < p) for (; _ < p && i.length < Ar; _ += m) i.push(Pe(Ce({}, gt), { pos: _ }))
    const c = parseFloat(l.marginLeft),
      y = u.left + c,
      w = (n.left - y) * r,
      h = i.find((b) => b.style != 'clear' && b.pos > w)
    if (h == null) return
    let g = 1
    if (h.style == 'right' || h.style == 'center') {
      const b = Array.from(a.querySelectorAll(`.${f.className}`)),
        C = b.indexOf(f) + 1,
        N = document.createRange()
      N.setStart(f, 1), C < b.length ? N.setEndBefore(b[C]) : N.setEndAfter(a)
      const P = h.style == 'center' ? 0.5 : 1,
        U = N.getBoundingClientRect(),
        I = U.left + P * U.width - (u.left - c)
      g = h.pos - I * r
    } else g = h.pos - w
    switch (((f.innerHTML = '&nbsp;'), (f.style.textDecoration = 'inherit'), (f.style.wordSpacing = `${g.toFixed(0)}pt`), h.leader)) {
      case 'dot':
      case 'middleDot':
        ;(f.style.textDecoration = 'underline'), (f.style.textDecorationStyle = 'dotted')
        break
      case 'hyphen':
      case 'heavy':
      case 'underscore':
        f.style.textDecoration = 'underline'
        break
    }
  }
  function bt(f) {
    return parseFloat(f)
  }
  var vt = { exports: {} },
    Ge = { exports: {} },
    Ke = { exports: {} },
    xe = 1e3,
    Be = xe * 60,
    ze = Be * 60,
    Ne = ze * 24,
    xr = Ne * 365.25,
    Br = function (f, t) {
      t = t || {}
      var e = typeof f
      if (e === 'string' && f.length > 0) return zr(f)
      if (e === 'number' && isNaN(f) === !1) return t.long ? Tr(f) : Nr(f)
      throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(f))
    }
  function zr(f) {
    if (((f = String(f)), !(f.length > 100))) {
      var t = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(f)
      if (!!t) {
        var e = parseFloat(t[1]),
          r = (t[2] || 'ms').toLowerCase()
        switch (r) {
          case 'years':
          case 'year':
          case 'yrs':
          case 'yr':
          case 'y':
            return e * xr
          case 'days':
          case 'day':
          case 'd':
            return e * Ne
          case 'hours':
          case 'hour':
          case 'hrs':
          case 'hr':
          case 'h':
            return e * ze
          case 'minutes':
          case 'minute':
          case 'mins':
          case 'min':
          case 'm':
            return e * Be
          case 'seconds':
          case 'second':
          case 'secs':
          case 'sec':
          case 's':
            return e * xe
          case 'milliseconds':
          case 'millisecond':
          case 'msecs':
          case 'msec':
          case 'ms':
            return e
          default:
            return
        }
      }
    }
  }
  function Nr(f) {
    return f >= Ne ? Math.round(f / Ne) + 'd' : f >= ze ? Math.round(f / ze) + 'h' : f >= Be ? Math.round(f / Be) + 'm' : f >= xe ? Math.round(f / xe) + 's' : f + 'ms'
  }
  function Tr(f) {
    return je(f, Ne, 'day') || je(f, ze, 'hour') || je(f, Be, 'minute') || je(f, xe, 'second') || f + ' ms'
  }
  function je(f, t, e) {
    if (!(f < t)) return f < t * 1.5 ? Math.floor(f / t) + ' ' + e : Math.ceil(f / t) + ' ' + e + 's'
  }
  ;(function (f, t) {
    ;(t = f.exports = a.debug = a.default = a),
      (t.coerce = i),
      (t.disable = u),
      (t.enable = n),
      (t.enabled = l),
      (t.humanize = Br),
      (t.names = []),
      (t.skips = []),
      (t.formatters = {})
    var e
    function r(d) {
      var p = 0,
        m
      for (m in d) (p = (p << 5) - p + d.charCodeAt(m)), (p |= 0)
      return t.colors[Math.abs(p) % t.colors.length]
    }
    function a(d) {
      function p() {
        if (!!p.enabled) {
          var m = p,
            _ = +new Date(),
            c = _ - (e || _)
          ;(m.diff = c), (m.prev = e), (m.curr = _), (e = _)
          for (var y = new Array(arguments.length), w = 0; w < y.length; w++) y[w] = arguments[w]
          ;(y[0] = t.coerce(y[0])), typeof y[0] != 'string' && y.unshift('%O')
          var h = 0
          ;(y[0] = y[0].replace(/%([a-zA-Z%])/g, function (b, C) {
            if (b === '%%') return b
            h++
            var N = t.formatters[C]
            if (typeof N == 'function') {
              var P = y[h]
              ;(b = N.call(m, P)), y.splice(h, 1), h--
            }
            return b
          })),
            t.formatArgs.call(m, y)
          var g = p.log || t.log || console.log.bind(console)
          g.apply(m, y)
        }
      }
      return (p.namespace = d), (p.enabled = t.enabled(d)), (p.useColors = t.useColors()), (p.color = r(d)), typeof t.init == 'function' && t.init(p), p
    }
    function n(d) {
      t.save(d), (t.names = []), (t.skips = [])
      for (var p = (typeof d == 'string' ? d : '').split(/[\s,]+/), m = p.length, _ = 0; _ < m; _++)
        !p[_] || ((d = p[_].replace(/\*/g, '.*?')), d[0] === '-' ? t.skips.push(new RegExp('^' + d.substr(1) + '$')) : t.names.push(new RegExp('^' + d + '$')))
    }
    function u() {
      t.enable('')
    }
    function l(d) {
      var p, m
      for (p = 0, m = t.skips.length; p < m; p++) if (t.skips[p].test(d)) return !1
      for (p = 0, m = t.names.length; p < m; p++) if (t.names[p].test(d)) return !0
      return !1
    }
    function i(d) {
      return d instanceof Error ? d.stack || d.message : d
    }
  })(Ke, Ke.exports),
    (function (f, t) {
      ;(t = f.exports = Ke.exports),
        (t.log = a),
        (t.formatArgs = r),
        (t.save = n),
        (t.load = u),
        (t.useColors = e),
        (t.storage = typeof chrome != 'undefined' && typeof chrome.storage != 'undefined' ? chrome.storage.local : l()),
        (t.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'])
      function e() {
        return typeof window != 'undefined' && window.process && window.process.type === 'renderer'
          ? !0
          : (typeof document != 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
              (typeof window != 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
              (typeof navigator != 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
              (typeof navigator != 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
      }
      t.formatters.j = function (i) {
        try {
          return JSON.stringify(i)
        } catch (d) {
          return '[UnexpectedJSONParseError]: ' + d.message
        }
      }
      function r(i) {
        var d = this.useColors
        if (((i[0] = (d ? '%c' : '') + this.namespace + (d ? ' %c' : ' ') + i[0] + (d ? '%c ' : ' ') + '+' + t.humanize(this.diff)), !!d)) {
          var p = 'color: ' + this.color
          i.splice(1, 0, p, 'color: inherit')
          var m = 0,
            _ = 0
          i[0].replace(/%[a-zA-Z%]/g, function (c) {
            c !== '%%' && (m++, c === '%c' && (_ = m))
          }),
            i.splice(_, 0, p)
        }
      }
      function a() {
        return typeof console == 'object' && console.log && Function.prototype.apply.call(console.log, console, arguments)
      }
      function n(i) {
        try {
          i == null ? t.storage.removeItem('debug') : (t.storage.debug = i)
        } catch {}
      }
      function u() {
        var i
        try {
          i = t.storage.debug
        } catch {}
        return !i && typeof process != 'undefined' && 'env' in process && (i = {}.DEBUG), i
      }
      t.enable(u())
      function l() {
        try {
          return window.localStorage
        } catch {}
      }
    })(Ge, Ge.exports),
    (function (f) {
      ;(function (t, e) {
        var r = f.exports
        r ? (f.exports = e(Ge.exports('eventproxy'))) : (this[t] = e())
      })('EventProxy', function (t) {
        t = t || function () {}
        /*!
         * refs
         */ var e = Array.prototype.slice,
          r = Array.prototype.concat,
          a = '__all__',
          n = function () {
            if (!(this instanceof n)) return new n()
            ;(this._callbacks = {}), (this._fired = {})
          }
        ;(n.prototype.addListener = function (i, d) {
          return t('Add listener for %s', i), (this._callbacks[i] = this._callbacks[i] || []), this._callbacks[i].push(d), this
        }),
          (n.prototype.bind = n.prototype.addListener),
          (n.prototype.on = n.prototype.addListener),
          (n.prototype.subscribe = n.prototype.addListener),
          (n.prototype.headbind = function (i, d) {
            return t('Add listener for %s', i), (this._callbacks[i] = this._callbacks[i] || []), this._callbacks[i].unshift(d), this
          }),
          (n.prototype.removeListener = function (i, d) {
            var p = this._callbacks
            if (!i) t('Remove all listeners'), (this._callbacks = {})
            else if (!d) t('Remove all listeners of %s', i), (p[i] = [])
            else {
              var m = p[i]
              if (m) for (var _ = m.length, c = 0; c < _; c++) d === m[c] && (t('Remove a listener of %s', i), (m[c] = null))
            }
            return this
          }),
          (n.prototype.unbind = n.prototype.removeListener),
          (n.prototype.removeAllListeners = function (i) {
            return this.unbind(i)
          }),
          (n.prototype.bindForAll = function (i) {
            this.bind(a, i)
          }),
          (n.prototype.unbindForAll = function (i) {
            this.unbind(a, i)
          }),
          (n.prototype.trigger = function (i, d) {
            var p,
              m,
              _,
              c,
              y,
              w = 2,
              h = this._callbacks
            for (t('Emit event %s with data %j', i, d); w--; )
              if (((m = w ? i : a), (p = h[m]), p))
                for (c = 0, y = p.length; c < y; c++)
                  if (!(_ = p[c])) p.splice(c, 1), c--, y--
                  else {
                    for (var g = [], b = w ? 1 : 0, C = b; C < arguments.length; C++) g.push(arguments[C])
                    _.apply(this, g)
                  }
            return this
          }),
          (n.prototype.emit = n.prototype.trigger),
          (n.prototype.fire = n.prototype.trigger),
          (n.prototype.once = function (i, d) {
            var p = this,
              m = function () {
                d.apply(p, arguments), p.unbind(i, m)
              }
            return this.bind(i, m), this
          })
        var u =
          (typeof setImmediate != 'undefined' && setImmediate) ||
          (typeof process != 'undefined' && process.nextTick) ||
          function (i) {
            setTimeout(i, 0)
          }
        ;(n.prototype.emitLater = function () {
          var i = this,
            d = arguments
          u(function () {
            i.trigger.apply(i, d)
          })
        }),
          (n.prototype.immediate = function (i, d, p) {
            return this.bind(i, d), this.trigger(i, p), this
          }),
          (n.prototype.asap = n.prototype.immediate)
        var l = function (i, d, p, m) {
          var _ = this,
            c = arguments.length,
            y = 0,
            w = {}
          if (c < 3) return this
          var h = e.call(arguments, 0, -2),
            g = arguments[c - 2],
            b = arguments[c - 1]
          if (typeof g != 'function') return this
          t('Assign listener for events %j, once is %s', h, !!b)
          for (
            var C = function (I) {
                var H = b ? 'once' : 'bind'
                _[H](I, function (T) {
                  ;(_._fired[I] = _._fired[I] || {}), (_._fired[I].data = T), w[I] || ((w[I] = !0), y++)
                })
              },
              N = h.length,
              P = 0;
            P < N;
            P++
          )
            C(h[P])
          var U = function (I) {
            if (!(y < N) && !!w[I]) {
              for (var H = [], T = 0; T < N; T++) H.push(_._fired[h[T]].data)
              b && _.unbindForAll(U), t('Events %j all emited with data %j', h, H), g.apply(null, H)
            }
          }
          _.bindForAll(U)
        }
        return (
          (n.prototype.all = function (i, d, p) {
            var m = r.apply([], arguments)
            return m.push(!0), l.apply(this, m), this
          }),
          (n.prototype.assign = n.prototype.all),
          (n.prototype.fail = function (i) {
            var d = this
            return (
              d.once('error', function () {
                d.unbind(), i.apply(null, arguments)
              }),
              this
            )
          }),
          (n.prototype.throw = function () {
            var i = this
            i.emit.apply(i, ['error'].concat(e.call(arguments)))
          }),
          (n.prototype.tail = function () {
            var i = r.apply([], arguments)
            return i.push(!1), l.apply(this, i), this
          }),
          (n.prototype.assignAll = n.prototype.tail),
          (n.prototype.assignAlways = n.prototype.tail),
          (n.prototype.after = function (i, d, p) {
            if (d === 0) return p.call(null, []), this
            var m = this,
              _ = []
            this._after = this._after || {}
            var c = i + '_group'
            ;(this._after[c] = { index: 0, results: [] }), t("After emit %s times, event %s's listenner will execute", d, i)
            var y = function (w, h) {
              w === i && (d--, _.push(h), d < 1 && (t('Event %s was emit %s, and execute the listenner', i, d), m.unbindForAll(y), p.apply(null, [_]))),
                w === c &&
                  (d--,
                  (m._after[c].results[h.index] = h.result),
                  d < 1 && (t('Event %s was emit %s, and execute the listenner', i, d), m.unbindForAll(y), p.call(null, m._after[c].results)))
            }
            return m.bindForAll(y), this
          }),
          (n.prototype.group = function (i, d) {
            var p = this,
              m = i + '_group',
              _ = p._after[m].index
            return (
              p._after[m].index++,
              function (c, y) {
                if (c) return p.emit.apply(p, ['error'].concat(e.call(arguments)))
                p.emit(m, { index: _, result: d ? d.apply(null, e.call(arguments, 1)) : y })
              }
            )
          }),
          (n.prototype.any = function () {
            var i = this,
              d = arguments[arguments.length - 1],
              p = e.call(arguments, 0, -1),
              m = p.join('_')
            t('Add listenner for Any of events %j emit', p), i.once(m, d)
            for (
              var _ = function (y) {
                  i.bind(y, function (w) {
                    t('One of events %j emited, execute the listenner'), i.trigger(m, { data: w, eventName: y })
                  })
                },
                c = 0;
              c < p.length;
              c++
            )
              _(p[c])
          }),
          (n.prototype.not = function (i, d) {
            var p = this
            t('Add listenner for not event %s', i),
              p.bindForAll(function (m, _) {
                m !== i && (t('listenner execute of event %s emit, but not event %s.', m, i), d(_))
              })
          }),
          (n.prototype.done = function (i, d) {
            var p = this
            return function (m, _) {
              if (m) return p.emit.apply(p, ['error'].concat(e.call(arguments)))
              var c = e.call(arguments, 1)
              if (typeof i == 'string') return d ? p.emit(i, d.apply(null, c)) : p.emit.apply(p, [i].concat(c))
              if (arguments.length <= 2) return i(_)
              i.apply(null, c)
            }
          }),
          (n.prototype.doneLater = function (i, d) {
            var p = this.done(i, d)
            return function (m, _) {
              var c = arguments
              u(function () {
                p.apply(null, c)
              })
            }
          }),
          (n.create = function () {
            var i = new n(),
              d = r.apply([], arguments)
            if (d.length) {
              var p = d[d.length - 1],
                m = d[d.length - 2]
              typeof p == 'function' && typeof m == 'function' && (d.pop(), i.fail(p)), i.assign.apply(i, d)
            }
            return i
          }),
          (n.EventProxy = n),
          n
        )
      })
    })(vt)
  var Fr = vt.exports
  class Ir {
    constructor(t) {
      X(this, 'className', 'docx')
      X(this, 'document')
      X(this, 'options')
      X(this, 'styleMap', {})
      X(this, 'currentPart', null)
      X(this, 'tableVerticalMerges', [])
      X(this, 'currentVerticalMerge', null)
      X(this, 'tableCellPositions', [])
      X(this, 'currentCellPosition', null)
      X(this, 'footnoteMap', {})
      X(this, 'endnoteMap', {})
      X(this, 'currentFootnoteIds')
      X(this, 'currentEndnoteIds', [])
      X(this, 'usedHederFooterParts', [])
      X(this, 'renderImageCount', 0)
      X(this, 'defaultTabSize')
      X(this, 'domNumberings', {})
      X(this, 'ep2', new Fr())
      X(this, 'currentTabs', [])
      X(this, 'tabsTimeout', 0)
      X(this, 'createElement', yt)
      this.htmlDocument = t
    }
    render(t, e, r = null, a) {
      return new Promise((n) => {
        var l
        ;(this.document = t),
          (this.options = a),
          (this.className = a.className),
          (this.styleMap = null),
          (this.renderImageCount = 0),
          (r = r || e),
          Rr(e),
          t.numberingPart &&
            (this.prodessNumberings(t.numberingPart.domNumberings),
            t.numberingPart.domNumberings.forEach((i) => {
              !this.domNumberings[i.id] && (this.domNumberings[i.id] = {}), (this.domNumberings[i.id][i.level] = Pe(Ce({}, i), { count: 1, pCount: 1 }))
            })),
          t.settingsPart && (this.defaultTabSize = (l = t.settingsPart.settings) == null ? void 0 : l.defaultTabStop),
          !a.ignoreFonts && t.fontTablePart && this.renderFontTable(t.fontTablePart, r),
          (this.countNum = 100)
        var u = this.renderSections(t.documentPart.body)
        Ye(e, u),
          this.refreshTabStops(),
          this.ep2.after('renderImage', this.renderImageCount, (i) => {
            n('ok')
          })
      })
    }
    renderTheme(t, e) {
      var l, i
      const r = {},
        a = (l = t.theme) == null ? void 0 : l.fontScheme
      a && (a.majorFont && (r['--docx-majorHAnsi-font'] = a.majorFont.latinTypeface), a.minorFont && (r['--docx-minorHAnsi-font'] = a.minorFont.latinTypeface))
      const n = (i = t.theme) == null ? void 0 : i.colorScheme
      if (n) for (let [d, p] of Object.entries(n.colors)) r[`--docx-${d}-color`] = `#${p}`
      const u = this.styleToString(`.${this.className}`, r)
      e.appendChild(qe(u))
    }
    renderFontTable(t, e) {
      for (let r of t.fonts)
        for (let a of r.embedFontRefs)
          this.document.loadFont(a.id, a.key).then((n) => {
            const u = { 'font-family': r.name, src: `url(${n})` }
            ;(a.type == 'bold' || a.type == 'boldItalic') && (u['font-weight'] = 'bold'),
              (a.type == 'italic' || a.type == 'boldItalic') && (u['font-style'] = 'italic'),
              Or(e, `docxjs ${r.name} font`)
            const l = this.styleToString('@font-face', u)
            e.appendChild(qe(l)), this.refreshTabStops()
          })
    }
    processStyleName(t) {
      return t ? `${this.className}_${Ft(t)}` : this.className
    }
    processStyles(t) {
      const e = It(
        t.filter((a) => a.id != null),
        (a) => a.id
      )
      for (const a of t.filter((n) => n.basedOn)) {
        var r = e[a.basedOn]
        if (r) {
          ;(a.paragraphProps = De(a.paragraphProps, r.paragraphProps)), (a.runProps = De(a.runProps, r.runProps))
          for (const n of r.styles) {
            const u = a.styles.find((l) => l.target == n.target)
            u ? this.copyStyleProperties(n.values, u.values) : a.styles.push(Pe(Ce({}, n), { values: Ce({}, n.values) }))
          }
        } else this.options.debug && console.warn(`Can't find base style ${a.basedOn}`)
      }
      for (let a of t) a.cssName = this.processStyleName(a.id)
      return e
    }
    prodessNumberings(t) {
      var e
      for (let r of t.filter((a) => a.pStyleName)) {
        const a = this.findStyle(r.pStyleName)
        ;(e = a == null ? void 0 : a.paragraphProps) != null && e.numbering && (a.paragraphProps.numbering.level = r.level)
      }
    }
    processElement(t) {
      if (t.children) for (var e of t.children) (e.parent = t), e.type == q.Table ? this.processTable(e) : this.processElement(e)
    }
    processTable(t) {
      for (var e of t.children)
        for (var r of e.children)
          (r.cssStyle = this.copyStyleProperties(t.cellStyle, r.cssStyle, [
            'border-left',
            'border-right',
            'border-top',
            'border-bottom',
            'padding-left',
            'padding-right',
            'padding-top',
            'padding-bottom'
          ])),
            this.processElement(r)
    }
    copyStyleProperties(t, e, r = null) {
      if (!t) return e
      e == null && (e = {}), r == null && (r = Object.getOwnPropertyNames(t))
      for (var a of r) t.hasOwnProperty(a) && !e.hasOwnProperty(a) && (e[a] = t[a])
      return e
    }
    createSection(t, e) {
      var r = this.createElement('div', { className: t })
      return r
    }
    renderSections(t) {
      const e = []
      this.processElement(t)
      const r = this.splitBySection(t.children)
      let a = null
      for (let u = 0, l = r.length; u < l; u++) {
        this.currentFootnoteIds = []
        const i = r[u],
          d = i.sectProps || t.props,
          p = this.createSection(this.className + '-centent-body', d)
        this.options.renderHeaders && this.renderHeaderFooter(d.headerRefs, d, e.length, a != d, p)
        var n = this.createElement('div')
        this.renderElements(i.elements, n),
          p.appendChild(n),
          this.options.renderFootnotes && this.renderNotes(this.currentFootnoteIds, this.footnoteMap, p),
          this.options.renderEndnotes && u == l - 1 && this.renderNotes(this.currentEndnoteIds, this.endnoteMap, p),
          this.options.renderFooters && this.renderHeaderFooter(d.footerRefs, d, e.length, a != d, p),
          e.push(p),
          (a = d)
      }
      return e
    }
    renderHeaderFooter(t, e, r, a, n) {
      var i, d
      if (!!t) {
        var u =
            (d = (i = e.titlePage && a ? t.find((p) => p.type == 'first') : null) != null ? i : r % 2 == 1 ? t.find((p) => p.type == 'even') : null) != null
              ? d
              : t.find((p) => p.type == 'default'),
          l = u && this.document.findPartByRelId(u.id, this.document.documentPart)
        l &&
          ((this.currentPart = l),
          this.usedHederFooterParts.includes(l.path) || (this.processElement(l.rootElement), this.usedHederFooterParts.push(l.path)),
          this.renderElements([l.rootElement], n),
          (this.currentPart = null))
      }
    }
    isPageBreakElement(t) {
      return t.type != q.Break ? !1 : t.break == 'lastRenderedPageBreak' ? !this.options.ignoreLastRenderedPageBreak : t.break == 'page'
    }
    splitBySection(t) {
      var p
      var e = { sectProps: null, elements: [] },
        r = [e]
      for (let m of t) {
        if (m.type == q.Paragraph) {
          const _ = this.findStyle(m.styleName)
          ;(p = _ == null ? void 0 : _.paragraphProps) != null && p.pageBreakBefore && ((e.sectProps = a), (e = { sectProps: null, elements: [] }), r.push(e))
        }
        if ((e.elements.push(m), m.type == q.Paragraph)) {
          const _ = m
          var a = _.sectionProps,
            n = -1,
            u = -1
          if (
            (this.options.breakPages &&
              _.children &&
              (n = _.children.findIndex((c) => {
                var y, w
                return (u = (w = (y = c.children) == null ? void 0 : y.findIndex(this.isPageBreakElement.bind(this))) != null ? w : -1), u != -1
              })),
            (a || n != -1) && ((e.sectProps = a), (e = { sectProps: null, elements: [] }), r.push(e)),
            n != -1)
          ) {
            let c = _.children[n],
              y = u < c.children.length - 1
            if (n < _.children.length - 1 || y) {
              var l = m.children,
                i = Pe(Ce({}, m), { children: l.slice(n) })
              if (((m.children = l.slice(0, n)), e.elements.push(i), y)) {
                let w = c.children,
                  h = Pe(Ce({}, c), { children: w.slice(0, u) })
                m.children.push(h), (c.children = w.slice(u))
              }
            }
          }
        }
      }
      let d = null
      for (let m = r.length - 1; m >= 0; m--) r[m].sectProps == null ? (r[m].sectProps = d) : (d = r[m].sectProps)
      return r
    }
    renderWrapper(t) {
      return this.createElement('div', { className: `${this.className}-wrapper` }, t)
    }
    renderDefaultStyle() {
      var t = this.className,
        e = `
.${t}-wrapper { background: gray; padding: 30px; padding-bottom: 0px; display: flex; flex-flow: column; align-items: center; } 
.${t}-wrapper>section.${t} { background: white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); margin-bottom: 30px; }
.${t} { color: black; }
section.${t} { box-sizing: border-box; display: flex; flex-flow: column nowrap; position: relative; overflow: hidden; }
section.${t}>article { margin-bottom: auto; }
.${t} table { border-collapse: collapse; }
.${t} table td, .${t} table th { vertical-align: top; }
.${t} p { margin: 0pt; min-height: 1em; }
.${t} span { white-space: pre-wrap; overflow-wrap: break-word; }
.${t} a { color: inherit; text-decoration: inherit; }
`
      return qe(e)
    }
    renderNotes(t, e, r) {
      var a = t.map((u) => e[u]).filter((u) => u)
      if (a.length > 0) {
        var n = this.createElement('ol', null, this.renderElements(a))
        r.appendChild(n)
      }
    }
    renderElement(t) {
      switch (t.type) {
        case q.Paragraph:
          return this.renderParagraph(t)
        case q.BookmarkStart:
          return this.renderBookmarkStart(t)
        case q.BookmarkEnd:
          return null
        case q.Run:
          return this.renderRun(t)
        case q.Table:
          return this.renderTable(t)
        case q.Row:
          return this.renderTableRow(t)
        case q.Cell:
          return this.renderTableCell(t)
        case q.Hyperlink:
          return this.renderHyperlink(t)
        case q.Drawing:
          return this.renderDrawing(t)
        case q.Image:
          return this.renderImage(t)
        case q.Text:
          return this.renderText(t)
        case q.Tab:
          return this.renderTab(t)
        case q.Symbol:
          return this.renderSymbol(t)
        case q.Break:
          return this.renderBreak(t)
        case q.Footer:
          return this.renderContainer(t, 'footer')
        case q.Header:
          return this.renderContainer(t, 'header')
        case q.Footnote:
        case q.Endnote:
          return this.renderContainer(t, 'li')
        case q.FootnoteReference:
          return this.renderFootnoteReference(t)
        case q.EndnoteReference:
          return this.renderEndnoteReference(t)
        case q.NoBreakHyphen:
          return this.createElement('wbr')
      }
      return null
    }
    renderChildren(t, e) {
      return this.renderElements(t.children, e)
    }
    renderElements(t, e) {
      if (t == null) return null
      var r = t.map((a) => this.renderElement(a)).filter((a) => a != null)
      return e && Ye(e, r), r
    }
    renderContainer(t, e) {
      return this.createElement(e, null, this.renderChildren(t))
    }
    renderParagraph(t) {
      var n, u, l, i
      var e = this.createElement('p')
      const r = this.findStyle(t.styleName)
      ;(u = t.tabs) != null || (t.tabs = (n = r == null ? void 0 : r.paragraphProps) == null ? void 0 : n.tabs),
        this.renderClass(t, e),
        this.renderChildren(t, e),
        this.renderStyleValues(t.cssStyle, e),
        this.renderCommonProperties(e.style, t)
      const a = (i = t.numbering) != null ? i : (l = r == null ? void 0 : r.paragraphProps) == null ? void 0 : l.numbering
      if (a) {
        if (this.domNumberings[a.id] && this.domNumberings[a.id][a.level]) {
          let d = this.domNumberings[a.id][a.level]
          if (e.firstChild && e.firstChild.innerHTML) e.firstChild.innerHTML = this.numLevelTextToContent(d) + e.firstChild.innerHTML
          else {
            let p = this.createElement('span')
            ;(p.innerHTML = this.numLevelTextToContent(d)), e.appendChild(p)
          }
        }
        e.classList.add(this.numberingClass(a.id, a.level))
      }
      return e
    }
    renderRunProperties(t, e) {
      this.renderCommonProperties(t, e)
    }
    renderCommonProperties(t, e) {
      e != null && (e.color && (t.color = e.color), e.fontSize && (t['font-size'] = e.fontSize))
    }
    renderHyperlink(t) {
      var e = this.createElement('a')
      return this.renderChildren(t, e), this.renderStyleValues(t.cssStyle, e), t.href && (e.href = t.href), e
    }
    renderDrawing(t) {
      var e = this.createElement('div')
      return (e.style.display = 'inline-block'), (e.style.position = 'relative'), (e.style.textIndent = '0px'), this.renderChildren(t, e), this.renderStyleValues(t.cssStyle, e), e
    }
    renderImage(t) {
      let e = this.createElement('img')
      !t.cssStyle['max-width'] && (t.cssStyle['max-width'] = '100%'), this.renderStyleValues(t.cssStyle, e)
      let r = this
      return (
        r.renderImageCount++,
        e.setAttribute('data-tp-src', t.src),
        this.document &&
          this.document.loadDocumentImage(t.src, this.currentPart).then((a) => {
            r.ep2.emit('renderImage', { status: 'ok', src: a, rId: t.src }),
              (e.parentNode.style.width = null),
              (e.parentNode.style.height = null),
              (e.parentNode.style.display = null),
              (e.src = a)
          }),
        e
      )
    }
    renderText(t) {
      return this.htmlDocument.createTextNode(t.text)
    }
    renderBreak(t) {
      return t.break == 'textWrapping' ? this.createElement('br') : null
    }
    renderSymbol(t) {
      var e = this.createElement('span')
      return (e.style.fontFamily = t.font), (e.innerHTML = `&#x${t.char};`), e
    }
    renderFootnoteReference(t) {
      var e = this.createElement('sup')
      return this.currentFootnoteIds.push(t.id), (e.textContent = `${this.currentFootnoteIds.length}`), e
    }
    renderEndnoteReference(t) {
      var e = this.createElement('sup')
      return this.currentEndnoteIds.push(t.id), (e.textContent = `${this.currentEndnoteIds.length}`), e
    }
    renderTab(t) {
      var a
      var e = this.createElement('span')
      if (((e.innerHTML = '&emsp;'), this.options.experimental)) {
        e.className = this.tabStopClass()
        var r = (a = Dr(t, q.Paragraph)) == null ? void 0 : a.tabs
        this.currentTabs.push({ stops: r, span: e })
      }
      return e
    }
    renderBookmarkStart(t) {
      var e = this.createElement('span')
      return (e.id = t.name), e
    }
    renderRun(t) {
      if (t.fieldRun) return null
      const e = this.createElement('span')
      if ((t.id && (e.id = t.id), this.renderClass(t, e), this.renderStyleValues(t.cssStyle, e), t.verticalAlign)) {
        const r = this.createElement(t.verticalAlign)
        this.renderChildren(t, r), e.appendChild(r)
      } else this.renderChildren(t, e)
      return e
    }
    renderTable(t) {
      let e = this.createElement('table')
      return (
        this.tableCellPositions.push(this.currentCellPosition),
        this.tableVerticalMerges.push(this.currentVerticalMerge),
        (this.currentVerticalMerge = {}),
        (this.currentCellPosition = { col: 0, row: 0 }),
        t.columns && e.appendChild(this.renderTableColumns(t.columns)),
        !t.cssStyle['border-collapse'] && (t.cssStyle['border-collapse'] = 'collapse'),
        this.renderClass(t, e),
        this.renderChildren(t, e),
        this.renderStyleValues(t.cssStyle, e),
        (this.currentVerticalMerge = this.tableVerticalMerges.pop()),
        (this.currentCellPosition = this.tableCellPositions.pop()),
        e
      )
    }
    renderTableColumns(t) {
      let e = this.createElement('colgroup')
      for (let r of t) {
        let a = this.createElement('col')
        r.width && (a.style.width = r.width), e.appendChild(a)
      }
      return e
    }
    renderTableRow(t) {
      let e = this.createElement('tr')
      return (this.currentCellPosition.col = 0), this.renderClass(t, e), this.renderChildren(t, e), this.renderStyleValues(t.cssStyle, e), this.currentCellPosition.row++, e
    }
    renderTableCell(t) {
      let e = this.createElement('td')
      if (t.verticalMerge) {
        const r = this.currentCellPosition.col
        t.verticalMerge == 'restart'
          ? ((this.currentVerticalMerge[r] = e), (e.rowSpan = 1))
          : this.currentVerticalMerge[r] && ((this.currentVerticalMerge[r].rowSpan += 1), (e.style.display = 'none'))
      }
      return this.renderClass(t, e), this.renderChildren(t, e), this.renderStyleValues(t.cssStyle, e), t.span && (e.colSpan = t.span), this.currentCellPosition.col++, e
    }
    renderStyleValues(t, e) {
      t &&
        Object.keys(t).forEach((r) => {
          e.style[r] = typeof t[r] == 'string' ? t[r].replace(/pt/g, 'px') : t[r]
        })
    }
    renderClass(t, e) {
      t.className && (e.className = t.className), t.styleName && e.classList.add(this.processStyleName(t.styleName))
    }
    findStyle(t) {
      var e
      return t && ((e = this.styleMap) == null ? void 0 : e[t])
    }
    numberingClass(t, e) {
      return `${this.className}-num-${t}-${e}`
    }
    tabStopClass() {
      return `${this.className}-tab-stop`
    }
    styleToString(t, e, r = null) {
      let a = `${t} {\r
`
      for (const n in e)
        a += `  ${n}: ${e[n]};\r
`
      return (
        r && (a += r),
        a +
          `}\r
`
      )
    }
    styleInlineToString(t, e = null) {
      let r = 'style="'
      !t['font-style'] && (t['font-style'] = 'normal')
      for (const a in t) r += `${a}: ${t[a]}; `
      return e && (r += e), r + '"'
    }
    numberingCounter(t, e) {
      return `${this.className}-num-${t}-${e}`
    }
    levelTextToContent(t, e, r, a) {
      var l
      const n = { tab: '\\9', space: '\\a0' }
      var u = t.replace(/%\d*/g, (i) => {
        let d = parseInt(i.substring(1), 10) - 1
        return `"counter(${this.numberingCounter(r, d)}, ${a})"`
      })
      return `"${u}${(l = n[numberingData.suff]) != null ? l : ''}"`
    }
    numLevelTextToContent(t) {
      var n
      const e = { tab: '&emsp;', space: '&nbsp;' },
        r = {
          chineseCounting: ['\u96F6', '\u4E00', '\u4E8C', '\u4E09', '\u56DB', '\u4E94', '\u516D', '\u4E03', '\u516B', '\u4E5D', '\u5341'],
          decimalEnclosedCircleChinese: [
            '\u24EA',
            '\u2460',
            '\u2461',
            '\u2462',
            '\u2463',
            '\u2464',
            '\u2465',
            '\u2466',
            '\u2467',
            '\u2468',
            '\u2469',
            '\u246A',
            '\u246B',
            '\u246C',
            '\u246D',
            '\u246E',
            '\u246F',
            '\u2470',
            '\u2471',
            '\u2472',
            '\u2473',
            '\u3251',
            '\u3252',
            '\u3253',
            '\u3254',
            '\u3255',
            '\u3256',
            '\u3257',
            '\u3258',
            '\u3259',
            '\u325A',
            '\u325B',
            '\u325C',
            '\u325D',
            '\u325E',
            '\u325F',
            '\u32B1',
            '\u32B2',
            '\u32B3',
            '\u32B4',
            '\u32B5',
            '\u32B6',
            '\u32B7',
            '\u32B8',
            '\u32B9',
            '\u32BA',
            '\u32BB',
            '\u32BC',
            '\u32BD',
            '\u32BE',
            '\u32BF'
          ],
          upperLetter: ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
          lowerLetter: ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
          test1: [
            ' ',
            '\u24B6',
            '\u24B7',
            '\u24B8',
            '\u24B9',
            '\u24BA',
            '\u24BB',
            '\u24BC',
            '\u24BD',
            '\u24BE',
            '\u24BF',
            '\u24C0',
            '\u24C1',
            '\u24C2',
            '\u24C3',
            '\u24C4',
            '\u24C5',
            '\u24C6',
            '\u24C7',
            '\u24C8',
            '\u24C9',
            '\u24CA',
            '\u24CB',
            '\u24CC',
            '\u24CD',
            '\u24CE',
            '\u24CF'
          ],
          test2: [
            ' ',
            '\u24D0',
            '\u24D1',
            '\u24D2',
            '\u24D3',
            '\u24D4',
            '\u24D5',
            '\u24D6',
            '\u24D7',
            '\u24D8',
            '\u24D9',
            '\u24DA',
            '\u24DB',
            '\u24DC',
            '\u24DD',
            '\u24DE',
            '\u24DF',
            '\u24E0',
            '\u24E1',
            '\u24E2',
            '\u24E3',
            '\u24E4',
            '\u24E5',
            '\u24E6',
            '\u24E7',
            '\u24E8',
            '\u24E9'
          ],
          test3: [
            ' ',
            '\u2776',
            '\u2777',
            '\u2778',
            '\u2779',
            '\u277A',
            '\u277B',
            '\u277C',
            '\u277D',
            '\u277E',
            '\u277F',
            '\u24EB',
            '\u24EC',
            '\u24ED',
            '\u24EE',
            '\u24EF',
            '\u24F0',
            '\u24F1',
            '\u24F2',
            '\u24F3',
            '\u24F4'
          ],
          test4: [' ', '\u24F5', '\u24F6', '\u24F7', '\u24F8', '\u24F9', '\u24FA', '\u24FB', '\u24FC', '\u24FD', '\u24FE'],
          test5: [' ', '\u3280', '\u3281', '\u3282', '\u3283', '\u3284', '\u3285', '\u3286', '\u3287', '\u3288', '\u3289'],
          upperRoman: [' ', '\u2160', '\u2161', '\u2162', '\u2163', '\u2164', '\u2165', '\u2166', '\u2167', '\u2168', '\u2169', '\u216A', '\u216B'],
          lowerRoman: ['', '\u2170', '\u2171', '\u2172', '\u2173', '\u2174', '\u2175', '\u2176', '\u2177', '\u2178', '\u2179', '\u217A', '\u217B']
        }
      var a = t.levelText.replace(/%\d*/g, (u) => {
        let l = parseInt(u.substring(1), 10) - 1,
          i = 1
        return (
          l == t.level
            ? ((i = t.count), (this.domNumberings[t.id][l].pCount = i), this.domNumberings[t.id][l + 1] && (this.domNumberings[t.id][l + 1].count = 1), t.count++)
            : this.domNumberings[t.id] && this.domNumberings[t.id][l] && ((i = this.domNumberings[t.id][l].count - 1), i == 0 && (i = 1)),
          r[t.format] && (i = r[t.format][i]),
          `${i}`
        )
      })
      return t.format == 'bullet' && (a = '<em ' + this.styleInlineToString(t.rStyle) + '">' + t.levelText + '</em>'), `${a}${(n = e[t.suff]) != null ? n : ''}`
    }
    numFormatToCssValue(t) {
      var e = { none: 'none', bullet: 'disc', decimal: 'decimal', lowerLetter: 'lower-alpha', upperLetter: 'upper-alpha', lowerRoman: 'lower-roman', upperRoman: 'upper-roman' }
      return e[t] || t
    }
    refreshTabStops() {
      !this.options.experimental ||
        (clearTimeout(this.tabsTimeout),
        (this.tabsTimeout = setTimeout(() => {
          const t = Pr()
          for (let e of this.currentTabs) Er(e.span, e.stops, this.defaultTabSize, t)
        }, 500)))
    }
  }
  function yt(f, t = void 0, e = void 0) {
    var r = Object.assign(document.createElement(f), t)
    return e && Ye(r, e), r
  }
  function Rr(f) {
    f.innerHTML = ''
  }
  function Ye(f, t) {
    t.forEach((e) => f.appendChild(e))
  }
  function qe(f) {
    return yt('style', { innerHTML: f })
  }
  function Or(f, t) {
    f.appendChild(document.createComment(t))
  }
  function Dr(f, t) {
    for (var e = f.parent; e != null && e.type != t; ) e = e.parent
    return e
  }
  const _t = {
    ignoreHeight: !1,
    ignoreWidth: !1,
    ignoreFonts: !1,
    breakPages: !0,
    debug: !1,
    experimental: !0,
    className: 'tp-importword',
    inWrapper: !1,
    trimXmlDeclaration: !0,
    ignoreLastRenderedPageBreak: !0,
    renderHeaders: !1,
    renderFooters: !1,
    renderFootnotes: !1,
    renderEndnotes: !1,
    useBase64URL: !1
  }
  function Lr(f, t = null) {
    const e = Ce(Ce({}, _t), t),
      r = window.document.createElement('div'),
      a = new Ir(window.document)
    return new Promise((n) => {
      Xe.load(f, new Sr(e), e).then((u) => {
        a.render(u, r, null, e).then(() => {
          n({ html: r.innerHTML })
        })
      })
    })
  }
  return (ge.defaultOptions = _t), (ge.renderAsync = Lr), Object.defineProperties(ge, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: 'Module' } }), ge
})({})

;(function () {
  'use strict'
  // var Promise = tinymce.util.Tools.resolve('tinymce.util.Promise')
  var global$2 = tinymce.util.Tools.resolve('tinymce.Env')
  var global$3 = tinymce.util.Tools.resolve('tinymce.util.Delay')
  var pickFile = function (a) {
    return new Promise(function (e) {
      var c = document.createElement('input')
      c.type = 'file'
      c.style.position = 'fixed'
      c.style.left = '0'
      c.style.top = '0'
      c.style.opacity = '0.001'
      document.body.appendChild(c)
      var b = function (f) {
        e(Array.prototype.slice.call(f.target.files))
      }
      c.addEventListener('change', b)
      var d = function (g) {
        var f = function (f_f) {
          try {
            e(Array.prototype.slice.call(f_f.target ? f_f.target.files : []))
          } catch (err) {}
          c.parentNode.removeChild(c)
        }
        if (global$2.os.isAndroid() && g.type !== 'remove') {
          global$3.setEditorTimeout(a, f, 0)
        } else {
          f()
        }
        a.off('focusin remove', d)
      }
      a.on('focusin remove', d)
      c.click()
    })
  }
  var importword_filter = null
  var importword_handler = null
  function importFile(editor, files) {
    readFileInputEventAsArrayBuffer(files, function (arrayBuffer) {
      tpDocsToHtml.renderAsync(arrayBuffer).then(function (res) {
        displayResult(editor, res)
      })
    })
  }
  function displayResult(editor, result) {
    var resVal = result.html
    if (typeof importword_filter == 'function');
    else {
      editor.insertContent(resVal.replace(/\s\s\s/gi, '&nbsp; '))
      try {
        top.tinymce.activeEditor.notificationManager.close()
      } catch (error) {
        try {
          editor.notificationManager.close()
        } catch (error2) {}
      }
      editor.notificationManager.open({
        text: ' \u5BFC\u5165 word \u6210\u529F ',
        type: 'success',
        timeout: 2e3
      })
    }
  }
  function readFileInputEventAsArrayBuffer(files, callback) {
    var file = files[0]
    var reader = new FileReader()
    reader.onload = function (loadEvent) {
      var arrayBuffer = loadEvent.target.result
      callback(arrayBuffer)
    }
    reader.readAsArrayBuffer(file)
  }
  var getParam = function (editor) {
    importword_filter = editor.getParam('importword_filter', void 0, 'function')
    importword_handler = editor.getParam('importword_handler', void 0, 'function')
  }
  var create = function (editor, data) {
    getParam(editor)
    pickFile(editor).then(function (files) {
      if (typeof importword_handler == 'function') {
        var importword_handler_callback = function (files2) {
          importFile(editor, files2)
        }
        importword_handler(editor, files, importword_handler_callback)
      } else {
        var file_name = files[0].name || 'defule.docx'
        if (file_name.substr(file_name.lastIndexOf('.') + 1) == 'docx') {
          editor.notificationManager.open({
            text: '\u6B63\u5728\u8F6C\u6362\u4E2D...',
            type: 'info',
            closeButton: false
          })
          importFile(editor, files)
        } else {
          editor.notificationManager.open({
            text: '\u76EE\u524D\u4EC5\u652F\u6301docx\u6587\u4EF6\u683C\u5F0F\uFF0C\u82E5\u4E3Adoc\u683C\u5F0F\uFF0C\u8BF7\u5C06\u8F6C\u6362\u4E3Adocx',
            type: 'warning'
          })
        }
      }
    })
  }
  var setup = function (editor, opt2) {
    if (!editor.ui.registry.getAll().icons[opt2.registryName]) {
      editor.ui.registry.addIcon(opt2.registryName, opt2.icon)
    }
    editor.ui.registry.addButton(opt2.registryName, {
      icon: opt2.registryName,
      tooltip: opt2.title,
      onAction: function () {
        return create(editor)
      }
    })
    editor.ui.registry.addMenuItem(opt2.registryName, {
      icon: opt2.registryName,
      text: opt2.title,
      onAction: function () {
        return create(editor)
      }
    })
  }
  var register = function (editor, opt2) {
    editor.addCommand('mce'.concat(opt2.registryName.substring(0, 1).toUpperCase() + opt2.registryName.substring(1)), function () {
      create(editor)
    })
  }
  var Plugin = function (opt2) {
    tinymce.PluginManager.add(opt2.registryName, function (editor, url) {
      setup(editor, opt2)
      register(editor, opt2)
      return {
        getMetadata: function () {
          return {
            name: opt2.name,
            url: opt2.repo
          }
        }
      }
    })
  }
  var opt = {
    name: 'Importword',
    registryName: 'tpImportword',
    title: '\u5BFC\u5165word',
    repo: 'https://github.com/Five-great/tinymce-plugins',
    icon: '<svg t="1604625110140" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14669" width="24" height="24"><path d="M546.21184 76.9024a30.72 30.72 0 0 1 21.70368 8.9856l248.22784 247.75168a30.72 30.72 0 0 1 9.0112 21.74464v163.3792a10.24 10.24 0 0 1-10.24 10.24h-51.712a10.24 10.24 0 0 1-10.24-10.24v-109.568h-232.448a30.72 30.72 0 0 1-30.72-30.72v-229.888h-330.752v726.016h438.272a10.24 10.24 0 0 1 10.24 10.24v51.2a10.24 10.24 0 0 1-10.24 10.24h-478.72a30.72 30.72 0 0 1-30.72-30.72V107.6224a30.72 30.72 0 0 1 30.72-30.72h427.61728z m197.84192 531.712l-171.40736 141.43488a30.72 30.72 0 0 0 0 47.39072l171.40736 141.43488a10.24 10.24 0 0 0 14.2848-1.2288l36.01408-41.95328a10.24 10.24 0 0 0-1.6128-14.848l-94.68416-71.26016h232.43264a10.24 10.24 0 0 0 10.24-10.24v-51.2a10.24 10.24 0 0 0-10.24-10.24h-232.448l94.69952-71.26016a10.24 10.24 0 0 0 1.6128-14.848l-36.01408-41.95328a10.24 10.24 0 0 0-14.2848-1.2288z m-323.8912-224.512a10.24 10.24 0 0 1 10.24 10.24v51.2a10.24 10.24 0 0 1-10.24 10.24h-190.464a10.24 10.24 0 0 1-10.24-10.24v-51.2a10.24 10.24 0 0 1 10.24-10.24h190.464z m141.312-207.36v155.648a5.12 5.12 0 0 0 5.12 5.12h155.648l-160.768-160.768zM276.48 542.72l37.888 171.008 45.056-171.008h59.904l43.52 173.568 38.4-173.568h50.688l-60.928 248.832H437.76l-49.664-185.856-49.664 185.856H284.16L225.28 542.72h51.2z m143.68768-292.2496a10.24 10.24 0 0 1 10.24 10.24v51.2a10.24 10.24 0 0 1-10.24 10.24h-190.464a10.24 10.24 0 0 1-10.24-10.24v-51.2a10.24 10.24 0 0 1 10.24-10.24h190.464z" fill="#333" ></path></svg>'
  }
  Plugin(opt)
  var main = {
    opt
  }
  return main
})()
