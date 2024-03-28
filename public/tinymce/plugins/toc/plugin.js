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
                const toxEditArea = document.querySelector('.tox-sidebar-wrap');
                toxEditArea.style.marginTop = '45px'; // 将元素的 top 设置为 45px
                allLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        const divParent = link.closest('div');
                        if (divParent) {
                            divParent.classList.add('activeBorderLeft');
                        }
                    } else {
                        const divParent = link.closest('div');
                        if (divParent) {
                            divParent.classList.remove('activeBorderLeft');
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
                        firstLevelLi.classList.remove('activeBorderLeft');
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
                    // 获取编辑器内容区域的滚动位置
                    var scrollTop = iframeDocument.documentElement.scrollTop || iframeDocument.body.scrollTop;
                    // 调用函数高亮对应的目录项
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
            var previousHighlightedItem = tocContainer.querySelector('.level-1-wrapper .activeBorderLeft');
            if (previousHighlightedItem && previousHighlightedItem !== selectedLinkId) {
                previousHighlightedItem.classList.remove('activeBorderLeft');
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
        let clickIsShow = false


        const generateTocContentHtml = () => {
            const headers = readHeaders();
            const minLevel = headers.reduce((min, h) => Math.min(min, h.level), 9);
            let html = '';
            if (!headers.length) {
                return html;
            }
            html += `<h2 id="toc-title" class="my-custom-li-class" >大纲<button id="button"><svg t="1711011048945" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1813" width="20" height="20"><path d="M332.8 729.6l34.133333-34.133333c42.666667 12.8 93.866667 21.333333 145.066667 21.333333 162.133333 0 285.866667-68.266667 375.466667-213.333333-46.933333-72.533333-102.4-128-166.4-162.133334l29.866666-29.866666c72.533333 42.666667 132.266667 106.666667 183.466667 192-98.133333 170.666667-243.2 256-426.666667 256-59.733333 4.266667-119.466667-8.533333-174.933333-29.866667z m-115.2-64c-51.2-38.4-93.866667-93.866667-132.266667-157.866667 98.133333-170.666667 243.2-256 426.666667-256 38.4 0 76.8 4.266667 110.933333 12.8l-34.133333 34.133334c-25.6-4.266667-46.933333-4.266667-76.8-4.266667-162.133333 0-285.866667 68.266667-375.466667 213.333333 34.133333 51.2 72.533333 93.866667 115.2 128l-34.133333 29.866667z m230.4-46.933333l29.866667-29.866667c8.533333 4.266667 21.333333 4.266667 29.866666 4.266667 46.933333 0 85.333333-38.4 85.333334-85.333334 0-12.8 0-21.333333-4.266667-29.866666l29.866667-29.866667c12.8 17.066667 17.066667 38.4 17.066666 64 0 72.533333-55.466667 128-128 128-17.066667-4.266667-38.4-12.8-59.733333-21.333333zM384 499.2c4.266667-68.266667 55.466667-119.466667 123.733333-123.733333 0 4.266667-123.733333 123.733333-123.733333 123.733333zM733.866667 213.333333l29.866666 29.866667-512 512-34.133333-29.866667L733.866667 213.333333z" fill="#444444" p-id="1814"></path></svg></button>        <button id="show"><svg t="1711011382370" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1963" width="20" height="20"><path d="M512 298.666667c-162.133333 0-285.866667 68.266667-375.466667 213.333333 89.6 145.066667 213.333333 213.333333 375.466667 213.333333s285.866667-68.266667 375.466667-213.333333c-89.6-145.066667-213.333333-213.333333-375.466667-213.333333z m0 469.333333c-183.466667 0-328.533333-85.333333-426.666667-256 98.133333-170.666667 243.2-256 426.666667-256s328.533333 85.333333 426.666667 256c-98.133333 170.666667-243.2 256-426.666667 256z m0-170.666667c46.933333 0 85.333333-38.4 85.333333-85.333333s-38.4-85.333333-85.333333-85.333333-85.333333 38.4-85.333333 85.333333 38.4 85.333333 85.333333 85.333333z m0 42.666667c-72.533333 0-128-55.466667-128-128s55.466667-128 128-128 128 55.466667 128 128-55.466667 128-128 128z" fill="#444444" p-id="1964"></path></svg></button></h2>`;
            let prevLevel = minLevel - 1;
            headers.forEach((h, index) => {
                const uniqueId = `${h.id}-${index}`;
                h.element.id = uniqueId;
                console.log(h.id)
                const nextLevel = headers[index + 1]?.level || null;
                if (prevLevel === h.level) {
                    html += `<div class="level-${h.level}-wrapper"><li>`;
                } else {
                    for (let i = prevLevel; i < h.level; i++) {
                        html += '<ul>';
                    }
                }
                html += `<div class="level-${h.level}-wrapper"><li class="level-${h.level} ${index === 0 ? 'active activeBorderLeft' : ''}"><a href="#${uniqueId}">${h.title}</a></li></div>`;
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
                    divParent.classList.remove('activeBorderLeft');
                    divParent.classList.remove('activeBorderBottom');
                }
            });
        }
        // 高亮目录项函数
        function highlightTocItems(scrollTop) {
            const tocClass = getTocClass();
            const allLinks = document.querySelectorAll(`#${tocClass} a`);
            if (!clickIsShow) {
                allLinks.forEach(function (tocItem) {
                    var targetId = tocItem.getAttribute('href').replace('#', '');
                    var targetElement = editor.getBody().querySelector('#' + targetId);
                    const divParent = tocItem.closest('div');
                    if (isElementInViewport(targetElement)) {
                        removeAllActiveClasses();
                        tocItem.classList.add('active');
                        divParent.classList.add('activeBorderLeft');
                        // 检查是否滚动到目录底部
                        if (tocItem.getBoundingClientRect().bottom >= tocContainer.getBoundingClientRect().bottom - 100) {
                            // 让目录滚动条向下滚动
                            tocContainer.scrollTop += tocItem.getBoundingClientRect().bottom - tocContainer.getBoundingClientRect().bottom + 120;
                        } else if (tocItem.getBoundingClientRect().top <= tocContainer.getBoundingClientRect().top) {
                            // 检查是否滚动到目录顶部,让目录滚动条向上滚动
                            tocContainer.scrollTop -= tocContainer.getBoundingClientRect().top - tocItem.getBoundingClientRect().top;
                        }
                    } else {
                        tocItem.classList.remove('active');
                        divParent.classList.remove('activeBorderLeft');
                    }
                });
            } else {
                allLinks.forEach(function (tocItem) {
                    var targetId = tocItem.getAttribute('href').replace('#', '');
                    var targetElement = editor.getBody().querySelector('#' + targetId);
                    const divParent = tocItem.closest('div');
                    if (isElementInViewport(targetElement)) {
                        removeAllActiveClasses();
                        divParent.classList.remove('activeBorderLeft');
                        tocItem.classList.add('active');
                        divParent.classList.add('activeBorderBottom');
                        // 检查是否滚动到目录底部
                        if (tocItem.getBoundingClientRect().bottom >= tocContainer.getBoundingClientRect().bottom - 100) {
                            // 让目录滚动条向下滚动
                            tocContainer.scrollTop += tocItem.getBoundingClientRect().bottom - tocContainer.getBoundingClientRect().bottom + 120;
                        } else if (tocItem.getBoundingClientRect().top <= tocContainer.getBoundingClientRect().top) {
                            tocContainer.scrollTop -= tocContainer.getBoundingClientRect().top - tocItem.getBoundingClientRect().top;
                        }
                    } else {
                        tocItem.classList.remove('active');
                        divParent.classList.remove('activeBorderBottom');
                    }
                });
            }
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

        //隐藏目录
        const hideToc = () => {
            const outsideDiv = document.getElementById('outside-toc');
            const tocClass = getTocClass();
            const allLinks = document.querySelectorAll(`#${tocClass} a`);
            const h2 = document.getElementById('toc-title')
            var activeDiv = document.querySelector('.active');
            var activeBorderLeftDiv = document.querySelector('.activeBorderLeft');
            h2.style.display = 'none'
            allLinks.forEach(link => {
                const divParent = link.closest('div');
                const liParent = link.closest('li');
                if (activeBorderLeftDiv) activeBorderLeftDiv.closest('div').classList.add('activeBorderBottom')
                liParent.classList.remove('activeBorderLeft')
                if (activeDiv) activeDiv.closest('div').classList.add('activeBorderBottom')
                // 选中的目录项下边框为绿色并移除左侧border
                divParent.classList.remove('activeBorderLeft');
                divParent.style.color = '#ffffff';
                divParent.style.borderBottom = '2px solid #d8dad9';
                divParent.style.borderLeft = '0px solid #585a5a';
                outsideDiv.style.width = '50px'
                // 遍历所有的 div 元素
                const divElements = document.querySelectorAll('div');
                divElements.forEach(function (div) {
                    const classNames = div.className.split(' ');
                    if (classNames.includes('level-1-wrapper')) {
                        div.style.width = '30px';
                    } else if (classNames.includes('level-2-wrapper')) {
                        div.style.width = '25px';
                    } else if (classNames.includes('level-3-wrapper')) {
                        div.style.width = '20px';
                    } else if (classNames.includes('level-4-wrapper')) {
                        div.style.width = '15px';
                    } else if (classNames.includes('level-5-wrapper')) {
                        div.style.width = '10px';
                    } else if (classNames.includes('level-6-wrapper')) {
                        div.style.width = '5px';
                    }
                });
                var ulElements = document.querySelectorAll('ul');
                ulElements.forEach(function (ul) {
                    ul.classList.add('your-class-name');
                });
                clickIsShow = true
            });
        }

        //显示目录
        const showToc = () => {
            const outsideDiv = document.getElementById('outside-toc');
            const tocClass = getTocClass();
            const allLinks = document.querySelectorAll(`#${tocClass} a`);
            const h2 = document.getElementById('toc-title')
            var activeDiv = document.querySelector('.active');
            outsideDiv.style.display = 'block';
            h2.style.display = 'flex'
            allLinks.forEach(link => {
                const divParent = link.closest('div');
                //记录隐藏当时的定位，实现联动
                var activeBottom = document.querySelector('.activeBorderBottom');
                if (activeDiv) activeDiv.closest('div').classList.add('activeBorderLeft');
                if (activeBottom) activeBottom.classList.add('activeBorderLeft')
                outsideDiv.style.width = '300px'
                divParent.classList.remove('activeBorderBottom');
                divParent.style.color = '#585A5A';
                divParent.style.borderBottom = '0px';
                divParent.style.borderLeft = '3px solid #EFF0F0';
                divParent.style.width = 'auto';
                divParent.style.marginLeft = '-5px';
                //调整样式
                var ulElements = document.querySelectorAll('ul');
                ulElements.forEach(function (ul) {
                    ul.classList.remove('your-class-name');
                });
                clickIsShow = false
            });
        }

        //点击眼睛按钮-显示隐藏大纲功能
        let Isshow = true
        const addButtonToToggleTocVisibility = () => {
            const toggleButton = document.getElementById('button');
            const outsideDiv = document.getElementById('outside-toc');
            const showButton = document.getElementById('show')
            const Button = document.getElementById('button')
            //隐藏大纲
            if (toggleButton && outsideDiv && showButton) {
                toggleButton.addEventListener('click', () => {
                    Button.style.display = 'none'
                    showButton.style.display = 'block'
                    hideToc()
                    Isshow = false

                });
                //显示大纲
                showButton.addEventListener('click', () => {
                    Button.style.display = 'block'
                    showButton.style.display = 'none'
                    showToc()
                    Isshow = true
                });
            }
        };

        //定义鼠标移入/移除目录
        let tocHovered = false; // 定义一个标志位，用于记录目录是否被鼠标悬停
        if (tocContainer) {
            tocContainer.addEventListener('mouseenter', function () {
                if (clickIsShow) {
                    // 鼠标进入目录区域时，将 tocHovered 标志位设置为 true，显示大纲
                    tocHovered = true;
                    showToc();
                }
            });

            tocContainer.addEventListener('mouseleave', function (event) {
                // 鼠标离开目录区域时，将 tocHovered 标志位设置为 false，隐藏大纲
                var rect = tocContainer.getBoundingClientRect();
                var mouseX = event.clientX;
                var mouseY = event.clientY;
                // 如果鼠标位置在div的范围之外，则执行操作
                if (mouseX < rect.left || mouseX > rect.right || mouseY < rect.top - 50 || mouseY > rect.bottom) {
                    if (!Isshow) {
                        tocHovered = false;
                        hideToc();
                    }
                }
            });
        }

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

