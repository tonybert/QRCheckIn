function ApplicationViewModel() {
  var self = this;

  this.mode = ko.observable("settings");

  this.mockScannerViewModel = new MockScannerViewModel();
  this.scannerServices = new ScannerServices(this.mockScannerViewModel);


  this.qrCheckInServices = new QRCheckInServices();
  this.settingsPageViewModel = new SettingsViewModel(this.qrCheckInServices, this.scannerServices);
  this.scanViewModel = new ScanViewModel(this.settingsPageViewModel, this.qrCheckInServices, this.scannerServices);
  this.searchPageViewModel = new SearchPageViewModel(this.settingsPageViewModel, this.qrCheckInServices);

  this.inScanMode = ko.dependentObservable(function () {
    return this.mode() == "scan";
  }, this);

  this.inSettingsMode = ko.dependentObservable(function () {
    return this.mode() == "settings";
  }, this);

  this.inSearchMode = ko.dependentObservable(function () {
    return this.mode() == "search";
  }, this);


  this.setSettingsMode = function() {
    if (this.qrCheckInServices.isMakingRequest()) {
      return false;
    }
    this.mode("settings");
  }

  this.setScanMode = function() {
    if (!this.settingsPageViewModel.validateHasEvent() || this.qrCheckInServices.isMakingRequest()) {
      return false;
    }
    this.mode("scan");
    this.scanViewModel.updateStatistics();
  }

  this.setSearchMode = function() {
    if (this.qrCheckInServices.isMakingRequest()) {
      return false;
    }
    this.mode("search");

  }
}
