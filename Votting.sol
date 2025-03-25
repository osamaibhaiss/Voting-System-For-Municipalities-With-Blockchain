// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;


abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor() {
        _transferOwnership(_msgSender());
    }

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {
    /**
     * @dev Multiplies two numbers, throws on overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
        if (a == 0) {
            return 0;
        }
        c = a * b;
        assert(c / a == b);
        return c;
    }

    /**
     * @dev Integer division of two numbers, truncating the quotient.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        // uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return a / b;
    }

    /**
     * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    /**
     * @dev Adds two numbers, throws on overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
        c = a + b;
        assert(c >= a);
        return c;
    }
}


library Validations {
    function revertOnZeroAddress(address _address) internal pure {
        require(address(0) != address(_address), "zero address not accepted!");
    }
}

interface Ivote {

    struct ELectionDetails {
        uint256 RegisterVotter;
        uint256 ElectionDate;
        uint256 StartElection;
        uint256 EndElection;
        uint256 TotalGroups;
        string cityName;
        uint256 winner;
    }

    struct ElectionGroup {
        uint256 id;
        string name;
        uint256 TotalVoteCast;
        bool IsWin;
    }

    struct Status {
        bool Start;
        bool Pause;
        bool End;
    }
function GetAccountant() external view returns (address);
function AccountantAddress(address _address) external;

}

contract Election is Ivote, Ownable {
    using SafeMath for uint256;
    ELectionDetails private ElectionInformation; // create object of Election Info structure
    ElectionGroup private GroupDetails; 
    Status private ElectionStatus;
    address private Accountant;
    mapping(address => bool) public RegisterVoters;
    mapping(address => mapping(uint256 => bool)) public IsVotted;
    mapping (uint256 => ElectionGroup) public Groups;
    address[] public registerAddressesArray;


  constructor(ELectionDetails memory _detail) {
        ElectionInformation = Ivote.ELectionDetails({
            RegisterVotter: _detail.RegisterVotter,
            ElectionDate: _detail.ElectionDate,
            StartElection: _detail.StartElection,
            EndElection: _detail.EndElection,
            TotalGroups: _detail.TotalGroups,
            cityName: _detail.cityName,
            winner: _detail.winner
            });
    }

    function AccountantAddress(address _address) external override {
        Accountant = _address;
    }

    function GetAccountant() external view override returns (address) {
        return Accountant;
    }
 
    function _onlyAdmin() private view {
        require(msg.sender == Accountant);
    }

    modifier onlyAdmin() {
        _onlyAdmin();
        _;
    }
    
    function createGroup(
        uint256 _id,
        string memory _name
    ) external onlyAdmin() {
        require(_id != 0,"should not be zero");
        Groups[ElectionInformation.TotalGroups] = Ivote.ElectionGroup({
            id: _id,
            name: _name,
            TotalVoteCast: 0,
            IsWin: false
        });
        ElectionInformation.TotalGroups ++;
    }

    function getCastVote(uint256 _id) external view returns (uint256) {
        return Groups[_id].TotalVoteCast;
    }

    function getTotalGroup() external view returns (uint256) {
        return ElectionInformation.TotalGroups;
    }
    function checkWinGroup(uint256 _id) external view returns (bool) {
        return Groups[_id].IsWin;
    }

    function updateWinGroup(uint256 _id) external {
         Groups[_id].IsWin = true;
    }

    /**
     * @dev only admin can end the Election
     */
    function EndElection() external onlyAdmin() {
        require(ElectionStatus.Pause == true || ElectionStatus.Start == true);
        ElectionStatus.End = true;
        ElectionStatus.Pause == false;
        ElectionStatus.Pause == false;
    }

    /**
     * @dev only admin can start Election
     */
    function StartElection() external onlyAdmin() {
        require(ElectionStatus.Start == false);
        ElectionStatus.Start = true;
    }

    /**
     * @dev only admin can Pause Election
     */
    function PauseElection() external onlyAdmin() {
        require(ElectionStatus.Pause == false);
        ElectionStatus.Pause = true;
        ElectionStatus.Start = false;
    }

    // check Election Is Paused
    function isPause() external view returns (bool) {
        return (ElectionStatus.Pause == true);
    }

    // check Election Is start or not
    function isStart() external view returns (bool) {
        return (ElectionStatus.Start == true);
    }

    function onZeroAddress(address _address) private pure {
        Validations.revertOnZeroAddress(_address);
    }


    modifier _nonZeroAddress(address _addres) {
        onZeroAddress(_addres);
        _;
    }

    function isRegistered(
        address _address
    ) external view _nonZeroAddress(_address) returns (bool isIt) {
        isIt = RegisterVoters[_address];
    }

    function removeRegisterAddress(address _address) external onlyAdmin() {
        require(RegisterVoters[_address] != false, "Not exit");
        uint256 count = registerAddressesArray.length;
        for (uint256 i = 0; i < count; i++) {
            if (registerAddressesArray[i] == _address) {
                delete registerAddressesArray[i];
                RegisterVoters[_address] = false;
            }
        }
    }

    function RegisterVotters(address _address) external onlyAdmin() returns (bool success){
        Validations.revertOnZeroAddress(_address);
        if (!this.isRegistered(_address))
        RegisterVoters[_address] = true;
        registerAddressesArray.push(_address);
        success = true;
    }

    function castVote(uint256 _groupId, address _add) external {
        require(this.isRegistered(_add) == true,"not Register");
        require (this.isStart() == true, "Election not Started");
        require  (_groupId != 0 , 'should be greater than zero');
         onZeroAddress(_add); // revert if address is not valid
    	 for(uint256 i = 0; i <= ElectionInformation.TotalGroups ;i++) {
            require(!IsVotted[_add][Groups[i].id],"already votted");     
            if (Groups[i].id == _groupId){
               IsVotted[_add][_groupId] = true;
               Groups[i].TotalVoteCast ++;
            }
         }  
    }

}



