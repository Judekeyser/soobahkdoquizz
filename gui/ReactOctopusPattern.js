var _ = undefined;

/**
    A convenient method to create a dummy DOM element within which
    the React tree state will be injected.
    
    The tree doesn't render anything (Octopus pattern), hence the styling of
    the element is not important.
*/
var $display = any => {
    var rootElement = document.createElement("div");
    rootElement.setAttribute("data-identifier", "Ghost Zone");
    document.body.appendChild(rootElement);
    var rootElement = ReactDOM.createRoot(rootElement);
    
    rootElement.render(any);
};

/**
    Proxy wrapper for the Octopus Pattern.
*/
var $Proxy = (id, component) => {
    var element = document.getElementById(id);
    var root = ReactDOM.createRoot(element);
    
    function render(any) {
        element.classList.remove("muted-off");
        return root.render(any);
    }
    function mute() {
        element.classList.add("muted-off");
    }
    
    return props => {
        var previousProps = React.useRef();
        React.useEffect(() => {
            var _previous = previousProps.current;
            checkAnyChange: {
                if(!_previous || !props)
                    break checkAnyChange;

                for(let property in _previous)
                    if(props[property] !== _previous[property])
                        break checkAnyChange;
                for(let property in props)
                    if(props[property] !== _previous[property])
                        break checkAnyChange;
                
                return;
            }

            previousProps.current = props;
        
            if(!props || props._proxy_mute) {
                console.log("Muting off", id);
                mute();
            } else {
                var newProps = {...props}; delete newProps.children;
                
                console.log("Rendering in", id);
                render($(component)(newProps, props.children))
            }
        }, [props]);
    }
}

var $ = type => ((props, content) => React.createElement(type, props, content));