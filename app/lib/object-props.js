
export function getText(pageData) {
    const textCache = {};

    return function(key) {
        if (textCache[key]) {
            return textCache[key];
        }

        const temp = key.split('.');

        let subObj = pageData || {};

        for (let i = 0; i < temp.length; i += 1) {
            const name = temp[i];

            if (typeof subObj !== 'object' || subObj === null) {
                textCache[key] = '';
                return '';
            }

            if (subObj[name]) {
                if (i === temp.length - 1) {
                    textCache[key] = subObj[name];
                    return subObj[name];
                } else {
                    subObj = subObj[name];
                }
            } else {
                textCache[key] = '';
                return '';
            }
        }

        textCache[key] = '';
        return '';
    };
}
