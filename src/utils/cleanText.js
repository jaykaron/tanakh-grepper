const chain = (res) => {
    return {
        then: (func) => chain(func(res)),
        finish: () => res
    };
}

/**
 * 
 * @param {string} passukIn 
 * @returns {string} The cleaned passuk
 */
export function cleanPassuk(passukIn) {
    return chain(passukIn)
        .then(removeKriKtiv)
        .then(removeDashes)
        .then(removeHiddenChars)
        .finish()
}

/**
 * 
 * @param {string} passukIn 
 * @returns {string}
 */
function removeKriKtiv(passukIn) {
    if (!passukIn.includes("[")) {
        return passukIn;
    }
    return passukIn.replaceAll(/ \[.+?\]/g, "");
}

/**
 * 
 * @param {string} passukIn 
 * @returns {string}
 */
function removeDashes(passukIn) {
    if (!passukIn.includes("־")) {
        return passukIn;
    }
    return passukIn.replaceAll("־", " ");
}

function removeHiddenChars(passukIn) {
    return passukIn.replaceAll(/[^א-ת ]/g, "");
}