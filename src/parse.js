const parseChild = (def, child, data) => {
    if (typeof def === 'object') {
        return [def._self, parseChildren(def, child)];
    } else {
        const text = child.children.length === 0 ? '' : child.children[0].text;
        const sub = def.substring(1);

        switch (def.charAt(0)) {
            case '!':
                return [sub, text === '1'];
            case '#':
                return [sub, text === '' ? null : parseInt(text)];
            case '.':
                return [sub, text === '' ? null : parseFloat(text)];
            case '$': {
                // Pad with extra zeros if necessary
                const i = text.includes('.') ? text.length - text.indexOf('.') - 1 : 0;
                const t = text.replace('.', '');
                if (i === 0) {
                    return [sub, parseInt(`${t}00`)];
                } else if (i === 1) {
                    return [sub, parseInt(`${t}0`)];
                }
                return [sub, parseInt(t)];
            }
            case '/':
                return [sub, text === '' ? null : new RegExp(text)];
            case '*':
                return [sub, text === '' ? null : new Date(text)];
            default:
                return [def, text];
        }
    }
};

const parseChildren = (definition, xml) => {
    const data = {};

    if (!xml.children) {
        throw new Error(`XML ${xml.type} "${xml.name}" has no children`);
    }

    for (const child of xml.children) {
        // Skip text children, these are just newlines or spaces
        if (child.type === 'text') {
            continue;
        }

        if (!definition[child.name]) {
            console.log(`Unknown tag: "${child.name}", parent tag: "${xml.name}"`);
        } else {
            const def = definition[child.name];

            if (Array.isArray(def)) {
                const [key, value] = parseChild(def[0], child);

                if (!data[key]) {
                    data[key] = [];
                }
                data[key].push(value);
            } else {
                const [key, value] = parseChild(def, child);
                data[key] = value;
            }
        }
    }

    return data;
};

const parse = (definition, xml) => {
    return parseChildren(definition, xml);
};

export default parse;
