(function() {
    function PlayerState({ children }) {
        var [rank, setRank] = React.useState(lowerRankOfSystem("KUP"));
        var handleRankChange = React.useCallback(_rank => {
            if(_rank.system != rank.system || _rank.number != rank.number)
                setRank(_rank);
        }, [rank]);
        
        return children(({ rank, handleRankChange }));
    }

    function GameConfigState({ rank, children }) {
        var [userThemeChoices, setUserThemeChoices] = React.useState(new Set());
        
        var themesMenu = React.useMemo(() => {
            var menu = {};
            for(let theme of allThemes)
                menu[theme] = {
                    isAvailable: isThemeAvailableForRank({ rank, theme }),
                    isSelected: userThemeChoices.has(theme)
                }
            return menu;
        }, [userThemeChoices, rank]);
        
        var handleThemeTriggerHoF = React.useCallback(theme => {
            if(! themesMenu[theme].isAvailable) return;
            
            return () => {
                if(userThemeChoices.has(theme))
                    var newThemes = [...userThemeChoices].filter(t => t != theme);
                else var newThemes = [...userThemeChoices, theme];
                
                setUserThemeChoices(new Set(newThemes));
            }
        }, [themesMenu, userThemeChoices, setUserThemeChoices])
        
        return children({ themesMenu, handleThemeTriggerHoF });
    }

    function Progression() {
        this.screen = "INITIAL";
    }; Progression.prototype = {
        cancelled: function() {
            var newProgression = this.__copy();
            newProgression.screen = "CANCEL_SCREEN";
            return newProgression;
        },
        started: function(totalQuestion) {
            var newProgression = new Progression();
            newProgression.screen = "DISPLAY_QUESTION";
            newProgression.score = 0;
            newProgression.currentQuestionIndex = 0;
            newProgression.answersCount = 0;
            newProgression.totalQuestion = totalQuestion;
            return newProgression;
        },
        succeeded: function() {
            var newProgression = this.__copy();
            newProgression.screen = "SUCCESS_SCREEN";
            newProgression.score += 1;
            newProgression.answersCount += 1;
            return newProgression;
        },
        failed: function() {
            var newProgression = this.__copy();
            newProgression.screen = "FAILURE_SCREEN";
            newProgression.answersCount += 1;
            return newProgression;
        },
        moved: function() {
            var newProgression = this.__copy();
            newProgression.currentQuestionIndex += 1;
            if(newProgression.currentQuestionIndex == newProgression.totalQuestion) {
                newProgression.screen = "TERMINAL_SCREEN";
            } else {
                newProgression.screen = "DISPLAY_QUESTION";
            }
            return newProgression;
        },
        inActiveGame: function() {
            var screen = this.screen;
            return !(
                screen == "INITIAL" ||
                screen == "CANCEL_SCREEN" ||
                screen == "TERMINAL_SCREEN"
            );
        },
        getPercentageScore: function() {
            return this.answersCount && Math.round(this.score * 100_00.0 / this.answersCount) / 100
        },
        getProgressionRate: function() {
            return this.totalQuestion && Math.round(this.answersCount * 100_00.0 / this.totalQuestion) / 100
        },
        __copy: function() {
            var newProgression = new Progression();
            newProgression.score = this.score;
            newProgression.currentQuestionIndex = this.currentQuestionIndex;
            newProgression.totalQuestion = this.totalQuestion;
            newProgression.screen = this.screen;
            newProgression.answersCount = this.answersCount;
            return newProgression;
        }
    }

    function GameStateMoveAction({ selectedThemesMenu, progression, handleNewProgression, children }) {
        var isSelectionTooSmall = React.useMemo(() => selectedThemesMenu.length == 0, [selectedThemesMenu]);
        
        var action = React.useMemo(() => {
            switch(progression.screen) {
                case "INITIAL":
                    return !isSelectionTooSmall && (() => handleNewProgression(progression.started(3)))
                case "DISPLAY_QUESTION":
                    return () => {
                            if(Math.random() < 0.5) {
                                var nextProgression = progression.succeeded();
                            } else {
                                var nextProgression = progression.failed();
                            }
                            
                            handleNewProgression(nextProgression);
                        }
                case "SUCCESS_SCREEN":
                case "FAILURE_SCREEN":
                    return () => handleNewProgression(progression.moved())
                case "TERMINAL_SCREEN":
                case "CANCEL_SCREEN":
                    return () => handleNewProgression(new Progression());
            }
        }, [progression, isSelectionTooSmall]);
        
        return children({ action, isSelectionTooSmall });
    }

    function GameStateCancelAction({ progression, handleNewProgression, children }) {
        var cancelAction = React.useMemo(() => {
            if(progression.inActiveGame()) {
                return () => handleNewProgression(progression.cancelled())
            }
        }, [progression])
        
        return children({ action: cancelAction });
    }

    function GameStateScoreBoard({ progression, children }) {
        var currentQuestionIndex = progression.currentQuestionIndex + 1;
        var questionCount = progression.totalQuestion;
        var inActiveGame = progression.inActiveGame;
        
        return children({ questionCount, currentQuestionIndex, inActiveGame })
    }

    function GameState({ themesMenu, children }) {
        var [questions, setQuestions] = React.useState();
        var [progression, setProgression] = React.useState(new Progression());
        
        var selectedThemesMenu = React.useMemo(() => {
            var selectedThemesMenu = [];
            for(let theme in themesMenu) {
                let menu = themesMenu[theme];
                if(menu.isSelected && menu.isAvailable) {
                    selectedThemesMenu.push({
                        theme,
                        ...menu
                    });
                }
            }
            return selectedThemesMenu;
        }, [themesMenu])
        
        return children({
            progression,
            handleNewProgression: setProgression,
            selectedThemesMenu
        });
    }

    function App() {
        return $(PlayerState)(_, ({ rank, handleRankChange }) => [
            $(RankFormProxy)({ rank, handleRankChange }),
            $(BeltFormProxy)({ rank, handleRankChange }),
            $(GameConfigState)({ rank }, ({ themesMenu, handleThemeTriggerHoF }) => [
                $(ThemesFormProxy)({ themesMenu, handleThemeTriggerHoF }),
                $(GameState)({ themesMenu }, ({ progression, questions, handleNewProgression, selectedThemesMenu }) => [
                    $(GameStateMoveAction)({ selectedThemesMenu, progression, handleNewProgression },
                        ({ action, isSelectionTooSmall }) => [
                            $(QuizzEmitButtonProxy)({ screen: progression.screen, action }),
                            $(QuizzPanelProxy)({ progression, isSelectionTooSmall })
                        ]
                    ),
                    $(GameStateCancelAction)({ progression, handleNewProgression },
                        ({ action }) => $(QuizzCancelButtonProxy)({ action })
                    ),
                    $(QuizzScoreBoardProxy)({ page: progression.currentQuestionIndex+1, totalQuestion: progression.totalQuestion, display: progression.inActiveGame() })
                ])
            ])
        ])
    }

    $display($(App)(_))
})();