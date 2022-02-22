let assigneeCache = new Map();
async function getAssignee(ticket) {
    let result = assigneeCache.get(ticket);
    if(result === undefined) {
        let url = location.origin + "/rest/api/3/issue/" + ticket + "?fields=assignee";
        result = fetch(url).then(json => json.json()).then(x => x.fields.assignee.displayName);
        assigneeCache.set(ticket, result);
    }
    return result;
}

function apply() {
    let time = Date.now();
    let links = Array.from(document.querySelectorAll("[data-testid=inline-card-resolved-view]"));
    for(let link of links) {
        if(link.updated) continue;
        console.log(`Updating jira link`);
        link.updated = true;
        let ticket = link.href.split("/").slice(-1)[0];
        getAssignee(ticket).then((assignee) => {
            let example = link.children[link.children.length - 1];
            let class1 = example.className;
            let child = example.children[example.children.length - 1];
            let class2 = child.className;
            let class3 = child.children[child.children.length - 1].className;

            let span1 = document.createElement("span");
            let span2 = document.createElement("span");
            let span3 = document.createElement("span");
            span1.appendChild(span2);
            span2.appendChild(span3);
            span3.innerText = assignee;

            span1.className = class1;
            span2.className = class2;
            span3.className = class3;

            link.appendChild(span1);
        });
    }
    time = Date.now() - time;
    if(time > 20) {
        console.warn(`Updating jira links took a long time (${time}ms)`);
    }
}
apply();

setInterval(apply, 5000);