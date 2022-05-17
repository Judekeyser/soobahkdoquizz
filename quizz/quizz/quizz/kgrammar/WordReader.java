package quizz.kgrammar;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Objects;

abstract class WordReader<SourceType, ElementType> {

    protected class WordDictionary {
        final private HashMap<String, ElementType> elements = new HashMap<>();

        ElementType maybe(String identifier) {
            return elements.getOrDefault(identifier, null);
        }

        void store(String identifier, ElementType element) {
            assert identifier != null;
            assert element != null;
            assert ! elements.containsKey(identifier) || elements.get(identifier) == element;
            elements.put(identifier, element);
        }
    }

    protected abstract class Word {
        final Word[] children;
        protected Word(Word[] children) {
            assert children != null;
            this.children = children;
        }

        abstract void maybeIdentifyInto(WordDictionary dictionary);

        boolean resolve(WordDictionary dictionary) {
            assert Arrays.stream(children).noneMatch(Objects::isNull);
            boolean allResolved = true;
            for (Word child : children)
                allResolved &= child.resolve(dictionary);

            if(allResolved) {
                maybeIdentifyInto(dictionary);
                return true;
            }
            return false;
        }
    }

    private final WordDictionary dictionary = new WordDictionary();
    private final ArrayDeque<ElementType> elementsToProcess = new ArrayDeque<>();

    protected void increment() {

    }

}
