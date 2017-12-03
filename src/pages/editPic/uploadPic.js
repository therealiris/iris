var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { LocalNotifications } from '@ionic-native/local-notifications';
import firebase from 'firebase';
import { OnboardingOne } from '../onboarding1/on1';
var UploadPic = (function () {
    function UploadPic(localNotifications, navCtrl, navParams, camera, transfer, file, filePath, actionSheetCtrl, toastCtrl, platform, loadingCtrl) {
        this.localNotifications = localNotifications;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.camera = camera;
        this.transfer = transfer;
        this.file = file;
        this.filePath = filePath;
        this.actionSheetCtrl = actionSheetCtrl;
        this.toastCtrl = toastCtrl;
        this.platform = platform;
        this.loadingCtrl = loadingCtrl;
        this.lastImage = null;
        this.appUser = this.navParams.data;
        var firebaseConfig = {
            apiKey: "AIzaSyD8WClRJ9k5cFOxFJLR_Eh6ah4wPWX1suE",
            authDomain: "iris-b029c.firebaseapp.com",
            databaseURL: "https://iris-b029c.firebaseio.com",
            projectId: "iris-b029c",
            storageBucket: "iris-b029c.appspot.com",
            messagingSenderId: "1056346035559"
        };
        console.log(this.lastImage);
        firebase.initializeApp(firebaseConfig);
    }
    UploadPic.prototype.presentActionSheet = function () {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Select Image Source',
            buttons: [
                {
                    text: 'Load from Library',
                    handler: function () {
                        _this.takePicture(_this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Use Camera',
                    handler: function () {
                        _this.takePicture(_this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    };
    UploadPic.prototype.takePicture = function (sourceType) {
        var _this = this;
        // Create options for the Camera Dialog
        var options = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        // Get the data of an image
        this.camera.getPicture(options).then(function (imagePath) {
            // Special handling for Android library
            if (_this.platform.is('android') && sourceType === _this.camera.PictureSourceType.PHOTOLIBRARY) {
                _this.filePath.resolveNativePath(imagePath)
                    .then(function (filePath) {
                    var correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                    var currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                    _this.copyFileToLocalDir(correctPath, currentName, _this.createFileName());
                });
            }
            else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                _this.copyFileToLocalDir(correctPath, currentName, _this.createFileName());
            }
        }, function (err) {
            _this.presentToast('Unable to select picture. Try again');
        });
    };
    // Create a new name for the image
    UploadPic.prototype.createFileName = function () {
        var d = new Date(), n = d.getTime(), newFileName = n + ".jpg";
        return newFileName;
    };
    UploadPic.prototype.getBase64Image = function (img) {
        // Create an empty canvas element
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.width;
        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        // Get the data-URL formatted image
        // Firefox supports PNG and JPEG. You could check img.src to
        // guess the original format, but be aware the using "image/jpg"
        // will re-encode the image.
        var dataURL = canvas.toDataURL("image/jpg");
        return dataURL;
    };
    // Copy the image to a local folder
    UploadPic.prototype.copyFileToLocalDir = function (namePath, currentName, newFileName) {
        var _this = this;
        this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function (success) {
            _this.lastImage = newFileName;
        }, function (error) {
            _this.presentToast('Error while storing file.');
        });
    };
    UploadPic.prototype.presentToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    };
    // Always get the accurate path to your apps folder
    UploadPic.prototype.pathForImage = function (img) {
        if (img === null) {
            return '';
        }
        else {
            return cordova.file.dataDirectory + img;
        }
    };
    UploadPic.prototype.uploadFirebase = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'One moment..!! Uploading picture'
        });
        loading.present();
        var img = document.getElementById('userPic');
        var imageStr = this.getBase64Image(img);
        var storageRef = firebase.storage().ref();
        // Create a timestamp as filename
        var filename = Math.floor(Date.now() / 1000);
        // Create a reference to 'images/todays-date.jpg'
        var imageRef = storageRef.child(filename + ".jpg");
        imageRef.putString(imageStr, firebase.storage.StringFormat.DATA_URL).then(function (snapshot) {
            // Do something here when the data is succesfully uploaded!
            // alert("Set your profile picture successfully")
            var pictureUrl = "https://firebasestorage.googleapis.com/v0/b/iris-b029c.appspot.com/o/" + filename + ".jpg?alt=media";
            _this.appUser.pictureUrl = pictureUrl;
            _this.appUser.image = pictureUrl;
            loading.dismiss();
            _this.navCtrl.setRoot(OnboardingOne, _this.appUser, { animate: true, direction: 'forward' });
        });
    };
    return UploadPic;
}());
UploadPic = __decorate([
    Component({
        selector: 'uploadPic',
        templateUrl: 'uploadPic.html'
    }),
    __metadata("design:paramtypes", [LocalNotifications, NavController, NavParams, Camera, Transfer, File, FilePath, ActionSheetController, ToastController, Platform, LoadingController])
], UploadPic);
export { UploadPic };
//# sourceMappingURL=uploadPic.js.map