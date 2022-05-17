package quizz.themes;

import java.util.Map;

abstract class ThemeMap implements ThemeCollection {

    private final Map<String, Theme> byIdentifiers;
    ThemeMap(Map<String, Theme> byIdentifiers) {
        this.byIdentifiers = byIdentifiers;
    }

    public Theme getTheme(String identifier) {
        return byIdentifiers.get(identifier);
    }

    @Override
    public Iterable<Theme> getThemes() {
        return byIdentifiers.values();
    }

}
