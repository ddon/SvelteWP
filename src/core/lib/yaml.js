import jsyaml from 'js-yaml';


function deleteTags(content) {
    const regex = /(<([^>]+)>)/ig;
    return content.replace(regex, '');
}


export function parseContent(content) {
    if (typeof content !== 'string') {
        return {};
    }

    let txt = deleteTags(content).trim();

    try {
        return jsyaml.load(txt);
    } catch (err) {
        console.log(txt);
        console.log(err);
        return {};
    }
}


