(function () {
    tinymce.PluginManager.add('toc', function (editor) {
        var selectedLinkId = null;
        let clickedOnTOC = false; // 定义一个标志位，用于记录是否点击了目录项
        const getTocClass = () => {
            return editor.getParam('toc_class', 'outside-toc');
        };

        const getTocHeader = () => {
            const tagName = editor.getParam('toc_header', 'h2');
            return /^h[1-6]$/i.test(tagName) ? tagName : 'h2';
        };

        const getTocDepth = () => {
            const depth = parseInt(editor.getParam('toc_depth', '3'), 10);
            return depth >= 1 && depth <= 9 ? depth : 3;
        };

        const create = (prefix) => {
            let counter = 0;
            return () => {
                const guid = new Date().getTime().toString(32);
                return prefix + guid + (counter++).toString(32);
            };
        };

        const scrollToElement = (id) => {
            clickedOnTOC = true;
            const element = editor.getBody().querySelector(`#${id}`);
            const tocClass = getTocClass();
            const outsideDiv = document.getElementById('outside-toc');
            const allLinks = document.querySelectorAll(`#${tocClass} a`);
            //当切换其他目录，移除第一个选中
            removeFirstStyle()
            // 移除所有目录节点的高亮样式
            allLinks.forEach(link => {
                link.classList.remove('active');
            });
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                // 获取内容区域的位置信息,编辑器内容区域距离顶部45px
                const contentTopPosition = editor.getContentAreaContainer().getBoundingClientRect().top;
                console.log(contentTopPosition)
                const toxEditArea = document.querySelector('.tox-sidebar-wrap');
                toxEditArea.style.marginTop = '45px'; // 将元素的 top 设置为 45px
                allLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        const divParent = link.closest('div');
                        if (divParent) {
                            divParent.classList.add('active3');
                        }
                    } else {
                        const divParent = link.closest('div');
                        if (divParent) {
                            divParent.classList.remove('active3');
                        }
                    }
                });
                setTimeout(() => {
                    clickedOnTOC = false;
                }, 1000);
            }

        };

        const removeFirstStyle = () => {
            //当切换其他目录，移除第一个选中
            const outsideToc = document.getElementById('outside-toc');
            if (outsideToc) {
                const firstLevelUl = outsideToc.querySelector('ul');
                if (firstLevelUl) {
                    const firstLevelLi = firstLevelUl.querySelector('li');
                    if (firstLevelLi) {
                        firstLevelLi.classList.remove('active');
                        firstLevelLi.classList.remove('active3');
                    }
                }
            }
        }

        var tocContainer = document.getElementById('outside-toc');

        editor.on('init', function () {
            // 获取编辑器的 iframe
            var iframe = editor.iframeElement;
            // 获取 iframe 内部的文档对象
            var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            // 添加滚动事件监听器
            iframeDocument.addEventListener('scroll', function () {
                if (!clickedOnTOC) {
                    // 如果没有点击目录项，则执行滚动事件的处理逻辑
                    updateLinkBackground2();
                    var scrollTop = iframeDocument.documentElement.scrollTop || iframeDocument.body.scrollTop;
                    // if(scrollTop != 0){
                    //     // 获取内容区域的位置信息,编辑器内容区域距离顶部45px
                    //     const toxEditArea = document.querySelector('.tox-sidebar-wrap');
                    //     toxEditArea.style.marginTop = '45px';
                    // }else {
                    //     const toxEditArea = document.querySelector('.tox-sidebar-wrap');
                    //     toxEditArea.style.marginTop = '10px';
                    // }
                    tocContainer.scrollTop = scrollTop;
                    highlightTocItems(scrollTop);
                }
            });
        });
        // 在每次点击链接后，更新链接的背景颜色
        const updateLinkBackground = () => {
            const allLinks = document.querySelectorAll('#outside-toc a');
            allLinks.forEach(link => {
                const linkId = link.getAttribute('href').replace('#', '');
                if (linkId === selectedLinkId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        };

        const updateLinkBackground2 = () => {
            removeFirstStyle()
            var previousHighlightedItem = tocContainer.querySelector('.level-1-wrapper .active3');
            if (previousHighlightedItem && previousHighlightedItem !== selectedLinkId) {
                previousHighlightedItem.classList.remove('active3');
            }
        };

        updateLinkBackground();

        const tocId = create('mcetoc_');

        const readHeaders = () => {
            const tocClass = getTocClass();
            const headerTag = getTocHeader();
            const selector = `h1, h2, h3, h4, h5, h6`;
            const headers = Array.from(editor.getBody().querySelectorAll(selector)).filter(item => item.id !== 'toc-title');
            if (headers.length && /^h[1-9]$/i.test(headerTag)) {
                return headers.filter((el) => !el.classList.contains(tocClass)).map((h) => {
                    const id = h.id ? h.id : tocId();
                    return {
                        id,
                        level: parseInt(h.tagName.replace(/^H/i, ''), 10),
                        title: h.textContent,
                        element: h,
                    };
                });
            }
            return [];
        };

        const generateTocContentHtml = () => {
            const headers = readHeaders();
            const minLevel = headers.reduce((min, h) => Math.min(min, h.level), 9);
            let html = '';
            if (!headers.length) {
                return html;
            }
            html += `<h2 id="toc-title" class="my-custom-li-class" >大纲<button id="button" style="margin-left: 10px"><svg t="1711011048945" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1813" width="20" height="20"><path d="M332.8 729.6l34.133333-34.133333c42.666667 12.8 93.866667 21.333333 145.066667 21.333333 162.133333 0 285.866667-68.266667 375.466667-213.333333-46.933333-72.533333-102.4-128-166.4-162.133334l29.866666-29.866666c72.533333 42.666667 132.266667 106.666667 183.466667 192-98.133333 170.666667-243.2 256-426.666667 256-59.733333 4.266667-119.466667-8.533333-174.933333-29.866667z m-115.2-64c-51.2-38.4-93.866667-93.866667-132.266667-157.866667 98.133333-170.666667 243.2-256 426.666667-256 38.4 0 76.8 4.266667 110.933333 12.8l-34.133333 34.133334c-25.6-4.266667-46.933333-4.266667-76.8-4.266667-162.133333 0-285.866667 68.266667-375.466667 213.333333 34.133333 51.2 72.533333 93.866667 115.2 128l-34.133333 29.866667z m230.4-46.933333l29.866667-29.866667c8.533333 4.266667 21.333333 4.266667 29.866666 4.266667 46.933333 0 85.333333-38.4 85.333334-85.333334 0-12.8 0-21.333333-4.266667-29.866666l29.866667-29.866667c12.8 17.066667 17.066667 38.4 17.066666 64 0 72.533333-55.466667 128-128 128-17.066667-4.266667-38.4-12.8-59.733333-21.333333zM384 499.2c4.266667-68.266667 55.466667-119.466667 123.733333-123.733333 0 4.266667-123.733333 123.733333-123.733333 123.733333zM733.866667 213.333333l29.866666 29.866667-512 512-34.133333-29.866667L733.866667 213.333333z" fill="#444444" p-id="1814"></path></svg></button></h2>`;
            let prevLevel = minLevel - 1;
            headers.forEach((h, index) => {
                const uniqueId = `${h.id}-${index}`;
                h.element.id = uniqueId;
                const nextLevel = headers[index + 1]?.level || null;

                if (prevLevel === h.level) {
                    html += `<div class="level-${h.level}-wrapper"><li>`;
                } else {
                    for (let i = prevLevel; i < h.level; i++) {
                        html += '<ul>';
                    }
                }
                html += `<div class="level-${h.level}-wrapper"><li class="level-${h.level} ${index === 0 ? 'active active3' : ''}"><a href="#${uniqueId}">${h.title}</a></li></div>`;
                if (nextLevel === h.level || !nextLevel) {
                    if (!nextLevel) {
                        html += '</ul>';
                    }
                } else {
                    for (let i = h.level; i > nextLevel; i--) {
                        if (i === nextLevel + 1) {
                            html += `</li></div></ul><div class="level-${h.level}-wrapper"><li>`;
                        } else {
                            html += '</li></div></ul>';
                        }
                    }
                }
                prevLevel = h.level;
            });
            return html;
        };

        function isElementInViewport(el) {
            var rect = el.getBoundingClientRect();
            var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            var offset = 0;
            var distanceToTop = rect.top;
            if (distanceToTop >= viewportHeight / 2) {
                offset = viewportHeight / 0.5;
            }
            return (
                rect.top + offset >= 0 &&
                rect.top + offset <= viewportHeight
            );
        }

        function removeAllActiveClasses() {
            const tocClass = getTocClass();
            const allLinks = document.querySelectorAll(`#${tocClass} a`);
            allLinks.forEach(function (tocItem) {
                tocItem.classList.remove('active');
                const divParent = tocItem.closest('div');
                if (divParent) {
                    divParent.classList.remove('active3');
                }
            });
        }
        // 高亮目录项函数
        function highlightTocItems(scrollTop) {
            const tocClass = getTocClass();
            const allLinks = document.querySelectorAll(`#${tocClass} a`);
            allLinks.forEach(function (tocItem) {
                var targetId = tocItem.getAttribute('href').replace('#', '');
                var targetElement = editor.getBody().querySelector('#' + targetId);
                const divParent = tocItem.closest('div');
                if (isElementInViewport(targetElement)) {
                    removeAllActiveClasses();
                    tocItem.classList.add('active');
                    divParent.classList.add('active3');
                } else {
                    tocItem.classList.remove('active');
                    divParent.classList.remove('active3');
                }
            });
        }

        const updateToc = (tocHtml) => {
            const outsideDiv = document.getElementById('outside-toc');
            if (outsideDiv) {
                outsideDiv.innerHTML = tocHtml;
                outsideDiv.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetId = link.getAttribute('href').replace('#', '');
                        const targetElement = editor.getBody().querySelector(`#${targetId}`);
                        if (targetElement) {
                            scrollToElement(targetId);
                        }
                    });
                });
            }
        };

        const insertTocOutsideEditor = () => {
            const tocHtml = generateTocContentHtml();
            const outsideDiv = document.getElementById('outside-toc');
            if (outsideDiv) {
                outsideDiv.innerHTML = tocHtml;
                outsideDiv.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetId = link.getAttribute('href').replace('#', '');
                        const targetElement = editor.getBody().querySelector(`#${targetId}`);
                        if (targetElement) {
                            scrollToElement(targetId);
                            link.classList.add('active');
                        }
                    });
                });
            }
        };

        //显示隐藏大纲功能
        const addButtonToToggleTocVisibility = () => {
            const toggleButton = document.getElementById('button');
            const outsideDiv = document.getElementById('outside-toc');
            const showButton = document.getElementById('show')
            //点击隐藏大纲
            if (toggleButton && outsideDiv && showButton) {
                toggleButton.addEventListener('click', () => {
                    outsideDiv.style.display = 'none';
                    showButton.style.display = 'block'
                });
                //点击显示大纲
                showButton.addEventListener('click', () => {
                    outsideDiv.style.display = 'block';
                    showButton.style.display = 'none'
                });
            }
        };

        // 在编辑器初始化后添加显示/隐藏按钮
        editor.on('init', addButtonToToggleTocVisibility);

        editor.addCommand('mceInsertTocOutsideEditor', () => {
            insertTocOutsideEditor();
        });

        editor.ui.registry.addButton('toc', {
            icon: 'toc',
            tooltip: 'Insert TOC Outside Editor',
            onAction: () => {
                insertTocOutsideEditor();
            },
        });

        editor.addCommand('mceInsertOrUpdateToc', () => {
            const tocHtml = generateTocContentHtml();
            const $tocElm = editor.getBody().querySelector(`.${getTocClass()}`);
            if ($tocElm) {
                // 如果已存在目录，则更新目录
                updateToc(tocHtml);
            } else {
                insertTocOutsideEditor();
            }
            // 更新显示/隐藏按钮
            addButtonToToggleTocVisibility();
        });

        editor.ui.registry.addContextToolbar('toc', {
            items: 'tocupdate',
            predicate: (node) => node.classList.contains(getTocClass()),
            scope: 'node',
            position: 'node',
        });
    });
})();
