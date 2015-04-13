var form;
var fileSelect;
var uploadButton;
var image = new Image();
var maxwidth= 630;
var maxheight=500;
var percent = 0;
var selectedColor = false;
var hex;
var savedHex;
$(document).ready(function() {
    form = document.getElementById('imageForm');
    fileSelect = document.getElementById('imageUpload');
    uploadButton = document.getElementById('submit');

    form.onsubmit = function(event) {
        event.preventDefault();

        // Update button text.
        uploadButton.innerHTML = 'Uploading...';

        // Get the selected files from the input.
        var files = fileSelect.files;

        // Create a new FormData object.
        var formData = new FormData();

        // Loop through each of the selected files.
        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            // Check the file type.
            if (!file.type.match('image.*')) {
                continue;
            }

            // Add the file to the request.
            formData.append('photos', file, file.name);
        }

        // Set up the request.
        var xhr = new XMLHttpRequest();

        // Open the connection.
        xhr.open('POST', 'uploadImage.php', true);

        // Set up a handler for when the request finishes.
        xhr.onload = function () {
            if (xhr.status === 200) {
                // File(s) uploaded.
                uploadButton.innerHTML = 'Upload';
                image.src = "uploads/" + xhr.responseText;
            } else {
                alert('An error occurred!');
            }
        };

        // Send the Data.
        xhr.send(formData);
    };

    $('#imageCanvas').mousemove(function(e) {
        var pos = findPos(this);
        var x = e.pageX - pos.x;
        var y = e.pageY - pos.y;
        var c = this.getContext('2d');
        var p = c.getImageData(x, y, 1, 1).data;
        hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        $('#hoverColor').css("background-color", hex);
    });

    $('#imageCanvas').click(function(e) {
        selectedColor = true;
        savedHex = hex;
        $('#pickedColor').css("background-color", savedHex);
        getTrio();
        getTetrad();
        getPastel();
        getGrad();
    });
});

image.onload = function() {
    var width=image.width;
    var height=image.height;
    if(image.width>=image.height){
        if(image.width>maxwidth){
            width = maxwidth;
            percent= width/image.width;
            height=Math.floor(image.height*percent);
        }
    }
    else{
        if(image.height>maxheight){
            height = maxheight;
            percent= height/image.height;
            width=Math.floor(image.width*percent);
        }
    }
    var canvas = document.getElementById("imageCanvas");
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext("2d");
    context.drawImage(image, 0, 0,width, height);
};

function getTrio(){
    var color = new KolorWheel(savedHex);
    $("#trio1").css("background-color", color.getHex());
    var color2 = new KolorWheel(color);
    color2.h -= 120;
    $("#trio2").css("background-color", color2.getHex());
    var color3 = new KolorWheel(color);
    color3.h += 120;
    $("#trio3").css("background-color", color3.getHex());
}

function getTetrad(){
    var color = new KolorWheel(savedHex);
    $("#tetrad1").css("background-color", color.getHex());
    var color2 = new KolorWheel(color);
    color2.h += 180;
    $("#tetrad2").css("background-color", color2.getHex());
    var color3 = new KolorWheel(color2);
    color3.h += 30;
    $("#tetrad3").css("background-color", color3.getHex());
    var color4 = new KolorWheel(color2);
    color4.h -= 30;
    $("#tetrad4").css("background-color", color4.getHex());
}

function getPastel(){
    var color = new KolorWheel(savedHex);
    var color2 = new KolorWheel(color);
    color2.h -= 40;
    color2.l += 20;
    $("#pastel2").css("background-color", color2.getHex());
    var color3 = new KolorWheel(color2);
    color3.h += 40;
    $("#pastel3").css("background-color", color3.getHex());
    var color4 = new KolorWheel(color3);
    color4.h += 40;
    $("#pastel4").css("background-color", color4.getHex());
    var color5 = new KolorWheel(color4);
    color5.h += 40;
    $("#pastel5").css("background-color", color5.getHex());
}

function getGrad(){
    var color = new KolorWheel(savedHex);
    color.l=30;
    $("#grad1").css("background-color", color.getHex());
    var color2 = new KolorWheel(color);
    color2.l += 10;
    $("#grad2").css("background-color", color2.getHex());
    var color3 = new KolorWheel(color2);
    color3.l += 10;
    $("#grad3").css("background-color", color3.getHex());
    var color4 = new KolorWheel(color3);
    color4.l += 10;
    $("#grad4").css("background-color", color4.getHex());
    var color5 = new KolorWheel(color4);
    color5.l += 10;
    $("#grad5").css("background-color", color5.getHex());
    var color6 = new KolorWheel(color5);
    color6.l += 10;
    $("#grad6").css("background-color", color6.getHex());
}

function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}