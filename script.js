function caesarCipher(text, shift) {

    let result = "";

    for (let i = 0; i < text.length; i++) {

        let char = text[i];

        if (char.match(/[a-z]/i)) {

            let code = text.charCodeAt(i);

            let base =
                code >= 65 && code <= 90 ? 65 : 97;

            char = String.fromCharCode(
                ((code - base + shift) % 26 + 26) % 26 + base
            );
        }

        result += char;
    }

    return result;
}

function encryptText() {

    let text = document.getElementById("text").value;
    let shift = parseInt(document.getElementById("shift").value);

    document.getElementById("result").innerText =
        caesarCipher(text, shift);
}

function decryptText() {

    let text = document.getElementById("text").value;
    let shift = parseInt(document.getElementById("shift").value);

    document.getElementById("result").innerText =
        caesarCipher(text, -shift);
}
