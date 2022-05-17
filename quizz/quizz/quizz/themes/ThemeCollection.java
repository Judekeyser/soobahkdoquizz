package quizz.themes;

import quizz.xml.XmlElement;

public interface ThemeCollection {

    Theme getTheme(String identifier);

    Iterable<Theme> getThemes();

    static ThemeCollection ofResource(XmlElement themesElement) {
        return new XmlThemeCollection(themesElement);
    }

}
