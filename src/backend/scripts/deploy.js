async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  const CASINO = await ethers.getContractFactory("Casino");
  const casino = await CASINO.deploy("0xF978bAa68aEe5Cd5425187BcE97f75C2817E6892")
  
  await casino.deployed();
  await hre.run("verify:verify", {
    address: casino.address,
    constructorArguments: [
      "0xF978bAa68aEe5Cd5425187BcE97f75C2817E6892"
    ],
  });

  // Save copies of each contracts abi and address to the frontend.
  saveFrontendFiles(casino, "Casino");
  console.log( "Token address:",await  casino.getAdress());
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../backend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });