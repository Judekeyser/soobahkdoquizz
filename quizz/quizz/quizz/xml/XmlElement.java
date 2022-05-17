package quizz.xml;

import org.w3c.dom.Element;

import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

public record XmlElement(Element element) {

    public String semantic() {
        return element.getTagName();
    }

    public String maybeAttribute(String attributeName) {
        return element.hasAttribute(attributeName) ? element.getAttribute(attributeName) : null;
    }

    public List<XmlElement> elementsOfSemantic(String tagName) {
        var nodeList = element.getElementsByTagName(tagName);
        return IntStream.range(0, nodeList.getLength())
                .mapToObj(nodeList::item)
                .map(Element.class::cast)
                .map(XmlElement::new)
                .toList();
    }

    public Optional<XmlElement> elementOfSemantic(String tagName) {
        var elements = elementsOfSemantic(tagName);
        assert elements.size() <= 1;
        return elements.isEmpty() ? Optional.empty() : Optional.of(elements.get(0));
    }

    public String textContent() {
        return element.getTextContent();
    }

}
