angular.module('Triangulator', ['angularFileUpload']);

app = angular.module('Triangulator');

app.controller('MainCtrl', function($scope, $element, $attrs) {
    var elem = document.getElementById('delaunay');

    $scope.original = {
        image: 'img/base.jpg',
        algorithm: 'yape06',

        yapeLaplacian: 50,
        yapeMineigen: 120,

        yapeRadius: 2,

        fastTreshold: 15,

        rawImage: null,

        size: 720
    };

    $scope.process = angular.copy($scope.original);

    $scope.$watch('process', function(newVal, oldVal) {
        $scope.update(newVal);
    }, true);

    $scope.restart = function restart() {
        $scope.process = angular.copy($scope.original);
    };

    $scope.update = function update(process) {
        $scope.image = triangulator(elem, $scope.process); 
    };

    $scope.onFileSelect = function($files) {
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];

            $scope.process.rawImage = file;
        }
    };
    $scope.onDownload = function($event, fileType) {
        downloadCanvas($event.currentTarget, elem, $scope.image.triangles, 'delaunay', fileType);
    }

    $scope.image = triangulator(elem, $scope.process);
});


function downloadCanvas(link, canvas, triangles, filename, fileType) {
    if (fileType == 'png') {
        link.href = canvas.toDataURL();
        
    } else {
        size = {width: canvas.width, height: canvas.height};
        svgString = getSVG(triangles, size);
        var blob = new Blob( [ svgString ], { type: 'image/svg+xml' } );
        link.href = window.URL.createObjectURL( blob );
       
    }
    link.download = filename + "." + fileType;
}

function getSVG( triangles, size ) {
    var triangle_keys = [ 'a', 'b', 'c' ];
    var svg = '';

    svg += '<?xml version="1.0" standalone="yes"?>';
    svg += '<svg ';
    svg += 'width="' + size.width + 'px" ';
    svg += 'height="' + size.height + 'px" ';
    svg += 'xmlns="http://www.w3.org/2000/svg" version="1.1">';

    for ( var i = 0; i < triangles.length; i++ )
    {
        var triangle = triangles[i];
        var points = [ ];

        for ( var j = 0; j < triangle_keys.length; j++ )
        {
            var key = triangle_keys[j];
            points[j] = triangle[key].x + ',' + triangle[key].y;
        }

        svg += '<polygon ';
        svg += 'points="' + points.join( ' ' ) + '" ';
        svg += 'fill="' + triangle.color + '" ';
        svg += '/>';
    }

    svg += '</svg>';

    return svg;
}
/** 
 * The event handler for the link's onclick event. We give THIS as a
 * parameter (=the link element), ID of the canvas and a filename.
 */
// document.getElementById('download').addEventListener('click', function() {
//     downloadCanvas(this, 'canvas', 'delaunay', 'svg');
// }, false);
