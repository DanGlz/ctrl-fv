var app = angular.module('myApp');

app.controller('watchVidCtrl', ['$http', '$scope', function ($http, $scope)
{
    var ctrl = this;
    ctrl.hello = 'watchVidCtrl is up';
    $scope.search_results = [
        {startTime: 10, paragraph:"hello shaked hazon"},
        {startTime: 30, paragraph:"hello ron michaeli "},
        {startTime: 20, paragraph:"hello dan gleyzer "},
        {startTime: 250, paragraph:"hello Adam Zamri"}
    ];
    $scope.jump = function(res) {
            var video = document.getElementById("currentVideo");
            video.currentTime = res.startTime;
    };
    ctrl.currentVideoPath = "https://cfvtes9c07.blob.core.windows.net/videoscontainer/ClimateChange.mp4";

}]);
app.filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}])
app.filter("trustUrl", ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
    }]);