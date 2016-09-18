(function() {
    var NatashaEndpoint = 'http://natasha-playground.herokuapp.com/api/extract';
    var GrammarsClasses = {
        Person: 'person',
        Organisation: 'org',
        Geo: 'geo',
        Date: 'date',
        Money: 'money',
        Event: 'event',
        Brand: 'brand',
    };
    var form = document.forms[0].addEventListener('submit', function(e) {
        e.preventDefault();
        var request = new XMLHttpRequest(),
            text = this.text.value
            offset = 0;
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                var matches = JSON.parse(request.responseText),
                    originals = [];
                for (var i = matches.length - 1; i >= 0; i--) {
                    var grammar = matches[i].grammar,
                        tokens = matches[i].match;
                    var position = [tokens[0][2][0], tokens[tokens.length - 1][2][1]];
                    var original = text.substring(position[0], position[1]);
                    originals.push([grammar, original, position]);
                };
                for (var i = originals.length - 1; i >= 0; i--) {
                    var original = originals[i][1],
                        grammar = originals[i][0];
                    text = text.replace(original, '<span class="' + GrammarsClasses[grammar] + '">' + original + '</span>');
                };
                document.getElementById("result").innerHTML = text;
            }
        };
        request.open("POST", NatashaEndpoint, true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("text=" + text);
    });
        })();
