/**
 * Graphical User Interface components
 *
 * Naming convention : words start with capital letters and are suffixed by "Proxy".
 *      Components of this file should all be proxies (see Octopus Pattern)
 *
 * Note: memoization and state requirements are low in those componentss,
 *      as they are hydrated by the state tree.
 */
 
var RankFormProxy = $Proxy("rank-config-panel", ({ rank, handleRankChange }) => {
    function handleSystemChange(e) {
        var system = e.target.value;
        handleRankChange(lowerRankOfSystem(system));
    }
    function handleNumberChange(e) {
        var number = parseInt(e.target.value);
        handleRankChange({ ...rank, number });
    }
    
    var range = numberRangeOfRank(rank);

    return $("div")(_, [
        $("select")({
            value: rank.number,
            onChange: handleNumberChange
        }, range.map(i => $("option")({ value: i }, i))),
        $("select")({
            value: rank.system,
            onChange: handleSystemChange
        }, [
            $("option")({ value: "KUP" }, "Kup"),
            $("option")({ value: "DAN" }, "Dan")
        ])
    ])
})

var BeltFormProxy = $Proxy("belt-config-panel", ({ rank, handleRankChange }) => {
    var belt = rankToBelt(rank);
    var stripsRange = stripsRangeOfBelt(belt);

    function handleBeltColorChange(e) {
        var color = e.target.value;
        if(color == "BLUE") {
            handleRankChange(lowerRankOfSystem("DAN"))
        } else {
            handleRankChange(beltToRank({
                color,
                strips: 0
            }))
        }
    }
    function handleBeltStripsChange(e) {
        var strips = parseInt(e.target.value);
        handleRankChange(beltToRank({...belt, strips }));
    }

    return $("div")(_, [
        $("select")({
            value: belt.color,
            onChange: handleBeltColorChange
        }, [
            $("option")({ value: "WHITE" }, "Blanche"),
            $("option")({ value: "ORANGE" }, "Orange"),
            $("option")({ value: "GREEN" }, "Verte"),
            $("option")({ value: "RED" }, "Rouge"),
            $("option")({ value: "BLUE" }, "Bleue")
        ]),
        $("select")({
            value: belt.strips,
            onChange: handleBeltStripsChange
        }, stripsRange.map(i => $("option")({ value: i }, i)))
    ])
});

var ThemesFormProxy = $Proxy("theme-config-panel", ({ themesMenu, handleThemeTriggerHoF }) => {

    function elementClassName(theme) {
        var { isSelected, isAvailable } = themesMenu[theme];
        return [
            isSelected ? "isSelected" : "",
            !isAvailable ? "isNotAvailable" : ""
        ].filter(clz => !!clz).join(" ")
    }
    
    function elementDisplay(theme) {
        switch(theme) {
            case "HYUNG": return "Formes";
            case "WORDS": return "Vocabulaire";
            case "HISTORY": return "Histoire";
            case "MOVEMENTS": return "Mouvements";
        }
    }

    return $("ul")(_, Object.keys(themesMenu).map(theme => $("li")({
        className: elementClassName(theme),
        onClick: handleThemeTriggerHoF(theme)
    }, elementDisplay(theme))))
});

var Button = ({ action, textDisplay }) => {
    return $("button")({
        onClick: !!action ? (() => action()) : undefined,
        disabled: !action
    }, textDisplay)
};

var QuizzPanelProxy = $Proxy("quizz-panel-control", ({ progression, isSelectionTooSmall }) => {
    switch(progression.screen) {
        case "INITIAL":
            if(isSelectionTooSmall) {
                return $("p")(_, [
                    "La sélection n'est pas suffisamment grande pour créer un quizz:",
                    $("br")(),
                    "Sélectionne plus de thèmes"
                ])
            } else {
                return $("p")(_, "Commence un quizz !")
            }
        case "DISPLAY_QUESTION":
            return $("p")(_, "[Voici une question très difficile à résoudre]")
        case "SUCCESS_SCREEN":
            return $("p")(_, "Bingo, bien joué !")
        case "FAILURE_SCREEN":
            return $("p")(_, "Oh non, domage...")
        case "TERMINAL_SCREEN":
            return [
                $("p")(_, "Le jeu est fini"),
                $("p")(_, `Ton score est de ${progression.getPercentageScore()}%`)
            ];
        case "CANCEL_SCREEN":
            return [
                $("p")(_, "Le jeu est annulé"),
                $("p")(_, `Ton score était de ${progression.getPercentageScore()}%`),
                $("p")(_, `Tu avais répondu à ${progression.getProgressionRate()}% des questions du quizz`)
            ]
    }
});

var QuizzEmitButtonProxy = $Proxy("quizz-emitter-control", ({ action, screen }) => {
    switch(screen) {
        case "INITIAL":
            var textDisplay = "Jouer !"; break
        case "DISPLAY_QUESTION":
            var textDisplay = "Valider mon choix"; break
        case "SUCCESS_SCREEN":
        case "FAILURE_SCREEN":
            var textDisplay = "Continuer"; break
        case "TERMINAL_SCREEN":
        case "CANCEL_SCREEN":
            var textDisplay = "Terminer"; break
    }
    
    return $(Button)({ textDisplay, action })
});
var QuizzCancelButtonProxy = $Proxy("quizz-cancel-control", ({ action }) => {
    return $(Button)({ action, textDisplay: "Annuler le quizz" })
});
var QuizzScoreBoardProxy = $Proxy("quizz-score-control", ({ page, totalQuestion, display }) => {
    if(!display)
        return $("span")(_, "/")
    return $("span")(_, `${page}/${totalQuestion}`);
});