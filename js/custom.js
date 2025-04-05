document.addEventListener('DOMContentLoaded', function () {
    // 如果当前页面是分类页
    if (document.title.split(" - ")[0] === "分类") {
        // 定义分类排序顺序（顶层分类）
        const categoryOrder = ["操作系统", "计算机网络", "计算机组成原理", "Git",
            "设计模式", "手写题", "打包工具", "微前端", "nodejs", "CSS", "JS", "TS", "其它知识点", "学习记录"];

        // 定义子分类排序顺序（可选，如果不定义则按字母排序）
        const subCategoryOrder = {
            "操作系统": ["进程管理", "调度算法", "内存管理"], // 示例：手动指定顺序
            // 其他分类的子分类顺序（如有需要）
        };

        // 获取顶层分类容器
        const topLevelCategories = document.querySelectorAll('.category-list > .category.row.nomargin-x');
        const sortedCategories = [];

        // 按 categoryOrder 顺序收集顶层分类
        categoryOrder.forEach(categoryName => {
            Array.from(topLevelCategories).forEach(category => {
                if (category.textContent.includes(categoryName)) {
                    sortedCategories.push(category);
                }
            });
        });

        // 递归排序子分类和文章
        function sortCategoryAndPosts(categoryElement) {
            // 检查是否有子分类（使用 :scope 限定当前元素范围）
            const subCategoriesContainer = categoryElement.querySelector(':scope > .category-collapse');
            if (!subCategoriesContainer) return;

            const subCategories = Array.from(subCategoriesContainer.querySelectorAll(':scope > .category-sub.row.nomargin-x'));

            // 如果有子分类，先排序子分类
            if (subCategories.length > 0) {
                // 获取当前顶层分类名称（如“操作系统”）
                const parentCategoryName = categoryElement.querySelector(':scope > a[title]').title;

                // 如果有手动定义的子分类顺序，按该顺序排序
                if (subCategoryOrder[parentCategoryName]) {
                    subCategories.sort((a, b) => {
                        const aTitle = a.querySelector(':scope > a[title]').title;
                        const bTitle = b.querySelector(':scope > a[title]').title;
                        return subCategoryOrder[parentCategoryName].indexOf(aTitle) - subCategoryOrder[parentCategoryName].indexOf(bTitle);
                    });
                } else {
                    // 否则按字母排序
                    subCategories.sort((a, b) => {
                        const aTitle = a.querySelector(':scope > a[title]').title;
                        const bTitle = b.querySelector(':scope > a[title]').title;
                        return aTitle.localeCompare(bTitle);
                    });
                }

                // 清空并重新插入排序后的子分类
                subCategoriesContainer.innerHTML = '';
                subCategories.forEach(subCategory => {
                    subCategoriesContainer.appendChild(subCategory);
                    // 递归排序子分类的文章
                    sortCategoryAndPosts(subCategory);
                });
            } else {
                // 如果没有子分类，直接排序文章
                const postList = categoryElement.querySelector('.category-post-list');
                if (postList) {
                    const posts = Array.from(postList.querySelectorAll('a[href*="/"]'));

                    // 按 href 中的数字排序
                    posts.sort((a, b) => {
                        const getNumber = (url) => {
                            const match = url.match(/\/(\d+)\./);
                            return match ? parseInt(match[1]) : 0;
                        };
                        return getNumber(a.href) - getNumber(b.href);
                    });

                    // 重新插入排序后的文章
                    postList.innerHTML = '';
                    posts.forEach(post => postList.appendChild(post));
                }
            }
        }

        // 对每个分类（包括子分类）进行排序
        sortedCategories.forEach(category => {
            sortCategoryAndPosts(category);
        });

        // 替换原分类顺序
        const categoryList = document.querySelector('.category-list');
        if (categoryList) {
            categoryList.innerHTML = '';
            sortedCategories.forEach(category => {
                categoryList.appendChild(category);
            });
        }
    }
});