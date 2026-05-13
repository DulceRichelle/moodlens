import es from "../locales/es.js";
import en from "../locales/en.js";
import fr from "../locales/fr.js";
import de from "../locales/de.js";

const languages = {
    es,
    en,
    fr,
    de
};

let currentLanguage =
    localStorage.getItem("language") || "es";

export function setLanguage(lang) {

    if (!languages[lang]) {
        return;
    }

    currentLanguage = lang;

    localStorage.setItem(
        "language",
        lang
    );

    window.location.reload();
}

export function t(key) {

    return (
        languages[currentLanguage]?.[key] ||

        languages.es?.[key] ||

        key
    );
}

export function getLanguage() {

    return currentLanguage;
}