$(document).ready(function() {
    Tabletop.init({
        key: "1lv74SigFdFMJvza_dc2tBVd37r9E4-CPeY9YkRSaBxA",
        callback: showInfo,
        parseNumbers: true
    });
});

var allRows = [];


function showInfo(data, tabletop) {
    allRows = _.sortBy(tabletop.sheets("Completed Detailed Data").all(), "Department");
    filterByDatatype(pageType);
}


function filterByDatatype(datatype) {
    clearCards();
    updateCards(allRows, [buildDatatypeFilter(datatype)]);
}


function clearCards() {
    $("#cards").empty();
}

function buildDatatypeFilter(datatype) {
    if (!datatype) {
        return false;
    }
    return function(row) {
        return row["Type of Data"] === datatype;
    }
}


function updateCards(rows, filters) {
    var filters = filters || [];
    var source = $("#card-template").html();
    var template = Handlebars.compile(source);

    _.chain(rows)
        .filter(function(row) {
            return _.all(filters, function(filter) {
                return filter(row);
            });
        }).map(function(row) {

            var html = template(row);
            $("#cards").append(html);
        });
}