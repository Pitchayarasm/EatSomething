$(document).ready(function () {
    // display menu of the day in homepage
    $.get("/allmenu" , function(data){
        $(".content").empty();
        for(let i = 0; i < Math.ceil(data.length / 3); i++){
            var row = $("<div>").addClass("row");
            for(let j = 0; j < 3 && 3 * i + j < data.length; j++){
                // let id = (3 * i + j)+ 1;
                var col = $("<div>").addClass("col-lg-4");
                var card = $("<div>").addClass("card");
                var cardBody = $("<div>").addClass("card-body");
                var img = $("<img>").attr("src", data[3 * i + j].src).addClass("card-img-top");
                var title = $("<h5>")
                var a = $("<a>").attr("href", data[3 * i + j].link ).text( data[3 * i + j].title );
                title.append(a);
                var button = $("<button>").addClass("save").text("Save");
                cardBody.append(title);
                cardBody.append(button);
                card.append(img);
                card.append(cardBody);
                col.append(card);
                row.append(col);
            }
            $(".content").append(row);
        }
    });

    // save recipes from menu of the day
    $(document).on("click", ".save", function() {
        var title = $(this).siblings().text();
        var link = $(this).siblings().find("a").attr("href");
        var src = $(this).parent().parent().find("img").attr("src");
        var saveRec = {
            title : title,
            link : link,
            src : src
        }
        $.post("/saveRec", saveRec , function(data) {
            if (data) {
                console.log(saveRec);
                $(this).removeClass("save");
                $(this).addClass("saved").text("Saved!");
            }
        }).fail(function(err) {
            alert(err.responseText);
        });
    });

    // click on save recipes button
    $("#saved").click( function() {
        $(".content").empty();
        $("#head").html("<i class='fas fa-star'></i> Your Recipes <i class='fas fa-star'>")
        $.get("/saved" , function(data) {
            for(let i = 0; i < Math.ceil(data.length / 3); i++){
                var row = $("<div>").addClass("row");
                for(let j = 0; j < 3 && 3 * i + j < data.length; j++){
                    let id = data[3 * i + j]._id;
                    var col = $("<div>").addClass("col-lg-4");
                    var card = $("<div>").addClass("card");
                    var cardBody = $("<div>").addClass("card-body");
                    var img = $("<img>").attr("src", data[3 * i + j].src).addClass("card-img-top").attr("data-id",id);
                    var title = $("<h5>")
                    var a = $("<a>").attr("href", data[3 * i + j].link ).text( data[3 * i + j].title ).attr("data-id",id);
                    title.append(a);
                    var button = $("<button>").addClass("note").text("Note").attr("data-id",id).attr("data-toggle","modal").attr("data-target","#noteModal");
                    cardBody.append(title);
                    cardBody.append(button);
                    card.append(img);
                    card.append(cardBody);
                    col.append(card);
                    row.append(col);
                }
                $(".content").append(row);
            }
        })
    });

    $("#home").click( function() {
        window.location = "/";
    })

    $(document).on("click", ".note", function() {
        var id = $(this).attr("data-id");
        $("#saveNote").attr("data-id",id)
        $.get("/addNote/" + id , function(data) {
            console.log(data);
            if (data.notes) {
                $("#day").text(data.notes.day);
                $("#comment").text(data.notes.comment);
            }
        }).fail(function(err) {
            console.log(err)
        });
    });
    
    $(document).on("click", "#saveNote", function() {
        console.log("note")
        var id = $(this).attr("data-id");
        var note = {
            day : $("#day").val(),
            comment : $("#comment").val()
        }
        $.post("/addNote/" + id , note , function(data) {
            console.log(data);
            $("#day").val("");
            $("#comment").val("");
        });
    });
});
