const ToDo = artifacts.require("ToDo");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("ToDo", function (/* accounts */) {
  it("should assert true", async function () {
    await ToDo.deployed();
    return assert.isTrue(true);
  });

  it("should create new task", async function () {
    let contract = await ToDo.deployed();
    const res = await contract.createTask("FOO");
    assert.equal("TaskCreated", res.logs[0].event);
  });

  it("should get task ids", async function () {
    let contract = await ToDo.deployed();
    const res = await contract.getTaskIds.call();
    assert.equal("1", res.toString());
  });

  it("should get task by id", async function () {
    let contract = await ToDo.deployed();
    const res = await contract.getTask("1");
    assert.equal("1", res[0].toString());
    assert.equal("FOO", res[2]);
    assert.equal(false, res[3]);
  });

  it("should toggle task", async function () {
    let contract = await ToDo.deployed();
    const res = await contract.toggleDone("1");
    assert.equal("TaskStatusToggled", res.logs[0].event);
  });

  it("should be toggled to done", async function () {
    let contract = await ToDo.deployed();
    const res = await contract.getTask("1");
    assert.equal("1", res[0].toString());
    assert.equal("FOO", res[2]);
    assert.equal(true, res[3]);
  });

  it("should be deleted", async function () {
    let contract = await ToDo.deployed();
    const res = await contract.deleteTask("1");
    assert.equal("TaskDeleted", res.logs[0].event);
  });
});
