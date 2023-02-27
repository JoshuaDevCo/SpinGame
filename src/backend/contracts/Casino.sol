// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Token.sol";

contract Casino is Ownable{

    event RouletteGame (
        uint NumberWin,
        bool result,
        uint tokensEarned
    );

    ERC20 private token;
    address public tokenAddress;

    IERC20 public ADMC;

    function precioTokens(uint256 _numTokens) public pure returns (uint256){
        return _numTokens * (0.001 ether);
    }

    function tokenBalance(address _of) public view returns (uint256){
        return token.balanceOf(_of);
    }
    constructor(address _admc){
        token =  new ERC20("Casino", "CAS");
        tokenAddress = address(token);
        token.mint(1000000000000000000000000);

        ADMC = IERC20(_admc);
    }

    // Visualizacion del balance de ethers del Smart Contract
    function balanceEthersSC() public view returns (uint256){
        return address(this).balance / 10**18;
    }

    function balanceADMCSC() public view returns (uint256){
        return ADMC.balanceOf(address(this));
    }

    function getAdress() public view returns (address){
        return address(token);
    }

    function compraTokens(uint256 _numTokens) public {
        // Registro del ususario
        // Establecimiento del coste de los tokens a comprar
        // Evaluacion del dinero que el cliente paga por los tokens
        
        // require(msg.value >= precioTokens(_numTokens), "Compra menos tokens o paga con mas ethers");
        uint256 amountADMC = precioTokens(_numTokens);
        require(ADMC.transferFrom(msg.sender, address(this), amountADMC), "Insufficient amount");

        // Creacion de nuevos tokens en caso de que no exista suficiente supply
        if  (token.balanceOf(address(this)) < _numTokens){
            token.mint(_numTokens*100000);
        }
        // Devolucion del dinero sobrante
        // El Smart Contract devuelve la cantidad restante
        // payable(msg.sender).transfer(msg.value - precioTokens(_numTokens));

        // Envio de los tokens al cliente/usuario
        token.transfer(msg.sender, _numTokens);
    }

    // Devolucion de tokens al Smart Contract
    function devolverTokens(uint _numTokens) public {
        // El numero de tokens debe ser mayor a 0
        require(_numTokens > 0, "Necesitas devolver un numero de tokens mayor a 0");
        // El usuario debe acreditar tener los tokens que quiere devolver
        require(_numTokens <= token.balanceOf(msg.sender), "No tienes los tokens que deseas devolver");
        // El usuario transfiere los tokens al Smart Contract
        // token.transfer(msg.sender, address(this), _numTokens);
        // El Smart Contract envia los ethers al usuario
        // payable(msg.sender).transfer(precioTokens(_numTokens)); 
        ADMC.transfer(msg.sender, precioTokens(_numTokens));
    }

    struct Bet {
        uint tokensBet;
        uint tokensEarned;
        string game;
    }

    struct RouleteResult {
        uint NumberWin;
        bool result;
        uint tokensEarned;
    }

    mapping(address => Bet []) historialApuestas;

    function retirarEth(uint _numEther) public payable onlyOwner {
        // El numero de tokens debe ser mayor a 0
        require(_numEther > 0, "Necesitas devolver un numero de tokens mayor a 0");
        // El usuario debe acreditar tener los tokens que quiere devolver
        require(_numEther <= balanceEthersSC(), "No tienes los tokens que deseas devolver");
        // Transfiere los ethers solicitados al owner del smart contract'
        payable(owner()).transfer(_numEther);
    }

    function retirarADMC(uint _amount) public onlyOwner {
        // El numero de tokens debe ser mayor a 0
        require(_amount > 0, "Necesitas devolver un numero de tokens mayor a 0");
        // El usuario debe acreditar tener los tokens que quiere devolver
        require(_amount <= balanceADMCSC(), "No tienes los tokens que deseas devolver");
        // Transfiere los ethers solicitados al owner del smart contract'
        ADMC.transfer(owner(), _amount);
    }

    function tuHistorial(address _propietario) public view returns(Bet [] memory){
        return historialApuestas[_propietario];
    }

    function jugarRuleta(uint _start, uint _end, uint _tokensBet) public{
        require(_tokensBet <= token.balanceOf(msg.sender));
        require(_tokensBet > 0);
        uint random = uint(uint(keccak256(abi.encodePacked(block.timestamp))) % 14);
        uint tokensEarned = 0;
        bool win = false;
        token.transferFrom(msg.sender, address(this), _tokensBet);
        if ((random <= _end) && (random >= _start)) {
            win = true;
            if (random == 0) {
                tokensEarned = _tokensBet*14;
            } else {
                tokensEarned = _tokensBet * 2;
            }
            if  (token.balanceOf(address(this)) < tokensEarned){
            token.mint(tokensEarned*100000);
            }
            token.transfer(msg.sender, tokensEarned);
        }
        addHistorial("Roulete", _tokensBet, tokensEarned, msg.sender);
        emit RouletteGame(random, win, tokensEarned);
    }

    function addHistorial(string memory _game, uint _tokensBet,  uint _tokenEarned, address caller) internal{
        Bet memory apuesta = Bet(_tokensBet, _tokenEarned, _game);
        historialApuestas[caller].push(apuesta);
    }
}
