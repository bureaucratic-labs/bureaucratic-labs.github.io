(function() {

    String.prototype.escape = function() {
        var tagsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };
        return this.replace(/[&<>]/g, function(tag) {
            return tagsToReplace[tag] || tag;
        });
    };

    var ExtractEndpoint = 'https://natasha-playground.herokuapp.com/api/extract',
        VersionEndpoint = 'https://natasha-playground.herokuapp.com/api/version',
        StartAnalysisButton = document.getElementById('start-analysis');

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var element = document.getElementById('version');
                versions = JSON.parse(request.responseText);
            element.innerHTML = versions.yargy + ' / ' + versions.natasha;
        };
    };
    request.open('GET', VersionEndpoint, true);
    request.send();

    StartAnalysisButton.addEventListener('click', function(e) {
        e.preventDefault();
        var request = new XMLHttpRequest(),
            container = document.getElementById('display')
            text = container.textContent.replace(/\n/g, ' '),
            button = this;
        button.className = button.className.replace('button-default', 'button-disabled');
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                var matches = JSON.parse(request.responseText),
                    replaced = [],
                    ents = [];

                console.log(matches);

                for (var i = matches.length - 1; i >= 0; i--) {
                    var grammar = matches[i].grammar,
                        tokens = matches[i].tokens;
                    var position = [tokens[0].position[0], tokens[tokens.length - 1].position[1]];
                    var original = text.substring(position[0], position[1]);
                    ents.push({
                        type: grammar,
                        start: position[0],
                        end: position[1],
                        text: original,
                    });
                }

                for (var i = ents.length - 1; i >= 0; i--) {
                    if (replaced.indexOf(ents[i].text) === -1) {
                        replaced.push(ents[i].text);
                        console.log(ents[i].type);
                        text = text.split(ents[i].text).join('<mark data-entity="' + ents[i].type.toLowerCase().replace('probabilistic', '') + '">' + ents[i].text + '</mark>');
                    };
                };

                container.innerHTML = text;
                button.className = button.className.replace('button-disabled', 'button-default');
            };
        };
        request.open('POST', ExtractEndpoint, true);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send('text=' + encodeURIComponent(text));
    });
})();
