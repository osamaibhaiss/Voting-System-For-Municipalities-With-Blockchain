const { Election } = require("../models/election");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const Web3 = require('web3');
const router = require("express").Router();
const { User } = require("../models/user");
const Infura_url = process.env.Infura;
const ContractAddress = process.env.CONTRACT_ADDRESS;
const ContractABI = require("../contract/ElectionContract.json");
const ElectionABI = require("../contract/Election.json")
const AdminWalletAddress = process.env.address;
const Admin_key = process.env.privateKey;
const web3 = new Web3(Infura_url);


//CREATE Election
router.post("/", isAdmin, async (req, res) => {
  const electionsContract = new web3.eth.Contract(ContractABI, ContractAddress);
  try {
    let electContract = await electionsContract?.methods.CreateElection(
      req.body.ElectionDate,
      req.body.StartTime,
      req.body.EndTime,
      req.body.CityName,
    );
    console.log('ElectionDate:', req.body.ElectionDate);
    console.log('StartTime:', req.body.StartTime);
    console.log('EndTime:', req.body.EndTime);
    const encodedABI = electContract.encodeABI();
    web3.eth.estimateGas({
      from: AdminWalletAddress,
      to: ContractAddress,
      data: encodedABI
    })
      .then(gasEstimate => {
        console.log('Gas estimate:', gasEstimate);
        const transactionAdmin = {
          from: AdminWalletAddress,
          to: ContractAddress,
          gas: gasEstimate,
          data: encodedABI
        };
        web3.eth.accounts.signTransaction(transactionAdmin, Admin_key)
          .then(signedTx => {
            return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
          })
          .then(async (receipt) => {
            console.log('Transaction receipt:', receipt);
            let ElectionAdd = await electionsContract?.methods.ElectionContractAddres().call({ from: AdminWalletAddress });
            console.error('Election Address:', receipt);

            const electInfo = new Election({
              uid: ElectionAdd,
              CityName: req.body.CityName,
              RegisterVotter: 0,
              TotalGroups: 0,
              ElectionDate: req.body.ElectionDate,
              StartTime: req.body.StartTime,
              EndTime: req.body.EndTime,
              winnerGroupId: 0,
              TxHash: receipt.transactionHash,
            });

            const savedinfo = await electInfo.save();
            res.status(200).send(savedinfo);
          })
          .catch(error => {
            console.error('Transaction error:', error);
          });
      })
      .catch(error => {
        console.error('Error estimating gas:', error);
      });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//CREATE Group
router.patch("/creategroup/:id", isAdmin, async (req, res) => {
  const ord = await Election.findById(req.params.id);
  if (!ord) return res.status(404).send("Not found...");
  const electionsContr = new web3.eth.Contract(ElectionABI, ord.uid);
  try {
    let electContract = await electionsContr?.methods.createGroup(
      req.body.Groupid,
      req.body.name,
    );
    const encodedABI = electContract.encodeABI();
    web3.eth.estimateGas({
      from: AdminWalletAddress,
      to: ord.uid,
      data: encodedABI
    })
      .then(gasEstimate => {
        console.log('Gas estimate:', gasEstimate);
        const transactionAdmin = {
          from: AdminWalletAddress,
          to: ord.uid,
          gas: gasEstimate,
          data: encodedABI
        };
        web3.eth.accounts.signTransaction(transactionAdmin, Admin_key)
          .then(signedTx => {
            return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
          })
          .then(async (receipt) => {
            console.log('Transaction receipt:', receipt);
            const updatedord = await Election.findByIdAndUpdate(
              req.params.id,
              {
                $push: {
                  'Groups': {
                    'GroupId': req.body.Groupid,
                    'Name': req.body.name,
                    'TotalVoteCast': 0,
                    'IsWin': false,
                    'TxHash': receipt.transactionHash,
                  }
                }
              },
              {
                new: true,
              }
            );
            res.send(updatedord);
          })
      })
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//updated votters
router.patch("/updatevotters/:id", isAdmin, async (req, res) => {
  const ord = await Election.findById(req.params.id);
  if (!ord) return res.status(404).send("Not found...");
  const electionsContr = new web3.eth.Contract(ElectionABI, ord.uid);
  try {
    let electContract = await electionsContr?.methods.getCastVote(
      req.body.GroupID
    ).call({ from: AdminWalletAddress });
    const updatedord = await Election.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          tokenHolder: {
            TotalVoteCast: electContract,
          }
        }
      }
    );
    res.send(updatedord);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//Register the votters
router.patch("/registervotters/:id", isAdmin, async (req, res) => {
  const ord = await Election.findById(req.params.id);
  if (!ord) return res.status(404).send("Not found...");
  const electionsContr = new web3.eth.Contract(ElectionABI, ord.uid);
  try {
    let electContract = await electionsContr?.methods.RegisterVotters(
      req.body.address
    );
    const encodedABI = electContract.encodeABI();
    web3.eth.estimateGas({
      from: AdminWalletAddress,
      to: ord.uid,
      data: encodedABI
    })
      .then(gasEstimate => {
        console.log('Gas estimate:', gasEstimate);
        const transactionAdmin = {
          from: AdminWalletAddress,
          to: ord.uid,
          gas: gasEstimate,
          data: encodedABI
        };
        web3.eth.accounts.signTransaction(transactionAdmin, Admin_key)
          .then(signedTx => {
            return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
          })
          .then(async (receipt) => {
            console.log('Transaction receipt:', receipt);
            const totalReg = ord.RegisterVotter;
            const updatedord = await Election.findByIdAndUpdate(
              req.params.id,
              {
                RegisterVotter: totalReg + 1,
              }
            );
            res.send(updatedord);
          })
          .catch(error => {
            console.error('Transaction error:', error);
          });
      })
      .catch(error => {
        console.error('Error estimating gas:', error);
      });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//Update Group Number
router.patch("/updategroup/:id", isAdmin, async (req, res) => {
  const ord = await Election.findById(req.params.id);
  if (!ord) return res.status(404).send("Not found...");
  const electionsContr = new web3.eth.Contract(ElectionABI, ord.uid);
  try {
    let count = await electionsContr?.methods.getTotalGroup().call({ from: AdminWalletAddress });
    const updatedord = await Election.findByIdAndUpdate(
      req.params.id,
      {
        TotalGroups: count,
      }
    );
    res.send(updatedord);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.patch("/win/:id", async (req, res) => {
  const ord = await Election.findById(req.params.id);
  if (!ord) return res.status(404).send("Not found...");
  const electionsContr = new web3.eth.Contract(ElectionABI, ord.uid);
  try {
    let check = await electionsContr?.methods.checkWinGroup(
      req.body.GroupID
    ).call({ from: AdminWalletAddress });
    console.log('check:', check);
    let voteCast = await electionsContr?.methods.updateWinGroup(
      req.body.GroupID
    );
    const encodedABI = voteCast.encodeABI();
    web3.eth.estimateGas({
      from: AdminWalletAddress,
      to: ord.uid,
      data: encodedABI
    }).then(gasEstimate => {
      console.log('Gas estimate:', gasEstimate);
      const transactionAdmin = {
        from: AdminWalletAddress,
        to: ord.uid,
        gas: gasEstimate,
        data: encodedABI
      };
      web3.eth.accounts.signTransaction(transactionAdmin, Admin_key)
        .then(signedTx => {
          return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        })
        .then(async (receipt) => {
          console.log('Transaction receipt:', receipt);
          let check = await electionsContr?.methods.checkWinGroup(req.body.GroupID).call({ from: AdminWalletAddress });
          console.log(check)
          const updatedord = await Election.updateOne(
            {
              _id: ord._id,
              "Groups.GroupId": req.body.GroupID
            },
            {
              $set: {
                "Groups.$.IsWin": check
              }

            }
          );
          res.send(updatedord);
        })
    })
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Cast a Vote
router.patch("/votecast/:id", async (req, res) => {
  const ord = await Election.findById(req.params.id);
  if (!ord) return res.status(404).send("Not found...");
  const electionsContr = new web3.eth.Contract(ElectionABI, ord.uid);
  try {
    let voteCast = await electionsContr?.methods.castVote(
      req.body.GroupID,
      req.body.walletAdd,
    );
    const encodedABI = voteCast.encodeABI();
    web3.eth.estimateGas({
      from: AdminWalletAddress,
      to: ord.uid,
      data: encodedABI
    })
      .then(gasEstimate => {
        console.log('Gas estimate:', gasEstimate);
        const transactionAdmin = {
          from: AdminWalletAddress,
          to: ord.uid,
          gas: gasEstimate,
          data: encodedABI
        };
        web3.eth.accounts.signTransaction(transactionAdmin, Admin_key)
          .then(signedTx => {
            return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
          })
          .then(async (receipt) => {
            console.log('Transaction receipt:', receipt);
            let count = await electionsContr?.methods.Groups(
              req.body.GroupID
            ).call({ from: AdminWalletAddress });
            const updatedord = await Election.findByIdAndUpdate(
              req.params.id,
              {
                $set: {
                  tokenHolder: {
                    TotalVoteCast: count,
                  }
                }
              }
            );
            res.send(updatedord);
          })
      })
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//DELETE
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const elections = await Election.findById(req.params.id);
    if (!elections) return res.status(404).send("elections not found...");
    const deletedelections = await Election.findByIdAndDelete(req.params.id);
    res.status(200).send(deletedelections);
  } catch (error) {
    res.status(500).send(error);
  }
});



//GET ALL PRODUCTS

router.get("/", async (req, res) => {
  const qlocation = req.query.location;
  try {
    let products;

    if (qlocation) {
      products = await Election.find({
        location: qlocation,
      }).sort({ _id: -1 });
    } else {
      products = await Election.find().sort({ _id: -1 });
    }

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

//GET Property Details from mongoDB
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Election.findById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});


const FinalResult = require("../models/finalResult");
const calculateSainteLagueSeats = require("../utils/sainteLague");



// Admin input for total seats and calculate results
router.post("/:id/finalize", async (req, res) => {
  const { totalSeats, groupResults } = req.body;

  if (!totalSeats || totalSeats <= 0)
    return res.status(400).send("Total seats must be a positive number.");

  try {
    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).send("Election not found.");

    // Log election data and the group results
    console.log("Election found:", election);
    console.log("Group results:", groupResults);

    // Assuming calculateSainteLagueSeats is a function that calculates the seat allocation for each group
    const seatResults = calculateSainteLagueSeats(election.Groups, totalSeats);

    console.log("Calculated seat results:", seatResults);

    // Save the final results in the database
    const finalResult = new FinalResult({
      electionId: election._id,
      totalSeats,
      groupResults: seatResults,
    });

    await finalResult.save();
    
    res.status(200).send({
      message: "Final results calculated and saved successfully.",
      finalResult,
    });
  } catch (error) {
    console.error("Error finalizing results:", error);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
// backend/routes/elections.js
// Add this route for fetching finalized results
router.get('/results', async (req, res) => {
  try {
    const election = await Election.findOne({ status: 'finalized' });
    res.json(election);
  } catch (err) {
    res.status(500).send('Error fetching results');
  }
});

const express = require("express");


