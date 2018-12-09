'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/*eslint-disable no-unused-vars*/
var Woditor = function () {
    function Woditor(id, opts) {
        _classCallCheck(this, Woditor);

        this.tabsToggle = this.tabsToggle.bind(this);
        this.render = this.render.bind(this);
        // Default Options
        this.options = {
            html: opts.html,
            css: opts.css,
            js: opts.js,
            template: opts.template,
            file: opts.file,
            htmlStr: opts.htmlStr || false,
            cssStr: opts.cssStr || false,
            jsStr: opts.jsStr || false,
            templateStr: opts.templateStr || false,
            htmlShow: opts.htmlShow !== false,
            cssShow: opts.cssShow !== false,
            jsShow: opts.jsShow !== false,
            stylesShow: opts.stylesShow !== false,
            dataShow: opts.dataShow !== false,
            layout: opts.layout || 'half', // whether editor/output takes up full width or half
            initialFull: opts.initialFull || 'output',
            style: opts.style || 'tabs', // Tabs show editors full side, row shows each editor on top of each other
            initialTab: opts.initialTab || 'css',
            fullscreen: opts.fullscreen || false,
            topbar: opts.style === 'tabs' ? true : opts.topbar !== false, // Must show if tabs are selected
            title: opts.title || 'Woditor'
        };
        if (id) {
            this.woditor = document.getElementById(id);
        } else {
            this.woditor = document.getElementById('woditor');
        }
        this.initWoditor();
    }

    _createClass(Woditor, [{
        key: 'initWoditor',
        value: function initWoditor() {
            this.woditor.className = 'woditor';

            if (this.options.topbar) {
                this.createTopBar(this.options.title);
            }

            // Initialize editors
            this.editorsDiv = document.createElement('div');
            this.editorsDiv.className += 'editors half';
            this.woditor.appendChild(this.editorsDiv);

            // Initialize output
            this.outputDiv = document.createElement('div');
            this.outputDiv.className += 'output half';
            this.woditor.appendChild(this.outputDiv);

            // Layouts: half(split 50%) or full
            if (this.options.layout === 'half') {
                this.halfWidth();
            } else if (this.options.layout === 'full') {
                this.fullWidth(this.options.initialFull);
            }

            // Create all three Editors
            this.createEditor('html', this.editorsDiv, 'textarea');
            this.htmlEditor = document.querySelector('#html');
            this.htmlEditorCode = document.querySelector('#html textarea');

            this.createEditor('css', this.editorsDiv, 'textarea');
            this.cssEditor = document.querySelector('#css');
            this.cssEditorCode = document.querySelector('#css textarea');

            this.createEditor('js', this.editorsDiv, 'textarea');
            this.jsEditor = document.querySelector('#js');
            this.jsEditorCode = document.querySelector('#js textarea');

            this.createEditor('styles', this.editorsDiv, 'textarea');
            this.stylesEditor = document.querySelector('#styles');
            this.stylesEditorCode = document.querySelector('#styles textarea');

            this.createEditor('data', this.editorsDiv, 'div');
            this.dataEditor = document.querySelector('#data');
            //this.dataEditorCode = document.querySelector('#data textarea');
            this.dataEditorCode = document.querySelector('#data div');
            this.jsonEditor = new JSONEditor(this.dataEditorCode, {});

            this.keyupRender(this.htmlEditorCode);
            this.keyupRender(this.cssEditorCode);
            this.keyupRender(this.jsEditorCode);
            this.keyupRender(this.stylesEditorCode);
            this.keyupRender(this.dataEditorCode);

            // Create and add the iframe to the document
            var iframe = document.createElement('iframe');
            this.outputDiv.appendChild(iframe);


            if (!this.options.htmlShow) {
                document.querySelector('#html').style.display = 'none';
            }
            if (!this.options.cssShow) {
                document.querySelector('#css').style.display = 'none';
            }
            if (!this.options.jsShow) {
                document.querySelector('#js').style.display = 'none';
            }
            if (!this.options.stylesShow) {
                document.querySelector('#styles').style.display = 'none';
            }
            if (!this.options.dataShow) {
                document.querySelector('#data').style.display = 'none';
            }

            // File
            if (this.options.file) {
                this.loadFile(this.options.file);
            }

            // Layout
            if (this.options.style === 'tabs') {
                this.tabs();
            } else {
                this.rows();
            }
            // Fullscreen or not
            if (this.options.fullscreen) {
                this.fullScreen();
            }

            if (this.options.templateStr) {
                /* eslint-disable no-console */
                console.log('templateStr');
                //this.presetString(this.options.template, this.htmlEditorCode);
            } else if (this.options.template) {
                //this.presetSnippet(this.options.html, this.htmlEditorCode, '');
                console.log('template');
            }
            if (this.options.htmlStr) {
                /* eslint-disable no-console */
                console.log('htmlStr');
                this.presetString(this.options.htmlStr, this.htmlEditorCode);
            } else if (this.options.html) {
                this.preset(this.options.html, this.htmlEditorCode);
            }
            if (this.options.cssStr) {
                this.presetString(this.options.cssStr, this.cssEditorCode);
            } else if (this.options.css) {
                this.preset(this.options.css, this.cssEditorCode);
            }
            if (this.options.jsStr) {
                this.presetString(this.options.jsStr, this.jsEditorCode);
            } else if (this.options.js) {
                this.preset(this.options.js, this.jsEditorCode);
            }
        }

        // Functions

    }, {
        key: 'createEditor',
        value: function createEditor(name, parent, child) {
            var div = document.createElement('div');
            div.id = name;
            div.className += 'editor';
            this.editorsDiv.appendChild(div);

            var header = document.createElement('h3');
            header.textContent = name.toUpperCase();
            div.appendChild(header);

            var childElement = document.createElement(child);
            div.appendChild(childElement);
        }
    }, {
        key: 'createTopBar',
        value: function createTopBar(barTitle) {
            this.topBar = document.createElement('div');
            this.topBar.id = 'topBar';
            this.topBar.className = 'topbar';

            this.woditor.appendChild(this.topBar);

            var title = document.createElement('h2');
            title.textContent = barTitle;
            this.topBar.appendChild(title);
        }
    }, {
        key: 'createTabBtn',
        value: function createTabBtn(name) {
            var btn = document.createElement('button');
            btn.id = name.toLowerCase() + 'Btn';
            btn.className = 'btn';
            btn.textContent = name;

            var topBar = document.getElementById('topBar');
            topBar.appendChild(btn);
        }
    }, {
        key: 'tabs',
        value: function tabs() {
            var _this = this;

            if (this.options.htmlShow) {
                this.createTabBtn('HTML');
                var htmlBtn = document.getElementById('htmlBtn');
                htmlBtn.addEventListener('click', function () {
                    return _this.tabsToggle('html');
                });
            }
            if (this.options.cssShow) {
                this.createTabBtn('CSS');
                var cssBtn = document.getElementById('cssBtn');
                cssBtn.addEventListener('click', function () {
                    return _this.tabsToggle('css');
                });
            }
            if (this.options.jsShow) {
                this.createTabBtn('JS');
                var jsBtn = document.getElementById('jsBtn');
                jsBtn.addEventListener('click', function () {
                    return _this.tabsToggle('js');
                });
            }
            if (this.options.stylesShow) {
                this.createTabBtn('Styles');
                var stylesBtn = document.getElementById('stylesBtn');
                stylesBtn.addEventListener('click', function () {
                    return _this.tabsToggle('styles');
                });
            }
            if (this.options.dataShow) {
                this.createTabBtn('Data');
                var stylesBtn = document.getElementById('dataBtn');
                stylesBtn.addEventListener('click', function () {
                    return _this.tabsToggle('data');
                });
            }
            this.createTabBtn('Result');
            var resultBtn = document.getElementById('resultBtn');
            resultBtn.addEventListener('click', function () {
                return _this.tabsToggle('result');
            });

            this.tabsToggle(this.options.initialTab);
        }
    }, {
        key: 'tabsToggle',
        value: function tabsToggle(initial) {
            if (initial === 'html') {
                if (this.htmlEditor.style.display == 'block') {
                    this.htmlEditor.style.display = 'none';
                    this.fullWidth('output');
                } else if (this.editorsDiv.style.display == 'none') {
                    this.htmlEditor.style.display = 'block';
                    this.editorsDiv.style.display = 'block';
                    this.halfWidth();
                } else {
                    this.htmlEditor.style.display = 'block';
                    this.htmlEditor.style.height = '100%';
                    this.cssEditor.style.display = 'none';
                    this.jsEditor.style.display = 'none';
                    this.stylesEditor.style.display = 'none';
                    this.dataEditor.style.display = 'none';
                }
            } else if (initial === 'css') {
                if (this.cssEditor.style.display == 'block') {
                    this.cssEditor.style.display = 'none';
                    this.fullWidth('output');
                } else if (this.editorsDiv.style.display == 'none') {
                    this.cssEditor.style.display = 'block';
                    this.editorsDiv.style.display = 'block';
                    this.halfWidth();
                } else {
                    this.htmlEditor.style.display = 'none';
                    this.cssEditor.style.display = 'block';
                    this.cssEditor.style.height = '100%';
                    this.jsEditor.style.display = 'none';
                    this.stylesEditor.style.display = 'none';
                    this.dataEditor.style.display = 'none';
                }
            } else if (initial === 'js') {
                if (this.jsEditor.style.display == 'block') {
                    this.jsEditor.style.display = 'none';
                    this.fullWidth('output');
                } else if (this.editorsDiv.style.display == 'none') {
                    this.jsEditor.style.display = 'block';
                    this.editorsDiv.style.display = 'block';
                    this.halfWidth();
                } else {
                    this.htmlEditor.style.display = 'none';
                    this.cssEditor.style.display = 'none';
                    this.jsEditor.style.display = 'block';
                    this.jsEditor.style.height = '100%';
                    this.stylesEditor.style.display = 'none';
                    this.dataEditor.style.display = 'none';
                }
            } else if (initial === 'styles') {
                if (this.stylesEditor.style.display == 'block') {
                    this.stylesEditor.style.display = 'none';
                    this.fullWidth('output');
                } else if (this.editorsDiv.style.display == 'none') {
                    this.stylesEditor.style.display = 'block';
                    this.editorsDiv.style.display = 'block';
                    this.halfWidth();
                } else {
                    this.htmlEditor.style.display = 'none';
                    this.cssEditor.style.display = 'none';
                    this.jsEditor.style.display = 'none';
                    this.stylesEditor.style.display = 'block';
                    this.stylesEditor.style.height = '100%';
                    this.dataEditor.style.display = 'none';
                }
            } else if (initial === 'data') {
                if (this.dataEditor.style.display == 'block') {
                    this.dataEditor.style.display = 'none';
                    this.fullWidth('output');
                } else if (this.editorsDiv.style.display == 'none') {
                    this.dataEditor.style.display = 'block';
                    this.editorsDiv.style.display = 'block';
                    this.halfWidth();
                } else {
                    this.htmlEditor.style.display = 'none';
                    this.cssEditor.style.display = 'none';
                    this.jsEditor.style.display = 'none';
                    this.stylesEditor.style.display = 'none';
                    this.dataEditor.style.display = 'block';
                    this.dataEditor.style.height = '100%';
                }
            } else if (initial === 'result') {
                if (this.outputDiv.style.display == 'block' && this.editorsDiv.style.display == 'none') {
                    this.fullWidth();
                    if (this.options.html) {
                        this.tabsToggle('html');
                    } else if (this.options.css) {
                        this.tabsToggle('css');
                    } else if (this.options.js) {
                        this.tabsToggle('js');
                    } else {
                        this.tabsToggle('styles');
                    }
                } else if (this.outputDiv.style.display == 'block') {
                    this.fullWidth();
                } else {
                    this.outputDiv.style.display = 'block';
                    this.halfWidth();
                }
            }
        }
    }, {
        key: 'rows',
        value: function rows() {
            this.editorsDiv.className += ' rows';
        }
    }, {
        key: 'fullScreen',
        value: function fullScreen() {
            this.woditor.className += ' fullscreen';
        }
    }, {
        key: 'fullWidth',
        value: function fullWidth(display) {
            this.woditor.className += ' fullwidth';
            this.woditor.classList.remove('halfwidth');
            if (display === 'output') {
                this.editorsDiv.style.display = 'none';
            } else {
                this.outputDiv.style.display = 'none';
            }
        }
    }, {
        key: 'halfWidth',
        value: function halfWidth() {
            this.woditor.className += ' halfwidth';
            this.woditor.classList.remove('fullwidth');
        }
    }, {
        key: 'keyupRender',
        value: function keyupRender(editor) {
            var _this2 = this;

            editor.addEventListener('keyup', function () {
                return _this2.render();
            });
        }
    }, {
        key: 'presetString',
        value: function presetString(str, editor) {
            editor.value += str;
            this.render();
        }
    }, {
        key: 'preset',
        value: function preset(file, editor) {
            var _this3 = this;

            var xhr = new window.XMLHttpRequest();
            xhr.open('GET', file, true);
            xhr.responseType = 'text';

            xhr.onload = function () {
                if (xhr.status === 200 || xhr.status == 0) {
                    editor.value += xhr.responseText;
                    _this3.render();
                } else {
                    /*eslint-disable no-console*/
                    console.log(file, xhr);
                }
            };

            xhr.onerror = function (err) {
                /*eslint-disable no-console*/
                console.log(err);
            };
            xhr.send();
        }
    }, {
        key: 'presetSnippet',
        value: function presetSnippet(file, editor, id) {
            var _this4 = this;

            var xhr = new window.XMLHttpRequest();
            xhr.open('GET', file, true);
            xhr.responseType = 'document';

            xhr.onload = function () {
                if (xhr.status === 200 || xhr.status == 0) {
                    let response = xhr.responseXML;
                    let responseSnippet = response.querySelector(id).innerHTML;
                    console.log(responseSnippet);
                    editor.value += responseSnippet;
                } else {
                    /*eslint-disable no-console*/
                    console.log(file, xhr);
                }
            };
            xhr.onerror = function (err) {
                /*eslint-disable no-console*/
                console.log(err);
            };
            xhr.send();
        }
    }, {
        key: 'loadFile',
        value: function loadFile(file) {
            var _this5 = this;

            var xhr = new window.XMLHttpRequest();
            xhr.open('GET', file, true);
            xhr.responseType = 'document';

            xhr.onload = function () {
                if (xhr.status === 200 || xhr.status == 0) {
                    let response = xhr.responseXML;
                    let responseHtml = response.querySelector('body');
                    if (responseHtml) {
                        _this5.htmlEditorCode.value += responseHtml.innerHTML;
                    }
                    let responseCss = response.querySelector('#wod-styles');
                    if (responseCss) {
                        _this5.cssEditorCode.value += responseCss.innerHTML;
                    }
                    let responseJs = response.querySelector('#wod-js');
                    if (responseJs) {
                        _this5.jsEditorCode.value += responseJs.innerHTML;
                    }
                    let responseStyles = response.querySelector('#wod-styles-print');
                    if (responseStyles) {
                        _this5.stylesEditorCode.value += responseStyles.innerHTML;
                    }
                    let responseData = response.querySelector('#wod-data');
                    if (responseData) {
                        //_this5.dataEditorCode.value += responseData.innerHTML;
                        _this5.jsonEditor.set(JSON.parse(responseData.innerHTML));
                    }

                    /*_this5.render(); sinon document à double dans l'output */
                } else {
                    /*eslint-disable no-console*/
                    console.log(file, xhr);
                }
            };
            xhr.onerror = function (err) {
                /*eslint-disable no-console*/
                console.log(err);
            };
            xhr.send();
        }
    }, {
        key: 'render',
        value: function render() {
            var source = this.prepareSource();

            var iframe = document.querySelector('.output iframe'),
                iframe_doc = iframe.contentDocument;

            iframe_doc.open();
            iframe_doc.write(source);
            iframe_doc.close();
        }
    }, {
        key: 'prepareSource',
        value: function prepareSource() {
            var html = this.htmlEditorCode.value,
                css = this.cssEditorCode.value,
                js = this.jsEditorCode.value,
                styles = this.stylesEditorCode.value,
                data = JSON.stringify(this.jsonEditor.get()),
                src = '';

            var baseTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <title>${this.options.title}</title>
                <meta name="description" content="description here">
                <meta charset="utf-8">

                <!-- WOD -->
                <style type="text/css" id="wod-styles-print">
                ${styles}
                </style>

                <style type="text/css" id="wod-styles">
                ${css}
                </style>

                <script type="application/ld+json" id="wod-data">
                ${data}
                </script>

                <!-- WODitor -->
                <script src="template/wod-pagedjs.js" type="text/javascript" id="wod-pagedjs"></script>
                <script src="template/transparency.min.js"></script>
                <script src="template/wod-template.js" type="text/javascript" id="wod-template" defer></script>

                <style type="text/css" id="wods-pagedjs-styles">
                /* Variables for the interface */
                :root {
                    --wod-pjs-color-background: rgba(0, 0, 0, 0.2);
                    --wod-pjs-color-marginBox: transparent;
                    --wod-pjs-color-pageBox: transparent;
                    --wod-pjs-color-paper: white;
                }
                /* To define how the book look on the screen: */
                @media screen {
                    body {
                        background-color: var(--wod-pjs-color-background);
                    }
                    .pagedjs_pages {
                        display: flex;
                        width: calc(var(--wod-pjs-width) * 2);
                        flex: 0;
                        flex-wrap: wrap;
                        margin: 0 auto;
                    }
                    .pagedjs_page {
                        background-color: var(--wod-pjs-color-paper);
                        box-shadow: 0 0 0 2px var(--wod-pjs-color-pageBox);
                        margin: 0;
                        flex-shrink: 0;
                        flex-grow: 0;
                        margin-top: 10mm;
                    }
                    .pagedjs_first_page {
                        margin-left: var(--wod-pjs-width);
                    }
                    /* show the margin-box */
                    .pagedjs_margin-content
                    {
                        box-shadow: 0 0 0 1px inset var(--wod-pjs-color-marginBox);
                    }
                    /* uncomment for recto/verso book.
                    --------------------------------------------------- */
                    .pagedjs_pages {
                        flex-direction: column;
                        width: 100%;
                    }
                    .pagedjs_first_page {
                        margin-left: 0;
                    }
                    .pagedjs_page {
                        margin: 0 auto;
                        margin-top: 10mm;
                    }
                }
                </style>
            </head>
            <body id="wod-template-container">
                ${html}
            </body>
            <script id="wod-js">${js}</script>
            </html>`;

            //src = baseTemplate.replace('</body>', html + '</body>');

            //css = '<style>' + css + '</style>';
            //src = src.replace('</head>', css + '</head>');

            //js = '<script>' + js + '</script>';
            //src = src.replace('</body>', js + '</body>');

            src = baseTemplate

            return src;
        }
    }]);

    return Woditor;
}();
