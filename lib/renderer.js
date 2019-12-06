const {
  escape,
  unescape,
  edit,
  cleanUrl,
  resolveUrl,
  noop,
  merge,
  splitCells,
  rtrim,
  findClosingBracket,
  checkSanitizeDeprecation
} = require('./helper')

module.exports  = class WxmlRender {
  constructor (options) {
    this.options = options
  };

  code(code, infostring, escaped) {
    const lang = (infostring || '').match(/\S*/)[0];
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    if (!lang) {
      return '<pre class="__wepy_md_pre"><code class="__wepy_md_code">'
        + (escaped ? code : escape(code, true))
        + '</code></pre>';
    }

    return '<pre class="__wepy_md_pre"><code class="__wepy_md_code'
      + this.options.langPrefix
      + escape(lang, true)
      + '">'
      + (escaped ? code : escape(code, true))
      + '</code></pre>\n';
  };

  blockquote(quote) {
    return '<blockquote class="__wepy_md_blockquote">\n' + quote + '</blockquote>\n';
  };

  html(html) {
    return html;
  };

  heading(text, level, raw, slugger) {
    if (this.options.headerIds) {
      return '<h'
        + level
        + ' class="__wepy_md_h'
        + level
        + '"'
        + ' id="'
        + this.options.headerPrefix
        + slugger.slug(raw)
        + '">'
        + text
        + '</h'
        + level
        + '>\n';
    }
    // ignore IDs
    return '<h class="__wepy_md_h"' + level + '>' + text + '</h' + level + '>\n';
  };

  hr() {
    return this.options.xhtml ? '<hr/>\n' : '<hr class="__wepy_md_hr">\n';
  };

  list(body, ordered, start) {
    const type = ordered ? 'ol' : 'ul',
      startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
    return '<' + type + startatt + ' class="__wepy_md_' + type + '"' + '>\n' + body + '</' + type + '>\n';
  };

  listitem(text) {
    return '<li class="__wepy_md_li">' + text + '</li>\n';
  };

  checkbox(checked) {
    return '<input class="__wepy_md_input"'
      + (checked ? 'checked="" ' : '')
      + 'disabled="" type="checkbox"'
      + (this.options.xhtml ? ' /' : '')
      + '> ';
  };

  paragraph(text) {
    return '<p class="__wepy_md_p">' + text + '</p>\n';
  };

  table(header, body) {
    if (body) body = '<tbody class="__wepy_md_tbody">' + body + '</tbody>';

    return '<table class="__wepy_md_table">\n'
      + '<thead>\n'
      + header
      + '</thead>\n'
      + body
      + '</table>\n';
  };

  tablerow(content) {
    return '<tr class="__wepy_md_tr">\n' + content + '</tr>\n';
  };

  tablecell(content, flags) {
    const type = flags.header ? 'th' : 'td';
    const tag = flags.align
      ? '<' + type + ' align="' + flags.align + ' class="__wepy_md_"' + type + '">'
      : '<' + type + ' class="__wepy_md_"' + type +  '>';
    return tag + content + '</' + type + '>\n';
  };

  // span level renderer
  strong(text) {
    return '<strong class="__wepy_md_strong">' + text + '</strong>';
  };

  em(text) {
    return '<em  class="__wepy_md_em">' + text + '</em>';
  };

  codespan(text) {
    return '<code  class="__wepy_md_code">' + text + '</code>';
  };

  br() {
    return this.options.xhtml ? '<br  class="__wepy_md_br" />' : '<br  class="__wepy_md_br">';
  };

  del(text) {
    return '<del class="__wepy_md_">' + text + '</del>';
  };

  link(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    let out = '<a class="__wepy_md_a" href="' + escape(href) + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
  };

  image(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }

    let out = '<img  class="__wepy_md_img" src="' + href + '" alt="' + text + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? '/>' : '>';
    return out;
  };

  text(text) {
    return text;
  };
}