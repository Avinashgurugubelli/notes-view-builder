const myUl = document.getElementById("myUL");
var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

const config = {
    // if the input data is not sorted then sort while rendering set value to true.
    isSortNeeded: false,
    supportedExtensions: ['html', 'htm', 'md', 'mhtml', 'txt', 'pdf', 'docx', 'xlsx', 'pptx', 'csv', 'json', 'js', 'css', 'xml'],
    extensionsToOpenInNewTab: ['mhtml']
};

// Rendering the data
data.children.forEach(element => {
    const isDir = element.type === "directory";
    const li = createLi(element.label, isDir, element.path);
    li.appendChild(childrenRenderer(element.children || []));
    myUl.appendChild(li);
});

function createLi(text, isDir, path) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    if (isDir) {
        span.setAttribute("class", "caret");
        span.appendChild(document.createTextNode(`${text}`));
        li.setAttribute('title', text);
        li.appendChild(span);
    }
    else {
        const file_path_split = text.split(".");
        const extn = file_path_split[file_path_split.length - 1];
        if (extn && config.supportedExtensions.includes(extn)) {
            span.appendChild(document.createTextNode(`${text}`));
            path !== undefined && li.setAttribute("data-file-path", path);
            li.setAttribute('title', text);
            li.setAttribute('class', 'topic-li')
            li.appendChild(span);
        }
    }
    return li;
}

function sortChildren(children = []) {
    if (config.isSortNeeded) {
        children.sort((a, b) => {
            if (a.id && b.id) {
                // Try numeric comparison if both ids are numbers
                const aNum = Number(a.id), bNum = Number(b.id);
                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return aNum - bNum;
                }
                // Otherwise, string comparison
                return a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' });
            }
            if (a.id) return -1;
            if (b.id) return 1;
            return collator.compare(a.label, b.label);
        });
    }
    return children;
}

function childrenRenderer(children = []) {
    // Sort children if needed
    children = sortChildren(children);
    const CurrentUl = document.createElement("ul");
    children.forEach(element => {
        const isDir = element.type === "directory";
        const li = createLi(element.label, isDir, element.path);
        CurrentUl.appendChild(li);
        CurrentUl.setAttribute("class", "nested");
        if (element.children) {
            li.appendChild(childrenRenderer(element.children));
        }
    });
    return CurrentUl;
}

// Tree view expand/ collapse logic
const toggler = document.getElementsByClassName("caret");
for (i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function () {
        event.stopPropagation();
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
    });
}

// Rendering the content into iframe on click of content link
const topicLinks = document.getElementsByClassName("topic-li");
for (i = 0; i < topicLinks.length; i++) {
    topicLinks[i].addEventListener("click", function () {
        event.stopPropagation();
        const path = this.getAttribute("data-file-path");
        this.classList.add("mark-click");
        document.getElementById("topic-title").innerHTML = path.replace('src/', '').replaceAll('/', ' > ');
        // Show spinner before loading
        document.getElementById("spinner").style.display = "block";
        if (config.extensionsToOpenInNewTab.includes(path.split('.').pop())) {
            window.open(path, '_blank');
        } else {
            document.getElementById("content-displayer").setAttribute("src", path);
        }
    });
}

$(document).ready(() => {
    function copyToClipboard(text) {
        var temp = $("<textarea>");
        $("body").append(temp);
        // &nbsp replace with empty space, to compile in editors
        temp.val(text.replace(/\xA0/g, ' ')).select();
        document.execCommand("copy");
        temp.remove();
    }

    $('#content-displayer').on('load', function () {
        var iframe = $("#content-displayer").contents();
        var copyButtons = iframe.find("button[aria-label='copy-code-button']");
        for (let i = 0; i < copyButtons.length; i++) {
            $(copyButtons[i]).on('click', (e) => {
                // let code = $(e.target).closest('.code-container')[0].innerText;
                let code = $($(e.target).closest('.code-container')[0]).find('.view-lines')[0].innerText;
                copyToClipboard(code);
            })
        }
        // Hide spinner when iframe loads
        document.getElementById("spinner").style.display = "none";
    });
});
