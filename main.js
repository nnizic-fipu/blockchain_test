// import crypto-js library-a, treba za stvaranje hash-a
const SHA256 = require('crypto-js/sha256')
// kreiranje block-a od kojih će se sastojati blockchain
// klasa Block
class Block {
  // definira što BLock treba imati: redni broj, vrijeme kad
  // je napravljen, vrijednosti i poveznicu sa blockom ispred sebe
  constructor (index, timestamp, data, previousHash = '') {
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.previousHash = previousHash
    // hash - sadrži izračun hash-a za ovaj Block
    this.hash = this.calculateHash()
  }

  // metoda za izračun hash-a za objekt
  calculateHash () {
    // vratit će stringifizar u json data  objekt, pretvoren u string
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString()
  }
}

// klasa Blockchain - spajanje blockova u lanac
class Blockchain {
  constructor () {
    // definiramo kao niz blockova
    // genesis bock - prvi block, stvara se odmoh
    this.chain = [this.createGenesisBlock()]
  }

  // prvi block kreiramo ručno, različit je od ostalih jer se ne vezuje za block ispred
  // nema "previousHash"
  createGenesisBlock () {
    return new Block(0, '25/03/2024', 'Genesis block', '0')
  }

  // metoda za dohvaćanje zadnjeg blocka
  // potrebno za izračun previousHash
  getLatestBlock () {
    return this.chain[this.chain.length - 1]
  }

  // metoda za dodavanje blockova
  // doda previousHash, izračuna hash novog blocka
  // doda novi block u lanac
  addBlock (newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash
    newBlock.hash = newBlock.calculateHash()
    this.chain.push(newBlock)
  }

  // metoda za provjeru ispravnosti blockchaina - vraća true (ispravan) i false (neispravan)
  isChainValid () {
    // petlja za sve blockove osim prvog (genesis block-a)
    // uspoređuje block sa prethodnim blockom
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      // provjera jel izračun hasha blocka jednak njegovu svojstvu hash
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }
      // provjera odgovara li svojstvo previousHash nekog blocka hash-u blocka ispred
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }
    // ako su prošla oba testa, chain je ispravan
    return true
  }
}
// dodvaanje novog Blockchaina i nekoliko blockova
const FIPUcoin = new Blockchain()
FIPUcoin.addBlock(new Block(1, '26/03/2024', { amount: 4 }))
FIPUcoin.addBlock(new Block(2, '27/03/2024', { amount: 10 }))

// stringifizirani ispis
console.log(JSON.stringify(FIPUcoin, null, 4))
// provjera pozivom na metodu provjere ispravnosti
console.log('Is blockchain valid? ' + FIPUcoin.isChainValid())

// testovi pokušaja izmjene podataka u chainu
// naknadno mjenjanje vrijednosti svojstva data
FIPUcoin.chain[1].data = { amount: 100 }
// naknadni izračun hasha nakon promjene vriejdnosti
FIPUcoin.chain[1].hash = FIPUcoin.chain[1].calculateHash()

console.log('Is blockchain valid? ' + FIPUcoin.isChainValid())
