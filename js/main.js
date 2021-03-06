/*!
███████ ██████  ██ ████████  ██████  ██████
██      ██   ██ ██    ██    ██    ██ ██   ██
█████   ██   ██ ██    ██    ██    ██ ██████
██      ██   ██ ██    ██    ██    ██ ██   ██
███████ ██████  ██    ██     ██████  ██   ██
2018 ~ Mark Hillard | (mark@)markhillard.com
*/


/*! Table Of Contents:
// ------------------------------
// INITIALIZE CODEMIRROR
// CODE LOADING
// DEFAULTS
// LOCAL STORAGE
// EDITOR UPDATES
// DEPENDENCY INJECTION
// RESIZE FUNCTIONS
// GENERAL FUNCTIONS
// UTILITY FUNCTIONS
// REFRESH EDITOR
// ------------------------------
*/

// make jQuery play nice
var E = $.noConflict(true);

E(document).ready(function () {

    // INITIALIZE CODEMIRROR
    // ------------------------------
    // content code
    var editorContent = new JSONEditor(document.getElementById("contentcode"),
    {
        modes: ['tree', 'view', 'form', 'code'],
        onChange: function () {
            console.log('change');
            editorContentUpdate();
        },
    });

    // html code
    var editorHTML = document.editor = CodeMirror.fromTextArea(htmlcode, {
        mode: 'text/html',
        profile: 'html',
        beautify: true,
        keyMap: 'sublime',
        lineNumbers: true,
        lineWrapping: true,
        theme: 'dracula',
        tabSize: 4,
        indentUnit: 4,
        foldGutter: true,
        gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        matchTags: {
            bothTags: true
        },
        matchBrackets: false,
        autoCloseTags: true,
        autoCloseBrackets: true,
        scrollbarStyle: 'overlay',
        styleActiveLine: true,
        lint: true
    });

    // styles code
    var editorStyles = document.editor = CodeMirror.fromTextArea(stylescode, {
        mode: 'css',
        profile: 'css',
        beautify: true,
        keyMap: 'sublime',
        lineNumbers: true,
        lineWrapping: true,
        theme: 'dracula',
        tabSize: 4,
        indentUnit: 4,
        foldGutter: true,
        gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        matchBrackets: true,
        autoCloseBrackets: true,
        scrollbarStyle: 'overlay',
        styleActiveLine: true,
        lint: true
    });

    // paged code
    var editorPaged = document.editor = CodeMirror.fromTextArea(pagedcode, {
        mode: 'css',
        profile: 'css',
        beautify: true,
        keyMap: 'sublime',
        lineNumbers: true,
        lineWrapping: true,
        theme: 'dracula',
        tabSize: 4,
        indentUnit: 4,
        foldGutter: true,
        gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        matchBrackets: true,
        autoCloseBrackets: true,
        scrollbarStyle: 'overlay',
        styleActiveLine: true,
        lint: false
    });

    // js code
    var editorJS = document.editor = CodeMirror.fromTextArea(jscode, {
        mode: 'javascript',
        keyMap: 'sublime',
        lineNumbers: true,
        lineWrapping: true,
        theme: 'dracula',
        indentWithTabs: true,
        tabSize: 4,
        indentUnit: 4,
        foldGutter: true,
        gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        matchBrackets: true,
        autoCloseBrackets: true,
        scrollbarStyle: 'overlay',
        styleActiveLine: true,
        lint: true
    });

    // data code
    var editorData = new JSONEditor(document.getElementById("datacode"),
    {
        modes: ['tree', 'view', 'form', 'code'],
        onChange: function () {
            console.log('change');
            editorDataUpdate();
        },
    });

    // config code
    var editorConfig = new JSONEditor(document.getElementById("configcode"),
    {
        modes: ['tree', 'view', 'form', 'code'],
        onChange: function () {
            console.log('change');
            editorConfigUpdate();
        },
    });

    // font size
    var fontSize = E('.font-size input');
    function updateFontSize(editor, size) {
        editor.getWrapperElement().style['font-size'] = size + '%';
        editor.refresh();
    }

    // DEFAULTS
    // ------------------------------
    var defaultContent = ``;
    var defaultHTML =
    `<h1>Woditor</h1>\n<p>Real-time, responsive paged web document editor. Fork me on <a href="https://github.com/michaelravedoni/woditor">GitHub</a></p>`;
    var defaultStyles = ``;
    var defaultPaged = ``;
    var defaultJS = `console.log('Hello Woditor');`;
    var defaultData = `{}`;
    var defaultConfig = `{}`;
    var defaultFontSize = '100';
    var defaultPreview = '';
    var defaultFile = './template/default.html';
    var defaultTemplate = './template/default.json';

    // LOAD TEMPLATE
    // ------------------------------
    // get template
    var templateInput = document.querySelector('#template-input');
    if (templateInput.value) {
        var template = templateInput.value;
    } else {
        var template = defaultTemplate;
    }
    console.log(template);

    // load template
    function loadTemplate(f) {
        const req = new XMLHttpRequest();
        req.onload = function () {
            if (req.status === 200 || req.status == 0) {
                let response = req.responseText;
                let responseJSON = JSON.parse(req.responseText);
                localStorage.setItem('template', response);
            } else {
                console.log(f, req);
            }
        }
        req.open('GET', f, true);
        req.responseType = 'text';
        req.send();
    }
    loadTemplate(template);

    // LOAD File
    // ------------------------------

    // get file
    var fileInput = document.querySelector('#file-input');
    fileInput.addEventListener('change', getFile());
    function getFile() {
        if (fileInput.value) {
            var file = fileInput.value;
        } else {
            var file = defaultFile;
        }
        console.log(file);
        loadFile(file);
    }

    // load file
    function loadFile(file) {
        const req = new XMLHttpRequest();
        let f = file;
        req.onload = function () {
            if (this.status === 200 || this.status == 0) {
                let response = this.responseXML.documentElement.outerHTML;

                localStorage.setItem('file', response);
                loadCode(localStorage.getItem('file'), editorContent, '#wpd-data');
                loadCode(localStorage.getItem('file'), editorHTML, 'body');
                loadCode(localStorage.getItem('file'), editorStyles, '#wpd-styles');
                loadCode(localStorage.getItem('file'), editorPaged, '#wpd-styles-paged');
                loadCode(localStorage.getItem('file'), editorJS, '#wpd-js');
                loadCode(localStorage.getItem('file'), editorData, '#wpd-data');
                loadCode(localStorage.getItem('file'), editorConfig, '#wpd-data');
            } else {
                console.log(f, req);
            }
        }
        req.open('GET', file, true);
        req.responseType = 'document';
        req.send();
    }

    // CODE LOADING
    // ------------------------------
    // load code
    function loadCode(file, ed, selector) {
        let _this = this;
        var parser = new DOMParser();
        var html = parser.parseFromString(file, 'text/html');
        if (html.querySelector(selector).innerHTML) {
            let code = html.querySelector(selector).innerHTML;
            if (ed == editorContent || ed == editorData || ed == editorConfig) {
                ed.set(JSON.parse(code));
            } else {
                ed.setValue(code);
            }
        }
        else {
            console.log('Error: loadCode fail');
        }
    }

    // set content
    function setContent() {
        console.log('setContent');
    }

    // set html
    function setHTML() {
        console.log('setHTML');
    }

    // set styles
    function setStyles() {
        console.log('setStyles');
    }

    // set paged
    function setPaged() {
        console.log('setPaged');
    }

    // set js
    function setJS() {
        console.log('setJS');
    }

    // set data
    function setData() {
        console.log('setData');
    }

    // set config
    function setConfig() {
        console.log('setConfig');
    }


    // LOCAL STORAGE
    // ------------------------------
    // set default content value
    if (localStorage.getItem('contentcode') === null) {
        localStorage.setItem('contentcode', defaultContent);
    }
    // set default html value
    if (localStorage.getItem('htmlcode') === null) {
        localStorage.setItem('htmlcode', defaultHTML);
    }

    // set default styles value
    if (localStorage.getItem('stylescode') === null) {
        localStorage.setItem('stylescode', defaultStyles);
    }

    // set default paged value
    if (localStorage.getItem('pagedcode') === null) {
        localStorage.setItem('pagedcode', defaultPaged);
    }

    // set default js value
    if (localStorage.getItem('jscode') === null) {
        localStorage.setItem('jscode', defaultJS);
    }

    // set default data value
    if (localStorage.getItem('datacode') === null) {
        localStorage.setItem('datacode', defaultData);
    }

    // set default config value
    if (localStorage.getItem('configcode') === null) {
        localStorage.setItem('configcode', defaultConfig);
    }

    // set default font size
    if (localStorage.getItem('fontsize') === null) {
        localStorage.setItem('fontsize', defaultFontSize);
    }

    // set default preview value
    if (localStorage.getItem('preview') === null) {
        localStorage.setItem('preview', defaultPreview);
    }

    // load code values
    editorContent.set(localStorage.getItem('contentcode'));
    editorHTML.setValue(localStorage.getItem('htmlcode'));
    editorStyles.setValue(localStorage.getItem('stylescode'));
    editorPaged.setValue(localStorage.getItem('pagedcode'));
    editorJS.setValue(localStorage.getItem('jscode'));
    editorData.set(localStorage.getItem('datacode'));
    editorConfig.set(localStorage.getItem('configcode'));

    // load font size
    fontSize.val(localStorage.getItem('fontsize'));


    // EDITOR UPDATES
    // ------------------------------
    // editor update (content)
    var delayContent;
    function editorContentUpdate() {
        setContent();
        clearTimeout(delayContent);
        delayContent = window.setTimeout(render, 1000);
        localStorage.setItem('contentcode', editorContent.get());
    }
    // editor update (html)
    var delayHTML;
    editorHTML.on('change', function () {
        setHTML();
        let htmlCode = editorHTML.getValue();
        clearTimeout(delayHTML);
        delayHTML = window.setTimeout(render, 1000);
        localStorage.setItem('htmlcode', htmlCode);
    });

    // editor update (styles)
    editorStyles.on('change', function () {
        setStyles();
        localStorage.setItem('stylescode', editorStyles.getValue());
        render();
    });

    // editor update (paged)
    editorPaged.on('change', function () {
        setPaged();
        localStorage.setItem('pagedcode', editorPaged.getValue());
        render();
    });

    // editor update (js)
    var delayJS;
    editorJS.on('change', function () {
        setJS();
        clearTimeout(delayJS);
        delayJS = window.setTimeout(render, 1000);
        localStorage.setItem('jscode', editorJS.getValue());
    });

    // editor update (data)
    var delayData;
    function editorDataUpdate() {
        setData();
        clearTimeout(delayData);
        delayData = window.setTimeout(render, 1000);
        localStorage.setItem('datacode', editorData.get());
    }

    // editor update (config)
    var delayConfig;
    function editorConfigUpdate() {
        setConfig();
        clearTimeout(delayConfig);
        delayConfig = window.setTimeout(render, 1000);
        localStorage.setItem('condigcode', editorConfig.get());
    }

    // run font size update
    updateFontSize(editorHTML, fontSize.val());
    updateFontSize(editorStyles, fontSize.val());
    updateFontSize(editorJS, fontSize.val());

    // RENDER
    // ------------------------------

    function render() {
        console.log('render');
        var source = `
        <!DOCTYPE html>
        <html>
        <head>
        <!-- Template -->
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Web paged document (WPD)</title>
        <meta name="description" content="description here">
        <!-- <link rel="shortcut icon" href="favicon.png" type="image/png"> -->
        <!-- <link rel="stylesheet" href="//fonts.googleapis.com/styles?family=font1|font2|etc" type="text/styles"> -->

        <!-- WOD -->
        <style type="text/styles" id="wpd-styles-paged">
        ${localStorage.getItem('pagedcode')}
        </style>

        <style type="text/styles" id="wpd-styles">
        ${localStorage.getItem('stylescode')}
        </style>

        <script type="application/ld+json" id="wpd-data">
        ${JSON.stringify(editorData.get())}
        </script>

        <script defer="defer" async id="wpd-js">${localStorage.getItem('jscode')}</script>

        <!-- Woditor -->
        <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js" type="text/javascript" id="woditor-pagedjs"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/transparency/0.9.9/transparency.min.js"></script>
        <!-- <script src="woditor-template.json" type="text/javascript" id="woditor-template" defer></script> -->

        <style type="text/styles" id="wpd-pagedjs-styles">
        /* Variables for the interface */
        :root {
            --wpd-pjs-color-background: rgba(0, 0, 0, 0.2);
            --wpd-pjs-color-marginBox: transparent;
            --wpd-pjs-color-pageBox: transparent;
            --wpd-pjs-color-paper: white;
        }
        /* To define how the book look on the screen: */
        @media screen {
            body {
                background-color: var(--wpd-pjs-color-background);
            }
            .pagedjs_pages {
                display: flex;
                width: calc(var(--wpd-pjs-width) * 2);
                flex: 0;
                flex-wrap: wrap;
                margin: 0 auto;
            }
            .pagedjs_page {
                background-color: var(--wpd-pjs-color-paper);
                box-shadow: 0 0 0 2px var(--wpd-pjs-color-pageBox);
                margin: 0;
                flex-shrink: 0;
                flex-grow: 0;
                margin-top: 10mm;
            }
            .pagedjs_first_page {
                margin-left: var(--wpd-pjs-width);
            }
            /* show the margin-box */
            .pagedjs_margin-content
            {
                box-shadow: 0 0 0 1px inset var(--wpd-pjs-color-marginBox);
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
        <script type="application/ld+json" id="woditor-data-model">
        {}
        </script>

        </head>
        <body id="woditor-transparency-container">
        ${localStorage.getItem('htmlcode')}
        </body>
        </html>`;
        var iframeDocument = document.querySelector('#preview').contentDocument;

        iframeDocument.open();
        iframeDocument.write(source);
        iframeDocument.close();

        localStorage.setItem('preview', source);
    }

    // DEPENDENCY INJECTION
    // ------------------------------
    // cdnjs typeahead search
    var query = E('.cdnjs-search .cdnjs');
    E.get('https://api.cdnjs.com/libraries?fields=version,description').done(function (data) {
        var searchData = data.results,
            search = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: searchData
            });

        query.typeahead(null, {
            display: 'name',
            name: 'search',
            source: search,
            limit: 1000,
            templates: {
                empty: function () {
                    return '<p class="no-match">unable to match query!</p>';
                },
                suggestion: function (data) {
                    return '<p class="lib"><span class="name">' + data.name + '</span> <span class="version">' + data.version + '</span><br><span class="description">' + data.description + '</span></p>';
                }
            }
        }).on('typeahead:select', function (e, datum) {
            var latest = datum.latest;
            loadDep(latest);
            clearSearch();
        }).on('typeahead:change', function () {
            clearSearch();
        });
    }).fail(function () {
        alert("error getting cdnjs libraries!");
    });

    // clear typeahead search and close results list
    function clearSearch() {
        query.typeahead('val', '');
        query.typeahead('close');
    }

    // load dependency
    function loadDep(url) {
        var dep;
        if (url.indexOf('<') !== -1) {
            dep = url;
        } else {
            if (url.endsWith('.js')) {
                dep = '<script src="' + url + '"><\/script>';
            } else if (url.endsWith('.styles')) {
                dep = '<style>@import url("' + url + '");<\/style>';
            }
        }

        if (html.indexOf(dep) !== -1) {
            alert('dependency already included!');
        } else {
            var insert = html.split('<\/script>').length - 1;
            editorHTML.replaceRange(dep + '\n', {
                line: insert,
                ch: 0
            });
            alert('dependency added successfully!');
        }
    }


    // RESIZE FUNCTIONS
    // ------------------------------
    // drag handle to resize code pane
    var resizeHandle = E('.code-pane'),
        widthBox = E('.preview-width'),
        windowWidth = E(window).width();

    resizeHandle.resizable({
        handles: 'e',
        minWidth: 0,
        maxWidth: windowWidth - 16,
        create: function () {
            var currentWidth = resizeHandle.width(),
                previewWidth = windowWidth - currentWidth - 16;
            widthBox.text(previewWidth + 'px');
        },
        resize: function (e, ui) {
            var currentWidth = ui.size.width,
                previewWidth = windowWidth - currentWidth - 16;
            ui.element.next().styles('width', windowWidth - currentWidth + 'px');
            ui.element.next().find('iframe').styles('pointer-events', 'none');
            widthBox.show();
            if (currentWidth <= 0) {
                widthBox.text(windowWidth - 16 + 'px');
            } else {
                widthBox.text(previewWidth + 'px');
            }
        },
        stop: function (e, ui) {
            ui.element.next().find('iframe').styles('pointer-events', 'inherit');
            widthBox.hide();
            editorHTML.refresh();
            editorStyles.refresh();
            editorJS.refresh();
        }
    });


    // GENERAL FUNCTIONS
    // ------------------------------
    // code pane and wrap button swapping
    function swapOn(elem) {
        elem.css({
            'position': 'relative',
            'visibility': 'visible'
        });
    }

    function swapOff(elem) {
        elem.css({
            'position': 'absolute',
            'visibility': 'hidden'
        });
    }

    E('.code-swap span').not('.toggle-view').on('click', function () {
        var codeContent = E('.code-pane-content'),
            codeHTML = E('.code-pane-html'),
            codeStyles = E('.code-pane-styles'),
            codePaged = E('.code-pane-paged'),
            codeJS = E('.code-pane-js'),
            codeData = E('.code-pane-data'),
            codeConfig = E('.code-pane-config'),
            wrapContent = E('.toggle-lineWrapping.content'),
            wrapHTML = E('.toggle-lineWrapping.html'),
            wrapStyles = E('.toggle-lineWrapping.styles'),
            wrapPaged = E('.toggle-lineWrapping.paged'),
            wrapJS = E('.toggle-lineWrapping.js'),
            wrapData = E('.toggle-lineWrapping.data'),
            wrapConfig = E('.toggle-lineWrapping.config'),
            preview = E('.preview-pane');

        E(this).addClass('active').siblings().removeClass('active');

        if (E(this).is(':contains("Content")')) {
            swapOn(codeContent);
            swapOn(wrapContent);
            swapOff(codeHTML);
            swapOff(wrapHTML);
            swapOff(codeStyles);
            swapOff(wrapStyles);
            swapOff(codePaged);
            swapOff(wrapPaged);
            swapOff(codeJS);
            swapOff(wrapJS);
            swapOff(codeData);
            swapOff(wrapData);
            swapOff(codeConfig);
            swapOff(wrapConfig);
            if (E(window).width() <= 800) {
                swapOff(preview);
            } else {
                swapOn(preview);
            }
        } else if (E(this).is(':contains("HTML")')) {
            swapOn(codeHTML);
            swapOn(wrapHTML);
            swapOff(codeContent);
            swapOff(wrapContent);
            swapOff(codeStyles);
            swapOff(wrapStyles);
            swapOff(codePaged);
            swapOff(wrapPaged);
            swapOff(codeJS);
            swapOff(wrapJS);
            swapOff(codeData);
            swapOff(wrapData);
            swapOff(codeConfig);
            swapOff(wrapConfig);
            if (E(window).width() <= 800) {
                swapOff(preview);
            } else {
                swapOn(preview);
            }
        } else if (E(this).is(':contains("Styles")')) {
            swapOn(codeStyles);
            swapOn(wrapStyles);
            swapOff(codeContent);
            swapOff(wrapContent);
            swapOff(codeHTML);
            swapOff(wrapHTML);
            swapOff(codePaged);
            swapOff(wrapPaged);
            swapOff(codeJS);
            swapOff(wrapJS);
            swapOff(codeData);
            swapOff(wrapData);
            swapOff(codeConfig);
            swapOff(wrapConfig);
            if (E(window).width() <= 800) {
                swapOff(preview);
            } else {
                swapOn(preview);
            }
        } else if (E(this).is(':contains("Paged")')) {
            swapOn(codePaged);
            swapOn(wrapPaged);
            swapOff(codeContent);
            swapOff(wrapContent);
            swapOff(codeHTML);
            swapOff(wrapHTML);
            swapOff(codeStyles);
            swapOff(wrapStyles);
            swapOff(codeJS);
            swapOff(wrapJS);
            swapOff(codeData);
            swapOff(wrapData);
            swapOff(codeConfig);
            swapOff(wrapConfig);
            if (E(window).width() <= 800) {
                swapOff(preview);
            } else {
                swapOn(preview);
            }
        } else if (E(this).is(':contains("JS")')) {
            swapOn(codeJS);
            swapOn(wrapJS);
            swapOff(codeContent);
            swapOff(wrapContent);
            swapOff(codeHTML);
            swapOff(wrapHTML);
            swapOff(codeStyles);
            swapOff(wrapStyles);
            swapOff(codePaged);
            swapOff(wrapPaged);
            swapOff(codeData);
            swapOff(wrapData);
            swapOff(codeConfig);
            swapOff(wrapConfig);
            if (E(window).width() <= 800) {
                swapOff(preview);
            } else {
                swapOn(preview);
            }
        } else if (E(this).is(':contains("Data")')) {
            swapOn(codeData);
            swapOn(wrapData);
            swapOff(codeContent);
            swapOff(wrapContent);
            swapOff(codeHTML);
            swapOff(wrapHTML);
            swapOff(codeStyles);
            swapOff(wrapStyles);
            swapOff(codeJS);
            swapOff(wrapJS);
            swapOff(codePaged);
            swapOff(wrapPaged);
            swapOff(codeConfig);
            swapOff(wrapConfig);
            if (E(window).width() <= 800) {
                swapOff(preview);
            } else {
                swapOn(preview);
            }
        } else if (E(this).is(':contains("Config")')) {
            swapOn(codeConfig);
            swapOn(wrapConfig);
            swapOff(codeContent);
            swapOff(wrapContent);
            swapOff(codeHTML);
            swapOff(wrapHTML);
            swapOff(codeStyles);
            swapOff(wrapStyles);
            swapOff(codeJS);
            swapOff(wrapJS);
            swapOff(codePaged);
            swapOff(wrapPaged);
            swapOff(codeData);
            swapOff(wrapData);
            if (E(window).width() <= 800) {
                swapOff(preview);
            } else {
                swapOn(preview);
            }
        } else if (E(this).is(':contains("preview")')) {
            swapOn(preview);
            swapOff(codeContent);
            swapOff(wrapContent);
            swapOff(codeHTML);
            swapOff(wrapHTML);
            swapOff(codeStyles);
            swapOff(wrapStyles);
            swapOff(codeJS);
            swapOff(wrapJS);
            swapOff(codePaged);
            swapOff(wrapPaged);
            swapOff(codeData);
            swapOff(wrapData);
            swapOff(codeConfig);
            swapOff(wrapConfig);
        }
    });

    // expanding scrollbars
    var vScroll = E('.CodeMirror-overlayscroll-vertical'),
        hScroll = E('.CodeMirror-overlayscroll-horizontal');

    vScroll.on('mousedown', function () {
        E(this).addClass('hold');
    });

    hScroll.on('mousedown', function () {
        E(this).addClass('hold');
    });

    E(document).on('mouseup', function () {
        vScroll.removeClass('hold');
        hScroll.removeClass('hold');
    });

    // indent wrapped lines
    function indentWrappedLines(editor) {
        var charWidth = editor.defaultCharWidth(),
            basePadding = 4;
        editor.on('renderLine', function (cm, line, elt) {
            var off = CodeMirror.countColumn(line.text, null, cm.getOption('tabSize')) * charWidth;
            elt.style.textIndent = '-' + off + 'px';
            elt.style.paddingLeft = (basePadding + off) + 'px';
        });
    }

    // run indent wrapped lines
    indentWrappedLines(editorHTML);
    indentWrappedLines(editorStyles);
    indentWrappedLines(editorJS);


    // UTILITY FUNCTIONS
    // ------------------------------
    // font size
    fontSize.on('change keyup', function () {
        var size = E(this).val();
        updateFontSize(editorHTML, size);
        updateFontSize(editorStyles, size);
        updateFontSize(editorJS, size);
        localStorage.setItem('fontsize', size);
    });

    // toggle view
    E('.toggle-view').on('click', function () {
        E(this).toggleClass('enabled');
        if (E(this).hasClass('enabled')) {
            E(this).html('view <span class="fas fa-chevron-up"></span>');
        } else {
            E(this).html('view <span class="fas fa-chevron-down"></span>');
        }
    });

    // toggle tools
    E('.toggle-tools').on('click', function () {
        E(this).toggleClass('active');
        if (E(this).hasClass('active')) {
            E(this).html('tools <span class="fas fa-chevron-up"></span>');
        } else {
            E(this).html('tools <span class="fas fa-chevron-down"></span>');
        }
    });

    // toggle line wrapping (html)
    E('.toggle-lineWrapping.html').on('click', function () {
        E(this).toggleClass('active');
        if (E(this).hasClass('active')) {
            editorHTML.setOption('lineWrapping', true);
            E(this).html('wrap <span class="fas fa-toggle-on"></span>');
        } else {
            editorHTML.setOption('lineWrapping', false);
            E(this).html('wrap <span class="fas fa-toggle-off"></span>');
        }
    });

    // toggle line wrapping (styles)
    E('.toggle-lineWrapping.styles').on('click', function () {
        E(this).toggleClass('active');
        if (E(this).hasClass('active')) {
            editorStyles.setOption('lineWrapping', true);
            E(this).html('wrap <span class="fas fa-toggle-on"></span>');
        } else {
            editorStyles.setOption('lineWrapping', false);
            E(this).html('wrap <span class="fas fa-toggle-off"></span>');
        }
    });

    // toggle line wrapping (js)
    E('.toggle-lineWrapping.js').on('click', function () {
        E(this).toggleClass('active');
        if (E(this).hasClass('active')) {
            editorJS.setOption('lineWrapping', true);
            E(this).html('wrap <span class="fas fa-toggle-on"></span>');
        } else {
            editorJS.setOption('lineWrapping', false);
            E(this).html('wrap <span class="fas fa-toggle-off"></span>');
        }
    });

    // emmet
    E('.toggle-emmet').on('click', function () {
        E(this).toggleClass('active');
        if (E(this).hasClass('active')) {
            emmetCodeMirror(editorHTML);
            emmetCodeMirror(editorStyles);
            E(this).html('emmet <span class="fas fa-toggle-on"></span>');
        } else {
            emmetCodeMirror.dispose(editorHTML);
            emmetCodeMirror.dispose(editorStyles);
            E(this).html('emmet <span class="fas fa-toggle-off"></span>');
        }
    });

    // reset editor
    E('.reset-editor').on('click', function () {
        editorHTML.setValue(defaultHTML);
        editorStyles.setValue(defaultStyles);
        editorPaged.setValue(defaultPaged);
        editorJS.setValue(defaultJS);
        editorData.set(defaultData);
    });

    // refresh editor
    E('.refresh-editor').on('click', function () {
        location.reload();
    });

    // clear editor
    E('.clear-editor').on('click', function () {
        editorHTML.setValue('');
        editorStyles.setValue('');
        editorPaged.setValue('');
        editorJS.setValue('');
        editorData.set('');
    });

    // run script
    E('.run-script').on('click', function () {
        setHTML();
        setJS();
        setStyles();
        setPaged();
        setData();

        if (E(window).width() <= 800) {
            E('.toggle-preview').click();
        }
    });

    // save as html file
    E('.save').on('click', function () {
        var text = localStorage.getItem('preview'),
            blob = new Blob([text], {
                type: 'text/html; charset=utf-8'
            });

        saveAs(blob, 'woditor.html');
    });


    // REFRESH EDITOR
    // ------------------------------
    editorHTML.refresh();
    editorStyles.refresh();
    editorJS.refresh();

});
