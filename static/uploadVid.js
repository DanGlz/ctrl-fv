var app = angular.module('myApp');
var server = app.config['server'];

// Formate Date to DDMMYYYY_HHMM format
Date.prototype.idFormat = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [(dd > 9 ? '' : '0') + dd,
        (mm > 9 ? '' : '0') + mm,
        this.getFullYear()
    ].join('') + '_' + this.getHours() + this.getMinutes();
};

app.controller('uploadVidCtrl', ['$http', '$scope', '$interval', 'upload', 'userService', function ($http, $scope, $interval, upload, userService) {
    var ctrl = this;
    ctrl.isUploading = false;
    ctrl.storageUrl = 'https://cfvtes9c07.blob.core.windows.net';
    ctrl.serverUrl = server + '/videoData';

    $scope.validateVidFile = function (element) {
        $scope.$apply($scope.validateFile(".mp4", element));
    };
    $scope.validateFile = function (fileExtension, element) {
        $scope.theFile = element.files[0];
        var FileMessage = '';
        var filename = $scope.theFile.name;
        var index = filename.lastIndexOf(".");
        var strsubstring = filename.substring(index, filename.length);
        if (strsubstring !== fileExtension)
        {
            $scope.theFile = '';
            FileMessage = 'Please upload correct File, File extension should be ' + fileExtension;
        }
        else
        {
            $scope.FileMessage = '';
        }
        if (fileExtension === ".mp4")
        {
            $scope.VideoFileMessage = FileMessage;
        }
        if (fileExtension === ".txt")
        {
            $scope.TranscriptFileMessage = FileMessage;
        }

    };

    ctrl.doUpload = function () {
        ctrl.progress = 0;

        function refreshProgress()
        {
            $interval(function () {
                if (ctrl.isUploading)
                {
                    var progress = speedSummary.getCompletePercent();
                    ctrl.progress = Math.ceil(progress);
                }
                else
                    $interval.cancel();
            }, 1000);
        }

        // If one file has been selected in the HTML file input element
        var file = ctrl.vidArray[0];
        var currentTime = new Date();
        var videoID = ctrl.videoName + '_' + currentTime.idFormat() + '.mp4';
        var req_body = {
            videoID: videoID,
            videoName: ctrl.videoName,
            videoDescription: ctrl.videoDescription,
            user: userService.User.email
        };

        var sas = '?sv=2017-07-29&ss=b&srt=sco&sp=rwac&se=2018-03-20T18:02:46Z&st=2018-03-20T10:02:46Z&spr=https&sig=YVrkCOS7ynYhLTG2GBJjEhUH9ff1%2FPPQ1rlhWhxnLvM%3D';
        var blobService = AzureStorage.Blob.createBlobServiceWithSas(ctrl.storageUrl, sas);
        var customBlockSize = file.size > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
        blobService.singleBlobPutThresholdInBytes = customBlockSize;
        ctrl.isUploading = true;
        
        var speedSummary = blobService.createBlockBlobFromBrowserFile('videoscontainer', videoID, file, {blockSize: customBlockSize}, function (error, result, response) {
            if (error)
                window.alert(error);
            else
                $http.post(ctrl.serverUrl, req_body).then(function () {
                    ctrl.isUploading = false;
                    window.alert('Finished Upload!');
                }, function (reason) {
                    window.alert(reason);
                });
        });
        refreshProgress();
    }
}]);