contract ElectionContract is Ownable {
    mapping(uint256 => address) private ElectionContractAddress;
    Ivote private vote;
    uint256 private TotalElectionCompaign;

    constructor() {}

    receive() external payable {
        revert();
    }


    function CreateElection(
        uint256 _ElectionDate,
        uint256 _StartElection,
        uint256 _EndElection,
        string memory _cityName
    ) external {
        Ivote.ELectionDetails memory model = Ivote.ELectionDetails({
            RegisterVotter: 0,
            ElectionDate: _ElectionDate,
            StartElection: _StartElection,
            EndElection: _EndElection,
            TotalGroups: 0,
            cityName: _cityName,
            winner: 0
        });
        vote = new Election(model);
        ElectionContractAddress[TotalElectionCompaign] = address(vote);
        TotalElectionCompaign++;
        vote.AccountantAddress(_msgSender());
    }
    
  function GetElections() external view returns (address[] memory) {
        address[] memory Array = new address[](TotalElectionCompaign);
        for (uint256 i = 0; i < TotalElectionCompaign; i++) {
            Array[i] = ElectionContractAddress[i];
        }
        return Array;
        }

    function ElectionAdminAddress() external view returns (address) {
        return vote.GetAccountant();
    }

    function ElectionContractAddres() external view returns (address) {
        return address(vote);
    }

    function TotalElectionCompaigns() external view returns (uint256) {
        return TotalElectionCompaign;
    }
}

mapping(address => mapping(uint256 => bool)) public IsVotted;
Group[] public Groups;
uint256 public TotalGroups;

function isRegistered(address _add) public view returns (bool) {
    // Implement registration check logic
}

function isStart() public view returns (bool) {
    // Implement election start check logic
}

function onZeroAddress(address _add) internal pure {
    require(_add != address(0), "Address cannot be zero");
}

function castVote(uint256 _groupId, address _add, uint[2] memory a, 
uint[2][2] memory b, uint[2] memory c, uint[4] memory input) external {
    // Verify the zk-SNARK proof
    require(Verifier.verifyTx(a, b, c, input), " proof");

    require(this.isRegistered(_add), "not Register");
    require(this.isStart(), "Election not Started");
    require(_groupId != 0, "should be greater than zero");
    onZeroAddress(_add); // revert if address is not valid

    for (uint256 i = 0; i < TotalGroups; i++) {
        require(!IsVotted[_add][Groups[i].id], "already votted");
        if (Groups[i].id == _groupId) {
            IsVotted[_add][_groupId] = true;
            Groups[i].TotalVoteCast++;
        }
    }
}