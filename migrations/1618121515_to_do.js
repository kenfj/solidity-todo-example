var ToDo = artifacts.require("ToDo");

module.exports = function (_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(ToDo);
};
