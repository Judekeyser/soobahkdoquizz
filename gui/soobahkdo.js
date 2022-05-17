/**
 * Business knowledge about Soo Bahk Do.
 *
 * Naming convention : words start by non-capital letters.
 */

var allThemes = ["HYUNG", "WORDS", "HISTORY", "MOVEMENTS"];

function isThemeAvailableForRank({ rank, theme }) {
    if(rank.system == "DAN")
        return true;
    if(rank.number <= 6)
        return theme != "HISTORY";
    return theme != "HISTORY" && theme != "HYUNG";
}

function rankToBelt({ number, system }) {
    var color, strips;
    
    if(system == "KUP") {
        color = (function() {
            switch(number) {
                case 10: case 9:        return "WHITE";
                case 8: case 7:         return "ORANGE";
                case 6: case 5: case 4: return "GREEN";
                case 3: case 2: case 1: return "RED";
            }
        })();
        strips = (function() {
            switch(number) {
                case 10: case 8: case 6: case 3:    return 0;
                case 9: case 7: case 5: case 2:     return 1;
                case 4: case 1:                     return 2;
            }
        })();
    } else {
        color = "BLUE";
        strips = number;
    }
    return { color, strips };
}

function beltToRank({ color, strips }) {
    var number, system;
    
    if(color == "BLUE") {
        system = "DAN";
        number = strips;
    } else {
        system = "KUP";
        number = (function() {
            switch(color) {
                case "WHITE":   return 10;
                case "ORANGE":  return 8;
                case "GREEN":   return 6;
                case "RED":     return 3;
            }
        })() - strips;
    }
    return { number, system };
}

function lowerRankOfSystem(system) {
    if(system == "DAN") {
        return {
            system, number: 1
        }
    } else if(system == "KUP") {
        return {
            system, number: 10
        }
    }
}

function numberRangeOfRank({ system }) {
    if(system == "KUP")
        return [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    else if(system == "DAN")
        return [1, 2, 3, 4, 5];
}

function stripsRangeOfBelt({ color }) {
    switch(color) {
        case "WHITE": case "ORANGE": return [0, 1];
        case "RED": case "GREEN": return [0,1,2];
        case "BLUE": return [1,2,3,4,5];
    }
}