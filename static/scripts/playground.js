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

    var ExtractEndpoint = 'https://natasha.b-labs.pro/api/extract',
        VersionEndpoint = 'https://natasha.b-labs.pro/api/version',
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
            container = document.getElementById('display'),
            text = container.textContent.replace(/\n/g, ' '),
            button = this;
        button.className = button.className.replace('button-default', 'button-disabled');
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                var matches = JSON.parse(request.responseText)
                    resultHTML = text.substring(0);
                matches.sort(function(a, b){
                    if(a.span[1] - a.span[0] < b.span[1] - b.span[0]) return -1;
                    if(a.span[1] - a.span[0] > b.span[1] - b.span[0]) return 1;
                    return 0;
                });
                for (var i = matches.length - 1; i >= 0; i--) {
                    var match = matches[i],
                        start = match.span[0],
                        finish = match.span[1],
                        replacement = text.substring(start, finish),
                        result = '<pre data-entity="name">' + replacement + '</pre>';
                    resultHTML = resultHTML.replace(replacement, result);
                };
                container.innerHTML = resultHTML;
            };
            button.className = button.className.replace('button-disabled', 'button-default');
        };
        request.open('POST', ExtractEndpoint, true);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send('text=' + encodeURIComponent(text));
    });
})();
