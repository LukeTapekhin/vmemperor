var Reflux = require('reflux'),
    VMActions = require('./vm-actions'),
    AlertActions = require('./alert-actions'),
    VMApi = require('../api/vmemp-api'),
    VM = require('./vm-model');

var VMStore = Reflux.createStore({
  
  init: function() {
    this.listenTo(VMActions.list, this.listVMs);
    this.listenTo(VMActions.start, this.startVM);
    this.listenTo(VMActions.shutdown, this.shutdownVM);
    
    this.status = '';
    this.vms = [];
  },

  length: function() {
    return this.vms.length;
  },

  listVMs: function() {
    this.status = 'PULL';
    AlertActions.log('Getting VM list...');
    this.trigger();
    VMApi.listVMs()
      .then(this.onListCompleted)
      .catch(function(response) {
        VMActions.listFail(response);
        AlertActions.err("Error while getting VM list!");
      });
  },

  onListCompleted: function(response) {
    this.vms = response.data.map(function(single) { return new VM(single); });
    this.status = 'READY';
    AlertActions.suc('Got VM list');
    this.trigger();
  },

  startVM: function(vm) {
    this.status = 'PUSH';
    AlertActions.log('Starting VM:' + vm.name);
    this.trigger();
    VMApi.startVM(vm)
      .then(this.onStartCompleted)
      .catch(function(response) {
        AlertActions.err("Error while starting VM:" + vm.name);
        VMActions.startFail(vm, response);
      });
  },

  onStartCompleted: function(response) {
    AlertActions.suc('VM started');
    VMActions.list(); 
  },

  shutdownVM: function(vm) {
    this.status = 'PUSH';
    AlertActions.log('Shutting down VM:' + vm.name);
    this.trigger();
    VMApi.shutdownVM(vm)
      .then(this.onShutdownCompleted)
      .catch(function(response) {
        AlertActions.err("Error while shutting down VM:" + vm.name);
        VMActions.shutdownFail(vm, response);
      });
  },

  onShutdownCompleted: function(response) {
    AlertActions.suc('VM shutdown');
    VMActions.list(); 
  }

});

module.exports = VMStore;
