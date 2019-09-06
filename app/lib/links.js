
export function isAbsLink(link) {
    if (link && typeof link === 'string') {
        return link.indexOf('http://') === 0 || link.indexOf('https://') === 0;
    }

    return false;
}

