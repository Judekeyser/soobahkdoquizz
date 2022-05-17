package quizz.themes;

import quizz.xml.XmlElement;

import static java.util.stream.Collectors.toUnmodifiableMap;

import static java.util.function.Function.identity;

class XmlThemeCollection extends ThemeMap {

    XmlThemeCollection(XmlElement themesElement) {
        super(themesElement
                .elementsOfSemantic("theme").stream()
                .map(XmlThemeCollection::themeOfElement)
                .collect(toUnmodifiableMap(Theme::identifier, identity()))
        );
    }

    private static Theme themeOfElement(XmlElement element) {
        var id = element.maybeAttribute("id");
        var frenchSymbol = element.textContent();
        return new Theme(id, frenchSymbol);
    }

}
